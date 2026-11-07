/** What Newport Beach's public GIS says about one parcel. Every value comes from the city's map server. */
export interface ParcelInfo {
  /** Address the city's geocoder matched, e.g. "100 CIVIC CENTER DR, NEWPORT BEACH, CA, 92660". */
  matchedAddress: string;
  /** Geocoder match score, 0–100. */
  matchScore: number;
  location: { lat: number; lng: number };
  /** Assessor's parcel number, e.g. "047-300-01". */
  apn: string;
  /** Zoning district code, e.g. "R-1", "RM", "MU-W2", "PC". */
  zoningDistrict: string;
  zoningDescription: string;
  zoningCodeUrl?: string;
  /** Land use the GIS lists for the lot (for planned communities, the PC area). */
  landUse: string;
  planCommunityUrl?: string;
  coastalZone: boolean;
  /** "NO", "YES" (appealable to the Coastal Commission), "PERMIT JURISDICTION" (Commission issues the CDP), or "PARCEL BISECTED - SEE MAP LAYER". */
  coastalAppealArea: string;
  /** Agency with permit jurisdiction, e.g. "City of Newport Beach". */
  permitAgency: string;
  heightZone: string;
  /** Overlay codes, e.g. "B" (bluff), "C" (canyon), "VE-1" (flood), "H" (height). */
  overlays: { code: string; description: string }[];
  hazards: {
    liquefaction: boolean;
    landslide: boolean;
    /** "Special Fire Protection Area", "Hazard Reduction Zone", or null. */
    fireDesignation: string | null;
    /** In the city's Special Flood Hazard (VE) overlay. */
    floodVE: boolean;
  };
  waterQualityZone: boolean;
  source: { label: string; url: string };
  lookedUpAt: string;
}

export type ParcelLookupResult =
  | { ok: true; parcel: ParcelInfo }
  | { ok: false; reason: "no-match" | "outside-city" | "service-error"; message: string };
