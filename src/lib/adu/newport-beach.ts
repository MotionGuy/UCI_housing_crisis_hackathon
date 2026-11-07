// Newport Beach ADU data. Source: docs/clear-it-newport.md (checked 2026-11-07).
// To add another city, copy this file and change the values.
import type { Citation, DocumentItem, FeeItem } from "./types";

export const CITY = {
  name: "Newport Beach",
  checkedOn: "2026-11-07",
  code: {
    label: "Newport Beach Municipal Code § 20.48.200 (§ 21.48.200 in the Coastal Zone)",
    url: "https://www.newportbeachadu.org/city-rules",
  } satisfies Citation,
  permitPage: {
    label: "Newport Beach ADU: Permit",
    url: "https://www.newportbeachadu.org/permit",
  } satisfies Citation,
  maxSize: { studioOrOneBed: 850, twoPlusBed: 1000 },

  /** From the city's ADU Ordinance Summary Matrix 2026 (single-family lots). */
  summaryMatrix: {
    label: "Newport Beach ADU Ordinance Summary Matrix 2026",
    url: "https://www.newportbeachadu.org/s/ADU-Ordinance-Summary-Matrix-2026.pdf",
  } satisfies Citation,
  standards: {
    jadu: {
      maxSquareFeet: 500,
      height: "per base zone",
      setbacks: "per base zone",
      bathroom: "may share with the house",
      kitchen: "efficiency kitchen",
      parking: "none",
      garageConversionReplacementParking: "appears required citywide (confirm)",
      ownerOccupancy: "owner lives in either unit",
      deedRestriction: true,
    },
    internal: {
      maxSquareFeet: null, // no limit
      height: "per base zone",
      setbacks: "per base zone; none added for conversions",
      accessoryBuildingAdditionSquareFeet: 150,
      parking: "none",
      garageConversionReplacementParking: "Coastal Zone only",
      ownerOccupancy: "not required",
      deedRestriction: false,
    },
    attached: {
      maxSquareFeet: { studioOrOneBed: 850, twoPlusBed: 1000 },
      height: "per base zone",
      setbacks: "per base zone",
      parking: "1 per unit, with waivers",
      ownerOccupancy: "not required",
      deedRestriction: false,
    },
    detached: {
      maxSquareFeet: { studioOrOneBed: 850, twoPlusBed: 1000 },
      heightFeet: 16,
      sideRearSetbackFeet: 4, // or base zone, whichever is less
      frontSetback: "per base zone",
      parking: "1 per unit, with waivers",
      garageConversionReplacementParking: "Coastal Zone only",
      ownerOccupancy: "not required",
      deedRestriction: false,
    },
    allTypes: {
      perLot: "1 ADU (internal, attached or detached) + 1 JADU",
      guaranteedSquareFeet: 800,
      shortTermRental: "banned",
      separateSale: "no, except through a qualified non-profit (Gov. Code § 66341)",
      fireSprinklers: "only if the main house has them",
      exteriorEntrance: "required",
    },
    parkingWaivers: [
      "Within half a mile walking distance of transit",
      "In an architecturally or historically significant district",
      "On-street parking permits required but not offered to the ADU occupant",
      "Within one block of a car-share pick-up spot",
      "Built with a new house outside the Coastal Zone",
    ],
  },
  addressTool:
    "https://nbgis.newportbeachca.gov/gispub/PublicAddressSearch/default.aspx",
  preapprovedPlans: "https://www.newportbeachadu.org/design",
  permitCenter:
    "Permit Center, City Hall, 100 Civic Center Drive, 1st floor, Bay C, Newport Beach, CA 92660",
  portal: "https://www.newportbeachca.gov/civic",
  planningPhone: "(949) 644-3204",
  feeCalculator: "https://occog.aducalculator.org",
  review: { daysPerRound: "10–20", typicalRounds: "2–3", permitting: "1–6 months" },

  documents: {
    planCheck: {
      name: "Plan check package",
      why: "Your plans and the plan check application.",
      url: "https://www.newportbeachca.gov/home/showpublisheddocument/3225/636089393638270000",
    },
    buildingPermit: {
      name: "Building permit package",
      why: "The building permit application.",
      url: "https://www.newportbeachca.gov/home/showpublisheddocument/15043/635682493202100000",
    },
    coastal: {
      name: "Coastal Development Permit application",
      why: "Needed first if the lot is in the Coastal Zone.",
      url: "https://www.newportbeachca.gov/home/showpublisheddocument/51985/637805210162500000",
    },
    grantDeed: {
      name: "Grant deed",
      why: "Proves you own the property and gives its legal description.",
    },
    questionnaire: {
      name: "ADU / JADU housing questionnaire",
      why: "Basic details about the ADU and its expected rent.",
      url: "https://www.newportbeachadu.org/permit",
    },
    deedRestriction: {
      name: "Deed restriction (signed and notarized)",
      why: "The city's permit page lists it as required.",
      url: "https://www.newportbeachadu.org/permit",
    },
  } satisfies Record<string, DocumentItem>,

  fees: {
    planCheck: { name: "Plan check fee", amount: "$850–$1,700", note: "Due when you submit." },
    buildingPermit: { name: "Building permit fee", amount: "$850–$2,100", note: "Due when the permit is issued." },
    school: { name: "School district fees", amount: "Set by the school district", note: "Only for ADUs over 500 sq ft." },
    traffic: {
      name: "Traffic Fairshare and Transportation Corridor fees",
      amount: "Varies",
      note: "Only for ADUs over 750 sq ft.",
    },
    utilities: { name: "Water, sewer and utility fees", amount: "Varies", note: "Set by each utility." },
  } satisfies Record<string, FeeItem>,
};
