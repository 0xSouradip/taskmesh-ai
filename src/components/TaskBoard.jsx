'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { useApp } from './AppProvider';
import TaskCard from './TaskCard';
import { PageHeader, STATUS_OPTIONS, money } from './ui/bits';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Design', 'Copywriting', 'AI & Prompts', 'QA & Security'];

export default function TaskBoard({ initialQuery = '' }) {
  const { tasks, projects } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [projectId, setProjectId] = useState('All');

  // Unclaimed tasks of closed projects are no longer on offer.
  const listed = tasks.filter((t) => !(t.projectClosed && (t.status === 'AVAILABLE' || t.status === 'BLOCKED')));
  const q = query.trim().toLowerCase();
  const filtered = listed.filter(
    (t) =>
      (!q || [t.title, t.projectName, t.description, t.category].some((s) => s.toLowerCase().includes(q))) &&
      (category === 'All' || t.category === category) &&
      (status === 'All' || t.status === status) &&
      (projectId === 'All' || t.projectId === projectId)
  );
  const openValue = listed.filter((t) => t.status === 'AVAILABLE').reduce((s, t) => s + t.bounty, 0);
  const reset = () => {
    setQuery('');
    setCategory('All');
    setStatus('All');
    setProjectId('All');
  };

  return (
    <div className="w-[min(1240px,100%-40px)] mx-auto pt-[140px]">
      <PageHeader
        eyebrow="Tasks"
        title="Find work you are great at."
        actions={<Link href="/decomposer" className="pill pill-primary">Post a project</Link>}
      >
        Every task has an agreed fee, clear deliverables and acceptance criteria. The project owner reviews your work and pays you directly.{openValue > 0 ? ` ${money(openValue)} in open tasks right now.` : ''}
      </PageHeader>

      <div className="glass p-4 sm:p-5 mb-8 space-y-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
          <label className="relative block">
            <span className="sr-only">Search tasks</span>
            <Search className="w-4 h-4 text-fg-2 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by skill or keyword: Figma, React, webhook…"
              className="field !pl-11"
            />
          </label>
          <label>
            <span className="sr-only">Project</span>
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="field">
              <option value="All">All projects ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="field">
              {STATUS_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="group" aria-label="Category">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className="pill pill-xs shrink-0 shadow-[inset_0_0_0_1px_var(--color-line)] text-fg-2 aria-pressed:bg-fg aria-pressed:text-[#0b0b10] aria-pressed:shadow-none hover:text-fg"
            >
              {c === 'All' ? 'All categories' : c}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[14px] text-fg-2 mb-5" aria-live="polite">
        {filtered.length} of {listed.length} tasks
      </p>

      {listed.length === 0 ? (
        <div className="glass p-12 text-center">
          <p className="text-[18px] font-medium">No tasks yet.</p>
          <p className="mt-2 text-fg-2">Be the first: post a project and AI will split it into tasks people can pick up.</p>
          <Link href="/decomposer" className="pill pill-primary pill-sm mt-6">Post a project</Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass p-12 text-center">
          <p className="text-[18px] font-medium">No tasks match these filters.</p>
          <p className="mt-2 text-fg-2">Try a broader search, or post a project to create new tasks.</p>
          <button type="button" onClick={reset} className="pill pill-secondary pill-sm mt-6">
            <X className="w-4 h-4" aria-hidden="true" /> Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      )}
    </div>
  );
}
