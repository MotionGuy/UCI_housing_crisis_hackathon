// Which problems block Continue on each intake step. Pass/fail comes only from the
// rules engine (evaluateAdu, evaluateParcel); this file only maps each engine check
// to the step and field that set it, and adds plain input checks (empty, zero,
// negative, not a whole number) that the engine assumes away.
import { evaluateAdu } from "@/lib/adu/evaluate";
import { CITY } from "@/lib/adu/newport-beach";
import { STATE } from "@/lib/adu/state-law";
import type { AduAnswers, Check, Citation } from "@/lib/adu/types";
import { evaluateParcel } from "@/lib/adu/zoning";
import type { Profile } from "@/lib/forms/types";

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
  | "ownerLivesOnSite";

export interface StepIssue {
  /** Engine check id, or "input" for a plain input check. */
  id: string;
  field: IssueField;
  title: string;
  message: string;
  /** Short "allowed" line built from the engine's own constants. */
  limit?: string;
  citation?: Citation;
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

/** Plain input checks for the fields on a step. */
function inputErrors(step: number, a: AduAnswers): StepIssue[] {
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
  const errors = inputErrors(step, a);
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
