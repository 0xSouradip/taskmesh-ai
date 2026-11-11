import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema.js';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// neon-serverless (WebSocket Pool) supports interactive transactions, which submitTask needs.
export const db = drizzle({ connection: process.env.DATABASE_URL, schema });
