# ⚡ TaskMesh — AI-Planned Micro-Freelancing & Proof-of-Skill

> Hiring a freelancer is risky. A resume can't tell you if someone can really do the work, managing a stranger for weeks takes more time than most people have, and good freelancers are tired of unpaid test projects.
>
> TaskMesh splits a project into small tasks that different specialists pick up and finish. Each person does the part they're good at, and every accepted task becomes public proof of skill. Gemini plans the work and checks deliveries; the project owner always makes the call.

---

## 🌟 The Idea

| Traditional freelancing | TaskMesh |
| :--- | :--- |
| **Resumes and claims** that nobody can check. | **Accepted work** on a public profile: the task, the link, the owner's decision. |
| **Weeks of management** chasing one person. | **Small tasks (1–4 hrs)** with dependencies; a task opens only when the work it needs is accepted. |
| **Unpaid test projects** before you're considered. | **Every task is real, agreed-fee work.** XP comes only from accepted deliveries. |
| **One person does everything.** | **Specialists**: designers design, writers write, engineers build. |

---

## 🚀 Features

1. **AI planner** (`/decomposer`). Describe a project in plain English. Gemini splits it into 3–12 tasks, each with a category, difficulty, time estimate, suggested fee, deliverables, acceptance criteria and dependencies. Edit or remove tasks, then publish.
2. **Task board** (`/tasks`). Filter by category, difficulty and status, and search. Claim a task in one click (up to 3 at a time, never in your own project).
3. **Advisory AI review.** Submit a link to your work. Gemini opens the link and scores it against each acceptance criterion, with evidence and a list of what's missing. The owner sees this, then accepts or requests changes.
4. **Activity** (`/swarm`). Each project's task chain (open, waiting, in progress, in review, accepted) and a live feed of claims, submissions, decisions and unlocks.
5. **Proof-of-skill profile** (`/portfolio`). Accepted deliveries, the owner's verdict and a shareable link.
6. **Leaderboard** (`/leaderboard`). Specialists ranked by XP from accepted work.

---

## 🤖 How the AI workflow works

All AI calls go through `src/lib/gemini.js`, a small REST client for the Gemini **Interactions API** (no SDK). Each call is stateless (`store: false`) and must answer with JSON matching a schema, so the app never parses free text.

### 1. Planning a project

```
owner brief ──► decomposeProject (server action)
                 ├─ sign-in, brief length, daily quota checks
                 └─ ai.decompose ──► Gemini (JSON schema, thinking: medium)
                                      └─ cleanTask (clamp every field) ──► normalizePlan (valid DAG)
owner edits plan in browser ──► publishProject
                                 └─ cleanTask + normalizePlan again (plan came back from the browser)
                                    └─ one transaction: project, tasks, task_prerequisites, event
```

- `dependsOn` is a list of indices into the plan. `src/lib/dag.js` drops bad references, breaks cycles and returns the tasks in dependency order.
- Fees are a suggestion (≈ $60–90/hr). The owner edits them before publishing.

### 2. Reviewing a submission

```
specialist submits link ──► submitTask
                             ├─ link must be http(s); task must be theirs and IN_PROGRESS
                             ├─ ai.verify ──► Gemini with the url_context tool (opens the link)
                             │                 └─ { score 0–100, per-criterion met/evidence, feedback, missing }
                             └─ task ──► IN_REVIEW, submission saved with the AI review
owner ──► reviewSubmission: accept ──► COMPLETED, XP credited, dependents unlock
                            changes ──► back to IN_PROGRESS with the owner's note
```

- The review is **advice only**. It never changes task state. If Gemini is down, slow, rate limited or not configured, the submission still goes to the owner, with a note saying why there's no AI check.
- The brief, the page content and the specialist's notes are treated as untrusted data. The prompts say so, and every field Gemini returns is clamped (`src/lib/sanitize.js`) before it is stored.

### Limits and failure handling

| | |
| :--- | :--- |
| Daily quota per user | 20 plans, 30 reviews (`DAILY_LIMITS` in `src/lib/ai.js`, counted in the `ai_calls` table) |
| Timeouts | 60 s for planning, 90 s for reviews |
| Errors | `AiError` carries a message safe to show users; details go to the server log only |
| Model | `GEMINI_MODEL`, default `gemini-3.8-flash` |

