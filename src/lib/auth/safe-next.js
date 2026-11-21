// Only same-site paths are allowed as post-sign-in destinations (no open redirects).
// Parsing against a dummy origin catches every form browsers treat as another host
// ("//evil.com", "/\\evil.com", and tab/newline tricks like "/\t/evil.com").
const BASE = 'http://same.invalid';

export function safeNext(next) {
  if (typeof next !== 'string' || !next.startsWith('/')) return '/';
  // Browsers strip tab/CR/LF and treat "\" as "/", so reject them outright.
  if (/[\\\u0000-\u001f\u007f]/.test(next)) return '/';
  let url;
  try {
    url = new URL(next, BASE);
  } catch {
    return '/';
  }
  if (url.origin !== BASE) return '/';
  const path = url.pathname + url.search + url.hash;
  if (path.startsWith('/sign-in') || path.startsWith('/api/')) return '/';
  return path.length > 300 ? '/' : path;
}
