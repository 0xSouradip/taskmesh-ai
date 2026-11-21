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

- **Framework**: [Next.js 16](https://nextjs.org/) App Router (server components + server actions, no separate backend)
- **Database**: PostgreSQL on [Neon](https://neon.tech/) via [Drizzle ORM](https://orm.drizzle.team/) (`drizzle-orm/neon-serverless`)
- **Auth**: [Neon Auth](https://neon.com/docs/auth/overview) (managed Better Auth), **Google sign-in only**, via `@neon/auth`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) design tokens in `src/app/globals.css` · **Icons**: [Lucide](https://lucide.dev/) · Hero crystal: raw WebGL (`src/components/ui/crystal.js`)

### Layout

```
src/app/                 routes: / /tasks /decomposer /swarm /leaderboard /team /portfolio /account /sign-in /terms /privacy
src/app/api/auth/        proxy to Neon Auth (Google OAuth, session, sign-out)
src/proxy.js             protects /account (Next 16 proxy)
src/components/          UI. AppProvider.jsx holds UI state and calls server actions
src/components/ui/       design pieces: crystal.js (WebGL hero), Effects.jsx, bits.jsx
src/lib/auth/            server.js (Neon Auth), client.js (browser), profile.js (session -> TaskMesh profile)
src/lib/queries.js       server-only reads (derived budgets, BLOCKED status, relative times)
src/lib/actions.js       server actions: claimTask, submitTask, decomposeProject, publishProject, updateProfile
src/lib/ai.js            simulated AI decompose/verify. Swap in a real LLM here
src/db/                  schema.js, index.js (lazy client), reset.js, clear-demo.js
src/content/team.js      the founding team shown on /team (static content, not DB users)
drizzle/                 generated SQL migrations
```

Identity lives in Neon Auth's `neon_auth` schema. TaskMesh's own `users` table holds the profile (handle, headline, bio) and links to Neon Auth through `users.auth_user_id`. The first Google sign-in creates the profile.

There is no demo or seeded data. XP, accepted tasks, fees and rankings are computed from accepted submissions on every request.

### How work flows

1. A signed-in owner describes a project. Gemini drafts tasks with dependencies; the owner edits and publishes.
2. A specialist claims a task (not in their own project; at most 3 at a time) and submits a link to the work.
3. Gemini checks the delivery against the acceptance criteria. This is **advice only**.
4. The owner accepts the work or requests changes with a note. Accepting completes the task, credits XP and unlocks dependent tasks.
5. **No money moves through TaskMesh.** The fee is agreed up front and the owner pays the specialist directly. On a shared task, each side sees the other's email to arrange it.

A task's `BLOCKED` state isn't stored. It's derived from its prerequisites, so finishing an upstream task unlocks downstream tasks automatically.

---

## 💻 Local Development

Needs Node 22+ and a Neon project in an AWS region.

```bash
npm install
cp .env.example .env.local      # DATABASE_URL, NEON_AUTH_BASE_URL, NEON_AUTH_COOKIE_SECRET
npm run db:migrate              # create tables from drizzle/
npm run dev                     # http://localhost:3000
```

Localhost origins are trusted by Neon Auth by default, and Neon's shared Google credentials work for development.

| Script | What it does |
| :--- | :--- |
| `npm run dev` / `build` / `start` | Next.js dev server, production build, production server |
| `npm test` | Unit tests (`node --test`) |
| `npm run lint` | oxlint |
| `npm run db:generate` | Create a migration after editing `src/db/schema.js` |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:clear-demo` | Delete the old demo rows (seeded projects, users, events) and keep real data. Run once after `db:migrate` on a database that was seeded before |
| `npm run db:reset` | **Drops the app's tables** (`public` and `drizzle` schemas; Neon Auth's `neon_auth` is untouched), then re-applies migrations, leaving an empty database. Dev only |

## 🚀 Launch checklist (Vercel + Neon Auth)

1. **Enable Neon Auth.** Neon console → your project → **Auth** → enable it on the branch you deploy from. The project must be in an AWS region and must not use IP Allow or Private Networking. Copy the branch's **Auth URL** into `NEON_AUTH_BASE_URL`.
2. **Google OAuth client.** In Google Cloud Console → APIs & Services → Credentials, create an *OAuth client ID* (Web application).
   - Authorized redirect URI: `<NEON_AUTH_BASE_URL>/callback/google`.
   - Then in the Neon console → Auth → OAuth providers → Google, paste the client ID and secret. Neon's shared Google credentials are for development only.
   - Publish the OAuth consent screen (app name, support email, privacy and terms URLs: `/privacy`, `/terms`).
3. **Trusted domains.** Neon console → Auth → Domains: add your production URL (e.g. `https://taskmesh.vercel.app`) and any custom domain. Use the scheme and no trailing slash. Add preview URLs if you test sign-in on previews.
4. **Vercel environment variables** (Production and Preview):
   - `DATABASE_URL`: the pooled Neon URL.
   - `NEON_AUTH_BASE_URL`: from step 1.
   - `NEON_AUTH_COOKIE_SECRET`: `openssl rand -base64 32`.
   - `NEXT_PUBLIC_SITE_URL`: your production URL.
5. **Database.** With `DATABASE_URL` pointing at production, run `npm run db:migrate` once. If this database ever held the old demo data, run `npm run db:clear-demo` afterwards.
6. **Redeploy**, then sign in with Google on the live site and confirm `/account` loads.

The build doesn't need any of these variables, so a missing value never breaks a deploy. It shows up at runtime as the error page, or as "sign-in is not available yet".

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
