// Which problems block Continue on each intake step. Pass/fail comes only from the
// rules engine (evaluateAdu, evaluateParcel); this file only maps each engine check
// to the step and field that set it, and adds plain input checks (empty, zero,
// negative, not a whole number) that the engine assumes away, plus the team step's
// form-completeness checks (designer, engineer, builder), each with its source.
import { evaluateAdu } from "@/lib/adu/evaluate";
import { CITY } from "@/lib/adu/newport-beach";
import { STATE } from "@/lib/adu/state-law";
import type { AduAnswers, Check, Citation } from "@/lib/adu/types";
import { evaluateParcel } from "@/lib/adu/zoning";
import type { Professional, Profile } from "@/lib/forms/types";

/** Intake step numbers (same as STEPS in review.tsx; kept here so this file has no UI imports). */
export const STEP = { address: 0, lot: 1, aduType: 2, size: 3, owner: 4, team: 5 } as const;

export type IssueField =
  | "address"
  | "coastalZone"
  | "squareFeet"
  | "bedrooms"
  | "heightFeet"
  | "houseHeightFeet"
  | "sideRearSetbackFeet"
  | "ownerLivesOnSite"
  // Team step (form-completeness checks, not engine rules)
  | "designer"
  | "designerIsArchitect"
  | "engineer"
  | "builder"
  | "contractor";

export interface StepIssue {
  /** Engine check id, or "input" for a plain input check. */
  id: string;
  field: IssueField;
  title: string;
  message: string;
  /** Short "allowed" line built from the engine's own constants. */
  limit?: string;
  citation?: Citation;
  /** Team step: the Professional fields still empty, so the UI can mark each input red. */
  missing?: (keyof Professional)[];
}

export interface StepIssues {
  /** Block Continue. */
  errors: StepIssue[];
  /** Shown in amber; never block. */
  warnings: StepIssue[];
}

/** Engine and parcel check id -> the step and field that set it. Unlisted ids show only on the results page. */
const CHECK_FIELD: Record<string, { step: number; field: IssueField }> = {
  // evaluateAdu
  size: { step: STEP.size, field: "squareFeet" },
  setback: { step: STEP.size, field: "sideRearSetbackFeet" },
  height: { step: STEP.size, field: "heightFeet" },
  "height-house": { step: STEP.size, field: "heightFeet" },
  owner: { step: STEP.owner, field: "ownerLivesOnSite" },
  // Coastal Zone comes from the address lookup; "unsure" (no lookup) shows as an amber note on the address step.
  coastal: { step: STEP.address, field: "coastalZone" },
  // evaluateParcel (from the address lookup)
  jurisdiction: { step: STEP.address, field: "address" },
  zone: { step: STEP.address, field: "address" },
  "coastal-jurisdiction": { step: STEP.address, field: "address" },
  overlay: { step: STEP.address, field: "address" },
  fire: { step: STEP.address, field: "address" },
};

/** The same checks the results page shows: parcel checks replace the engine's generic coastal check. */
function allChecks(a: AduAnswers, p: Profile): { check: Check; fromParcel: boolean }[] {
  const engine = evaluateAdu(a).checks;
  if (!p.parcel) return engine.map((check) => ({ check, fromParcel: false }));
  return [
    ...evaluateParcel(p.parcel, a.aduType).checks.map((check) => ({ check, fromParcel: true })),
    ...engine.filter((c) => c.id !== "coastal").map((check) => ({ check, fromParcel: false })),
  ];
}

/** Allowed range for a failed check, from the constants evaluate.ts uses. */
function limitFor(id: string, a: AduAnswers): string | undefined {
  if (id === "size") {
    if (a.aduType === "jadu") return `Allowed: up to ${STATE.jadu.maxSquareFeet} sq ft for a junior ADU.`;
    const twoPlus = a.bedrooms >= 2;
    const max = twoPlus ? CITY.maxSize.twoPlusBed : CITY.maxSize.studioOrOneBed;
    return `Allowed: up to ${max.toLocaleString("en-US")} sq ft for ${twoPlus ? "2+ bedrooms" : "a studio or 1 bedroom"}.${
      a.aduType === "detached" ? ` ${STATE.guaranteedDetached.maxSquareFeet} sq ft or less (with ${STATE.guaranteedDetached.minSetbackFeet} ft setbacks) is a detached ADU the city must approve.` : ""
    }`;
  }
  if (id === "setback") return `Allowed: ${STATE.guaranteedDetached.minSetbackFeet} ft or more.`;
  if (id === "height-house") {
    const cap = STATE.height.attachedFeet;
    const house = a.houseHeightFeet !== null && a.houseHeightFeet > 0 ? a.houseHeightFeet : null;
    return house === null
      ? `Allowed: up to ${cap} ft, and no taller than your house.`
      : `Allowed: up to ${Math.min(house, cap)} ft (no taller than your ${house} ft house, never over ${cap} ft).`;
  }
  return undefined;
}

