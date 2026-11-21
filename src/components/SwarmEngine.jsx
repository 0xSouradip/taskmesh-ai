'use client';

import { useState } from 'react';
import { useApp } from './AppProvider';
import { PageHeader, StatusTag, Stat, money } from './ui/bits';

// Activity: each project's task chain plus the live event feed.
export default function SwarmEngine() {
  const { projects, tasks, aiEvents, setSelectedTask } = useApp();
  const [projectId, setProjectId] = useState(projects[0]?.id);
  const project = projects.find((p) => p.id === projectId) ?? projects[0];
  const chain = tasks.filter((t) => t.projectId === project?.id);

  const done = tasks.filter((t) => t.status === 'COMPLETED');
  const active = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const waiting = tasks.filter((t) => t.status === 'BLOCKED');

  return (
    <div className="w-[min(1240px,100%-40px)] mx-auto pt-[140px]">
      <PageHeader eyebrow="Activity" title="Everything moving, in one place.">
        Tasks unlock as the work they depend on is finished, deliveries are checked, and payments go out. Here is what is happening across every project.
      </PageHeader>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <Stat label="Delivered" value={done.length} hint={`${money(done.reduce((s, t) => s + t.bounty, 0))} paid out`} />
        <Stat label="In progress" value={active.length} />
        <Stat label="Waiting on a dependency" value={waiting.length} />
        <Stat label="Projects" value={projects.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[7fr_5fr] items-start">
        <section className="glass p-6 sm:p-8" aria-labelledby="chain-title">
          {projects.length === 0 ? (
            <p className="text-fg-2">No projects yet.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Project">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={p.id === project?.id}
                    onClick={() => setProjectId(p.id)}
                    className="pill pill-xs shadow-[inset_0_0_0_1px_var(--color-line)] text-fg-2 aria-pressed:bg-fg aria-pressed:text-[#0b0b10] aria-pressed:shadow-none hover:text-fg"
                  >
                    {p.name.split(':')[0]}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-end justify-between gap-4 pb-5 mb-5 border-b border-line">
                <div>
                  <h2 id="chain-title" className="text-[22px] font-semibold tracking-tight">{project.name}</h2>
                  <p className="text-[14px] text-fg-2 mt-1">{project.description}</p>
                </div>
                <div className="w-40">
                  <div className="text-[13px] text-fg-2 mb-1.5">{project.completedTasksCount} of {project.tasksCount} done</div>
                  <div className="h-1.5 rounded-full bg-fg/10 overflow-hidden">
                    <div className="h-full bg-warm rounded-full" style={{ width: `${(project.completedTasksCount / (project.tasksCount || 1)) * 100}%` }} />
                  </div>
                </div>
              </div>

              <ol className="space-y-2.5">
                {chain.map((t, i) => (
                  <li key={t.id}>
                    <button type="button" onClick={() => setSelectedTask(t)} className="well w-full text-left px-4 py-3.5 flex items-center gap-4 hover:shadow-[inset_0_0_0_1px_rgb(255_192_138/0.5)] transition-shadow">
                      <span className="font-mono text-[13px] text-fg-2 w-6">{String(i + 1).padStart(2, '0')}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-medium truncate">{t.title}</span>
                        <span className="block text-[13px] text-fg-2">
                          {t.category} · {money(t.bounty)}{t.claimedBy ? ` · @${t.claimedBy}` : ''}
                        </span>
                      </span>
                      <StatusTag status={t.status} />
                    </button>
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>

        <section className="glass p-6 sm:p-8" aria-labelledby="feed-title">
          <h2 id="feed-title" className="text-[22px] font-semibold tracking-tight mb-5">Recent activity</h2>
          {aiEvents.length === 0 ? (
            <p className="text-fg-2">Nothing yet.</p>
          ) : (
            <ol className="space-y-4">
              {aiEvents.map((ev) => (
                <li key={ev.id} className="border-b border-line pb-4 last:border-0">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <span className="tag">{ev.badge}</span>
                    <time className="text-[13px] text-fg-2">{ev.timestamp}</time>
                  </div>
                  <p className="text-[14px] text-fg/85">{ev.message}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
