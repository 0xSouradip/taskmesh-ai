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
// Label for each event type in the activity feed (presentation, kept out of the DB).
export const EVENT_STYLES = {
  PROJECT_DECOMPOSED: { badge: 'New project' },
  TASK_CLAIMED: { badge: 'Claimed' },
  TASK_RELEASED: { badge: 'Released' },
  TASK_SUBMITTED: { badge: 'Submitted' },
  CHANGES_REQUESTED: { badge: 'Changes requested' },
  TASK_ACCEPTED: { badge: 'Accepted' },
  PREREQUISITE_UNLOCKED: { badge: 'Unlocked' },
  PROJECT_CLOSED: { badge: 'Closed' },
  // Older event types still in the log.
  TASK_VERIFIED: { badge: 'Accepted' },
  TASK_REJECTED: { badge: 'Changes requested' },
};

export const levelFromXp = (xp) => Math.floor(xp / 300) + 1;
