# Newport Beach ADU forms

Every form and handout an applicant needs for an ADU in Newport Beach, downloaded from the city on **November 7, 2026**. The city can update these at any time, so each one lists its source URL. Re-download before relying on a copy.

Background research: [../../clear-it-newport.md](../../clear-it-newport.md).

## Forms to fill out and submit (`submit/`)

| File | What it is | Who needs it | Fillable? | Source |
|---|---|---|---|---|
| [building-permit-application-worksheet.pdf](submit/building-permit-application-worksheet.pdf) | **Worksheet for Combo Building & Solar Permit Application.** The main form: project address, description of work, square feet, valuation, owner, applicant, designer, engineer, contractor, setbacks, use zone. "Plan check fees due at time of submittal" | **Every ADU** | Yes, 71 fields | [city](https://www.newportbeachca.gov/home/showpublisheddocument/15043/635682493202100000) |
| [plan-submittal-requirements.pdf](submit/plan-submittal-requirements.pdf) | **Requirements for Submittal for Residential Additions and New Construction** (dated 9-2014). Checklist of what the plans must show: site plan, elevations, floor plans, survey, foundation, energy, fire, and planning calculations. Asks for 4 sets of blueprints. The date is old, so confirm the set count | **Every ADU** (it's a checklist for the plans) | No | [city](https://www.newportbeachca.gov/home/showpublisheddocument/3225/636089393638270000) |
| [coastal-development-permit-requirements.pdf](submit/coastal-development-permit-requirements.pdf) | **Coastal Development Permit** handout (rev. 10/03/23, 14 pages). Who reviews CDPs, the required findings, and the application requirements. **Says CDP applications are uploaded to the [CiViC online portal](https://www.newportbeachca.gov/civic)** | Only lots in the Coastal Zone | No | [city](https://www.newportbeachca.gov/home/showpublisheddocument/51985/637805210162500000) |
| [owners-affidavit-discretionary-application.pdf](submit/owners-affidavit-discretionary-application.pdf) | **Discretionary Application Owner's Affidavit.** Item 1 of the CDP application: check the permits requested (incl. Coastal Development Permit) and the owner signs | Only lots in the Coastal Zone | Yes, 47 fields | [city](https://www.newportbeachca.gov/home/showpublisheddocument/71896/638239938311670000) (linked from the CDP handout) |

### Also required, not downloadable

| Item | Where to get it |
|---|---|
| **Grant deed** | Your own records, or the Orange County Clerk-Recorder. Proves ownership and gives the legal description |
| **ADU / JADU housing questionnaire** (blank) | "Provided by the city." Only an example is online (below) |
| **Deed restriction** (blank) | "Provided by the city." The city's 2026 ordinance summary says only **JADUs** need one, but the permit page lists it for every ADU. See the research doc |
| **Plans** | Drawn by a designer, or one of the city's [pre-approved plans](https://www.newportbeachadu.org/design) fitted to your lot |

## Examples (`examples/`)

Filled-in samples. Both say they're "for example purposes only" and that the city will give you the real form.

| File | What it is | Source |
|---|---|---|
| [adu-jadu-questionnaire-EXAMPLE.pdf](examples/adu-jadu-questionnaire-EXAMPLE.pdf) | Example housing questionnaire (1 page) | [city ADU site](https://www.newportbeachadu.org/s/ADU-JADU-Questionnaire-EXAMPLE.pdf) |
| [adu-deed-restriction-EXAMPLE.pdf](examples/adu-deed-restriction-EXAMPLE.pdf) | Example deed restriction (5 pages) | [city ADU site](https://www.newportbeachadu.org/s/ADU-Deed-restriction-EXAMPLE.pdf) |

## Reference (`reference/`)

| File | What it is | Source |
|---|---|---|
| [adu-ordinance-summary-matrix-2026.pdf](reference/adu-ordinance-summary-matrix-2026.pdf) | **The city's current ADU rules on 3 pages.** Our main source for sizes, heights, setbacks, parking, owner occupancy and deed restrictions | [city ADU site](https://www.newportbeachadu.org/s/ADU-Ordinance-Summary-Matrix-2026.pdf) |
| [hcd-findings-letter-2024-10-01.pdf](reference/hcd-findings-letter-2024-10-01.pdf) | The state's 13 findings against Newport's 2023 ADU ordinance | [HCD](https://www.hcd.ca.gov/sites/default/files/docs/policy-and-research/ordinance-review-letters/newport-beach-adu-findings-100124.pdf) |
| [adu-guidebook-exercises-2025-10-31.pdf](reference/adu-guidebook-exercises-2025-10-31.pdf) | The city's planning worksheet for homeowners (12 pages, 117 fillable fields). Good inspiration for our interview questions | [city ADU site](https://www.newportbeachadu.org/s/Newport-Beach-ADU-Guidebook-Exercises-REVISED-10-31-2025.pdf) |
| [utilities-memo-adus.pdf](reference/utilities-memo-adus.pdf) | Utilities Department memo on when an ADU can share water and sewer service | [city ADU site](https://www.newportbeachadu.org/s/UtilitiesMemoregardingADUs.pdf) |

## Fillable field lists (`fields/`)

`fields/*.json` lists the form fields in the two fillable PDFs (name, type, page), for pre-filling forms from the interview answers later. The PDF field names are generic (for example `F[0].P1[0].TextField1[3]`), so each one still needs to be matched to its label on the form before it can be filled automatically.

## How these fit together

1. **Every ADU:** building permit application worksheet + plans that follow the plan submittal requirements + grant deed + housing questionnaire (+ deed restriction, if the city still asks).
2. **Coastal Zone lots, first:** a Coastal Development Permit, uploaded to CiViC with the Owner's Affidavit, a project description, and the other items in the CDP handout.
3. **Submit** the building permit package at the Permit Center (City Hall, 100 Civic Center Drive, 1st floor, Bay C). The city's ADU site says online submittal through CiViC "may soon" be possible.
