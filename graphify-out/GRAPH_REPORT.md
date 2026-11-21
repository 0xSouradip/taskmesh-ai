# Graph Report - taskmesh-ai  (2026-11-22)

## Corpus Check
- 82 files · ~41,000 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 313 nodes · 610 edges · 26 communities (13 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.91)
- Token cost: 1,500 input · 950 output

## Community Hubs (Navigation)
- App Routes & Page Views
- Package Dependencies & Scripts
- Root Layout & Team Identity
- Neon Auth & Server Queries
- Database Schema & State Actions
- Gemini AI Decomposer & Verification
- WebGL Hero Crystal & UI Effects
- Formatting Utils & Swarm Events
- Database Migration & Demo Cleanup
- Legal & Compliance Pages
- Linter & Code Quality Rules
- Project Decomposer Interface
- JSConfig & Path Aliasing
- Not Found Error Page
- Public Avatar Angshu
- Public Avatar Sneha
- Public Avatar Souradip
- Gamified Arena Concept
- Proof-of-Skill Concept

## God Nodes (most connected - your core abstractions)
1. `useApp()` - 25 edges
2. `money()` - 17 edges
3. `lucide-react` - 14 edges
4. `react` - 14 edges
5. `startCrystal()` - 12 edges
6. `getCurrentProfile` - 12 edges
7. `scripts` - 10 edges
8. `draw()` - 10 edges
9. `requireUser()` - 10 edges
10. `str()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Souradip Ghosh (Lead Engineer & AI Architect)` --conceptually_related_to--> `TeamSection()`  [INFERRED]
  README.md → src/components/TeamSection.jsx
- `Angshu Sarkar (Frontend Engineer)` --references--> `TEAM`  [INFERRED]
  README.md → src/content/team.js
- `Sneha Mukherjee (Frontend Engineer)` --references--> `TEAM`  [INFERRED]
  README.md → src/content/team.js
- `Souradip Ghosh (Lead Engineer & AI Architect)` --references--> `TEAM`  [INFERRED]
  README.md → src/content/team.js
- `AI Project Architect & Decomposer` --conceptually_related_to--> `decompose()`  [INFERRED]
  README.md → src/lib/ai.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **TaskMesh Neon Serverless & Auth Flow** — readme_neon_auth, readme_drizzle_postgres, src_lib_auth_server, src_db_schema [INFERRED 0.95]

## Communities (26 total, 6 thin omitted)

### Community 0 - "App Routes & Page Views"
Cohesion: 0.08
Nodes (29): lucide-react, react, metadata, metadata, metadata, metadata, metadata, STEPS (+21 more)

### Community 1 - "Package Dependencies & Scripts"
Cohesion: 0.05
Nodes (38): dependencies, canvas-confetti, drizzle-orm, lucide-react, @neon/auth, @neondatabase/serverless, next, react (+30 more)

### Community 2 - "Root Layout & Team Identity"
Cohesion: 0.08
Nodes (25): Next.js 16 Breaking Changes & Agent Guard, Angshu Sarkar (Frontend Engineer), Sneha Mukherjee (Frontend Engineer), Souradip Ghosh (Lead Engineer & AI Architect), TaskMesh App Icon SVG, dynamic, metadata, viewport (+17 more)

### Community 3 - "Neon Auth & Server Queries"
Cohesion: 0.11
Nodes (23): Neon Auth Integration (Google OAuth), drizzle-orm, server-only, AccountPage(), metadata, DELETE, forward(), GET (+15 more)

### Community 4 - "Database Schema & State Actions"
Cohesion: 0.17
Nodes (24): Neon Serverless PostgreSQL with Drizzle ORM, AppContext, AppProvider(), aiCalls, events, projects, submissions, taskPrerequisites (+16 more)

### Community 5 - "Gemini AI Decomposer & Verification"
Cohesion: 0.13
Nodes (19): Autonomous AI Acceptance Verification, AI Project Architect & Decomposer, CATEGORIES, cleanTask(), DAILY_LIMITS, decompose(), DIFFICULTIES, PLAN_SCHEMA (+11 more)

### Community 6 - "WebGL Hero Crystal & UI Effects"
Cohesion: 0.16
Nodes (20): HomeHero(), reducedMotion(), SearchTeaser(), colMajor(), compile(), mul(), planes(), restFrom() (+12 more)

### Community 7 - "Formatting Utils & Swarm Events"
Cohesion: 0.28
Nodes (13): Autonomous Background Swarm Orchestrator (DAG), EVENT_STYLES, levelFromXp(), rtf, timeAgo(), UNITS, getAppData(), getEvents() (+5 more)

### Community 8 - "Database Migration & Demo Cleanup"
Cohesion: 0.25
Nodes (4): pool, SEED_PROJECTS, SEED_USERS, pool

### Community 9 - "Legal & Compliance Pages"
Cohesion: 0.32
Nodes (3): metadata, metadata, Prose()

### Community 10 - "Linter & Code Quality Rules"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 11 - "Project Decomposer Interface"
Cohesion: 0.33
Nodes (3): metadata, AIDecomposer(), generate()

### Community 12 - "JSConfig & Path Aliasing"
Cohesion: 0.50
Nodes (3): compilerOptions, baseUrl, paths

## Knowledge Gaps
- **95 isolated node(s):** `plugins`, `react/only-export-components`, `react/rules-of-hooks`, `$schema`, `Angshu Avatar (Public)` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 133 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App Routes & Page Views` to `Package Dependencies & Scripts`, `Root Layout & Team Identity`, `Neon Auth & Server Queries`, `Database Schema & State Actions`, `WebGL Hero Crystal & UI Effects`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `App Routes & Page Views` to `Package Dependencies & Scripts`, `Root Layout & Team Identity`, `WebGL Hero Crystal & UI Effects`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `drizzle-orm` connect `Neon Auth & Server Queries` to `Package Dependencies & Scripts`, `Database Schema & State Actions`, `Formatting Utils & Swarm Events`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `startCrystal()` (e.g. with `layout()` and `onMove()`) actually correct?**
  _`startCrystal()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `plugins`, `react/only-export-components`, `react/rules-of-hooks` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Routes & Page Views` be split into smaller, more focused modules?**
  _Cohesion score 0.08270676691729323 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies & Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._