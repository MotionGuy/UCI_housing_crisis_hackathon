# Clear It: pitch and demo script

**Draft 1, 2026-11-07.** Owner: `pitch-storyline` agent.
**Read-aloud length: ~535 spoken words (talk track + demo narration) ≈ 4:05 of speech at 130 words/min, about 4:15 with clicks (inside the 3–5 minute limit).** Counted with a script on 2026-11-07. The word count covers only the quoted lines in "Talk track" and the "Presenter says" column of the demo script.

Status: the rules engine (`src/lib/adu/evaluate.ts`) exists and was run against the demo inputs below (output matches this script). **The UI and the demo application do not exist yet**, so the demo is written against the planned flow. Each step the app can't show yet is listed in [Section 8](#8-open-items-and-unverified-claims).

Sources are numbered `[S#]` and listed in [Section 7](#7-sources). "Estimate" means a number we made up from stated assumptions, not a measured result.

---

## 1. One-line pitch

> **We cut the 2–3 review cycles most ADU applications go through to one.**

- "2–3 cycles": Newport Beach's ADU site, "Most projects require 2-3 rounds of review, each taking 10 - 20 days." [S1]
- "To one": **the goal the demo shows, not a measured result.**

---

## 2. Talk track (target ~4:00)

| # | Section | Time | Words |
|---|---|---|---|
| 1 | Problem | 0:30 | 67 |
| 2 | Target market | 0:17 | 37 |
| 3 | Unique value proposition | 0:09 | 19 |
| 4 | Live demo | 1:30 | 175 + clicks (see Section 3) |
| 5 | Competitive landscape | 0:25 | 55 |
| 6 | Implementation plan | 0:28 | 62 |
| 7 | Feasibility | 0:15 | 32 |
| 8 | Impact | 0:40 | 88 |
| | **Total** | **~4:15** | **535** |

### 1. Problem (0:30)

> "California already has a fast path for ADUs. If a project meets the written rules, the city must approve it: no hearing, no discretion. Almost nobody gets through it quickly. Each of Orange County's 34 cities has its own forms and checklists, and applications bounce back. Newport Beach's own ADU site says most projects need two to three rounds of review, each taking ten to twenty days."

Backing: ministerial approval and the 60-day deadline, Gov. Code §§ 66317, 66323 [S5]; 34 OC cities, lane brief [S15]; 2–3 rounds of 10–20 days [S1].

### 2. Target market (0:17)

> "We start with homeowners adding an ADU in Newport Beach. Newport puts its rules, forms and pre-approved plans online, so we can do one city well. Small builders, nonprofit project managers and city permit techs come next."

Backing: city rules matrix [S3], forms [S1], pre-approved plans [S9b]. Why one city: lane brief, "One city done well beats many cities done badly" [S15].

### 3. Unique value proposition (0:09)

> "We don't explain the rules. We get the first submission right: one review cycle instead of two or three."

### 4. Live demo (1:30)

See the [demo script](#3-demo-script). Transition line into the demo: *"Here's an application a plan checker would send back."*

### 5. Competitive landscape (0:25)

> "Blitz AI sells AI plan review to cities. Corona offers its pre-screen free, and says it checks for missing documents, not code compliance. Symbium checks whether a California lot can have an ADU. We work for the applicant, before submission, with Newport's rules and state law side by side and a source on every flag."

Backing: [Section 4](#4-competitor-table) [S10–S14].

### 6. Implementation plan (0:28)

> "Today: Newport Beach, single-family ADUs. Next: more Newport project types, then more Orange County cities, then SB 9 and small multifamily. The rules move: the state renumbered ADU law in 2024, and Newport rewrote its ADU rules in 2023 and again in 2025. Every rule carries its source and the date we checked it, so re-checking is a list, not a rewrite."

Backing: SB 477 renumbering, March 25, 2024 [S8]; Newport Ordinance 2023-2 and the update adopted August 26, 2025 [S7]. Maintenance: each `Citation` in `src/lib/adu/` has a label and URL, and `CITY.checkedOn` holds the access date. Proposed owner: one team member re-checks every rule each January (state changes) and when the city posts a new ordinance (see Q&A).

### 7. Feasibility (0:15)

> "This is buildable because the requirements are public, the rules are written down, and approval is ministerial. Every pass or fail comes from a written rule with a citation, never from AI."

### 8. Impact (0:40)

> "Here's the math, and every guess is labeled. Newport says ten to twenty days per review round. Add an estimated one to two weeks for the designer to fix and resubmit. Each round we prevent saves roughly three to five weeks; preventing two saves up to ten. We can't prove that yet; the next step is a pilot that counts review rounds. And the same engine extends to SB 9 and small multifamily, where every round costs more. That's how fewer rounds helps turn four years into two."

Full math: [Section 5](#5-impact-math).

---

## 3. Demo script

**Sample application (planned `src/lib/adu/demo-application.ts`):** a homeowner on an existing single-family lot wants a **detached, 1-bedroom, 900 sq ft** backyard ADU, **16 ft** tall, with a **3 ft** side/rear setback, **not sure** whether the lot is in the Coastal Zone, not near transit, not using a pre-approved plan. The address is made up (sample data only).

**Planted mistakes and the check that catches each one** (verified by running `evaluateAdu` on these inputs, 2026-11-07):

| # | Planted mistake | Input | Engine result | Fix | Source shown | Why it matters |
|---|---|---|---|---|---|---|
| 1 | Too big for a 1-bedroom | `squareFeet: 900`, `bedrooms: 1` | check `size` = **fail** | 800 sq ft | Newport Municipal Code § 20.48.200 [S3] | 850 sq ft city cap for studio/1-bed |
| 2 | Setback too small | `sideRearSetbackFeet: 3` | check `setback` = **fail** | 4 ft | Gov. Code § 66323(a)(2) [S5] | State guarantees approval at 4 ft side/rear |
| 3 | Coastal Zone unknown | `coastalZone: "unsure"` | check `coastal` = **warn** | Look up the address in the city's Address Search Tool | Newport Beach Address Search Tool [S1] | A Coastal Development Permit may come first and can involve a hearing |
| 4 | City-vs-state conflict: deed restriction | (any non-JADU ADU) | `documents[]` "Deed restriction" carries a **warning**; `rights[]` item `deed` | Ask the city before recording one | City permit page [S1] vs. 2026 matrix [S3] vs. HCD letter [S4] | HCD: "Deed restrictions are not authorized under state law for ADUs." [S4] |

**Fixed version:** same application with `squareFeet: 800`, `sideRearSetbackFeet: 4`, `coastalZone: "no"` (after the address lookup). Engine result: verdict `fast-path`, headline "Qualifies for the fast path", checks `size`, `setback`, `height` and `guaranteed` all **pass**, `parking` is info, no fails or warns. The deed-restriction document warning still shows (it's always shown for non-JADU ADUs).

Optional 5th mistake if time allows (not narrated below): `heightFeet: 17` → check `height` = **warn** (above the 16 ft the state guarantees for detached ADUs, Gov. Code § 66321(b)(4) [S6]).

| Step | Click | Screen shows | Presenter says (175 words) |
|---|---|---|---|
| 1 | **Load demo application** on the home page | Intake, step 1, filled in with the sample application | "Here's an application a plan checker would send back. A homeowner wants a one-bedroom, nine-hundred-square-foot backyard ADU." |
| 2 | **Next** through the intake steps (no typing) | Lot type, ADU type, size and bedrooms, height and setbacks, Coastal Zone ("Not sure"), transit | "Clear It asks what a plan checker will look at: the lot, the ADU type, size, height, setbacks, and the Coastal Zone." |
| 3 | **See results** | Headline "Change the design to qualify for the fast path"; issues list | "Before anyone submits, it finds the problems." |
| 4 | Point at `size` (red) | Fail, fix, citation: Municipal Code § 20.48.200 | "Nine hundred square feet is over Newport's eight-fifty limit for one bedroom. Fix: eight hundred. Every flag shows its source." |
| 5 | Point at `setback` (red) | Fail, citation: Gov. Code § 66323(a)(2) | "Three-foot setback. State law guarantees approval at four." |
| 6 | Point at `coastal` (amber) | Warn, link to the city's Address Search Tool | "They don't know if they're in the Coastal Zone. If they are, a coastal permit comes first, and that can mean a hearing." |
| 7 | Point at the deed restriction in **Documents** | Document with warning; `deed` item under rights, citing the HCD letter | "And a conflict. Newport's permit page asks every ADU for a deed restriction. The city's own 2026 summary says only junior ADUs need one, and the state told Newport deed restrictions aren't allowed for ADUs. We show both sides, with sources." |
| 8 | **Load fixed version** | Same application, 800 sq ft, 4 ft setback, not in the Coastal Zone | "Now the fixed version." |
| 9 | **See results** | "Qualifies for the fast path" / **Ready to submit**; all checks green, including "State-guaranteed ADU" | "Every check passes, and this is an ADU the state says the city must approve. Ready to submit: one review cycle is the goal." |

Rules for the presenter: never type live; if the app breaks, switch to the backup screenshots (not made yet, see open items).

---

## 4. Competitor table

All sites accessed **2026-11-07**. "Vendor claim" = what the company says about itself; we did not test any product.

| Product | Who it serves | What it does (from its own site) | How Clear It differs | Source |
|---|---|---|---|---|
| **Blitz AI** | **Local governments** ("AI Compliance Infrastructure for Local Governments"; "built specifically for cities, counties, and government departments") | Two products: **AI Plan Review** for city staff and **AI Pre-Check**, which a city deploys as a portal for applicants to upload plan sets and get a report of "missing sheets, missing details and compliance errors". Says it keeps "final authority with your plan reviewers." Pre-Check page does not mention ADUs or California. | The city has to buy it, and it reads finished plan sets. Clear It works for the applicant before plans are final, on Newport's rules, and points out where city pages conflict with state law. | [S10], [S11] |
| **Blitz AI in Corona, CA** (a real deployment) | Applicants in Corona | Free, voluntary "Prescreen Review"; lists "Single Family ADU" as a project type. City says: "This prescreen review is not a plan check and does not evaluate code compliance," and calls the software "in an introductory development and testing phase." | Corona's prescreen checks completeness only. Clear It checks the design against written standards (size, setbacks, height, Coastal Zone) with citations. | [S12] |
| **Symbium** (and Symbium Build) | Contractors, high-volume installers and building departments (Symbium); California homeowners checking ADU eligibility (Symbium Build) | "Instant permitting" with compliance checks "as a permit applicant is scoping out a project"; "Available in select jurisdictions." Symbium Build: "Learn instantly if you can have an ADU on your property." | Symbium Build answers "can I have an ADU?". Clear It answers "will my application come back?": forms, fixes and the city-vs-state conflicts for Newport. Whether Symbium covers Newport Beach: **not verified**. | [S13], [S14] |
| **CrossBeam** | California ADU contractors who received a corrections letter | AI agent that reads a corrections letter and plans and drafts a response with code citations. | Works **after** the corrections letter; Clear It works **before** submission, to avoid the letter. Looks like an early-stage or prototype site; company status **not verified**. | [S16] |
| **Status quo: city resources** | Newport applicants | Optional meeting with city staff, pre-approved plans, OC ADU cost calculator | Free and official, but the applicant still has to put the rules together and spot conflicts. Clear It puts them in one checklist. | [S1], [S9b]; OC ADU calculator site **would not load**, not verified |

Not verified (couldn't load or no time): Cembla (AI ADU plan review for local governments, per search result only), AIEntitle, PlanCheckerPro. Left out of the pitch.

---

## 5. Impact math

Every input is either sourced or labeled **Estimate**. Spoken version: talk track section 8.

| Step | Input | Value | Basis |
|---|---|---|---|
| 1 | Typical review rounds today | 2–3 | [S1] "Most projects require 2-3 rounds of review" |
| 2 | Our goal | 1 round | Goal, shown by the demo; **not measured** |
| 3 | Rounds avoided per project | 1–2 | Step 1 − Step 2 |
| 4 | City review time per round | 10–20 days | [S1] "each taking 10 - 20 days". The city doesn't say business or calendar days; we treat them as calendar days (the shorter reading) |
| 5 | Applicant time to fix and resubmit per round | 7–14 days | **Estimate.** Assumes the designer revises the plans and the applicant resubmits within 1–2 weeks |
| 6 | Time per avoided round | 17–34 days (≈ 2.5–5 weeks) | Step 4 + Step 5 |
| 7 | Time saved per project | ≈ 2.5–10 weeks | Step 6 × Step 3 (1 round at the low end, 2 at the high end) |
| 8 | Designer cost per correction round | $600–$1,500 | **Estimate.** Assumes 4–10 hours at $150/hour |
| 9 | Rent lost per month of delay | $3,000 | **Estimate.** Assumed rent for a 1-bedroom ADU in Newport Beach; not sourced |
| 10 | Rent lost per avoided round | ≈ $1,700–$3,400 | Step 6 (17–34 days) × Step 9 ÷ 30 |
| 11 | **Money saved per avoided round** | **≈ $2,300–$4,900** | **Estimate:** Step 8 + Step 10 |
| 12 | **Money saved per project** | **≈ $2,300–$9,800** | **Estimate:** Step 11 × Step 3 |

**Context for "four years into two":**
- Newport says permitting "typically takes 1-6 months" and "Most ADU projects take 12-18 months to complete" [S1], [S2]. Review rounds alone (2–3 × 10–20 days = 20–60 days) are a large part of the permitting phase.
- "About four years to about two" is the hackathon challenge's framing for the ministerial path [S15], not a Newport ADU figure. Our claim is narrower: fewer review rounds shorten permitting, and the same engine extends to SB 9 and small multifamily, where each round holds up more units and more money (no sourced figure yet).

Not included (no source found): whether Newport charges for rechecks beyond the plan check fee ($850–$1,700 [S1]), how many ADU applications Newport receives per year, and the share that need corrections.

---

## 6. Judge Q&A

**"How does saving a month or two fit 'four years into two'?"**
Plan check is a large part of a homeowner's ADU timeline: Newport says permitting takes 1 to 6 months, with most projects going through 2 to 3 review rounds. For one ADU, we save weeks. The bigger win is that the same rules engine extends to SB 9 and small multifamily, where every correction round delays more units and costs more.

**"What happens when the law changes?"**
Every rule in our data carries its source URL and the date we checked it. State ADU law changes often (renumbered in 2024 by SB 477; HCD updated its ADU handbook again in March 2026), and Newport rewrote its rules in 2023 and 2025. A maintainer re-checks every cited source each January and whenever the city posts a new ordinance; the citation list is the checklist.

**"Why not just use Blitz AI?"**
Blitz sells to cities, and an applicant only gets it if their city buys it; Newport isn't listed as a customer on anything we found (not verified either way). Blitz reads finished plan sets. We help the applicant earlier, on the design and the paperwork, and we flag where the city's own pages conflict with state law, which a city-run tool has less reason to do.

**"How do you know this reduces corrections?"**
We don't yet, and we won't claim it. The demo shows the tool catching what a plan checker would flag, using the city's and state's written rules. The next step is a pilot with real applicants that counts review rounds against the city's 2–3 round baseline.

**"Isn't this legal advice? Who's liable?"**
No. The app says it is not legal advice and tells users to confirm with the city, and every flag links to the rule it comes from, so the user and the city can check it. We point out risks; the city still decides.

**"Why should we trust your data?"**
Every rule cites the city or state source and the date we checked it, and where two official sources disagree (like the deed restriction) we show both instead of picking one. The pass/fail logic is plain code anyone can read.

**"Why doesn't the AI decide?"**
Approval is ministerial: it depends on written, objective rules, so a fixed rule is the right tool for pass/fail, and it gives the same answer every time. AI is useful for asking questions in plain language and explaining a flag, not for making the decision.

**"What's the business model?"** *(answer is a proposal, not validated)*
Free for homeowners in early cities to build trust and data; paid seats for small builders and nonprofit developers who file many applications; later, a version cities can offer applicants. No pricing research done yet.

**"Where does 'over 90% deemed incomplete' come from?"**
We don't use that number, because we haven't found a source for it. Our baseline is Newport's own "2–3 rounds."

---

## 7. Sources

All accessed **2026-11-07** unless noted.

- **[S1]** Newport Beach ADU: Permit, https://www.newportbeachadu.org/permit. Quotes: "Most projects require 2-3 rounds of review, each taking 10 - 20 days."; "The Permitting phase typically takes 1-6 months."; plan check fees "range from $850 to $1,700"; building permit fees "ranging from $850 and $2,100"; required documents include a signed and notarized deed restriction stating "The ADU won't be sold as a separate property". Note: the lane brief calls this source Newport's "ADU guidebook". The figure is on the city's ADU program site (newportbeachadu.org), which also hosts a downloadable "ADU Guidebook"; we did not find the quote inside the guidebook PDF itself.
- **[S2]** Newport Beach ADU: Get started, https://www.newportbeachadu.org/get-started. Quote: "Most ADU projects take 12-18 months to complete, but some extend to 24 months or more."
- **[S3]** Newport Beach ADU Ordinance Summary Matrix 2026, https://www.newportbeachadu.org/s/ADU-Ordinance-Summary-Matrix-2026.pdf (local copy: `docs/forms/newport-beach/reference/adu-ordinance-summary-matrix-2026.pdf`). Attached/detached max 850 sq ft (studio/1 bed), 1,000 sq ft (2 bed); detached height 16 ft; deed restriction required for JADUs only. **Taken from the team research doc (`docs/clear-it-newport.md`); not re-read for this draft** (no PDF text tool available).
- **[S4]** HCD findings letter to Newport Beach, Oct 1, 2024, https://www.hcd.ca.gov/sites/default/files/docs/policy-and-research/ordinance-review-letters/newport-beach-adu-findings-100124.pdf (local copy in `docs/forms/newport-beach/reference/`). Quote: "Deed restrictions are not authorized under state law for ADUs." **Quote taken from the team research doc; not re-read for this draft.**
- **[S5]** Cal. Gov. Code § 66323 (state-guaranteed ADUs, 800 sq ft, 4 ft setbacks) and § 66317 (60-day decision), https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=66323. As cited in `src/lib/adu/state-law.ts`; not re-read for this draft.
- **[S6]** Cal. Gov. Code § 66321(b)(4) (height), https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=66321. As cited in `src/lib/adu/state-law.ts`.
- **[S7]** Newport Beach ADU: City rules, https://www.newportbeachadu.org/city-rules. Quote: "Adopted August 26, 2025 and effective September 9, 2025."; lists "Adopted Ordinance No. 2023-2 Title 20 – Planning and Zoning ADU Regulations".
- **[S8]** HCD, Accessory Dwelling Units, https://www.hcd.ca.gov/policy-and-research/accessory-dwelling-units. Quote: "As of March 25, 2024, with the Chaptering of Senate Bill (SB) 477 (Chapter 7, Statutes of 2024) … the sections of Government Code relevant to State ADU and JADU Law have been re-numbered." ADU Handbook listed as "Updated March 2026."
- **[S9b]** Newport Beach ADU: Design (pre-approved plans), https://www.newportbeachadu.org/design. Via the team research doc.
- **[S10]** Blitz AI home page, https://blitzpermits.ai/. Quotes: "AI Compliance Infrastructure for Local Governments"; "built specifically for cities, counties, and government departments"; "final authority with your plan reviewers."
- **[S11]** Blitz AI Pre-Check, https://blitzpermits.ai/product-ai-pre-check. Quotes: "Built for Applicants Using Your Local Government Portal"; "missing sheets, missing details and compliance errors" (home page). No mention of ADUs or California.
- **[S12]** City of Corona, AI Plan Sufficiency Review, https://www.coronaca.gov/departments/building-division/building-ai-portal. Quotes: "The City is partnering with Blitz AI to offer a voluntary Prescreen Review service"; "This prescreen review is not a plan check and does not evaluate code compliance."; "No, this tool is completely free to use."; lists "Single Family ADU".
- **[S13]** Symbium, https://symbium.com/. Quotes: "Instant permitting"; "performs compliance checks against applicable building, zoning, and energy codes as a permit applicant is scoping out a project"; "Available in select jurisdictions."
- **[S14]** Symbium Build, https://build.symbium.com/. Quotes: "Learn instantly if you can have an ADU on your property."; "Check if your California property is eligible."
- **[S15]** Team lane brief, `docs/lane-brief.md` (hackathon challenge framing: ~4 years → ~2 on the ministerial path; OC's 34 cities; "One city done well beats many cities done badly"). Internal, not an external source; the 4→2 figure is the challenge's, not ours.
- **[S16]** CrossBeam, https://cc-crossbeam.vercel.app/. Describes reading a "14-item corrections letter" and drafting a response with code citations for California ADUs.

---

## 8. Open items and unverified claims

### Claims cut or relabeled
- **"Over 90% of applications deemed incomplete"**: cut. No primary source found. (CrossBeam's site says "90%+" of California ADU permits need corrections on first submission, but gives no source we could check.)
- **"2–3 review rounds of 10–20 business days"**: relabeled to **"10–20 days"**. The city's page says "days", not "business days".
- **"Newport's guidebook" as the source of 2–3 rounds**: the quote is on the city's ADU program site permit page [S1], not confirmed inside the Guidebook PDF. The pitch says "Newport Beach's own ADU site".
- **"Strongest public documentation"** (why Newport): not measured, so the pitch says "Newport puts its rules, forms and pre-approved plans online" instead.
- **"State ADU law changes yearly, effective January 1"**: not directly verified. A search result summarizing HCD's March 2026 handbook mentions bills effective Jan 1, 2025 (SB 1211, AB 2533), June 30, 2025, Oct 10, 2025 and Jan 1, 2026, but we couldn't open the PDF to confirm. The pitch uses only the verified facts (SB 477 renumbering in 2024, handbook updated March 2026).
- **Departments that sign off**: left out of the pitch; still an open question in `docs/project-context.md`.
- **Impact money figures**: all labeled Estimate (designer hours, rate, rent).

### Not verified
- [S3], [S4], [S5], [S6], [S9b]: taken from the team research doc and the code's citations, not re-read in this pass (no PDF text tool). Re-check the matrix and HCD quote before the demo.
- Whether Blitz AI or Symbium serve Newport Beach.
- OC ADU calculator (site failed to load), Cembla, AIEntitle, PlanCheckerPro.
- Whether Newport charges for extra plan-check rounds; number of ADU applications per year in Newport.

### Flags for the Context agent (demo steps the app can't show yet)
1. **No UI.** `src/app/page.tsx` is a placeholder. Steps 1–9 all need the intake, results page and buttons → `app-builder`.
2. **No demo application.** `src/lib/adu/demo-application.ts` doesn't exist. Create it with the inputs in Section 3 (broken and fixed versions) → `app-builder`.
3. **No "Load fixed version" button** (step 8). Needs a second preset, or a "fix all" action on the results page → `app-builder`.
4. **No "Ready to submit" status.** The engine's headline is "Qualifies for the fast path", and the verdict is `fast-path` even when `warn` checks remain (e.g. Coastal Zone "yes"). Decide the rule (proposal: ready = no `fail` and no `warn`) and show it on the results page → `app-builder` (or `rules-checks` if it goes in the engine).
5. **No plain-English "fix" field.** `Check` has `detail` but no separate `fix`. Fixes are inside the `detail` text for `size` and `setback`, but the results page needs a clear fix line for each issue → `rules-checks` (type change in `src/lib/adu/types.ts`).
6. **The deed-restriction conflict isn't a check.** It shows as a `documents[]` warning and a `rights[]` item, not an issue in the checks list, so it may not look like a flagged issue on the results page. Either the results page shows document warnings next to the issues, or `rules-checks` adds a check → `app-builder` / `rules-checks`.
7. **No correction-prevention checks for the package itself** (missing documents, plan-set items, coastal sequencing). The demo's mistakes are design-standard issues; the pitch says "what a plan checker would flag", which holds for size and setbacks but would be stronger with one missing-document check → `rules-checks`.
8. **No AI features built.** The pitch avoids claiming any; keep it that way unless they ship.
9. **"Not legal advice" disclaimer** must be visible on the results page (the Q&A relies on it) → `app-builder`.
10. **Backup screenshots** of each demo step, in case the live app fails → whoever rehearses, after the UI exists.
11. **Re-check the script against the real app** once steps 1–4 above are done (`pitch-storyline`).
