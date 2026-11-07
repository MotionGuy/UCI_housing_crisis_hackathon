// Turns interview answers into a fast-path verdict, a checklist, fees and next steps.
// This is guidance, not legal advice: every check carries its source.
import { CITY } from "./newport-beach";
import { HCD_NEWPORT_LETTER, STATE } from "./state-law";
import type { AduAnswers, AduResult, Check, DocumentItem, FeeItem } from "./types";

const TYPE_LABEL: Record<AduAnswers["aduType"], string> = {
  converted: "converted ADU",
  attached: "attached ADU",
  detached: "detached ADU",
  jadu: "junior ADU (JADU)",
};

export function evaluateAdu(a: AduAnswers): AduResult {
  const checks: Check[] = [];
  const isNew = a.aduType === "attached" || a.aduType === "detached";

  // ---- Out of scope ----
  if (a.lotType === "vacant") {
    return outOfScope(
      "An ADU needs a house on the lot",
      "An ADU is a second home on a lot that already has a house, or will have one. If you plan to build the house too, choose \"planned house\" and submit both together.",
    );
  }
  if (a.lotType === "multifamily") {
    return outOfScope(
      "Multifamily lots aren't covered yet",
      "State law also allows ADUs on lots with apartments or condos, but this version only checks single-family lots.",
    );
  }
  if (a.aduType === "jadu" && a.lotType !== "existing-single-family" && a.lotType !== "planned-single-family") {
    return outOfScope("A JADU must be inside a single-family home", "Choose a different ADU type.");
  }

  // ---- Size ----
  const cityMax = a.bedrooms >= 2 ? CITY.maxSize.twoPlusBed : CITY.maxSize.studioOrOneBed;
  if (a.aduType === "jadu") {
    checks.push(
      a.squareFeet <= STATE.jadu.maxSquareFeet
        ? pass("size", "Size", `${a.squareFeet} sq ft is within the 500 sq ft JADU limit.`, STATE.jadu.citation)
        : fail("size", "Size", `A JADU can be at most 500 sq ft. Yours is ${a.squareFeet} sq ft. Make it smaller, or apply as a converted ADU instead.`, STATE.jadu.citation),
    );
  } else if (a.aduType === "converted") {
    checks.push(
      info("size", "Size", "Converting existing space isn't limited by the city's size cap. State law also lets you add up to 150 sq ft for an entrance.", { label: "Cal. Gov. Code § 66323(a)(1)" }),
    );
  } else if (a.squareFeet <= cityMax) {
    checks.push(
      pass("size", "Size", `${a.squareFeet} sq ft is within Newport Beach's limit of ${cityMax.toLocaleString()} sq ft for ${a.bedrooms >= 2 ? "2+ bedrooms" : "a studio or 1 bedroom"}.`, CITY.code),
    );
  } else {
    checks.push(
      fail("size", "Size", `Newport Beach allows up to ${cityMax.toLocaleString()} sq ft for ${a.bedrooms >= 2 ? "2+ bedrooms" : "a studio or 1 bedroom"}. Yours is ${a.squareFeet} sq ft. A larger ADU may need a special permit and a public hearing, which is not the fast path.`, CITY.code),
    );
  }

  // ---- Setbacks and height (new construction) ----
  if (isNew) {
    const setback = a.sideRearSetbackFeet ?? 0;
    checks.push(
      setback >= STATE.guaranteedDetached.minSetbackFeet
        ? pass("setback", "Side and rear setbacks", `${setback} ft meets the 4 ft setback the city must accept.`, STATE.guaranteedDetached.citation)
        : fail("setback", "Side and rear setbacks", `New ADUs need at least 4 ft from the side and rear property lines. Yours is ${setback} ft.`, STATE.guaranteedDetached.citation),
    );

    const height = a.heightFeet ?? 0;
    const limit =
      a.aduType === "attached"
        ? STATE.height.attachedFeet
        : a.nearTransit === "yes"
          ? STATE.height.detachedNearTransitFeet
          : STATE.height.detachedFeet;
    const why =
      a.aduType === "attached"
        ? "For an attached ADU, the city must allow 25 ft or the main house's height limit, whichever is lower."
        : a.nearTransit === "yes"
          ? "Near major transit, the city must allow a detached ADU up to 18 ft, plus 2 ft to match the roof pitch."
          : "The city must allow a detached ADU up to 16 ft.";
    checks.push(
      height <= limit
        ? pass("height", "Height", `${height} ft is within the guaranteed height. ${why}`, STATE.height.citation)
        : warn("height", "Height", `${height} ft is above the ${limit} ft the state guarantees. ${why} Check Newport Beach's limit for your zone, or lower the design.`, STATE.height.citation),
    );
  }

  // ---- State-guaranteed detached ADU ----
  if (
    a.aduType === "detached" &&
    a.squareFeet <= STATE.guaranteedDetached.maxSquareFeet &&
    (a.sideRearSetbackFeet ?? 0) >= STATE.guaranteedDetached.minSetbackFeet &&
    (a.heightFeet ?? 0) <= (a.nearTransit === "yes" ? STATE.height.detachedNearTransitFeet : STATE.height.detachedFeet)
  ) {
    checks.push(
      pass("guaranteed", "State-guaranteed ADU", "At 800 sq ft or less with 4 ft setbacks, this detached ADU is one the city must approve, even if other zoning rules would say no.", STATE.guaranteedDetached.citation),
    );
  }

  // ---- Parking ----
  if (a.aduType === "jadu" || a.aduType === "converted") {
    checks.push(pass("parking", "Parking", "No new parking is required for an ADU or JADU made from existing space.", STATE.parking.exemptionsCitation));
  } else if (a.nearTransit === "yes") {
    checks.push(pass("parking", "Parking", "No parking is required within half a mile walking distance of public transit.", STATE.parking.exemptionsCitation));
  } else {
    checks.push(info("parking", "Parking", "The city can require at most 1 parking space. If you're within half a mile of a bus stop or other transit, none is required.", STATE.parking.exemptionsCitation));
  }
  if (a.convertingGarage) {
    checks.push(pass("garage", "Garage conversion", "You don't have to replace the garage parking you convert. This applies to JADUs too.", STATE.parking.garageConversionCitation));
  }

  // ---- Owner occupancy ----
  if (a.aduType === "jadu" && !a.ownerLivesOnSite) {
    checks.push(warn("owner", "Owner lives on site", "State JADU law has required the owner to live in the house or the JADU. A 2025 change may limit this to JADUs that share a bathroom. Confirm with the city.", STATE.jadu.citation));
  }

  // ---- Coastal Zone ----
  if (a.coastalZone === "yes") {
    checks.push(warn("coastal", "Coastal Zone", "You may need a Coastal Development Permit before the building permit. It can involve a hearing, so this part may not be fast.", CITY.permitPage));
  } else if (a.coastalZone === "unsure") {
    checks.push(warn("coastal", "Coastal Zone", "Check your address with the city's Address Search Tool. Much of Newport Beach is in the Coastal Zone, which can add a Coastal Development Permit.", { label: "Newport Beach Address Search Tool", url: CITY.addressTool }));
  }

  if (a.usingPreapprovedPlan) {
    checks.push(pass("plans", "Pre-approved plan", "City staff have already reviewed these plans, which can shorten plan check. They still have to be fitted to your lot.", { label: "Newport Beach pre-approved ADU plans", url: CITY.preapprovedPlans }));
  }

  // ---- Verdict ----
  const failed = checks.some((c) => c.status === "fail");
  const coastal = a.coastalZone === "yes";
  const verdict = failed ? "needs-changes" : "fast-path";
  const label = TYPE_LABEL[a.aduType];
  const headline = failed
    ? "Change the design to qualify for the fast path"
    : coastal
      ? "Qualifies for the fast path, after a Coastal Development Permit"
      : "Qualifies for the fast path";
  const summary = failed
    ? `As described, this ${label} doesn't meet every written rule. Fix the items marked in red and it can be approved without a hearing.`
    : `This ${label} meets the written rules, so Newport Beach must approve the building permit without a hearing. State law gives the city ${STATE.decisionDeadlineDays} days to decide once your application is complete.`;

  return {
    verdict,
    headline,
    summary,
    checks,
    permits: permitsFor(a),
    documents: documentsFor(a),
    fees: feesFor(a),
    steps: stepsFor(a),
    rights: rightsFor(a),
    checkedOn: CITY.checkedOn,
  };
}

