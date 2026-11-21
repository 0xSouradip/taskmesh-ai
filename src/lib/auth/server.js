import 'server-only';
import { createNeonAuth } from '@neon/auth/next/server';

// Created on first use: createNeonAuth throws without a 32+ char cookie secret,
// and `next build` must not need runtime secrets.
let instance;
export function getAuth() {
  if (!instance) {
    const baseUrl = process.env.NEON_AUTH_BASE_URL;
    const secret = process.env.NEON_AUTH_COOKIE_SECRET;
    if (!baseUrl || !secret) {
      throw new Error('NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET must be set (see README → Launch checklist).');
    }
    instance = createNeonAuth({ baseUrl, cookies: { secret } });
  }
  return instance;
}

export const authConfigured = () => Boolean(process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET);
