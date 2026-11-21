import TaskBoard from '@/components/TaskBoard';

export const metadata = { title: 'Tasks', description: 'Fixed-price tasks with clear deliverables. Pick one up and get paid when it passes review.' };

export default async function Page({ searchParams }) {
  const { q } = await searchParams;
  return <TaskBoard initialQuery={typeof q === 'string' ? q.slice(0, 100) : ''} />;
}
