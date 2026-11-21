import 'server-only';
import { cache } from 'react';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { getAuth, authConfigured } from './server.js';

// Handle from the email local part: lowercase, safe chars, 2..30 long.
export function baseHandle(email, name) {
  const raw = (email?.split('@')[0] || name || 'user').toLowerCase().replace(/[^a-z0-9_-]+/g, '');
  return (raw.length >= 2 ? raw : `user${raw}`).slice(0, 30);
}

/**
 * The signed-in user's TaskMesh profile, created on first sign-in.
 * Identity comes from Neon Auth (Google); the profile row holds TaskMesh data (xp, bounties, ...).
 * Cached per request, so the layout and server actions share one lookup.
 */
export const getCurrentProfile = cache(async () => {
  if (!authConfigured()) return null;
  let user;
  try {
    const { data: session } = await getAuth().getSession();
    user = session?.user;
  } catch (e) {
    // Auth service unreachable: render the site signed out rather than failing every page.
    console.error('[auth] getSession failed:', e?.message);
    return null;
  }
  if (!user?.id) return null;

  const found = await db.execute(sql`SELECT id, name, handle FROM users WHERE auth_user_id = ${user.id}`);
  if (found.rows[0]) return found.rows[0];

  const email = user.email?.toLowerCase() ?? null;

  // A seeded profile with the same email is claimed rather than duplicated, but only when
  // the identity provider says the email is verified (a missing flag does not count).
  if (email && user.emailVerified === true) {
    const claimed = await db.execute(sql`
      UPDATE users SET auth_user_id = ${user.id}, image = COALESCE(image, ${user.image ?? null})
      WHERE lower(email) = ${email} AND auth_user_id IS NULL
      RETURNING id, name, handle`);
    if (claimed.rows[0]) return claimed.rows[0];
  }

  // New profile. Retry with a numeric suffix if the handle is taken.
  // If another profile already owns this email (e.g. linked to an older auth identity),
  // store NULL instead: otherwise the unique email would make every insert below fail.
  const base = baseHandle(email, user.name);
  for (let i = 0; i < 20; i++) {
    const handle = i === 0 ? base : `${base}${i + 1}`;
    const { rows } = await db.execute(sql`
      INSERT INTO users (id, auth_user_id, name, email, image, handle, title)
      VALUES (${crypto.randomUUID()}, ${user.id}, ${user.name || handle},
        CASE WHEN EXISTS (SELECT 1 FROM users WHERE lower(email) = ${email}) THEN NULL ELSE ${email} END,
        ${user.image ?? null}, ${handle}, 'Specialist')
      ON CONFLICT DO NOTHING
      RETURNING id, name, handle`);
    if (rows[0]) return rows[0];
    // Lost a race with our own concurrent request? Then the row exists now.
    const again = await db.execute(sql`SELECT id, name, handle FROM users WHERE auth_user_id = ${user.id}`);
    if (again.rows[0]) return again.rows[0];
  }
  throw new Error('Could not allocate a unique handle');
});
