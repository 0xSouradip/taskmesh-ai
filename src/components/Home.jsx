'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useApp } from './AppProvider';
import HomeHero from './HomeHero';
import TaskCard from './TaskCard';
import { Avatar } from './ui/bits';
import CountUp from './ui/CountUp';

const STEPS = [
  {
    n: '01',
    title: 'Describe the project',
    body: 'Write what you want built. TaskMesh splits it into small tasks with clear deliverables, acceptance criteria and a price for each.',
  },
  {
    n: '02',
    title: 'Specialists pick tasks',
    body: 'A designer takes the design, a writer takes the copy, an engineer takes the API. Tasks that depend on others unlock on their own.',
  },
  {
    n: '03',
    title: 'Checked, then paid',
    body: 'Each delivery is checked against its criteria before payment. The finished work stays on the specialist’s public profile.',
  },
];

// Short search phrases from real open tasks, for the hero's typing search.
const toPhrase = (title) => title.split(/[:,(]/)[0].split(' ').slice(0, 4).join(' ');

export default function Home() {
  const { tasks, projects, freelancers, coreTeam } = useApp();
  const open = tasks.filter((t) => t.status === 'AVAILABLE');
  const completed = tasks.filter((t) => t.status === 'COMPLETED');
  const paid = completed.reduce((s, t) => s + t.bounty, 0);
  const openValue = open.reduce((s, t) => s + t.bounty, 0);

  const figures = [
    { value: completed.length, suffix: '', label: 'tasks delivered and verified' },
    { value: paid, prefix: '$', label: 'paid out to specialists' },
    { value: open.length, suffix: '', label: `open tasks worth $${openValue.toLocaleString('en-US')}` },
    { value: freelancers.length, suffix: '', label: `specialists across ${projects.length} projects` },
  ];

  return (
    <>
      <HomeHero examples={open.slice(0, 5).map((t) => toPhrase(t.title))} />

      <section aria-labelledby="how" className="relative py-[clamp(88px,12vw,160px)]">
        <span className="disc disc-amber -left-[14vw] top-0" aria-hidden="true" />
        <div className="w-[min(1240px,100%-40px)] mx-auto">
          <p className="eyebrow mb-4 reveal">How it works</p>
          <h2 id="how" className="h-section max-w-[16ch] mb-12 reveal">Hire for the task, not the résumé.</h2>
          <ol className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="glass lit p-8 reveal">
                <span className="font-mono text-[13px] text-warm">{s.n}</span>
                <h3 className="mt-6 text-[22px] font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-3 text-fg-2 text-[15px]">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="open" className="relative py-[clamp(64px,9vw,120px)]">
        <span className="disc disc-blue -right-[18vw] top-[20%]" aria-hidden="true" />
        <div className="w-[min(1240px,100%-40px)] mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="eyebrow mb-4 reveal">Open now</p>
              <h2 id="open" className="h-section reveal">Pick something up today.</h2>
            </div>
            <Link href="/tasks" className="pill pill-secondary reveal">
              All {open.length} open tasks <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          {open.length === 0 ? (
            <div className="glass p-10 text-center text-fg-2">
              No open tasks right now. <Link href="/decomposer" className="text-warm hover:underline">Post a project</Link> to create some.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {open.slice(0, 6).map((t) => (
                <div key={t.id} className="reveal grid min-w-0"><TaskCard task={t} /></div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section aria-label="TaskMesh in numbers" className="py-[clamp(64px,9vw,120px)]">
        <dl className="w-[min(1240px,100%-40px)] mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {figures.map((f) => (
            <div key={f.label} className="border-t border-line pt-6 reveal">
              <dt className="sr-only">{f.label}</dt>
              <dd className="text-[clamp(48px,6vw,88px)] font-semibold tracking-[-0.05em] leading-none tabular-nums">
                <CountUp value={f.value} prefix={f.prefix} suffix={f.suffix} />
              </dd>
              <p aria-hidden="true" className="mt-4 text-fg-2 text-[15px]">{f.label}</p>
            </div>
          ))}
        </dl>
      </section>

      {coreTeam.length > 0 && (
        <section aria-labelledby="team" className="relative py-[clamp(64px,9vw,120px)]">
          <span className="disc disc-violet -right-[16vw] top-0" aria-hidden="true" />
          <div className="w-[min(1240px,100%-40px)] mx-auto grid gap-10 lg:grid-cols-[1fr_1.4fr] items-center">
            <div>
              <p className="eyebrow mb-4 reveal">The team</p>
              <h2 id="team" className="h-section reveal">Built by people who ship small.</h2>
              <p className="mt-5 text-fg-2 max-w-[44ch] reveal">
                TaskMesh is built by a small student team. Their own work on the platform is on the board like everyone else’s.
              </p>
              <Link href="/team" className="pill pill-secondary mt-8 reveal">Meet the team</Link>
            </div>
            <ul className="grid gap-4 sm:grid-cols-3">
              {coreTeam.map((m) => (
                <li key={m.id} className="glass lit p-6 reveal">
                  <Avatar src={m.image} name={m.name} size={64} />
                  <p className="mt-5 font-semibold">{m.name}</p>
                  <p className="text-[14px] text-fg-2">{m.role}</p>
                  <Link href={`/portfolio?handle=${encodeURIComponent(m.handle)}`} className="mt-4 inline-block text-[14px] text-warm hover:underline after:absolute after:inset-0">
                    View work
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="cta" className="relative overflow-hidden text-center pt-[clamp(88px,12vw,160px)] pb-[clamp(110px,15vw,200px)]">
        <span aria-hidden="true" className="absolute left-1/2 -bottom-[40%] w-[140vw] h-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_192_138/0.4),transparent)] blur-[40px] -z-10" />
        <div className="w-[min(1240px,100%-40px)] mx-auto reveal">
          <h2 id="cta" className="text-[clamp(48px,8.4vw,140px)] font-semibold leading-[0.92] tracking-[-0.052em]">Stop hiring for weeks.</h2>
          <p className="mt-6 text-fg-2 text-[17px] max-w-[44ch] mx-auto">Post your first project in minutes, or earn by finishing a task this afternoon.</p>
          <div className="mt-9 flex flex-wrap gap-3.5 justify-center">
            <Link href="/decomposer" className="pill pill-primary magnetic">Post a project</Link>
            <Link href="/tasks" className="pill pill-secondary magnetic">Find a task</Link>
          </div>
        </div>
      </section>
    </>
  );
}
