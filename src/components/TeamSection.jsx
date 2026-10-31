import React from 'react';
import { coreTeam } from '../data/initialData';
import { useApp } from '../context/AppContext';
import {
  Code2,
  GraduationCap,
  Sparkles,
  Award,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Mail
} from 'lucide-react';

export default function TeamSection() {
  const { setActiveTab } = useApp();

  return (
    <section className="py-16 md:py-24 border-b border-slate-800/60 bg-[#0d1222]/60 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono uppercase tracking-wider text-indigo-400 mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
            <span>Founding Student Engineers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Meet the Builders Behind TaskMesh
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            TaskMesh is founded and built by passionate student engineers on a mission to dismantle the broken freelance hiring model through atomic micro-tasks, verifiable proof of skill, and autonomous AI coordination.
          </p>
        </div>

        {/* 3 Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {coreTeam.map((member) => {
            const isLead = member.role.includes('Lead');
            return (
              <div
                key={member.id}
                className={`glow-card rounded-3xl p-6 sm:p-7 border flex flex-col justify-between transition-all ${
                  isLead
                    ? 'bg-slate-900/90 border-indigo-500/40 shadow-xl shadow-indigo-500/10 relative'
                    : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div>
                  
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        isLead
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {member.badge}
                    </span>

                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                      Student Builder
                    </span>
                  </div>

                  {/* Photo & Name */}
                  <div className="flex flex-col items-center text-center mb-5">
                    <div className="relative mb-4 group">
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-2 ring-indigo-500/40 p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 shadow-2xl">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-center rounded-[12px] group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {isLead && (
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg">
                          Lead
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-extrabold text-white">
                      {member.name}
                    </h3>
                    <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide mt-0.5">
                      {member.role}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      @{member.handle} • {member.tagline}
                    </div>

                    {/* Email Contact Pill */}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-mono transition-all mt-2.5 shadow-sm shadow-indigo-500/10"
                        title={`Email ${member.name} directly`}
                      >
                        <Mail className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{member.email}</span>
                      </a>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed mb-5 text-center sm:text-left">
                    {member.bio}
                  </p>

                  {/* Skills Pills */}
                  <div className="space-y-2 mb-6">
                    <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                      Core Specializations:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {member.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Card Footer CTA */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    <strong className="text-emerald-400">{member.contributionsCount}+</strong> Verified Tasks
                  </span>

                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold group"
                  >
                    <span>View Proof Ledger</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Student Engineering Credo Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 border border-indigo-500/30 text-center max-w-4xl mx-auto shadow-2xl space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-base font-bold text-white">
              The Student Engineering Creed
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            "We believe students and emerging developers shouldn't be judged by years of resume fluff or asked to do unpaid test projects. With TaskMesh, every 2-hour task you complete is an immutable, verifiable proof of what you can actually build."
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-indigo-300">
            <span>Souradip Ghosh (Lead)</span>
            <span>•</span>
            <span>Angshu Sarkar (Frontend)</span>
            <span>•</span>
            <span>Sneha Mukherjee (Frontend)</span>
          </div>
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <span>Reach out to the lead engineer:</span>
            <a
              href="mailto:ghoshsouradip@gmail.com"
              className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 font-semibold"
            >
              <Mail className="w-3 h-3" />
              <span>ghoshsouradip@gmail.com</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
