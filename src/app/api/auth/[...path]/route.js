import { getAuth } from '@/lib/auth/server';

// Proxies the browser auth client to Neon Auth (Google OAuth, session, sign-out).
// The handler is built on first request (not at import, so `next build` needs no secrets) and reused.
let handlers;
const forward = (method) => (req, ctx) => (handlers ??= getAuth().handler())[method](req, ctx);

export const GET = forward('GET');
export const POST = forward('POST');
export const PUT = forward('PUT');
export const DELETE = forward('DELETE');
export const PATCH = forward('PATCH');
