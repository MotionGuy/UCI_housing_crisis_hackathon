# Project context (shared brief)

Maintained by the `project-context` agent (`.claude/agents/project-context.md`). Every agent and teammate reads this before starting work. Source of truth: `docs/lane-brief.md` (wins over the README and any other doc). Main research: `docs/clear-it-newport.md`. Application package and form field maps: `docs/adu-application-guide.md`. Pitch: `docs/pitch.md`.

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

**On `main`:**
- `docs/clear-it-newport.md`: sourced Newport research (state law §§ 66310–66342, 2026 ordinance matrix, HCD's 13 findings, city-vs-state conflicts, submittal steps, fees, "2–3 rounds" of 10–20 days).
- `docs/forms/newport-beach/`: city forms and reference PDFs, index, form fields as JSON.
- **Rules engine** `src/lib/adu/` (contract `types.ts`: `AduAnswers` → `AduResult`; `evaluate.ts` checks `size`, `setback`, `height`, `guaranteed`, `parking`, `garage`, `owner`, `coastal`, `plans`; rights; documents; fees; steps). `POST /api/adu/check`.
- Housing research agent (earlier idea): kept, **outside the Clear It lane**.

**PR #2 (open, MotionGuy, `feat/adu-wizard-form-filling`; already merges `main`):**
- `src/components/wizard/`: `adu-wizard.tsx` (7-step intake: address/zoning/APN → Coastal Zone → lot → ADU type → size/height/setback/transit/garage/pre-approved → owner → team and budget), `results.tsx` (engine headline, filled-form downloads, checks with citations, "Still to gather" documents with warnings, fees, next steps, rights), `ui.tsx`. Replaces the placeholder `src/app/page.tsx`; the disclaimer sits on the page, under the wizard and results.
- `src/lib/forms/`: **second contract** `types.ts` (`Profile`: owner, applicant, APN, zoning district, valuation, designer, contractor; `FilledForm`) and `fill.ts` (pdf-lib field map; fills the old "Worksheet for Combo Building & Solar Permit Application" always, and the "Discretionary Application Owner's Affidavit" (CDP) when `coastalZone` is not `"no"`). Blank PDFs in `public/forms/newport-beach/`.
- `npm run forms:sample` (`scripts/fill-sample-forms.ts`). New deps: `pdf-lib`, `lucide-react`.
- `evaluate.ts`: steps no longer show raw URLs; 750 sq ft labeled a borderline traffic-fee case. `types.ts` unchanged. No AI calls.

**Drafts on `docs/context-wizard-update` (uncommitted):**
- `docs/pitch.md`: pitch, demo script, impact math, Q&A. Demo script predates PR #2 and needs a re-check against it.
- `docs/adu-application-guide.md`: full Newport ADU package (23 items), plan-set checklist, field maps (worksheet 71 fields, affidavit 47), 19 minimum questions, contract change requests. Flags the deed-restriction example citing old § 65852.22.

**Not built yet (owner):**
- Demo application `src/lib/adu/demo-application.ts` with planted mistakes + fixed version, **including a demo `Profile`** (the wizard blocks Continue without owner name and contact) → `app-builder`.
- "Load demo application" / "Load fixed version" buttons → `app-builder`.
- Clear **Ready to submit / Fix these first (N)** status (results show the engine headline only; `fast-path` can still have warns) → `app-builder` (proposal below).
- Issues-first ordering (checks render in engine order) → `app-builder`.
- **Who reviews it**: `AduResult.permits` and `checkedOn` are not rendered on the results page → `app-builder`; department list itself is an open question.
- Deed-restriction conflict as a flagged issue (today a document warning + `rights` item) → `rules-checks` (check) or `app-builder` (show next to issues).
- Application-package checks (missing documents, plan-set items, coastal sequencing) → `rules-checks`, using `docs/adu-application-guide.md`.

**Planted mistakes (from `docs/pitch.md`, verified against the current engine):** 900 sq ft 1-bed detached → `size` fail; 3 ft setback → `setback` fail; `coastalZone: "unsure"` → `coastal` warn (and the CDP affidavit gets filled); deed restriction → document warning + `deed` right; optional 17 ft height → `height` warn. **Fixed:** 800 sq ft, 4 ft, coastal `"no"` → `fast-path`, no fails/warns.

**Known gaps in the contracts:** `Citation` has no `quote` or "assumed" flag (use "Assumption:" in the label). `Check` has no separate `fix` field (fix text lives in `detail`). The guide's proposed `AduAnswers` additions (owners, applicant, professionals, valuation) **mostly already exist in `Profile`**; put people/form data in `Profile`, and only rule inputs in `AduAnswers`.

## Decisions

**Made (2026-11-07):**
- **PR #2 merged first.** Demo and status work builds on top of it.
- **Review step before submit.** After the app checks the answers and autofills the forms, it shows a **review screen** with every autofilled value, grouped by form. The user checks each one, corrects anything wrong, and confirms before the final "submit" step. The app can't file with the city (Newport takes ADU permits in person or through CiViC), so "submit" means: confirm, then download the completed package with instructions for filing it. Failed checks still show as "Fix these first" before the review. Warnings stay visible on the review screen so the user sees them before confirming.
- **Valuation default stays at $300/sq ft** (the team judges the figure reasonable). Until a city source is found, the label says **"Estimate"**, not "city estimate", so we follow the hard rule on numbers.

**Still open:**
1. **Which building permit form** to fill: PR #2 fills the old worksheet (doc 15043, linked from the ADU permit page); the Building Division now lists a "Combo Building Permit Application" (doc 3258, modified 2025-05-06). Ask the Permit Center. Until confirmed, label the download as the form the ADU permit page links.
2. **Coastal "unsure":** PR #2 fills the CDP affidavit "just in case". Keep it, or show it only after the address lookup?
3. Who owns `src/lib/forms/` and `src/components/wizard/` (recommended: teammate owns; `app-builder` may extend in place, no rewrites). Confirm with the teammate.

## Out of scope

Other cities (until Newport is done), discretionary/hearing-based approvals, legal advice, AI-made compliance decisions, real applicant data, the old housing/jobs/commute features.

## Open questions

- Which departments sign off on a Newport ADU (Planning, Building, Public Works, Fire, utilities?).
- Source for the "over 90% deemed incomplete" claim. If none is found, label it as an assumption.
- Should `Citation` get `quote` and `assumed` fields, and `Check` a `fix` field? (Needs the teammate who owns `src/lib/adu/types.ts`.)
- Who owns each workstream.
- Open items from `docs/adu-application-guide.md` § 6: deed restriction still requested at the counter for non-JADU ADUs? In person vs CiViC submittal; CDP exemptions for Coastal Zone ADUs; Permit Center address (100 Civic Center Dr vs 3300 Newport Blvd); Zoning Clearance box on the affidavit.

_Last updated: 2026-11-07_
