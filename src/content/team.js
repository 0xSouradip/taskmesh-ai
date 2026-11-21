// The real founding team, shown on /team, the home page and the footer.
// Static content: these are not database users. A founder's card links to their
// TaskMesh profile once they sign in with this email (matched on the server).
// GitHub is left empty where we don't have the person's own profile URL.
export const TEAM = [
  {
    name: 'Souradip Ghosh',
    role: 'Lead Engineer & AI Architect',
    tagline: 'Student & tech enthusiast',
    bio: 'A 19-year-old student with a pure science background and a drive for modern programming and decentralized systems. Leads TaskMesh’s dependency engine, AI review and full-stack infrastructure.',
    image: '/team/souradip.jpg',
    email: 'ghoshsouradip@gmail.com',
    github: 'https://github.com/0xSouradip',
    skills: ['AI orchestration', 'Full-stack architecture', 'Dependency graphs'],
    badge: 'Founding lead',
  },
  {
    name: 'Angshu Sarkar',
    role: 'Frontend Engineer',
    tagline: 'Computer science student',
    bio: 'Student developer focused on frontend engineering, component systems, Tailwind CSS and state management. Builds the interfaces that make small tasks easy to pick up.',
    image: '/team/angshu.jpg',
    email: 'sarkarangshu04@gmail.com',
    github: null,
    skills: ['React & Tailwind CSS', 'Interactive components', 'UI performance'],
    badge: 'Founding engineer',
  },
  {
    name: 'Sneha Mukherjee',
    role: 'Frontend Engineer',
    tagline: 'Engineering student',
    bio: 'Engineering student working on modern JavaScript, accessible design and motion. Turns task requirements into clear, usable flows.',
    image: '/team/sneha.jpg',
    email: 'snehamukherjee387@gmail.com',
    github: null,
    skills: ['Frontend UI', 'Accessibility (WCAG)', 'Animation & canvas'],
    badge: 'Founding engineer',
  },
];
