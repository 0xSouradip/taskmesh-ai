import {
  pgTable,
  pgEnum,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
  serial,
  index,
} from 'drizzle-orm/pg-core';

const id = () => text('id').primaryKey().$defaultFn(() => crypto.randomUUID());
const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

// ---------- Users + auth ----------

export const users = pgTable('users', {
  id: id(),
  name: text('name'),
  email: text('email').unique(),
  passwordHash: text('password_hash'), // scrypt "salt:hash" (hex); null = profile without login (seed data)
  image: text('image'),
  // profile
  handle: text('handle').unique(),
  title: text('title'),
  bio: text('bio'),
  github: text('github'),
  xp: integer('xp').notNull().default(0),
  bountiesEarned: integer('bounties_earned').notNull().default(0),
  tasksCompleted: integer('tasks_completed').notNull().default(0),
  acceptanceRate: integer('acceptance_rate').notNull().default(100),
  speedRating: text('speed_rating'),
  isFoundingTeam: boolean('is_founding_team').notNull().default(false),
  // { role, tagline, bio, skills: string[], badge, order } — only for founding team cards
  team: jsonb('team'),
  skills: jsonb('skills').notNull().default([]), // [{ name, level }]
  badges: jsonb('badges').notNull().default([]), // [{ id, name, description, icon }]
  createdAt: createdAt(),
});

// session_token stores sha256(cookie token), so a DB leak doesn't leak live sessions.
export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

// ---------- Domain ----------

export const taskStatus = pgEnum('task_status', ['AVAILABLE', 'IN_PROGRESS', 'COMPLETED']);

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
  aiReviewScore: integer('ai_review_score').notNull(),
  aiFeedback: text('ai_feedback').notNull(),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  message: text('message').notNull(),
  actorId: text('actor_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: createdAt(),
});

export const projectTemplates = pgTable('project_templates', {
  id: serial('id').primaryKey(),
  title: text('title').notNull().unique(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  tasks: jsonb('tasks').notNull(), // [{ title, category, difficulty, estimatedHours, bounty, xp, deliverables }]
});