function permitsFor(a: AduAnswers): string[] {
  const permits: string[] = [];
  if (a.coastalZone !== "no") {
    permits.push(a.coastalZone === "yes" ? "Coastal Development Permit (first)" : "Coastal Development Permit, if your lot is in the Coastal Zone");
  }
  permits.push("Building permit for the ADU (this is the ministerial approval)");
  if (a.convertingGarage) permits.push("Demolition permit for garage work, issued with the building permit");
  return permits;
}

function documentsFor(a: AduAnswers): DocumentItem[] {
  const d = CITY.documents;
  const docs: DocumentItem[] = [];
  if (a.coastalZone !== "no") docs.push(d.coastal, d.ownersAffidavit);
  docs.push(d.planCheck, d.buildingPermit, d.grantDeed, d.questionnaire);
  if (a.aduType === "jadu") {
    docs.push({ ...d.deedRestriction, why: "State law requires a deed restriction for JADUs, saying it won't be sold separately from the house." });
  } else {
    docs.push({
      ...d.deedRestriction,
      warning: "The city's 2026 ordinance summary says ADUs don't need a deed restriction (only JADUs do), and HCD says state law doesn't allow one for ADUs. The permit page still lists it, so ask the city before you record one.",
    });
  }
  return docs;
}

function feesFor(a: AduAnswers): FeeItem[] {
  const f = CITY.fees;
  const fees: FeeItem[] = [f.planCheck, f.buildingPermit];
  if (a.squareFeet > 500) fees.push(f.school);
  if (a.squareFeet >= STATE.impactFees.exemptBelowSquareFeet) {
    fees.push(f.traffic);
  } else {
    fees.push({ name: "Impact fees", amount: "$0", note: "State law bans impact fees for ADUs under 750 sq ft." });
  }
  fees.push(f.utilities);
  return fees;
}

