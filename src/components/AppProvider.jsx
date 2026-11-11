'use client';

import React, { createContext, useContext, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { signIn } from 'next-auth/react';
import { claimTask as claimTaskAction, submitTask as submitTaskAction, publishProject } from '@/lib/actions';

const AppContext = createContext(null);

export const TAB_PATHS = {
  explore: '/',
  team: '/team',
  decomposer: '/decomposer',
  swarm: '/swarm',
  portfolio: '/portfolio',
  leaderboard: '/leaderboard',
};
const PATH_TABS = Object.fromEntries(Object.entries(TAB_PATHS).map(([k, v]) => [v, k]));

// `data` comes from the server (src/lib/queries.js#getAppData) and is refreshed via revalidatePath after each action.
export function AppProvider({ data, children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [userRole, setUserRole] = useState('specialist'); // UI-only view mode
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimer = useRef(null);

  const { currentUser } = data;
  const activeTab = PATH_TABS[pathname] ?? null;
  const setActiveTab = (tab) => router.push(TAB_PATHS[tab] ?? '/');

  // Always render the latest server copy of the selected task.
  const selectedTask = selectedTaskId ? data.tasks.find((t) => t.id === selectedTaskId) ?? null : null;
  const setSelectedTask = (task) => setSelectedTaskId(task?.id ?? null);

  const showToast = (title, message, type = 'info') => {
    clearTimeout(toastTimer.current);
    setToastMessage({ title, message, type, id: Date.now() });
    toastTimer.current = setTimeout(() => setToastMessage(null), 4500);
  };

  const requireSignIn = () => {
    if (currentUser) return false;
    showToast('Sign in required', 'Sign in with GitHub to claim quests, submit work, and publish projects.', 'error');
    signIn('github');
    return true;
  };

  const claimTask = async (taskId) => {
    if (requireSignIn()) return;
    const res = await claimTaskAction(taskId);
    if (!res.ok) return showToast('Task Locked', res.error, 'error');
    showToast(
      'Quest Accepted!',
      `You claimed "${res.title}". Complete deliverables to earn $${res.bounty} USDC and +${res.xp} XP.`,
      'success'
    );
  };

  const submitTask = async (taskId, submission) => {
    if (requireSignIn()) return false;
    const res = await submitTaskAction(taskId, submission);
    if (!res.ok) {
      showToast('Submission rejected', res.error, 'error');
      return false;
    }
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {
      // confetti is decorative
    }
    showToast(
      'AI Verified & Paid Out! 🎉',
      `Score: ${res.score}/100! Received +$${res.bounty} USDC and +${res.xp} XP. ${
        res.unlockedCount > 0 ? `${res.unlockedCount} downstream task(s) unlocked!` : ''
      }`,
      'success'
    );
    return true;
  };

  const addProjectWithTasks = async (project, tasks) => {
    if (requireSignIn()) return;
    const res = await publishProject(project, tasks);
    if (!res.ok) return showToast('Publish failed', res.error, 'error');
    showToast(
      'Project Decomposed & Deployed! 🚀',
      `"${res.name}" is now live with ${res.tasksCount} micro-tasks open for specialized contributors.`,
      'success'
    );
    setActiveTab('explore');
  };

  return (
    <AppContext.Provider
      value={{
        ...data,
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        selectedTask,
        setSelectedTask,
        searchQuery,
        setSearchQuery,
        filterCategory,
        setFilterCategory,
        filterStatus,
        setFilterStatus,
        claimTask,
        submitTask,
        addProjectWithTasks,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
