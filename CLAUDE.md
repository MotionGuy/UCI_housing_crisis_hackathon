# CLAUDE.md

## Project context: read first

**"Clear It": TurboTax for ADU permits in Orange County, starting with Newport Beach.** An applicant-facing, step-by-step intake that tells homeowners and builders which forms, sign-offs and fees apply, and catches the problems that would trigger a correction letter (with plain-English fixes) **before they submit**. The goal: one review cycle instead of 2–3. Team of 4, about 4 hours.

Source of truth: `docs/lane-brief.md`. Condensed brief: `docs/project-context.md`.

**Every agent and session must work within this context:**

1. Before starting a feature, spec, research task or multi-step task, read `docs/project-context.md`. For non-trivial tasks, use the `project-context` subagent for a brief.
2. Follow the hard rules:
   - **Rules engine decides pass/fail; AI only helps** (guides intake, explains issues, reads uploads).
   - **Every rule and check cites its source** (Newport ADU checklist/guidebook, or Gov. Code §§ 66310–66342). **Flag anything citing old § 65852.2.**
   - **Every number shown is sourced or labeled as an assumption/estimate.**
   - Show a **"not legal advice"** disclaimer.
   - **Newport Beach only.**
3. Priorities: correction-prevention checks first. Cut order when short on time: AI chat → fee details → visual polish. Research is time-boxed to about 20 minutes per task. Feature freeze about 1 hour before the deadline.
4. When briefing any other subagent, include a 2–3 line summary of the mission, which workstream the task serves, and the hard rules that apply.
5. Before opening a PR, or when unsure if work is in scope, ask the `project-context` subagent for an alignment check.
6. Build on the existing rules engine in `src/lib/adu/` and the research in `docs/clear-it-newport.md`; never write a second engine or set of types. The contract is `src/lib/adu/types.ts`. Don't change it directly; propose changes through `project-context`. Ownership: `rules-checks` writes the checks and city/state data in `src/lib/adu/`; `app-builder` writes the UI in `src/app/` and `src/components/`; `pitch-storyline` writes `docs/pitch.md` and `docs/slides/`.
7. After the lane brief or a spec in `.plans/` changes, ask `project-context` to refresh `docs/project-context.md`.

## Team rules

See `CONTRIBUTING.md`: branch from `main`, small PRs, `npm run lint && npm run typecheck && npm run build` before review, no secrets or real applicant data in git, demo path first.
