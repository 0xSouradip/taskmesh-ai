// Usage: npm run db:reset — DROPS every table in the database (public + drizzle schemas).
// Run db:migrate and db:seed afterwards. Dev only.
for (const f of ['.env.local', '.env']) { try { process.loadEnvFile(f); } catch {} }

const { Pool } = await import('@neondatabase/serverless');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
await pool.query('DROP SCHEMA IF EXISTS drizzle CASCADE; DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
await pool.end();
console.log('Database reset.');
