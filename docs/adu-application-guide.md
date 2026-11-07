# Newport Beach ADU application guide (what to submit, and what the app can fill in)

Prepared by the rules-checks agent on **November 7, 2026**. It covers what a Newport Beach ADU or JADU applicant must submit and fill out, and the smallest set of questions our intake must ask so the app can fill in the rest.

- **Sources:** `docs/clear-it-newport.md`, `docs/forms/newport-beach/` (all PDFs and `fields/*.json`), `src/lib/adu/*`, and live city pages checked on the date above. Each requirement has its source URL and the exact quoted text, or starts with **"Assumption:"** and gives the reason.
- **Field names** come from `docs/forms/newport-beach/fields/*.json`. To match each field to its printed label, I read the field tooltips (`/TU`) and positions from the PDFs with `pypdf`. The worksheet has a tooltip on every field. The affidavit has none, so its fields were matched by position on the page (see section 3.2).
- This is not legal advice. Confirm with the Planning Division, (949) 644-3204.

> **Most important finding: the building permit form may be out of date.** The ADU permit page links the 2015-era "Worksheet for Combo Building & Solar Permit Application" (`showpublisheddocument/15043/...`). That is the form in our repo and in `fields/`. The Building Division's forms page now lists a different **"Combo Building Permit Application"** (`showpublisheddocument/3258/638824129709970000`, file modified May 6, 2025). The 2025 form has different fields: it adds "Contractor's Civic Account Email", "PR #" and required-field stars, and it drops the hazard checkboxes. See section 6. **Before building autofill on the old worksheet, the team should decide which form to target.** The field map in section 3.1 is for the old worksheet, the only one in the repo.

---

## 1. Application package outline

Who-needs-it key: **All** = every ADU and JADU; **New** = attached or detached; **CZ** = lots in the Coastal Zone; **JADU** = junior ADU only.

### 1.0 Where and how you submit (applies to the whole package)

