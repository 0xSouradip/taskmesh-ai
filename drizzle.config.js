import { defineConfig } from 'drizzle-kit';

// Same precedence as Next.js: .env.local overrides .env
for (const f of ['.env.local', '.env']) { try { process.loadEnvFile(f); } catch {} }

export default defineConfig({
  schema: './src/db/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL },
});
