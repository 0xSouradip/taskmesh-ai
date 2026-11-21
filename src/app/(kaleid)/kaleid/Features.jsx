'use client';

import { useEffect, useState } from 'react';
import { CrystalMark } from './CrystalMark';

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Features() {
  return (
    <div className="features">
      <Permissions />
      <Sources />
      <Speed />
      <Languages />
    </div>
  );
}

const PEOPLE = [
  { id: 'amara', name: 'Amara', role: 'Finance' },
  { id: 'jo', name: 'Jo', role: 'Support' },
  { id: 'lin', name: 'Lin', role: 'Contractor' },
];

const SENTENCES = [
  { text: 'The Northwind contract renews on 1 March.', hide: [] },
  { text: 'Refunds over €500 need a team lead to sign off.', hide: ['lin'] },
  { text: 'Q3 revenue closed 6% above plan.', hide: ['jo', 'lin'] },
];

function Permissions() {
  // Visuals come from CSS :has(); this state only keeps screen readers in step with the blur.
  const [who, setWho] = useState('amara');
  return (
    <article className="tile glass lit reveal t-perm">
      <h3 className="tile-h">It only knows what you may know.</h3>
      <fieldset className="who">
        <legend className="sr-only">Answer as</legend>
        <span className="who-thumb" aria-hidden="true" />
        {PEOPLE.map((p) => (
          <label key={p.id} className="who-opt">
            <input type="radio" name="who" id={`who-${p.id}`} value={p.id} aria-label={`${p.name}, ${p.role}`} checked={who === p.id} onChange={() => setWho(p.id)} />
            <span className="who-name">{p.name}</span>
            <span className="who-role">{p.role}</span>
          </label>
        ))}
      </fieldset>
      <div className="perm-answer">
        {SENTENCES.map((s) => (
          <span key={s.text} data-hide={s.hide.join(' ')} aria-hidden={s.hide.includes(who) || undefined}>
            {s.text}{' '}
          </span>
        ))}
      </div>
      <p className="perm-note" data-for="amara">Amara can open all three sources, so she sees all three sentences.</p>
      <p className="perm-note" data-for="jo">The revenue figure lives in a Finance folder Jo cannot open, so Kaleid leaves it out.</p>
      <p className="perm-note" data-for="lin">Lin&apos;s contractor access covers shared contracts only. Internal policy and finance stay hidden.</p>
    </article>
  );
}

const APPS = ['Docs', 'Drive', 'Mail', 'Chat', 'Tickets', 'Wiki', 'CRM'];

function Sources() {
  return (
    <article className="tile glass lit reveal t-sources">
      <h3 className="tile-h">Reads where the work already lives.</h3>
      <div className="orbit" aria-hidden="true">
        <span className="orbit-ring r1" />
        <span className="orbit-ring r2" />
        <span className="orbit-core">
          <CrystalMark size={30} />
        </span>
        {APPS.map((a, i) => (
          <span
            key={a}
            className={`app ${i < 4 ? 'o1' : 'o2'}`}
            style={{ '--i': i < 4 ? i / 4 : (i - 4) / 3 }}
          >
            {a}
          </span>
        ))}
      </div>
      <p className="tile-p">Documents, mail, chat, tickets and wikis, indexed where they sit. Nothing to migrate.</p>
    </article>
  );
}

let barId = 27; // initial bars use ids 0..26 (deterministic for SSR)
const sample = () => ({ id: barId++, h: 26 + Math.random() * 64 });

function Speed() {
  const [bars, setBars] = useState(() => Array.from({ length: 27 }, (_, i) => ({ id: i, h: 26 + ((i * 37) % 60) })));

  useEffect(() => {
    if (reducedMotion()) return;
    const t = setInterval(() => setBars((b) => [...b.slice(1), sample()]), 1100);
    return () => clearInterval(t);
  }, []);

  return (
    <article className="tile glass lit reveal t-speed">
      <h3 className="tile-h">Fast enough to interrupt.</h3>
      <p className="big">
        1.8 s <span>median</span>
      </p>
      <div className="bars" aria-hidden="true">
        {bars.map((b, i) => (
          <span key={b.id} className={`bar ${i === 0 ? 'out' : ''}`} style={{ '--h': `${b.h}%` }} />
        ))}
      </div>
    </article>
  );
}

const LANGS = [
  { code: 'EN', q: 'How many days of leave do I get?', a: '27 days a year, up from 25.' },
  { code: 'FR', q: 'Combien de jours de congé ai-je ?', a: '27 jours par an, contre 25 auparavant.' },
  { code: 'DE', q: 'Wie viele Urlaubstage habe ich?', a: '27 Tage im Jahr, bisher waren es 25.' },
  { code: 'JA', q: '有給休暇は何日ありますか？', a: '年27日です。以前は25日でした。' },
];

function Languages() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    const t = setInterval(() => setI((n) => (n + 1) % LANGS.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <article className="tile glass lit reveal t-lang">
      <h3 className="tile-h">Answers in the language of the question.</h3>
      <div className="langs">
        {LANGS.map((l, n) => (
          <div key={l.code} className={`lang ${n === i ? 'on' : ''}`} lang={l.code.toLowerCase()} aria-hidden={n !== i}>
            <span className="lang-code">{l.code}</span>
            <p className="lang-q">{l.q}</p>
            <p className="lang-a">{l.a}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
