// Simulated AI. This file is the single seam to swap in a real LLM (decompose + verify).

const FEEDBACK = [
  'Autonomous Verifier: 100% test passing rate. Acceptance criteria fully satisfied. Clean adherence to project spec.',
  'AI Lint & Static Analysis: Zero discrepancies discovered. Security assertions verified. Code quality index 9.8/10.',
  'Quality Assurance Engine: Complete coverage verified against acceptance criteria. Excellent execution clarity.',
];

export function verify(/* task, submission */) {
  return {
    score: Math.floor(Math.random() * 6) + 95, // 95..100
    feedback: FEEDBACK[Math.floor(Math.random() * FEEDBACK.length)],
  };
}

// `template` is a matching row from project_templates, if any.
export function decompose(title, template) {
  if (template) return template.tasks;
  return [
    {
      title: `Design High-Fidelity UI Kit & Design Tokens for ${title}`,
      category: 'Design', difficulty: 'Bite-Sized', estimatedHours: '2 hrs', bounty: 190, xp: 450,
      deliverables: ['Figma token JSON & component auto-layout library'],
      acceptanceCriteria: ['WCAG AA accessible contrast', 'Standard 8pt spatial grid'],
    },
    {
      title: `Draft Value Proposition & Onboarding Microcopy for ${title}`,
      category: 'Copywriting', difficulty: 'Bite-Sized', estimatedHours: '1.5 hrs', bounty: 130, xp: 320,
      deliverables: ['JSON copy file with landing headlines and user reassurance notes'],
      acceptanceCriteria: ['Grade 7 readability', 'Zero jargon in primary actions'],
    },
    {
      title: `Build Responsive Tailwind React Interface Shell for ${title}`,
      category: 'Frontend', difficulty: 'Intermediate', estimatedHours: '3 hrs', bounty: 270, xp: 680,
      deliverables: ['Modular React component tree implementing design tokens'],
      acceptanceCriteria: ['Passes headless responsive tests at 375px and 1440px'],
    },
    {
      title: `Implement Core API Routes & Data Persistence for ${title}`,
      category: 'Backend', difficulty: 'Intermediate', estimatedHours: '3.5 hrs', bounty: 310, xp: 750,
      deliverables: ['Edge-ready REST/tRPC handlers with zod input validation'],
      acceptanceCriteria: ['Strict input sanitization', 'Sub-100ms response benchmarks'],
    },
    {
      title: `Automated Integration & Edge Case Test Suite for ${title}`,
      category: 'QA & Security', difficulty: 'Bite-Sized', estimatedHours: '2 hrs', bounty: 180, xp: 450,
      deliverables: ['Playwright or Vitest automated test suite with coverage report'],
      acceptanceCriteria: ['100% assertions pass', 'Zero flakiness'],
    },
  ];
}
