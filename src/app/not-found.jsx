import Link from 'next/link';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-5 pt-[120px] text-center">
      <div>
        <p className="eyebrow mb-4">404</p>
        <h1 className="h-page">This page doesn’t exist.</h1>
        <p className="mt-4 text-fg-2">The link may be old, or the page may have moved.</p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link href="/" className="pill pill-primary">Go home</Link>
          <Link href="/tasks" className="pill pill-secondary">Browse tasks</Link>
        </div>
      </div>
    </div>
  );
}
