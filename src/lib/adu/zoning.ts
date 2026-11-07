// Which permits and extra documents a lot needs, based on what the city's GIS says about it.
// Every rule cites its source. Research: docs/clear-it-newport.md ("Permits by zone and location").
import type { ParcelInfo } from "@/lib/parcel/types";
import type { AduType, Check, Citation, DocumentItem } from "./types";

const ADU_CODE: Citation = {
  label: "NBMC § 20.48.200(A), (C) (Ord. 2025-20)",
  url: "https://ecode360.com/50137802",
};
const COASTAL_CODE: Citation = {
  label: "NBMC § 21.52.015(B) (Coastal Commission permit jurisdiction)",
  url: "https://ecode360.com/50143808",
};
const COASTAL_EXEMPTION: Citation = {
  label: "NBMC § 21.52.035(C)(1): exemption excludes \"guest houses or self-contained residential units\"",
  url: "https://ecode360.com/50143808",
};
const DE_MINIMIS: Citation = { label: "NBMC § 21.52.055 (Waiver for De Minimis Development)", url: "https://ecode360.com/50143808" };
const NO_HEARING: Citation = {
  label: "Cal. Gov. Code § 66329 (no public hearing required for ADU coastal permits)",
  url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=66329",
};
const CDP_HANDOUT: Citation = {
  label: "Newport Beach Coastal Development Permit handout (rev. 10/03/23), supplemental materials table",
  url: "https://www.newportbeachca.gov/home/showpublisheddocument/51985/637805210162500000",
};
const SUBMITTAL_2014: Citation = {
  label: "Requirements for Submittal for Residential Additions and New Construction (9-2014), Fire item 1",
  url: "https://www.newportbeachca.gov/home/showpublisheddocument/3225/636089393638270000",
};
const SOILS: Citation = {
  label: "Plan Check Submittal Checklist (Nov 2025): \"Soils Report when required by City Policy CBC 1803.5\". Assumption: hazard zones trigger it",
  url: "https://www.newportbeachca.gov/home/showpublisheddocument/77633/638987109458170000",
};

export type ZoneEligibility = "allowed" | "check" | "not-allowed";

export interface ParcelEvaluation {
  eligibility: ZoneEligibility;
  zoneLabel: string;
  /** Permits in the order they're needed. */
  permits: string[];
  checks: Check[];
  documents: DocumentItem[];
}

const RESIDENTIAL_ZONE = /^(R-|RM|RMD$)/;
const MIXED_USE_ZONE = /^MU-/;
const PLANNED = /^(PC|SP-)/;
const RESIDENTIAL_LAND_USE = /resid|apartment|single|multi|mobile home|dwelling/i;

export function classifyZone(p: Pick<ParcelInfo, "zoningDistrict" | "landUse">): { eligibility: ZoneEligibility; label: string } {
  const z = p.zoningDistrict.toUpperCase();
  if (RESIDENTIAL_ZONE.test(z)) return { eligibility: "allowed", label: "Residential zone" };
  if (MIXED_USE_ZONE.test(z)) return { eligibility: "allowed", label: "Mixed-use zone" };
  if (PLANNED.test(z)) {
    return RESIDENTIAL_LAND_USE.test(p.landUse)
      ? { eligibility: "allowed", label: "Planned community, residential area" }
      : { eligibility: "check", label: "Planned community or specific plan" };
  }
  if (!z) return { eligibility: "check", label: "Zoning not found" };
  return { eligibility: "not-allowed", label: "Non-residential zone" };
}

