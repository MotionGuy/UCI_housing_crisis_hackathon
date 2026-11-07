// California ADU law (Gov. Code §§ 66310–66342, renumbered in 2024 by SB 477).
// Every number here should match docs/clear-it-newport.md. Re-check before the demo.
import type { Citation } from "./types";

const gov = (section: string, sub = ""): Citation => ({
  label: `Cal. Gov. Code § ${section}${sub}`,
  url: `https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=${section}`,
});

export const HCD_NEWPORT_LETTER: Citation = {
  label: "HCD findings letter to Newport Beach, Oct 1, 2024",
  url: "https://www.hcd.ca.gov/sites/default/files/docs/policy-and-research/ordinance-review-letters/newport-beach-adu-findings-100124.pdf",
};

export const STATE = {
  /** Detached ADU the city must approve regardless of local standards. */
  guaranteedDetached: {
    maxSquareFeet: 800,
    minSetbackFeet: 4,
    citation: gov("66323", "(a)(2)"),
  },
  height: {
    detachedFeet: 16,
    detachedNearTransitFeet: 18,
    attachedFeet: 25,
    citation: gov("66321", "(b)(4)"),
  },
  /** A city may not set a max size below these. */
  minimumAllowedMax: {
    studioOrOneBed: 850,
    twoPlusBed: 1000,
    citation: gov("66321", "(b)"),
  },
  jadu: {
    maxSquareFeet: 500,
    citation: gov("66333"),
  },
  parking: {
    maxSpaces: 1,
    exemptionsCitation: gov("66322"),
    garageConversionCitation: gov("66314", "(d)(11)"),
  },
  impactFees: {
    exemptBelowSquareFeet: 750,
    citation: gov("66324", "(c)"),
  },
  ownerOccupancyBanned: gov("66315"),
  decisionDeadlineDays: 60,
  decisionDeadlineCitation: gov("66317"),
  nonconformingCitation: gov("66323", "(b)"),
  jaduDeedRestrictionCitation: gov("66333", "(c)"),
};
