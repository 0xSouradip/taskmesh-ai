'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X, Clock, CheckCircle2, ExternalLink, Loader2, Lock } from 'lucide-react';
import { useApp } from './AppProvider';
import { StatusTag, money } from './ui/bits';

const VERIFY_STEPS = ['Checking the link', 'Comparing against acceptance criteria', 'Releasing payment'];

// Task details as a native <dialog>: focus trap, Esc to close and backdrop come from the browser.
export default function TaskModal() {
  const { selectedTask: task, setSelectedTask, tasks, currentUser, claimTask, submitTask } = useApp();
  const ref = useRef(null);
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const d = ref.current;
    if (task && !d.open) d.showModal();
    if (!task && d.open) d.close();
  }, [task]);

  const close = () => setSelectedTask(null);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setStep(0);
    const timers = [setTimeout(() => setStep(1), 800), setTimeout(() => setStep(2), 1600)];
    const [ok] = await Promise.all([submitTask(task.id, { link, notes }), new Promise((r) => setTimeout(r, 2200))]);
    timers.forEach(clearTimeout);
    setBusy(false);
    if (ok) {
      setLink('');
      setNotes('');
    }
  }

  const prereqs = (task?.prerequisites ?? []).map((id) => tasks.find((t) => t.id === id) ?? { id, title: 'Unknown task', status: 'AVAILABLE' });
  const mine = task?.status === 'IN_PROGRESS' && task.claimedBy && task.claimedBy === currentUser?.handle;

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="task-title"
      onClose={close}
      onClick={(e) => e.target === ref.current && close()}
    >
      {task && (
        <div className="glass overflow-hidden flex flex-col max-h-[calc(100dvh-24px)]">
          <div className="flex items-start justify-between gap-4 p-6 sm:p-8 pb-0">
            <div className="space-y-3 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusTag status={task.status} />
                <span className="tag">{task.category}</span>
                <span className="text-[13px] text-fg-2 truncate">{task.projectName}</span>
              </div>
              <h2 id="task-title" className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.03em] leading-tight">{task.title}</h2>
            </div>
            <button type="button" onClick={close} aria-label="Close" className="grid place-items-center w-10 h-10 shrink-0 rounded-full hover:bg-fg/[0.07]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 sm:p-8 space-y-7">
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-[14px]">
              <div><div className="text-fg-2">Pays</div><div className="text-[22px] font-semibold tabular-nums">{money(task.bounty)}</div></div>
              <div><div className="text-fg-2">XP</div><div className="text-[22px] font-semibold tabular-nums">{task.xp}</div></div>
              <div><div className="text-fg-2">Estimate</div><div className="text-[22px] font-semibold flex items-center gap-1.5"><Clock className="w-4 h-4 text-fg-2" aria-hidden="true" />{task.estimatedHours}</div></div>
              <div><div className="text-fg-2">Level</div><div className="text-[22px] font-semibold">{task.difficulty}</div></div>
            </div>

            <p className="text-[16px] text-fg/90">{task.description}</p>

            <Section title="Deliverables">
              <ul className="space-y-2">
                {task.deliverables.map((d) => (
                  <li key={d} className="flex gap-3 text-[15px]"><span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-warm shrink-0" />{d}</li>
                ))}
              </ul>
            </Section>

            <Section title="Acceptance criteria">
              <ul className="space-y-2">
                {task.acceptanceCriteria.map((c) => (
                  <li key={c} className="flex gap-3 text-[15px]"><CheckCircle2 className="w-4 h-4 mt-1 text-fg-2 shrink-0" aria-hidden="true" />{c}</li>
                ))}
              </ul>
            </Section>

            {prereqs.length > 0 && (
              <Section title={`Depends on ${prereqs.length} task${prereqs.length > 1 ? 's' : ''}`}>
                <ul className="space-y-2">
                  {prereqs.map((p) => (
                    <li key={p.id} className="well px-4 py-3 flex items-center justify-between gap-3 text-[14px]">
                      <span className="truncate">{p.title}</span>
                      <StatusTag status={p.status} />
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {task.claimedBy && task.status !== 'COMPLETED' && (
              <p className="text-[14px] text-fg-2">
                Claimed by{' '}
                <Link href={`/portfolio?handle=${encodeURIComponent(task.claimedBy)}`} onClick={close} className="text-fg hover:text-warm">@{task.claimedBy}</Link>
              </p>
            )}

            {task.status === 'COMPLETED' && task.submission && (
              <Section title="Verified delivery">
                <div className="well p-5 space-y-3 text-[14px]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span>{task.submission.author} · {task.submission.submittedAt}</span>
                    <span className="tag tag-ok">Score {task.submission.aiReviewScore}/100</span>
                  </div>
                  <a href={task.submission.link} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 text-warm hover:underline break-all">
                    {task.submission.link} <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </a>
                  {task.submission.notes && <p className="text-fg-2">{task.submission.notes}</p>}
                  <p className="text-fg-2 border-t border-line pt-3">{task.submission.aiFeedback}</p>
                </div>
              </Section>
            )}

            {task.status === 'BLOCKED' && (
              <div className="well p-4 flex gap-3 text-[14px] text-fg-2">
                <Lock className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                This task opens automatically when the tasks it depends on are finished.
              </div>
            )}

            {mine && (
              <Section title="Submit your work">
                {busy ? (
                  <div className="well p-6 flex items-center gap-3" role="status">
                    <Loader2 className="w-5 h-5 animate-spin text-warm" aria-hidden="true" />
                    <span>{VERIFY_STEPS[step]}…</span>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="deliverable" className="label">Link to your work</label>
                      <input id="deliverable" type="url" required value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://github.com/you/repo/pull/12" className="field" />
                    </div>
                    <div>
                      <label htmlFor="notes" className="label">Notes for the reviewer (optional)</label>
                      <textarea id="notes" rows={3} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How each acceptance criterion is met" className="field" />
                    </div>
                    <button type="submit" className="pill pill-primary w-full">Submit for review · {money(task.bounty)}</button>
                  </form>
                )}
              </Section>
            )}
          </div>

          {task.status === 'AVAILABLE' && (
            <div className="p-5 sm:px-8 border-t border-line flex items-center justify-between gap-4">
              <span className="text-[14px] text-fg-2">{currentUser ? 'Claim it and it’s yours to deliver.' : 'Sign in with Google to claim.'}</span>
              <button type="button" onClick={() => claimTask(task.id)} className="pill pill-primary">Claim task</button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h3 className="text-[13px] font-medium text-fg-2 mb-3">{title}</h3>
      {children}
    </section>
  );
}
