'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X, Clock, CheckCircle2, XCircle, ExternalLink, Loader2, Lock, Mail } from 'lucide-react';
import { useApp } from './AppProvider';
import { StatusTag, money } from './ui/bits';

// Task details as a native <dialog>: focus trap, Esc to close and backdrop come from the browser.
// What it shows depends on who is looking: anyone, the specialist who claimed it, or the project owner.
export default function TaskModal() {
  const { selectedTask: task, setSelectedTask, tasks, currentUser, claimTask, releaseTask, submitTask, reviewSubmission } = useApp();
  const ref = useRef(null);
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [ownerNote, setOwnerNote] = useState('');
  const [busy, setBusy] = useState(null); // 'submit' | 'accept' | 'changes' | 'release' | 'claim'

  useEffect(() => {
    const d = ref.current;
    if (task && !d.open) d.showModal();
    if (!task && d.open) d.close();
  }, [task]);

  const close = () => setSelectedTask(null);
  const act = async (kind, fn) => {
    setBusy(kind);
    const ok = await fn();
    setBusy(null);
    return ok;
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (await act('submit', () => submitTask(task.id, { link, notes }))) {
      setLink('');
      setNotes('');
    }
  }

  const prereqs = (task?.prerequisites ?? []).map((id) => tasks.find((t) => t.id === id) ?? { id, title: 'Unknown task', status: 'AVAILABLE' });
  const { isOwner = false, isClaimer = false } = task?.viewer ?? {};
  const sub = task?.submission;
  const sentBack = sub?.status === 'changes_requested';

  return (
    <dialog ref={ref} className="sheet" aria-labelledby="task-title" onClose={close} onClick={(e) => e.target === ref.current && close()}>
      {task && (
        <div className="glass overflow-hidden flex flex-col max-h-[calc(100dvh-24px)]">
          <div className="flex items-start justify-between gap-4 p-6 sm:p-8 pb-0">
            <div className="space-y-3 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusTag status={task.status} />
                {sentBack && task.status === 'IN_PROGRESS' && <span className="tag tag-warm">Changes requested</span>}
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
              <div><div className="text-fg-2">Fee</div><div className="text-[22px] font-semibold tabular-nums">{money(task.bounty)}</div></div>
              <div><div className="text-fg-2">XP</div><div className="text-[22px] font-semibold tabular-nums">{task.xp}</div></div>
              <div><div className="text-fg-2">Estimate</div><div className="text-[22px] font-semibold flex items-center gap-1.5"><Clock className="w-4 h-4 text-fg-2" aria-hidden="true" />{task.estimatedHours}</div></div>
              <div><div className="text-fg-2">Level</div><div className="text-[22px] font-semibold">{task.difficulty}</div></div>
            </div>
            <p className="text-[13px] text-fg-2 -mt-4">
              Posted by <Link href={`/portfolio?handle=${encodeURIComponent(task.ownerHandle ?? '')}`} onClick={close} className="text-fg hover:text-warm">@{task.ownerHandle}</Link>. The owner pays the agreed fee directly once the work is accepted; TaskMesh doesn’t handle payments.
            </p>

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
                {isClaimer ? 'You are working on this task.' : (
                  <>Being worked on by <Link href={`/portfolio?handle=${encodeURIComponent(task.claimedBy)}`} onClick={close} className="text-fg hover:text-warm">@{task.claimedBy}</Link></>
                )}
              </p>
            )}

            {task.contact && (
              <div className="well p-4 flex flex-wrap items-center justify-between gap-3 text-[14px]">
                <span><span className="text-fg-2">{task.contact.role}:</span> {task.contact.name}</span>
                {task.contact.email && (
                  <a href={`mailto:${task.contact.email}`} className="inline-flex items-center gap-1.5 text-warm hover:underline">
                    <Mail className="w-4 h-4" aria-hidden="true" /> {task.contact.email}
                  </a>
                )}
                <span className="w-full text-[12px] text-fg-2">Visible only to the project owner and the specialist on this task.</span>
              </div>
            )}

            {sub && (
              <Section title={sub.status === 'accepted' ? 'Accepted delivery' : sub.status === 'pending' ? 'Submitted for review' : 'Last submission'}>
                <div className="well p-5 space-y-3 text-[14px]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span>{sub.author} · {sub.submittedAt}{sub.attempts > 1 ? ` · attempt ${sub.attempts}` : ''}</span>
                    {sub.status === 'accepted' && <span className="tag tag-ok">Accepted by the owner</span>}
                  </div>
                  <a href={sub.link} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 text-warm hover:underline break-all">
                    {sub.link} <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </a>
                  {sub.notes && <p className="text-fg-2 whitespace-pre-line">{sub.notes}</p>}

                  {sub.ownerNote && (
                    <div className="border-t border-line pt-3">
                      <p className="text-[13px] font-medium mb-1">{sub.status === 'changes_requested' ? 'Changes requested by the owner' : 'Owner’s note'}</p>
                      <p className="whitespace-pre-line">{sub.ownerNote}</p>
                    </div>
                  )}

                  {(isOwner || isClaimer) && sub.status !== 'accepted' && <AiAdvice ai={sub.ai} />}
                </div>
              </Section>
            )}

            {task.status === 'BLOCKED' && (
              <div className="well p-4 flex gap-3 text-[14px] text-fg-2">
                <Lock className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                This task opens automatically when the tasks it depends on are accepted.
              </div>
            )}

            {/* Specialist: submit or resubmit. */}
            {isClaimer && task.status === 'IN_PROGRESS' && (
              <Section title={sentBack ? 'Resubmit your work' : 'Submit your work'}>
                {busy === 'submit' ? (
                  <div className="well p-6 flex items-center gap-3" role="status">
                    <Loader2 className="w-5 h-5 animate-spin text-warm" aria-hidden="true" />
                    <span>Saving and running the AI check. This can take up to a minute…</span>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="deliverable" className="label">Link to your work</label>
                      <input id="deliverable" type="url" required value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://github.com/you/repo/pull/12" className="field" />
                    </div>
                    <div>
                      <label htmlFor="notes" className="label">Notes for the owner (optional)</label>
                      <textarea id="notes" rows={3} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How each acceptance criterion is met" className="field" />
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between">
                      <button type="button" disabled={Boolean(busy)} onClick={() => act('release', () => releaseTask(task.id))} className="pill pill-ghost">
                        {busy === 'release' ? 'Releasing…' : 'Give this task back'}
                      </button>
                      <button type="submit" disabled={Boolean(busy)} className="pill pill-primary">Submit for review</button>
                    </div>
                  </form>
                )}
              </Section>
            )}

            {isClaimer && task.status === 'IN_REVIEW' && (
              <p className="well p-4 text-[14px] text-fg-2">Waiting for the project owner to accept it or ask for changes.</p>
            )}

            {/* Owner: decide on a submission. */}
            {isOwner && task.status === 'IN_REVIEW' && (
              <Section title="Your decision">
                <div className="space-y-3">
                  <label htmlFor="owner-note" className="label">Note to the specialist (required when asking for changes)</label>
                  <textarea id="owner-note" rows={3} maxLength={1000} value={ownerNote} onChange={(e) => setOwnerNote(e.target.value)} placeholder="What to fix, or a thank-you" className="field" />
                  <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
                    <button type="button" disabled={Boolean(busy)} onClick={() => act('changes', () => reviewSubmission(task.id, 'changes', ownerNote)).then((ok) => ok && setOwnerNote(''))} className="pill pill-secondary">
                      {busy === 'changes' ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : null} Request changes
                    </button>
                    <button type="button" disabled={Boolean(busy)} onClick={() => act('accept', () => reviewSubmission(task.id, 'accept', ownerNote)).then((ok) => ok && setOwnerNote(''))} className="pill pill-primary">
                      {busy === 'accept' ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : null} Accept work
                    </button>
                  </div>
                  <p className="text-[13px] text-fg-2">Accepting completes the task, credits the specialist’s XP and unlocks tasks that depend on it. Pay the agreed fee directly.</p>
                </div>
              </Section>
            )}

            {isOwner && task.status === 'IN_PROGRESS' && (
              <div className="flex justify-end">
                <button type="button" disabled={Boolean(busy)} onClick={() => act('release', () => releaseTask(task.id))} className="pill pill-ghost pill-sm">
                  {busy === 'release' ? 'Releasing…' : 'Release this claim'}
                </button>
              </div>
            )}
          </div>

          {task.status === 'AVAILABLE' && !task.projectClosed && (
            <div className="p-5 sm:px-8 border-t border-line flex items-center justify-between gap-4">
              <span className="text-[14px] text-fg-2">
                {isOwner ? 'This is your project.' : currentUser ? 'Claim it and it’s yours to deliver.' : 'Sign in with Google to claim.'}
              </span>
              {!isOwner && (
                <button type="button" disabled={Boolean(busy)} onClick={() => act('claim', () => claimTask(task.id))} className="pill pill-primary">
                  {busy === 'claim' ? 'Claiming…' : 'Claim task'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}

function AiAdvice({ ai }) {
  if (!ai) return <p className="border-t border-line pt-3 text-[13px] text-fg-2">AI check unavailable for this submission. The owner reviews it directly.</p>;
  return (
    <div className="border-t border-line pt-3 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium">AI check (advice for the owner)</p>
        <span className="tag">{ai.score}/100</span>
      </div>
      <p className="text-fg-2">{ai.feedback}</p>
      {ai.criteria?.length > 0 && (
        <ul className="space-y-1.5">
          {ai.criteria.map((c) => (
            <li key={c.criterion} className="flex gap-2 text-[13px]">
              {c.met ? <CheckCircle2 className="w-4 h-4 mt-0.5 text-ok shrink-0" aria-label="Met" /> : <XCircle className="w-4 h-4 mt-0.5 text-danger shrink-0" aria-label="Not met" />}
              <span><span className="text-fg">{c.criterion}</span>{c.evidence ? <span className="text-fg-2"> · {c.evidence}</span> : null}</span>
            </li>
          ))}
        </ul>
      )}
      {ai.missing?.length > 0 && <p className="text-[13px] text-fg-2">Possibly missing: {ai.missing.join('; ')}</p>}
    </div>
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
