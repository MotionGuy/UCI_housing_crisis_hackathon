import { NextResponse } from "next/server";
import { evaluateAdu } from "@/lib/adu/evaluate";
import type { AduAnswers } from "@/lib/adu/types";

// POST /api/adu/check
// Body: AduAnswers (see src/lib/adu/types.ts). Returns AduResult.
export async function POST(request: Request) {
  const body = (await request.json()) as Partial<AduAnswers>;
  const required = ["lotType", "coastalZone", "aduType", "squareFeet", "bedrooms", "nearTransit"] as const;
  const missing = required.filter((k) => body[k] === undefined);
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing fields: ${missing.join(", ")}` }, { status: 400 });
  }
  const defaults: Partial<AduAnswers> = {
    address: "",
    heightFeet: null,
    houseHeightFeet: null,
    sideRearSetbackFeet: null,
    convertingGarage: false,
    ownerLivesOnSite: true,
    usingPreapprovedPlan: false,
  };
  const answers = { ...defaults, ...body } as AduAnswers;
  return NextResponse.json(evaluateAdu(answers));
}
