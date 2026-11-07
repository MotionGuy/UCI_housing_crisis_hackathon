// Looks up a Newport Beach address in the city's public ArcGIS server:
// the CSSLocator geocoder, then the "Lot Information" (0) and
// "Special Flood Hazard (VE) Overlay" (18) layers of the CNB_Zoning map service.
// Server-side only (called from /api/parcel).
import type { ParcelInfo, ParcelLookupResult } from "./types";

const GIS = "https://nbgis.newportbeachca.gov/arcgis/rest/services";
const GEOCODER = `${GIS}/CSSLocator/GeocodeServer/findAddressCandidates`;
const ZONING = `${GIS}/CNB_Zoning/MapServer`;
const MIN_SCORE = 85;

const LOT_FIELDS = [
  "ADDS",
  "PARCEL_NO",
  "ZONING_UPDATE",
  "ZONING_DESCRIPTION",
  "ZONING_CODE_LINK",
  "GENERIC_LANDUSE",
  "LAND_USE_DESC",
  "PC_LINK",
  "COASTAL_ZONE",
  "APPEAL_AREA",
  "PermitJurAgency",
  "HEIGHT_ZONE",
  "OVERLAY",
  "OVERLAY_DESCRIPTION",
  "IP_OVERLAY",
  "IP_OVERLAY_DESCRIPTION",
  "LiquefactionRisk",
  "LandslideRisk",
  "OthFireDesig",
  "InWaterQualityZone",
];

type Attrs = Record<string, string | number | null>;

async function getJson<T>(url: string, params: Record<string, string>): Promise<T> {
  const res = await fetch(`${url}?${new URLSearchParams({ ...params, f: "json" })}`, {
    headers: { "User-Agent": "ClearIt-hackathon/0.1" },
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GIS request failed (${res.status})`);
  const body = (await res.json()) as T & { error?: { message?: string } };
  if (body.error) throw new Error(body.error.message ?? "GIS error");
  return body;
}

async function queryAtPoint(layer: number, lng: number, lat: number, outFields: string): Promise<Attrs[]> {
  const body = await getJson<{ features?: { attributes: Attrs }[] }>(`${ZONING}/${layer}/query`, {
    geometry: JSON.stringify({ x: lng, y: lat, spatialReference: { wkid: 4326 } }),
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields,
    returnGeometry: "false",
  });
  return (body.features ?? []).map((f) => f.attributes);
}

const str = (v: unknown) => (v === null || v === undefined || v === "None" ? "" : String(v).trim());
const yes = (v: unknown) => str(v).toUpperCase() === "YES";
const url = (v: unknown) => (/^https?:\/\//.test(str(v)) ? str(v) : undefined);

const DIRECTIONS: Record<string, string> = { N: "N", S: "S", E: "E", W: "W", NORTH: "N", SOUTH: "S", EAST: "E", WEST: "W" };

/**
 * Address spellings to try. Newport's geocoder wants the direction after the street
 * ("123 Example Blvd E"), while people usually type it first ("123 E Example Blvd").
 */
export function addressVariants(input: string): string[] {
  const base = input
    .replace(/,?\s*newport beach.*$/i, "")
    .replace(/,?\s*(ca|california)?\s*\d{5}(-\d{4})?\s*$/i, "")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const short = base.replace(/\b(street|avenue|drive|boulevard|place|lane|court|road|circle|highway|terrace)\b/i, (w) => SUFFIXES[w.toLowerCase()]);
  const m = short.match(/^(\d+[A-Z]?)\s+(north|south|east|west|[nsew])\s+(.+)$/i);
  const moved = m ? `${m[1]} ${m[3]} ${DIRECTIONS[m[2].toUpperCase()]}` : null;
  return [...new Set([base, short, ...(moved ? [moved] : [])])];
}

const SUFFIXES: Record<string, string> = {
  street: "St", avenue: "Ave", drive: "Dr", boulevard: "Blvd", place: "Pl", lane: "Ln",
  court: "Ct", road: "Rd", circle: "Cir", highway: "Hwy", terrace: "Ter",
};

type Candidate = { address: string; score: number; location: { x: number; y: number } };

async function geocode(address: string): Promise<Candidate | undefined> {
  const variants = addressVariants(address);
  // The city's server sometimes returns no candidates when busy, so make a second pass.
  for (let attempt = 0; attempt < 2; attempt++) {
    for (const variant of variants) {
      const geo = await getJson<{ candidates?: Candidate[] }>(GEOCODER, { SingleLine: variant, outSR: "4326", maxLocations: "1" });
      const best = geo.candidates?.[0];
      if (best && best.score >= MIN_SCORE) return best;
    }
    if (attempt === 0) await new Promise((r) => setTimeout(r, 600));
  }
  return undefined;
}

export async function lookupParcel(address: string): Promise<ParcelLookupResult> {
  try {
    const best = await geocode(address);
    if (!best) {
      return { ok: false, reason: "no-match", message: "We couldn't find that address in Newport Beach. Check the street number and name." };
    }
    const { x: lng, y: lat } = best.location;

    const [lots, flood] = await Promise.all([
      queryAtPoint(0, lng, lat, LOT_FIELDS.join(",")),
      queryAtPoint(18, lng, lat, "OBJECTID"),
    ]);
    const lot = lots[0];
    if (!lot) {
      return { ok: false, reason: "outside-city", message: "That address isn't on a Newport Beach lot in the city's map." };
    }

    const overlays = [
      { code: str(lot.OVERLAY), description: str(lot.OVERLAY_DESCRIPTION) },
      { code: str(lot.IP_OVERLAY), description: str(lot.IP_OVERLAY_DESCRIPTION) },
    ].filter((o) => o.code);

    const parcel: ParcelInfo = {
      matchedAddress: best.address,
      matchScore: Math.round(best.score),
      location: { lat, lng },
      apn: /^\d/.test(str(lot.PARCEL_NO)) ? str(lot.PARCEL_NO).replace(/\s+/g, "-") : "",
      zoningDistrict: str(lot.ZONING_UPDATE),
      zoningDescription: str(lot.ZONING_DESCRIPTION),
      zoningCodeUrl: url(lot.ZONING_CODE_LINK),
      landUse: str(lot.GENERIC_LANDUSE) || str(lot.LAND_USE_DESC),
      planCommunityUrl: url(lot.PC_LINK),
      coastalZone: yes(lot.COASTAL_ZONE),
      coastalAppealArea: str(lot.APPEAL_AREA) || "NO",
      permitAgency: str(lot.PermitJurAgency) || "City of Newport Beach",
      heightZone: str(lot.HEIGHT_ZONE),
      overlays,
      hazards: {
        liquefaction: yes(lot.LiquefactionRisk),
        landslide: yes(lot.LandslideRisk),
        fireDesignation: str(lot.OthFireDesig) || null,
        floodVE: flood.length > 0,
      },
      waterQualityZone: yes(lot.InWaterQualityZone),
      source: {
        label: "City of Newport Beach GIS, CNB_Zoning map service (Lot Information layer)",
        url: `${ZONING}/0`,
      },
      lookedUpAt: new Date().toISOString(),
    };
    return { ok: true, parcel };
  } catch (err) {
    return {
      ok: false,
      reason: "service-error",
      message: `The city's map service didn't respond (${err instanceof Error ? err.message : "unknown error"}). You can enter the details by hand.`,
    };
  }
}
