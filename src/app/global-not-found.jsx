// Unmatched URLs. With two root layouts ((taskmesh) and (kaleid)) there is no single
// layout to build a 404 from, so this page brings its own <html> and TaskMesh styles.
import './(taskmesh)/globals.css';

export const metadata = {
  title: '404 | TaskMesh',
  description: 'This page does not exist.',
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f19] text-slate-100 antialiased min-h-screen flex items-center justify-center p-6">
        <main className="text-center space-y-4">
          <p className="text-xs font-mono uppercase tracking-widest text-indigo-400">404</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">This page does not exist.</h1>
          <p className="text-sm text-slate-400">The link may be old, or the page may have moved.</p>
          {/* Plain <a>: a full load is required to enter a root layout from here. */}
          <a href="/" className="inline-block mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">
            Back to the quest board
          </a>
        </main>
      </body>
    </html>
  );
}
