'use server';

import { revalidatePath } from 'next/cache';
import { sql } from 'drizzle-orm';
import { getCurrentProfile } from './auth/profile.js';
import { db } from '@/db';
import { projects, tasks, taskPrerequisites, events, projectTemplates } from '@/db/schema';
import { INCOMPLETE_PREREQ } from './queries.js';
import * as ai from './ai.js';

const fail = (error) => ({ ok: false, error });

// Signed-in user's profile ({ id, name, handle }) or null.
const requireUser = () => getCurrentProfile();

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const int = (v, min, max, fallback) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const strList = (v, maxItems, maxLen) =>
  (Array.isArray(v) ? v : []).map((s) => str(s, maxLen)).filter(Boolean).slice(0, maxItems);

// ---------- Tasks ----------

export async function claimTask(taskId) {
  const me = await requireUser();
  if (!me) return fail('Sign in to claim tasks.');

  // Single conditional UPDATE: closes the race between two claimers and enforces the dependency lock.
  const { rows } = await db.execute(sql`
    UPDATE tasks SET status = 'IN_PROGRESS', claimed_by = ${me.id}
    WHERE id = ${String(taskId)} AND status = 'AVAILABLE' AND NOT ${INCOMPLETE_PREREQ(sql`tasks.id`)}
    RETURNING title, bounty, xp`);
  const task = rows[0];
  if (!task) return fail('This task is waiting on a dependency or was already claimed.');

  await db.insert(events).values({
    type: 'TASK_CLAIMED',
    message: `Specialist @${me.handle} picked up "${task.title}". Escrow lock established.`,
    actorId: me.id,
  });

  revalidatePath('/', 'layout');
  return { ok: true, title: task.title, bounty: task.bounty, xp: task.xp };
}

export async function submitTask(taskId, { link, notes } = {}) {
  const me = await requireUser();
  if (!me) return fail('Sign in to submit deliverables.');

  const cleanLink = str(link, 500);
  let url;
  try {
    url = new URL(cleanLink);
  } catch {
    return fail('Provide a valid deliverable URL.');
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return fail('Deliverable link must be http(s).');
  const cleanNotes = str(notes, 2000);

  const result = await db.transaction(async (tx) => {
    const { rows } = await tx.execute(sql`
      UPDATE tasks SET status = 'COMPLETED'
      WHERE id = ${String(taskId)} AND claimed_by = ${me.id} AND status = 'IN_PROGRESS'
      RETURNING id, title, bounty, xp`);
    const task = rows[0];
    if (!task) return null;

    const { score, feedback } = ai.verify(task, { link: cleanLink, notes: cleanNotes });

    await tx.execute(sql`
      INSERT INTO submissions (task_id, author_id, link, notes, ai_review_score, ai_feedback)
      VALUES (${task.id}, ${me.id}, ${cleanLink}, ${cleanNotes}, ${score}, ${feedback})`);
    await tx.execute(sql`
      UPDATE users SET xp = xp + ${task.xp}, bounties_earned = bounties_earned + ${task.bounty},
        tasks_completed = tasks_completed + 1
      WHERE id = ${me.id}`);

    // Downstream tasks whose last missing prerequisite was this one are now unlocked.
    const { rows: unlocked } = await tx.execute(sql`
      SELECT t.title FROM tasks t JOIN task_prerequisites tp ON tp.task_id = t.id
      WHERE tp.prerequisite_id = ${task.id} AND t.status = 'AVAILABLE' AND NOT ${INCOMPLETE_PREREQ(sql`t.id`)}`);

    await tx.insert(events).values([
      {
        type: 'TASK_VERIFIED',
        message: `AI Verifier: Task "${task.title}" verified for @${me.handle} with ${score}/100 score.`,
        actorId: me.id,
      },
      {
        type: 'BOUNTY_PAID',
        message: `Instant Escrow Release: $${task.bounty} USDC + ${task.xp} XP routed directly to @${me.handle}.`,
        actorId: me.id,
      },
      ...unlocked.map((t) => ({
        type: 'PREREQUISITE_UNLOCKED',
        message: `Unlocked: "${t.title}" is now open.`,
      })),
    ]);

    return { ok: true, score, feedback, bounty: task.bounty, xp: task.xp, unlockedCount: unlocked.length };
  });

  if (!result) return fail('You can only submit tasks you have claimed and not yet completed.');
  revalidatePath('/', 'layout');
  return result;
}

export async function decomposeProject({ title } = {}) {
  const cleanTitle = str(title, 200);
  if (!cleanTitle) return fail('Provide a project title.');
  const [template] = await db
    .select()
    .from(projectTemplates)
    .where(sql`lower(${projectTemplates.title}) = lower(${cleanTitle})`);
  return { ok: true, tasks: ai.decompose(cleanTitle, template) };
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
  // Linear chain: each task depends on the previous one (same behaviour as before).
  const rows = taskInputs.map((t, i) => ({
    id: crypto.randomUUID(),
    projectId,
    title: str(t.title, 200) || `Task ${i + 1}`,
    category: str(t.category, 50) || 'Frontend',
    difficulty: str(t.difficulty, 50) || 'Intermediate',
    estimatedHours: str(t.estimatedHours, 30) || '2 - 3 hrs',
    bounty: int(t.bounty, 50, 5000, 200),
    xp: int(t.xp, 0, 5000, 500),
    description: str(t.description, 2000) || `Execute modular deliverable for ${name}: ${str(t.title, 200)}`,
    deliverables: strList(t.deliverables, 10, 300).length
      ? strList(t.deliverables, 10, 300)
      : ['Modular code or design file complying with acceptance tests'],
    acceptanceCriteria: strList(t.acceptanceCriteria, 10, 300).length
      ? strList(t.acceptanceCriteria, 10, 300)
      : ['Strict schema and design token validation', 'Passes automated lint and edge-case execution'],
    createdAt: new Date(base + i), // keeps display order stable
  }));

  await db.transaction(async (tx) => {
    await tx.insert(projects).values({
      id: projectId,
      name,
      category: str(projectInput.category, 100) || 'Product Development',
      description,
      leadAi: 'Autonomous Swarm Orchestrator v4.0',
      ownerId: me.id,
    });
    await tx.insert(tasks).values(rows);
    if (rows.length > 1) {
      await tx
        .insert(taskPrerequisites)
        .values(rows.slice(1).map((t, i) => ({ taskId: t.id, prerequisiteId: rows[i].id })));
    }
    await tx.insert(events).values({
      type: 'PROJECT_DECOMPOSED',
      message: `AI Engine decomposed "${name}" into ${rows.length} micro-tasks with live dependency graph.`,
      actorId: me.id,
    });
  });

  revalidatePath('/', 'layout');
  return { ok: true, projectId, name, tasksCount: rows.length };
}

// ---------- Profile ----------

export async function updateProfile({ title, bio } = {}) {
  const me = await requireUser();
  if (!me) return fail('Sign in to edit your profile.');
  await db.execute(sql`UPDATE users SET title = ${str(title, 80) || null}, bio = ${str(bio, 600) || null} WHERE id = ${me.id}`);
  revalidatePath('/', 'layout');
  return { ok: true };
}
