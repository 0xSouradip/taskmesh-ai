'use client';

import Link from 'next/link';
import { useApp } from './AppProvider';
import { Avatar, PageHeader, money } from './ui/bits';

export default function Leaderboard() {
  const { freelancers, currentUser } = useApp();
  const ranked = [...freelancers].sort((a, b) => b.xp - a.xp);
  const podium = ranked.slice(0, 3);

  return (
    <div className="w-[min(1240px,100%-40px)] mx-auto pt-[140px]">
      <PageHeader
        eyebrow="Leaderboard"
        title="Ranked by delivered work."
        actions={<Link href="/tasks" className="pill pill-primary">Find a task</Link>}
      >
        XP comes only from verified deliveries, so the ranking reflects real, accepted work.
      </PageHeader>

      {podium.length > 0 && (
        <ol className="grid gap-5 md:grid-cols-3 mb-10">
          {podium.map((f, i) => (
            <li key={f.id} className="glass lit p-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[13px] text-warm">#{i + 1}</span>
                <span className="tag">Level {f.level}</span>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <Avatar src={f.avatar} name={f.name} size={56} />
                <div className="min-w-0">
                  <Link href={`/portfolio?handle=${encodeURIComponent(f.handle)}`} className="block font-semibold truncate hover:text-warm after:absolute after:inset-0">
                    {f.name}
                  </Link>
                  <p className="text-[14px] text-fg-2 truncate">{f.title}</p>
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-3 text-[13px]">
                <div><dt className="text-fg-2">XP</dt><dd className="text-[18px] font-semibold tabular-nums">{f.xp.toLocaleString('en-US')}</dd></div>
                <div><dt className="text-fg-2">Earned</dt><dd className="text-[18px] font-semibold tabular-nums">{money(f.bountiesEarned)}</dd></div>
                <div><dt className="text-fg-2">Tasks</dt><dd className="text-[18px] font-semibold tabular-nums">{f.tasksCompleted}</dd></div>
              </dl>
            </li>
          ))}
        </ol>
      )}

      <div className="glass p-2 sm:p-4 overflow-x-auto">
        <table className="w-full text-left text-[14px] min-w-[640px]">
          <caption className="sr-only">All specialists ranked by XP</caption>
          <thead className="text-fg-2 text-[13px]">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Rank</th>
              <th scope="col" className="px-4 py-3 font-medium">Specialist</th>
              <th scope="col" className="px-4 py-3 font-medium">Top skill</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">Tasks</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">Earned</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">XP</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((f, i) => {
              const me = f.handle === currentUser?.handle;
              return (
                <tr key={f.id} className={`border-t border-line ${me ? 'bg-warm/[0.06]' : ''}`}>
                  <td className="px-4 py-3.5 font-mono text-fg-2">{i + 1}</td>
                  <td className="px-4 py-3.5">
                    <Link href={`/portfolio?handle=${encodeURIComponent(f.handle)}`} className="flex items-center gap-3 hover:text-warm">
                      <Avatar src={f.avatar} name={f.name} size={32} />
                      <span>
                        <span className="block font-medium">{f.name}{me && <span className="text-warm"> (you)</span>}</span>
                        <span className="block text-[13px] text-fg-2">@{f.handle}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-fg-2">{f.skills?.[0]?.name ?? '—'}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums">{f.tasksCompleted}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums">{money(f.bountiesEarned)}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums font-medium">{f.xp.toLocaleString('en-US')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
