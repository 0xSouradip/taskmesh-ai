'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useApp } from './AppProvider';
import { Avatar, PageHeader } from './ui/bits';
import { TEAM } from '@/content/team';

export default function TeamSection() {
  // email -> handle for founders who have signed in (computed on the server).
  const { teamHandles = {} } = useApp();

  return (
    <div className="w-[min(1240px,100%-40px)] mx-auto pt-[140px]">
      <PageHeader eyebrow="Team" title="The people building TaskMesh.">
        We are a small team of student engineers. We think people should be hired for what they can show, not for how their résumé reads.
      </PageHeader>

      <ul className="grid gap-5 md:grid-cols-3">
        {TEAM.map((m) => {
          const handle = teamHandles[m.email];
          return (
            <li key={m.email} className="glass lit p-7 flex flex-col">
              <span className="tag tag-warm self-start mb-6">{m.badge}</span>
              <Avatar src={m.image} name={m.name} size={96} className="!rounded-3xl" />
              <h2 className="mt-6 text-[22px] font-semibold tracking-tight">{m.name}</h2>
              <p className="text-[14px] text-warm">{m.role}</p>
              <p className="text-[13px] text-fg-2 mt-0.5">{m.tagline}</p>
              <p className="mt-5 text-[15px] text-fg-2">{m.bio}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Skills">
                {m.skills.map((s) => <li key={s} className="tag">{s}</li>)}
              </ul>
              <div className="mt-auto pt-6 flex flex-wrap gap-2">
                {handle && (
                  <Link href={`/portfolio?handle=${encodeURIComponent(handle)}`} className="pill pill-secondary pill-sm">View work</Link>
                )}
                <a href={`mailto:${m.email}`} className="pill pill-ghost pill-sm" aria-label={`Email ${m.name}`}>
                  <Mail className="w-4 h-4" aria-hidden="true" /> Email
                </a>
                {m.github && (
                  <a href={m.github} target="_blank" rel="noreferrer" className="pill pill-ghost pill-sm">GitHub</a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
