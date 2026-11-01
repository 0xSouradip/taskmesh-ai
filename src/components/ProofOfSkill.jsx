import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  ExternalLink,
  Flame,
  Coins,
  Copy,
  Check,
  Zap,
  Sparkles,
  Lock,
  Code2,
  FileCheck,
  Star,
  Users,
  Mail
} from 'lucide-react';

export default function ProofOfSkill() {
  const { freelancers, tasks } = useApp();
  const [selectedHandle, setSelectedHandle] = useState('0xSouradip');
  const [copied, setCopied] = useState(false);

  const activeSpecialist = freelancers.find(f => f.handle === selectedHandle) || freelancers[0];

  // Find all tasks completed by this specialist
  const completedTasks = tasks.filter(
    (t) => t.status === 'COMPLETED' && (t.claimedBy === activeSpecialist.handle || (activeSpecialist.handle === '0xSouradip' && t.claimedBy === '0xSouradip'))
  );

  const handleShare = () => {
    navigator.clipboard.writeText(
      `https://taskmesh.ai/proof/${activeSpecialist.handle}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              The Anti-Resume
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Verifiable Proof-of-Work
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Proof of Skill Ledger
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Resumes lie. Finished micro-tasks don't. Inspect the cryptographic and executable evidence of what each builder has actually built, tested, and shipped.
          </p>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all self-start md:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Proof Link Copied!' : `Share @${activeSpecialist.handle}'s Proof`}</span>
        </button>
      </div>

      {/* Engineer Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          Inspect Builder:
        </span>
        {freelancers.map((f) => {
          const isSelected = f.handle === activeSpecialist.handle;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedHandle(f.handle)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 ring-1 ring-indigo-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              <img
                src={f.avatar}
                alt={f.name}
                className="w-5 h-5 rounded-md object-cover ring-1 ring-slate-700"
              />
              <span>{f.name}</span>
              {f.isFoundingTeam && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Team
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={activeSpecialist.avatar}
                alt={activeSpecialist.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-lg"
              />
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg bg-indigo-600 text-white text-xs font-extrabold shadow-md">
                Lvl {activeSpecialist.level}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {activeSpecialist.name}
                </h3>
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  @{activeSpecialist.handle}
                </span>
                {activeSpecialist.email && (
                  <a
                    href={`mailto:${activeSpecialist.email}`}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300 hover:text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800 hover:border-indigo-500/40 transition-colors"
                    title={`Email ${activeSpecialist.name}`}
                  >
                    <Mail className="w-3 h-3 text-indigo-400" />
                    <span>{activeSpecialist.email}</span>
                  </a>
                )}
                {activeSpecialist.isFoundingTeam && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Founding Team
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-indigo-300 mt-1">
                {activeSpecialist.title}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                {activeSpecialist.bio}
              </p>
            </div>
          </div>

          {/* Quick Verified Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 text-center">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">Total Bounties</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5 flex items-center justify-center">
                <Coins className="w-4 h-4 mr-1 text-emerald-400" />
                ${activeSpecialist.bountiesEarned}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">Earned XP</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5 flex items-center justify-center">
                <Flame className="w-4 h-4 mr-1 text-amber-400" />
                {activeSpecialist.xp}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-400">AI Acceptance</div>
              <div className="text-lg font-bold text-indigo-300 mt-0.5">
                {activeSpecialist.acceptanceRate || 100}%
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Grid: Skill Radar Breakdown vs Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Left Column: Verified Skills Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              Verified Competency Matrix
            </h4>
            <span className="text-xs font-mono text-slate-400">Calculated from Shipped Tasks</span>
          </div>

          <div className="space-y-4">
            {(activeSpecialist.skills || []).map((skill, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{skill.name}</span>
                  <span className="font-mono text-indigo-400 font-bold">{skill.level}% Mastery</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-[1px]">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Verified Achievement Badges */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Proof-of-Work Badges
            </h4>
            <span className="text-xs font-mono text-amber-400">
              {(activeSpecialist.badges || []).length} Unlocked
            </span>
          </div>

          <div className="space-y-3">
            {(activeSpecialist.badges || []).map((badge) => (
              <div
                key={badge.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">{badge.name}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Shipped Proof-of-Work Deliverables Stream */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              Verified Micro-Task Ledger for {activeSpecialist.name}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Every card represents a completed, paid, and AI-inspected unit of work.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {completedTasks.length} Verified Tasks
          </span>
        </div>

        {completedTasks.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <p className="text-sm">No tasks completed by @{activeSpecialist.handle} yet.</p>
            <p className="text-xs mt-1">Claim and complete quests on the Quest Board to generate verifiable proof of skill!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {task.projectName}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Score: {task.submission?.aiReviewScore || 98}/100
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">
                      +${task.bounty} USDC
                    </span>
                    <span className="text-xs font-semibold text-amber-400">
                      +{task.xp} XP
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-300">
                  {task.submission?.notes || task.description}
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{task.submission?.aiFeedback || 'Verified by Autonomous Test Harness.'}</span>
                  </div>

                  {task.submission?.link && (
                    <a
                      href={task.submission.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono text-[11px] font-semibold flex-shrink-0"
                    >
                      <span>Inspect Deliverable</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
