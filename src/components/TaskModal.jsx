import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Coins,
  Flame,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
  Sparkles,
  AlertCircle,
  FileCode,
  Send,
  Loader2
} from 'lucide-react';

export default function TaskModal() {
  const {
    selectedTask,
    setSelectedTask,
    tasks,
    currentUser,
    claimTask,
    submitTask
  } = useApp();

  const [deliverableLink, setDeliverableLink] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState('');

  if (!selectedTask) return null;

  const currentTaskState = tasks.find(t => t.id === selectedTask.id) || selectedTask;
  const isAvailable = currentTaskState.status === 'AVAILABLE';
  const isInProgress = currentTaskState.status === 'IN_PROGRESS';
  const isCompleted = currentTaskState.status === 'COMPLETED';
  const isBlocked = currentTaskState.status === 'BLOCKED';

  // Check prerequisites
  const prerequisiteTasks = (currentTaskState.prerequisites || []).map(prereqId => {
    return tasks.find(t => t.id === prereqId) || { id: prereqId, title: 'Prerequisite Task', status: 'UNKNOWN' };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!deliverableLink) {
      alert('Please provide a deliverable URL (GitHub repo, PR, Figma link, or Gist)');
      return;
    }

    setIsVerifying(true);
    setVerifyStep('Initiating autonomous AI test harness...');

    setTimeout(() => {
      setVerifyStep('Analyzing compliance against acceptance criteria...');
    }, 900);

    setTimeout(() => {
      setVerifyStep('Extracting metrics and verifying execution integrity...');
    }, 1800);

    setTimeout(() => {
      submitTask(currentTaskState.id, {
        link: deliverableLink,
        notes: submissionNotes
      });
      setIsVerifying(false);
      setVerifyStep('');
    }, 2700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 text-left animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {currentTaskState.projectName}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID: {currentTaskState.id}
            </span>
          </div>

          <button
            onClick={() => setSelectedTask(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Title & Rewards Header */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {currentTaskState.category}
              </span>

              {/* Reward Pills */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-emerald-400 font-bold text-base bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                  <Coins className="w-4 h-4 mr-1.5 text-emerald-400" />
                  ${currentTaskState.bounty} USDC
                </div>
                <div className="flex items-center text-amber-400 font-bold text-sm bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                  <Flame className="w-4 h-4 mr-1 text-amber-400" />
                  +{currentTaskState.xp} XP
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white leading-snug">
              {currentTaskState.title}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Estimated: {currentTaskState.estimatedHours}
              </span>
              <span>•</span>
              <span>Difficulty: <strong className="text-slate-200">{currentTaskState.difficulty}</strong></span>
              {currentTaskState.claimedBy && (
                <>
                  <span>•</span>
                  <span>Claimed by: <strong className="text-indigo-400">@{currentTaskState.claimedBy}</strong></span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-2 font-semibold">
              Mission Brief & Context
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {currentTaskState.description}
            </p>
          </div>

          {/* Expected Deliverables */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-2 font-semibold flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-indigo-400" />
              Required Modular Deliverables
            </h4>
            <ul className="space-y-2">
              {currentTaskState.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Automated AI Acceptance Criteria */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-2 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Automated Acceptance Criteria (AI Verified)
            </h4>
            <div className="space-y-2">
              {currentTaskState.acceptanceCriteria.map((crit, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{crit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prerequisites Graph Status */}
          {prerequisiteTasks.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <h4 className="text-xs font-mono uppercase text-slate-400 mb-2.5 font-semibold">
                Upstream Prerequisites ({prerequisiteTasks.length})
              </h4>
              <div className="space-y-2">
                {prerequisiteTasks.map((prereq) => {
                  const isPrereqDone = prereq.status === 'COMPLETED';
                  return (
                    <div
                      key={prereq.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                    >
                      <span className="text-slate-300 font-medium truncate max-w-md">
                        {prereq.title}
                      </span>
                      {isPrereqDone ? (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Done
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Case 1: COMPLETED - Show proof of work */}
          {isCompleted && currentTaskState.submission && (
            <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Proof-of-Skill Deliverable
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  AI Score: {currentTaskState.submission.aiReviewScore}/100
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-1.5">
                <p><strong>Completed by:</strong> {currentTaskState.submission.author}</p>
                <p><strong>Timestamp:</strong> {currentTaskState.submission.submittedAt}</p>
                <p className="flex items-center gap-1.5">
                  <strong>Artifact Link:</strong>{' '}
                  <a
                    href={currentTaskState.submission.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    {currentTaskState.submission.link}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
                <p><strong>Notes:</strong> {currentTaskState.submission.notes}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-emerald-500/20 text-xs text-slate-300">
                <div className="text-[11px] font-mono text-emerald-400 mb-1 font-semibold">
                  Autonomous Verification Audit:
                </div>
                {currentTaskState.submission.aiFeedback}
              </div>
            </div>
          )}

          {/* Case 2: IN_PROGRESS - Submit deliverable form */}
          {isInProgress && (
            <div className="p-5 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-400" />
                Submit Finished Micro-Task Deliverable
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                Paste your GitHub commit/PR, Figma URL, or live preview. AI will immediately evaluate compliance and release escrow.
              </p>

              {isVerifying ? (
                <div className="py-8 text-center space-y-3 bg-slate-950/60 rounded-xl border border-indigo-500/20">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                  <div className="text-sm font-semibold text-white">AI Acceptance Engine Running...</div>
                  <div className="text-xs font-mono text-indigo-300">{verifyStep}</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Deliverable Link (GitHub, Figma, Gist, or Loom) *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/0xSouradip/my-task-solution"
                      value={deliverableLink}
                      onChange={(e) => setDeliverableLink(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Execution Notes & Testing Summary
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Briefly state how you fulfilled the acceptance criteria, token specs, or unit test passes..."
                      value={submissionNotes}
                      onChange={(e) => setSubmissionNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>Run AI Acceptance Verification & Claim ${currentTaskState.bounty}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Case 3: BLOCKED */}
          {isBlocked && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-white block mb-0.5">Task Dependency Locked</span>
                This micro-task is waiting on upstream deliverables. As soon as the prerequisite specialist finishes their task, this quest will unlock automatically.
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={() => setSelectedTask(null)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Close
          </button>

          {isAvailable && (
            <button
              onClick={() => claimTask(currentTaskState.id)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
            >
              Claim Quest (+${currentTaskState.bounty} USDC)
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
