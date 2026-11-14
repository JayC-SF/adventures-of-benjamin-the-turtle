# Prompts

- Keep your responses extremely concise.

# Project setup

- **Framework:** Next.js 16 (App Router, `src/` dir, Turbopack), React 19, TypeScript, ESLint, Tailwind v4 (via PostCSS).
- **Package manager:** npm (`package.json` lives at repo root).
- **Node:** must be >=20.9 for Next 16. In a fresh shell, load nvm first: `source ~/.nvm/nvm.sh && nvm use default` (default is Node 22; the system/shell default is still v18, which fails typegen/build).
- **Commands:** `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.
- The `nextjs-agent-rules` block above is significant — this Next.js has breaking API changes vs. older training data; read `node_modules/next/dist/docs/` before writing Next-specific code.

# Project context

- **Purpose:** "Adventures of Benjamin the Turtle" — a single-page game/tracker that motivates Benjamin (the user's brother) toward the final prize: a CPAP machine.
- **How it works:** 7 milestones (health/sleep goals, any order). Each completed milestone unlocks one physical CPAP part (mask, headgear, tubing, humidifier tank, filter, power supply, machine) rendered as a hand-built SVG 'assembler'. When all 7 are done, the machine is complete and a grand finale shows.
- **Theme:** cozy night-adventure aesthetic (dusky starry sky, fireflies, warm glow), turtle mascot. Fits the sleep/CPAP subject.
- **Data:** milestones defined in `my-app/src/data/quest.ts` (single editable file). Progress persisted in the browser via localStorage (single-device, no backend, no auth).
- **Key files (all under `my-app/`):** `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/data/quest.ts`, `src/components/QuestDashboard.tsx`, `ProgressHeader.tsx`, `CpapAssembler.tsx`, `QuestTrail.tsx`, `MilestoneCard.tsx`, `Celebration.tsx`.
- **Zero extra dependencies:** Tailwind v4 + inline SVG + CSS animations only.

# Context management

- Delegate non-trivial exploration to subagents via the Task tool to keep the parent context window from running out. Good candidates: searching/reading multiple files, understanding existing patterns, or research. Send subagents with enough detail to work autonomously and have them return only a concise summary.
- Match model scale to task complexity: quick lookups/greps and simple edits → smallest-fastest model; moderate single-file work or focused searches → mid-tier model; complex, multi-file, or ambiguous subtasks → largest/deepest model. Never spend a large model on a trivial task, and never leave genuinely hard reasoning to a small one.
- Prefer free models for small-to-medium tasks; reserve paid/large models only for genuinely complex, multi-file, or hard-reasoning work to control cost.

## Agent skills

### Issue tracker

GitHub Issues via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Defaults: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. See `docs/agents/domain.md`.
