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
        <li>Deliver original work you have the right to hand over. Once the owner pays the agreed fee, ownership of the delivered work passes to them unless the task says otherwise.</li>
        <li>The project owner decides whether a delivery is accepted. An automated AI check gives the owner advice, but it does not decide.</li>
      </ul>
      <h2>Fees and payment</h2>
      <p>
        Each task shows a fee agreed in advance. The project owner pays the specialist directly, outside TaskMesh. TaskMesh does not process,
        hold or guarantee payments, and is not a party to the agreement between owner and specialist. When you share a task, each side can see
        the other’s email address to arrange payment.
      </p>
      <h2>Projects</h2>
      <p>Project owners must describe work honestly and fund the tasks they publish. Illegal, harmful or deceptive projects are removed.</p>
      <h2>Changes</h2>
      <p>We may update these terms. Material changes will be announced on the site before they take effect.</p>
    </Prose>
  );
}