function stepsFor(a: AduAnswers): string[] {
  const steps = [`Check your address with the city's Address Search Tool (${CITY.addressTool}) to confirm the zoning and whether you're in the Coastal Zone.`];
  if (a.coastalZone !== "no") steps.push("If you're in the Coastal Zone, apply for the Coastal Development Permit first.");
  steps.push(
    `Optional: meet with Planning staff (${CITY.planningPhone}). It isn't required but can save a review round.`,
    a.usingPreapprovedPlan ? "Have the pre-approved plan fitted to your lot." : "Have plans drawn for your ADU.",
    "Gather the documents in the checklist below.",
    `Submit in person at the ${CITY.permitCenter}, and pay the plan check fee.`,
    `Expect ${CITY.review.typicalRounds} review rounds of ${CITY.review.daysPerRound} days each. Track status in the CiViC portal (${CITY.portal}).`,
    "When plans are approved, pay the building permit fee and pick up your permits.",
  );
  return steps;
}

function rightsFor(a: AduAnswers): Check[] {
  const rights: Check[] = [
    info("deadline", "60-day decision deadline", "The city must approve or deny a complete application within 60 days.", STATE.decisionDeadlineCitation),
    info("nonconforming", "No fixing old problems first", "The city can't make you correct existing nonconforming conditions or unpermitted structures that aren't a health or safety threat.", STATE.nonconformingCitation),
  ];
  if (a.aduType !== "jadu") {
    rights.push(
      info("owner-occupancy", "You don't have to live on site", "Cities can't require the owner to live on the property for an ADU. HCD told Newport Beach to remove this rule.", STATE.ownerOccupancyBanned),
      info("deed", "No deed restriction for ADUs", "HCD says deed restrictions are not authorized for ADUs.", HCD_NEWPORT_LETTER),
    );
  }
  if (a.squareFeet < STATE.impactFees.exemptBelowSquareFeet) {
    rights.push(info("impact-fees", "No impact fees under 750 sq ft", "Cities and special districts can't charge impact fees for ADUs under 750 sq ft.", STATE.impactFees.citation));
  }
  return rights;
}

function outOfScope(headline: string, summary: string): AduResult {
  return {
    verdict: "out-of-scope",
    headline,
    summary,
    checks: [],
    permits: [],
    documents: [],
    fees: [],
    steps: [],
    rights: [],
    checkedOn: CITY.checkedOn,
  };
}

const make =
  (status: Check["status"]) =>
  (id: string, title: string, detail: string, citation?: Check["citation"]): Check => ({ id, title, status, detail, citation });
const pass = make("pass");
const warn = make("warn");
const fail = make("fail");
const info = make("info");
