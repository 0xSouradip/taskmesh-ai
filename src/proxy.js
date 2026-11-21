import { NextResponse } from 'next/server';
import { getAuth, authConfigured } from '@/lib/auth/server';

// Only /account needs a session; everything else is public to browse.
// Writes are additionally checked inside each server action.
export default function proxy(request, event) {
  if (!authConfigured()) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return getAuth().middleware({ loginUrl: '/sign-in' })(request, event);
}

export const config = { matcher: ['/account/:path*'] };
