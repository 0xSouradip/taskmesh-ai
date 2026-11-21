// Small input clamps shared by server actions and AI output parsing (never trust either).
export const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export const int = (v, min, max, fallback) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

export const strList = (v, maxItems, maxLen) =>
  (Array.isArray(v) ? v : []).map((s) => str(s, maxLen)).filter(Boolean).slice(0, maxItems);
