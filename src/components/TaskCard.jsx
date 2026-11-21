'use client';

import { Clock } from 'lucide-react';
import { useApp } from './AppProvider';
import { StatusTag, money } from './ui/bits';

export default function TaskCard({ task }) {
  const { setSelectedTask, claimTask } = useApp();
  const open = task.status === 'AVAILABLE';

  return (
    <article className={`glass lit p-6 flex flex-col gap-4 min-w-0 ${task.status === 'BLOCKED' ? 'opacity-70' : ''}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] text-fg-2 truncate">{task.projectName}</span>
        <StatusTag status={task.status} />
      </div>

      <h3 className="text-[19px] font-semibold tracking-tight leading-snug">
        <button type="button" onClick={() => setSelectedTask(task)} className="text-left hover:text-warm transition-colors after:absolute after:inset-0 after:content-['']">
          {task.title}
        </button>
      </h3>
      <p className="text-[14px] text-fg-2 line-clamp-2">{task.description}</p>

      <div className="flex flex-wrap gap-1.5">
        <span className="tag">{task.category}</span>
        <span className="tag">{task.difficulty}</span>
        <span className="tag"><Clock className="w-3 h-3" aria-hidden="true" />{task.estimatedHours}</span>
      </div>

      <div className="mt-auto pt-4 border-t border-line flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="text-[20px] font-semibold tabular-nums">{money(task.bounty)}</span>
          <span className="text-[13px] text-fg-2">{task.xp} XP</span>
        </div>
        {open && (
          // Above the card's stretched link so it stays clickable on its own.
          <button type="button" onClick={() => claimTask(task.id)} className="relative z-10 pill pill-primary pill-xs">
            Claim
          </button>
        )}
      </div>
    </article>
  );
}
