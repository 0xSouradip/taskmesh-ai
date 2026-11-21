'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { useApp } from './AppProvider';
import { updateProfile } from '@/lib/actions';
import { signOutAndReload } from '@/lib/auth/client';
import { Avatar, Stat, StatusTag, money } from './ui/bits';

export default function Account() {
  const { currentUser: me, tasks, projects, reviewQueue, setSelectedTask, showToast, closeProject } = useApp();
  const [saving, setSaving] = useState(false);
  if (!me) return null;

  const working = tasks.filter((t) => t.viewer.isClaimer && t.status !== 'COMPLETED');
  const accepted = tasks.filter((t) => t.claimedBy === me.handle && t.status === 'COMPLETED');
  const myProjects = projects.filter((p) => p.ownerHandle === me.handle);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    const form = Object.fromEntries(new FormData(e.currentTarget));
    const res = await updateProfile(form);
    setSaving(false);
    showToast(res.ok ? 'Profile saved' : 'Could not save', res.ok ? 'Your public profile is updated.' : res.error, res.ok ? 'success' : 'error');
  }

  async function signOut() {
    const error = await signOutAndReload();
    if (error) showToast('Could not sign out', error, 'error');
  }

  return (
    <div className="w-[min(1100px,100%-40px)] mx-auto pt-[140px] space-y-12">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Avatar src={me.avatar} name={me.name} size={72} />
          <div>
            <p className="eyebrow mb-1.5">Your account</p>
            <h1 className="text-[clamp(28px,3.6vw,44px)] font-semibold tracking-[-0.04em] leading-none">{me.name}</h1>
            <p className="mt-2 text-fg-2">@{me.handle} · Level {me.level}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/portfolio?handle=${encodeURIComponent(me.handle)}`} className="pill pill-secondary pill-sm">View public profile</Link>
          <button type="button" onClick={signOut} className="pill pill-ghost pill-sm"><LogOut className="w-4 h-4" aria-hidden="true" /> Sign out</button>
        </div>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Working on" value={working.length} />
        <Stat label="Accepted" value={me.delivered} />
        <Stat label="Fees for accepted work" value={money(me.feesEarned)} />
        <Stat label="XP" value={me.xp.toLocaleString('en-US')} />
      </div>

      {reviewQueue.length > 0 && (
        <section className="glass p-6 sm:p-8 shadow-[inset_0_0_0_1px_rgb(255_192_138/0.45)]" aria-labelledby="review-h">
          <h2 id="review-h" className="text-[20px] font-semibold tracking-tight mb-1">Needs your review ({reviewQueue.length})</h2>
          <p className="text-[14px] text-fg-2 mb-5">Accept the work or ask for changes. The AI check is there to help, but you decide.</p>
          <TaskList items={reviewQueue} onOpen={setSelectedTask} meta={(t) => `${t.projectName} · by @${t.claimedBy}`} />
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <section className="glass p-6 sm:p-8" aria-labelledby="my-tasks">
          <h2 id="my-tasks" className="text-[20px] font-semibold tracking-tight mb-5">Your tasks</h2>
          {working.length + accepted.length === 0 ? (
            <p className="text-fg-2">You haven’t claimed anything yet. <Link href="/tasks" className="text-warm hover:underline">Browse open tasks</Link>.</p>
          ) : (
            <TaskList items={[...working, ...accepted]} onOpen={setSelectedTask} meta={(t) => `${t.projectName} · fee ${money(t.bounty)}`} />
          )}
        </section>

        <section className="glass p-6 sm:p-8" aria-labelledby="my-projects">
          <h2 id="my-projects" className="text-[20px] font-semibold tracking-tight mb-5">Your projects</h2>
          {myProjects.length === 0 ? (
            <p className="text-fg-2">You haven’t posted a project. <Link href="/decomposer" className="text-warm hover:underline">Post one</Link>.</p>
          ) : (
            <ul className="space-y-2.5">
              {myProjects.map((p) => (
                <li key={p.id} className="well px-4 py-3.5 flex items-center gap-4">
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium truncate">{p.name}</span>
                    <span className="block text-[13px] text-fg-2">
                      {p.completedTasksCount} of {p.tasksCount} accepted · {money(p.acceptedBudget)} of {money(p.totalBudget)} in fees
                    </span>
                  </span>
                  {p.status === 'CLOSED' ? (
                    <span className="tag">Closed</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => confirm(`Close "${p.name}"? Unclaimed tasks will be removed from the board.`) && closeProject(p.id)}
                      className="pill pill-ghost pill-xs"
                    >
                      Close
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <form onSubmit={save} className="glass p-6 sm:p-8 space-y-5 max-w-2xl" aria-labelledby="profile-h">
        <h2 id="profile-h" className="text-[20px] font-semibold tracking-tight">Public profile</h2>
        <div>
          <label htmlFor="title" className="label">Headline</label>
          <input id="title" name="title" maxLength={80} defaultValue={me.title ?? ''} placeholder="e.g. Frontend engineer" className="field" />
        </div>
        <div>
          <label htmlFor="bio" className="label">About you</label>
          <textarea id="bio" name="bio" rows={5} maxLength={600} defaultValue={me.bio ?? ''} placeholder="What you are best at, in a few lines." className="field" />
        </div>
        <p className="text-[13px] text-fg-2">
          Your name and photo come from Google. Your email is never public: it’s shown only to the other person on a task you share (project owner and specialist), so you can arrange payment.
        </p>
        <button type="submit" disabled={saving} className="pill pill-primary w-full">{saving ? 'Saving…' : 'Save profile'}</button>
      </form>
    </div>
  );
}

function TaskList({ items, onOpen, meta }) {
  return (
    <ul className="space-y-2.5">
      {items.map((t) => (
        <li key={t.id}>
          <button type="button" onClick={() => onOpen(t)} className="well w-full text-left px-4 py-3.5 flex items-center gap-4 hover:shadow-[inset_0_0_0_1px_rgb(255_192_138/0.5)]">
            <span className="flex-1 min-w-0">
              <span className="block font-medium truncate">{t.title}</span>
              <span className="block text-[13px] text-fg-2 truncate">{meta(t)}</span>
            </span>
            <StatusTag status={t.status} />
          </button>
        </li>
      ))}
    </ul>
  );
}
