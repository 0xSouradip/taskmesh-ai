const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const UNITS = [
  ['year', 31536000],
  ['month', 2592000],
  ['week', 604800],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
];

export function timeAgo(date, now = Date.now()) {
  const seconds = Math.round((new Date(date).getTime() - now) / 1000);
  if (Math.abs(seconds) < 60) return 'Just now';
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
}

// Presentation for event types; kept out of the DB on purpose.
export const EVENT_STYLES = {
  TASK_CLAIMED: { badge: 'Claimed', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  TASK_VERIFIED: { badge: 'Verified', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  BOUNTY_PAID: { badge: 'Instant Escrow', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  PREREQUISITE_UNLOCKED: { badge: 'Graph Unlocked', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  PROJECT_DECOMPOSED: { badge: 'Decomposition', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
};

export const levelFromXp = (xp) => Math.floor(xp / 300) + 1;
