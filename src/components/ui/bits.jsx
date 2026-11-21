// Small presentational pieces shared across pages. No state, safe in server or client components.
import { CheckCircle2, Clock, Lock, Circle } from 'lucide-react';

export function Avatar({ src, name = '', size = 32, className = '' }) {
  const initial = (name.trim()[0] || '?').toUpperCase();
  const style = { width: size, height: size };
  if (src) {
    // Plain <img>: avatars come from many hosts (Google, seed data), no next/image domain list needed.
    return <img src={src} alt="" style={style} className={`rounded-full object-cover shrink-0 ${className}`} referrerPolicy="no-referrer" />;
  }
  return (
    <span
      aria-hidden="true"
      style={{ ...style, fontSize: size * 0.42 }}
      className={`rounded-full shrink-0 grid place-items-center bg-fg/10 text-fg font-semibold ${className}`}
    >
      {initial}
    </span>
  );
}

const STATUS = {
  AVAILABLE: { label: 'Open', cls: 'tag-warm', Icon: Circle },
  IN_PROGRESS: { label: 'In progress', cls: 'tag-busy', Icon: Clock },
  COMPLETED: { label: 'Completed', cls: 'tag-ok', Icon: CheckCircle2 },
  BLOCKED: { label: 'Waiting on dependency', cls: '', Icon: Lock },
};

export function StatusTag({ status }) {
  const s = STATUS[status] ?? STATUS.AVAILABLE;
  return (
    <span className={`tag ${s.cls}`}>
      <s.Icon className="w-3 h-3" aria-hidden="true" />
      {s.label}
    </span>
  );
}

export const STATUS_OPTIONS = [
  { id: 'All', label: 'Any status' },
  { id: 'AVAILABLE', label: 'Open' },
  { id: 'IN_PROGRESS', label: 'In progress' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'BLOCKED', label: 'Waiting on dependency' },
];

export function PageHeader({ eyebrow, title, children, actions }) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="h-page">{title}</h1>
        {children && <p className="mt-4 text-fg-2 text-[17px]">{children}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

export const money = (n) => `$${Number(n || 0).toLocaleString('en-US')}`;

export function Stat({ label, value, hint }) {
  return (
    <div className="border-t border-line pt-4">
      <div className="text-[13px] text-fg-2">{label}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-[13px] text-fg-2">{hint}</div>}
    </div>
  );
}
