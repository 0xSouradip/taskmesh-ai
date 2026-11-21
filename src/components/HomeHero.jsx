'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { startCrystal } from './ui/crystal';

const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// `examples`: short search phrases taken from real open tasks.
export default function HomeHero({ examples }) {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const h1Ref = useRef(null);

  useEffect(() => startCrystal({ hero: heroRef.current, canvas: canvasRef.current, h1: h1Ref.current }), []);

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden" ref={heroRef}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block" />
      <div className="relative w-[min(1240px,100%-40px)] mx-auto pt-[130px] pb-[72px]">
        <h1 ref={h1Ref} className="hero-title h-display">
          <span>Big projects,</span> <span>shipped as</span> <span>small tasks.</span>
        </h1>
        <div className="mt-14 grid gap-10 md:grid-cols-2 items-end animate-[fade-up_1.1s_0.25s_cubic-bezier(0.2,0.7,0.2,1)_both]">
          <div className="space-y-7">
            <p className="text-fg-2 text-[17px] max-w-[46ch]">
              Post a project and TaskMesh splits it into small, clearly specified tasks. Specialists pick up what they are best at, AI checks every delivery against its acceptance criteria, and payment goes out the moment it passes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/tasks" className="pill pill-primary magnetic">Browse open tasks</Link>
              <Link href="/decomposer" className="pill pill-secondary magnetic">Post a project</Link>
            </div>
          </div>
          <div className="md:justify-self-end w-full max-w-[520px]">
            <SearchTeaser examples={examples} />
            <p className="mt-3 text-[13px] text-fg-2">Free to join. Sign in with Google.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Types example searches one character at a time; pressing it opens the board with that search.
function SearchTeaser({ examples }) {
  const router = useRouter();
  const list = examples.length ? examples : ['React component', 'Figma design', 'API endpoint'];
  const [typed, setTyped] = useState(list[0]);
  const current = useRef(list[0]);

  useEffect(() => {
    if (reducedMotion()) return;
    let cancelled = false;
    let timer;
    const wait = (ms) => new Promise((r) => (timer = setTimeout(r, ms)));
    (async () => {
      let i = 0;
      setTyped('');
      await wait(1400);
      while (!cancelled) {
        const q = list[i % list.length];
        current.current = q;
        for (let n = 1; n <= q.length && !cancelled; n++) {
          setTyped(q.slice(0, n));
          await wait(40 + Math.random() * 45);
        }
        await wait(2000);
        for (let n = q.length; n >= 0 && !cancelled; n--) {
          setTyped(q.slice(0, n));
          await wait(16);
        }
        await wait(360);
        i++;
      }
    })();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- examples are fixed for the page life
  }, []);

  return (
    <button
      type="button"
      onClick={() => router.push(`/tasks?q=${encodeURIComponent(current.current)}`)}
      aria-label={`Search tasks for ${current.current}`}
      className="glass relative w-full h-16 flex items-center gap-3.5 pl-6 pr-2.5 !rounded-full text-left transition-transform duration-700 ease-spring hover:scale-[1.02] active:scale-[0.98]"
    >
      <span className="beam" aria-hidden="true" />
      <Search className="w-5 h-5 text-fg-2 shrink-0" aria-hidden="true" />
      <span className="flex-1 min-w-0 truncate text-[16px]" aria-hidden="true">
        {typed}
        <span className="inline-block w-0.5 h-[1.1em] ml-0.5 align-[-0.18em] bg-warm animate-[pulse_1s_steps(1)_infinite]" />
      </span>
      <span className="grid place-items-center w-11 h-11 rounded-full bg-fg text-[#0b0b10] shrink-0" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 12h14M13 5.5 19.5 12 13 18.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </button>
  );
}
