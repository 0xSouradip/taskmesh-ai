export const initialProjects = [
  {
    id: 'proj-1',
    name: 'AetherPay: Multi-Chain Checkout Widget',
    category: 'Fintech & Web3',
    description: 'A lightweight embeddable crypto checkout modal supporting Solana, Base, and Stripe fiat onramps for digital creators.',
    totalBudget: 1450,
    paidBudget: 420,
    tasksCount: 6,
    completedTasksCount: 2,
    leadAI: 'Autonomous Pipeline Engine v3.4',
    status: 'ACTIVE',
    createdAt: '2 days ago'
  },
  {
    id: 'proj-2',
    name: 'PulseCraft: AI Voice Note to Action Items',
    category: 'AI & Productivity',
    description: 'Transform rambling 5-minute audio voice notes into clean Jira/Linear tickets with acceptance criteria, priority tags, and assignees.',
    totalBudget: 2200,
    paidBudget: 1150,
    tasksCount: 8,
    completedTasksCount: 4,
    leadAI: 'SpecDecomposer Agent 2.1',
    status: 'ACTIVE',
    createdAt: '4 days ago'
  },
  {
    id: 'proj-3',
    name: 'Kanso Coffee: Flavor Wheel & Interactive Shop',
    category: 'Design & E-Commerce',
    description: 'Bespoke direct-to-consumer coffee brand identity, flavor radar widget, roast subscription microcopy, and responsive checkout.',
    totalBudget: 1350,
    paidBudget: 750,
    tasksCount: 5,
    completedTasksCount: 3,
    leadAI: 'CreativeMesh Orchestrator',
    status: 'ACTIVE',
    createdAt: '1 week ago'
  }
];

