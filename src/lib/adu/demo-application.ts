// A made-up Newport Beach ADU application for the live demo (sample data only:
// the address, names and contacts are fake). The mistakes planted here are the
// ones in docs/pitch.md § 3; scripts can check each one with evaluateAdu.
//
// Demo flow: the intake blocks a step while the rules engine fails one of its
// values. All three mistakes are caught live on the "Size it up" step (red,
// Continue disabled): 900 sq ft, a 3 ft setback and a 17 ft ADU next to a 16 ft
// house. The presenter types the fixes (900 -> 800, 3 -> 4, 17 -> 16) and
// continues; the results then say "Ready to submit". The app has no "load demo"
// button: the presenter types these values (docs/pitch.md). The made-up address
// isn't in the city's map, so in the app the lookup fails, the presenter continues
// by hand and the Coastal Zone stays "unsure" (an amber note, never a block).
// coastalZone stays "no" here so evaluateAdu checks run without a lookup.
import type { AduAnswers } from "./types";
import { EMPTY_PRO, type Profile } from "@/lib/forms/types";

/** Detached 1-bed backyard ADU with planted mistakes. */
export const demoAnswers: AduAnswers = {
  address: "123 Example Lane, Newport Beach, CA 92663",
  lotType: "existing-single-family",
  coastalZone: "no", // in the app this comes from the address lookup ("unsure" when it fails)
  aduType: "detached",
  squareFeet: 900, // mistake: over the 850 sq ft city cap for 1 bedroom
  bedrooms: 1,
  heightFeet: 17, // mistake: taller than the 16 ft house
  houseHeightFeet: 16,
  sideRearSetbackFeet: 3, // mistake: under the 4 ft the state guarantees
  nearTransit: "no",
  convertingGarage: false,
  ownerLivesOnSite: true,
  usingPreapprovedPlan: false,
};

/** The same application after the fixes: no fails and no warnings. */
export const fixedAnswers: AduAnswers = {
  ...demoAnswers,
  coastalZone: "no",
  houseHeightFeet: 16,
  squareFeet: 800,
  heightFeet: 16,
  sideRearSetbackFeet: 4,
};

/** Fake owner and team, so the owner step can continue and the PDFs look real. */
export const demoProfile: Profile = {
  owner: {
    firstName: "Sam",
    lastName: "Sample",
    mailingAddress: "123 Example Lane",
    city: "Newport Beach",
    state: "CA",
    zip: "92663",
    email: "sam.sample@example.com",
    phone: "(555) 010-0123",
  },
  applicantIsOwner: true,
  applicant: { firstName: "", lastName: "", mailingAddress: "", city: "", state: "CA", zip: "", email: "", phone: "" },
  apn: "000-000-00 (demo)",
  zoningDistrict: "R-1",
  valuation: 0, // the wizard fills in the $300/sq ft estimate
  designer: { ...EMPTY_PRO, name: "Demo Design Studio", license: "DEMO-0000" },
  engineer: EMPTY_PRO,
  contractor: { ...EMPTY_PRO, name: "Example Builders (demo)", license: "DEMO-1111" },
};

/**
 * Each planted mistake and the evaluateAdu check that must come back fail.
 * All three fail on the "Size it up" step, so each blocks Continue until fixed.
 */
export const plantedMistakes: { description: string; expectedCheckId: string }[] = [
  { description: "900 sq ft is over Newport Beach's 850 sq ft limit for a 1-bedroom ADU (fix: 800 sq ft; blocks the size step)", expectedCheckId: "size" },
  { description: "3 ft side/rear setback is under the 4 ft the state guarantees (fix: 4 ft; blocks the size step)", expectedCheckId: "setback" },
  { description: "17 ft ADU is taller than the 16 ft house (fix: 16 ft; blocks the size step)", expectedCheckId: "height-house" },
];

/**
 * City-vs-state conflicts for the pitch (talking point only; the app no longer shows a
 * conflict card). The engine reports them as a document warning plus a "rights" item.
 */
export const plantedConflicts: { description: string; documentName: string; rightId: string }[] = [
  {
    description: "Newport's permit page lists a deed restriction for every ADU; the city's 2026 summary and HCD say only JADUs need one",
    documentName: "Deed restriction (signed and notarized)",
    rightId: "deed",
  },
];
