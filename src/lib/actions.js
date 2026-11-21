'use server';

import { revalidatePath } from 'next/cache';
import { sql } from 'drizzle-orm';
import { getCurrentProfile } from './auth/profile.js';
import { db } from '@/db';
import { projects, tasks, taskPrerequisites, events } from '@/db/schema';
import { INCOMPLETE_PREREQ } from './queries.js';
import * as ai from './ai.js';
import { normalizePlan } from './dag.js';
import { str } from './sanitize.js';

const fail = (error) => ({ ok: false, error });

// Signed-in user's profile ({ id, name, handle }) or null.
const requireUser = () => getCurrentProfile();

// Per-user daily cap on Gemini calls. Records the call when allowed.
// ponytail: count-then-insert is not atomic, so two parallel requests can each pass at the limit; fine for a soft cost cap.
async function takeAiQuota(userId, kind) {
  const { rows } = await db.execute(sql`
    SELECT count(*)::int AS n FROM ai_calls
    WHERE user_id = ${userId} AND kind = ${kind} AND created_at > now() - interval '24 hours'`);
  if (rows[0].n >= ai.DAILY_LIMITS[kind]) return false;
  await db.execute(sql`INSERT INTO ai_calls (user_id, kind) VALUES (${userId}, ${kind})`);
  return true;
}

// ---------- Tasks ----------

const MAX_ACTIVE_CLAIMS = 3;

export async function claimTask(taskId) {
  const me = await requireUser();
  if (!me) return fail('Sign in to claim tasks.');

  const { rows: active } = await db.execute(sql`
    SELECT count(*)::int AS n FROM tasks WHERE claimed_by = ${me.id} AND status IN ('IN_PROGRESS', 'IN_REVIEW')`);
  if (active[0].n >= MAX_ACTIVE_CLAIMS) return fail(`You can work on ${MAX_ACTIVE_CLAIMS} tasks at a time. Finish or release one first.`);

  // Single conditional UPDATE: closes the race between two claimers, enforces the dependency
  // lock, keeps owners off their own tasks, and refuses closed projects.
  const { rows } = await db.execute(sql`
    UPDATE tasks SET status = 'IN_PROGRESS', claimed_by = ${me.id}
    FROM projects p
    WHERE tasks.id = ${String(taskId)} AND p.id = tasks.project_id
      AND tasks.status = 'AVAILABLE' AND p.status = 'ACTIVE'
      AND p.owner_id IS DISTINCT FROM ${me.id}
      AND NOT ${INCOMPLETE_PREREQ(sql`tasks.id`)}
    RETURNING tasks.title, tasks.bounty, tasks.xp`);
  const task = rows[0];
  if (!task) {
    const { rows: own } = await db.execute(sql`
      SELECT 1 FROM tasks t JOIN projects p ON p.id = t.project_id WHERE t.id = ${String(taskId)} AND p.owner_id = ${me.id}`);
    return fail(own[0] ? 'You can’t claim a task in your own project.' : 'This task is waiting on a dependency, closed, or already claimed.');
  }

  await db.insert(events).values({ type: 'TASK_CLAIMED', message: `@${me.handle} picked up "${task.title}".`, actorId: me.id });
  revalidatePath('/', 'layout');
  return { ok: true, title: task.title, bounty: task.bounty, xp: task.xp };
}

// The claimer gives a task back, or the project owner takes it away from an inactive claimer.
export async function releaseTask(taskId) {
  const me = await requireUser();
  if (!me) return fail('Sign in first.');
  const { rows } = await db.execute(sql`
    UPDATE tasks SET status = 'AVAILABLE', claimed_by = NULL
    FROM projects p
    WHERE tasks.id = ${String(taskId)} AND p.id = tasks.project_id AND tasks.status = 'IN_PROGRESS'
      AND (tasks.claimed_by = ${me.id} OR p.owner_id = ${me.id})
    RETURNING tasks.title`);
  if (!rows[0]) return fail('Only the person working on this task, or the project owner, can release it (and not while it is in review).');
  await db.execute(sql`DELETE FROM submissions WHERE task_id = ${String(taskId)} AND status <> 'accepted'`);
  await db.insert(events).values({ type: 'TASK_RELEASED', message: `"${rows[0].title}" is open again.`, actorId: me.id });
  revalidatePath('/', 'layout');
  return { ok: true };
}

