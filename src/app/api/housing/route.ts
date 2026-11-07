import { NextResponse } from "next/server";
import researched from "@/data/listings.json";
import { sampleListings } from "@/lib/sample-data";
import type { Listing } from "@/lib/types";

// GET /api/housing?maxPrice=400000&affordableOnly=true
// Uses homes found by the research agent (npm run research:housing).
// Falls back to sample data until the agent has run once.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const maxPrice = Number(searchParams.get("maxPrice") ?? Infinity);
  const affordableOnly = searchParams.get("affordableOnly") === "true";

  const fromResearch = researched.listings as Listing[];
  const source = fromResearch.length > 0 ? "research" : "sample";
  const all = source === "research" ? fromResearch : sampleListings;

  const listings = all.filter(
    (l) => l.price <= maxPrice && (!affordableOnly || l.affordableProgram),
  );
  return NextResponse.json({
    source,
    researchedAt: researched.researchedAt,
    listings,
  });
}
