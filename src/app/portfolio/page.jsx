import ProofOfSkill from '@/components/ProofOfSkill';

export const metadata = { title: 'Profile', description: 'Verified work delivered on TaskMesh.' };

export default async function Page({ searchParams }) {
  const { handle } = await searchParams;
  return <ProofOfSkill key={handle} initialHandle={typeof handle === 'string' ? handle : undefined} />;
}
