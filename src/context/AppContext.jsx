import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { initialProjects, initialTasks, sampleFreelancers, initialAIEvents } from '../data/initialData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Load from localStorage or defaults
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('taskmesh_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskmesh_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('taskmesh_user');
    return saved ? JSON.parse(saved) : sampleFreelancers[0];
  });

  const [freelancers, setFreelancers] = useState(() => {
    const saved = localStorage.getItem('taskmesh_freelancers');
    return saved ? JSON.parse(saved) : sampleFreelancers;
  });

  const [aiEvents, setAiEvents] = useState(() => {
    const saved = localStorage.getItem('taskmesh_events');
    return saved ? JSON.parse(saved) : initialAIEvents;
  });

  const [activeTab, setActiveTab] = useState('explore');
  const [userRole, setUserRole] = useState('specialist'); // 'specialist' | 'founder'
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('taskmesh_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('taskmesh_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskmesh_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('taskmesh_events', JSON.stringify(aiEvents));
  }, [aiEvents]);

  const showToast = (title, message, type = 'info') => {
    setToastMessage({ title, message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const addAiEvent = (type, message, badge, badgeColor) => {
    const newEvent = {
      id: `ev-${Date.now()}`,
      timestamp: 'Just now',
      type,
      message,
      badge,
      badgeColor
    };
    setAiEvents(prev => [newEvent, ...prev.slice(0, 19)]);
  };

  const claimTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.status === 'BLOCKED') {
      showToast('Task Locked', 'This micro-task requires upstream dependencies to finish first.', 'error');
      return;
    }

    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'IN_PROGRESS',
          claimedBy: currentUser.handle
        };
      }
      return t;
    });

    setTasks(updatedTasks);
    addAiEvent(
      'TASK_CLAIMED',
      `Specialist @${currentUser.handle} picked up "${task.title}". Escrow lock established.`,
      'Claimed',
      'text-blue-400 bg-blue-500/10 border-blue-500/20'
    );

    showToast('Quest Accepted!', `You claimed "${task.title}". Complete deliverables to earn $${task.bounty} USDC and +${task.xp} XP.`, 'success');
    
    // Update selected modal task if open
    setSelectedTask(prev => prev && prev.id === taskId ? { ...prev, status: 'IN_PROGRESS', claimedBy: currentUser.handle } : prev);
  };

  const submitTask = (taskId, submissionData) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // AI automated evaluation simulation
    const reviewScore = Math.floor(Math.random() * 6) + 95; // 95 to 100
    const aiFeedbackTemplates = [
      `Autonomous Verifier: 100% test passing rate. Acceptance criteria fully satisfied. Clean adherence to project spec.`,
      `AI Lint & Static Analysis: Zero discrepancies discovered. Security assertions verified. Code quality index 9.8/10.`,
      `Quality Assurance Engine: Complete coverage verified against acceptance criteria. Excellent execution clarity.`
    ];
    const aiFeedback = aiFeedbackTemplates[Math.floor(Math.random() * aiFeedbackTemplates.length)];

    const updatedSubmission = {
      submittedAt: 'Just now',
      author: `${currentUser.name} (@${currentUser.handle})`,
      link: submissionData.link || 'https://github.com/0xSouradip/modular-deliverables',
      notes: submissionData.notes || 'Delivered modular package with full compliance to task spec.',
      aiReviewScore: reviewScore,
      aiFeedback
    };

    // Calculate new user stats
    const earnedBounty = task.bounty;
    const earnedXp = task.xp;
    const newXp = currentUser.xp + earnedXp;
    const newLevel = Math.floor(newXp / 300) + 1;
    const newBounties = currentUser.bountiesEarned + earnedBounty;
    const newTasksCount = currentUser.tasksCompleted + 1;

    const updatedUser = {
      ...currentUser,
      xp: newXp,
      level: newLevel,
      bountiesEarned: newBounties,
      tasksCompleted: newTasksCount
    };
    setCurrentUser(updatedUser);

    // Update freelancers leaderboard with currentUser
    setFreelancers(prev => prev.map(f => f.handle === currentUser.handle ? updatedUser : f));

    // Update tasks and check downstream dependencies
    let unblockedCount = 0;
    const nextTasks = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'COMPLETED',
          submission: updatedSubmission
        };
      }
      return t;
    });

    // Check if any blocked tasks can now be unblocked
    const finalizedTasks = nextTasks.map(t => {
      if (t.status === 'BLOCKED' && t.prerequisites && t.prerequisites.length > 0) {
        const allPrereqsDone = t.prerequisites.every(prereqId => {
          const prereqTask = nextTasks.find(pt => pt.id === prereqId);
          return prereqTask && prereqTask.status === 'COMPLETED';
        });
        if (allPrereqsDone) {
          unblockedCount++;
          addAiEvent(
            'PREREQUISITE_UNLOCKED',
            `Dependency Resolved: "${t.title}" is now unlocked and available on the quest board!`,
            'Graph Unlocked',
            'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
          );
          return { ...t, status: 'AVAILABLE' };
        }
      }
      return t;
    });

    setTasks(finalizedTasks);

    // Update project stats
    setProjects(prevProjects => prevProjects.map(p => {
      if (p.id === task.projectId) {
        const completed = finalizedTasks.filter(t => t.projectId === p.id && t.status === 'COMPLETED').length;
        const paid = p.paidBudget + earnedBounty;
        return {
          ...p,
          completedTasksCount: completed,
          paidBudget: paid
        };
      }
      return p;
    }));

    // Add verification and escrow events
    addAiEvent(
      'TASK_VERIFIED',
      `AI Verifier: Task "${task.title}" verified for @${currentUser.handle} with ${reviewScore}/100 score.`,
      'Verified',
      'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    );

    addAiEvent(
      'BOUNTY_PAID',
      `Instant Escrow Release: $${earnedBounty} USDC + ${earnedXp} XP routed directly to @${currentUser.handle}.`,
      'Paid Out',
      'text-amber-400 bg-amber-500/10 border-amber-500/20'
    );

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    showToast(
      'AI Verified & Paid Out! 🎉',
      `Score: ${reviewScore}/100! Received +$${earnedBounty} USDC and +${earnedXp} XP. ${unblockedCount > 0 ? `${unblockedCount} downstream task(s) unlocked!` : ''}`,
      'success'
    );

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({
        ...task,
        status: 'COMPLETED',
        submission: updatedSubmission
      });
    }
  };

  const addProjectWithTasks = (newProjectData, newTasksList) => {
    const projectId = `proj-${Date.now()}`;
    const project = {
      id: projectId,
      name: newProjectData.title,
      category: newProjectData.category || 'Product Development',
      description: newProjectData.description,
      totalBudget: newTasksList.reduce((acc, t) => acc + (t.bounty || 200), 0),
      paidBudget: 0,
      tasksCount: newTasksList.length,
      completedTasksCount: 0,
      leadAI: 'Autonomous Swarm Orchestrator v4.0',
      status: 'ACTIVE',
      createdAt: 'Just now'
    };

    const formattedTasks = newTasksList.map((t, index) => ({
      id: `task-${Date.now()}-${index}`,
      projectId,
      projectName: project.name,
      title: t.title,
      category: t.category || 'Frontend',
      difficulty: t.difficulty || 'Intermediate',
      estimatedHours: t.estimatedHours || '2 - 3 hrs',
      bounty: t.bounty || 200,
      xp: t.xp || 500,
      status: index === 0 ? 'AVAILABLE' : (t.prerequisites && t.prerequisites.length > 0 ? 'BLOCKED' : 'AVAILABLE'),
      claimedBy: null,
      prerequisites: t.prerequisites || (index > 0 ? [`task-${Date.now()}-${index - 1}`] : []),
      description: t.description || `Execute modular deliverable for ${project.name}: ${t.title}`,
      deliverables: t.deliverables || ['Modular code or design file complying with acceptance tests'],
      acceptanceCriteria: t.acceptanceCriteria || [
        'Strict schema and design token validation',
        'Passes automated lint and edge-case execution'
      ],
      submission: null
    }));

    setProjects(prev => [project, ...prev]);
    setTasks(prev => [...formattedTasks, ...prev]);

    addAiEvent(
      'PROJECT_DECOMPOSED',
      `AI Engine decomposed "${project.name}" into ${formattedTasks.length} micro-tasks with live dependency graph.`,
      'Decomposition',
      'text-purple-400 bg-purple-500/10 border-purple-500/20'
    );

    showToast(
      'Project Decomposed & Deployed! 🚀',
      `"${project.name}" is now live with ${formattedTasks.length} micro-tasks open for specialized contributors.`,
      'success'
    );

    setActiveTab('explore');
  };

  const resetToDefaults = () => {
    localStorage.removeItem('taskmesh_projects');
    localStorage.removeItem('taskmesh_tasks');
    localStorage.removeItem('taskmesh_user');
    localStorage.removeItem('taskmesh_freelancers');
    localStorage.removeItem('taskmesh_events');

    setProjects(initialProjects);
    setTasks(initialTasks);
    setCurrentUser(sampleFreelancers[0]);
    setFreelancers(sampleFreelancers);
    setAiEvents(initialAIEvents);
    showToast('Platform Reset', 'Restored initial sample projects, tasks, and state.', 'info');
  };

  return (
    <AppContext.Provider value={{
      projects,
      tasks,
      currentUser,
      freelancers,
      aiEvents,
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
      resetToDefaults,
      toastMessage,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
