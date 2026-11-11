# Graph Report - taskmesh-ai  (2026-11-11)

## Corpus Check
- Corpus is ~37,802 words - fits in a single context window. You may not need a graph.

## Summary
- 103 nodes · 186 edges · 23 communities (8 shown, 15 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.94)
- Token cost: 1,250 input · 850 output

## Community Hubs (Navigation)
- Founding Team & Initial Data
- Project Config & Bundler Setup
- App Entry & Root Layout
- Runtime Production Dependencies
- Swarm Engine & DAG Orchestration
- CI/CD & Automation Scripts
- Linter & Code Quality Rules
- Development Tooling & Types
- Task Modal & AI Verification
- Gamification & Leaderboard Arena
- Quest Marketplace & Micro-Bounties
- Proof-of-Skill Ledger
- Navbar & Navigation UI
- Hero Section & Landing Banner
- Application Shell & Documentation
- AI Decomposer & Architect
- Site Favicon Asset
- Icon Sprite Assets
- Public Avatar Angshu
- Public Avatar Sneha
- Public Avatar Souradip
- React Brand Asset
- Vite Brand Asset

## God Nodes (most connected - your core abstractions)
1. `useApp()` - 25 edges
2. `react` - 16 edges
3. `lucide-react` - 13 edges
4. `TeamSection()` - 9 edges
5. `scripts` - 5 edges
6. `coreTeam` - 5 edges
7. `AIDecomposer()` - 4 edges
8. `Hero()` - 4 edges
9. `Leaderboard()` - 4 edges
10. `ProofOfSkill()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Angshu Sarkar (Frontend Engineer)` --conceptually_related_to--> `TeamSection()`  [INFERRED]
  README.md → src/components/TeamSection.jsx
- `Sneha Mukherjee (Frontend Engineer)` --conceptually_related_to--> `TeamSection()`  [INFERRED]
  README.md → src/components/TeamSection.jsx
- `Souradip Ghosh (Lead Engineer & AI Architect)` --conceptually_related_to--> `TeamSection()`  [INFERRED]
  README.md → src/components/TeamSection.jsx
- `Angshu Sarkar (Frontend Engineer)` --references--> `coreTeam`  [INFERRED]
  README.md → src/data/initialData.js
- `Sneha Mukherjee (Frontend Engineer)` --references--> `coreTeam`  [INFERRED]
  README.md → src/data/initialData.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **TaskMesh Core Micro-Freelancing Flow** — readme_ai_decomposer, readme_dag_orchestration, readme_ai_acceptance_harness, readme_proof_of_skill [INFERRED 0.95]

## Communities (23 total, 15 thin omitted)

### Community 0 - "Founding Team & Initial Data"
Cohesion: 0.20
Nodes (14): Angshu Sarkar (Frontend Engineer), Sneha Mukherjee (Frontend Engineer), Souradip Ghosh (Lead Engineer & AI Architect), Angshu Avatar (Assets), Sneha Avatar (Assets), Souradip Avatar (Assets), TeamSection(), AppContext (+6 more)

### Community 1 - "Project Config & Bundler Setup"
Cohesion: 0.15
Nodes (13): name, private, type, version, canvas-confetti, oxlint, react-dom, tailwindcss (+5 more)

### Community 2 - "App Entry & Root Layout"
Cohesion: 0.36
Nodes (4): react, ComparisonSection(), Toast(), AppProvider()

### Community 3 - "Runtime Production Dependencies"
Cohesion: 0.29
Nodes (7): dependencies, canvas-confetti, lucide-react, react, react-dom, tailwindcss, @tailwindcss/vite

### Community 4 - "Swarm Engine & DAG Orchestration"
Cohesion: 0.38
Nodes (5): Autonomous Background Swarm Orchestrator (DAG), MainContent(), Footer(), SwarmEngine(), useApp()

### Community 5 - "CI/CD & Automation Scripts"
Cohesion: 0.33
Nodes (6): Deploy to GitHub Pages Workflow, scripts, build, dev, lint, preview

### Community 6 - "Linter & Code Quality Rules"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 7 - "Development Tooling & Types"
Cohesion: 0.33
Nodes (6): devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react

## Knowledge Gaps
- **43 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+38 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 45 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App Entry & Root Layout` to `Founding Team & Initial Data`, `Project Config & Bundler Setup`, `Swarm Engine & DAG Orchestration`, `Task Modal & AI Verification`, `Gamification & Leaderboard Arena`, `Quest Marketplace & Micro-Bounties`, `Proof-of-Skill Ledger`, `Navbar & Navigation UI`, `Hero Section & Landing Banner`?**
  _High betweenness centrality (0.226) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `Navbar & Navigation UI` to `Founding Team & Initial Data`, `Project Config & Bundler Setup`, `App Entry & Root Layout`, `Swarm Engine & DAG Orchestration`, `Task Modal & AI Verification`, `Gamification & Leaderboard Arena`, `Quest Marketplace & Micro-Bounties`, `Proof-of-Skill Ledger`, `Hero Section & Landing Banner`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Production Dependencies` to `Project Config & Bundler Setup`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `TeamSection()` (e.g. with `Angshu Sarkar (Frontend Engineer)` and `Sneha Mukherjee (Frontend Engineer)`) actually correct?**
  _`TeamSection()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _43 weakly-connected nodes found - possible documentation gaps or missing edges._