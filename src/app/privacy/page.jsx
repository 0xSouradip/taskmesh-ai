import Prose from '@/components/ui/Prose';

export const metadata = { title: 'Privacy', description: 'What TaskMesh collects and why.' };

// Placeholder policy. Have it reviewed before launch and keep it in sync with what the app stores.
export default function Privacy() {
  return (
    <Prose eyebrow="Legal" title="Privacy policy" updated="November 2026">
      <p>We keep what we need to run TaskMesh and nothing more.</p>
      <h2>What we store</h2>
      <ul>
        <li>From Google sign-in: your name, email address and profile photo.</li>
        <li>What you add: your headline and bio, tasks you claim, links and notes you submit, and projects you publish.</li>
        <li>A session cookie that keeps you signed in.</li>
      </ul>
      <h2>What is public</h2>
      <p>Your name, photo, handle, headline, bio, delivered work and stats are public on your profile and the leaderboard. Your email address is never shown publicly.</p>
      <h2>Who processes it</h2>
      <p>Data is stored in a Neon Postgres database. Sign-in is handled by Neon Auth and Google. The site is hosted on Vercel.</p>
      <h2>Your choices</h2>
      <p>You can edit your profile at any time from your account page. To delete your account and data, contact the team from the <a href="/team">team page</a>.</p>
    </Prose>
  );
}
