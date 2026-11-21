'use client';

// Shown when a page fails to render (for example the database is unreachable).
export default function Error({ error, reset }) {
  return (
    <div className="min-h-[70vh] grid place-items-center px-5 pt-[120px] text-center">
      <div className="max-w-md">
        <p className="eyebrow mb-4">Something went wrong</p>
        <h1 className="h-page">We couldn’t load this page.</h1>
        <p className="mt-4 text-fg-2">This is usually temporary. Try again in a moment.</p>
        {error?.digest && <p className="mt-2 text-[13px] text-fg-2 font-mono">Reference {error.digest}</p>}
        <button type="button" onClick={reset} className="pill pill-primary mt-8">Try again</button>
      </div>
    </div>
  );
}
