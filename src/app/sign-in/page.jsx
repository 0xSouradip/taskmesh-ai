import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authConfigured } from '@/lib/auth/server';
import { getCurrentProfile } from '@/lib/auth/profile';
import { safeNext } from '@/lib/auth/safe-next';
import GoogleButton from '@/components/GoogleButton';
import { CrystalMark } from '@/components/ui/CrystalMark';

export const metadata = { title: 'Sign in', robots: { index: false } };

export default async function SignInPage({ searchParams }) {
  const { next } = await searchParams;
  const target = safeNext(next);
  if (await getCurrentProfile()) redirect(target);

  return (
    <div className="min-h-[100svh] grid place-items-center px-5 pt-[120px] pb-16">
      <span className="disc disc-amber left-[10%] top-[10%]" aria-hidden="true" />
      <div className="glass w-full max-w-[440px] p-8 sm:p-10 text-center">
        <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-fg/[0.06] shadow-[inset_0_0_0_1px_var(--color-line)]">
          <CrystalMark size={28} />
        </span>
        <h1 className="mt-6 text-[30px] font-semibold tracking-[-0.03em]">Sign in to TaskMesh</h1>
        <p className="mt-2 text-fg-2">Claim tasks, build a public record of accepted work, and post your own projects.</p>

        {authConfigured() ? (
          <GoogleButton callbackURL={target} />
        ) : (
          <p role="alert" className="mt-8 well p-4 text-[14px] text-fg-2">
            Sign-in is not available yet. The site owner still needs to connect Neon Auth.
          </p>
        )}

        <p className="mt-8 text-[13px] text-fg-2">
          By continuing you agree to the <Link href="/terms" className="underline hover:text-fg">Terms</Link> and{' '}
          <Link href="/privacy" className="underline hover:text-fg">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
