# AutoADU: pitch and demo script

**Draft 6, 2026-11-07.** Owner: `pitch-storyline` agent.
**Read-aloud length: 447 spoken words (262 talk track + 185 demo narration) ≈ 3:26 of speech at 130 words/min, about 4:52 with clicks, typing and page loads (Estimate; inside the 3–5 minute limit, with little margin).** Words counted with a script on 2026-11-07; they cover only the quoted lines in "Talk track" and the quoted text in the "Presenter says" column. The ~1:26 of clicks and typing not covered by speech is an **Estimate**: the earlier ~1:00 (address, four size values, three fixes, owner name and email) plus about 0:35 to type the designer's seven required fields (about 70 characters) and click two answers on the team step, less about 0:09 of narration spoken over that typing. The owner's mailing address is one click (**Same as project address**, about 0:01) instead of four typed fields (about 0:15 saved versus typing them; Draft 5 skipped them, so the net change to the estimate is about zero). If the typing runs slow or doesn't overlap the speech, the run goes to about **5:10 (Estimate)**; then cut the last two sentences of section 8 (about 0:12). Time it at rehearsal.

Status: the demo script follows the app on branch `feat/height-coastal-results` (house-height rule, Coastal Zone from the address lookup, simplified results page with no Back button, no demo buttons, "Finish and download" final page). Screen titles, messages and button labels were read from the code (`src/components/wizard/adu-wizard.tsx`, `step-checks.ts`, `ui.tsx`, `results.tsx`, `review.tsx`, `form-preview.tsx`, `src/lib/adu/demo-application.ts`, `src/lib/adu/evaluate.ts`). Checked against the code, **not yet rehearsed in a browser** (see [Section 8](#8-open-items-and-unverified-claims)).

Sources are numbered `[S#]` and listed in [Section 7](#7-sources). "Estimate" means a number we made up from stated assumptions, not a measured result.

---

## 1. One-line pitch

> **We cut the 2–3 review cycles most ADU applications go through to one.**

- "2–3 cycles": Newport Beach's ADU site, "Most projects require 2-3 rounds of review, each taking 10 - 20 days." [S1]
- "To one": **the goal the demo shows, not a measured result.**

---

## 2. Talk track (target ~4:50, Estimate)

| # | Section | Words | Time |
|---|---|---|---|
| 1 | Problem | 62 | 0:29 |
| 2 | Target market | 30 | 0:14 |
| 3 | Unique value proposition | 19 | 0:09 |
| 4 | Live demo | 185 | 1:25 speech + ~1:26 clicks and typing (Estimate) = ~2:51 |
| 5 | Competitive landscape | 39 | 0:18 |
| 6 | Implementation plan | 31 | 0:14 |
| 7 | Feasibility | 0 (cut in Draft 6; kept for Q&A) | 0:00 |
| 8 | Impact | 81 | 0:37 |
| | **Total** | **447** | **~4:52** (Estimate) |

Draft 6 trims (to make room for the designer typing): section 7 moved to Q&A, the Symbium sentence dropped from section 5 (it stays in the competitor table), and section 6 no longer names the next forms. If time still runs short, cut the last two sentences of section 8 ("And the same engine extends …"). Never cut demo steps 3–4 (the live catch) or 7–8 (the filled city form and the final page). Save typing time with the browser's autofill (see presenter notes).

### 1. Problem

> "California already has a fast path for ADUs: if a project meets the written rules, the city must approve it, with no hearing. Yet applications keep bouncing back. Each of Orange County's 34 cities has its own forms and checklists, and Newport Beach's own ADU site says most projects need two to three rounds of review, each taking ten to twenty days."

Backing: ministerial approval and the 60-day deadline, Gov. Code §§ 66317, 66323 [S5]; 34 OC cities, lane brief [S15]; 2–3 rounds of 10–20 days [S1].

### 2. Target market

> "We start with homeowners adding an ADU in Newport Beach, which puts its rules, forms and pre-approved plans online. Small builders, nonprofit project managers and city permit techs come next."

Backing: city rules matrix [S3], forms [S1], pre-approved plans [S9b]. Why one city: lane brief, "One city done well beats many cities done badly" [S15].

### 3. Unique value proposition

> "We don't explain the rules. We get the first submission right: one review cycle instead of two or three."

### 4. Live demo

See the [demo script](#3-demo-script). Its first line is the transition: *"Here's a homeowner's application, with the mistakes a plan checker sends back."* The demo's arc: the mistake happens on screen, AutoADU stops it before it reaches the city, the homeowner fixes it, and the app fills the city's real form.

### 5. Competitive landscape

> "Blitz AI sells AI plan review to cities. Corona's free Blitz pre-screen checks for missing documents, not code compliance. We work for the applicant, before submission, with a source on every flag, and we fill in the city's forms."

Backing: [Section 4](#4-competitor-table) [S10–S14].

### 6. Implementation plan

> "Today: Newport single-family ADUs, with two city forms filled in. Next: more Orange County cities, SB 9 and small multifamily. Every rule carries its source and the date we checked it."

Backing: the two forms the app fills today are the building permit worksheet linked from the city's ADU permit page [S1], [S17] and, when the lot is or may be coastal, the Coastal Development Permit owner's affidavit (`src/lib/forms/fill.ts`). **Next-step forms** (the app does **not** fill these yet; named here generically, no fees or numbers): the city's plan check submittal checklist, the California Coastal Commission's CDP application (for lots in the Commission's permit jurisdiction), an owner-builder verification form, a flood-zone substantial-improvement form, and a mechanical/electrical/plumbing plan-review questionnaire. They were identified by the team's forms research (`docs/forms/newport-beach/additional-forms.md` on the research branch, not on `main`); confirm each one before naming it on stage. SB 477 renumbering, March 25, 2024 [S8]; Newport Ordinance 2023-2 and the update adopted August 26, 2025 [S7]. Maintenance: each `Citation` in `src/lib/adu/` has a label and URL, and `CITY.checkedOn` holds the access date. Proposed owner: one team member re-checks every rule each January (state changes) and when the city posts a new ordinance (see Q&A).

### 7. Feasibility

**Cut from the spoken track in Draft 6** (time: the team step now has required designer fields to type). Use it in Q&A ("Why doesn't the AI decide?"): "Requirements are public, rules are written down, and approval is ministerial. Every pass or fail comes from a written rule with a citation, never from AI."

### 8. Impact

> "The math, with every guess labeled. Newport says ten to twenty days per review round. Add an estimated one to two weeks to fix and resubmit. So each round we prevent saves roughly two and a half to five weeks. We can't prove that yet; the next step is a pilot that counts review rounds. And the same engine extends to SB 9 and small multifamily, where every round costs more. That's how fewer rounds helps turn four years into two."

Full math: [Section 5](#5-impact-math).

---

## 3. Demo script

Run from `main`. Start on the home page (`npm run dev`, then `/`). **There are no demo buttons: the presenter types the sample application.** The typing in steps 3–4 (the planted mistakes and their fixes) **is** the demo; rehearse it.

**Sample application to type** (made up; the same values as `demoAnswers` and `demoProfile` in `src/lib/adu/demo-application.ts`, which the app no longer loads; "Dana Designer, licensed architect" is a made-up person with an example.com email and a 555-01xx phone). Keep this list on a sticky note next to the laptop:

| Screen | Field | Type this |
|---|---|---|
| "Where's your property?" | Property address | **123 Example Lane, Newport Beach, CA 92663** |
| "What's on the lot now?" | (click) | **A single-family house** |
| "Choose your ADU type" | (click) | **Detached ADU** |
| "Size it up" | Size (sq ft) | **900** (planted mistake; fix to **800**) |
| | Bedrooms | **1** (already 1) |
| | ADU height (ft) | **17** (planted mistake; fix to **16**) |
| | Height of the main house (ft) | **16** |
| | Side and rear setback (ft) | **3** (planted mistake; fix to **4**) |
| "Personal information" | First name / Last name | **Sam** / **Sample** |
| | Email | **sam.sample@example.com** |
| | Mailing address, City, State, ZIP | click **Same as project address** (fills 123 Example Lane / Newport Beach / CA / 92663 from the typed project address; no typing) |
| | (optional) Phone | leave blank |
| "Your team and budget" | Estimated construction cost | leave blank (the app uses its $300/sq ft Estimate) |
| | Architect or designer: Name | **Dana Designer** |
| | License no. | leave blank (optional) |
| | Email / Phone | **dana@example.com** / **(555) 010-0145** |
| | Office address / City / State / ZIP | **500 Sample Ave** / **Irvine** / **CA** / **92618** |
| | Is your designer a licensed architect? | click **Yes** (so no engineer is required) |
| | Engineer | leave closed |
| | Who will build it? | click **Not chosen yet** (fewest fields: no contractor to type), then **Fill my forms** |

There is **no Coastal Zone question**: the **Find my property** lookup reads it from the city's map. The made-up address isn't on the map, so the lookup says "We couldn't find that address in Newport Beach. Check the street number and name." (offline: "The lookup didn't work. You can enter the details by hand.") and the button turns into **Continue by hand**. Coastal Zone then stays "not sure": an amber, non-blocking note ("We couldn't confirm whether this lot is in the Coastal Zone. ..."), and the app also fills the Coastal Development Permit owner's affidavit, just in case.

**Where each planted mistake shows up** (read from `step-checks.ts`, `evaluate.ts`): all three are red on the **"Size it up"** step and each one blocks **Continue** until it's fixed.

| # | Planted mistake | Typed value | Where it's caught | What the screen says | Source shown | Fix |
|---|---|---|---|---|---|---|
| 1 | Too big for a 1-bedroom | Size **900**, Bedrooms **1** | **"Size it up", red under Size (sq ft)** | "Newport Beach allows up to 850 sq ft for a studio or 1 bedroom. Yours is 900 sq ft. ..." then "Allowed: up to 850 sq ft for a studio or 1 bedroom. 800 sq ft or less (with 4 ft setbacks) is a detached ADU the city must approve." | "Newport Beach Municipal Code § 20.48.200 (§ 21.48.200 in the Coastal Zone)" [S3], [S7] | Presenter types 800 |
| 2 | Setback too small | Setback **3** | **"Size it up", red under Side and rear setback (ft)** | "New ADUs need at least 4 ft from the side and rear property lines. Yours is 3 ft." then "Allowed: 4 ft or more." | Cal. Gov. Code § 66323(a)(2) [S5] | Presenter types 4 |
| 3 | ADU taller than the house | ADU height **17**, house **16** | **"Size it up", red under ADU height (ft)** | "Your ADU can be at most 16 ft: no taller than your house (16 ft) and never over 25 ft. Yours is 17 ft. Lower the design." then "Allowed: up to 16 ft (no taller than your 16 ft house, never over 25 ft)." An amber "Height" note (above the 16 ft the state guarantees) also shows; it doesn't block | "Cal. Gov. Code § 66321(b)(4)(D) (25 ft cap; 'no taller than the house' is AutoADU's simplified rule)" [S6] | Presenter types 16 |

**Team step** (form-completeness checks in `step-checks.ts`, not engine rules): the designer's name, office address, city, state, ZIP, email and phone are required, and so is the "licensed architect?" answer and "Who will build it?". Until they're filled, a red note shows under the designer fields: "Add whoever drew your plans. The city requires the plan preparer's name and contact on every plan sheet, so plan check will expect it." (source: the city's Requirements for Submittal for Residential Additions and New Construction). Picking **Not chosen yet** shows a blue note: "You can submit for plan check without a contractor. Before the city issues your permit, you'll need to add a licensed contractor (with license number and a CiViC account email) or sign up as an owner-builder." The contractor boxes on the form stay blank, and the final page shows a short **"Before your permit is issued"** list (add a contractor or sign the Owner-Builder Acknowledgement; CiViC account). Not blockers.

**After the live fixes** (800 sq ft, 4 ft, 16 ft): the same as `fixedAnswers`, except Coastal Zone is "not sure" (no lookup). Results headline "Qualifies for the fast path"; green banner **"Ready to submit"**, "No rule problems found. Review your forms, then file them with the city."; **"Forms completed"** lists two forms: the building permit worksheet and the Owner's Affidavit (Coastal Development Permit), because the Coastal Zone couldn't be confirmed. The results page has **no Back button**: the only way on is **Review and submit**, and any change is made on the review screen with its **Change** buttons.

| Step | Click / type | Screen shows | Presenter says |
|---|---|---|---|
| 1 | On the **AutoADU** landing screen, click **Get started**. On "Where's your property?" (step 1 of 6), type the address, click **Find my property**, then **Continue by hand** (leave zoning and APN blank) | Amber "We couldn't find that address …" and the amber Coastal Zone note; zoning and APN fields (optional) | (while typing) "Here's a homeowner's application, with the mistakes a plan checker sends back. The address is made up, so the city's map can't find it; for a real one, AutoADU reads the zoning and Coastal Zone from the map." |
| 2 | Click **A single-family house** ("What's on the lot now?"), then **Detached ADU** ("Choose your ADU type") | Each pick moves to the next step | (no line; keep clicking) |
| 3 | "Size it up": type Size **900**, ADU height **17**, house height **16**, setback **3**. Point at the red notes | Red under **Size (sq ft)**, **ADU height (ft)** and **Side and rear setback (ft)**: the rule, "Allowed: …", and a "Source:" link. **Continue** is disabled: "Fix the values marked in red to continue." | (while typing) "Nine hundred square feet, seventeen feet tall next to a sixteen-foot house, three feet from the property line. Normally a plan checker finds that weeks later. AutoADU stops it here, and each error links its source." |
| 4 | Select the Size value and type **800**; the setback value, type **4**; the ADU height value, type **16** | Each red note disappears as it's fixed; **Continue** turns on | "Fix it right here: eight hundred, four feet, sixteen feet." |
| 5 | **Continue**; "Personal information": type **Sam**, **Sample**, **sam.sample@example.com**, click **Same as project address**, **Continue**; "Your team and budget": type the designer (Dana Designer, email, phone, office address), click **Yes** (licensed architect) and **Not chosen yet**, then **Fill my forms** | Owner step's Continue turns on once name and email are in; on the team step the red designer note disappears once all seven fields are in, and **Not chosen yet** shows the blue "You can submit for plan check without a contractor…" note | (while typing the designer) "Paperwork counts too: the city wants whoever drew the plans on every sheet, so AutoADU asks for it now." |
| 6 | (results page loads) Point at the banner and **"Forms completed"** | Headline "Qualifies for the fast path"; green **"Ready to submit"**; "Forms completed": the building permit worksheet and the CDP owner's affidavit; "Not legal advice. Rules checked on 2026-11-07." No Back button | "Ready to submit, and the city's forms are already filled in." |
| 7 | Click **Review and submit**; scroll past the value list to the embedded form | "Check what we filled in": every value on each form, each with **Change** or "Set by AutoADU"; below it, the filled PDF | "Before anything leaves, the homeowner checks every value, and can change any of them here. This is Newport's real building permit form, already filled in." |
| 8 | Tick **I checked these and they're correct.**, click **Finish and download** | "Your package is complete": a **"Waiting for approval"** card (address, ADU type, size, date) and right under it, **"Preview of upcoming filing. AutoADU doesn't send forms to the city yet — download your package and file it at the Permit Center or through CiViC."**; then the **PDF** and **How to file (summary)** downloads and "Forms completed" previews | "In the full product, we file with the city for you. Today it's a preview, as the note says: they download the package and file it themselves. We don't just explain the rules; we fill out the city's forms, and one review cycle is the goal." |

Presenter notes:
- **Prepare the typing.** Before the pitch, either save the sample owner (Sam Sample, 123 Example Lane, Newport Beach, CA 92663, sam.sample@example.com, (555) 010-0123) in the browser's autofill (address and contact fields support it), or have the values on a sticky note. With autofill, step 5 is one click per field; without it, type only the three required values (first name, last name, email) and click **Same as project address** for the mailing address.
- **Steps 3–4 are live typing on purpose.** Click into the field, select all, type the number. The house-height field starts empty, so it shows a red "Enter the main house's height" note until you type 16. If a field misbehaves, retype it; there is no shortcut button. Fallback: the story still shows the catch from step 3, and the backup screenshots cover the rest.
- **Speak while typing** (steps 1, 3 and 5). The timing below assumes it.
- **Team step typing** (step 5): the designer's seven fields have no browser autofill (it would fill the owner's details instead), so type them from the sticky note. Click **Yes** and **Not chosen yet**; don't pick "Licensed contractor" (four more required fields).
- **No Back on the results page.** Don't look for it: go on with **Review and submit**; changes happen on the review screen.
- **Keep the preview note on screen in step 8 and don't say the package was filed.** AutoADU does not send anything to the city; the "Waiting for approval" card shows what the full product will do.
- The PDF shows inline only at laptop width; at phone width it's a **View the filled form (PDF)** button. Present from a laptop. If the browser won't embed PDFs, use **Open in a new tab** above the preview.
- Don't click **Download everything** (the browser may ask permission for several downloads). No download is needed: the filled form is already on screen.
- Don't read the valuation aloud. It is the app's $300/sq ft estimate (labeled "Estimate" on the review screen), not a city figure.
- "No taller than the house" is **our simplified rule**, labeled as such in the app's source line; the state's number is the 25 ft cap. Don't call the house rule state law.
- The deed-restriction conflict is **not shown in the app**. Use it only as a talking point or in Q&A (see "Why should we trust your data?"), with [S1], [S3] and [S4].
- If the app breaks, switch to backup screenshots (not made yet; see open items).

---

## 4. Competitor table

All sites accessed **2026-11-07**. "Vendor claim" = what the company says about itself; we did not test any product.

| Product | Who it serves | What it does (from its own site) | How AutoADU differs | Source |
|---|---|---|---|---|
| **Blitz AI** | **Local governments** ("AI Compliance Infrastructure for Local Governments"; "built specifically for cities, counties, and government departments") | Two products: **AI Plan Review** for city staff and **AI Pre-Check**, which a city deploys as a portal for applicants to upload plan sets and get a report of "missing sheets, missing details and compliance errors". Says it keeps "final authority with your plan reviewers." Pre-Check page does not mention ADUs or California. | The city has to buy it, and it reads finished plan sets. AutoADU works for the applicant before plans are final, on Newport's rules, and points out where city pages conflict with state law. | [S10], [S11] |
| **Blitz AI in Corona, CA** (a real deployment) | Applicants in Corona | Free, voluntary "Prescreen Review"; lists "Single Family ADU" as a project type. City says: "This prescreen review is not a plan check and does not evaluate code compliance," and calls the software "in an introductory development and testing phase." | Corona's prescreen checks completeness only. AutoADU checks the design against written standards (size, setbacks, height, Coastal Zone) with citations. | [S12] |
| **Symbium** (and Symbium Build) | Contractors, high-volume installers and building departments (Symbium); California homeowners checking ADU eligibility (Symbium Build) | "Instant permitting" with compliance checks "as a permit applicant is scoping out a project"; "Available in select jurisdictions." Symbium Build: "Learn instantly if you can have an ADU on your property." | Symbium Build answers "can I have an ADU?". AutoADU answers "will my application come back?": forms, fixes and the city-vs-state conflicts for Newport. Whether Symbium covers Newport Beach: **not verified**. | [S13], [S14] |
| **CrossBeam** | California ADU contractors who received a corrections letter | AI agent that reads a corrections letter and plans and drafts a response with code citations. | Works **after** the corrections letter; AutoADU works **before** submission, to avoid the letter. Looks like an early-stage or prototype site; company status **not verified**. | [S16] |
| **Status quo: city resources** | Newport applicants | Optional meeting with city staff, pre-approved plans, OC ADU cost calculator | Free and official, but the applicant still has to put the rules together and spot conflicts. AutoADU puts them in one checklist. | [S1], [S9b]; OC ADU calculator site **would not load**, not verified |

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
Every rule cites the city or state source and the date we checked it, and we label our own simplifications (for example, "no taller than the house" is marked as AutoADU's rule; the state's number is the 25 ft cap). We also track where official sources disagree. Example: Newport's ADU permit page lists a signed, notarized deed restriction for every ADU [S1], but the city's 2026 rules summary requires one only for junior ADUs [S3], and the state housing department told Newport that "Deed restrictions are not authorized under state law for ADUs" [S4]. The pass/fail logic is plain code anyone can read.

**"Why doesn't the AI decide?"**
Approval is ministerial: it depends on written, objective rules, so a fixed rule is the right tool for pass/fail, and it gives the same answer every time. AI is useful for asking questions in plain language and explaining a flag, not for making the decision.

**"What's the business model?"** *(answer is a proposal, not validated)*
Free for homeowners in early cities to build trust and data; paid seats for small builders and nonprofit developers who file many applications; later, a version cities can offer applicants. No pricing research done yet.

**"Which building permit form do you fill, and is it the current one?"**
We fill the "Worksheet for Combo Building & Solar Permit Application", the form the city's ADU permit page links as "Building Permit"; our copy is byte-identical to the city's live file as of November 7, 2026 [S17]. The Building Division's forms page also lists a newer "Building Permit Application" (file modified May 2025) [S18], and a teammate is confirming with the Permit Center which one ADU applicants should use. That's the problem in miniature: the city's own pages point to different forms, and an applicant has no way to know which one the counter expects. When the answer comes in, we update one form map and every user gets the right form.

**"Does AutoADU submit to the city?"**
Not yet. Newport takes ADU applications at the Permit Center or through CiViC. AutoADU fills the forms, the homeowner checks every value, clicks **Finish and download**, and gets the package with filing instructions; the homeowner signs and files it. The "Waiting for approval" card on the last page is a preview of filing for you, and the app says so right under it.

**"Which forms do you fill? Is that the whole application?"**
Two city forms today: the building permit worksheet, and for lots the city's map puts in the Coastal Zone (or when the lookup can't confirm it) the Coastal Development Permit owner's affidavit. That's not the whole package: the homeowner still brings plans, a grant deed and other documents, which the results page lists under "Still to gather". Other official forms some projects need (for example the plan check checklist or the Coastal Commission's own permit application) are next on our list; the app doesn't fill them yet.

**"Why stop the user instead of just warning them?"**
Only the red items block: they break a written rule (city size cap, state setback, the state's 25 ft height cap) or our labeled simplified rule that an ADU is no taller than the house, so the application would likely come back. Warnings, like a detached ADU above the 16 ft the state guarantees, don't block, because the city may still allow it; the user decides.

**"Does the homeowner need a contractor before applying?"**
No, not for plan check, as far as we can tell. California says the contractor's license statement (or an owner-builder exemption) is "a condition precedent to the issuance of a permit" (Bus. & Prof. Code § 7031.5), so it's due when the permit is issued, not when plans are submitted. Newport's 2025 Building Permit Application says "Licensed Contractors and Owner/Builders are required to have a Civic account in order to obtain a building permit," and its owner-builder form says "We will not issue a building permit until you have read, initialed … signed, and returned this form." So AutoADU lets the homeowner pick "Not chosen yet", leaves the contractor boxes blank, and lists what's due before issuance. No city page says outright that the contractor may be blank at plan check; that's our reading of the law and the form's required fields, so confirm it with the Permit Center. What *is* needed up front is whoever drew the plans: the city wants the preparer's name, address and phone on every sheet, and if that person isn't a licensed architect, a licensed engineer must stamp the plans.

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

**Draft 6 changes (app):** the owner step is now titled "Personal information" and has a **Same as project address** button that fills the owner's mailing address, city, state and ZIP (Newport Beach, CA by default; ZIP only if the address has one). The team step now requires the designer's name, office address, city, state, ZIP, email and phone, a "licensed architect?" answer (No makes the engineer's details required) and "Who will build it?" (Licensed contractor / Me (owner-builder) / Not chosen yet). The demo types a made-up licensed architect and picks "Not chosen yet". The final page and how-to-file text add a "Before your permit is issued" list for owner-builder and not-chosen-yet. Typing time re-estimated (Estimate); section 7 moved to Q&A to stay under 5 minutes. Sources in `docs/clear-it-newport.md` ("Designer, engineer and contractor: what's required when").

**Draft 5 changes (app):** no "Load demo application" or "Load fixed version" buttons (the presenter types the sample values; the lookup fails on the made-up address, so Coastal Zone is "not sure" and two forms are filled); no Back button on the results page (changes happen on the review screen); the team step can also take the designer's contact details and address and an engineer (optional; the demo leaves it blank). Implementation plan line shortened to fit the typing time.

**Draft 4 changes (app):** the Coastal Zone step is gone (the address lookup answers it; an amber note shows when it can't); a new blocking height check (`height-house`, ADU no taller than the house and never over 25 ft) replaces the old amber 17 ft warning as planted mistake 3; the results page shows "Ready to submit" with no warnings list, no deed conflict card and no "Permits you need" section; the forms section is "Forms completed"; the review button is **Finish and download** and leads to a "Waiting for approval" preview page with downloads. The deed-restriction conflict is now a talking point only.

**Now covered by the app on `main`, removed from this list:** PR #4 merged (demo application, demo buttons, status banners, review screen, Submit step); the missing "Fix:" line (the intake now shows an "Allowed: …" line under each red error); the live catch of planted mistakes during intake; the filled form shown inside the app (review and submit screens).

**Still open:**
1. **Not rehearsed in a browser; not timed.** This script was checked against the code only. Do one full run-through with a stopwatch (the typing time is an Estimate), check the typed values in steps 1, 3–5 and the inline PDF, and fix any label that differs → `pitch-storyline` + presenter.
2. **Backup screenshots** of each demo step: the three red errors on "Size it up", "Ready to submit", the review screen with the embedded PDF, and the "Waiting for approval" page with its preview note → whoever rehearses.
3. **"No taller than the house" is AutoADU's simplified rule**, not a quoted state or city rule (the cited § 66321(b)(4)(D) gives the 25 ft cap for attached ADUs). The app labels it in the source line. Confirm with the team that it's the rule they want blocking → `project-context`.
4. **Which building permit form ADU applicants should use** (worksheet doc 15043, linked from the ADU site, vs. the May 2025 "Building Permit Application", doc 3258). `docs/project-context.md` marks it resolved (worksheet is current); the Q&A answer still says a teammate is confirming. Reconcile once confirmed → `project-context`.
5. **No package-completeness checks** (missing documents, plan-set items, coastal sequencing). All planted mistakes are design-standard issues → `rules-checks`.
6. **The demo fills two city forms.** The made-up address isn't on the city's map, so Coastal Zone stays "not sure" and the app fills the CDP owner's affidavit as well as the building permit worksheet. Say "the city's forms", not "one form" → no action unless the team wants a real lookup in the demo (needs a real address, against the sample-data rule).
7. **The results page no longer lists permits or departments** ("Permits you need" was removed as redundant with "Forms completed"; the how-to-file text sheet still lists permits). The pitch doesn't claim departments → `project-context`.
8. **No AI features built.** The pitch claims none; keep it that way unless they ship.
9. **Next-step forms research is not on `main`.** If the team wants to name those forms with sources, merge `docs/forms/newport-beach/additional-forms.md` → main session.
