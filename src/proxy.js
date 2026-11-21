import { NextResponse } from 'next/server';
import { getAuth, authConfigured } from '@/lib/auth/server';

// Neon Auth's middleware runs on every page (not just protected ones) because it is what
// finishes the Google OAuth exchange (?neon_auth_session_verifier=) and refreshes session cookies.
// Only /account requires a session; writes are additionally checked inside each server action.
const isProtected = (pathname) => pathname === '/account' || pathname.startsWith('/account/');

export default function proxy(request, event) {
  const { pathname, search } = request.nextUrl;
  const loginUrl = `/sign-in?next=${encodeURIComponent(pathname + search)}`;

  if (!authConfigured()) {
    return isProtected(pathname) ? NextResponse.redirect(new URL(loginUrl, request.url)) : NextResponse.next();
  }

  // Public pages: list the current path as public so the middleware still does the
  // OAuth exchange and cookie refresh, but never redirects to sign-in.
  // A path made only of slashes ('//') can't be a publicRoutes entry; nothing lives there, so skip auth.
  if (pathname !== '/' && !/[^/]/.test(pathname)) return NextResponse.next();
  const publicRoutes = isProtected(pathname) ? [] : [pathname];
  return getAuth().middleware({ loginUrl, publicRoutes })(request, event);
}

export const config = {
  // Every path except Next internals and files with an extension (images, icon.svg, robots.txt...).
  matcher: ['/((?!_next/static|_next/image|.*\\.\\w+$).*)'],
};