export function evaluateParcel(p: ParcelInfo, aduType: AduType): ParcelEvaluation {
  const checks: Check[] = [];
  const documents: DocumentItem[] = [];
  const permits: string[] = [];
  const zone = classifyZone(p);
  const isNew = aduType === "detached" || aduType === "attached";

  // ---- Who issues permits at all ----
  if (!/newport beach/i.test(p.permitAgency)) {
    checks.push({
      id: "jurisdiction",
      title: "Permit agency",
      status: "fail",
      detail: `The city's map lists ${p.permitAgency} as the permit agency for this lot, not the City of Newport Beach. This app only covers city permits.`,
      citation: { label: "Newport Beach GIS, PermitJurAgency", url: p.source.url },
    });
    return { eligibility: "not-allowed", zoneLabel: zone.label, permits, checks, documents };
  }

  // ---- Zone ----
  const zoneText = `${p.zoningDistrict}${p.zoningDescription ? ` (${p.zoningDescription})` : ""}`;
  if (zone.eligibility === "allowed") {
    checks.push({
      id: "zone",
      title: "Zoning allows ADUs",
      status: "pass",
      detail: `${zoneText} is a ${zone.label.toLowerCase()}. The city must approve ADUs in residential and mixed-use zones with a building permit, ministerially, within 60 days of a complete application.${PLANNED.test(p.zoningDistrict) ? " Planned-community standards (setbacks, height) come from the PC text." : ""}`,
      citation: ADU_CODE,
    });
  } else if (zone.eligibility === "check") {
    checks.push({
      id: "zone",
      title: "Zoning needs a closer look",
      status: "warn",
      detail: `${zoneText}${p.landUse ? `, land use "${p.landUse}"` : ""}. ADUs are allowed in areas designated for residential use, including planned communities. Check that this lot is a residential area of the plan.`,
      citation: p.planCommunityUrl ? { label: "Planned community text", url: p.planCommunityUrl } : ADU_CODE,
    });
  } else {
    checks.push({
      id: "zone",
      title: "Zoning doesn't allow ADUs",
      status: "fail",
      detail: `${zoneText} isn't a residential or mixed-use zone, so the ADU fast path doesn't apply here.`,
      citation: ADU_CODE,
    });
    return { eligibility: "not-allowed", zoneLabel: zone.label, permits, checks, documents };
  }

  // ---- Coastal Zone ----
  const appeal = p.coastalAppealArea.toUpperCase();
  if (!p.coastalZone) {
    permits.push("Building permit (ministerial ADU approval)");
  } else if (appeal === "PERMIT JURISDICTION") {
    permits.push(
      "City Approval in Concept (AIC)",
      "Coastal Development Permit from the California Coastal Commission",
      "Building permit (ministerial ADU approval)",
    );
    checks.push({
      id: "coastal-jurisdiction",
      title: "Coastal Commission issues the coastal permit",
      status: "warn",
      detail: "This lot is in the Coastal Commission's permit jurisdiction. Get the city's Approval in Concept first, then apply to the Coastal Commission for the Coastal Development Permit. Only then can the building permit be issued.",
      citation: COASTAL_CODE,
    });
  } else {
    permits.push("Coastal Development Permit from the city (first)", "Building permit (ministerial ADU approval)");
    const appealable = appeal === "YES";
    const bisected = appeal.startsWith("PARCEL BISECTED");
    checks.push({
      id: "coastal",
      title: "Coastal Development Permit needed",
      status: "warn",
      detail: `This lot is in the Coastal Zone. The coastal exemption for home improvements excludes "self-contained residential units", so plan on a Coastal Development Permit before the building permit. ${
        bisected
          ? "The lot sits on the edge of the Coastal Commission's appeal area. Ask a planner which side applies."
          : appealable
            ? "The lot is in the Coastal Commission's appeal area, so the city's decision can be appealed and the de minimis waiver isn't available."
            : "The lot is outside the appeal area, so the city may be able to waive the permit as de minimis."
      }`,
      citation: COASTAL_EXEMPTION,
    });
    if (!appealable && !bisected) {
      checks.push({
        id: "de-minimis",
        title: "Possible de minimis waiver",
        status: "info",
        detail: "Outside the appeal area, the Community Development Director may waive the coastal permit if the ADU has no potential adverse effect on coastal resources. Ask about it when you apply.",
        citation: DE_MINIMIS,
      });
    }
    checks.push({
      id: "no-hearing",
      title: "No public hearing required",
      status: "info",
      detail: "State law says the city doesn't have to hold a public hearing on a coastal permit for an ADU, even though the city's code requires hearings for other coastal permits. Ask the city to process it without one.",
      citation: NO_HEARING,
    });
    if (isNew) {
      documents.push({
        name: "Preliminary Construction Pollution Prevention Plan (CPPP)",
        why: "Required for coastal projects that build a structure or add impervious surface.",
        url: CDP_HANDOUT.url,
      });
    }
    if (p.waterQualityZone && isNew) {
      documents.push({
        name: "Water Quality Hydrology Plan / WQMP (maybe)",
        why: "The lot is in the city's water-quality zone. Needed near coastal waters with 2,500+ sq ft of impervious area, or other triggers. Ask your planner.",
        url: CDP_HANDOUT.url,
      });
    }
  }

  // ---- Overlays and hazards ----
  const codes = p.overlays.map((o) => o.code.toUpperCase());
  if (p.coastalZone && (codes.includes("B") || codes.includes("C"))) {
    const which = codes.includes("B") ? "bluff" : "canyon";
    documents.push(
      {
        name: "Geologic Stability Report",
        why: `The lot is in the ${which} overlay.`,
        url: CDP_HANDOUT.url,
      },
      {
        name: "Post Development Erosion Control Plan",
        why: `Required within 100 ft of a ${which} overlay.`,
        url: CDP_HANDOUT.url,
      },
    );
    checks.push({
      id: "overlay",
      title: `${which[0].toUpperCase()}${which.slice(1)} overlay`,
      status: "warn",
      detail: `The lot is in the ${which} overlay, which adds geology and erosion studies to the coastal permit.`,
      citation: CDP_HANDOUT,
    });
  }
  if (p.hazards.floodVE || codes.some((c) => c.startsWith("VE"))) {
    documents.push({
      name: "Coastal Hazards Report",
      why: "The lot is in the Special Flood Hazard (VE) overlay. Shoreline properties subject to flooding or wave run-up need one.",
      url: CDP_HANDOUT.url,
    });
  }
  if (p.hazards.fireDesignation === "Special Fire Protection Area") {
    documents.push({
      name: "Fuel modification plan",
      why: "The lot is in a Special Fire Protection Area.",
      url: SUBMITTAL_2014.url,
    });
    checks.push({
      id: "fire",
      title: "Special Fire Protection Area",
      status: "warn",
      detail: "Add a fuel modification plan to the submittal.",
      citation: SUBMITTAL_2014,
    });
  }
  if ((p.hazards.liquefaction || p.hazards.landslide) && isNew) {
    const hz = [p.hazards.liquefaction && "liquefaction", p.hazards.landslide && "landslide"].filter(Boolean).join(" and ");
    documents.push({
      name: "Geotechnical (soils) report (likely)",
      why: `The city's map shows ${hz} risk for this lot.`,
      url: SOILS.url,
    });
    checks.push({
      id: "soils",
      title: "Soils report likely",
      status: "info",
      detail: `The city's map shows ${hz} risk. Plan on a soils report for new construction, and confirm with the Building Division.`,
      citation: SOILS,
    });
  }

  return { eligibility: zone.eligibility, zoneLabel: zone.label, permits, checks, documents };
}
