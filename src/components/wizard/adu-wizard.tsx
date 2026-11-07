"use client";

import { useMemo, useState } from "react";
import {
  DoorOpen,
  FileSignature,
  HardHat,
  House,
  HousePlus,
  MapPin,
  Ruler,
  ShieldCheck,
  UserRound,
  Users,
  Warehouse,
} from "lucide-react";
import type { AduAnswers, AduType, LotType, YesNoUnsure } from "@/lib/adu/types";
import { CITY } from "@/lib/adu/newport-beach";
import { EMPTY_PERSON, EMPTY_PRO, type Builder, type Person, type Professional, type Profile } from "@/lib/forms/types";
import type { ParcelLookupResult } from "@/lib/parcel/types";
import { ParcelCard } from "./parcel-card";
import { AduResultsView } from "./results";
import { ReviewView, SubmitView } from "./review";
import { TEAM_SOURCES, firstBlockedStep, mailingFromProject, stepIssues, type IssueField, type StepIssue } from "./step-checks";
import { IssueNote, OptionList, Segmented, StepCard, TextField, Toggle, linkClass, type Option } from "./ui";

const STEP_COUNT = 6;

const INITIAL_ANSWERS: AduAnswers = {
  address: "",
  lotType: "existing-single-family",
  coastalZone: "unsure",
  aduType: "detached",
  squareFeet: 750,
  bedrooms: 1,
  heightFeet: 16,
  houseHeightFeet: null,
  sideRearSetbackFeet: 4,
  nearTransit: "unsure",
  convertingGarage: false,
  ownerLivesOnSite: true,
  usingPreapprovedPlan: false,
};

const INITIAL_PROFILE: Profile = {
  owner: EMPTY_PERSON,
  applicantIsOwner: true,
  applicant: EMPTY_PERSON,
  apn: "",
  zoningDistrict: "",
  valuation: 0,
  designer: EMPTY_PRO,
  engineer: EMPTY_PRO,
  contractor: EMPTY_PRO,
  designerIsArchitect: null,
  builder: null,
};

const LOTS: Option<LotType>[] = [
  { value: "existing-single-family", title: "A single-family house", description: "The most common ADU project", icon: House },
  { value: "planned-single-family", title: "Nothing yet, building a house too", description: "Submit the house and ADU together", icon: HousePlus },
];

const ADU_TYPES: Option<AduType>[] = [
  { value: "detached", title: "Detached ADU", description: "A new separate building, up to 1,000 sq ft", icon: HousePlus },
  { value: "attached", title: "Attached ADU", description: "A new addition to your house", icon: House },
  { value: "converted", title: "Converted space", description: "Turn a garage, room or shed into a unit", icon: Warehouse },
  { value: "jadu", title: "Junior ADU", description: "Up to 500 sq ft inside your house", icon: DoorOpen },
];

