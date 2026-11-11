# ⚡ TaskMesh — AI-Orchestrated Micro-Freelancing & Verifiable Proof-of-Skill Platform

> **"Hiring a freelancer is risky. A resume can’t tell you if someone can really do the work. Managing a stranger for weeks takes more time than most people have. And good freelancers are tired of doing unpaid test projects just to be considered.**  
> **Our platform takes a different route. We break big projects into many small tasks that different people pick up and finish. Each person does the part they're good at. Finished tasks become verifiable proof of skill. AI handles the coordination in the background."**

---

## 🌟 The Core Philosophy

| The Old Monolithic Freelance Nightmare | The TaskMesh AI Swarm Paradigm |
| :--- | :--- |
| **Resumes & Claims**: Unverified claims, inflated PDF resumes. | **Verifiable Proof-of-Work**: Immutable ledger of actual shipped code, design tokens, and artifacts. |
| **Weeks of Management**: 10+ hours/week micromanaging a stranger. | **0 Hours Chasing**: AI manages the Directed Acyclic Graph (DAG) and unlocks tasks sequentially. |
| **Unpaid Test Homework**: Candidates burn out on 8-hour free test projects. | **Instant Micro-Bounties**: Every 1–3 hr task awards instant cash bounties and permanent XP. |
| **Jack-of-All-Trades Fallacy**: Expecting one engineer to design, write copy, code backend, and test. | **Hyper-Specialization**: Designers build tokens, copywriters write microcopy, coders build APIs. |
| **Adversarial Disputes**: Ghosting, missed milestones, milestone renegotiations. | **Gamified Collaboration**: Multiplayer quest board, streaks, guilds, and automated escrow. |

---

## 🚀 Key Working Features

1. **AI Project Architect (Decomposer)**
   - Enter any big software, mobile, or design idea in plain English (or select from smart presets).
   - Watch the multi-phase AI engine parse requirements, split domain boundaries, build dependency trees (DAG), and synthesize automated acceptance criteria.
   - Deploy generated micro-tasks directly into the live swarm marketplace with 1 click.

2. **Interactive Quest Marketplace**
   - Filter by domain (Frontend, Backend & APIs, UI/UX Design, Copywriting, AI & Prompts, QA & Security).
   - Filter by difficulty, time estimate, status (Available, In Progress, Blocked, Completed).
   - Real-time search by keyword, technology, or project.

3. **Autonomous Background Swarm Orchestrator**
   - Visual dependency graph tracking which tasks are locked, active, or verified.
   - Live AI terminal event stream displaying real-time background verifications, DAG unlocks, and escrow payouts.

4. **Interactive Task Inspection & AI Verification Engine**
   - Inspect concrete deliverables and automated acceptance criteria.
   - Claim quests in 1 click.
   - Submit deliverable links (GitHub, Figma, Gists) and run the **Autonomous AI Acceptance Test Harness**.
   - Triggers celebratory particle animations, deposits USDC bounties, increases XP level, and automatically unblocks downstream tasks!

5. **Proof-of-Skill Ledger ("The Anti-Resume")**
   - Verifiable profile displaying executed deliverables, AI audit scores, and exact feedback.
   - Skill mastery radar breakdown computed directly from shipped micro-tasks.
   - Proof-of-work badges and shareable verification link.

6. **Gamified Arena & Leaderboard**
   - Top specialists ranked by XP, completed bounties, turnaround speed, and acceptance rates.
   - Multiplayer guilds and streaks.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) App Router (one app: server components + server actions, no separate backend)
- **Database**: PostgreSQL on [Neon](https://neon.tech/) via [Drizzle ORM](https://orm.drizzle.team/) (`drizzle-orm/neon-serverless`)
- **Auth**: email + password. Passwords are stored as salted scrypt hashes (`node:crypto`), and sessions live in Postgres behind an httpOnly cookie (`src/lib/auth.js`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) · **Icons**: [Lucide React](https://lucide.dev/)

### Layout

```
src/app/            routes: / /team /decomposer /swarm /portfolio /leaderboard, api/auth
src/components/     UI (client components); AppProvider.jsx holds UI-only state + calls server actions
src/db/             schema.js (tables), index.js (client), seed.js + seed-data.js (demo data)
src/lib/queries.js  server-only reads (derived budgets, BLOCKED status, relative times)
src/lib/actions.js  server actions: claimTask, submitTask, decomposeProject, publishProject
src/lib/ai.js       simulated AI decompose/verify — swap in a real LLM here
drizzle/            generated SQL migrations
```

A task's `BLOCKED` state isn't stored. It's derived from its prerequisites, so finishing an upstream task unlocks downstream tasks automatically.

---

## 💻 Local Development

```bash
npm install
cp .env.example .env.local      # fill DATABASE_URL (Neon); optional SEED_PASSWORD
npm run db:migrate              # apply drizzle/ migrations
npm run db:seed                 # load demo data (wipes existing rows!)
npm run dev
```

- After a schema change in `src/db/schema.js`, run `npm run db:generate` and then `npm run db:migrate`.
- `npm run db:reset` drops every table, then migrates and seeds. Dev only.
- Sign up at `/login`. Seeded users can only log in if `SEED_PASSWORD` was set when you ran `db:seed`; they then use their seeded email with that password.

## ☁️ Deploy (Vercel)

1. Import the repo in Vercel.
2. Set `DATABASE_URL`.
3. Run `npm run db:migrate` against the production DB once, plus `db:seed` if you want demo data.

---

## 👥 Founding Engineering Team

TaskMesh is designed and built by an ambitious team of student developers passionate about AI systems, modular software engineering, and decentralized collaboration:

* **Souradip Ghosh** — **Lead Engineer & AI Architect**  
  *19-year-old student with a Pure Science background and a deep passion for technology and distributed systems programming. Architected the TaskMesh DAG dependency engine, autonomous AI verification test harness, and full-stack infrastructure.*  
  * GitHub: [@0xSouradip](https://github.com/0xSouradip)  
  * Email: ghoshsouradip@gmail.com

* **Angshu Sarkar** — **Frontend Engineer**  
  *Computer science student and creative frontend developer. Built the modular React 19 component library, Tailwind design token synchronization, responsive state trapping, and gamified quest interactions.*  
  * Email: sarkarangshu04@gmail.com

* **Sneha Mukherjee** — **Frontend Engineer**  
  *Tech student focusing on modern frontend architecture, 60fps HTML5 Canvas waveform visualizations, WCAG accessibility standards, and intuitive user workflows.*  
  * Email: snehamukherjee387@gmail.com
