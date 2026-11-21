'use client';

import { useEffect, useRef, useState } from 'react';
import { startCrystal } from './crystal';
import { SCRIPTS } from './demo-data';

const QUESTIONS = SCRIPTS.map((s) => s.question);
const reducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Hero() {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const h1Ref = useRef(null);

  useEffect(
    () => startCrystal({ hero: heroRef.current, canvas: canvasRef.current, h1: h1Ref.current }),
    []
  );

  return (
    <header className="hero" ref={heroRef}>
      <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="hero-inner">
        <h1 className="hero-title" ref={h1Ref}>
          <span>Ask everything</span> <span>your company</span> <span>knows.</span>
        </h1>
        <div className="hero-row">
          <p className="hero-pitch">
            Kaleid reads your documents, tickets and chats, then answers in plain language with the
            sources attached. Nothing is guessed, and nobody sees what they could not open
            themselves.
          </p>
          <div className="hero-ask">
            <AskButton />
            <p className="fine">Free for teams of five. No card needed.</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function AskButton() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(QUESTIONS[0]);
  const indexRef = useRef(0);

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
        const q = QUESTIONS[i];
        indexRef.current = i;
        setIndex(i);
        for (let n = 1; n <= q.length && !cancelled; n++) {
          setTyped(q.slice(0, n));
          await wait(38 + Math.random() * 46);
        }
        await wait(2200);
        for (let n = q.length; n >= 0 && !cancelled; n--) {
          setTyped(q.slice(0, n));
          await wait(16);
        }
        await wait(380);
        i = (i + 1) % QUESTIONS.length;
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  function ask() {
    const i = indexRef.current;
    document.getElementById('demo')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    window.dispatchEvent(new CustomEvent('kaleid:ask', { detail: i }));
  }

  return (
    <button type="button" className="ask glass" onClick={ask} aria-label={`Ask: ${QUESTIONS[index]}`}>
      <span className="ask-beam" aria-hidden="true" />
      <span className="ask-text" aria-hidden="true">
        {typed}
        <span className="caret" />
      </span>
      <span className="ask-send" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
