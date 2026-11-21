'use client';

import { createAuthClient } from '@neon/auth/next';

// Talks to the same-origin proxy at /api/auth. Takes no options by design.
export const authClient = createAuthClient();

/**
 * Sign out, then do a full page load of the home page.
 * A client-side router.push would keep the cached root layout (navbar still showing the user);
 * a real navigation re-renders everything from the now cookie-less request.
 * Returns an error message if the auth server refused, so callers can show it.
 */
export async function signOutAndReload() {
  try {
    const { error } = await authClient.signOut();
    if (error) return error.message || 'Sign-out failed. Please try again.';
  } catch (e) {
    return e?.message || 'Could not reach the sign-in service. Please try again.';
  }
  window.location.assign('/');
  return null;
}
