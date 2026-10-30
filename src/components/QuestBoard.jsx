import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Coins,
  Flame,
  Lock,
  ArrowRight,
  Code2,
  Palette,
  FileText,
  Brain,
  ShieldAlert,
  Terminal,
  ExternalLink,
  Plus
} from 'lucide-react';

export default function QuestBoard() {
  const {
    tasks,
    projects,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    setSelectedTask,
    claimTask,
    currentUser,
    setActiveTab
  } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState('ALL');

  const categories = [
    { id: 'All', label: 'All Domains', icon: Filter },
    { id: 'Frontend', label: 'Frontend', icon: Code2 },
    { id: 'Backend', label: 'Backend & APIs', icon: Terminal },
    { id: 'Design', label: 'UI/UX Design', icon: Palette },
    { id: 'Copywriting', label: 'Copy & Content', icon: FileText },
    { id: 'AI & Prompts', label: 'AI & Prompts', icon: Brain },
    { id: 'QA & Security', label: 'QA & Security', icon: ShieldAlert }
  ];

  const statuses = [
    { id: 'All', label: 'All Statuses' },
    { id: 'AVAILABLE', label: 'Available (Open)' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'BLOCKED', label: 'Locked (Dependencies)' }
  ];

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Frontend': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Backend': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Design': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Copywriting': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'AI & Prompts': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'QA & Security': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchesProject = selectedProjectId === 'ALL' || t.projectId === selectedProjectId;

    return matchesSearch && matchesCategory && matchesStatus && matchesProject;
  });

  const totalBounties = tasks.reduce((sum, t) => sum + (t.bounty || 0), 0);
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const availableCount = tasks.filter(t => t.status === 'AVAILABLE').length;

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header and Live Swarm Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">
              Live Micro-Task Marketplace
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Explore Open Quests
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Pick up bite-sized modular tasks matching your specialty. Every deliverable earns instant USDC bounties, verifiable XP, and creates proof-of-work evidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Total Bounty Pool:</span>{' '}
            <span className="text-emerald-400 font-bold">${totalBounties.toLocaleString()} USDC</span>
          </div>

          <button
            onClick={() => setActiveTab('decomposer')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post & Decompose</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 mb-8 backdrop-blur-sm space-y-4">
        
        {/* Search Bar + Project Dropdown + Status Selector */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks by skill, keyword (e.g. Figma, React, OAuth, Webhook)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Project Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Active Projects ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Selector */}
          <div className="md:col-span-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Domain Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = filterCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Task Cards Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 border border-slate-800/80 rounded-2xl">
          <Filter className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-300">No matching micro-tasks found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters or browse other domains. Or decompose a new project!
          </p>
          <button
            onClick={() => {
              setFilterCategory('All');
              setFilterStatus('All');
              setSearchQuery('');
              setSelectedProjectId('ALL');
            }}
            className="mt-4 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => {
            const isLocked = task.status === 'BLOCKED';
            const isCompleted = task.status === 'COMPLETED';
            const isInProgress = task.status === 'IN_PROGRESS';
            const isAvailable = task.status === 'AVAILABLE';

            return (
              <div
                key={task.id}
                className={`glow-card rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                  isCompleted
                    ? 'bg-slate-900/40 border-emerald-900/30'
                    : isLocked
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                    : 'bg-slate-900/80 border-slate-800/90 hover:border-indigo-500/40'
                }`}
              >
                <div>
                  {/* Top Meta: Project & Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono font-medium text-slate-400 truncate max-w-[170px]">
                      {task.projectName}
                    </span>

                    {/* Status Pill */}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    )}

                    {isInProgress && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Clock className="w-3 h-3 animate-spin" />
                        In Progress
                      </span>
                    )}

                    {isAvailable && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Open Quest
                      </span>
                    )}

                    {isLocked && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </div>

                  {/* Task Title */}
                  <h3
                    onClick={() => setSelectedTask(task)}
                    className="text-base font-bold text-white mb-2 leading-snug cursor-pointer hover:text-indigo-300 transition-colors"
                  >
                    {task.title}
                  </h3>

                  {/* Description preview */}
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Tags: Category & Difficulty */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCategoryColor(task.category)}`}>
                      {task.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {task.difficulty}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {task.estimatedHours}
                    </span>
                  </div>
                </div>

                {/* Bottom Footer: Bounty & Action Button */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-emerald-400 font-bold text-sm">
                      <Coins className="w-4 h-4 mr-1 text-emerald-400" />
                      ${task.bounty} USDC
                    </div>
                    <div className="flex items-center text-amber-400 font-semibold text-xs">
                      <Flame className="w-3.5 h-3.5 mr-0.5 text-amber-400" />
                      +{task.xp} XP
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isAvailable && (
                      <button
                        onClick={() => claimTask(task.id)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        Claim
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedTask(task)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
                    >
                      Inspect
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
