'use client';

import React, { useState } from 'react';
import {
  XCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame,
  FileQuestion,
  Users2
} from 'lucide-react';

export default function ComparisonSection() {
  const comparisons = [
    {
      factor: 'Vetting & Skill Proof',
      traditional: {
        title: 'Over-inflated resumes & PDF portfolios',
        desc: 'Can’t tell if someone wrote the code or copied an open source template. Unreliable claims and fake testimonials.'
      },
      taskmesh: {
        title: 'Verifiable Proof-of-Skill Ledger',
        desc: 'Direct inspectable commits, design tokens, and benchmarks from real modular tasks verified by automated AI test suites.'
      }
    },
    {
      factor: 'Management Overhead',
      traditional: {
        title: '10+ hours/week chasing updates',
        desc: 'Constantly pinging freelancers on Slack/WhatsApp, managing strangers across timezones, praying milestones are met.'
      },
      taskmesh: {
        title: '0 hours: AI Autonomous Orchestrator',
        desc: 'AI manages the DAG dependency tree, unlocks tasks sequentially, notifies contributors, and verifies acceptance criteria.'
      }
    },
    {
      factor: 'Freelancer Experience',
      traditional: {
        title: 'Unpaid 8-hour test project burnout',
        desc: 'Top talent refuses unpaid test homework. Candidates who do submit are frequently ghosted without feedback or compensation.'
      },
      taskmesh: {
        title: 'Instant bounties on atomic quests',
        desc: 'Zero unpaid tests. Every 2-hour task awards immediate cash bounties and permanent XP on their verifiable skill radar.'
      }
    },
    {
      factor: 'Team Specialization',
      traditional: {
        title: 'Jack-of-all-trades compromises',
        desc: 'Forcing a backend developer to design your logo and a copywriter to configure database schemas leads to sloppy work.'
      },
      taskmesh: {
        title: 'Hyper-focused domain specialists',
        desc: 'Designers craft tokens, writers polish microcopy, backend specialists build idempotent webhooks. Everyone does what they love.'
      }
    },
    {
      factor: 'Culture & Vibe',
      traditional: {
        title: 'Adversarial contract disputes',
        desc: 'Scope creep battles, delayed escrow arbitrations, and micromanagement stress feel like an exhausting chore.'
      },
      taskmesh: {
        title: 'Gamified team quest board',
        desc: 'Building together feels like a multiplayer game with quests, squad collaboration, XP streaks, and instant rewards.'
      }
    }
  ];

  return (
    <section className="py-16 md:py-20 border-b border-slate-800/60 bg-[#0d1220]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-mono uppercase tracking-widest text-indigo-400 mb-2">
            The Fundamental Paradigm Shift
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why the Old Freelancing Model is Broken
          </h3>
          <p className="mt-4 text-base text-slate-400">
            Compare traditional freelance marketplaces with TaskMesh’s modular AI-orchestrated micro-task architecture.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Traditional Way */}
          <div className="p-6 sm:p-8 rounded-2xl bg-red-950/10 border border-red-900/30">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-900/30">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-red-200">The Old Freelance Nightmare</h4>
                <p className="text-xs text-red-400/80">Upwork, Fiverr, monolithic agencies</p>
              </div>
            </div>

            <div className="space-y-6">
              {comparisons.map((c, i) => (
                <div key={i} className="flex gap-3 text-left">
                  <div className="mt-1 flex-shrink-0 text-red-400">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-red-400/70 font-semibold block mb-0.5">
                      {c.factor}
                    </span>
                    <h5 className="text-sm font-semibold text-slate-200 mb-1">{c.traditional.title}</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">{c.traditional.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The TaskMesh Way */}
          <div className="p-6 sm:p-8 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 relative shadow-xl shadow-indigo-500/5">
            
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                The New Standard
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-indigo-500/20">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">The TaskMesh Swarm Way</h4>
                <p className="text-xs text-indigo-300/80">Modular micro-tasks + AI orchestration</p>
              </div>
            </div>

            <div className="space-y-6">
              {comparisons.map((c, i) => (
                <div key={i} className="flex gap-3 text-left">
                  <div className="mt-1 flex-shrink-0 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-indigo-400 font-semibold block mb-0.5">
                      {c.factor}
                    </span>
                    <h5 className="text-sm font-semibold text-white mb-1">{c.taskmesh.title}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{c.taskmesh.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
