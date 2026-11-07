export type YesNoUnsure = "yes" | "no" | "unsure";

export type LotType =
  | "existing-single-family" // a house is already on the lot
  | "planned-single-family" // the house and ADU are built together
  | "multifamily" // apartments or condos on the lot
  | "vacant"; // no house and no plan for one

export type AduType =
  | "converted" // inside the house, a garage, or another existing structure
  | "attached" // a new addition to the house
  | "detached" // a new separate building
  | "jadu"; // junior ADU: up to 500 sq ft inside the house

/** What the applicant tells us in the interview. */
export interface AduAnswers {
  address: string;
  lotType: LotType;
  coastalZone: YesNoUnsure;
  aduType: AduType;
  squareFeet: number;
  bedrooms: number;
  /** New construction only (attached or detached). */
  heightFeet: number | null;
  /** New construction only: the smaller of the side and rear setbacks. */
  sideRearSetbackFeet: number | null;
  /** Within half a mile walking distance of public transit (a bus stop counts). */
  nearTransit: YesNoUnsure;
  convertingGarage: boolean;
  ownerLivesOnSite: boolean;
  usingPreapprovedPlan: boolean;
}

export interface Citation {
  label: string;
  url?: string;
}

export type CheckStatus = "pass" | "warn" | "fail" | "info";

export interface Check {
  id: string;
  title: string;
  status: CheckStatus;
  detail: string;
  citation?: Citation;
}

export interface DocumentItem {
  name: string;
  why: string;
  url?: string;
  /** Set when state law may not allow the city to require this. */
  warning?: string;
}

export interface FeeItem {
  name: string;
  amount: string;
  note?: string;
}

export type Verdict = "fast-path" | "needs-changes" | "out-of-scope";

export interface AduResult {
  verdict: Verdict;
  headline: string;
  summary: string;
  checks: Check[];
  permits: string[];
  documents: DocumentItem[];
  fees: FeeItem[];
  steps: string[];
  /** State-law protections the applicant should know about. */
  rights: Check[];
  checkedOn: string;
}
