import Prose from '@/components/ui/Prose';

export const metadata = { title: 'Terms', description: 'The terms for using TaskMesh.' };

// Placeholder terms. Have them reviewed by a lawyer before launch.
export default function Terms() {
  return (
    <Prose eyebrow="Legal" title="Terms of use" updated="November 2026">
      <p>These terms cover your use of TaskMesh. By signing in you agree to them.</p>
      <h2>Your account</h2>
      <p>You sign in with Google. You are responsible for activity on your account and for keeping your Google account secure.</p>
      <h2>Tasks and deliveries</h2>
      <ul>
        <li>Claim only tasks you intend to deliver. Abandoned claims may be released.</li>
        <li>Deliver original work you have the right to hand over. Payment transfers ownership of the delivered work to the project owner unless the task says otherwise.</li>
        <li>Automated review decides acceptance against the task’s criteria. Disputes can be raised with us.</li>
      </ul>
      <h2>Projects</h2>
      <p>Project owners must describe work honestly and fund the tasks they publish. Illegal, harmful or deceptive projects are removed.</p>
      <h2>Changes</h2>
      <p>We may update these terms. Material changes will be announced on the site before they take effect.</p>
    </Prose>
  );
}
