# Project context (shared brief)

Maintained by the `project-context` agent (`.claude/agents/project-context.md`). Every agent and teammate reads this before starting work. Source of truth: `docs/lane-brief.md` (wins over the README and any other doc). Main research: `docs/clear-it-newport.md`.

## Mission

> **We cut the 2–3 review cycles most ADU applications go through to one.**
> ("2–3 cycles" source: Newport ADU guidebook. "Cut to one" is our goal, shown by the demo, not yet measured.)

**"Clear It": TurboTax for ADU permits in Orange County, starting with Newport Beach.** The goal is to make the fast, ministerial approval path the normal path by getting the **first submission right**. We're not building a tool that just explains the rules.

- **Problem:** ministerial approval can cut housing timelines from about 4 years to about 2, but few people use it. Each of OC's 34 cities has its own forms, fees and checklists, cities misread state law (HCD sends correction letters), and most applications come back incomplete or need several correction rounds.
- **Value:** Newport's ADU guidebook says applications typically need 2–3 review rounds of 10–20 business days each (about 1–3 months). Moving the typical project to **one review cycle** is the whole value proposition.

## Users

Applicant-facing: homeowners adding an ADU, small builders, nonprofit project managers. Secondary: city permit techs who want to get it right.

## What the product does

Step-by-step intake about the lot and project → results page with:
1. **Forms needed**
2. **Departments that must sign off** (who reviews it)
3. **Fees that apply**
4. **Issues likely to trigger a correction letter**, each with a plain-English fix
5. **Ready-to-submit status**

Includes a visible **"not legal advice"** disclaimer.

## Hard rules (non-negotiable)

- **Rules engine decides pass/fail.** Checks are written rules from Newport's ADU submittal checklist and current state ADU law. **The AI is a helper, not the judge:** it guides intake, explains flagged issues in plain language and reads uploaded documents. It never makes the pass/fail call.
- **Every rule and check cites its source** (document, section, URL).
- **State law: Gov. Code §§ 66310–66342.** Old § 65852.2 was renumbered. **Flag any document that still cites 65852.2.**
- **Every number shown** (hours or money saved, correction rates such as "over 90% deemed incomplete") has a cited source **or** is clearly labeled as an assumption or estimate.
- We can't prove a reduction in correction letters in 4 hours. **The demo runs a realistic sample application with common mistakes planted in it** and shows the tool catching what a plan checker would flag.

## Workstreams

| # | Workstream | Output |
| --- | --- | --- |
| 1 | Requirements | Structured data with sources: Newport ADU forms, checklist items, fees, sign-off departments, and state limits on what the city may require |
| 2 | **Correction prevention (core)** | Most common reasons ADU applications get sent back, each turned into a pre-submission check tied to a requirement |
| 3 | App | Step-by-step intake in the existing Next.js project; results page (forms, issues + fixes, reviewers, ready-to-submit status) |
| 4 | Pitch and research (about 20 minutes per task) | Competitors (e.g. Blitz AI: verify what they actually do and how we differ), how often law and city rules change (data refresh cadence), hours/money saved per avoided correction round (labeled estimates), demo script |

## Priorities and cut order

1. **Correction-prevention checks matter most.**
2. If short on time, cut in this order: **AI chat features → fee details → visual polish**. Never cut the checks first.
3. **One city done well beats many cities done badly.** Newport Beach only.
4. **Feature freeze about 1 hour before the deadline** to integrate and rehearse a demo that runs start to finish.

## Pitch answer: "How does this fit four years into two?"

Plan check is a large share of a homeowner's ADU timeline, and the same rules engine extends to **SB 9 and small multifamily projects**, where each correction round costs more.

## Constraints

- Team of 4, about 4 hours to build and demo.
- Next.js 16 App Router + TypeScript + Tailwind v4; API routes in `src/app/api/*`. AI via Anthropic (`ANTHROPIC_API_KEY`).
- `main` must always build; small PRs; no secrets in git; sample data only (no real applicant data).

## Current repo status

**Built (by a teammate, on `main`):**
- `docs/clear-it-newport.md`: sourced Newport ADU research. Covers state law (§§ 66310–66342), the city's 2026 ordinance matrix, HCD's 13 findings (2024 letter) and which look fixed, **city-vs-state conflicts** (deed restriction listed for every ADU on the permit page; JADU replacement parking; attached-ADU height), submittal steps, fees ($850–$1,700 plan check; $850–$2,100 building permit), and "most projects need 2–3 rounds" of 10–20 days.
- `docs/forms/newport-beach/`: city forms and reference PDFs, with an index and form fields as JSON.
- **Rules engine** `src/lib/adu/`: `types.ts` (contract: `AduAnswers` → `AduResult`), `newport-beach.ts`, `state-law.ts`, `evaluate.ts` (checks for size, setbacks, height, parking, coastal zone, garage, owner, pre-approved plans; rights; documents; fees; steps). `POST /api/adu/check`.
- Housing research agent (`scripts/research-housing.ts`, GitHub Action, `src/app/api/housing`, `src/lib/types.ts`, `src/data/listings.json`): from the earlier home-finder idea. **Kept, but outside the Clear It lane.**

**Not built yet:**
- UI: intake, results page and demo button (`src/app/page.tsx` is a placeholder) → `app-builder`.
- Correction-prevention checks (what gets applications sent back: missing documents, plan-set items, coastal sequencing). Current checks are mostly about whether the project is allowed → `rules-checks`.
- Demo application with planted mistakes (`src/lib/adu/demo-application.ts`) → `app-builder` creates it if missing.
- Pitch and demo script (`docs/pitch.md`) → `pitch-storyline`.

**Known gaps in the contract:** `Citation` has a label and URL but no exact quote and no "assumed" flag. For now, quotes go in the research doc and assumptions are labeled "Assumption:" in the citation label.

## Out of scope

Other cities (until Newport is done), discretionary/hearing-based approvals, legal advice, AI-made compliance decisions, real applicant data, the old housing/jobs/commute features.

## Open questions

- Which departments sign off on a Newport ADU (Planning, Building, Public Works, Fire, utilities?).
- Source for the "over 90% deemed incomplete" claim. If none is found, label it as an assumption.
- Should `Citation` get `quote` and `assumed` fields? (Needs the teammate who owns `src/lib/adu/types.ts`.)
- Who owns each workstream.

_Last updated: 2026-11-07_
