import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { sql } from 'drizzle-orm';
import { db } from '@/db';

const COOKIE = 'tm_session';
const MAX_AGE_DAYS = 30;
const sha256 = (s) => createHash('sha256').update(s).digest('hex');

export async function createSession(userId) {
  const token = randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + MAX_AGE_DAYS * 86400_000);
  await db.execute(sql`INSERT INTO sessions (session_token, user_id, expires) VALUES (${sha256(token)}, ${userId}, ${expires})`);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires,
  });
}

// Returns the logged-in user's id, or null.
export async function getSessionUserId() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const { rows } = await db.execute(
    sql`SELECT user_id FROM sessions WHERE session_token = ${sha256(token)} AND expires > now()`
  );
  return rows[0]?.user_id ?? null;
}

export async function deleteSession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) await db.execute(sql`DELETE FROM sessions WHERE session_token = ${sha256(token)}`);
  store.delete(COOKIE);
}
