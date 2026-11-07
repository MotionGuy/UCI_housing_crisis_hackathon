"use client";

import { CircleCheck, CircleX, ExternalLink, TriangleAlert } from "lucide-react";
import { classifyZone } from "@/lib/adu/zoning";
import type { ParcelInfo } from "@/lib/parcel/types";

const APPEAL_TEXT: Record<string, string> = {
  NO: "City issues the coastal permit",
  YES: "City issues it; appealable to the Coastal Commission",
  "PERMIT JURISDICTION": "Coastal Commission issues the coastal permit",
};

/** Summary of what the city's GIS returned for the address. */
export function ParcelCard({ parcel: p }: { parcel: ParcelInfo }) {
  const zone = classifyZone(p);
  const ZoneIcon = zone.eligibility === "allowed" ? CircleCheck : zone.eligibility === "check" ? TriangleAlert : CircleX;
  const zoneTone =
    zone.eligibility === "allowed" ? "text-accent" : zone.eligibility === "check" ? "text-amber-400" : "text-red-400";
  const hazards = [
    p.hazards.floodVE && "Flood (VE overlay)",
    p.hazards.fireDesignation,
    p.hazards.liquefaction && "Liquefaction",
    p.hazards.landslide && "Landslide",
    ...p.overlays.filter((o) => ["B", "C"].includes(o.code)).map((o) => (o.code === "B" ? "Bluff overlay" : "Canyon overlay")),
  ].filter(Boolean) as string[];

  return (
    <div className="rounded-2xl border border-accent/25 bg-accent/[0.04] p-4">
      <p className="text-[11px] font-semibold tracking-wider text-accent uppercase">Found in the city&apos;s map</p>
      <p className="mt-1 text-[15px] font-medium text-white">{p.matchedAddress}</p>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-[13.5px]">
        <Fact label="Zoning">
          <span className="flex items-center gap-1.5">
            <ZoneIcon className={`size-4 shrink-0 ${zoneTone}`} />
            <span>
              {p.zoningDistrict || "Unknown"}
              {p.zoningDescription && <span className="text-neutral-400"> · {p.zoningDescription}</span>}
            </span>
          </span>
        </Fact>
        <Fact label="Parcel (APN)">{p.apn || "Not listed"}</Fact>
        <Fact label="Coastal Zone">
          {p.coastalZone ? (
            <>
              Yes
              <span className="block text-xs text-neutral-400">
                {APPEAL_TEXT[p.coastalAppealArea.toUpperCase()] ?? "On the appeal-area line; ask a planner"}
              </span>
            </>
          ) : (
            "No"
          )}
        </Fact>
        <Fact label="Height zone">{p.heightZone || "Not listed"}</Fact>
        <Fact label="Hazards" wide>
          {hazards.length ? hazards.join(" · ") : "None on the city's map"}
        </Fact>
      </dl>

      {zone.eligibility !== "allowed" && (
        <p className={`mt-3 text-[13px] leading-snug ${zoneTone}`}>
          {zone.eligibility === "not-allowed"
            ? "This zone doesn't allow ADUs. ADUs are allowed in residential and mixed-use zones."
            : "Planned community: check that this lot is in a residential area of the plan."}
        </p>
      )}

      <a
        href={p.source.url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs text-neutral-500 underline decoration-white/20 underline-offset-2 hover:text-neutral-300"
      >
        Source: City of Newport Beach GIS <ExternalLink className="size-3" />
      </a>
    </div>
  );
}

function Fact({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : undefined}>
      <dt className="text-xs text-neutral-500">{label}</dt>
      <dd className="mt-0.5 text-neutral-100">{children}</dd>
    </div>
  );
}
