import { NextResponse } from "next/server";
import { lookupParcel } from "@/lib/parcel/lookup";

// GET /api/parcel?address=100 Civic Center Dr
// Returns ParcelLookupResult (src/lib/parcel/types.ts) from Newport Beach's public GIS.
export async function GET(request: Request) {
  const address = new URL(request.url).searchParams.get("address")?.trim() ?? "";
  if (address.length < 4) {
    return NextResponse.json({ ok: false, reason: "no-match", message: "Enter a street address." }, { status: 400 });
  }
  return NextResponse.json(await lookupParcel(address));
}
