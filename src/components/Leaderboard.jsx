import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Trophy,
  Flame,
  Coins,
  ShieldCheck,
  Zap,
  Medal,
  Users,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function Leaderboard() {
  const { freelancers, currentUser, setActiveTab } = useApp();

  // Sort specialists by XP descending
  const sortedFreelancers = [...freelancers].sort((a, b) => (b.xp || 0) - (a.xp || 0));

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              The Swarm Arena
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Gamified Collaboration
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Specialist Leaderboard & Guilds
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Building software should feel like a team game, not an exhausting chore. Specialists compete for bounties, collaborate on modular quests, and climb the verified skill ranks.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>Pick Up a Quest & Earn XP</span>
        </button>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {sortedFreelancers.slice(0, 3).map((f, rank) => {
          const podiumStyles = [
            { border: 'border-amber-500/40', bg: 'bg-amber-950/20', text: 'text-amber-400', crown: '🥇 1st Place' },
            { border: 'border-slate-400/40', bg: 'bg-slate-900/40', text: 'text-slate-300', crown: '🥈 2nd Place' },
            { border: 'border-amber-700/40', bg: 'bg-amber-950/10', text: 'text-amber-600', crown: '🥉 3rd Place' }
          ][rank];

          return (
            <div
              key={f.id}
              className={`p-6 rounded-2xl border ${podiumStyles.border} ${podiumStyles.bg} relative overflow-hidden flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-extrabold font-mono uppercase tracking-wider ${podiumStyles.text}`}>
                  {podiumStyles.crown}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  Lvl {f.level}
                </span>
              </div>

              <div className="text-center py-2">
                <img
                  src={f.avatar}
                  alt={f.name}
                  className="w-16 h-16 rounded-2xl mx-auto object-cover ring-2 ring-indigo-500/40 shadow-xl mb-3"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80';
                  }}
                />
                <h4 className="text-base font-bold text-white">{f.name}</h4>
                <p className="text-xs text-indigo-400 font-mono">@{f.handle}</p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{f.title}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-around text-center text-xs">
                <div>
                  <div className="text-slate-400 text-[10px]">XP Earned</div>
                  <div className="text-amber-400 font-bold flex items-center justify-center mt-0.5">
                    <Flame className="w-3.5 h-3.5 mr-0.5" />
                    {f.xp}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Bounties</div>
                  <div className="text-emerald-400 font-bold flex items-center justify-center mt-0.5">
                    <Coins className="w-3.5 h-3.5 mr-0.5" />
                    ${f.bountiesEarned}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Acceptance</div>
                  <div className="text-indigo-300 font-bold mt-0.5">
                    {f.acceptanceRate || 99}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Verified Specialist Roster
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="pb-3 px-3">Rank</th>
                <th className="pb-3 px-3">Specialist</th>
                <th className="pb-3 px-3">Primary Domain</th>
                <th className="pb-3 px-3 text-right">Tasks Shipped</th>
                <th className="pb-3 px-3 text-right">Total Bounties</th>
                <th className="pb-3 px-3 text-right">Swarm XP</th>
                <th className="pb-3 px-3 text-right">Turnaround</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedFreelancers.map((f, idx) => {
                const isCurrentUser = f.handle === currentUser.handle;
                return (
                  <tr
                    key={f.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isCurrentUser ? 'bg-indigo-950/20 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-400">
                      #{idx + 1}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={f.avatar}
                          alt={f.name}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-white font-bold">{f.name}</span>
                            {isCurrentUser && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-600 text-white font-semibold">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 font-mono text-[11px]">@{f.handle}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-300">
                      {f.skills && f.skills[0] ? f.skills[0].name : 'Full-Stack'}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-slate-200">
                      {f.tasksCompleted || 4}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400">
                      ${f.bountiesEarned} USDC
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-400">
                      {f.xp} XP
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-indigo-300">
                      {f.speedRating || 'Top 10%'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
