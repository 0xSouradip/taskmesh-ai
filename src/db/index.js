import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema.js';

// Created on first use, not at import: `next build` imports every route while collecting
// page data, and a missing DATABASE_URL must not fail the whole deploy (e.g. /kaleid needs no DB).
let instance;
function getDb() {
  if (!instance) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set. Add it in .env locally, or in Vercel → Project → Settings → Environment Variables.');
    }
    // neon-serverless (WebSocket Pool) supports interactive transactions, which submitTask needs.
    instance = drizzle({ connection: process.env.DATABASE_URL, schema });
  }
  return instance;
}

export const db = new Proxy({}, {
  get(_, prop) {
    const real = getDb();
    const value = real[prop];
    return typeof value === 'function' ? value.bind(real) : value;
  },
});
