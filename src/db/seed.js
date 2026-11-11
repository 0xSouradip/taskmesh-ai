// Usage: npm run db:seed  — wipes domain + auth tables and loads src/db/seed-data.js.
// Same precedence as Next.js: .env.local overrides .env
for (const f of ['.env.local', '.env']) { try { process.loadEnvFile(f); } catch {} }

const { sql } = await import('drizzle-orm');
const { db } = await import('./index.js');
const s = await import('./schema.js');
const data = await import('./seed-data.js');

const { hashPassword } = await import('../lib/password.js');
const seedPasswordHash = process.env.SEED_PASSWORD ? await hashPassword(process.env.SEED_PASSWORD) : null;

const teamByHandle = Object.fromEntries(data.coreTeam.map((m, order) => [m.handle, { ...m, order }]));
const userIdByHandle = Object.fromEntries(data.sampleFreelancers.map((f) => [f.handle, f.id]));
const projectById = Object.fromEntries(data.initialProjects.map((p) => [p.id, p]));

await db.transaction(async (tx) => {
  await tx.execute(sql`TRUNCATE events, submissions, task_prerequisites, tasks, projects,
    project_templates, sessions, users RESTART IDENTITY CASCADE`);

  await tx.insert(s.users).values(
    data.sampleFreelancers.map((f) => {
      const m = teamByHandle[f.handle];
      return {
        id: f.id,
        name: f.name,
        email: f.email ?? null,
        passwordHash: f.email ? seedPasswordHash : null,
        image: f.avatar,
        handle: f.handle,
        title: f.title,
        bio: f.bio,
        github: m?.github ?? null,
        xp: f.xp,
        bountiesEarned: f.bountiesEarned,
        tasksCompleted: f.tasksCompleted,
        acceptanceRate: f.acceptanceRate,
        speedRating: f.speedRating,
        isFoundingTeam: f.isFoundingTeam,
        skills: f.skills,
        badges: f.badges,
        team: m
          ? { role: m.role, tagline: m.tagline, bio: m.bio, skills: m.skills, badge: m.badge, order: m.order }
          : null,
      };
    })
  );

  await tx.insert(s.projects).values(
    data.initialProjects.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      leadAi: p.leadAI,
      status: p.status,
      createdAt: p.createdAt,
    }))
  );

  await tx.insert(s.tasks).values(
    data.initialTasks.map((t, i) => ({
      id: t.id,
      projectId: t.projectId,
      title: t.title,
      category: t.category,
      difficulty: t.difficulty,
      estimatedHours: t.estimatedHours,
      bounty: t.bounty,
      xp: t.xp,
      status: t.status === 'BLOCKED' ? 'AVAILABLE' : t.status, // BLOCKED is derived
      claimedBy: t.claimedBy ? userIdByHandle[t.claimedBy] : null,
      description: t.description,
      deliverables: t.deliverables,
      acceptanceCriteria: t.acceptanceCriteria,
      createdAt: new Date(projectById[t.projectId].createdAt.getTime() + i),
    }))
  );

  await tx.insert(s.taskPrerequisites).values(
    data.initialTasks.flatMap((t) => t.prerequisites.map((p) => ({ taskId: t.id, prerequisiteId: p })))
  );

  await tx.insert(s.submissions).values(
    data.initialTasks
      .filter((t) => t.submission)
      .map((t) => ({
        taskId: t.id,
        authorId: userIdByHandle[t.claimedBy],
        link: t.submission.link,
        notes: t.submission.notes,
        aiReviewScore: t.submission.aiReviewScore,
        aiFeedback: t.submission.aiFeedback,
        submittedAt: t.submission.submittedAt,
      }))
  );

  await tx.insert(s.events).values(
    [...data.initialAIEvents].reverse().map((e) => ({ type: e.type, message: e.message, createdAt: e.createdAt }))
  );

  await tx.insert(s.projectTemplates).values(data.projectTemplates);
});

console.log('Seeded:', {
  users: data.sampleFreelancers.length,
  projects: data.initialProjects.length,
  tasks: data.initialTasks.length,
  templates: data.projectTemplates.length,
});
process.exit(0);
