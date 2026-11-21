import { getAuth } from '@/lib/auth/server';

// Proxies the browser auth client to Neon Auth (Google OAuth, session, sign-out).
const forward = (method) => (req, ctx) => getAuth().handler()[method](req, ctx);

export const GET = forward('GET');
export const POST = forward('POST');
export const PUT = forward('PUT');
export const DELETE = forward('DELETE');
export const PATCH = forward('PATCH');
