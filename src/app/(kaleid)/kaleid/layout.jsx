import './kaleid.css';

export const metadata = {
  title: 'Kaleid: answers from your company’s own documents',
  description:
    'Kaleid reads your documents, tickets and chats, then answers in plain language with the sources attached.',
};

export const viewport = { themeColor: '#060609' };

// Separate root layout: Kaleid shares nothing with the TaskMesh shell.
export default function KaleidLayout({ children }) {
  return (
    <html lang="en">
      <body className="kaleid-page">{children}</body>
    </html>
  );
}
