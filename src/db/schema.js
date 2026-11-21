import {
  pgTable,
  pgEnum,
  text,
  integer,
  timestamp,
  jsonb,
  primaryKey,
  serial,
  index,
} from 'drizzle-orm/pg-core';

const id = () => text('id').primaryKey().$defaultFn(() => crypto.randomUUID());
const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

// ---------- Users (profiles; identity lives in Neon Auth's neon_auth schema) ----------

export const users = pgTable('users', {
  id: id(),
  name: text('name'),
  email: text('email').unique(),
  // Neon Auth user id (neon_auth.user.id).
  authUserId: text('auth_user_id').unique(),
  image: text('image'),
  // profile
  handle: text('handle').unique(),
  title: text('title'),
  bio: text('bio'),
  github: text('github'),
  // XP, delivered work and fees are derived from accepted submissions (src/lib/queries.js), never stored.
  createdAt: createdAt(),
});

// ---------- Domain ----------

// AVAILABLE -> IN_PROGRESS (claimed) -> IN_REVIEW (submitted) -> COMPLETED (owner accepted);
// a "changes requested" review sends IN_REVIEW back to IN_PROGRESS.
export const taskStatus = pgEnum('task_status', ['AVAILABLE', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED']);

export const projects = pgTable('projects', {
  id: id(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  leadAi: text('lead_ai').notNull(),
  status: text('status').notNull().default('ACTIVE'),
  ownerId: text('owner_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: createdAt(),
});

export const tasks = pgTable(
  'tasks',
  {
    id: id(),
    projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    category: text('category').notNull(),
    difficulty: text('difficulty').notNull(),
    estimatedHours: text('estimated_hours').notNull(),
    bounty: integer('bounty').notNull(),
    xp: integer('xp').notNull(),
    // BLOCKED is not stored: it is AVAILABLE + any prerequisite not COMPLETED (see lib/queries.js)
    status: taskStatus('status').notNull().default('AVAILABLE'),
    claimedBy: text('claimed_by').references(() => users.id, { onDelete: 'set null' }),
    description: text('description').notNull(),
    deliverables: text('deliverables').array().notNull().default([]),
    acceptanceCriteria: text('acceptance_criteria').array().notNull().default([]),
    createdAt: createdAt(),
  },
  (t) => [index('tasks_project_idx').on(t.projectId)]
);

export const taskPrerequisites = pgTable(
  'task_prerequisites',
  {
    taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
    prerequisiteId: text('prerequisite_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.taskId, t.prerequisiteId] })]
);

export const submissions = pgTable('submissions', {
  taskId: text('task_id').primaryKey().references(() => tasks.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  link: text('link').notNull(),
  notes: text('notes').notNull().default(''),
  // AI review is advice for the owner; null when the AI was unavailable.
  aiReviewScore: integer('ai_review_score'),
  aiFeedback: text('ai_feedback'),
  aiMissing: jsonb('ai_missing').notNull().default([]), // string[]
  aiCriteria: jsonb('ai_criteria').notNull().default([]), // [{ criterion, met, evidence }]
  // The project owner decides: pending -> accepted | changes_requested.
  status: text('status').notNull().default('pending'),
  ownerNote: text('owner_note'),
  attempts: integer('attempts').notNull().default(1),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
});

// One row per Gemini call, for per-user daily limits (see DAILY_LIMITS in src/lib/ai.js).
export const aiCalls = pgTable(
  'ai_calls',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    kind: text('kind').notNull(), // 'plan' | 'review'
    createdAt: createdAt(),
  },
  (t) => [index('ai_calls_user_kind_time_idx').on(t.userId, t.kind, t.createdAt)]
);

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  message: text('message').notNull(),
  actorId: text('actor_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: createdAt(),
});
