'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Menu, X, LogOut, User, BadgeCheck } from 'lucide-react';
import { useApp } from './AppProvider';
import { authClient } from '@/lib/auth/client';
import { CrystalMark } from './ui/CrystalMark';
import { Avatar } from './ui/bits';

export const NAV = [
  { href: '/tasks', label: 'Tasks' },
  { href: '/decomposer', label: 'Post a project' },
  { href: '/swarm', label: 'Activity' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/team', label: 'Team' },
];

export default function Navbar() {
  const { currentUser } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const signInHref = `/sign-in?next=${encodeURIComponent(query ? `${pathname}?${query}` : pathname)}`;

  async function signOut() {
    await authClient.signOut();
    router.push('/');
    router.refresh();
  }

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label="Main" className="fixed top-3.5 inset-x-0 z-50 flex justify-center px-3.5 pointer-events-none">
      <div className="nav-bar pointer-events-auto w-full max-w-[1240px] h-[58px] flex items-center gap-3 sm:gap-6 pl-5 pr-2.5 rounded-full bg-panel/40 backdrop-blur-[22px] backdrop-saturate-[1.8] shadow-[inset_0_0_0_1px_var(--color-line),inset_0_1px_0_0_rgb(243_240_234/0.18)]">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-[17px]">
          <CrystalMark size={22} />
          TaskMesh
        </Link>

        <ul className="hidden lg:flex gap-6 mx-auto text-[14px] text-fg-2">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className="hover:text-fg transition-colors aria-[current=page]:text-fg"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto lg:ml-0 flex items-center gap-2">
          {currentUser ? (
            <>
              <button
                type="button"
                popoverTarget="account-menu"
                className="flex items-center gap-2 rounded-full pl-1 pr-3 h-10 hover:bg-fg/[0.07] transition-colors"
                aria-label="Account menu"
              >
                <Avatar src={currentUser.avatar} name={currentUser.name} size={30} />
                <span className="hidden sm:block text-[14px] max-w-[140px] truncate">{currentUser.name}</span>
              </button>
              <div
                id="account-menu"
                popover="auto"
                className="glass p-2 w-60 text-fg m-0 [inset:80px_max(16px,calc((100vw-1240px)/2))_auto_auto]"
              >
                <div className="px-3 py-2.5 border-b border-line mb-1">
                  <div className="font-medium truncate">{currentUser.name}</div>
                  <div className="text-[13px] text-fg-2 truncate">@{currentUser.handle}</div>
                </div>
                <MenuLink href="/account" icon={User}>Account</MenuLink>
                <MenuLink href={`/portfolio?handle=${encodeURIComponent(currentUser.handle)}`} icon={BadgeCheck}>
                  Public profile
                </MenuLink>
                <button
                  type="button"
                  onClick={signOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[14px] text-fg-2 hover:text-fg hover:bg-fg/[0.07]"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" /> Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href={signInHref} className="hidden sm:inline-flex pill pill-ghost pill-sm">
                Sign in
              </Link>
              <Link href={signInHref} className="hidden sm:inline-flex pill pill-primary pill-sm">
                Get started
              </Link>
            </>
          )}

          <button
            type="button"
            className="lg:hidden grid place-items-center w-10 h-10 rounded-full hover:bg-fg/[0.07]"
            aria-label="Open menu"
            onClick={() => menuRef.current?.showModal()}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu: native dialog gives focus trap, Esc and backdrop for free. */}
      <dialog ref={menuRef} className="sheet pointer-events-auto" aria-label="Menu" onClick={(e) => e.target === menuRef.current && menuRef.current.close()}>
        <div className="glass p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="flex items-center gap-2.5 font-semibold"><CrystalMark size={22} /> TaskMesh</span>
            <button type="button" aria-label="Close menu" className="grid place-items-center w-10 h-10 rounded-full hover:bg-fg/[0.07]" onClick={() => menuRef.current?.close()}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => menuRef.current?.close()}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="block px-4 py-3 rounded-2xl text-2xl font-semibold tracking-tight text-fg-2 aria-[current=page]:text-fg hover:bg-fg/[0.06]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {!currentUser && (
            <Link href={signInHref} onClick={() => menuRef.current?.close()} className="pill pill-primary w-full mt-6">
              Sign in with Google
            </Link>
          )}
        </div>
      </dialog>
    </nav>
  );
}

function MenuLink({ href, icon: Icon, children }) {
  return (
    <Link
      href={href}
      onClick={() => document.getElementById('account-menu')?.hidePopover()}
      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[14px] text-fg-2 hover:text-fg hover:bg-fg/[0.07]"
    >
      <Icon className="w-4 h-4" aria-hidden="true" /> {children}
    </Link>
  );
}
