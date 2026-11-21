'use client';

import './globals.css';

// Last-resort error page: replaces the root layout when the layout itself fails
// (for example the database is down, since the layout loads shared data).
export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="min-h-screen grid place-items-center px-5 text-center">
        <div className="max-w-md">
          <p className="eyebrow mb-4">TaskMesh is having trouble</p>
          <h1 className="h-page">We couldn’t load the site.</h1>
          <p className="mt-4 text-fg-2">This is usually temporary. Try again in a moment.</p>
          {error?.digest && <p className="mt-2 text-[13px] text-fg-2 font-mono">Reference {error.digest}</p>}
          <button type="button" onClick={reset} className="pill pill-primary mt-8">Try again</button>
        </div>
      </body>
    </html>
  );
}