export const initialTasks = [
  {
    id: 'task-101',
    projectId: 'proj-1',
    projectName: 'AetherPay',
    title: 'Design Minimalist 3-Step Checkout Modal in Figma',
    category: 'Design',
    difficulty: 'Bite-Sized',
    estimatedHours: '2 - 3 hrs',
    bounty: 180,
    xp: 450,
    status: 'COMPLETED',
    claimedBy: 'elena_ux',
    prerequisites: [],
    description: 'Create a hyper-clean, accessible modal for selecting network, confirming wallet connection, and signing transaction.',
    deliverables: [
      'Figma community file link with auto-layout and dark/light components',
      'Design tokens (hex values, typography scale, border radii json)',
      '3-state transition frames: Idle, Signature Pending, Success Receipt'
    ],
    acceptanceCriteria: [
      'Auto-layout applied to all modal components',
      'WCAG AA color contrast compliant for all text and action buttons',
      'Standardized 8pt spatial grid system adhered to'
    ],
    submission: {
      submittedAt: 'Yesterday at 18:30',
      author: 'Elena Rostova (@elena_ux)',
      link: 'https://figma.com/@elena_ux/aetherpay-modal-spec',
      notes: 'Included complete component library with token JSON in file description.',
      aiReviewScore: 98,
      aiFeedback: 'Verified: Auto-layout is 100% compliant. Contrast ratio 7.4:1 exceeds WCAG AAA standard. Tokens extracted directly into repository sync queue.'
    }
  },
  {
    id: 'task-102',
    projectId: 'proj-1',
    projectName: 'AetherPay',
    title: 'Write Microcopy & Error State Messages for Checkout Flow',
    category: 'Copywriting',
    difficulty: 'Bite-Sized',
    estimatedHours: '1 - 2 hrs',
    bounty: 120,
    xp: 300,
    status: 'COMPLETED',
    claimedBy: 'liam_writes',
    prerequisites: ['task-101'],
    description: 'Produce crystal clear, calming copy for transaction states, including gas fee spikes, dropped RPCs, and failed signatures.',
    deliverables: [
      'JSON or Markdown document with copy keys for 14 error and status codes',
      'Plain English explanations for complex on-chain errors (e.g. slippage exceeded)'
    ],
    acceptanceCriteria: [
      'Zero crypto jargon in primary headlines',
      'Clear, actionable recovery step provided for every error condition',
      'Under 25 words per notification banner'
    ],
    submission: {
      submittedAt: 'Today at 09:15',
      author: 'Liam Chen (@liam_writes)',
      link: 'https://gist.github.com/liam_writes/aetherpay-i18n-en.json',
      notes: 'Created 14 key-value copy tokens with reassurance-first psychological framing.',
      aiReviewScore: 96,
      aiFeedback: 'Verified: Readability grade 6.4 (accessible to 95% of users). Direct action verbs used on 100% of recovery CTA buttons.'
    }
  },
  {
    id: 'task-103',
    projectId: 'proj-1',
    projectName: 'AetherPay',
    title: 'Build Tailwind + React Modal Component with Token Integration',
    category: 'Frontend',
    difficulty: 'Intermediate',
    estimatedHours: '3 - 4 hrs',
    bounty: 260,
    xp: 650,
    status: 'AVAILABLE',
    claimedBy: null,
    prerequisites: ['task-101', 'task-102'],
    description: 'Implement the finalized Figma modal in React using Tailwind CSS. Must consume the microcopy strings from task-102 and match the token spec.',
    deliverables: [
      'Clean React 19 functional component with Tailwind CSS',
      'Storybook / preview fixture showing all 4 visual states (Select, Confirm, Loading, Success)',
      'Unit tests for modal keyboard trapping (Esc, Tab focus cycle)'
    ],
    acceptanceCriteria: [
      'Zero layout shift on state transitions',
      'Aria-modal and aria-labelledby correctly configured for accessibility',
      'Matches Figma token specifications within 1px fidelity'
    ],
    submission: null
  },
  {
    id: 'task-104',
    projectId: 'proj-1',
    projectName: 'AetherPay',
    title: 'Solana & Base Wallet Adapter Connection Hook',
    category: 'Backend',
    difficulty: 'Intermediate',
    estimatedHours: '2 - 3 hrs',
    bounty: 240,
    xp: 600,
    status: 'AVAILABLE',
    claimedBy: null,
    prerequisites: [],
    description: 'Develop a unified React hook useWalletSession() supporting Phantom, Solflare, MetaMask, and Coinbase Wallet with auto-reconnect.',
    deliverables: [
      'TypeScript hook file with exported connection state enum',
      'Automatic chain switching handler with fallback error emitter'
    ],
    acceptanceCriteria: [
      'Graceful degradation when wallet extension is not installed',
      'Persistent session across browser reload via secure storage',
      'Typed payload response with address, chainId, and balance'
    ],
    submission: null
  },
  {
    id: 'task-105',
    projectId: 'proj-1',
    projectName: 'AetherPay',
    title: 'Payment Webhook Signature Verification Endpoint',
    category: 'Backend',
    difficulty: 'Intermediate',
    estimatedHours: '3 - 4 hrs',
    bounty: 280,
    xp: 700,
    status: 'BLOCKED',
    claimedBy: null,
    prerequisites: ['task-104'],
    description: 'Create an idempotent Node.js/Edge function to verify HMAC signatures on incoming transaction confirmation webhooks.',
    deliverables: [
      'Edge-compatible verification handler with crypto.subtle',
      'Replay attack prevention logic using nonce caching',
      'Integration test suite simulating forged and valid payloads'
    ],
    acceptanceCriteria: [
      'Constant-time string comparison to prevent timing attacks',
      'Sub-50ms execution latency on Vercel/Cloudflare edge',
      'Passes 100% of forged signature test cases'
    ],
    submission: null
  },
  {
    id: 'task-106',
    projectId: 'proj-1',
    projectName: 'AetherPay',
    title: 'E2E Cypress / Playwright Test Matrix for Checkout Flow',
    category: 'QA & Security',
    difficulty: 'Intermediate',
    estimatedHours: '2 - 3 hrs',
    bounty: 210,
    xp: 500,
    status: 'BLOCKED',
    claimedBy: null,
    prerequisites: ['task-103', 'task-104'],
    description: 'Write end-to-end integration tests testing happy path, wallet rejection, network timeout, and invalid amount inputs.',
    deliverables: [
      'Playwright test suite with mocked wallet provider',
      'HTML test report artifact with video recordings of failure states'
    ],
    acceptanceCriteria: [
      'Mock provider handles all 4 major wallet protocols',
      'Flakiness score below 1% across 10 consecutive headless runs',
      'Clear failure assertions for failed signature dialogues'
    ],
    submission: null
  },
  {
    id: 'task-201',
    projectId: 'proj-2',
    projectName: 'PulseCraft',
    title: 'Whisper Audio Pre-Processing & Noise Filter Script',
    category: 'AI & Prompts',
    difficulty: 'Bite-Sized',
    estimatedHours: '2 hrs',
    bounty: 190,
    xp: 450,
    status: 'COMPLETED',
    claimedBy: '0xSouradip',
    prerequisites: [],
    description: 'Create a lightweight WebAssembly audio chunker and vocal silence trimmer to optimize Whisper API token costs by 40%.',
    deliverables: [
      'Browser-side Web Audio API script for chunking at silence pauses',
      'Sample test audio files before/after token reduction metric'
    ],
    acceptanceCriteria: [
      'Trims silence pauses > 800ms without clipping phonetic word ends',
      'Runs client-side in under 120ms for 3-minute audio file'
    ],
    submission: {
      submittedAt: '3 days ago',
      author: 'Souradip Ghosh (@0xSouradip)',
      link: 'https://github.com/0xSouradip/audio-chunker-wasm',
      notes: 'Implemented using Web Audio API AudioBuffer. Successfully reduced token usage by 43.8% on sample recordings.',
      aiReviewScore: 100,
      aiFeedback: 'Verified: Zero audible clipping. Token benchmark verified with OpenAI Whisper tokenizer. Fast execution benchmark.'
    }
  },
  {
    id: 'task-202',
    projectId: 'proj-2',
    projectName: 'PulseCraft',
    title: 'Structured Linear Ticket Prompt Chain & JSON Schema',
    category: 'AI & Prompts',
    difficulty: 'Bite-Sized',
    estimatedHours: '1 - 2 hrs',
    bounty: 160,
    xp: 400,
    status: 'COMPLETED',
    claimedBy: '0xSouradip',
    prerequisites: ['task-201'],
    description: 'Construct a bulletproof structured prompt chain that parses stream-of-consciousness audio transcripts into strict JSON tickets.',
    deliverables: [
      'Few-shot prompt system instructions with JSON schema validation',
      'Benchmarked test cases for 10 challenging speech patterns'
    ],
    acceptanceCriteria: [
      '100% adherence to JSON schema output',
      'Accurate extraction of implied urgency, estimate, and assignees'
    ],
    submission: {
      submittedAt: '2 days ago',
      author: 'Souradip Ghosh (@0xSouradip)',
      link: 'https://github.com/0xSouradip/pulse-prompt-chain',
      notes: 'Included JSON schema, 10 few-shot test cases, and edge-case handling for multiple concurrent tasks mentioned in one breath.',
      aiReviewScore: 99,
      aiFeedback: 'Verified: 0 schema validation failures across 50 simulated transcript runs. Edge cases smoothly bifurcated.'
    }
  },
  {
    id: 'task-203',
    projectId: 'proj-2',
    projectName: 'PulseCraft',
    title: 'Linear & Jira OAuth2 Webhook Integration',
    category: 'Backend',
    difficulty: 'Intermediate',
    estimatedHours: '3 - 4 hrs',
    bounty: 310,
    xp: 750,
    status: 'AVAILABLE',
    claimedBy: null,
    prerequisites: ['task-202'],
    description: 'Implement API handler to dispatch generated tickets directly to users Linear team or Jira Cloud board with tags and links.',
    deliverables: [
      'OAuth2 token refresh handler for Linear and Jira',
      'Ticket dispatch service with automatic rate-limit backoff'
    ],
    acceptanceCriteria: [
      'Encrypted token storage using AES-256-GCM',
      'Exponential backoff retry policy on 429 rate limit errors'
    ],
    submission: null
  },
  {
    id: 'task-204',
    projectId: 'proj-2',
    projectName: 'PulseCraft',
    title: 'Interactive Audio Waveform Visualizer Component',
    category: 'Frontend',
    difficulty: 'Bite-Sized',
    estimatedHours: '2 hrs',
    bounty: 180,
    xp: 450,
    status: 'AVAILABLE',
    claimedBy: null,
    prerequisites: [],
    description: 'Create an animated, reactive canvas-based waveform that dances in real time while user is speaking voice notes.',
    deliverables: [
      'React component using HTML5 Canvas or SVG WebGL',
      'Smooth 60fps responsiveness on mobile Safari and Chrome'
    ],
    acceptanceCriteria: [
      'Clean fallback when microphone permissions are denied',
      'GPU accelerated with zero main-thread lag'
    ],
    submission: null
  },
  {
    id: 'task-301',
    projectId: 'proj-3',
    projectName: 'Kanso Coffee',
    title: 'Interactive SVG Flavor Wheel Component',
    category: 'Frontend',
    difficulty: 'Intermediate',
    estimatedHours: '3 hrs',
    bounty: 250,
    xp: 600,
    status: 'AVAILABLE',
    claimedBy: null,
    prerequisites: [],
    description: 'Build an interactive multi-ring radial SVG diagram allowing customers to click tasting notes (Fruity -> Berry -> Blackberry) to filter roasts.',
    deliverables: [
      'Interactive React SVG component with animated zoom/focus states',
      'Callback props onNoteSelect(noteId: string) for store filtering'
    ],
    acceptanceCriteria: [
      'Responsive down to 360px viewport width',
      'Aria attributes allowing keyboard navigation between flavor sectors'
    ],
    submission: null
  },
  {
    id: 'task-302',
    projectId: 'proj-3',
    projectName: 'Kanso Coffee',
    title: 'Sensory Microcopy for 8 Single-Origin Roasts',
    category: 'Copywriting',
    difficulty: 'Bite-Sized',
    estimatedHours: '1 - 2 hrs',
    bounty: 140,
    xp: 350,
    status: 'AVAILABLE',
    claimedBy: null,
    prerequisites: [],
    description: 'Craft evocative, punchy 3-sentence descriptions for 8 specialty roasts (Ethiopian Yirgacheffe, Colombia Huila, etc.).',
    deliverables: [
      '8 product copy cards with: Hook line, Tasting profile, Brew recommendation',
      'SEO metadata title and descriptions under 155 characters'
    ],
    acceptanceCriteria: [
      'Avoid cliché coffee adjectives ("rich", "smooth", "bold")',
      'Highlight origin story and specific processing method (natural vs washed)'
    ],
    submission: null
  }
];