| Topic | What the sources say | Source |
|---|---|---|
| Ministerial review | "Ministerial review of all ADUs and JADUs will occur through building permit plan check. A Coastal Development Permit may also be required for properties within the Coastal Zone. Please consult with a planner prior to submitting and ADU/JADU project." | [ADU Ordinance Summary Matrix 2026](https://www.newportbeachadu.org/s/ADU-Ordinance-Summary-Matrix-2026.pdf) |
| One package | "ADU and JADU projects require plan check and a Building Permit." "All materials are submitted together at the Permit Center." "Your team will prepare a combined application package with the required documents for plan check and a Building Permit." | [newportbeachadu.org/permit](https://www.newportbeachadu.org/permit) |
| In person or online? **(conflict)** | Permit page: "Your application materials will be submitted in person at the Permit Center." "But you may soon be able to submit them via the City's new City Virtual Connect (CiViC) portal". The standard plans page says to "Submit the plans in person at the Permit Center", or apply through the CiViC portal (page wording as summarized by WebFetch). The Building Division's online permitting page offers online plan check for "Residential-Addition / Alteration" and "Residential-New Construction" ([online permitting](https://www.newportbeachca.gov/government/departments/community-development/building-division/online-permitting-ipermit)). That page lists no ADU-specific online application. | [permit](https://www.newportbeachadu.org/permit), [adu-plans-2](https://www.newportbeachadu.org/adu-plans-2) |
| CiViC account | 2025 Building Permit Application: "Note: Licensed Contractors and Owner/Builders are required to have a Civic account in order to obtain a building permit. Register now at newportbeachca.gov/civic" | [Combo Building Permit Application (2025)](https://www.newportbeachca.gov/home/showpublisheddocument/3258/638824129709970000) |
| Online file format (if submitting through CiViC) | "Files must be in PDF format, not password protected, printed landscape, and to scale." "Upload complete construction plans as a single combined file in PDF format (Architectural, Structural, Civil, Energy, etc…)" "Book mark the PDF plan by discipline and types of plan." "Upload supporting documents (Structural calculations, energy reports, geotechnical reports, ect…) as separate individual PDF files." "File names shall not include special characters (no period or comma for example) other than numbers, letters, or underscores, to fill in spaces." | [Online Plan Review Submittal Guidelines](https://www.newportbeachca.gov/home/showpublisheddocument/73546/638248464382730000) (file dated July 2023) |
| Address of the counter | Research doc and city: "Permit Center at 100 Civic Center Drive, 1st Floor, Bay C" ([Guidebook Exercises p. 5](https://www.newportbeachadu.org/s/Newport-Beach-ADU-Guidebook-Exercises-REVISED-10-31-2025.pdf)). The Nov 2025 Plan Check Submittal Checklist header reads "3300 Newport Boulevard". See open questions. | as linked |

### 1.1 Document table

| # | Document | What it is | Who needs it | Format | When due | Source and exact quote |
|---|---|---|---|---|---|---|
| D1 | **Building permit application** (repo: "Worksheet for Combo Building & Solar Permit Application"; current city form: "Building Permit Application") | Main form: address, description, square feet, valuation, owner, applicant, designer, engineer, contractor | All | Fillable PDF (71 fields in the old worksheet; about 60 widgets in the 2025 form). The old worksheet has **no signature line**. 1 copy (Assumption: a single application form; no copy count found). | At submittal, with the plan check fee: "NOTE: PLAN CHECK FEES DUE AT TIME OF SUBMITTAL" | [Old worksheet](https://www.newportbeachca.gov/home/showpublisheddocument/15043/635682493202100000), linked from [permit page](https://www.newportbeachadu.org/permit) as "Building Permit". [2025 form](https://www.newportbeachca.gov/home/showpublisheddocument/3258/638824129709970000): "NOTE: PLAN CHECK FEES ARE DUE AT TIME OF SUBMITTAL" |
| D2 | **Plan set** (drawings) | Site plan, floor plans, elevations, roof plan, foundation and structural plans, energy, and more. Checklist in section 2 | All | Drawn by a professional, or a city standard plan fitted to the lot. **Paper:** "Four sets of identical blueprints" (2014 PDF). **Online:** one combined, bookmarked PDF (guidelines above). | At submittal | [Requirements for Submittal for Residential Additions and New Construction (9-2014)](https://www.newportbeachca.gov/home/showpublisheddocument/3225/636089393638270000): "Four sets of identical blueprints, with the following information:" |
| D3 | **Structural calculations** | Engineer's calculations for new structure | New (Assumption: conversions only when structural work is added) | Separate PDF online | At submittal | [Plan Check Submittal Checklist (Nov 2025)](https://www.newportbeachca.gov/home/showpublisheddocument/77633/638987109458170000): "Structural Plans and supporting calculations" (new construction); "Structural Plans and calculations for addition areas" (additions) |
| D4 | **Energy analysis (Title 24, CF-1R)** | State energy code compliance | All new conditioned space (Assumption: also conversions of unconditioned garages) | Separate PDF online | At submittal | Checklist (Nov 2025): "Energy analysis (CF-1R Form)"; "Energy analysis for additions (CF-1R Form)". 2014 PDF: "Conformance with State Energy Law". Standard plans page: "Some additional supplemental materials will be required such as a site plan, Title 24 (energy code) analysis" |
| D5 | **Mechanical, Electrical, and Plumbing Questionnaire for Plan Review Waiver** (+ MEP plans if the waiver is denied) | City questionnaire | All (listed under both new construction and additions) | City form. **Not in our repo; not downloaded.** | At submittal | Checklist (Nov 2025): "Mechanical, Electrical, and Plumbing Questionnaire for Plan Review Waiver"; "Mechanical, Electrical, and/or Plumbing Plans (if required by waiver)" |
| D6 | **Topographic survey** | Survey by a licensed surveyor | New construction and major remodels | Stamped by a California licensed surveyor | At submittal | 2014 PDF: "For major remodels or new construction, complete topographic survey stamped by a California licensed surveyor". Checklist (Nov 2025) lists "Topographic Survey" under new construction |
| D7 | **Boundary survey** | Survey of property lines | Only if construction is within 1 ft of a setback line | "wet-stamped and signed by a California licensed surveyor" | At submittal | 2014 PDF, Planning item 6: "For projects with construction within 1 foot of setback line, complete boundary survey wet-stamped and signed by a California licensed surveyor" |
| D8 | **Geotechnical (soils) report** | Soils investigation | New construction; additions "when required by City Policy CBC 1803.5" | Separate PDF online | At submittal | Checklist (Nov 2025): "Geotechnical Report" (new construction); "Soils Report when required by City Policy CBC 1803.5" (additions) |
| D9 | **Grant deed** | Proves ownership and gives the legal description | All | The owner's recorded deed (copy). The app can't fill it in | At submittal | [Permit page](https://www.newportbeachadu.org/permit): "A grant deed to verify ownership and legal description of the property." |
| D10 | **ADU / JADU Housing Questionnaire** | 1-page survey: owner, address, size, bedrooms, rent, reason, which unit owner lives in | All | **City-provided** blank ("you'll be provided with an updated blank copy"). Has a **signature**, printed name and date line. Example says: "Please scan and email completed questionnaire to me at: (Insert Email)" | Permit page lists it with the package. The example's email line suggests it may be sent to a planner separately (Assumption) | [Permit page](https://www.newportbeachadu.org/permit): "A Housing Questionnaire with basic details about your ADU plus a projection of any rent you'll be collecting." [Example](https://www.newportbeachadu.org/s/ADU-JADU-Questionnaire-EXAMPLE.pdf): "NOTE: THIS DOCUMENT IS FOR EXAMPLE PURPOSES ONLY. YOU WILL BE PROVIDED WITH AN UPDATED VERSION TO FILL OUT AND SUBMIT." |
| D11 | **Deed restriction** | Recorded covenant on the property | **JADU: required (state law and city).** **ADU: conflict** (see 1.2) | **City-provided** template ("you'll be provided with a blank template"). **Signed and notarized** ("Owner(s) must sign in the presence of notary public"), with Exhibit A legal description, then **recorded**. | **Conflict:** the permit page lists it with the package. The matrix says "Prior to issuance of building permit, owner must record deed restriction (prepared by the City)". So it is due **before issuance**, not at submittal | [Permit page](https://www.newportbeachadu.org/permit): "A deed restriction, signed and notarized, stating:" "The ADU won't be sold as a separate property" / "The ADU won't be used as a short-term rental (such as AirBnB)" / "If building a JADU, the property owner will live on the property." [Example](https://www.newportbeachadu.org/s/ADU-Deed-restriction-EXAMPLE.pdf) |
| D12 | **Fire sprinkler cut sheets / calculations** | Sprinkler data | Only if sprinklers are required (matrix: "Only required if fire sprinklers required and provided on primary unit.") | "Two copies" | At submittal | 2014 PDF, Fire item 2: "Two copies of sprinkler cut sheets/calculations if applicable" |
| D13 | **Fuel modification plan** | Fire brush-clearance plan | Only in a Special Fire Protection Area | Drawn plan | At submittal | 2014 PDF, Fire item 1: "Fuel modification plan, if in Special Fire Protection Area" |
| D14 | **Roof truss calculations** | Truss engineering | Standard-plan users (and anyone using trusses; Assumption) | Separate PDF | At submittal | [adu-plans-2](https://www.newportbeachadu.org/adu-plans-2): roof truss calculations are listed as a supplemental item (from the WebFetch summary, not a verbatim quote). Building Engineer: 949.644.3265 |
| D15 | **Owner Builder Verification Form** | City acknowledgement for owner-builders | Only if the owner is the builder (Assumption: that's what the title implies; not opened) | City form | Assumption: before permit issuance | [Building forms page](https://www.newportbeachca.gov/government/departments/community-development/building-division/forms-handouts) lists "Owner Builder Verification Form" ([PDF](https://www.newportbeachca.gov/home/showpublisheddocument/3204/638624191827970000)). **Not verified as ADU-specific.** |
| D16 | **Plan check fee** (payment, not a document) | $850–$1,700 | All | Payment | At submittal | [Permit page](https://www.newportbeachadu.org/permit): "Plan Check fees are due at submission and range from $850 to $1,700" |
| D17 | **Building permit fee + other fees** (payment) | $850–$2,100, plus school, traffic and utility fees | All | Payment | At issuance | Permit page: "Building Permit fees are due when your permit is issued"; "School District fees apply to ADUs over 500 SF"; "Traffic Fairshare and Transportation Corridor Fees apply to ADUs over 750 SF" |
| **Coastal Zone only (CDP package, uploaded to CiViC)** | | | | | | |
| C1 | **Discretionary Application Owner's Affidavit** | Item 1 of the CDP application: permits requested, address/APN, project description, owner certification under penalty of perjury | CZ | Fillable PDF (47 fields). **Signature lines are not form fields**, so it must be signed by hand or e-signed (Assumption: a scanned signature, since it's uploaded). No notary for a CDP ("the owner(s)' signature for Parcel/Tract Map and Lot Line Adjustment Application must be notarized" applies only to those). Agent may sign with written authorization | Before the building permit ("may first need to apply for and receive") | [CDP handout](https://www.newportbeachca.gov/home/showpublisheddocument/51985/637805210162500000): "Application requirements uploaded to the CiViC online portal: 1. A completed Discretionary Application Owner's Affidavit." [Affidavit](https://www.newportbeachca.gov/home/showpublisheddocument/71896/638239938311670000): "*May be signed by the lessee or by an authorized agent if written authorization from the owner of the record is filed concurrently with the application." |
| C2 | **CDP project description** | Written statement of the project | CZ | Text document (the app can draft it) | With the CDP application | CDP handout: "A written statement describing the proposed project in detail. Include secondary improvements such as demolition, grading, roads, driveways, outbuildings, fences, etc. Identify project details such as building gross square footage, grading cut/fill, unit count, bedroom count, parking count, building height, landscape area, and number of floors." |
| C3 | **CDP Notice of Application Filing** (posted on site) | Sign posted at the property | CZ | **City-provided**: "Applicant given original CDP Notice of Filing to post on site". Staff help fill it in | After filing | CDP handout p. 2: "The applicant is responsible for posting a notice of filing that an application for a coastal development permit has been submitted to the City." "City staff will assist in completing the notice of filing form (see attached) and provide instruction on the number of notices to be posted and their location(s)." |
| C4 | **CDP plans** | Site plan, floor plans, cross sections, elevations, roof plan, demolition plan, preliminary grading/drainage, erosion control | CZ | "one (1) full size set of plans for initial review" | With the CDP application | CDP handout p. 2: "Coastal development permit applications must be accompanied by one (1) full size set of plans for initial review, unless additional sets are required in conjunction with another discretionary review." |
| C5 | **CDP supplemental studies** | Depends on the site (list below) | CZ, some sites | Reports by qualified professionals | With the CDP application | CDP handout p. 2: "Include applicable studies and materials ... for the property as indicated in the attached table." |
| C6 | **CDP filing fee** | Payment | CZ | "The Planning Division will advise you of said fee." (no amount published) | At filing | CDP handout p. 2: "A filing fee is required at the time of filing" |

**CDP supplemental studies (C5), from the CDP handout pp. 3–7 (rev. 09-05-2023). Each item is required only when its trigger applies:**
- **Preliminary Construction Pollution Prevention Plan (CPPP).** Required for "Construction activities that include clearing, grading, or other activities that involve ground disturbance; building, reconstructing, or demolishing a structure; and creation or replacement of impervious surfaces". This likely covers most new CZ ADUs (Assumption: from the wording).
- **WQHP/WQMP.** Within 200 ft of coastal waters with 2,500+ sq ft of impervious area, or more than 75% impervious within 200 ft, or hillside triggers.
- **Housing Crisis Act demolition certification.** "Any housing development project involving the demolition of residential units."
- **Bulkhead Conditions Report.** "All properties with a bulkhead on-site".
- **Coastal Hazards Report.** Shoreline properties subject to erosion, flooding or wave run-up.
- **Geologic Stability Report.** Bluff (B) or canyon (C) overlay; shoreline liquefaction areas.
- **Post Development Erosion Control Plan.** Within 100 ft of a bluff or canyon overlay.
- **Landscape Planting Plan.** Near a dune, beach, bluff, ESHA or wetland, or "500 square feet or more of new landscaping".
- **Waiver of Future Protection.** Where a natural landform or shoreline protection study is required.
- **Less common:** archaeological/paleontological plan, affordable-housing conversion, historic evaluation, resource survey, lower-cost visitor accommodations, visual impact analysis.
- Handout: "Please speak with a planner to confirm which studies may be required for your proposed development." Page 14 of the local PDF couldn't be read (an image; probably the sample CPPP plan).

### 1.2 Conflicts and items that appear to exceed state law

| # | Conflict | Texts | State law |
|---|---|---|---|
| X1 | **Deed restriction for non-JADU ADUs.** The permit page lists it for every application; the 2026 matrix says N/A for ADUs | Permit page: "A deed restriction, signed and notarized, stating:" (no ADU-type limit). Matrix (Deed Restriction row): JADU = "Prior to issuance of building permit, owner must record deed restriction (prepared by the City) ... Additional restrictions required in the Coastal zone."; ADU columns = "N/A". | The [HCD letter (Oct 1, 2024)](https://www.hcd.ca.gov/sites/default/files/docs/policy-and-research/ordinance-review-letters/newport-beach-adu-findings-100124.pdf), finding 13: "Deed restrictions are not authorized under state law for ADUs. The City may not require a deed restriction prior to and as a condition of approval of an ADU building permit application." (citing Gov. Code §§ 66315, 66333(c)). **A deed restriction for an ADU appears to exceed state law.** |
| X2 | **Deed restriction timing.** Permit page: part of the submittal package. Matrix: before issuance | as above | Not a state-law issue. Tell the user it's due before issuance, and that it needs the permit and Zoning Clearance numbers, which the example leaves blank ("Zoning Clearance No. XXXX-XX, and Permit No. XXX-XXX-XX") |
| X3 | **Content of the deed restriction example appears to go beyond state law even for JADUs** | The example adds "No Revisions", "Primary Dwelling", "No Short-Term Rentals", "No Changes Without Authority" (incl. "no additional stoves, sinks, lavatories, water closets ... may be added to the Property, without first obtaining the prior written consent"), and "Right of Inspection". It also bans separate sale for "ADU/JADU": "The ADU /JADU may not be sold separately from the primary residence." | HCD (finding 13) describes § 66333(c) JADU deed restrictions as "limited to restricting the sale of the JADU separate from the single-family residence". Matrix footnote 8 allows separate sale of ADUs under § 66341. **Appears to exceed** for the extra covenants. Not verified against the statute text, because leginfo returned HTTP 403. The example is labeled "FOR EXAMPLE PURPOSES ONLY" and is dated 2022, so the current template may differ. |
| X4 | **Old code citation.** The deed restriction example cites "Government Code 65852.22" (renumbered to §§ 66333–66339) | Example ¶ 6: "within the meaning of Government Code 65852.22" | Flag per project rules. No other repo document cites § 65852.2 or § 65852.22, apart from the HCD letter's renumbering table. The matrix uses §§ 66323 and 66341 (current). |
| X5 | **Outdated building permit form linked from the ADU site** | The permit page links "Building Permit" to `.../15043/635682493202100000` (old worksheet). The forms page lists "Combo Building Permit Application" at `.../3258/638824129709970000` (modified 2025) | Not a state-law issue; a correction risk (wrong form) |
| X6 | **Plan copies: 4 vs 1 vs PDF** | 2014 PDF: "Four sets of identical blueprints". CDP handout: "one (1) full size set of plans for initial review". Online guidelines: "a single combined file in PDF format" | Not a state-law issue. Confirm the current count for in-person building submittal. |
| X7 | **In person vs online** | Permit page: "submitted in person". Online permitting page: Residential-Addition/Alteration and New Construction can be applied for online | Confirm which channel ADUs use |
| X8 | **JADU garage conversion replacement parking** | Matrix, Garage/Carport Conversion row: JADU column "Allowed; Replacement parking required citywide" | Research doc: § 66314(d)(11) (no replacement parking); HCD finding 10. **Appears to exceed** (already in `newport-beach.ts`) |
| X9 | **Utilities memo date** | Matrix: "(See Utilities Director 1/9/21 Memorandum for single water and sewer service allowances)". Memo header: "Date: September 9, 2021" | Not a legal issue; the date in the matrix looks like a typo |
| X10 | **Stamp requirement wording** | Design page: "if you're not using a licensed architect to design your ADU, your plans will need to be stamped" "by a licensed engineer." Exercises PDF: "If you do not use a licensed architect, your plans will need to be stamped by a licensed engineer." | Not checked against state licensing law. Pass it on as-is |

---

## 2. Plan-set requirements (checklist)

Main source: [Requirements for Submittal for Residential Additions and New Construction](https://www.newportbeachca.gov/home/showpublisheddocument/3225/636089393638270000), footer "9-2014" (**12 years old**). The [Plan Check Submittal Checklist](https://www.newportbeachca.gov/home/showpublisheddocument/77633/638987109458170000) (file dated Nov 13, 2025) and the [Online Plan Review Submittal Guidelines](https://www.newportbeachca.gov/home/showpublisheddocument/73546/638248464382730000) (2023) are newer and add items. The "Possibly outdated?" column flags old items.

| # | Item (exact text from the 2014 PDF unless noted) | Applies to | Possibly outdated? |
|---|---|---|---|
| **General** | | | |
| G1 | "Address of project" | All | |
| G2 | "Name, address, phone number of individual who prepared plans on each sheet" | All | Online guidelines also want the "Preparer's name, address, phone number and license number" on the title sheet |
| G3 | "Site plan showing size of property, property lines and dimensions, all buildings on the lot, property lines, front/rear/side yard setbacks (required, existing and proposed), sidewalks, easements, and projections into setbacks, such as eaves, stairs, fireplace, etc." | All | |
| G4 | "Elevation of all sides, or of sides where changes are proposed" | All | |
| G5 | "For major remodels or new construction, complete topographic survey stamped by a California licensed surveyor including elevations, bearings, distances, dimensions, monuments, lot corners, etc." | New; major remodels | |
| G6 | "Fully dimensioned floor plans showing uses of all rooms including garages, and all doors and windows" | All | |
| **Building** | | | |
| B1 | "Foundation plans showing the foundation, framing, plans and sections" | New (Assumption: conversions only if new foundation/framing) | |
| B2 | "Conformance with State Energy Law" | All | 2025 checklist: "Energy analysis (CF-1R Form)" |
| B3 | "For soil report requirements, see City of Newport Beach Policy for Geotechnical Investigation CBC 1803.5" | Per policy | The link in the PDF uses an old URL format (`Modules/ShowDocument.aspx?documentid=18172`) |
| **Fire** | | | |
| F1 | "Fuel modification plan, if in Special Fire Protection Area" | Fire areas | The forms page also lists a "New Hazardous Fire Area Designation" bulletin (2012) |
| F2 | "Two copies of sprinkler cut sheets/calculations if applicable" | Only if the main house is sprinklered | Paper-era "two copies" |
| **Planning** | | | |
| P1 | "Existing and proposed number of units" | All | |
| P2 | "Buildable area of the site per NBMC 20.03.030, and calculations" | All | Code section not checked against the current code |
| P3 | "Maximum allowable, existing, and total proposed floor area. If the project is within 10% of the maximum allowable floor area, a tissue overlay showing area dimensions and calculations must be submitted" | All | "Tissue overlay" is a paper-era practice. ADUs have an 800 sq ft guarantee and a basement exception (matrix) |
| P4 | "Open space required and provided (if applicable)" | If applicable | |
| P5 | "Lot coverage (if applicable)" | If applicable | |
| P6 | "For projects with construction within 1 foot of setback line, complete boundary survey wet-stamped and signed by a California licensed surveyor" | Near setback | Wet stamp vs online PDF upload: unclear |
| P7 | "Parking spaces required and provided" | All (show the waiver if none; matrix lists 5 waivers) | |
| P8 | "Roof plan showing property lines; worst case natural grade point below -- and elevation of -- roof ridges, midpoints and flat elements (deck finished floor heights, deck rail heights, top of roof top equipment, etc.)..." | New (height check) | |
| P9 | "List of any current discretionary approvals received for the project (i.e., Use Permit, Development Plan Review, Coastal Development Permit, etc.)" | CZ: list the CDP | |
| P10 | "Any construction permitted by a Modification Permit labeled and clouded, and Modification Permit Approval Letter incorporate into the drawings." | Rare | |
| **Public Works** ("with appropriate dimensions and spatial relationships to the project") | | | |
| W1 | "Street or alley centerlines and R/W lines" | All | |
| W2 | "Adjacent curb, sidewalk, and street trees" | All | |
| W3 | "Street improvements such as catch basins, fire hydrants, vaults, pullboxes, vents, streetlights" | All | |
| W4 | "Landscaping when adjacent to driveways, roadways, and alleys" | If applicable | |
| W5 | "Adjacent improvements that may affect design including driveways, entry walkways, and sidewalks" | All | |
| **Added by the 2025 checklist / 2023 online guidelines (not in the 2014 PDF)** | | | |
| N1 | "Grading Plans showing the following: property lines and dimensions, all buildings on the lot, front/rear/side yard setbacks, grading cuts and fills, hardscape, and drainage" (new construction) | New detached (Assumption: an ADU counts as "new construction") | |
| N2 | "Mechanical, Electrical, and Plumbing Questionnaire for Plan Review Waiver" | All | |
| N3 | Title sheet with "Complete Sheet Index", "Project description for the complete scope of work", "Occupancy Group(s) per Building Code", "Type of construction per Building Code (Note if building is Fire Sprinklered)", "Owner's name, address and phone number", "Vicinity map" (online guidelines) | All online submittals | |
| N4 | "C - Survey and Topographical plan prepared by a State Licensed Land Surveyor or authorized Civil Engineer" and "City Drainage and Grading plans shall not be used as the site plan." (online guidelines) | New | |
| N5 | Utilities: an ADU may share the house's water meter and sewer lateral, but "ADU's may be required to upsize their water service and/or water meter to meet flow and permit requirements" ([Utilities memo, Sept 9, 2021](https://www.newportbeachadu.org/s/UtilitiesMemoregardingADUs.pdf)) | All | Assumption: plans should show the utility connection so Public Works can check sizing |
| N6 | Standard (pre-approved) plans: "Complete the project information on the ADU Standard Plans". Supplemental items still required: "site plan, Title 24 (energy code) analysis" and roof truss calcs ([adu-plans-2](https://www.newportbeachadu.org/adu-plans-2)) | Standard-plan users | The standard plans are fillable PDFs (`Newport_Beach_ADU_Standard_Plan_1..5_Fillable_Web.pdf`). **Not downloaded or mapped**; a likely next autofill target |

Unclear for ADU conversions: which items (B1, G5, N1) the city waives for an interior or garage conversion. Assumption: the 2025 checklist's "ADDITIONS OR ALTERATIONS" list applies to conversions.

---

## 3. Field-by-field maps

Source categories: **USER** (ask in intake), **DERIVED** (computed), **LOOKUP** (address-based), **CONSTANT**, **PRO** (designer, engineer or contractor), **N/A** (not applicable). ⚠ = meaning unclear.

### 3.1 Worksheet for Combo Building & Solar Permit Application (71 fields)

File: `docs/forms/newport-beach/submit/building-permit-application-worksheet.pdf`. Labels come from each field's tooltip (`/TU`). Checkboxes use the export value `/1`.

| Field | Label (tooltip) | Plain English | Source | How |
|---|---|---|---|---|
| `F[0].P1[0].CheckBox2[0]` | Comm'l | Commercial project | CONSTANT | Unchecked |
| `F[0].P1[0].CheckBox3[0]` | Residential | Residential project | CONSTANT | Checked |
| `F[0].P1[0].CheckBox1[0]` | Building | Building permit included | CONSTANT | Checked |
| `F[0].P1[0].CheckBox1[1]` | Grading | Grading work included | DERIVED | Check if cut or fill > 0 (from PRO). Assumption: usually unchecked for conversions |
| `F[0].P1[0].CheckBox1[2]` | Drainage | Drainage work included | PRO ⚠ | Designer decides; not defined on the form |
| `F[0].P1[0].CheckBox1[3]` | Elec | Electrical work included | DERIVED | Assumption: checked for every ADU/JADU, since each needs a kitchen (matrix) and new circuits |
| `F[0].P1[0].CheckBox1[4]` | Mech | Mechanical work included | DERIVED | Assumption: checked (kitchen "outside exhaust" per matrix; HVAC) |
| `F[0].P1[0].CheckBox1[5]` | Plum | Plumbing work included | DERIVED | Assumption: checked (sink required in every type per matrix) |
| `F[0].P1[0].TextField4[0]` | Cu Yd Cut | Cubic yards of soil removed | PRO | From grading plan; 0 for interior conversions (Assumption) |
| `F[0].P1[0].TextField4[1]` | Cu Yd Fill | Cubic yards of soil added | PRO | as above |
| `F[0].P1[0].CheckBox4[0]` | Flood | Lot in a flood hazard area ⚠ | LOOKUP | Assumption: city GIS parcel report ([Address Search Tool](https://nbgis.newportbeachca.gov/gispub/PublicAddressSearch/default.aspx)). Not confirmed that the report shows hazard zones |
| `F[0].P1[0].CheckBox5[0]` | Fire | Lot in a fire hazard area ⚠ | LOOKUP | as above (relates to the "Special Fire Protection Area" in the plan requirements) |
| `F[0].P1[0].CheckBox6[0]` | Liq | Lot in a liquefaction zone ⚠ | LOOKUP | as above |
| `F[0].P1[0].CheckBox7[0]` | Landslide | Lot in a landslide zone ⚠ | LOOKUP | as above |
| `F[0].P1[0].CheckBox8[0]` | N/A | None of the hazard boxes apply | DERIVED | Checked if Flood, Fire, Liq and Landslide are all unchecked |
| `F[0].P1[0].TextField1[0]` | Floor | Floor number (commercial suites) | N/A | Leave blank |
| `F[0].P1[0].TextField1[1]` | Suite No | Suite number | N/A | Leave blank |
| `F[0].P1[0].TextField1[2]` | Project Address (Not mailing address) | Site street address | USER | `address`, normalized against the GIS tool. Assumption: add "ADU" or the unit address if the city assigns one |
| `F[0].P1[0].TextField2[0]` | Description of Work | Scope of work in one or two lines | DERIVED | Template, e.g. "Construct new {sqft} sq ft detached ADU, {bedrooms} bedroom(s)" / "Convert {sqft} sq ft of existing garage to ADU" / "Convert {sqft} sq ft within existing house to JADU" (from `aduType`, `squareFeet`, `bedrooms`, `convertingGarage`) |
| `F[0].P1[0].TextField1[3]` | Use | Building use / occupancy group ⚠ | PRO | Assumption: an R-3 occupancy group for a dwelling (the online guidelines ask for "Occupancy Group(s) per Building Code" on the title sheet). Don't autofill without confirming |
| `F[0].P1[0].TextField5[0]` | Const Type | Construction type (e.g. V-B) | PRO | From plans ("Type of construction per Building Code", online guidelines) |
| `F[0].P1[0].NumericField4[0]` | # Stories | Number of stories ⚠ (of the ADU or the whole building?) | USER | New field `stories`. For JADU or internal conversions, the existing building's stories (Assumption) |
| `F[0].P1[0].NumericField2[0]` | # Units (if Res) | Number of dwelling units ⚠ (new units, or total on the lot?) | DERIVED | Assumption: 1 (the new ADU). Plan requirement P1 asks for "Existing and proposed number of units" |
| `F[0].P1[0].TextField3[0]` | Valuation $ Material/Labor (tooltip: "Do Not Enter $") | Construction cost, materials plus labor ⚠ | USER | New field `valuationUsd`. Tooltip probably means "don't type the $ sign". The permit page says fees are "based on valuation for conversions and floor area for new construction". The city may recompute from its valuation tables ([Fee Schedules and Building Valuation Tables](https://www.newportbeachca.gov/government/departments/community-development/fee-schedules), not opened) |
| `F[0].P1[0].NumericField6[0]` | New/Add SF | New floor area added | DERIVED | `squareFeet` if attached/detached; for a converted accessory building, only the added area (up to the 150 sq ft allowance); else 0. Needs the new split field |
| `F[0].P1[0].NumericField5[0]` | Remodel SF | Existing floor area being remodeled | DERIVED | `squareFeet` if converted or JADU inside existing space; else 0 |
| `F[0].P1[0].NumericField7[0]` | Garage/New/Add | New garage area ⚠ | DERIVED | 0, unless a replacement garage is built (CZ garage conversions). Unclear whether converted garage area goes here or in Remodel SF |
| `F[0].P1[0].TextField1[38]` | Owner Last | Owner last name | USER | `owners[0].lastName` (new) |
| `F[0].P1[0].TextField1[39]` | Owner First | Owner first name | USER | `owners[0].firstName` (new) |
| `F[0].P1[0].TextField1[40]` | Owner's Address | Owner mailing street | DERIVED | Project address, unless the user gives a different mailing address |
| `F[0].P1[0].TextField1[41]` | Owner's E-mail Address | Owner email | USER | new `ownerEmail` |
| `F[0].P1[0].TextField1[42]` | City (owner) | | DERIVED | from mailing address |
| `F[0].P1[0].TextField1[43]` | State (owner) | | DERIVED | from mailing address |
| `F[0].P1[0].TextField1[44]` | Zip (owner) | | DERIVED | from mailing address |
| `F[0].P1[0].TextField1[45]` | Telephone (owner) | Owner phone | USER | new `ownerPhone` |
| `F[0].P1[0].TextField1[4]` | Applicant Last | Person applying | DERIVED | = owner if `applicantIsOwner`; else ask |
| `F[0].P1[0].TextField1[5]` | Applicant First | | DERIVED | same |
| `F[0].P1[0].TextField1[10]` | Applicant's Address | | DERIVED | same |
| `F[0].P1[0].TextField1[11]` | Applicant's E-mail Address | | DERIVED | same |
| `F[0].P1[0].TextField1[6]` | City (applicant) | | DERIVED | same |
| `F[0].P1[0].TextField1[7]` | State (applicant) | | DERIVED | same |
| `F[0].P1[0].TextField1[8]` | Zip (applicant) | | DERIVED | same |
| `F[0].P1[0].TextField1[9]` | Telephone (applicant) | | DERIVED | same |
| `F[0].P1[0].TextField1[19]` | Architect/Designer Last | Plan preparer | PRO | |
| `F[0].P1[0].TextField1[18]` | Architect/Designer First | | PRO | |
| `F[0].P1[0].TextField1[20]` | Architect/Designer Lic. No. | Architect license no. (blank if an unlicensed designer) | PRO | |
| `F[0].P1[0].TextField1[17]` | Architect/Designer's Address | | PRO | |
| `F[0].P1[0].TextField1[16]` | Architect/Designer's E-mail Address | | PRO | |
| `F[0].P1[0].TextField1[12]` | City (designer) | | PRO | |
| `F[0].P1[0].TextField1[13]` | State (designer) | | PRO | |
| `F[0].P1[0].TextField1[14]` | Zip (designer) | | PRO | |
| `F[0].P1[0].TextField1[15]` | Telephone (designer) | | PRO | |
| `F[0].P1[0].TextField1[28]` | Engineer Last | Structural engineer | PRO | Needed when there's no licensed architect (stamp rule, X10) |
| `F[0].P1[0].TextField1[27]` | Engineer First | | PRO | |
| `F[0].P1[0].TextField1[46]` | Engineer Lic. No. | | PRO | Tooltip "Lic. No.", positioned on the engineer row |
| `F[0].P1[0].TextField1[25]` | Engineer's Address | | PRO | |
| `F[0].P1[0].TextField1[26]` | Engineer's E-mail Address | | PRO | |
| `F[0].P1[0].TextField1[24]` | City (engineer) | | PRO | |
| `F[0].P1[0].TextField1[23]` | State (engineer) | | PRO | |
| `F[0].P1[0].TextField1[22]` | Zip (engineer) | | PRO | |
| `F[0].P1[0].TextField1[21]` | Telephone (engineer) | | PRO | |
| `F[0].P1[0].TextField1[36]` | (tooltip "TextField1") Contractor's Name/Company | Contractor company | PRO | Blank or "Owner-Builder" if no contractor ⚠ (Assumption) |
| `F[0].P1[0].TextField1[35]` | Contractor Lic. No. | CSLB license number | PRO | |
| `F[0].P1[0].TextField1[37]` | Class | CSLB license class (e.g. B) | PRO | |
| `F[0].P1[0].TextField1[33]` | Contractor's Address | | PRO | |
| `F[0].P1[0].TextField1[34]` | Contractor's E-mail Address | | PRO | 2025 form instead asks for "Contractor's Civic Account Email" |
| `F[0].P1[0].TextField1[32]` | City (contractor) | | PRO | |
| `F[0].P1[0].TextField1[31]` | State (contractor) | | PRO | |
| `F[0].P1[0].TextField1[30]` | Zip (contractor) | | PRO | |
| `F[0].P1[0].TextField1[29]` | Telephone (contractor) | | PRO | |
| `F[0].P1[0].PrintButton1[0]` | Print Form | Print button | N/A | Not a data field |

**Not fillable on this form:** "SETBACKS REAR / LEFT / FRONT / RIGHT", "USE ZONE", "DEVELOPMENT NO", "PERMIT NO.", "PLAN CHECK NO." and "PLAN CHECK FEES $" are printed lines with **no form field**. Assumption: city staff fill these in. The app should not draw on them. Setbacks and use zone are LOOKUP data we can still show the user.

**Counts (71):** USER 7 · DERIVED 22 · LOOKUP 4 · CONSTANT 3 · PRO 32 · N/A 3. ⚠ unclear: 9 (Drainage, the 4 hazard boxes, Use, # Stories, # Units, Valuation, Garage/New/Add; contractor-name owner-builder handling).

### 3.2 Discretionary Application Owner's Affidavit (47 fields; Coastal Zone only)

File: `docs/forms/newport-beach/submit/owners-affidavit-discretionary-application.pdf` (Rev 06/30/23). The fields have **no tooltips**, so each checkbox was matched to the printed label at the same position on the page. Checkboxes export `/Yes_mtfh` when checked and `/Off` when not.

**Fields the app fills (10):**

| Field | Label | Plain English | Source | How |
|---|---|---|---|---|
| `checkbox_48bjzn` | Coastal Development Permit | Applying for a CDP | DERIVED | Checked when the lot is in the Coastal Zone (that's why this form is in the package) |
| `checkbox_38urfb` | Zoning Clearance – | Applying for a zoning clearance ⚠ | DERIVED ⚠ | Assumption: check it. The city's questionnaire and deed restriction examples both reference a "Zoning Clearance No." for ADUs, which suggests ADUs get one. **Confirm with Planning before autofilling** |
| `checkbox_19dtiu` | (Zoning Clearance) ADU | Zoning clearance is for an ADU ⚠ | DERIVED ⚠ | Same as above |
| `text_43ueah` | 2. Project Address(es)/Assessor's Parcel No(s) | Site address and APN | LOOKUP | `address` + APN from the [Address Search Tool](https://nbgis.newportbeachca.gov/gispub/PublicAddressSearch/default.aspx) parcel report (the Guidebook Exercises p. 4 says the tool gives the "Assessor's Parcel Number (APN)") |
| `textarea_41jrte` | 3. Project Description and Justification | What you're building and why it meets the rules | DERIVED | Draft from the answers, covering the items the CDP handout lists: "building gross square footage, grading cut/fill, unit count, bedroom count, parking count, building height, landscape area, and number of floors". Grading and landscape numbers come from the designer |
| `text_42pvay` | 4. Property Owner's Affidavit: (I) (We) [name box] | Names of all owners | DERIVED | Join `owners[]` names as on the grant deed |
| `text_44gidb` | Title (1st signature) | Signer's role | DERIVED | "Owner", or "Trustee" etc. (new `ownershipType`), or "Authorized Agent" (then written owner authorization is needed) |
| `text_46pmcr` | Date (1st), MM/DD/YEAR | Date signed | DERIVED | Signing date. Leave blank if the user will print and sign by hand |
| `text_45dcme` | Title (2nd signature) | Second signer's role | DERIVED | Only if there's a second owner |
| `text_47fexy` | Date (2nd) | Second signer's date | DERIVED | Only if there's a second owner |

**Checkboxes that don't apply to an ADU-only CDP (37, leave unchecked):**

| Field | Label | Note |
|---|---|---|
| `checkbox_1xepg` | Approval-in-Concept – AIC # | ⚠ Assumption: N/A. Might apply where the Coastal Commission, not the city, issues the CDP (CDP handout item 2, "tidelands, submerged lands, and public trust lands"). Confirm |
| `checkbox_3crkv` | Waiver for De Minimis Development | ⚠ Assumption: N/A unless staff says the ADU qualifies |
| `checkbox_4rzlo` | Coastal Residential Development | ⚠ Assumption: N/A (the name suggests a separate permit type) |
| `checkbox_5hhdm` | Condominium Conversion | |
| `checkbox_6iila` | Comprehensive Sign Program | |
| `checkbox_7rusi` | Development Agreement | |
| `checkbox_8kvin` | Development Plan | |
| `checkbox_9nxhm` | Lot Line Adjustment | |
| `checkbox_21rbqh` | Lot Merger | |
| `checkbox_22zqsp` | Limited Term Permit | |
| `checkbox_10ypm` | (Limited Term) Seasonal | |
| `checkbox_11lknj` | (Limited Term) < 90 day | |
| `checkbox_12qfov` | (Limited Term) > 90 days | |
| `checkbox_23cyga` | Modification Permit | |
| `checkbox_24mlzu` | Off-Site Parking Agreement | |
| `checkbox_25ewhd` | Planned Community Development Plan | |
| `checkbox_26uyvx` | Planned Development Permit | |
| `checkbox_27csue` | Site Development Review | |
| `checkbox_13qsbx` | (Site Development Review) Major | |
| `checkbox_14mtzu` | (Site Development Review) Minor | |
| `checkbox_28ezua` | Parcel Map | |
| `checkbox_29lfyz` | Staff Approval | |
| `checkbox_30jspv` | Tract Map | |
| `checkbox_31wsnw` | Traffic Study | |
| `checkbox_32awtl` | Use Permit | |
| `checkbox_33ydob` | (Use Permit) Minor | |
| `checkbox_34lagn` | (Use Permit) Conditional | |
| `checkbox_35puml` | Amendment to existing Use Permit | |
| `checkbox_36cjbe` | Variance | Note: a variance would take the project off the ministerial path |
| `checkbox_37fmpp` | Amendment – | |
| `checkbox_15acry` | (Amendment) Code | |
| `checkbox_16imqz` | (Amendment) PC | |
| `checkbox_17kccb` | (Amendment) GP | |
| `checkbox_18covd` | (Amendment) LCP | |
| `checkbox_20ilbt` | (Zoning Clearance) Use | |
| `checkbox_39zfjo` | Residential Project Using Senate Bill 6 | |
| `checkbox_40fxoi` | Other: | No text field next to "Other:" on the form |

**Not fillable on this form:** both "Signature(s): ____" lines. They are printed lines, not fields, so the owner signs by hand or e-signature. The Levine Act disclosure ("any contribution in an amount of more than two hundred fifty dollars ($250) made within the preceding 12 months ... to any elected or appointed officer of the City") is a notice, not a field. Show it to the user.

**Counts (47):** DERIVED 9 · LOOKUP 1 · N/A 37 · USER 0 · CONSTANT 0 · PRO 0. ⚠ unclear: 5 (Zoning Clearance, ADU, AIC, De Minimis waiver, Coastal Residential Development).

### 3.3 Other forms (not fillable PDFs; for reference)

- **Housing Questionnaire (city-provided; fields from the example):**
  1. Property Owner Name: DERIVED (owners)
  2. Property Address: USER (`address`)
  3. size "square feet": `squareFeet`; "bedrooms": `bedrooms`
  4. "current monthly rent, or if not occupied, the anticipated monthly rent": USER (new); "Utilities included? Yes No": USER (new)
  5. "primary reason": USER (new enum: "Rental / Supplemental Income", "Permanent housing for senior relatives", "Permanent housing for non-senior relatives", "Permanent housing for caretakers", "Permanent housing for household employee", "Guest housing for visitors", "Other")
  6. "Which unit do you intend to live in?": USER (new enum: "Main house", "Accessory Dwelling Unit", "Junior Accessory Dwelling Unit", "None")
  7. Signature, Print Name, Date: user signs

  Everything below "For Official Use Only" is for city staff.
- **Deed restriction (city-provided; fields from the example):**
  - DERIVED: owner names; recording "mail to" address (owner mailing address); "Address"; ADU size; ADU or JADU choice (from `aduType`)
  - LOOKUP: "Assessor's Parcel Number"
  - From the grant deed (USER upload/OCR, or LOOKUP): "Short Legal Description" and Exhibit A full legal description
  - City-assigned (not autofillable): "Zoning Clearance No." and "Permit No."
  - Notary acknowledgment
- **CDP Notice of Application Filing:** PROPOSED PROJECT (DERIVED from the description), LOCATION (`address`), APPLICANT (DERIVED). APPLICATION NO. and the posting date come after filing. City-provided original.

---

## 4. Minimum user inputs

Assumption: the professional-only fields (designer, engineer and contractor details; construction type; cut/fill) are collected with one "add your designer/contractor" step, or left for the professional, rather than asked of the homeowner.

### 4.1 Questions to ask (19)

**Property (4)**

| # | Question (plain English) | Why | Fills | In `AduAnswers`? |
|---|---|---|---|---|
| 1 | "What's the property address?" | Every form; GIS lookup key | Worksheet `TextField1[2]`; affidavit `text_43ueah`; questionnaire Q2; deed restriction; CDP notice | **Yes** (`address`) |
| 2 | "What's on the lot today?" (house / building a house too / apartments / empty) | Eligibility; # units | Worksheet `NumericField2[0]` (with ADU count) | **Yes** (`lotType`) |
| 3 | "Who owns the property? List every owner exactly as on your grant deed." (and: person or trust) | Owner fields, affidavit name box and title, questionnaire, deed restriction | Worksheet `TextField1[38]`, `[39]`; affidavit `text_42pvay`, `text_44gidb`, `text_45dcme`; questionnaire Q1 | **No** |
| 4 | "Is your mailing address the same as the property? If not, what is it?" | Owner address block, deed restriction "mail to" | Worksheet `TextField1[40]`, `[42]`–`[44]` | **No** |

**Project (8)**

| # | Question | Why | Fills | In `AduAnswers`? |
|---|---|---|---|---|
| 5 | "What kind of ADU?" (converted / attached / detached / JADU) | Description, square-foot split, deed restriction | `TextField2[0]`, `NumericField5[0]`, `NumericField6[0]`; affidavit `textarea_41jrte` | **Yes** (`aduType`) |
| 6 | "Are you converting a garage?" | Description; CZ replacement parking; demolition permit | `TextField2[0]`, `NumericField7[0]` | **Yes** (`convertingGarage`) |
| 7 | "How big is the ADU (sq ft)? If converting, how much is new space vs existing space?" | SF fields, fees, questionnaire, deed restriction | `NumericField5[0]`, `NumericField6[0]`; questionnaire Q3 | **Partly** (`squareFeet`; no new-vs-converted split) |
| 8 | "How many bedrooms?" | Size limit, description, questionnaire | `TextField2[0]`; questionnaire Q3; CDP description | **Yes** (`bedrooms`) |
| 9 | "How many stories?" | Worksheet; CDP description "number of floors" | `NumericField4[0]`; `textarea_41jrte` | **No** |
| 10 | "How tall, and how close to the side/rear property line?" (new construction) | Height/setback checks; CDP description | `textarea_41jrte` | **Yes** (`heightFeet`, `sideRearSetbackFeet`) |
| 11 | "Are you using one of the city's pre-approved plans?" | Which supplemental items apply (site plan, Title 24, truss calcs) | Package list | **Yes** (`usingPreapprovedPlan`) |
| 12 | "Roughly what will construction cost (materials + labor)?" | Valuation; plan check fee for conversions | `TextField3[0]` | **No** |

**People (4)**

| # | Question | Why | Fills | In `AduAnswers`? |
|---|---|---|---|---|
| 13 | "Owner's email and phone?" | Worksheet contact | `TextField1[41]`, `[45]` | **No** |
| 14 | "Are you (the owner) the one applying? If not, applicant's name, address, email, phone." | Applicant block; authorized agent on the affidavit | `TextField1[4]`–`[11]`; affidavit title | **No** |
| 15 | "Who will build it: a licensed contractor, or you as owner-builder?" | Contractor block; Owner Builder Verification Form; CiViC account note | `TextField1[29]`–`[37]` | **No** |
| 16 | "Which unit will you live in?" (main house / ADU / JADU / none) | JADU owner occupancy; questionnaire Q6 | Questionnaire Q6; JADU check | **Partly** (`ownerLivesOnSite` is a boolean) |

**Housing questionnaire (2)**

| # | Question | Why | Fills | In `AduAnswers`? |
|---|---|---|---|---|
| 17 | "Expected monthly rent, and are utilities included?" | Questionnaire Q4 | Questionnaire | **No** |
| 18 | "Main reason for building?" | Questionnaire Q5 | Questionnaire | **No** |

**Plans (1)**

| # | Question | Why | Fills | In `AduAnswers`? |
|---|---|---|---|---|
| 19 | "Who's drawing your plans? Add your designer's and engineer's contact details (or invite them)." | Designer and engineer blocks; preparer info required on each plan sheet (G2) | `TextField1[12]`–`[28]`, `[46]` | **No** |

**Lookups instead of questions** (confirm with the user, don't ask):
- Coastal Zone: `coastalZone` exists today as a question; it could come from the GIS tool
- APN, zoning district, base-zone setbacks
- Hazard flags (Flood/Fire/Liq/Landslide; Assumption that GIS shows them)
- Transit proximity: `nearTransit` exists; Assumption that it could be computed

### 4.2 What the app can't autofill (tell the user)

| Item | What to tell the user |
|---|---|
| **Signatures**: affidavit (CZ), housing questionnaire | "Sign here by hand (or e-sign if the city accepts it). We've filled in everything else." The affidavit can be signed by an agent only "if written authorization from the owner of the record is filed concurrently". |
| **Notarized deed restriction** (JADU; ADU disputed) | "The city gives you this form. You sign it in front of a notary, and it's recorded before your permit is issued. For a regular ADU, the city's 2026 rules summary and the state say it isn't required. Ask the city before recording one." |
| **Grant deed** | "Upload a copy of your recorded grant deed. If you don't have it, request one from the Orange County Clerk-Recorder." (Research doc; recorder process not verified.) |
| **Plan set and engineering** (architectural, structural, Title 24 CF-1R, surveys, soils report, grading) | "A designer, architect or engineer must prepare these. If you don't use a licensed architect, an engineer must stamp them. Give your designer section 2 of this guide." |
| **City-provided forms**: questionnaire, deed restriction template, CDP Notice of Filing, MEP plan-review waiver questionnaire | "Ask the Permit Center or your planner for the current blank. We'll show you what to write in each box." |
| **CDP supplemental studies** (CZ) | "Your planner decides which studies your site needs. Common for ADUs: a construction pollution prevention plan." |
| **CiViC account** | "Your contractor (or you, if owner-builder) needs a CiViC account before the permit can be issued." |
| **City-assigned numbers** (permit no., plan check no., zoning clearance no., development no.) | Leave blank. The city fills these in. |

---

## 5. Contract change requests (for `src/lib/adu/types.ts`, owner: teammate)

Not changed here. Proposed additions to `AduAnswers`:

| Field | Type | Why |
|---|---|---|
| `owners` | `{ firstName: string; lastName: string }[]` | Owner name fields, affidavit name box, questionnaire, deed restriction |
| `ownershipType` | `"individual" \| "trust" \| "company"` | Signer title on the affidavit |
| `ownerEmail`, `ownerPhone` | `string` | Worksheet owner contact |
| `ownerMailingAddress` | `{ street: string; city: string; state: string; zip: string } \| null` (null = same as property) | Worksheet owner address; deed restriction "mail to" |
| `applicantIsOwner` | `boolean` | Copy the owner block or ask |
| `applicant` | `Contact \| null` | Applicant block when not the owner |
| `builder` | `"contractor" \| "owner-builder" \| "unknown"` | Contractor block; owner-builder form |
| `professionals` | `{ designer?: Contact & { license?: string }; engineer?: ...; contractor?: ... & { license?: string; licenseClass?: string } }` | 27 PRO fields. Optional; the professional can fill them in |
| `newSquareFeet`, `convertedSquareFeet` | `number` | Worksheet New/Add SF vs Remodel SF (the 150 sq ft entry addition on accessory conversions) |
| `stories` | `number \| null` | Worksheet # Stories; CDP description |
| `valuationUsd` | `number \| null` | Worksheet valuation; plan check fee basis for conversions |
| `ownerResidence` | `"main" \| "adu" \| "jadu" \| "none"` | Questionnaire Q6; would replace or complement `ownerLivesOnSite` |
| `monthlyRentUsd`, `utilitiesIncluded` | `number \| null`, `boolean \| null` | Questionnaire Q4 |
| `primaryReason` | enum (7 questionnaire options + `"other"`) | Questionnaire Q5 |
| `parcel` (lookup result, could live outside `AduAnswers`) | `{ apn: string; zoning: string; coastalZone: boolean; hazards?: { flood: boolean; fire: boolean; liquefaction: boolean; landslide: boolean } }` | Affidavit APN, deed restriction APN, worksheet hazard boxes |

Also suggested: a **`DocumentItem.dueAt: "submittal" | "issuance" | "cdp"`** field, so the results page can say "bring at submittal" vs "before issuance" (the deed restriction timing conflict), plus a `DocumentItem.format` (fillable / city-provided / professional / notarized).

---

## 6. Open questions / unverified

1. **Which building permit form?** The ADU permit page links the old worksheet (doc 15043). The Building Division forms page lists a "Combo Building Permit Application" (doc 3258, file modified 2025-05-06) with about 60 widgets (`Text7`…`Text65`, `Check Box 1…14`, `Project…`, `Description…`). I **did not map** the 2025 form; it would need the same tooltip/position pass. Ask the Permit Center which one it accepts for ADUs.
2. **Deed restriction for non-JADU ADUs:** is it still requested at the counter? (Permit page vs matrix vs HCD.) Is the current template different from the 2022 example?
3. **In person vs CiViC** for ADU plan check, and the paper set count (2014: four sets) if in person.
4. **Zoning Clearance (ADU):** do ADU applicants file it, or does staff create it? Should the affidavit's "Zoning Clearance – ADU" box be checked on a CDP filing?
5. **Is a CDP actually required for every Coastal Zone ADU,** or are some exempt (CDP handout: "unless specifically exempted or excluded (see LCP Implementation Plan (IP) Section 21.52.035 and IP Section 21.52.040...)")? Neither section was read. State law on CDP hearings for ADUs (believed to be Gov. Code § 66329) is **not verified**, because leginfo returned HTTP 403.
6. **Permit Center address:** the Nov 2025 checklist header says "3300 Newport Boulevard". Other city documents say 100 Civic Center Drive, 1st Floor, Bay C. Possibly a stale template; confirm.
7. **Hazard boxes** (Flood/Fire/Liq/Landslide): does the GIS parcel report show these? Not checked.
8. **Worksheet meanings:** "Use", "# Stories", "# Units (if Res)", "Garage/New/Add" for a garage conversion, and the valuation tooltip "Do Not Enter $".
9. **MEP Plan Review Waiver questionnaire:** a city form not in the repo; not downloaded.
10. **Standard plan PDFs** (`Newport_Beach_ADU_Standard_Plan_1..5_Fillable_Web.pdf`) and their checklists (`ADUSTANDARDPLANCHECKLIST.pdf` redirects to Squarespace; not read). They are fillable and would be good autofill targets.
11. **CDP handout page 14** couldn't be read (image).
12. **Housing questionnaire timing:** submit with the package (permit page) or email it to a planner (example's "Please scan and email completed questionnaire to me at: (Insert Email)")?
13. Live pages fetched with WebFetch return a model summary. The quotes from `/permit`, `/get-started`, `/design` and `/adu-plans-2` are what it reported as verbatim; recheck them in a browser before quoting in the pitch. The PDF quotes (local files and downloaded city PDFs) were extracted directly and are exact.
