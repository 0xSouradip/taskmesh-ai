'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useApp } from './AppProvider';
import { Avatar, PageHeader } from './ui/bits';

export default function TeamSection() {
  const { coreTeam } = useApp();

  return (
    <div className="w-[min(1240px,100%-40px)] mx-auto pt-[140px]">
      <PageHeader eyebrow="Team" title="The people building TaskMesh.">
        We are a small team of student engineers. We think people should be hired for what they can show, not for how their résumé reads, and we build TaskMesh with the same small tasks it is made for.
      </PageHeader>

      {coreTeam.length === 0 ? (
        <p className="glass p-10 text-fg-2">Team profiles will appear here.</p>
      ) : (
        <ul className="grid gap-5 md:grid-cols-3">
          {coreTeam.map((m) => (
            <li key={m.id} className="glass lit p-7 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <span className="tag tag-warm">{m.badge}</span>
                <span className="text-[13px] text-fg-2">{m.contributionsCount} tasks delivered</span>
              </div>
              <Avatar src={m.image} name={m.name} size={96} className="!rounded-3xl" />
              <h2 className="mt-6 text-[22px] font-semibold tracking-tight">{m.name}</h2>
              <p className="text-[14px] text-warm">{m.role}</p>
              <p className="text-[13px] text-fg-2 mt-0.5">@{m.handle} · {m.tagline}</p>
              <p className="mt-5 text-[15px] text-fg-2">{m.bio}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Skills">
                {m.skills.map((s) => <li key={s} className="tag">{s}</li>)}
              </ul>
              <div className="mt-auto pt-6 flex flex-wrap gap-2">
                <Link href={`/portfolio?handle=${encodeURIComponent(m.handle)}`} className="pill pill-secondary pill-sm">View work</Link>
                {m.email && (
                  <a href={`mailto:${m.email}`} className="pill pill-ghost pill-sm" aria-label={`Email ${m.name}`}>
                    <Mail className="w-4 h-4" aria-hidden="true" /> Email
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