export const sampleFreelancers = [
  {
    id: 'user-0',
    name: 'Souradip Ghosh',
    handle: '0xSouradip',
    avatar: 'https://avatars.githubusercontent.com/u/275792224?v=4',
    title: 'AI Systems Architect & Full-Stack Engineer',
    bio: 'Passionate builder specializing in decentralized systems, AI automation pipelines, and modular UI engineering.',
    xp: 1850,
    level: 7,
    bountiesEarned: 890,
    tasksCompleted: 4,
    acceptanceRate: 100,
    speedRating: 'Top 5% (1.8x avg)',
    skills: [
      { name: 'AI & Prompts', level: 92 },
      { name: 'Frontend (React)', level: 88 },
      { name: 'Backend & APIs', level: 84 },
      { name: 'Web3 & Crypto', level: 78 },
      { name: 'QA & Testing', level: 86 }
    ],
    badges: [
      { id: 'b-1', name: 'Zero-Flaw Execution', description: '100% first-pass AI acceptance rate on 4 consecutive tasks', icon: 'ShieldCheck' },
      { id: 'b-2', name: 'Prompt Maestro', description: 'Engineered zero-schema-failure prompt pipelines', icon: 'Sparkles' },
      { id: 'b-3', name: 'Speed Demon', description: 'Completed tasks in under 50% of allocated window', icon: 'Zap' }
    ]
  },
  {
    id: 'user-1',
    name: 'Elena Rostova',
    handle: 'elena_ux',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Design Systems & Product Designer',
    bio: 'Ex-Figma community creator. Obsessed with auto-layout, atomic design tokens, and WCAG AAA accessibility.',
    xp: 3420,
    level: 12,
    bountiesEarned: 1680,
    tasksCompleted: 9,
    acceptanceRate: 98,
    speedRating: 'Top 10%',
    skills: [
      { name: 'UI/UX Design', level: 98 },
      { name: 'Design Tokens', level: 95 },
      { name: 'Prototyping', level: 90 },
      { name: 'Micro-interactions', level: 85 }
    ],
    badges: [
      { id: 'b-4', name: 'Pixel Perfectionist', description: 'Achieved 98+ score on 5 consecutive design reviews', icon: 'Eye' },
      { id: 'b-5', name: 'Token Master', description: 'Exported machine-readable tokens for 8 swarms', icon: 'Cpu' }
    ]
  },
  {
    id: 'user-2',
    name: 'Marcus Vance',
    handle: 'marcus_rust',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Rust & Smart Contract Specialist',
    bio: 'Writing provably secure distributed code and cryptographic hooks. Zero memory leaks guaranteed.',
    xp: 2900,
    level: 10,
    bountiesEarned: 1420,
    tasksCompleted: 6,
    acceptanceRate: 97,
    speedRating: 'Top 15%',
    skills: [
      { name: 'Rust & Solana', level: 94 },
      { name: 'Cryptography', level: 90 },
      { name: 'Performance Optimization', level: 93 }
    ],
    badges: [
      { id: 'b-6', name: 'Iron Clad', description: 'Zero security vulnerabilities found across 6 smart contracts', icon: 'Lock' }
    ]
  },
  {
    id: 'user-3',
    name: 'Liam Chen',
    handle: 'liam_writes',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Conversion & Technical Copywriter',
    bio: 'Making complicated technical concepts feel intuitive and crystal clear. Less jargon, more conversions.',
    xp: 2150,
    level: 8,
    bountiesEarned: 960,
    tasksCompleted: 7,
    acceptanceRate: 99,
    speedRating: 'Top 8%',
    skills: [
      { name: 'UX Microcopy', level: 96 },
      { name: 'Technical Docs', level: 91 },
      { name: 'Brand Voice', level: 89 }
    ],
    badges: [
      { id: 'b-7', name: 'Clarity Champion', description: 'Grade 6 readability on technical error flows', icon: 'Feather' }
    ]
  }
];

