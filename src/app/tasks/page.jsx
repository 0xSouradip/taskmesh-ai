import TaskBoard from '@/components/TaskBoard';

export const metadata = { title: 'Tasks', description: 'Small tasks with an agreed fee and clear acceptance criteria. Claim one, deliver it, and get accepted by the project owner.' };

export default async function Page({ searchParams }) {
  const { q } = await searchParams;
  return <TaskBoard initialQuery={typeof q === 'string' ? q.slice(0, 100) : ''} />;
}