/** Sources for the team-step checks and notes (see docs/clear-it-newport.md, "Designer, engineer and contractor"). */
export const TEAM_SOURCES = {
  planPreparer: {
    label: "Newport Beach, Requirements for Submittal for Residential Additions and New Construction (9-2014): preparer's name, address and phone on each sheet",
    url: "https://www.newportbeachca.gov/home/showpublisheddocument/3225/636089393638270000",
  },
  unlicensedDesigner: {
    label: "Cal. Bus. & Prof. Code § 5537(a) (unlicensed designers may draw single-family homes)",
    url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=5537",
  },
  engineerStamp: {
    label: "Newport Beach ADU site, Design: plans need a licensed engineer's stamp without a licensed architect",
    url: "https://www.newportbeachadu.org/design",
  },
  licenseBeforePermit: {
    label: "Cal. Bus. & Prof. Code § 7031.5 (contractor license statement before a permit is issued)",
    url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=7031.5",
  },
  civicAccount: {
    label: "Newport Beach Combo Building Permit Application (2025): contractors and owner-builders need a CiViC account",
    url: "https://www.newportbeachca.gov/home/showpublisheddocument/3258/638824129709970000",
  },
  ownerBuilderForm: {
    label: "Newport Beach Owner-Builder Acknowledgement form",
    url: "https://www.newportbeachca.gov/home/showpublisheddocument/3204/638624191827970000",
  },
} satisfies Record<string, Citation>;

const PRO_LABEL: Record<keyof Professional, string> = {
  name: "name",
  license: "license no.",
  email: "email",
  phone: "phone",
  address: "office address",
  city: "city",
  state: "state",
  zip: "ZIP",
};

/** Empty fields of a designer, engineer or contractor. */
function missingPro(v: Professional, required: (keyof Professional)[]): (keyof Professional)[] {
  return required.filter((k) => !v[k]?.trim());
}

const OFFICE: (keyof Professional)[] = ["name", "address", "city", "state", "zip", "email", "phone"];

/** Team step: who drew the plans, who stamps them, who builds. Form-completeness only, never a rule check. */
function teamErrors(p: Profile): StepIssue[] {
  const errors: StepIssue[] = [];
  const need = (field: IssueField, title: string, message: string, citation: Citation, missing?: (keyof Professional)[]) =>
    errors.push({
      id: "input",
      field,
      title,
      message,
      citation,
      missing,
      limit: missing?.length ? `Still needed: ${missing.map((k) => PRO_LABEL[k]).join(", ")}.` : undefined,
    });

  const designer = missingPro(p.designer, OFFICE);
  if (designer.length) {
    need(
      "designer",
      "Architect or designer",
      "Add whoever drew your plans. The city requires the plan preparer's name and contact on every plan sheet, so plan check will expect it.",
      TEAM_SOURCES.planPreparer,
      designer,
    );
  }
  if (p.designerIsArchitect === null) {
    need(
      "designerIsArchitect",
      "Licensed architect",
      "Tell us whether your designer is a licensed architect. If not, Newport Beach requires a licensed engineer to stamp your plans.",
      TEAM_SOURCES.engineerStamp,
    );
  } else if (!p.designerIsArchitect) {
    const engineer = missingPro(p.engineer, ["name", "license", ...OFFICE.slice(1)]);
    if (engineer.length) {
      need(
        "engineer",
        "Engineer",
        "Your designer isn't a licensed architect, so Newport Beach requires a licensed engineer to stamp your plans. Add the engineer's details.",
        TEAM_SOURCES.engineerStamp,
        engineer,
      );
    }
  }
  if (p.builder === null) {
    need(
      "builder",
      "Who will build it",
      "Choose who will build your ADU. You can pick \"Not chosen yet\": the city needs a licensed contractor or an owner-builder only before it issues the permit.",
      TEAM_SOURCES.licenseBeforePermit,
    );
  } else if (p.builder === "contractor") {
    const contractor = missingPro(p.contractor, ["name", "license", "email", "phone"]);
    if (contractor.length) {
      need(
        "contractor",
        "Contractor",
        "Add your contractor's name, license number, email and phone. The city needs the contractor's license before it issues the permit, and the contractor needs a CiViC account.",
        TEAM_SOURCES.licenseBeforePermit,
        contractor,
      );
    }
  }
  return errors;
}

