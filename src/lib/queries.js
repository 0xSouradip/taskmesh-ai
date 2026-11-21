import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { timeAgo, EVENT_STYLES, levelFromXp } from './format.js';
import { TEAM } from '@/content/team';

// A task is BLOCKED when it is AVAILABLE but has any prerequisite that is not COMPLETED.
export const INCOMPLETE_PREREQ = (taskIdCol) => sql`EXISTS (
  SELECT 1 FROM task_prerequisites tp JOIN tasks pt ON pt.id = tp.prerequisite_id
  WHERE tp.task_id = ${taskIdCol} AND pt.status <> 'COMPLETED')`;

const rows = async (query) => (await db.execute(query)).rows;

// Every number here is derived from accepted work; nothing is stored or seeded.
async function getUsers() {
  return rows(sql`
    SELECT u.id, u.name, u.handle, u.image, u.title, u.bio, u.github, u.email, u.created_at,
      COALESCE(st.delivered, 0)::int AS delivered,
      COALESCE(st.xp, 0)::int AS xp,
      COALESCE(st.fees, 0)::int AS fees,
      COALESCE(st.first_time, 0)::int AS first_time,
      COALESCE(st.categories, '[]'::json) AS categories
    FROM users u
    LEFT JOIN LATERAL (
      SELECT count(*) AS delivered, sum(t.xp) AS xp, sum(t.bounty) AS fees,
        count(*) FILTER (WHERE s.attempts = 1) AS first_time,
        (SELECT json_agg(json_build_object('name', c.category, 'count', c.n) ORDER BY c.n DESC, c.category)
           FROM (SELECT t2.category, count(*) AS n FROM submissions s2 JOIN tasks t2 ON t2.id = s2.task_id
                 WHERE s2.author_id = u.id AND s2.status = 'accepted' GROUP BY t2.category) c) AS categories
      FROM submissions s JOIN tasks t ON t.id = s.task_id
      WHERE s.author_id = u.id AND s.status = 'accepted'
    ) st ON true
    WHERE u.handle IS NOT NULL
    ORDER BY xp DESC, u.created_at`);
}

function toPerson(u) {
  return {
    id: u.id,
    name: u.name,
    handle: u.handle,
    avatar: u.image,
    title: u.title,
    bio: u.bio,
    github: u.github,
    xp: u.xp,
    level: levelFromXp(u.xp),
    delivered: u.delivered,
    feesEarned: u.fees,
    // Share of accepted tasks that needed no changes. Only meaningful with a few data points.
    firstTimeRate: u.delivered >= 3 ? Math.round((u.first_time / u.delivered) * 100) : null,
    topCategories: u.categories ?? [],
  };
}

async function getProjects() {
  const result = await rows(sql`
    SELECT p.*, o.handle AS owner_handle, o.name AS owner_name,
      COALESCE(SUM(t.bounty), 0)::int AS total_budget,
      COALESCE(SUM(t.bounty) FILTER (WHERE t.status = 'COMPLETED'), 0)::int AS accepted_budget,
      COUNT(t.id)::int AS tasks_count,
      (COUNT(t.id) FILTER (WHERE t.status = 'COMPLETED'))::int AS completed_tasks_count
    FROM projects p
    LEFT JOIN users o ON o.id = p.owner_id
    LEFT JOIN tasks t ON t.project_id = p.id
    GROUP BY p.id, o.handle, o.name
    ORDER BY p.created_at DESC`);
  return result.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    ownerHandle: p.owner_handle,
    ownerName: p.owner_name,
    totalBudget: p.total_budget,
    acceptedBudget: p.accepted_budget,
    tasksCount: p.tasks_count,
    completedTasksCount: p.completed_tasks_count,
    status: p.status, // ACTIVE | CLOSED
    createdAt: timeAgo(p.created_at),
  }));
}

