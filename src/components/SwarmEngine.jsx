import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Cpu,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Lock,
  Terminal,
  Activity,
  Zap,
  RefreshCw,
  Coins,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function SwarmEngine() {
  const {
    projects,
    tasks,
    aiEvents,
    setSelectedTask
  } = useApp();

  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id || 'proj-1');

  const selectedProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const projectTasks = tasks.filter(t => t.projectId === selectedProject?.id);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Autonomous Swarm Coordination
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Background AI Orchestrator
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Nobody chases updates or micromanages. The AI engine continuously maintains the Directed Acyclic Graph (DAG), validates acceptance criteria, unlocks downstream tasks, and routes escrow payments.
          </p>
        </div>

        {/* Project Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProjectId(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeProjectId === p.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {p.name.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Orchestration Latency</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">42ms</div>
          <div className="text-[11px] text-emerald-400 mt-1">Autonomous event dispatch</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>AI Verification Rate</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">99.2%</div>
          <div className="text-[11px] text-slate-400 mt-1">First-pass precision</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Dependency Bottlenecks</span>
            <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-400">0 Active</div>
          <div className="text-[11px] text-slate-400 mt-1">Auto-bifurcated pipelines</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Escrow Settlement</span>
            <Coins className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-300">Instant</div>
          <div className="text-[11px] text-slate-400 mt-1">Multi-sig auto-release</div>
        </div>
      </div>

      {/* Main Grid: Interactive DAG Visualizer vs Live Terminal Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visual Pipeline / Graph for Selected Project */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedProject?.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Managed by <span className="text-indigo-400 font-mono">{selectedProject?.leadAI}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-slate-400">
                  Tasks: {projectTasks.filter(t => t.status === 'COMPLETED').length}/{projectTasks.length} Completed
                </span>
                <div className="w-32 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                    style={{
                      width: `${(projectTasks.filter(t => t.status === 'COMPLETED').length / (projectTasks.length || 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Visual Task Pipeline */}
            <div className="space-y-3">
              {projectTasks.map((task, idx) => {
                const isCompleted = task.status === 'COMPLETED';
                const isInProgress = task.status === 'IN_PROGRESS';
                const isAvailable = task.status === 'AVAILABLE';
                const isLocked = task.status === 'BLOCKED';

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all hover:scale-[1.01] ${
                      isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-white'
                        : isInProgress
                        ? 'bg-blue-950/20 border-blue-500/40 text-white'
                        : isAvailable
                        ? 'bg-indigo-950/30 border-indigo-500/40 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {isCompleted ? (
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : isInProgress ? (
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                            <Clock className="w-4 h-4 animate-spin" />
                          </div>
                        ) : isAvailable ? (
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-500 flex items-center justify-center">
                            <Lock className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {task.category}
                          </span>
                          <span className="text-xs font-bold text-slate-200">
                            {task.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Bounty: <span className="text-emerald-400 font-semibold">${task.bounty} USDC</span> • {task.estimatedHours}
                          {task.claimedBy && (
                            <span className="ml-2 text-indigo-400">
                              @{task.claimedBy}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {isCompleted && (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Verified
                        </span>
                      )}
                      {isInProgress && (
                        <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          Active
                        </span>
                      )}
                      {isAvailable && (
                        <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          Ready to Claim
                        </span>
                      )}
                      {isLocked && (
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                          Blocked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Right Column: Live Terminal Activity Stream */}
        <div className="lg:col-span-5">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl flex flex-col h-[520px]">
            
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  AI Orchestrator Live Log
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-400">STREAMING</span>
              </div>
            </div>

            {/* Terminal Log Items */}
            <div className="space-y-3 overflow-y-auto flex-1 font-mono text-xs pr-1">
              {aiEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className={`px-1.5 py-0.5 rounded font-semibold border ${ev.badgeColor}`}>
                      {ev.badge}
                    </span>
                    <span className="text-slate-500">{ev.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {ev.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Terminal Command Prompt Status Bar */}
            <div className="pt-3 mt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>daemon: active [polling 0s]</span>
              <span className="text-emerald-400">Zero human bottlenecks</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