/** Plain input checks for the fields on a step. */
function inputErrors(step: number, a: AduAnswers, p: Profile): StepIssue[] {
  if (step === STEP.team) return teamErrors(p);
  if (step !== STEP.size) return [];
  const isNew = a.aduType === "detached" || a.aduType === "attached";
  const errors: StepIssue[] = [];
  const add = (field: IssueField, title: string, message: string) => errors.push({ id: "input", field, title, message });

  if (!Number.isFinite(a.squareFeet) || a.squareFeet <= 0) add("squareFeet", "Size", "Enter the ADU's size in square feet, a number above 0.");
  if (!Number.isInteger(a.bedrooms) || a.bedrooms < 0) add("bedrooms", "Bedrooms", "Enter a whole number of bedrooms: 0 for a studio, 1 or more otherwise.");
  if (isNew) {
    if (a.heightFeet === null || !Number.isFinite(a.heightFeet) || a.heightFeet <= 0) add("heightFeet", "Height", "Enter the ADU's height in feet, a number above 0.");
    if (a.houseHeightFeet === null || !Number.isFinite(a.houseHeightFeet) || a.houseHeightFeet <= 0) {
      add("houseHeightFeet", "Height of the main house", "Enter the main house's height in feet, a number above 0.");
    }
    if (a.sideRearSetbackFeet === null || !Number.isFinite(a.sideRearSetbackFeet)) {
      add("sideRearSetbackFeet", "Side and rear setback", "Enter the distance to the nearest side or rear property line, in feet.");
    } else if (a.sideRearSetbackFeet < 0) {
      add("sideRearSetbackFeet", "Side and rear setback", "A setback can't be negative. Enter the distance to the nearest side or rear property line, in feet.");
    }
  }
  return errors;
}

/** Errors (block Continue) and warnings (amber, don't block) for one intake step. */
export function stepIssues(step: number, a: AduAnswers, p: Profile): StepIssues {
  const errors = inputErrors(step, a, p);
  const warnings: StepIssue[] = [];
  const badInput = new Set(errors.map((e) => e.field));

  for (const { check, fromParcel } of allChecks(a, p)) {
    if (check.status !== "fail" && check.status !== "warn") continue;
    // A parcel check belongs to the address step, even when its id matches an engine check (e.g. "coastal").
    const where = fromParcel ? { step: STEP.address, field: "address" as const } : CHECK_FIELD[check.id];
    if (!where || where.step !== step || badInput.has(where.field)) continue;
    // The house-height rule needs a valid house height first.
    if (check.id === "height-house" && badInput.has("houseHeightFeet")) continue;
    const issue: StepIssue = {
      id: check.id,
      field: where.field,
      title: check.title,
      message: check.detail,
      limit: check.status === "fail" ? limitFor(check.id, a) : undefined,
      citation: check.citation,
    };
    (check.status === "fail" ? errors : warnings).push(issue);
  }
  return { errors, warnings };
}

/** First intake step that has a blocking error, or -1. Used before returning to the review screen. */
export function firstBlockedStep(a: AduAnswers, p: Profile, stepCount: number): number {
  for (let s = 0; s < stepCount; s++) {
    if (stepIssues(s, a, p).errors.length > 0) return s;
  }
  return -1;
}

/**
 * "Same as project address" on the owner step: splits the project address
 * ("street, city, state ZIP") into mailing-address fields. Uses the city's matched
 * address when the lookup worked. Missing city/state default to Newport Beach, CA
 * (the app is Newport-only); a missing ZIP stays blank (never invented).
 */
export function mailingFromProject(a: AduAnswers, p: Profile): { mailingAddress: string; city: string; state: string; zip: string } {
  const full = (p.parcel?.matchedAddress || a.address).trim();
  const parts = full
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x && !/^(USA?|United States)$/i.test(x));
  const street = parts[0] ?? "";
  let rest = parts.slice(1).join(" ").replace(/\s+/g, " ").trim();
  let zip = "";
  let state = "";
  const z = rest.match(/\s*(\d{5})(?:-\d{4})?$/);
  if (z) {
    zip = z[1];
    rest = rest.slice(0, z.index).trim();
  }
  const s = rest.match(/(?:^|\s)(California|[A-Za-z]{2})$/i);
  if (s) {
    state = /^california$/i.test(s[1]) ? "CA" : s[1].toUpperCase();
    rest = rest.slice(0, s.index).trim();
  }
  // The city's geocoder may answer in capitals ("NEWPORT BEACH"); show it as a name.
  const city = rest && rest === rest.toUpperCase() ? rest.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : rest;
  return { mailingAddress: street, city: city || "Newport Beach", state: state || "CA", zip };
}
