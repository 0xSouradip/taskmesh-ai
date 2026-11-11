'use client';

import React, { useState } from 'react';
import { useApp } from './AppProvider';
import { decomposeProject } from '@/lib/actions';
import {
  Sparkles,
  Layers,
  ArrowRight,
  Cpu,
  Coins,
  CheckCircle2,
  Trash2,
  Plus,
  Clock,
  Shuffle,
  ShieldCheck,
  Send,
  Loader2
} from 'lucide-react';

export default function AIDecomposer() {
  const { addProjectWithTasks, projectTemplates, showToast } = useApp();

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectCategory, setProjectCategory] = useState('Web & AI Applications');
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [decomposingStep, setDecomposingStep] = useState(0);
  const [generatedTasks, setGeneratedTasks] = useState(null);

  const steps = [
    'Parsing project scope & identifying domain boundaries...',
    'Separating atomic concerns: Design, Copy, Frontend, Backend, QA...',
    'Constructing DAG dependency graph (locking downstream tasks)...',
    'Synthesizing automated acceptance tests & bounty algorithms...'
  ];

  const handleSelectTemplate = (tpl) => {
    setProjectTitle(tpl.title);
    setProjectDescription(tpl.description);
    setProjectCategory(tpl.category);
    setGeneratedTasks(null);
  };

  const runDecomposer = async () => {
    if (!projectTitle || !projectDescription) {
      return showToast('Missing details', 'Please provide a project title and description.', 'error');
    }

    setIsDecomposing(true);
    setDecomposingStep(0);

    const stepInterval = setInterval(() => {
      setDecomposingStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 700);

    // Keep the step animation visible for a moment even when the server answers instantly.
    const [res] = await Promise.all([
      decomposeProject({ title: projectTitle, description: projectDescription }),
      new Promise((resolve) => setTimeout(resolve, 2800)),
    ]);
    clearInterval(stepInterval);
    setIsDecomposing(false);
    if (!res.ok) return showToast('Decomposition failed', res.error, 'error');
    setGeneratedTasks(res.tasks);
  };

  const handleDeployToSwarm = () => {
    if (!generatedTasks || generatedTasks.length === 0) return;
    addProjectWithTasks(
      {
        title: projectTitle,
        category: projectCategory,
        description: projectDescription
      },
      generatedTasks
    );
  };

  const handleUpdateTaskBounty = (index, delta) => {
    setGeneratedTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, bounty: Math.max(50, t.bounty + delta) } : t))
    );
  };

  const handleDeleteGeneratedTask = (index) => {
    setGeneratedTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const totalCalculatedBudget = (generatedTasks || []).reduce((sum, t) => sum + t.bounty, 0);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
            Autonomous Project Architect
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
            DAG Engine
          </span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          AI Project Decomposer
        </h2>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
          Don't hire one stressed freelancer for 6 weeks. Describe what you want to build, and our AI will decompose it into independent, bite-sized tasks tailored for specialized contributors.
        </p>
      </div>

      {/* Main Grid: Input Form vs Generated Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Project Input & Quick Presets */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Quick Template Presets
              </label>
              <div className="flex flex-wrap gap-1.5">
                {projectTemplates.map((tpl, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectTemplate(tpl)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/30 transition-all text-left"
                  >
                    ⚡ {tpl.title.split(' ')[0]} {tpl.title.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Project Name
              </label>
              <input
                type="text"
                placeholder="e.g. ChronoDraft: AI Email Follow-up Bot"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. AI & Productivity, Web3, E-Commerce"
                value={projectCategory}
                onChange={(e) => setProjectCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Describe the Big Project
              </label>
              <textarea
                rows={5}
                placeholder="Describe your vision, target users, key features, and any technical preferences. AI will identify modular boundaries..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={runDecomposer}
              disabled={isDecomposing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isDecomposing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                  <span>Decomposing into Atomic Tasks...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>Decompose with AI</span>
                </>
              )}
            </button>

          </div>

          {/* Value Prop Callout */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <strong className="text-white block mb-1">Why this replaces managing a stranger:</strong>
            Instead of praying one person delivers in 3 weeks, 5 specialized people finish their parts in parallel. A designer polishes the tokens, a copywriter crafts clear words, and a coder ships the endpoints.
          </div>

        </div>

        {/* Right Column: Decomposer Pipeline or Task Plan */}
        <div className="lg:col-span-7">
          
          {isDecomposing ? (
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-6 flex flex-col items-center justify-center min-h-[420px]">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-purple-400 animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-1">AI Spec Decomposition in Progress</h3>
                <p className="text-xs text-slate-400">Transforming monolithic spec into Directed Acyclic Graph (DAG)</p>
              </div>

              <div className="w-full max-w-md space-y-3 text-left">
                {steps.map((st, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-all ${
                      i < decomposingStep
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : i === decomposingStep
                        ? 'bg-purple-950/30 border-purple-500/40 text-purple-200 font-semibold shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    {i < decomposingStep ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : i === decomposingStep ? (
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                    )}
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : generatedTasks ? (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                    ✓ Decomposition Complete
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {generatedTasks.length} Micro-Tasks Synthesized
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Swarm Budget:</div>
                  <div className="text-lg font-extrabold text-emerald-400">
                    ${totalCalculatedBudget} USDC
                  </div>
                </div>
              </div>

              {/* Task Cards Preview */}
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {generatedTasks.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 font-bold">#{idx + 1}</span>
                        <span className="font-semibold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px]">
                          {t.category}
                        </span>
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {t.estimatedHours}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleUpdateTaskBounty(idx, -10)}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="font-bold text-emerald-400 px-1 font-mono">
                            ${t.bounty}
                          </span>
                          <button
                            onClick={() => handleUpdateTaskBounty(idx, 10)}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteGeneratedTask(idx)}
                          className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                          title="Remove task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-100 text-sm">{t.title}</h4>

                    <div className="text-[11px] text-slate-400">
                      <strong>Deliverable:</strong> {t.deliverables ? t.deliverables[0] : 'Modular deliverable'}
                    </div>

                    {idx > 0 && (
                      <div className="text-[10px] font-mono text-indigo-300/80 bg-indigo-950/30 px-2 py-1 rounded border border-indigo-900/30">
                        ⚡ Dependency: Unlocks automatically when Task #{idx} completes
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setGeneratedTasks(null)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Discard & Reconfigure
                </button>

                <button
                  onClick={handleDeployToSwarm}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Deploy into Live Swarm ({generatedTasks.length} Quests)</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 border-dashed text-center flex flex-col items-center justify-center min-h-[420px] text-slate-500">
              <Layers className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-base font-semibold text-slate-300">Ready to Decompose</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Enter your project description on the left or select a template to see AI break it down into modular micro-tasks with live dependency graphs.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
