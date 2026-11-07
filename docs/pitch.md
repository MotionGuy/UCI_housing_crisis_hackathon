# Clear It: pitch and demo script

**Draft 3, 2026-11-07.** Owner: `pitch-storyline` agent.
**Read-aloud length: 547 spoken words (344 talk track + 203 demo narration) ≈ 4:12 of speech at 130 words/min, about 4:42 with clicks, two typed edits and page loads (inside the 3–5 minute limit).** Words counted with a script on 2026-11-07; they cover only the quoted lines in "Talk track" and the quoted text in the "Presenter says" column. The ~0:30 for clicks and typing is an **Estimate** (9 demo steps, two of them typed edits; most lines are spoken while clicking); time it at rehearsal.

Status: the demo script follows the app on `main` (commit `2729c24`, "Block invalid intake values and show filled forms in the app"). Screen titles, messages and button labels were read from the code (`src/components/wizard/adu-wizard.tsx`, `step-checks.ts`, `ui.tsx`, `results.tsx`, `review.tsx`, `form-preview.tsx`, `src/lib/adu/demo-application.ts`, `src/lib/adu/evaluate.ts`). Checked against the code, **not yet rehearsed in a browser** (see [Section 8](#8-open-items-and-unverified-claims)).

Sources are numbered `[S#]` and listed in [Section 7](#7-sources). "Estimate" means a number we made up from stated assumptions, not a measured result.

---

## 1. One-line pitch

> **We cut the 2–3 review cycles most ADU applications go through to one.**

- "2–3 cycles": Newport Beach's ADU site, "Most projects require 2-3 rounds of review, each taking 10 - 20 days." [S1]
- "To one": **the goal the demo shows, not a measured result.**

---

## 2. Talk track (target ~4:40)

| # | Section | Words | Time |
|---|---|---|---|
| 1 | Problem | 62 | 0:29 |
| 2 | Target market | 30 | 0:14 |
| 3 | Unique value proposition | 19 | 0:09 |
| 4 | Live demo | 203 | 1:34 speech + ~0:30 clicks and typing (Estimate) = ~2:04 |
| 5 | Competitive landscape | 49 | 0:23 |
| 6 | Implementation plan | 77 | 0:36 |
| 7 | Feasibility | 26 | 0:12 |
| 8 | Impact | 81 | 0:37 |
| | **Total** | **547** | **~4:42** |

If time runs short, cut in this order: section 7 (Feasibility; the demo already shows sources), then the Implementation plan's last two sentences. Never cut demo steps 3–4 (the live catch) or 8–9 (the filled city form).

### 1. Problem

> "California already has a fast path for ADUs: if a project meets the written rules, the city must approve it, with no hearing. Yet applications keep bouncing back. Each of Orange County's 34 cities has its own forms and checklists, and Newport Beach's own ADU site says most projects need two to three rounds of review, each taking ten to twenty days."

Backing: ministerial approval and the 60-day deadline, Gov. Code §§ 66317, 66323 [S5]; 34 OC cities, lane brief [S15]; 2–3 rounds of 10–20 days [S1].

### 2. Target market

> "We start with homeowners adding an ADU in Newport Beach, which puts its rules, forms and pre-approved plans online. Small builders, nonprofit project managers and city permit techs come next."

Backing: city rules matrix [S3], forms [S1], pre-approved plans [S9b]. Why one city: lane brief, "One city done well beats many cities done badly" [S15].

### 3. Unique value proposition

> "We don't explain the rules. We get the first submission right: one review cycle instead of two or three."

### 4. Live demo

See the [demo script](#3-demo-script). Its first line is the transition: *"Here's a homeowner's application, with the mistakes a plan checker sends back."* The demo's arc: the mistake happens on screen, Clear It stops it before it reaches the city, the homeowner fixes it, and the app fills the city's real form.

### 5. Competitive landscape

> "Blitz AI sells AI plan review to cities. Corona's free Blitz pre-screen checks for missing documents, not code compliance. Symbium checks whether a California lot can have an ADU. We work for the applicant, before submission, with a source on every flag, and we fill in the city's forms."

Backing: [Section 4](#4-competitor-table) [S10–S14].

### 6. Implementation plan

> "Today: Newport single-family ADUs, with two city forms filled in. Next: the other forms an applicant may need, like the plan check checklist and the Coastal Commission's permit application. Then more Orange County cities, SB 9 and small multifamily. The rules move: the state renumbered ADU law in 2024, and Newport changed its rules in 2023 and 2025. Every rule carries its source and the date we checked it, so re-checking is a list, not a rewrite."

Backing: the two forms the app fills today are the building permit worksheet linked from the city's ADU permit page [S1], [S17] and, when the lot is or may be coastal, the Coastal Development Permit owner's affidavit (`src/lib/forms/fill.ts`). **Next-step forms** (the app does **not** fill these yet; named here generically, no fees or numbers): the city's plan check submittal checklist, the California Coastal Commission's CDP application (for lots in the Commission's permit jurisdiction), an owner-builder verification form, a flood-zone substantial-improvement form, and a mechanical/electrical/plumbing plan-review questionnaire. They were identified by the team's forms research (`docs/forms/newport-beach/additional-forms.md` on the research branch, not on `main`); confirm each one before naming it on stage. SB 477 renumbering, March 25, 2024 [S8]; Newport Ordinance 2023-2 and the update adopted August 26, 2025 [S7]. Maintenance: each `Citation` in `src/lib/adu/` has a label and URL, and `CITY.checkedOn` holds the access date. Proposed owner: one team member re-checks every rule each January (state changes) and when the city posts a new ordinance (see Q&A).

### 7. Feasibility

> "Requirements are public, rules are written down, and approval is ministerial. Every pass or fail comes from a written rule with a citation, never from AI."

### 8. Impact

> "The math, with every guess labeled. Newport says ten to twenty days per review round. Add an estimated one to two weeks to fix and resubmit. So each round we prevent saves roughly two and a half to five weeks. We can't prove that yet; the next step is a pilot that counts review rounds. And the same engine extends to SB 9 and small multifamily, where every round costs more. That's how fewer rounds helps turn four years into two."

Full math: [Section 5](#5-impact-math).

---

## 3. Demo script

Run from `main`. Start on the home page (`npm run dev`, then `/`). Use the demo buttons; the only typing is the two fixes in step 4, which **are** the demo (rehearse them).

**Sample application** (`demoAnswers` and `demoProfile` in `src/lib/adu/demo-application.ts`): made-up owner "Sam Sample" at "123 Example Lane, Newport Beach"; existing single-family lot; **detached, 1-bedroom, 900 sq ft**, **17 ft** tall, **3 ft** side/rear setback, Coastal Zone **"not sure"**, not near transit, no garage conversion, no pre-approved plan. The demo skips the **Find my property** address lookup (made-up address): **Load demo application** fills zoning "R-1" and a demo APN by hand, and the button reads **Continue**.

**Where each planted mistake shows up** (read from `step-checks.ts`, `evaluate.ts`, `results.tsx`):

| # | Planted mistake | Input | Where it's caught | What the screen says | Source shown | Fix |
|---|---|---|---|---|---|---|
| 1 | Too big for a 1-bedroom | `squareFeet: 900`, `bedrooms: 1` | **"Size it up" step, red under Size (sq ft); blocks Continue** | "Newport Beach allows up to 850 sq ft for a studio or 1 bedroom. Yours is 900 sq ft. ..." then "Allowed: up to 850 sq ft for a studio or 1 bedroom. 800 sq ft or less (with 4 ft setbacks) is a detached ADU the city must approve." | "Newport Beach Municipal Code § 20.48.200 (§ 21.48.200 in the Coastal Zone)" [S3], [S7] | Presenter types 800 |
| 2 | Setback too small | `sideRearSetbackFeet: 3` | **"Size it up" step, red under Side and rear setback (ft); blocks Continue** | "New ADUs need at least 4 ft from the side and rear property lines. Yours is 3 ft." then "Allowed: 4 ft or more." | Cal. Gov. Code § 66323(a)(2) [S5] | Presenter types 4 |
| 3 | Too tall for the state guarantee | `heightFeet: 17` | "Size it up" step, amber (doesn't block); results page | "Height: 17 ft is above the 16 ft the state guarantees. ..." | Cal. Gov. Code § 66321(b)(4) [S6] | 16 ft (in the fixed version) |
| 4 | Coastal Zone unknown | `coastalZone: "unsure"` | "Is it in the Coastal Zone?" step, amber (doesn't block); results page | "Coastal Zone: Check your address with the city's Address Search Tool. ..." | Newport Beach Address Search Tool [S1] | Look up the address (fixed version: not coastal) |
| 5 | City-vs-state conflict | (any non-JADU ADU) | Results page, amber card **"City vs. state conflict: Deed restriction (signed and notarized)"** | "The city's own code (NBMC § 20.48.200(I), Ord. 2025-20) requires a deed restriction only for JADUs, and HCD says state law doesn't allow one for ADUs. ..." | "City permit page" [S1] and "HCD findings letter to Newport Beach, Oct 1, 2024" [S4] | Ask the city before recording one |

**After the live fixes** (800 sq ft, 4 ft; still 17 ft and "not sure"): headline "Qualifies for the fast path"; amber banner **"Almost ready: check 2 warnings"**, "Nothing blocks you, but a plan checker may ask about these."; list **"Check these (3)"**: Height, Coastal Zone, and the deed-restriction conflict card. **Review and submit** is enabled. (The red "Fix these first" banner can no longer appear in this run: the intake stops the red items before results.)

**Fixed version** (`fixedAnswers`, loaded by **Load fixed version (demo)**): 800 sq ft, 16 ft, 4 ft, Coastal Zone "no". Banner **"Ready to submit"**, "No rule problems found. Review your forms, then file them with the city."; "Check these (1)" keeps the deed-restriction conflict card (it applies to every non-JADU ADU and doesn't block). With Coastal Zone "no", the app fills **one** form, the building permit worksheet.

| Step | Click | Screen shows | Presenter says |
|---|---|---|---|
| 1 | On "Where's your property?" (step 1 of 7), click **Load demo application**, then **Continue** | Address, zoning "R-1" and APN filled in; "Sample data loaded. Click Continue." | "Here's a homeowner's application, with the mistakes a plan checker sends back: a one-bedroom backyard ADU. The data is made up." |
| 2 | Click **I'm not sure** ("Is it in the Coastal Zone?"), **A single-family house** ("What's on the lot now?"), **Detached ADU** ("Choose your ADU type") | On the Coastal Zone step, an amber note: "Coastal Zone: Check your address with the city's Address Search Tool ..." with its source. Each pick moves to the next step | "They aren't sure about the Coastal Zone. Clear It flags it, and lets them keep going." |
| 3 | "Size it up" loads. Don't click; point at the red notes | Red under **Size (sq ft)** and **Side and rear setback (ft)**: the rule, "Allowed: …", and a "Source:" link. Amber Height note. **Continue** is disabled: "Fix the values marked in red to continue." | "This is where applications go wrong: nine hundred square feet, three feet from the property line. Normally a plan checker finds that weeks later. Clear It stops it here. Newport caps a one-bedroom at eight hundred fifty; state law guarantees four-foot setbacks. Each error links its source." |
| 4 | Select the Size value and type **800**; select the setback value and type **4** | Both red notes disappear; **Continue** turns on. The amber Height note stays | "Fix it right here: eight hundred, four feet. Seventeen feet tall is only a warning, so they can go on." |
| 5 | **Continue**; "Tell us about you": **Continue**; "Your team and budget": **Fill my forms** | Owner Sam Sample; demo designer and contractor | (no line; keep clicking) |
| 6 | (results page loads) Point at the banner, then the **"Check these (3)"** list | Headline "Qualifies for the fast path"; amber **"Almost ready: check 2 warnings"**; Height and Coastal Zone rows with sources; **"City vs. state conflict: Deed restriction (signed and notarized)"** card with two source links; "Not legal advice. Rules checked on 2026-11-07." | "Two warnings left, each with its source. And a conflict: Newport's permit page asks every ADU for a deed restriction, but the city's own code and the state say only junior ADUs need one. We show both sides." |
| 7 | Click **Load fixed version (demo)** | Banner turns green: **"Ready to submit"**; "Check these (1)": the deed conflict card | "Lower it to sixteen feet, check the address, not coastal. Ready to submit." |
| 8 | Click **Review and submit**; scroll past the value list to the embedded form | "Check what we filled in": every value on "Building permit application (Combo Building & Solar worksheet)", each with **Change** or "Set by Clear It"; below it, the filled PDF ("The filled form, as it will print") | "Before anything leaves, the homeowner checks every value. And this is Newport's real building permit form, already filled in." |
| 9 | Tick **I checked these and they're correct.**, click **Submit** | "Your package is ready to file": **PDF** and **How to file (summary)** downloads, "Your filled forms" preview, and a note that Clear It doesn't file anything with the city | "They sign it and file it with the city themselves. We don't just explain the rules; we fill out the city's forms, and one review cycle is the goal." |

Presenter notes:
- **Step 4 is live typing on purpose.** Click into the field, select all, type the number. If a field misbehaves, use **Back** to the address step and **Load fixed version**, then click through (fallback: the story still shows the catch from step 3).
- The PDF shows inline only at laptop width; at phone width it's a **View the filled form (PDF)** button. Present from a laptop. If the browser won't embed PDFs, use **Open in a new tab** above the preview.
- Don't click **Download everything** (the browser may ask permission for several downloads). No download is needed: the filled form is already on screen.
- Don't read the valuation aloud. It is the app's $300/sq ft estimate (labeled "Estimate" on the review screen), not a city figure.
- Optional, if asked about the coastal form: before step 7, click **Review and submit** from the "Almost ready" page. With Coastal Zone still "not sure", the review screen also shows the filled **Owner's Affidavit (Coastal Development Permit)**. Then **Back** and continue with step 7.
- If the app breaks, switch to backup screenshots (not made yet; see open items).

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

**"Which building permit form do you fill, and is it the current one?"**
We fill the "Worksheet for Combo Building & Solar Permit Application", the form the city's ADU permit page links as "Building Permit"; our copy is byte-identical to the city's live file as of November 7, 2026 [S17]. The Building Division's forms page also lists a newer "Building Permit Application" (file modified May 2025) [S18], and a teammate is confirming with the Permit Center which one ADU applicants should use. That's the problem in miniature: the city's own pages point to different forms, and an applicant has no way to know which one the counter expects. When the answer comes in, we update one form map and every user gets the right form.

**"Does Clear It submit to the city?"**
No. Newport takes ADU applications through its own process; Clear It fills the forms, the homeowner checks every value and confirms, and then downloads the package with filing instructions. The homeowner signs and files it.

**"Which forms do you fill? Is that the whole application?"**
Two city forms today: the building permit worksheet, and for coastal (or "not sure") lots the Coastal Development Permit owner's affidavit. That's not the whole package: the homeowner still brings plans, a grant deed and other documents, which the results page lists under "Still to gather". Other official forms some projects need (for example the plan check checklist or the Coastal Commission's own permit application) are next on our list; the app doesn't fill them yet.

**"Why stop the user instead of just warning them?"**
Only the red items block: they break a written rule (city size cap, state setback), so the application would come back. Warnings like the 17 ft height don't block, because the city may still allow it; the user decides.

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
- **[S17]** Newport Beach, "Worksheet for Combo Building & Solar Permit Application", https://www.newportbeachca.gov/home/showpublisheddocument/15043/635682493202100000, linked as "Building Permit" from [S1]. Repo copy: `docs/forms/newport-beach/submit/building-permit-application-worksheet.pdf` (served from `public/forms/newport-beach/`). Byte-identical to the live file as of 2026-11-07 (team check, reported to the pitch agent; not re-run in this pass).
- **[S18]** Newport Beach Building Division, "Building Permit Application" (file modified May 6, 2025), https://www.newportbeachca.gov/home/showpublisheddocument/3258/638824129709970000, listed on the Building Division forms page. Details from `docs/adu-application-guide.md` (that doc calls it "Combo Building Permit Application" in one place); not re-opened in this pass.

---

## 8. Open items and unverified claims

### Claims cut or relabeled
- **"Over 90% of applications deemed incomplete"**: cut. No primary source found. (CrossBeam's site says "90%+" of California ADU permits need corrections on first submission, but gives no source we could check.)
- **"2–3 review rounds of 10–20 business days"**: relabeled to **"10–20 days"**. The city's page says "days", not "business days".
- **"Newport's guidebook" as the source of 2–3 rounds**: the quote is on the city's ADU program site permit page [S1], not confirmed inside the Guidebook PDF. The pitch says "Newport Beach's own ADU site".
- **"Strongest public documentation"** (why Newport): not measured, so the pitch says "Newport puts its rules, forms and pre-approved plans online" instead.
- **"State ADU law changes yearly, effective January 1"**: not directly verified. The pitch uses only the verified facts (SB 477 renumbering in 2024, handbook updated March 2026).
- **Departments that sign off**: left out of the pitch; still an open question in `docs/project-context.md`.
- **Impact money figures**: all labeled Estimate (designer hours, rate, rent).
- **The $300/sq ft valuation** on the review screen is the app's estimate (labeled "Estimate" in the app; no city source). The script tells the presenter not to read it aloud.
- **"Newport rewrote its ADU rules in 2023 and again in 2025"**: softened to "changed" [S7].
- **Draft 3: deed-restriction line.** Was "the city's 2026 summary and the state say only junior ADUs need one"; now "the city's own code and the state", to match the app's conflict card (which cites NBMC § 20.48.200(I), Ord. 2025-20). Backing: [S3] (2026 matrix: deed restriction for JADUs only) and [S4]. The ordinance number comes from the app's text and was not re-read in this pass.
- **Draft 3: extra forms** (plan check checklist, Coastal Commission CDP application, owner-builder verification, flood-zone substantial-improvement form, MEP plan-review questionnaire): named only as **next steps**, without fees or numbers. The app fills two forms (building permit worksheet; CDP owner's affidavit for coastal or "not sure" lots). The research file listing them (`docs/forms/newport-beach/additional-forms.md`) is not on `main`, so they have no `[S#]` here.
- **Draft 3: "the tool stops the mistake before it reaches the city"** is what the app does on screen (Continue disabled on "Size it up"). "Normally a plan checker finds that weeks later" rests on [S1] (rounds of 10–20 days); it's a description of the usual process, not a measured figure.

### Not verified
- [S3], [S4], [S5], [S6], [S9b]: taken from the team research doc and the code's citations, not re-read in this pass (no PDF text tool). Re-check the matrix and HCD quote before the demo.
- Whether Blitz AI or Symbium serve Newport Beach.
- OC ADU calculator (site failed to load), Cembla, AIEntitle, PlanCheckerPro.
- Whether Newport charges for extra plan-check rounds; number of ADU applications per year in Newport.
- [S17] byte-identical check and [S18] details: reported by the team / application guide, not re-run in this pass.
- The five next-step forms: from the research branch, not checked by this agent.

### Flags for the Context agent

**Now covered by the app on `main`, removed from this list:** PR #4 merged (demo application, demo buttons, status banners, review screen, Submit step); the missing "Fix:" line (the intake now shows an "Allowed: …" line under each red error); the live catch of planted mistakes during intake; the filled form shown inside the app (review and submit screens).

**Still open:**
1. **Not rehearsed in a browser; not timed.** This script was checked against the code only. Do one full run-through with a stopwatch, check the two typed edits in step 4 and the inline PDF, and fix any label that differs → `pitch-storyline` + presenter.
2. **Backup screenshots** of each demo step: the red errors on "Size it up", "Almost ready", "Ready to submit", the review screen with the embedded PDF, and the submit screen → whoever rehearses.
3. **Deed-restriction info check is listed under "Checks that passed".** The new `deed-restriction` check (status `info`, title "City asks for a deed restriction state law appears not to allow") renders in the collapsed "Checks that passed (N)" list on the results page, next to the "City vs. state conflict" card. A judge who expands that list sees a conflict filed as "passed". Suggest a label like "Other checks" or showing it only once → `app-builder`.
4. **Which building permit form ADU applicants should use** (worksheet doc 15043, linked from the ADU site, vs. the May 2025 "Building Permit Application", doc 3258). `docs/project-context.md` marks it resolved (worksheet is current); the Q&A answer still says a teammate is confirming. Reconcile once confirmed → `project-context`.
5. **No package-completeness checks** (missing documents, plan-set items, coastal sequencing). All planted mistakes are design-standard issues → `rules-checks`.
6. **The closing shows one city form.** The fixed version has Coastal Zone "no", so only the building permit worksheet is filled. The CDP affidavit shows only while Coastal Zone is "not sure" or "yes" (optional detour in the presenter notes) → no action unless the team wants both forms in the main path.
7. **"Who reviews it" lists permits, not departments.** The pitch doesn't claim departments → `project-context`.
8. **No AI features built.** The pitch claims none; keep it that way unless they ship.
9. **Next-step forms research is not on `main`.** If the team wants to name those forms with sources, merge `docs/forms/newport-beach/additional-forms.md` → main session.