To change the model's behaviour, edit `PLAN_SYSTEM` / `REVIEW_SYSTEM` and the schemas in `src/lib/ai.js`. `src/lib/ai.test.js` stubs `fetch`, so tests never call Gemini.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) App Router (server components + server actions, no separate backend)
- **Database**: PostgreSQL on [Neon](https://neon.tech/) via [Drizzle ORM](https://orm.drizzle.team/) (`drizzle-orm/neon-serverless`)
- **Auth**: [Neon Auth](https://neon.com/docs/auth/overview) (managed Better Auth), **Google sign-in only**, via `@neon/auth`
- **AI**: [Google Gemini](https://ai.google.dev/) Interactions API over plain `fetch`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) design tokens in `src/app/globals.css` · **Icons**: [Lucide](https://lucide.dev/) · Hero crystal: raw WebGL (`src/components/ui/crystal.js`)

### Layout

```
src/app/                 routes: / /tasks /decomposer /swarm /leaderboard /team /portfolio /account /sign-in /terms /privacy
src/app/api/auth/        proxy to Neon Auth (Google OAuth, session, sign-out)
src/proxy.js             protects /account (Next 16 proxy)
src/components/          UI. AppProvider.jsx holds UI state and calls server actions
src/components/ui/       design pieces: crystal.js (WebGL hero), Effects.jsx, bits.jsx
src/lib/auth/            server.js (Neon Auth), client.js (browser), profile.js (session -> TaskMesh profile)
src/lib/queries.js       server-only reads (derived budgets, BLOCKED status, XP, relative times)
src/lib/actions.js       server actions: claimTask, releaseTask, submitTask, reviewSubmission,
                         decomposeProject, publishProject, closeProject, updateProfile
src/lib/gemini.js        Gemini Interactions API client (generateJson)
src/lib/ai.js            prompts + schemas: decompose (planning) and verify (review)
src/lib/dag.js           normalizePlan / removeFromPlan: keep a plan a valid dependency graph
src/lib/sanitize.js      clamp strings, ints and lists from users and from the AI
src/db/                  schema.js, index.js (lazy client), reset.js, clear-demo.js
src/content/team.js      the founding team shown on /team (static content, not DB users)
drizzle/                 generated SQL migrations
```

### Data model

| Table | Holds |
| :--- | :--- |
| `users` | TaskMesh profile (handle, headline, bio), linked to Neon Auth by `auth_user_id` |
| `projects` | Owner, brief, `status` (`ACTIVE` / `CLOSED`), which Gemini model planned it |
| `tasks` | Status `AVAILABLE` → `IN_PROGRESS` → `IN_REVIEW` → `COMPLETED`, fee, XP, deliverables, criteria, claimer |
| `task_prerequisites` | Dependency edges (`task_id` needs `prerequisite_id`) |
| `submissions` | One per task: link, notes, AI score / feedback / criteria, owner decision and note, attempts |
| `ai_calls` | One row per Gemini call, for the daily quota |
| `events` | Activity feed |

Identity lives in Neon Auth's `neon_auth` schema. The first Google sign-in creates the `users` row.

There is no demo or seeded data. XP, accepted tasks, fees and rankings are computed from accepted submissions on every request. A task's `BLOCKED` state isn't stored either: it's derived from its prerequisites, so accepting an upstream task unlocks downstream tasks automatically.

### How work flows

1. A signed-in owner describes a project. Gemini drafts tasks with dependencies; the owner edits and publishes.
2. A specialist claims a task (not in their own project; at most 3 at a time) and submits a link to the work. They can release it while it's in progress; the owner can also release it from an inactive specialist.
3. Gemini checks the delivery against the acceptance criteria. This is **advice only**.
4. The owner accepts the work or requests changes with a note. Accepting completes the task, credits XP and unlocks dependent tasks.
5. The owner can close a project: open tasks leave the board, accepted work stays on profiles.
6. **No money moves through TaskMesh.** The fee is agreed up front and the owner pays the specialist directly. On a shared task, each side sees the other's email to arrange it.

---

## 💻 Local Development

Needs Node 22+, a Neon project in an AWS region, and a [Gemini API key](https://aistudio.google.com/apikey).

```bash
npm install
cp .env.example .env.local      # fill in the values below
npm run db:migrate              # create tables from drizzle/
npm run dev                     # http://localhost:3000
```

| Variable | Required | What it is |
| :--- | :--- | :--- |
| `DATABASE_URL` | yes | Pooled Neon connection string |
| `NEON_AUTH_BASE_URL` | for sign-in | Neon console → Auth → Auth URL |
| `NEON_AUTH_COOKIE_SECRET` | for sign-in | `openssl rand -base64 32` |
| `GEMINI_API_KEY` | for AI | Without it, planning is unavailable and submissions go to the owner without an AI check |
| `GEMINI_MODEL` | no | Defaults to `gemini-3.8-flash` |
| `NEXT_PUBLIC_SITE_URL` | no | Public URL, for Open Graph links |

Localhost origins are trusted by Neon Auth by default, and Neon's shared Google credentials work for development.

| Script | What it does |
| :--- | :--- |
| `npm run dev` / `build` / `start` | Next.js dev server, production build, production server |
| `npm test` | Unit tests (`node --test`): DAG, AI client (stubbed), formatting, redirect safety |
| `npm run lint` | oxlint |
| `npm run db:generate` | Create a migration after editing `src/db/schema.js` |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:clear-demo` | Delete the old demo rows (seeded projects, users, events) and keep real data. Run once after `db:migrate` on a database that was seeded before |
| `npm run db:reset` | **Drops the app's tables** (`public` and `drizzle` schemas; Neon Auth's `neon_auth` is untouched), then re-applies migrations, leaving an empty database. Dev only |

## 🚀 Launch checklist (Vercel + Neon Auth + Gemini)

1. **Enable Neon Auth.** Neon console → your project → **Auth** → enable it on the branch you deploy from. The project must be in an AWS region and must not use IP Allow or Private Networking. Copy the branch's **Auth URL** into `NEON_AUTH_BASE_URL`.
2. **Google OAuth client.** In Google Cloud Console → APIs & Services → Credentials, create an *OAuth client ID* (Web application).
   - Authorized redirect URI: `<NEON_AUTH_BASE_URL>/callback/google`.
   - Then in the Neon console → Auth → OAuth providers → Google, paste the client ID and secret. Neon's shared Google credentials are for development only.
   - Publish the OAuth consent screen (app name, support email, privacy and terms URLs: `/privacy`, `/terms`).
3. **Trusted domains.** Neon console → Auth → Domains: add your production URL (e.g. `https://taskmesh.vercel.app`) and any custom domain. Use the scheme and no trailing slash. Add preview URLs if you test sign-in on previews.
4. **Gemini key.** Create a key in [Google AI Studio](https://aistudio.google.com/apikey). Use a paid-tier key in production: the free tier's rate limits are low, and Google may use free-tier data to improve its products.
5. **Vercel environment variables** (Production and Preview):
   - `DATABASE_URL`: the pooled Neon URL.
   - `NEON_AUTH_BASE_URL`: from step 1.
   - `NEON_AUTH_COOKIE_SECRET`: `openssl rand -base64 32`.
   - `GEMINI_API_KEY`: from step 4. Optionally `GEMINI_MODEL`.
   - `NEXT_PUBLIC_SITE_URL`: your production URL.
6. **Database.** With `DATABASE_URL` pointing at production, run `npm run db:migrate` once. If this database ever held the old demo data, run `npm run db:clear-demo` afterwards.
7. **Redeploy**, then sign in with Google on the live site, confirm `/account` loads, and plan a test project on `/decomposer` to check the Gemini key.

The build doesn't need any of these variables, so a missing value never breaks a deploy. It shows up at runtime as the error page, "sign-in is not available yet", or "AI planning is not configured on this server".

---

## 👥 Founding Engineering Team

TaskMesh is designed and built by a team of student developers passionate about AI systems, modular software engineering, and decentralized collaboration:

* **Souradip Ghosh** — **Lead Engineer & AI Architect**  
  *19-year-old student with a Pure Science background and a deep passion for technology and distributed systems programming. Architected the TaskMesh dependency engine, the Gemini planning and review pipeline, and the full-stack infrastructure.*  
  * GitHub: [@0xSouradip](https://github.com/0xSouradip)  
  * Email: ghoshsouradip@gmail.com

* **Angshu Sarkar** — **Frontend Engineer**  
  *Engineering student and creative frontend developer. Built the React 19 component library, the Tailwind design tokens, and the task board interactions.*  
  * Email: sarkarangshu04@gmail.com

* **Sneha Mukherjee** — **Frontend Engineer**  
  *Tech student focusing on modern frontend architecture, WCAG accessibility standards, and intuitive user workflows.*  
  * Email: snehamukherjee387@gmail.com