// The specialist submits work. The AI review is advice for the owner; the task waits in review.
export async function submitTask(taskId, { link, notes } = {}) {
  const me = await requireUser();
  if (!me) return fail('Sign in to submit work.');

  const cleanLink = str(link, 500);
  let url;
  try {
    url = new URL(cleanLink);
  } catch {
    return fail('Provide a valid link to your work.');
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return fail('The link must start with http:// or https://.');
  const cleanNotes = str(notes, 2000);

  const { rows: found } = await db.execute(sql`
    SELECT id, title, description, deliverables, acceptance_criteria FROM tasks
    WHERE id = ${String(taskId)} AND claimed_by = ${me.id} AND status = 'IN_PROGRESS'`);
  const task = found[0];
  if (!task) return fail('You can only submit tasks you are working on.');

  // Advisory AI review, outside any transaction (it can take a minute). Failure never blocks a submission.
  let review = null;
  let aiNote = null;
  if (!ai.aiConfigured()) aiNote = 'AI review is not set up on this server.';
  else if (!(await takeAiQuota(me.id, 'review'))) aiNote = 'Daily AI review limit reached; the owner will review it directly.';
  else {
    try {
      review = await ai.verify({ task, link: cleanLink, notes: cleanNotes });
    } catch (e) {
      if (!(e instanceof ai.AiError)) console.error('[submitTask] AI review failed:', e);
      aiNote = e instanceof ai.AiError ? e.message : 'AI review failed.';
    }
  }

  const result = await db.transaction(async (tx) => {
    // Re-check: the task may have been released while the review ran.
    const { rows } = await tx.execute(sql`
      UPDATE tasks SET status = 'IN_REVIEW'
      WHERE id = ${task.id} AND claimed_by = ${me.id} AND status = 'IN_PROGRESS'
      RETURNING id, title`);
    const t = rows[0];
    if (!t) return null;

    await tx.execute(sql`
      INSERT INTO submissions (task_id, author_id, link, notes, ai_review_score, ai_feedback, ai_missing, ai_criteria, status, owner_note, attempts, submitted_at, reviewed_at)
      VALUES (${t.id}, ${me.id}, ${cleanLink}, ${cleanNotes}, ${review?.score ?? null}, ${review?.feedback ?? null},
        ${JSON.stringify(review?.missing ?? [])}::jsonb, ${JSON.stringify(review?.criteria ?? [])}::jsonb, 'pending', NULL, 1, now(), NULL)
      ON CONFLICT (task_id) DO UPDATE SET author_id = EXCLUDED.author_id, link = EXCLUDED.link, notes = EXCLUDED.notes,
        ai_review_score = EXCLUDED.ai_review_score, ai_feedback = EXCLUDED.ai_feedback, ai_missing = EXCLUDED.ai_missing,
        ai_criteria = EXCLUDED.ai_criteria, status = 'pending', submitted_at = now(), reviewed_at = NULL,
        attempts = submissions.attempts + CASE WHEN submissions.status = 'changes_requested' THEN 1 ELSE 0 END`);

    await tx.insert(events).values({ type: 'TASK_SUBMITTED', message: `@${me.handle} submitted "${t.title}" for review.`, actorId: me.id });
    return { ok: true, title: t.title, ai: review ? { score: review.score, feedback: review.feedback, missing: review.missing } : null, aiNote };
  });

  if (!result) return fail('This task changed while it was being reviewed. Refresh and try again.');
  revalidatePath('/', 'layout');
  return result;
}

// The project owner decides. Accept completes the task (and unlocks dependents);
// request changes sends it back to the specialist with a note.
export async function reviewSubmission(taskId, { decision, note } = {}) {
  const me = await requireUser();
  if (!me) return fail('Sign in first.');
  if (decision !== 'accept' && decision !== 'changes') return fail('Unknown decision.');
  const cleanNote = str(note, 1000);
  if (decision === 'changes' && cleanNote.length < 5) return fail('Tell the specialist what to change.');

  const result = await db.transaction(async (tx) => {
    const { rows } = await tx.execute(sql`
      UPDATE tasks SET status = ${decision === 'accept' ? 'COMPLETED' : 'IN_PROGRESS'}
      FROM projects p
      WHERE tasks.id = ${String(taskId)} AND p.id = tasks.project_id AND p.owner_id = ${me.id} AND tasks.status = 'IN_REVIEW'
      RETURNING tasks.id, tasks.title, tasks.xp, tasks.claimed_by`);
    const t = rows[0];
    if (!t) return null;

    const { rows: by } = await tx.execute(sql`
      UPDATE submissions SET status = ${decision === 'accept' ? 'accepted' : 'changes_requested'},
        owner_note = ${cleanNote || null}, reviewed_at = now()
      WHERE task_id = ${t.id}
      RETURNING (SELECT handle FROM users WHERE id = submissions.author_id) AS handle`);
    const handle = by[0]?.handle ?? 'specialist';

    if (decision === 'changes') {
      await tx.insert(events).values({ type: 'CHANGES_REQUESTED', message: `Changes requested on "${t.title}".`, actorId: me.id });
      return { ok: true, decision, unlockedCount: 0 };
    }

    // Dependents whose last missing prerequisite was this task are now open.
    const { rows: unlocked } = await tx.execute(sql`
      SELECT t.title FROM tasks t JOIN task_prerequisites tp ON tp.task_id = t.id
      WHERE tp.prerequisite_id = ${t.id} AND t.status = 'AVAILABLE' AND NOT ${INCOMPLETE_PREREQ(sql`t.id`)}`);
    await tx.insert(events).values([
      { type: 'TASK_ACCEPTED', message: `"${t.title}" by @${handle} was accepted (+${t.xp} XP).`, actorId: me.id },
      ...unlocked.map((u) => ({ type: 'PREREQUISITE_UNLOCKED', message: `"${u.title}" is now open.` })),
    ]);
    return { ok: true, decision, unlockedCount: unlocked.length };
  });

  if (!result) return fail('Only the project owner can review this, and only while it is in review.');
  revalidatePath('/', 'layout');
  return result;
}

export async function decomposeProject({ title, description, category } = {}) {
  const me = await requireUser();
  if (!me) return fail('Sign in to plan a project.');
  const cleanTitle = str(title, 200);
  const cleanDescription = str(description, 4000);
  if (!cleanTitle || cleanDescription.length < 20) return fail('Give the project a name and a brief of at least a sentence or two.');
  if (!ai.aiConfigured()) return fail('AI planning is not configured on this server.');
  if (!(await takeAiQuota(me.id, 'plan'))) return fail(`Daily planning limit reached (${ai.DAILY_LIMITS.plan}). Try again tomorrow.`);

  try {
    const tasks = await ai.decompose({ title: cleanTitle, description: cleanDescription, category: str(category, 100) });
    return { ok: true, tasks };
  } catch (e) {
    if (e instanceof ai.AiError) return fail(e.message);
    throw e;
  }
}

export async function publishProject(projectInput = {}, taskInputs = []) {
  const me = await requireUser();
  if (!me) return fail('Sign in to publish projects.');

  const name = str(projectInput.title, 200);
  const description = str(projectInput.description, 2000);
  if (!name || !description) return fail('Project title and description are required.');
  if (!Array.isArray(taskInputs) || taskInputs.length === 0) return fail('Add at least one task.');
  if (taskInputs.length > 20) return fail('A project can have at most 20 tasks.');

  const projectId = crypto.randomUUID();
  const base = Date.now();
  // The plan came back from the browser: clamp every field and rebuild a valid DAG.
  const plan = normalizePlan(taskInputs.map(ai.cleanTask));
  const rows = plan.map((t, i) => ({
    id: crypto.randomUUID(),
    projectId,
    title: t.title,
    category: t.category,
    difficulty: t.difficulty,
    estimatedHours: t.estimatedHours,
    bounty: t.bounty,
    xp: t.xp,
    description: t.description || `Deliver "${t.title}" for ${name}.`,
    deliverables: t.deliverables,
    acceptanceCriteria: t.acceptanceCriteria,
    createdAt: new Date(base + i), // keeps display order stable (topological)
  }));
  const edges = plan.flatMap((t, i) => t.dependsOn.map((d) => ({ taskId: rows[i].id, prerequisiteId: rows[d].id })));

  await db.transaction(async (tx) => {
    await tx.insert(projects).values({
      id: projectId,
      name,
      category: str(projectInput.category, 100) || 'Product Development',
      description,
      leadAi: `Gemini (${ai.modelName()})`,
      ownerId: me.id,
    });
    await tx.insert(tasks).values(rows);
    if (edges.length) await tx.insert(taskPrerequisites).values(edges);
    await tx.insert(events).values({
      type: 'PROJECT_DECOMPOSED',
      message: `@${me.handle} posted "${name}" with ${rows.length} tasks.`,
      actorId: me.id,
    });
  });

  revalidatePath('/', 'layout');
  return { ok: true, projectId, name, tasksCount: rows.length };
}

// Owner stops a project: open tasks leave the board, finished work stays visible.
export async function closeProject(projectId) {
  const me = await requireUser();
  if (!me) return fail('Sign in first.');
  const { rows } = await db.execute(sql`
    UPDATE projects SET status = 'CLOSED' WHERE id = ${String(projectId)} AND owner_id = ${me.id} AND status = 'ACTIVE'
    RETURNING name`);
  if (!rows[0]) return fail('Only the owner can close an active project.');
  await db.insert(events).values({ type: 'PROJECT_CLOSED', message: `"${rows[0].name}" was closed by its owner.`, actorId: me.id });
  revalidatePath('/', 'layout');
  return { ok: true };
}

// ---------- Profile ----------

export async function updateProfile({ title, bio } = {}) {
  const me = await requireUser();
  if (!me) return fail('Sign in to edit your profile.');
  await db.execute(sql`UPDATE users SET title = ${str(title, 80) || null}, bio = ${str(bio, 600) || null} WHERE id = ${me.id}`);
  revalidatePath('/', 'layout');
  return { ok: true };
}
