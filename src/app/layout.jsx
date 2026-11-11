import './globals.css';
import { getSessionUserId } from '@/lib/auth';
import { getAppData } from '@/lib/queries';
import { AppProvider } from '@/components/AppProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TaskModal from '@/components/TaskModal';
import Toast from '@/components/Toast';

export const metadata = {
  title: 'TaskMesh | AI-Orchestrated Micro-Freelancing & Proof of Skill',
  description:
    'Break big projects into bite-sized micro-tasks. AI handles dependencies and coordination. Proof of work over resumes.',
};

export default async function RootLayout({ children }) {
  const data = await getAppData(await getSessionUserId());

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0b0f19] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200 min-h-screen">
        <AppProvider data={data}>
          <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-sans">
            <Navbar />
            <main className="flex-1 min-h-[calc(100vh-4rem)]">
              {children}
              <TaskModal />
              <Toast />
            </main>
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
