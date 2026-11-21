'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Link2, ExternalLink, Mail } from 'lucide-react';
import { useApp } from './AppProvider';
import { Avatar, Stat, money } from './ui/bits';

// Public profile: verified deliveries are the résumé.
export default function ProofOfSkill({ initialHandle }) {
  const { freelancers, tasks, currentUser, setSelectedTask } = useApp();
  const [copied, setCopied] = useState(false);
  const person =
    freelancers.find((f) => f.handle === initialHandle) ??
    freelancers.find((f) => f.handle === currentUser?.handle) ??
    freelancers[0];

  if (!person) {
    return <div className="w-[min(1240px,100%-40px)] mx-auto pt-[140px]"><p className="glass p-10 text-fg-2">No profiles yet.</p></div>;
  }

  const delivered = tasks.filter((t) => t.status === 'COMPLETED' && t.claimedBy === person.handle);
  const isMe = person.handle === currentUser?.handle;

  async function share() {
    const url = `${location.origin}/portfolio?handle=${encodeURIComponent(person.handle)}`;
    try {
      if (navigator.share) await navigator.share({ title: `${person.name} on TaskMesh`, url });
      else await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // share sheet dismissed
    }
  }

  return (
    <div className="w-[min(1240px,100%-40px)] mx-auto pt-[140px]">
      <section className="glass p-6 sm:p-10 flex flex-col md:flex-row gap-8 md:items-center justify-between mb-8">
        <div className="flex items-center gap-6 min-w-0">
          <Avatar src={person.avatar} name={person.name} size={96} className="!rounded-3xl" />
          <div className="min-w-0">
            <p className="eyebrow mb-2">{person.isFoundingTeam ? 'Founding team' : 'Specialist'} · Level {person.level}</p>
            <h1 className="text-[clamp(30px,4vw,48px)] font-semibold tracking-[-0.04em] leading-none truncate">{person.name}</h1>
            <p className="mt-2 text-fg-2">@{person.handle}{person.title ? ` · ${person.title}` : ''}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={share} className="pill pill-secondary pill-sm">
            {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Link2 className="w-4 h-4" aria-hidden="true" />}
            {copied ? 'Link copied' : 'Share profile'}
          </button>
          {person.email && (
            <a href={`mailto:${person.email}`} className="pill pill-ghost pill-sm"><Mail className="w-4 h-4" aria-hidden="true" /> Contact</a>
          )}
          {isMe && <Link href="/account" className="pill pill-ghost pill-sm">Edit in account</Link>}
        </div>
      </section>

      {person.bio && <p className="text-[18px] text-fg/90 max-w-3xl mb-10">{person.bio}</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <Stat label="Tasks delivered" value={person.tasksCompleted} />
        <Stat label="Earned" value={money(person.bountiesEarned)} />
        <Stat label="XP" value={person.xp.toLocaleString('en-US')} />
        <Stat label="Accepted first time" value={`${person.acceptanceRate}%`} />
      </div>

      {(person.skills.length > 0 || person.badges.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-[7fr_5fr] mb-12">
          {person.skills.length > 0 && (
            <section className="glass p-6 sm:p-8">
              <h2 className="text-[20px] font-semibold tracking-tight mb-6">Skills</h2>
              <ul className="space-y-4">
                {person.skills.map((s) => (
                  <li key={s.name}>
                    <div className="flex justify-between text-[14px] mb-1.5"><span>{s.name}</span><span className="text-fg-2 tabular-nums">{s.level}</span></div>
                    <div className="h-1.5 rounded-full bg-fg/10 overflow-hidden" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={s.level} aria-label={s.name}>
                      <div className="h-full rounded-full bg-fg/80" style={{ width: `${s.level}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {person.badges.length > 0 && (
            <section className="glass p-6 sm:p-8">
              <h2 className="text-[20px] font-semibold tracking-tight mb-6">Recognition</h2>
              <ul className="space-y-3">
                {person.badges.map((b) => (
                  <li key={b.id} className="well p-4">
                    <p className="font-medium">{b.name}</p>
                    <p className="text-[14px] text-fg-2 mt-0.5">{b.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      <section aria-labelledby="delivered-title">
        <h2 id="delivered-title" className="h-section !text-[clamp(28px,3.6vw,48px)] mb-6">Delivered work</h2>
        {delivered.length === 0 ? (
          <div className="glass p-10 text-fg-2">
            No verified deliveries yet.{isMe && <> <Link href="/tasks" className="text-warm hover:underline">Pick up a task</Link> to start building your record.</>}
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {delivered.map((t) => (
              <li key={t.id} className="glass lit p-6 space-y-3">
                <div className="flex items-center justify-between gap-3 text-[13px] text-fg-2">
                  <span className="truncate">{t.projectName}</span>
                  {t.submission && <span className="tag tag-ok">Score {t.submission.aiReviewScore}/100</span>}
                </div>
                <button type="button" onClick={() => setSelectedTask(t)} className="text-left text-[18px] font-semibold tracking-tight hover:text-warm">{t.title}</button>
                {t.submission && (
                  <>
                    <p className="text-[14px] text-fg-2 line-clamp-2">{t.submission.notes}</p>
                    <a href={t.submission.link} target="_blank" rel="noreferrer noopener" className="relative z-10 inline-flex items-center gap-1.5 text-[14px] text-warm hover:underline">
                      See the work <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {freelancers.length > 1 && (
        <section className="mt-16" aria-labelledby="others">
          <h2 id="others" className="text-[13px] font-medium text-fg-2 mb-4">More specialists</h2>
          <ul className="flex flex-wrap gap-2">
            {freelancers.filter((f) => f.handle !== person.handle).map((f) => (
              <li key={f.id}>
                <Link href={`/portfolio?handle=${encodeURIComponent(f.handle)}`} className="flex items-center gap-2 pl-1.5 pr-4 h-10 rounded-full shadow-[inset_0_0_0_1px_var(--color-line)] text-[14px] text-fg-2 hover:text-fg">
                  <Avatar src={f.avatar} name={f.name} size={28} /> {f.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
