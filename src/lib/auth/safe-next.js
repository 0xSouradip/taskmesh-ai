// Only same-site paths are allowed as post-sign-in destinations (no open redirects).
export function safeNext(next) {
  if (typeof next !== 'string' || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return '/';
  if (next.startsWith('/sign-in') || next.startsWith('/api/')) return '/';
  return next.slice(0, 300);
}
