import ProofOfSkill from '@/components/ProofOfSkill';

export default async function Page({ searchParams }) {
  const { handle } = await searchParams;
  return <ProofOfSkill key={handle} initialHandle={handle} />;
}
