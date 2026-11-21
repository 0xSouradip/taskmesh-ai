'use client';

import { createContext, useContext, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { claimTask as claimTaskAction, submitTask as submitTaskAction, publishProject } from '@/lib/actions';

const AppContext = createContext(null);

// `data` comes from the server (src/lib/queries.js#getAppData) and refreshes via revalidatePath after each action.
export function AppProvider({ data, children }) {
  const router = useRouter();

  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimer = useRef(null);

  const { currentUser } = data;

  // Always render the latest server copy of the selected task.
  const selectedTask = selectedTaskId ? data.tasks.find((t) => t.id === selectedTaskId) ?? null : null;
  const setSelectedTask = (task) => setSelectedTaskId(task?.id ?? null);

  const showToast = (title, message, type = 'info') => {
    clearTimeout(toastTimer.current);
    setToastMessage({ title, message, type, id: Date.now() });
    toastTimer.current = setTimeout(() => setToastMessage(null), 5000);
  };
  const dismissToast = () => setToastMessage(null);

  // Signed-out users go to sign-in and come back here afterwards (query string included,
  // e.g. /portfolio?handle=alice). Read at click time, so no useSearchParams needed.
  const signInFirst = () => {
    if (currentUser) return false;
    router.push(`/sign-in?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    return true;
  };

  const claimTask = async (taskId) => {
    if (signInFirst()) return false;
    const res = await claimTaskAction(taskId);
    if (!res.ok) {
      showToast('Could not claim this task', res.error, 'error');
      return false;
    }
    showToast('Task claimed', `"${res.title}" is yours. Submit your work to earn $${res.bounty} and ${res.xp} XP.`, 'success');
    return true;
  };

  const submitTask = async (taskId, submission) => {
    if (signInFirst()) return false;
    const res = await submitTaskAction(taskId, submission);
    if (!res.ok) {
      showToast('Submission not accepted', res.error, 'error');
      return false;
    }
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 }, colors: ['#FFC08A', '#F3F0EA', '#FFB06A'] });
    }
    const unlocked =
      res.unlockedCount > 0 ? ` ${res.unlockedCount} dependent task${res.unlockedCount > 1 ? 's are' : ' is'} now open.` : '';
    showToast('Verified and paid', `Score ${res.score}/100. You earned $${res.bounty} and ${res.xp} XP.${unlocked}`, 'success');
    return true;
  };

  const addProjectWithTasks = async (project, tasks) => {
    if (signInFirst()) return false;
    const res = await publishProject(project, tasks);
    if (!res.ok) {
      showToast('Could not publish', res.error, 'error');
      return false;
    }
    showToast('Project published', `"${res.name}" is live with ${res.tasksCount} tasks.`, 'success');
    router.push('/tasks');
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        ...data,
        selectedTask,
        setSelectedTask,
        claimTask,
        submitTask,
        addProjectWithTasks,
        signInFirst,
        toastMessage,
        showToast,
        dismissToast,
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
