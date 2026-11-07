import { NextResponse } from "next/server";
import { sampleListings } from "@/lib/sample-data";

// GET /api/housing?maxPrice=400000&affordableOnly=true
// TODO: replace sample data with real listings (non-profit lists, county programs, listing APIs).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const maxPrice = Number(searchParams.get("maxPrice") ?? Infinity);
  const affordableOnly = searchParams.get("affordableOnly") === "true";

  const listings = sampleListings.filter(
    (l) => l.price <= maxPrice && (!affordableOnly || l.affordableProgram),
  );
  return NextResponse.json({ listings });
}
