'use client';

import { useEffect, useState } from 'react';
import { Trash2, Minus, Plus, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { useApp } from './AppProvider';
import { decomposeProject } from '@/lib/actions';
import { PageHeader, money } from './ui/bits';

// A signed-out user who clicks Publish goes through Google sign-in, which reloads the page.
// The brief and the edited plan are parked here and restored when they come back.
const DRAFT_KEY = 'taskmesh:decomposer-draft';

const STEPS = ['Reading the brief', 'Separating design, copy, frontend, backend and QA', 'Ordering tasks by dependency', 'Writing acceptance criteria and prices'];

export default function AIDecomposer() {
  const { addProjectWithTasks, projectTemplates, showToast, currentUser, signInFirst } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    let draft = null;
    try {
      draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY));
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // storage unavailable or corrupt: start empty
    }
    if (!draft) return;
    setTitle(draft.title ?? '');
    setDescription(draft.description ?? '');
    setCategory(draft.category ?? '');
    if (Array.isArray(draft.plan)) setPlan(draft.plan);
  }, []);

  const applyTemplate = (tpl) => {
    setTitle(tpl.title);
    setDescription(tpl.description);
    setCategory(tpl.category);
    setPlan(null);
  };

  async function generate(e) {
    e.preventDefault();
    setBusy(true);
    setStep(0);
    const timer = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 650);
    // Keep the steps visible for a moment even when the server answers instantly.
    const [res] = await Promise.all([decomposeProject({ title, description }), new Promise((r) => setTimeout(r, 2600))]);
    clearInterval(timer);
    setBusy(false);
    if (!res.ok) return showToast('Could not plan this project', res.error, 'error');
    setPlan(res.tasks);
  }

  async function publish() {
    if (!currentUser) {
      try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ title, description, category, plan }));
      } catch {
        // storage unavailable: the draft is lost, sign-in still works
      }
    }
    if (signInFirst()) return;
    setPublishing(true);
    const ok = await addProjectWithTasks({ title, category: category || 'Product development', description }, plan);
    setPublishing(false);
    if (ok) {
      setPlan(null);
      setTitle('');
      setDescription('');
      setCategory('');
    }
  }

  const adjust = (i, delta) => setPlan((p) => p.map((t, j) => (j === i ? { ...t, bounty: Math.max(50, Math.min(5000, t.bounty + delta)) } : t)));
  const remove = (i) => setPlan((p) => p.filter((_, j) => j !== i));
  const total = (plan ?? []).reduce((s, t) => s + t.bounty, 0);

  return (
    <div className="w-[min(1240px,100%-40px)] mx-auto pt-[140px]">
      <PageHeader eyebrow="Post a project" title="Describe it once. Get a plan of small tasks.">
        Instead of hiring one person for six weeks, several specialists finish their parts in parallel. You review the plan and set the prices before anything goes live.
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[5fr_7fr] items-start">
        <form onSubmit={generate} className="glass p-6 sm:p-8 space-y-5">
          {projectTemplates.length > 0 && (
            <div>
              <p className="label">Start from an example</p>
              <div className="flex flex-wrap gap-2">
                {projectTemplates.map((tpl) => (
                  <button key={tpl.title} type="button" onClick={() => applyTemplate(tpl)} className="pill pill-xs shadow-[inset_0_0_0_1px_var(--color-line)] text-fg-2 hover:text-fg">
                    {tpl.title.split(' ').slice(0, 3).join(' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label htmlFor="p-title" className="label">Project name</label>
            <input id="p-title" required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Follow-up email assistant" className="field" />
          </div>
          <div>
            <label htmlFor="p-cat" className="label">Category (optional)</label>
            <input id="p-cat" maxLength={100} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. AI & productivity" className="field" />
          </div>
          <div>
            <label htmlFor="p-desc" className="label">What should it do?</label>
            <textarea id="p-desc" required rows={6} maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Who it is for, the key features, and any technical preferences." className="field" />
          </div>
          <button type="submit" disabled={busy} className="pill pill-primary w-full">
            {busy ? <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Planning…</> : 'Plan the tasks'}
          </button>
          {!currentUser && <p className="text-[13px] text-fg-2 text-center">You can plan without an account. Publishing needs a free sign-in.</p>}
        </form>

        <div aria-live="polite">
          {busy ? (
            <div className="glass p-8 min-h-[420px] flex flex-col justify-center" role="status">
              <p className="text-[20px] font-semibold tracking-tight mb-6">Planning “{title}”</p>
              <ol className="space-y-3">
                {STEPS.map((s, i) => (
                  <li key={s} className={`flex items-center gap-3 text-[15px] ${i > step ? 'text-fg-2/60' : i === step ? 'text-fg' : 'text-fg-2'}`}>
                    {i < step ? <CheckCircle2 className="w-4 h-4 text-ok" aria-hidden="true" /> : i === step ? <Loader2 className="w-4 h-4 animate-spin text-warm" aria-hidden="true" /> : <Circle className="w-4 h-4" aria-hidden="true" />}
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          ) : plan ? (
            <div className="glass p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-line">
                <div>
                  <p className="eyebrow mb-2">Plan ready</p>
                  <h2 className="text-[24px] font-semibold tracking-tight">{plan.length} tasks</h2>
                </div>
                <div className="text-right">
                  <div className="text-[13px] text-fg-2">Total budget</div>
                  <div className="text-[24px] font-semibold tabular-nums">{money(total)}</div>
                </div>
              </div>

              <ol className="space-y-3">
                {plan.map((t, i) => (
                  <li key={`${t.title}-${i}`} className="well p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-[13px] text-fg-2">
                        <span className="font-mono">{String(i + 1).padStart(2, '0')}</span>
                        <span className="tag">{t.category}</span>
                        <span>{t.estimatedHours}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => adjust(i, -10)} aria-label={`Lower price of task ${i + 1}`} className="grid place-items-center w-8 h-8 rounded-full hover:bg-fg/[0.08]"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="w-16 text-center font-semibold tabular-nums">{money(t.bounty)}</span>
                        <button type="button" onClick={() => adjust(i, 10)} aria-label={`Raise price of task ${i + 1}`} className="grid place-items-center w-8 h-8 rounded-full hover:bg-fg/[0.08]"><Plus className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => remove(i)} aria-label={`Remove task ${i + 1}`} className="grid place-items-center w-8 h-8 rounded-full text-fg-2 hover:text-danger hover:bg-fg/[0.08]"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <p className="font-medium">{t.title}</p>
                    {t.deliverables?.[0] && <p className="text-[14px] text-fg-2">Deliverable: {t.deliverables[0]}</p>}
                    {i > 0 && <p className="text-[13px] text-fg-2">Opens when task {String(i).padStart(2, '0')} is done.</p>}
                  </li>
                ))}
              </ol>

              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between pt-5 border-t border-line">
                <button type="button" onClick={() => setPlan(null)} className="pill pill-ghost">Start over</button>
                <button type="button" onClick={publish} disabled={publishing || plan.length === 0} className="pill pill-primary">
                  {publishing ? <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Publishing…</> : `Publish ${plan.length} tasks`}
                </button>
              </div>
            </div>
          ) : (
            <div className="glass p-10 min-h-[420px] grid place-items-center text-center">
              <div className="max-w-sm">
                <p className="text-[20px] font-semibold tracking-tight">Your plan will appear here.</p>
                <p className="mt-2 text-fg-2">Describe the project or start from an example. You can change prices and remove tasks before publishing.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
