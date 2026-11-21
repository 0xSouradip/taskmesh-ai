import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/profile';
import Account from '@/components/Account';

export const metadata = { title: 'Account', robots: { index: false } };

export default async function AccountPage() {
  // proxy.js already guards /account; this keeps the page safe on its own.
  if (!(await getCurrentProfile())) redirect('/sign-in?next=/account');
  return <Account />;
}
