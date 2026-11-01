import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Layers, ShieldCheck, Cpu, Code2, Globe, GraduationCap } from 'lucide-react';

export default function Footer() {
  const { setActiveTab } = useApp();

  return (
    <footer className="border-t border-slate-800 bg-[#080b12] text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-left">
          
          {/* Col 1: Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                TaskMesh
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              We reject the 6-week monolithic freelance gamble. By breaking projects into atomic tasks, specialists ship what they excel at, finished deliverables become verifiable proof of skill, and AI coordinates dependencies in the background.
            </p>

            <div className="pt-2 text-xs text-slate-400 font-mono space-y-1">
              <div className="text-white font-semibold">Founding Engineering Team:</div>
              <div>• <strong className="text-indigo-400">Souradip Ghosh</strong> — Lead Engineer & System Architect (<a href="mailto:ghoshsouradip@gmail.com" className="text-indigo-300 hover:underline">ghoshsouradip@gmail.com</a>)</div>
              <div>• <strong className="text-emerald-400">Angshu Sarkar</strong> — Frontend Engineer (<a href="mailto:sarkarangshu04@gmail.com" className="text-emerald-300 hover:underline">sarkarangshu04@gmail.com</a>)</div>
              <div>• <strong className="text-purple-400">Sneha Mukherjee</strong> — Frontend Engineer (<a href="mailto:snehamukherjee387@gmail.com" className="text-purple-300 hover:underline">snehamukherjee387@gmail.com</a>)</div>
            </div>
          </div>

          {/* Col 2: Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('team')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-indigo-400 font-semibold"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Meet Founding Team</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="hover:text-white transition-colors"
                >
                  Quest Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('decomposer')}
                  className="hover:text-white transition-colors"
                >
                  AI Project Decomposer
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('swarm')}
                  className="hover:text-white transition-colors"
                >
                  Swarm Engine (DAG)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className="hover:text-white transition-colors"
                >
                  Proof of Skill Ledger
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className="hover:text-white transition-colors"
                >
                  Specialist Arena & Guilds
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Principles & GitHub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Zero Unpaid Test Homework</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Instant USDC Micro-Escrow</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Automated AI Verification</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Directed Acyclic Graphs (DAG)</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href="https://github.com/0xSouradip/taskmesh-ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-white transition-colors"
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>GitHub: 0xSouradip/taskmesh-ai</span>
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TaskMesh. Founded by Souradip Ghosh, Angshu Sarkar & Sneha Mukherjee.</p>
          <p className="font-mono">React 19 • Tailwind CSS • Vite • Autonomous Swarm</p>
        </div>

      </div>
    </footer>
  );
}