export const initialAIEvents = [
  {
    id: 'ev-1',
    timestamp: '2 mins ago',
    type: 'TASK_VERIFIED',
    message: 'AI Verifier: Task #102 verified for @liam_writes with 96/100 score.',
    badge: 'Verification',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    id: 'ev-2',
    timestamp: '5 mins ago',
    type: 'PREREQUISITE_UNLOCKED',
    message: 'Autonomous Dependency Engine: Unlocked Task #103 (React Modal) for the frontend swarm!',
    badge: 'Graph Unlocked',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
  },
  {
    id: 'ev-3',
    timestamp: '12 mins ago',
    type: 'BOUNTY_PAID',
    message: 'Micro-Escrow: $120 USDC + 300 XP automatically transferred to @liam_writes.',
    badge: 'Instant Escrow',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  },
  {
    id: 'ev-4',
    timestamp: '28 mins ago',
    type: 'SWARM_MATCH',
    message: 'Skill Matcher: Matched 4 high-affinity contributors for Solana Adapter (Task #104).',
    badge: 'Auto-Routing',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
  },
  {
    id: 'ev-5',
    timestamp: '1 hour ago',
    type: 'PROJECT_DECOMPOSED',
    message: 'Project Architect: Successfully decomposed "PulseCraft" into 8 modular micro-tasks with DAG constraints.',
    badge: 'Decomposition',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  }
];

