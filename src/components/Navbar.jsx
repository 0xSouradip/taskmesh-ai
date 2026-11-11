'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logOut } from '@/lib/actions';
import { useApp } from './AppProvider';
import {
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Trophy,
  Coins,
  Flame,
  User,
  Briefcase,
  LogIn,
  LogOut,
  Menu,
  X,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    userRole,
    setUserRole,
    currentUser
  } = useApp();

  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'explore', label: 'Quest Board', icon: Layers },
    { id: 'team', label: 'Founding Team', icon: GraduationCap },
    { id: 'decomposer', label: 'AI Decomposer', icon: Sparkles, highlight: true },
    { id: 'swarm', label: 'Swarm Engine', icon: Cpu },
    { id: 'portfolio', label: 'Proof of Skill', icon: ShieldCheck },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2.5 text-left group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
                <div className="w-full h-full bg-[#0b0f19] rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    TaskMesh
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    AI Swarm
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">Modular Work • Proof of Skill</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action / Role Switcher & User Pill */}
          <div className="flex items-center gap-3">
            
            {/* Mode Switcher */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setUserRole('specialist')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  userRole === 'specialist'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Specialist: Pick up tasks, submit work, earn XP and bounties"
              >
                <User className="w-3.5 h-3.5" />
                <span>Specialist</span>
              </button>
              <button
                onClick={() => setUserRole('founder')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  userRole === 'founder'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Founder: Post projects, watch AI decompose into micro-tasks"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Founder</span>
              </button>
            </div>

            {/* User Wallet / XP pill */}
            {currentUser ? (
              <>
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all group"
                >
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/40"
                    />
                    <span className="absolute -bottom-1 -right-1 text-[9px] font-bold px-1 rounded bg-indigo-600 text-white leading-none py-0.5">
                      L{currentUser.level}
                    </span>
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-200 group-hover:text-white">
                      <span>@{currentUser.handle}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center text-emerald-400 font-medium">
                        <Coins className="w-3 h-3 mr-0.5" />
                        ${currentUser.bountiesEarned}
                      </span>
                      <span className="flex items-center text-amber-400 font-medium">
                        <Flame className="w-3 h-3 mr-0.5" />
                        {currentUser.xp} XP
                      </span>
                    </div>
                  </div>
                </button>

                <button
                  onClick={async () => { await logOut(); router.push('/'); }}
                  title="Sign out"
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Log in</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#0b0f19] px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    Live
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Active View Role:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setUserRole('specialist')}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  userRole === 'specialist' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                Specialist
              </button>
              <button
                onClick={() => setUserRole('founder')}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  userRole === 'founder' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                Founder
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
