'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { SCRIPTS } from './demo-data';

const EMPTY = { run: 0, script: null, question: false, sourcesIn: 0, tokens: 0, active: 0, cited: [], status: '', reading: false, done: false };

export default function Demo() {
  const [state, setState] = useState(EMPTY);
  const [hover, setHover] = useState(0);
  const runId = useRef(0);
  const started = useRef(false);
  const panelRef = useRef(null);

  async function play(index) {
    const id = ++runId.current;
    started.current = true;
    const script = SCRIPTS[index];
    const n = script.sources.length;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const set = (patch) => runId.current === id && setState((s) => ({ ...s, ...patch }));
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const alive = () => runId.current === id;
    const final = `Answered in 1.5 s from ${n} sources.`;

    setHover(0);
    if (reduced) {
      const cites = script.answer.filter((t) => typeof t === 'object').map((t) => t.cite);
      setState({ run: id, script: index, question: true, sourcesIn: n, tokens: script.answer.length, active: 0, cited: cites, status: final, reading: false, done: true });
      return;
    }

    setState({ ...EMPTY, run: id, script: index, question: true });
    await wait(420);
    if (!alive()) return;
    set({ status: `Reading ${n} sources`, reading: true });
    for (let i = 1; i <= n; i++) {
      await wait(i === 1 ? 260 : 300);
      if (!alive()) return;
      set({ sourcesIn: i });
    }
    await wait(650);
    if (!alive()) return;
    set({ status: 'Writing the answer', reading: false });

    for (let t = 0; t < script.answer.length; t++) {
      const tok = script.answer[t];
      if (!alive()) return;
      if (typeof tok === 'object') {
        setState((s) => (runId.current === id ? { ...s, tokens: t + 1, active: tok.cite, cited: [...s.cited, tok.cite] } : s));
        await wait(320);
      } else {
        set({ tokens: t + 1 });
        await wait(35 + Math.random() * 30);
      }
    }
    if (!alive()) return;
    await wait(250);
    set({ status: final, done: true });
  }

  // Ask button in the hero.
  useEffect(() => {
    const onAsk = (e) => play(Number(e.detail) || 0);
    window.addEventListener('kaleid:ask', onAsk);
    return () => window.removeEventListener('kaleid:ask', onAsk);
  }, []);

  // First question plays once, when the panel is 35% visible.
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          io.disconnect();
          play(0);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(panelRef.current);
    return () => io.disconnect();
  }, []);

  const script = state.script === null ? null : SCRIPTS[state.script];
  const lit = hover || state.active;

  return (
    <div className="demo-grid">
      <div className="demo-intro reveal">
        <h2 className="h2">It shows its work.</h2>
        <p className="lede">Every answer arrives with the passages it came from, so checking takes a glance.</p>
        <div className="demo-questions" role="group" aria-label="Example questions">
          {SCRIPTS.map((s, i) => (
            <button
              key={s.label}
              type="button"
              className={`qbtn ${state.script === i ? 'on' : ''}`}
              aria-pressed={state.script === i}
              onClick={() => play(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="demo-panel glass lit reveal" ref={panelRef}>
        <div className="chat">
          {script && state.question && (
            <div className="bubble" key={`q${state.run}`}>
              {script.question}
            </div>
          )}
          <div className={`status ${state.reading ? 'shimmer' : ''}`} role="status">
            {state.status}
          </div>
          {script && (
            <p className="answer" key={`a${state.run}`}>
              {script.answer.slice(0, state.tokens).map((tok, i) =>
                typeof tok === 'object' ? (
                  <Fragment key={i}>
                  <button
                    type="button"
                    className={`chip ${lit === tok.cite ? 'lit' : ''}`}
                    aria-label={`Source: ${script.sources[tok.cite - 1].title}`}
                    onMouseEnter={() => setHover(tok.cite)}
                    onMouseLeave={() => setHover(0)}
                    onFocus={() => setHover(tok.cite)}
                    onBlur={() => setHover(0)}
                  >
                    {tok.cite}
                  </button>{' '}
                  </Fragment>
                ) : (
                  <span key={i} className="w">
                    {tok}
                    {/* No space before a citation, so its chip never wraps away from the sentence. */}
                    {typeof script.answer[i + 1] === 'object' ? '' : ' '}
                  </span>
                )
              )}
            </p>
          )}
        </div>

        <ol className="sources" aria-label="Sources">
          {script?.sources.map((src, i) => {
            const n = i + 1;
            return (
              <li
                key={`${state.run}-${n}`}
                tabIndex={0}
                className={[
                  'card',
                  i < state.sourcesIn ? 'in' : '',
                  lit === n ? 'active' : '',
                  state.cited.includes(n) ? 'cited' : '',
                ].join(' ')}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onFocus={() => setHover(n)}
                onBlur={() => setHover(0)}
              >
                <span className="card-n" aria-hidden="true">{n}</span>
                <span className="card-title">{src.title}</span>
                <span className="card-kind">{src.kind}</span>
                <span className="card-text">
                  {src.before}
                  <span className="quote">{src.quote}</span>
                  {src.after}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
