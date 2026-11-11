'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logIn, signUp } from '@/lib/actions';

const input =
  'w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500';

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError('');
    const form = Object.fromEntries(new FormData(e.currentTarget));
    const res = mode === 'login' ? await logIn(form) : await signUp(form);
    setPending(false);
    if (!res.ok) return setError(res.error);
    router.push('/');
  }

  const isSignup = mode === 'signup';

  return (
    <div className="py-16 px-4 flex justify-center">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4"
      >
        <h1 className="text-2xl font-extrabold text-white">{isSignup ? 'Create account' : 'Log in'}</h1>

        {isSignup && (
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-300">Username</span>
            <input name="username" required minLength={2} maxLength={39} autoComplete="username" className={input} />
          </label>
        )}
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-slate-300">Email</span>
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-slate-300">Password</span>
          <input
            name="password"
            type="password"
            required
            minLength={isSignup ? 8 : undefined}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            className={input}
          />
        </label>

        {error && (
          <p role="alert" className="text-xs text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold disabled:opacity-50"
        >
          {pending ? '…' : isSignup ? 'Sign up' : 'Log in'}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(isSignup ? 'login' : 'signup');
            setError('');
          }}
          className="w-full text-xs text-slate-400 hover:text-white"
        >
          {isSignup ? 'Have an account? Log in' : 'No account? Sign up'}
        </button>
      </form>
    </div>
  );
}
