'use client';

import { createContext, useContext, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  claimTask as claimTaskAction,
  submitTask as submitTaskAction,
  reviewSubmission as reviewAction,
  releaseTask as releaseAction,
  closeProject as closeAction,
  publishProject,
} from '@/lib/actions';

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

  // Submissions on my projects waiting for my decision.
  const reviewQueue = currentUser ? data.tasks.filter((t) => t.status === 'IN_REVIEW' && t.viewer.isOwner) : [];

  const showToast = (title, message, type = 'info') => {
    clearTimeout(toastTimer.current);
    setToastMessage({ title, message, type, id: Date.now() });
    toastTimer.current = setTimeout(() => setToastMessage(null), 6000);
  };
  const dismissToast = () => setToastMessage(null);

  // Signed-out users go to sign-in and come back here afterwards (query string included).
  const signInFirst = () => {
    if (currentUser) return false;
    router.push(`/sign-in?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    return true;
  };

  // Runs a server action and turns `{ ok: false, error }` into an error toast.
  const run = async (action, failTitle) => {
    const res = await action();
    if (!res.ok) showToast(failTitle, res.error, 'error');
    return res.ok ? res : null;
  };

  const claimTask = async (taskId) => {
    if (signInFirst()) return false;
    const res = await run(() => claimTaskAction(taskId), 'Could not claim this task');
    if (res) showToast('Task claimed', `"${res.title}" is yours. Submit your work when it’s ready.`, 'success');
    return Boolean(res);
  };

  const releaseTask = async (taskId) => {
    const res = await run(() => releaseAction(taskId), 'Could not release this task');
    if (res) showToast('Task released', 'It’s open for others to claim again.', 'info');
    return Boolean(res);
  };

  const submitTask = async (taskId, submission) => {
    if (signInFirst()) return false;
    const res = await run(() => submitTaskAction(taskId, submission), 'Submission not saved');
    if (!res) return false;
    const advice = res.ai
      ? `AI review: ${res.ai.score}/100.${res.ai.missing.length ? ` Possibly missing: ${res.ai.missing.slice(0, 2).join('; ')}.` : ''}`
      : res.aiNote ?? '';
    showToast('Submitted for review', `The project owner will accept it or ask for changes. ${advice}`, 'success');
    return true;
  };

  const reviewSubmission = async (taskId, decision, note) => {
    const res = await run(() => reviewAction(taskId, { decision, note }), 'Review not saved');
    if (!res) return false;
    if (decision === 'accept') {
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 }, colors: ['#FFC08A', '#F3F0EA', '#FFB06A'] });
      }
      const unlocked = res.unlockedCount > 0 ? ` ${res.unlockedCount} dependent task${res.unlockedCount > 1 ? 's are' : ' is'} now open.` : '';
      showToast('Work accepted', `Remember to pay the specialist the agreed fee.${unlocked}`, 'success');
    } else {
      showToast('Changes requested', 'The specialist will see your note and can resubmit.', 'info');
    }
    return true;
  };

  const closeProject = async (projectId) => {
    const res = await run(() => closeAction(projectId), 'Could not close the project');
    if (res) showToast('Project closed', 'Open tasks were removed from the board. Finished work stays visible.', 'info');
    return Boolean(res);
  };

  const addProjectWithTasks = async (project, tasks) => {
    if (signInFirst()) return false;
    const res = await run(() => publishProject(project, tasks), 'Could not publish');
    if (!res) return false;
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
        reviewQueue,
        claimTask,
        releaseTask,
        submitTask,
        reviewSubmission,
        closeProject,
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
