// Usage: npm run db:migrate && npm run db:clear-demo   (migration 0005 already drops the demo templates)
// Removes the demo rows the old seed script created (fixed ids), leaving real users and their work alone.
// Runs in one transaction and prints what it deleted. Safe to run more than once.
for (const f of ['.env.local', '.env']) { try { process.loadEnvFile(f); } catch {} }

const { Pool } = await import('@neondatabase/serverless');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();

const SEED_USERS = ['user-0', 'user-angshu', 'user-sneha', 'user-1', 'user-2', 'user-3'];
const SEED_PROJECTS = ['proj-1', 'proj-2', 'proj-3'];

const count = async (q, p) => (await client.query(q, p)).rowCount;
try {
  await client.query('BEGIN');
  // Tasks, prerequisites and submissions cascade from projects.
  const projects = await count('DELETE FROM projects WHERE id = ANY($1)', [SEED_PROJECTS]);
  // Seed events: by a seed user, or actor-less ones from before the first real sign-in
  // (later actor-less events, like "task unlocked", are real).
  const events = await count(
    `DELETE FROM events WHERE actor_id = ANY($1)
       OR (actor_id IS NULL AND created_at < COALESCE((SELECT min(created_at) FROM users WHERE auth_user_id IS NOT NULL), now()))`,
    [SEED_USERS]
  );
  // Only seed users nobody has signed in as (a claimed profile keeps its row).
  const users = await count('DELETE FROM users WHERE id = ANY($1) AND auth_user_id IS NULL', [SEED_USERS]);
  await client.query('COMMIT');
  console.log('Removed demo data:', { projects, events, users });
} catch (e) {
  await client.query('ROLLBACK');
  console.error('Nothing removed:', e.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
