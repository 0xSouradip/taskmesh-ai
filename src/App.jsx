import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ComparisonSection from './components/ComparisonSection';
import TeamSection from './components/TeamSection';
import QuestBoard from './components/QuestBoard';
import AIDecomposer from './components/AIDecomposer';
import SwarmEngine from './components/SwarmEngine';
import ProofOfSkill from './components/ProofOfSkill';
import Leaderboard from './components/Leaderboard';
import TaskModal from './components/TaskModal';
import Toast from './components/Toast';
import Footer from './components/Footer';

function MainContent() {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 min-h-[calc(100vh-4rem)]">
      {activeTab === 'explore' && (
        <>
          <Hero />
          <ComparisonSection />
          <TeamSection />
          <QuestBoard />
        </>
      )}

      {activeTab === 'team' && <TeamSection />}

      {activeTab === 'decomposer' && <AIDecomposer />}

      {activeTab === 'swarm' && <SwarmEngine />}

      {activeTab === 'portfolio' && <ProofOfSkill />}

      {activeTab === 'leaderboard' && <Leaderboard />}

      {/* Global Modals & Notifications */}
      <TaskModal />
      <Toast />
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-sans">
        <Navbar />
        <MainContent />
        <Footer />
      </div>
    </AppProvider>
  );
}