async function getTasks(meId) {
  const result = await rows(sql`
    SELECT t.*, p.name AS project_name, p.status AS project_status, p.owner_id,
      o.handle AS owner_handle, o.name AS owner_name, o.email AS owner_email,
      cu.handle AS claimed_by_handle, cu.name AS claimer_name, cu.email AS claimer_email,
      CASE WHEN t.status = 'AVAILABLE' AND ${INCOMPLETE_PREREQ(sql`t.id`)} THEN 'BLOCKED' ELSE t.status::text END AS effective_status,
      COALESCE((SELECT array_agg(prerequisite_id) FROM task_prerequisites WHERE task_id = t.id), '{}') AS prerequisites,
      s.author_id, s.link, s.notes, s.ai_review_score, s.ai_feedback, s.ai_missing, s.ai_criteria,
      s.status AS submission_status, s.owner_note, s.attempts, s.submitted_at, s.reviewed_at,
      su.name AS author_name, su.handle AS author_handle
    FROM tasks t
    JOIN projects p ON p.id = t.project_id
    LEFT JOIN users o ON o.id = p.owner_id
    LEFT JOIN users cu ON cu.id = t.claimed_by
    LEFT JOIN submissions s ON s.task_id = t.id
    LEFT JOIN users su ON su.id = s.author_id
    ORDER BY p.created_at DESC, t.created_at, t.id`);

  return result.map((t) => {
    const isOwner = Boolean(meId) && t.owner_id === meId;
    const isClaimer = Boolean(meId) && t.claimed_by === meId;
    const isAuthor = Boolean(meId) && t.author_id === meId;
    // Accepted work is public proof. A submission still in review, or sent back, is
    // visible only to the project owner and the person who submitted it.
    const showSubmission = t.submitted_at && (t.submission_status === 'accepted' || isOwner || isAuthor);
    // Contact details are private: the owner and the claimer see each other's email, nobody else does.
    const contact = isClaimer
      ? { role: 'Project owner', name: t.owner_name, email: t.owner_email }
      : isOwner && t.claimed_by
        ? { role: 'Specialist', name: t.claimer_name, email: t.claimer_email }
        : null;

    return {
      id: t.id,
      projectId: t.project_id,
      projectName: t.project_name,
      projectClosed: t.project_status === 'CLOSED',
      ownerHandle: t.owner_handle,
      title: t.title,
      category: t.category,
      difficulty: t.difficulty,
      estimatedHours: t.estimated_hours,
      bounty: t.bounty, // the agreed fee, paid by the owner directly
      xp: t.xp,
      status: t.effective_status,
      claimedBy: t.claimed_by_handle,
      prerequisites: t.prerequisites,
      description: t.description,
      deliverables: t.deliverables,
      acceptanceCriteria: t.acceptance_criteria,
      viewer: { isOwner, isClaimer },
      contact,
      submission: showSubmission
        ? {
            status: t.submission_status, // pending | accepted | changes_requested
            submittedAt: timeAgo(t.submitted_at),
            reviewedAt: t.reviewed_at ? timeAgo(t.reviewed_at) : null,
            author: `${t.author_name} (@${t.author_handle})`,
            authorHandle: t.author_handle,
            link: t.link,
            notes: t.notes,
            attempts: t.attempts,
            ownerNote: t.owner_note,
            ai:
              t.ai_review_score === null
                ? null
                : { score: t.ai_review_score, feedback: t.ai_feedback, missing: t.ai_missing ?? [], criteria: t.ai_criteria ?? [] },
          }
        : null,
    };
  });
}

async function getEvents() {
  const result = await rows(sql`SELECT * FROM events ORDER BY created_at DESC, id DESC LIMIT 30`);
  return result.map((e) => ({
    id: e.id,
    type: e.type,
    message: e.message,
    timestamp: timeAgo(e.created_at),
    badge: EVENT_STYLES[e.type]?.badge ?? e.type,
  }));
}

// Everything the client UI renders. `meId` only widens what the signed-in user may see
// about their own tasks (submissions in review, contact details); shared lists stay public.
export async function getAppData(meId) {
  const [users, projects, tasks, aiEvents] = await Promise.all([getUsers(), getProjects(), getTasks(meId), getEvents()]);

  const people = users.map(toPerson);
  // Founders on the static Team page link to their profile once they have signed in.
  // Emails are matched here, on the server; only handles go to the browser.
  const teamEmails = new Set(TEAM.map((m) => m.email));
  const teamHandles = Object.fromEntries(
    users.filter((u) => u.email && teamEmails.has(u.email.toLowerCase())).map((u) => [u.email.toLowerCase(), u.handle])
  );

  return {
    projects,
    tasks,
    freelancers: people,
    aiEvents,
    teamHandles,
    currentUser: people.find((p) => p.id === meId) ?? null,
  };
}
