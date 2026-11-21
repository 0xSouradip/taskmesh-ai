import './globals.css';
import { getCurrentProfile } from '@/lib/auth/profile';
import { getAppData } from '@/lib/queries';
import { AppProvider } from '@/components/AppProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TaskModal from '@/components/TaskModal';
import Toast from '@/components/Toast';
import Effects from '@/components/ui/Effects';

const description =
  'Break big projects into small, well-specified tasks. Specialists pick them up, AI checks the work, and every finished task becomes public proof of skill.';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'TaskMesh: big projects, shipped as small tasks', template: '%s · TaskMesh' },
  description,
  openGraph: { type: 'website', siteName: 'TaskMesh', title: 'TaskMesh', description },
  twitter: { card: 'summary_large_image', title: 'TaskMesh', description },
};

export const viewport = { themeColor: '#060609', colorScheme: 'dark' };

// Every page shows live tasks and the signed-in user, so nothing may be prerendered at build time.
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }) {
  const profile = await getCurrentProfile();
  const data = await getAppData(profile?.id);

  return (
    <html lang="en">
      <body>
        <Effects />
        <div className="grain" aria-hidden="true" />
        <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] pill pill-primary pill-sm">
          Skip to content
        </a>
        <AppProvider data={data}>
          <Navbar />
          <main id="content" className="relative isolate min-h-[70vh]">
            {children}
          </main>
          <Footer />
          <TaskModal />
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
