import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  Trophy,
  Users
} from 'lucide-react';

export default function Hero() {
  const { setActiveTab } = useApp();

  return (
    <div className="relative overflow-hidden pt-10 pb-16 md:pt-14 md:pb-24 border-b border-slate-800/60">
      
      {/* Background ambient glowing gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Announcement Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs text-indigo-300 shadow-lg shadow-indigo-500/10 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">The Anti-Resume Revolution:</span>
            <span className="text-slate-300">Modular Micro-Tasks & Autonomous AI Orchestration</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Hiring a freelancer is risky.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
              Break big projects into atomic quests instead.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
            A resume can’t prove someone can do the work, and managing strangers for weeks takes too much time.
            We break projects into <span className="text-white font-medium">small, real tasks</span> that specialists pick up and complete in hours.
            Every finished task is <span className="text-emerald-400 font-medium">verifiable proof of skill</span>, while AI handles the coordination in the background.
          </p>

          {/* Call-to-action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('decomposer')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all text-sm sm:text-base"
            >
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>Decompose a Project with AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold border border-slate-700/80 hover:border-slate-600 shadow-sm transition-all text-sm sm:text-base"
            >
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Browse Open Quests & Bounties</span>
            </button>
          </div>
        </div>

        {/* The 3 Core Pillars Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Modular Micro-Tasks */}
          <div className="glow-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Atomic Specialization
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Someone who designs logos doesn’t need backend code. A great copywriter doesn't need to build the app. Each specialist executes their forte, finishing in 1–4 hours.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center text-xs font-medium text-indigo-400">
              <Zap className="w-3.5 h-3.5 mr-1 text-amber-400" />
              <span>Zero bloated full-stack compromises</span>
            </div>
          </div>

          {/* Card 2: Verifiable Proof-of-Skill */}
          <div className="glow-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Proof-of-Work Over Resumes
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              No unpaid 8-hour interview homework. Every task completed is paid immediately in USDC and locked into an immutable proof ledger showcasing real shipped output.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center text-xs font-medium text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              <span>100% verified executable deliverables</span>
            </div>
          </div>

          {/* Card 3: AI Background Coordination */}
          <div className="glow-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Autonomous AI Coordination
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI maps the dependency graph, enforces acceptance tests, unlocks downstream tasks when prerequisites land, and auto-releases micro-escrow without micromanagement.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center text-xs font-medium text-purple-400">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>Autonomous dependency orchestration</span>
            </div>
          </div>

        </div>

        {/* Live Metrics Ticker Bar */}
        <div className="mt-10 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">2.1 Hours</div>
            <div className="text-xs text-slate-400 mt-0.5">Avg Micro-Task Turnaround</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">0 Hours</div>
            <div className="text-xs text-slate-400 mt-0.5">Client Micromanagement</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">100% Paid</div>
            <div className="text-xs text-slate-400 mt-0.5">Zero Unpaid Test Projects</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">Instant</div>
            <div className="text-xs text-slate-400 mt-0.5">AI Acceptance & Escrow Release</div>
          </div>
        </div>

      </div>
    </div>
  );
}