export const projectTemplates = [
  {
    title: 'AI Travel Companion Mobile App',
    category: 'AI & Mobile',
    description: 'An intelligent itinerary generator that syncs flight delays, predicts weather shifts, and dynamically re-routes daily city walk guides.',
    tasks: [
      {
        title: 'Design Dark-Mode Map & Itinerary Card System in Figma',
        category: 'Design',
        difficulty: 'Bite-Sized',
        estimatedHours: '2 hrs',
        bounty: 180,
        xp: 450,
        deliverables: ['Figma file with map pin tokens and swipeable daily card components']
      },
      {
        title: 'OpenStreetMap & Mapbox Vector Tile Renderer',
        category: 'Frontend',
        difficulty: 'Intermediate',
        estimatedHours: '3 hrs',
        bounty: 240,
        xp: 600,
        deliverables: ['React Native / React component rendering optimized vector tiles']
      },
      {
        title: 'FlightAware & Weather API Ingestion Lambda',
        category: 'Backend',
        difficulty: 'Intermediate',
        estimatedHours: '3 hrs',
        bounty: 270,
        xp: 650,
        deliverables: ['Serverless handler with caching and rate limit defense']
      },
      {
        title: 'Local Discovery Microcopy & City Cultural Tips',
        category: 'Copywriting',
        difficulty: 'Bite-Sized',
        estimatedHours: '2 hrs',
        bounty: 130,
        xp: 320,
        deliverables: ['30 neighborhood micro-guides with concise recommendations']
      }
    ]
  },
  {
    title: 'B2B SaaS Developer Analytics Dashboard',
    category: 'DevTools & Analytics',
    description: 'Real-time telemetry and API usage dashboard with webhook logs, latency heatmaps, and role-based team billing.',
    tasks: [
      {
        title: 'High-Density Metric Cards & Latency Heatmap in Tailwind',
        category: 'Frontend',
        difficulty: 'Intermediate',
        estimatedHours: '3 hrs',
        bounty: 260,
        xp: 650,
        deliverables: ['Reusable React/Tailwind chart cards with live pulse animations']
      },
      {
        title: 'TimescaleDB / ClickHouse Aggregation Query Suite',
        category: 'Backend',
        difficulty: 'Challenging',
        estimatedHours: '4 hrs',
        bounty: 340,
        xp: 850,
        deliverables: ['Optimized SQL queries for p50, p95, p99 latency percentiles']
      },
      {
        title: 'Stripe Usage-Based Metered Billing Webhook Service',
        category: 'Backend',
        difficulty: 'Intermediate',
        estimatedHours: '3 hrs',
        bounty: 290,
        xp: 700,
        deliverables: ['Idempotent usage reporting script with replay protection']
      },
      {
        title: 'CLI Onboarding Tour & Interactive Terminal Guide',
        category: 'Copywriting',
        difficulty: 'Bite-Sized',
        estimatedHours: '1.5 hrs',
        bounty: 140,
        xp: 350,
        deliverables: ['ASCII terminal walk-through script with clear installation steps']
      }
    ]
  },
  {
    title: 'Zero-Knowledge Document Notary dApp',
    category: 'Security & Web3',
    description: 'Tamper-proof file hashing and timestamping service where documents are verified on-chain without exposing private file contents.',
    tasks: [
      {
        title: 'Client-side SHA-256 File Chunker & Merkle Tree Generator',
        category: 'Frontend',
        difficulty: 'Intermediate',
        estimatedHours: '3 hrs',
        bounty: 250,
        xp: 600,
        deliverables: ['Web Worker hashing script capable of processing 2GB files in browser']
      },
      {
        title: 'EVM Smart Contract for Immutable Timestamp Storage',
        category: 'Backend',
        difficulty: 'Intermediate',
        estimatedHours: '3 hrs',
        bounty: 320,
        xp: 800,
        deliverables: ['Solidity contract with gas-optimized batch notarization and unit tests']
      },
      {
        title: 'Security Audit & Fuzzing Test Suite',
        category: 'QA & Security',
        difficulty: 'Challenging',
        estimatedHours: '4 hrs',
        bounty: 380,
        xp: 900,
        deliverables: ['Foundry fuzz test suite verifying edge case protections against frontrunning']
      }
    ]
  }
];
