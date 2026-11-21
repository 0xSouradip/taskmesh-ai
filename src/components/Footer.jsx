'use client';

import Link from 'next/link';
import { useApp } from './AppProvider';
import { CrystalMark } from './ui/CrystalMark';
import { NAV } from './Navbar';

const YEAR = new Date().getFullYear();

export default function Footer() {
  const { coreTeam } = useApp();

  return (
    <footer className="border-t border-line mt-24">
      <div className="w-[min(1240px,100%-40px)] mx-auto py-14 grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-4 max-w-md">
          <div className="flex items-center gap-2.5 font-semibold text-[17px]">
            <CrystalMark size={22} /> TaskMesh
          </div>
          <p className="text-[14px] text-fg-2">
            Big projects, shipped as small tasks. Specialists do what they are best at, AI checks the work, and every finished task becomes public proof of skill.
          </p>
          {coreTeam.length > 0 && (
            <p className="text-[13px] text-fg-2">
              Built by {coreTeam.map((m) => m.name).join(', ').replace(/, ([^,]*)$/, ' and $1')}.
            </p>
          )}
        </div>

        <nav aria-label="Product">
          <h2 className="text-[13px] font-medium text-fg mb-3">Product</h2>
          <ul className="space-y-2 text-[14px] text-fg-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-fg">{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="text-[13px] font-medium text-fg mb-3">Company</h2>
          <ul className="space-y-2 text-[14px] text-fg-2">
            <li><Link href="/team" className="hover:text-fg">About the team</Link></li>
            <li><Link href="/terms" className="hover:text-fg">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-fg">Privacy</Link></li>
            <li><a href="https://github.com/0xSouradip/taskmesh-ai" target="_blank" rel="noreferrer" className="hover:text-fg">GitHub</a></li>
          </ul>
        </nav>
      </div>
      <div className="w-[min(1240px,100%-40px)] mx-auto py-6 border-t border-line text-[13px] text-fg-2 flex flex-wrap justify-between gap-3">
        <span>© {YEAR} TaskMesh</span>
        <span>Payouts shown are in USD. Demo projects are illustrative.</span>
      </div>
    </footer>
  );
}
