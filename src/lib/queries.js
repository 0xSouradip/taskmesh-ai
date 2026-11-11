import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { timeAgo, EVENT_STYLES, levelFromXp } from './format.js';

// A task is BLOCKED when it is AVAILABLE but has any prerequisite that is not COMPLETED.
export const INCOMPLETE_PREREQ = (taskIdCol) => sql`EXISTS (
  SELECT 1 FROM task_prerequisites tp JOIN tasks pt ON pt.id = tp.prerequisite_id
  WHERE tp.task_id = ${taskIdCol} AND pt.status <> 'COMPLETED')`;

const rows = async (query) => (await db.execute(query)).rows;

function toFreelancer(u) {
  return {
    id: u.id,
    name: u.name,
    handle: u.handle,
    avatar: u.image,
    title: u.title,
    email: u.email,
    bio: u.bio,
    xp: u.xp,
    level: levelFromXp(u.xp),
    bountiesEarned: u.bounties_earned,
    tasksCompleted: u.tasks_completed,
    acceptanceRate: u.acceptance_rate,
    speedRating: u.speed_rating,
    isFoundingTeam: u.is_founding_team,
    skills: u.skills,
    badges: u.badges,
  };
}

async function getUsers() {
  return rows(sql`SELECT * FROM users WHERE handle IS NOT NULL ORDER BY xp DESC`);
}

async function getProjects() {
  const result = await rows(sql`
    SELECT p.*,
      COALESCE(SUM(t.bounty), 0)::int AS total_budget,
      COALESCE(SUM(t.bounty) FILTER (WHERE t.status = 'COMPLETED'), 0)::int AS paid_budget,
      COUNT(t.id)::int AS tasks_count,
      (COUNT(t.id) FILTER (WHERE t.status = 'COMPLETED'))::int AS completed_tasks_count
    FROM projects p LEFT JOIN tasks t ON t.project_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC`);
  return result.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    totalBudget: p.total_budget,
    paidBudget: p.paid_budget,
    tasksCount: p.tasks_count,
    completedTasksCount: p.completed_tasks_count,
    leadAI: p.lead_ai,
    status: p.status,
    createdAt: timeAgo(p.created_at),
  }));
}

async function getTasks() {
  const result = await rows(sql`
    SELECT t.*, p.name AS project_name, cu.handle AS claimed_by_handle,
      CASE WHEN t.status = 'AVAILABLE' AND ${INCOMPLETE_PREREQ(sql`t.id`)} THEN 'BLOCKED' ELSE t.status::text END AS effective_status,
      COALESCE((SELECT array_agg(prerequisite_id) FROM task_prerequisites WHERE task_id = t.id), '{}') AS prerequisites,
      s.link, s.notes, s.ai_review_score, s.ai_feedback, s.submitted_at,
      su.name AS author_name, su.handle AS author_handle
    FROM tasks t
    JOIN projects p ON p.id = t.project_id
    LEFT JOIN users cu ON cu.id = t.claimed_by
    LEFT JOIN submissions s ON s.task_id = t.id
    LEFT JOIN users su ON su.id = s.author_id
    ORDER BY p.created_at DESC, t.created_at, t.id`);
  return result.map((t) => ({
    id: t.id,
    projectId: t.project_id,
    projectName: t.project_name,
    title: t.title,
    category: t.category,
    difficulty: t.difficulty,
    estimatedHours: t.estimated_hours,
    bounty: t.bounty,
    xp: t.xp,
    status: t.effective_status,
    claimedBy: t.claimed_by_handle,
    prerequisites: t.prerequisites,
    description: t.description,
    deliverables: t.deliverables,
    acceptanceCriteria: t.acceptance_criteria,
    submission: t.submitted_at
      ? {
          submittedAt: timeAgo(t.submitted_at),
          author: `${t.author_name} (@${t.author_handle})`,
          link: t.link,
          notes: t.notes,
          aiReviewScore: t.ai_review_score,
          aiFeedback: t.ai_feedback,
        }
      : null,
  }));
}

async function getEvents() {
  const result = await rows(sql`SELECT * FROM events ORDER BY created_at DESC, id DESC LIMIT 20`);
  return result.map((e) => ({
    id: e.id,
    type: e.type,
    message: e.message,
    timestamp: timeAgo(e.created_at),
    badge: EVENT_STYLES[e.type]?.badge ?? e.type,
    badgeColor: EVENT_STYLES[e.type]?.color ?? 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  }));
}

async function getTemplates() {
  return rows(sql`SELECT title, category, description, tasks FROM project_templates ORDER BY id`);
}

// Everything the client UI renders, in the shapes the components already use.
export async function getAppData(currentUserId) {
  const [users, projects, tasks, aiEvents, projectTemplates] = await Promise.all([
    getUsers(),
    getProjects(),
    getTasks(),
    getEvents(),
    getTemplates(),
  ]);

  const freelancers = users.map(toFreelancer);
  const coreTeam = users
    .filter((u) => u.is_founding_team && u.team)
    .sort((a, b) => a.team.order - b.team.order)
    .map((u) => ({
      id: u.id,
      name: u.name,
      role: u.team.role,
      tagline: u.team.tagline,
      bio: u.team.bio,
      image: u.image,
      handle: u.handle,
      github: u.github,
      email: u.email,
      skills: u.team.skills,
      badge: u.team.badge,
      contributionsCount: u.tasks_completed,
    }));

  return {
    projects,
    tasks,
    freelancers,
    coreTeam,
    aiEvents,
    projectTemplates,
    currentUser: freelancers.find((f) => f.id === currentUserId) ?? null,
  };
}