export function AduWizard() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<AduAnswers>(INITIAL_ANSWERS);
  const [p, setP] = useState<Profile>(INITIAL_PROFILE);
  const [view, setView] = useState<"intake" | "results" | "review" | "submit">("intake");
  /** Set when a step was opened from the review screen; Continue goes back there. */
  const [returnToReview, setReturnToReview] = useState(false);

  // The $300/sq ft valuation is an estimate (no city source); the review screen labels it.
  const formProfile = useMemo(() => ({ ...p, valuation: p.valuation || a.squareFeet * 300 }), [p, a.squareFeet]);

  const setAnswer = <K extends keyof AduAnswers>(k: K, v: AduAnswers[K]) => setA((prev) => ({ ...prev, [k]: v }));
  const setProfile = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((prev) => ({ ...prev, [k]: v }));
  const setOwner = (k: keyof Person, v: string) => setP((prev) => ({ ...prev, owner: { ...prev.owner, [k]: v } }));

  // "error": the lookup failed, so the user continues by hand (zoning/APN fields shown).
  const [lookup, setLookup] = useState<{ status: "idle" | "loading" | "found" | "error"; message?: string }>({ status: "idle" });

  // Rules-engine problems for the fields on this step: errors block Continue, warnings don't.
  const issues = useMemo(() => stepIssues(step, a, p), [step, a, p]);
  const blocked = issues.errors.length > 0;
  const blockedHint = "Fix the values marked in red to continue.";
  const fieldError = (f: IssueField) =>
    issues.errors.some((i) => i.field === f) ? <Issues issues={issues} field={f} only="errors" /> : undefined;

  /** Moves on from the current step. Pass the answers when they were just set (option steps). */
  const next = (answers: AduAnswers = a) => {
    if (stepIssues(step, answers, p).errors.length > 0) return;
    if (returnToReview) {
      // A change (e.g. a new ADU type) can break a later step: send the user there first.
      const broken = firstBlockedStep(answers, p, STEP_COUNT);
      if (broken >= 0 && broken !== step) {
        setStep(broken);
        return;
      }
      setReturnToReview(false);
      setView("review");
      return;
    }
    if (step + 1 < STEP_COUNT) setStep(step + 1);
    else setView("results");
  };
  const back = step > 0 ? () => setStep(step - 1) : undefined;

  const changeAddress = (v: string) => {
    setAnswer("address", v);
    if (lookup.status !== "idle") setLookup({ status: "idle" });
    if (p.parcel) {
      // The Coastal Zone answer came from the old parcel: unknown again until the next lookup.
      setProfile("parcel", undefined);
      setAnswer("coastalZone", "unsure");
    }
  };

  const findProperty = async () => {
    setLookup({ status: "loading" });
    try {
      const res = (await (await fetch(`/api/parcel?address=${encodeURIComponent(a.address)}`)).json()) as ParcelLookupResult;
      if (!res.ok) {
        setAnswer("coastalZone", "unsure");
        setLookup({ status: "error", message: res.message });
        return;
      }
      const parcel = res.parcel;
      setP((prev) => ({ ...prev, parcel, apn: parcel.apn || prev.apn, zoningDistrict: parcel.zoningDistrict || prev.zoningDistrict }));
      setA((prev) => ({ ...prev, address: parcel.matchedAddress, coastalZone: parcel.coastalZone ? "yes" : "no" }));
      setLookup({ status: "found" });
    } catch {
      setAnswer("coastalZone", "unsure");
      setLookup({ status: "error", message: "The lookup didn't work. You can enter the details by hand." });
    }
  };

  const pick =
    <K extends keyof AduAnswers>(k: K) =>
    (v: AduAnswers[K]) => {
      const answers = { ...a, [k]: v };
      setA(answers);
      next(answers);
    };

  if (view === "results") {
    return (
      <AduResultsView
        answers={a}
        profile={formProfile}
        onReview={() => setView("review")}
        onEdit={() => {
          setView("intake");
          setStep(0);
        }}
      />
    );
  }
  if (view === "review") {
    return (
      <ReviewView
        answers={a}
        profile={formProfile}
        valuationEstimated={!p.valuation}
        onBack={() => setView("results")}
        onEditStep={(s) => {
          setStep(s);
          setReturnToReview(true);
          setView("intake");
        }}
        onSubmit={() => setView("submit")}
      />
    );
  }
  if (view === "submit") {
    return <SubmitView answers={a} profile={formProfile} onBack={() => setView("review")} />;
  }

  const isNew = a.aduType === "detached" || a.aduType === "attached";
  const common = { step, total: STEP_COUNT, onBack: back };

  switch (step) {
    case 0: {
      const found = lookup.status === "found" && p.parcel;
      const failed = lookup.status === "error";
      return (
        <StepCard
          {...common}
          icon={MapPin}
          title="Where's your property?"
          subtitle="We'll look up its zoning, parcel number and Coastal Zone status in the city's map."
          onContinue={found || failed ? () => next() : findProperty}
          continueLabel={found ? "Continue" : failed ? "Continue by hand" : lookup.status === "loading" ? "Looking up…" : "Find my property"}
          continueDisabled={!a.address.trim() || lookup.status === "loading" || blocked}
          missingHint={lookup.status === "loading" ? undefined : blocked ? "This lot doesn't qualify for the ADU fast path. Check the address." : "Add the property address to continue."}
        >
          <div className="space-y-4">
            <TextField label="Property address" required autoComplete="street-address" placeholder="123 Example St, Newport Beach" value={a.address} onChange={changeAddress} />
            {found && <ParcelCard parcel={p.parcel!} />}
            <Issues issues={issues} field="address" />
            {failed && (
              <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-[13.5px] leading-snug text-amber-200">{lookup.message}</p>
            )}
            {/* No lookup: the engine's "coastal" warning (coastalZone "unsure"). Doesn't block. */}
            {failed && <Issues issues={issues} field="coastalZone" />}
            {failed && (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Zoning district"
                placeholder="e.g. R-1"
                value={p.zoningDistrict}
                onChange={(v) => setProfile("zoningDistrict", v.toUpperCase())}
                hint={
                  <a className={linkClass} href={CITY.addressTool} target="_blank" rel="noreferrer">
                    Look it up
                  </a>
                }
              />
              <TextField label="Parcel number (APN)" placeholder="Optional" value={p.apn} onChange={(v) => setProfile("apn", v)} hint="On your property tax bill" />
            </div>
            )}
          </div>
        </StepCard>
      );
    }

    case 1:
      return (
        <StepCard {...common} icon={House} title="What's on the lot now?" subtitle="An ADU is a second home on a single-family lot.">
          <OptionList options={LOTS} value={a.lotType} onPick={pick("lotType")} />
        </StepCard>
      );

    case 2:
      return (
        <StepCard {...common} icon={HousePlus} title="Choose your ADU type" subtitle="What kind of unit do you have in mind?">
          <OptionList options={ADU_TYPES} value={a.aduType} onPick={pick("aduType")} />
        </StepCard>
      );

    case 3:
      return (
        <StepCard {...common} icon={Ruler} title="Size it up" subtitle="Rough numbers are fine. Your designer will confirm them." onContinue={() => next()} continueDisabled={blocked} missingHint={blockedHint}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Size (sq ft)" type="number" inputMode="numeric" value={a.squareFeet || ""} onChange={(v) => setAnswer("squareFeet", Number(v))} error={fieldError("squareFeet")} />
              <TextField label="Bedrooms" type="number" inputMode="numeric" value={Number.isNaN(a.bedrooms) ? "" : a.bedrooms} onChange={(v) => setAnswer("bedrooms", v === "" ? NaN : Number(v))} hint="0 for a studio" error={fieldError("bedrooms")} />
              {isNew && (
                <>
                  <TextField label="ADU height (ft)" type="number" inputMode="numeric" value={a.heightFeet ?? ""} onChange={(v) => setAnswer("heightFeet", v === "" ? null : Number(v))} error={fieldError("heightFeet")} />
                  <TextField label="Height of the main house (ft)" type="number" inputMode="numeric" value={a.houseHeightFeet ?? ""} onChange={(v) => setAnswer("houseHeightFeet", v === "" ? null : Number(v))} error={fieldError("houseHeightFeet")} />
                  <TextField label="Side and rear setback (ft)" type="number" inputMode="numeric" value={a.sideRearSetbackFeet ?? ""} onChange={(v) => setAnswer("sideRearSetbackFeet", v === "" ? null : Number(v))} hint="Distance to the nearest side or rear line" error={fieldError("sideRearSetbackFeet")} />
                </>
              )}
            </div>
            {/* Warnings (e.g. height above the 16 ft state guarantee) don't block. */}
            <Issues issues={issues} only="warnings" />
            <Segmented<YesNoUnsure>
              label="Public transit within a half-mile walk? (a bus stop counts)"
              value={a.nearTransit}
              onChange={(v) => setAnswer("nearTransit", v)}
              options={[["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]]}
            />
            <Toggle label="I'm converting a garage" checked={a.convertingGarage} onChange={(v) => setAnswer("convertingGarage", v)} />
            <Toggle label="I'll use a city pre-approved plan" checked={a.usingPreapprovedPlan} onChange={(v) => setAnswer("usingPreapprovedPlan", v)} />
          </div>
        </StepCard>
      );

    case 4: {
      const o = p.owner;
      const missing = [
        !o.firstName.trim() && "first name",
        !o.lastName.trim() && "last name",
        !o.email.trim() && !o.phone.trim() && "an email or phone",
      ].filter(Boolean) as string[];
      const missingHint = missing.length ? `Add ${listWords(missing)} to continue.` : undefined;
      return (
        <StepCard
          {...common}
          icon={UserRound}
          title="Personal information"
          subtitle="The property owner, as it appears on the deed."
          onContinue={() => next()}
          continueDisabled={missing.length > 0 || blocked}
          missingHint={missingHint ?? blockedHint}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="First name" required autoComplete="given-name" value={o.firstName} onChange={(v) => setOwner("firstName", v)} />
            <TextField label="Last name" required autoComplete="family-name" value={o.lastName} onChange={(v) => setOwner("lastName", v)} />
            <div className="sm:col-span-2">
              <SameAsProject onClick={() => setP((prev) => ({ ...prev, owner: { ...prev.owner, ...mailingFromProject(a, prev) } }))} />
              <TextField label="Mailing address" autoComplete="address-line1" value={o.mailingAddress} onChange={(v) => setOwner("mailingAddress", v)} />
            </div>
            <TextField label="City" autoComplete="address-level2" value={o.city} onChange={(v) => setOwner("city", v)} />
            <div className="grid grid-cols-2 gap-4">
              <TextField label="State" autoComplete="address-level1" value={o.state} onChange={(v) => setOwner("state", v)} />
              <TextField label="ZIP" inputMode="numeric" autoComplete="postal-code" value={o.zip} onChange={(v) => setOwner("zip", v)} />
            </div>
            <TextField label="Email" type="email" autoComplete="email" value={o.email} onChange={(v) => setOwner("email", v)} />
            <TextField label="Phone" type="tel" autoComplete="tel" value={o.phone} onChange={(v) => setOwner("phone", v)} />
            <div className="sm:col-span-2 space-y-3">
              <Toggle label="The owner will live on the property" checked={a.ownerLivesOnSite} onChange={(v) => setAnswer("ownerLivesOnSite", v)} />
              <Issues issues={issues} field="ownerLivesOnSite" />
              <Toggle label="I'm the one applying (applicant is the owner)" checked={p.applicantIsOwner} onChange={(v) => setProfile("applicantIsOwner", v)} />
            </div>
            {!p.applicantIsOwner && (
              <>
                <TextField label="Applicant first name" value={p.applicant.firstName} onChange={(v) => setProfile("applicant", { ...p.applicant, firstName: v })} />
                <TextField label="Applicant last name" value={p.applicant.lastName} onChange={(v) => setProfile("applicant", { ...p.applicant, lastName: v })} />
                <TextField label="Applicant email" type="email" value={p.applicant.email} onChange={(v) => setProfile("applicant", { ...p.applicant, email: v })} />
                <TextField label="Applicant phone" type="tel" value={p.applicant.phone} onChange={(v) => setProfile("applicant", { ...p.applicant, phone: v })} />
              </>
            )}
          </div>
        </StepCard>
      );
    }

    default: {
      type ProKey = "designer" | "engineer" | "contractor";
      const pro = (k: ProKey, field: keyof Professional, v: string) => setP((prev) => ({ ...prev, [k]: { ...prev[k], [field]: v } }));
      // Red border on each empty required input of a group; the message shows once under the group.
      const missingOf = (f: IssueField) => new Set(issues.errors.find((i) => i.field === f)?.missing ?? []);
      const designerMissing = missingOf("designer");
      const engineerMissing = missingOf("engineer");
      const contractorMissing = missingOf("contractor");
      const needsEngineer = p.designerIsArchitect === false;
      const engineerFields = (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="Name" required={needsEngineer} invalid={engineerMissing.has("name")} value={p.engineer.name} onChange={(v) => pro("engineer", "name", v)} />
            <TextField label="License no." required={needsEngineer} invalid={engineerMissing.has("license")} value={p.engineer.license} onChange={(v) => pro("engineer", "license", v)} />
          </div>
          <ProContactFields v={p.engineer} required={needsEngineer} missing={engineerMissing} onChange={(f, v) => pro("engineer", f, v)} />
        </>
      );
      return (
        <StepCard
          {...common}
          icon={Users}
          title="Your team and budget"
          subtitle="Who drew your plans and who will build it. The budget is optional."
          onContinue={() => next()}
          continueLabel="Fill my forms"
          continueDisabled={blocked}
          missingHint={blockedHint}
        >
          <div className="space-y-5">
            <TextField
              label="Estimated construction cost ($)"
              type="number"
              inputMode="numeric"
              placeholder={`${(a.squareFeet * 300).toLocaleString("en-US")} (Estimate: $300 per sq ft)`}
              value={p.valuation || ""}
              onChange={(v) => setProfile("valuation", Number(v))}
            />
            <div>
              <p className="flex items-center gap-2 text-[13px] font-medium text-neutral-300">
                <FileSignature className="size-4 text-neutral-500" /> Architect or designer (whoever drew your plans)
              </p>
              <div className="mt-2 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField label="Name" required invalid={designerMissing.has("name")} value={p.designer.name} onChange={(v) => pro("designer", "name", v)} />
                  <TextField
                    label="License no."
                    value={p.designer.license}
                    onChange={(v) => pro("designer", "license", v)}
                    hint="Leave blank if your designer isn't a licensed architect."
                  />
                </div>
                <ProContactFields v={p.designer} required missing={designerMissing} onChange={(f, v) => pro("designer", f, v)} />
                <Issues issues={issues} field="designer" only="errors" />
                <Segmented<"yes" | "no">
                  label="Is your designer a licensed architect? *"
                  value={(p.designerIsArchitect === null ? "" : p.designerIsArchitect ? "yes" : "no") as "yes" | "no"}
                  onChange={(v) => setProfile("designerIsArchitect", v === "yes")}
                  options={[["yes", "Yes"], ["no", "No"]]}
                />
                <p className="text-xs leading-snug text-neutral-500">
                  A designer doesn&apos;t need a license to draw a single-family home or its ADU (
                  <a className={linkClass} href={TEAM_SOURCES.unlicensedDesigner.url} target="_blank" rel="noreferrer">
                    Bus. &amp; Prof. Code § 5537(a)
                  </a>
                  ).
                </p>
                <Issues issues={issues} field="designerIsArchitect" only="errors" />
              </div>
            </div>
            <div>
              <p className="flex items-center gap-2 text-[13px] font-medium text-neutral-300">
                <HardHat className="size-4 text-neutral-500" /> {needsEngineer ? "Engineer (stamps your plans)" : "Engineer (if you have one)"}
              </p>
              {needsEngineer ? (
                <div className="mt-2 space-y-3">
                  {engineerFields}
                  <Issues issues={issues} field="engineer" only="errors" />
                </div>
              ) : (
                <>
                  {p.designerIsArchitect && (
                    <p className="mt-1 text-xs leading-snug text-neutral-500">Optional. Add an engineer only if one prepared your structural calculations.</p>
                  )}
                  <MoreFields summary="Add an engineer" defaultOpen={!!p.engineer.name || !!p.engineer.license || hasContact(p.engineer)}>
                    {engineerFields}
                  </MoreFields>
                </>
              )}
            </div>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-[13px] font-medium text-neutral-300">
                <ShieldCheck className="size-4 text-neutral-500" /> Who will build it?
              </p>
              <Segmented<Builder>
                label="Choose one *"
                value={p.builder as Builder}
                onChange={(v) => setProfile("builder", v)}
                options={[["contractor", "Licensed contractor"], ["owner-builder", "Me (owner-builder)"], ["undecided", "Not chosen yet"]]}
              />
              <Issues issues={issues} field="builder" only="errors" />
              {p.builder === "contractor" && (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextField label="Name or company" required invalid={contractorMissing.has("name")} value={p.contractor.name} onChange={(v) => pro("contractor", "name", v)} />
                    <TextField label="License no." required invalid={contractorMissing.has("license")} value={p.contractor.license} onChange={(v) => pro("contractor", "license", v)} hint="California contractor's license (CSLB)" />
                    <TextField label="Email" type="email" required invalid={contractorMissing.has("email")} value={p.contractor.email} onChange={(v) => pro("contractor", "email", v)} hint="Use the email on their CiViC account" />
                    <TextField label="Phone" type="tel" required invalid={contractorMissing.has("phone")} value={p.contractor.phone} onChange={(v) => pro("contractor", "phone", v)} />
                  </div>
                  <Issues issues={issues} field="contractor" only="errors" />
                </>
              )}
              {p.builder === "owner-builder" && (
                <InfoNote citation={TEAM_SOURCES.ownerBuilderForm}>
                  You&apos;ll sign the city&apos;s Owner-Builder Acknowledgement form and show your driver&apos;s license (or a notarized form) when the permit is issued. You also need your own CiViC account.
                </InfoNote>
              )}
              {p.builder === "undecided" && (
                <InfoNote citation={TEAM_SOURCES.licenseBeforePermit}>
                  You can submit for plan check without a contractor. Before the city issues your permit, you&apos;ll need to add a licensed contractor (with license number and a CiViC account email) or sign up as an owner-builder.
                </InfoNote>
              )}
            </div>
          </div>
        </StepCard>
      );
    }
  }
}

/** Small secondary button that copies the project address into a mailing address (the user can still edit it). */
function SameAsProject({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-2 flex h-8 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-xs text-neutral-300 transition hover:bg-white/[0.06]"
    >
      <MapPin className="size-3.5" /> Same as project address
    </button>
  );
}

/** A neutral note with its source (not a problem; never blocks). */
function InfoNote({ children, citation }: { children: React.ReactNode; citation: { label: string; url: string } }) {
  return (
    <p className="rounded-xl border border-sky-400/25 bg-sky-400/[0.06] p-3 text-[13.5px] leading-snug text-sky-100">
      {children}
      <span className="mt-1 block text-xs text-neutral-400">
        Source:{" "}
        <a className={linkClass} href={citation.url} target="_blank" rel="noreferrer">
          {citation.label}
        </a>
      </span>
    </p>
  );
}

/** True when any optional contact or address field of a designer/engineer is filled. */
function hasContact(v: Professional): boolean {
  return [v.email, v.phone, v.address, v.city, v.state, v.zip].some((x) => !!x?.trim());
}

/** Collapsed group of optional fields. Opens by default when it already holds values. */
function MoreFields({ summary, defaultOpen, children }: { summary: string; defaultOpen: boolean; children: React.ReactNode }) {
  const [open] = useState(defaultOpen);
  return (
    <details className="group mt-2" open={open}>
      <summary className="cursor-pointer list-none text-[13px] font-medium text-accent hover:underline">
        <span className="group-open:hidden">+ {summary}</span>
        <span className="hidden group-open:inline">− {summary}</span>
      </summary>
      <div className="mt-3 space-y-3">{children}</div>
    </details>
  );
}

/** Email, phone and office address of a designer or engineer. `missing` marks empty required inputs red. */
function ProContactFields({
  v,
  required,
  missing,
  onChange,
}: {
  v: Professional;
  required?: boolean;
  missing?: Set<keyof Professional>;
  onChange: (field: keyof Professional, value: string) => void;
}) {
  const bad = (k: keyof Professional) => !!missing?.has(k);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <TextField label="Email" type="email" required={required} invalid={bad("email")} value={v.email} onChange={(x) => onChange("email", x)} />
      <TextField label="Phone" type="tel" required={required} invalid={bad("phone")} value={v.phone} onChange={(x) => onChange("phone", x)} />
      <TextField className="sm:col-span-2" label="Office address" required={required} invalid={bad("address")} value={v.address ?? ""} onChange={(x) => onChange("address", x)} />
      <TextField label="City" required={required} invalid={bad("city")} value={v.city ?? ""} onChange={(x) => onChange("city", x)} />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="State" required={required} invalid={bad("state")} value={v.state ?? ""} onChange={(x) => onChange("state", x)} />
        <TextField label="ZIP" inputMode="numeric" required={required} invalid={bad("zip")} value={v.zip ?? ""} onChange={(x) => onChange("zip", x)} />
      </div>
    </div>
  );
}

/** Engine messages for one field (or the whole step). Errors are red, warnings amber. */
function Issues({ issues, field, only }: { issues: { errors: StepIssue[]; warnings: StepIssue[] }; field?: IssueField; only?: "errors" | "warnings" }) {
  const of = (list: StepIssue[]) => (field ? list.filter((i) => i.field === field) : list);
  const errors = only === "warnings" ? [] : of(issues.errors);
  const warnings = only === "errors" ? [] : of(issues.warnings);
  if (!errors.length && !warnings.length) return null;
  return (
    <span className="block">
      {errors.map((i) => (
        <IssueNote key={`e-${i.id}-${i.field}`} tone="error" message={i.message} limit={i.limit} citation={i.citation} />
      ))}
      {warnings.map((i) => (
        <IssueNote key={`w-${i.id}-${i.field}`} tone="warning" title={i.title} message={i.message} citation={i.citation} />
      ))}
    </span>
  );
}

/** ["a", "b", "c"] -> "a, b and c" */
function listWords(words: string[]): string {
  return words.length < 2 ? words.join("") : `${words.slice(0, -1).join(", ")} and ${words.at(-1)}`;
}
