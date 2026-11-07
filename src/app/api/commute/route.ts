import { NextResponse } from "next/server";
import type { CommuteResult, Destination } from "@/lib/types";

// POST /api/commute
// Body: { from: string, destinations: Destination[] }
// TODO: call a real directions API (Google Maps, Mapbox, OpenTripPlanner) with MAPS_API_KEY.
export async function POST(request: Request) {
  const { from, destinations } = (await request.json()) as {
    from?: string;
    destinations?: Destination[];
  };
  if (!from || !Array.isArray(destinations)) {
    return NextResponse.json(
      { error: 'Body needs "from" and "destinations"' },
      { status: 400 },
    );
  }

  // Stub: fake but stable times so the UI has something to show.
  const results: CommuteResult[] = destinations.map((d) => ({
    destination: d.label,
    minutes: 10 + ((from.length * 7 + d.address.length * 3) % 40),
    mode: "drive",
  }));
  return NextResponse.json({ from, results });
}
