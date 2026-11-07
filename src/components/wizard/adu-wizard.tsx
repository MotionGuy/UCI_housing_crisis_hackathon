"use client";

import { useMemo, useState } from "react";
import {
  CircleHelp,
  DoorOpen,
  FileSignature,
  House,
  HousePlus,
  MapPin,
  PlayCircle,
  Ruler,
  ShieldCheck,
  Trees,
  UserRound,
  Users,
  Warehouse,
  Waves,
} from "lucide-react";
import type { AduAnswers, AduType, LotType, YesNoUnsure } from "@/lib/adu/types";
import { demoAnswers, demoProfile, fixedAnswers } from "@/lib/adu/demo-application";
import { CITY } from "@/lib/adu/newport-beach";
import { EMPTY_PERSON, EMPTY_PRO, type Person, type Profile } from "@/lib/forms/types";
import type { ParcelLookupResult } from "@/lib/parcel/types";
import { ParcelCard } from "./parcel-card";
import { AduResultsView } from "./results";
import { ReviewView, SubmitView } from "./review";
import { firstBlockedStep, stepIssues, type IssueField, type StepIssue } from "./step-checks";
import { IssueNote, OptionList, Segmented, StepCard, TextField, Toggle, linkClass, type Option } from "./ui";

const STEP_COUNT = 7;

const INITIAL_ANSWERS: AduAnswers = {
  address: "",
  lotType: "existing-single-family",
  coastalZone: "unsure",
  aduType: "detached",
  squareFeet: 750,
  bedrooms: 1,
  heightFeet: 16,
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
  contractor: EMPTY_PRO,
};

const COASTAL: Option<YesNoUnsure>[] = [
  { value: "yes", title: "Yes, it's coastal", description: "We'll add the Coastal Development Permit forms", icon: Waves },
  { value: "no", title: "No", description: "Only the building permit is needed", icon: Trees },
  { value: "unsure", title: "I'm not sure", description: "We'll include the coastal forms just in case", icon: CircleHelp },
];

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
  const [demoLoaded, setDemoLoaded] = useState(false);

  // The $300/sq ft valuation is an estimate (no city source); the review screen labels it.
  const formProfile = useMemo(() => ({ ...p, valuation: p.valuation || a.squareFeet * 300 }), [p, a.squareFeet]);

  const setAnswer = <K extends keyof AduAnswers>(k: K, v: AduAnswers[K]) => setA((prev) => ({ ...prev, [k]: v }));
  const setProfile = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((prev) => ({ ...prev, [k]: v }));
  const setOwner = (k: keyof Person, v: string) => setP((prev) => ({ ...prev, owner: { ...prev.owner, [k]: v } }));

  // "manual": the demo is loaded, so Continue skips the lookup and shows the zoning/APN fields.
  const [lookup, setLookup] = useState<{ status: "idle" | "loading" | "found" | "error" | "manual"; message?: string }>({ status: "idle" });

  /**
   * Fills every answer from the demo application; the presenter then clicks Continue through.
   * The demo is made-up data: it skips the address lookup, and setP(demoProfile) clears any parcel from an earlier lookup.
   */
  const loadDemo = (answers: AduAnswers) => {
    setA(answers);
    setP(demoProfile);
    setLookup({ status: "manual" });
    setDemoLoaded(true);
  };

  // Rules-engine problems for the fields on this step: errors block Continue, warnings don't.
  const issues = useMemo(() => stepIssues(step, a, p), [step, a, p]);
  const blocked = issues.errors.length > 0;
  const blockedHint = "Fix the values marked in red to continue.";
  const fieldError = (f: IssueField) =>
    issues.errors.some((i) => i.field === f) ? <Issues issues={issues} field={f} only="errors" /> : undefined;

  // The Coastal Zone step (1) is skipped when the city's GIS already answered it.
  const skipCoastal = !!p.parcel;
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
    const to = step === 0 && skipCoastal ? 2 : step + 1;
    if (to < STEP_COUNT) setStep(to);
    else setView("results");
  };
  const back = step > 0 ? () => setStep(step === 2 && skipCoastal ? 0 : step - 1) : undefined;

  const changeAddress = (v: string) => {
    setAnswer("address", v);
    if (lookup.status !== "idle") setLookup({ status: "idle" });
    if (p.parcel) setProfile("parcel", undefined);
  };

  const findProperty = async () => {
    setLookup({ status: "loading" });
    try {
      const res = (await (await fetch(`/api/parcel?address=${encodeURIComponent(a.address)}`)).json()) as ParcelLookupResult;
      if (!res.ok) {
        setLookup({ status: "error", message: res.message });
        return;
      }
      const parcel = res.parcel;
      setP((prev) => ({ ...prev, parcel, apn: parcel.apn || prev.apn, zoningDistrict: parcel.zoningDistrict || prev.zoningDistrict }));
      setA((prev) => ({ ...prev, address: parcel.matchedAddress, coastalZone: parcel.coastalZone ? "yes" : "no" }));
      setLookup({ status: "found" });
    } catch {
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
        onLoadFixed={
          demoLoaded
            ? () => {
                setA(fixedAnswers);
                setProfile("parcel", undefined); // the demo address has no parcel
                setLookup({ status: "manual" });
              }
            : undefined
        }
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
      const manual = failed || lookup.status === "manual";
      return (
        <StepCard
          {...common}
          icon={MapPin}
          title="Where's your property?"
          subtitle="We'll look up its zoning, parcel number and Coastal Zone status in the city's map."
          onContinue={found || manual ? () => next() : findProperty}
          continueLabel={found || lookup.status === "manual" ? "Continue" : failed ? "Continue by hand" : lookup.status === "loading" ? "Looking up…" : "Find my property"}
          continueDisabled={!a.address.trim() || lookup.status === "loading" || blocked}
          missingHint={lookup.status === "loading" ? undefined : blocked ? "This lot doesn't qualify for the ADU fast path. Check the address." : "Add the property address to continue."}
        >
          <div className="space-y-4">
            <DemoBar onLoad={loadDemo} loaded={demoLoaded} />
            <TextField label="Property address" required autoComplete="street-address" placeholder="123 Example St, Newport Beach" value={a.address} onChange={changeAddress} />
            {found && <ParcelCard parcel={p.parcel!} />}
            <Issues issues={issues} field="address" />
            {failed && (
              <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-[13.5px] leading-snug text-amber-200">{lookup.message}</p>
            )}
            {manual && (
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
        <StepCard
          {...common}
          icon={Waves}
          title="Is it in the Coastal Zone?"
          subtitle={
            <>
              Much of Newport Beach is. The{" "}
              <a className={linkClass} href={CITY.addressTool} target="_blank" rel="noreferrer">
                Address Search Tool
              </a>{" "}
              shows it.
            </>
          }
        >
          <OptionList options={COASTAL} value={a.coastalZone} onPick={pick("coastalZone")} />
          <Issues issues={issues} field="coastalZone" />
        </StepCard>
      );

    case 2:
      return (
        <StepCard {...common} icon={House} title="What's on the lot now?" subtitle="An ADU is a second home on a single-family lot.">
          <OptionList options={LOTS} value={a.lotType} onPick={pick("lotType")} />
        </StepCard>
      );

    case 3:
      return (
        <StepCard {...common} icon={HousePlus} title="Choose your ADU type" subtitle="What kind of unit do you have in mind?">
          <OptionList options={ADU_TYPES} value={a.aduType} onPick={pick("aduType")} />
        </StepCard>
      );

    case 4:
      return (
        <StepCard {...common} icon={Ruler} title="Size it up" subtitle="Rough numbers are fine. Your designer will confirm them." onContinue={() => next()} continueDisabled={blocked} missingHint={blockedHint}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Size (sq ft)" type="number" inputMode="numeric" value={a.squareFeet || ""} onChange={(v) => setAnswer("squareFeet", Number(v))} error={fieldError("squareFeet")} />
              <TextField label="Bedrooms" type="number" inputMode="numeric" value={Number.isNaN(a.bedrooms) ? "" : a.bedrooms} onChange={(v) => setAnswer("bedrooms", v === "" ? NaN : Number(v))} hint="0 for a studio" error={fieldError("bedrooms")} />
              {isNew && (
                <>
                  <TextField label="Height (ft)" type="number" inputMode="numeric" value={a.heightFeet ?? ""} onChange={(v) => setAnswer("heightFeet", v === "" ? null : Number(v))} error={fieldError("heightFeet")} />
                  <TextField label="Side and rear setback (ft)" type="number" inputMode="numeric" value={a.sideRearSetbackFeet ?? ""} onChange={(v) => setAnswer("sideRearSetbackFeet", v === "" ? null : Number(v))} hint="Distance to the nearest side or rear line" error={fieldError("sideRearSetbackFeet")} />
                </>
              )}
            </div>
            {/* Warnings (e.g. height above the state-guaranteed limit) don't block. */}
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

    case 5: {
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
          title="Tell us about you"
          subtitle="The property owner, as it appears on the deed."
          onContinue={() => next()}
          continueDisabled={missing.length > 0 || blocked}
          missingHint={missingHint ?? blockedHint}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="First name" required autoComplete="given-name" value={o.firstName} onChange={(v) => setOwner("firstName", v)} />
            <TextField label="Last name" required autoComplete="family-name" value={o.lastName} onChange={(v) => setOwner("lastName", v)} />
            <TextField className="sm:col-span-2" label="Mailing address" autoComplete="address-line1" value={o.mailingAddress} onChange={(v) => setOwner("mailingAddress", v)} />
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
      const pro = (k: "designer" | "contractor", field: keyof Profile["designer"], v: string) =>
        setP((prev) => ({ ...prev, [k]: { ...prev[k], [field]: v } }));
      return (
        <StepCard
          {...common}
          icon={Users}
          title="Your team and budget"
          subtitle="Optional. Skip it and add these later."
          onSkip={() => next()}
          onContinue={() => next()}
          continueLabel="Fill my forms"
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
                <FileSignature className="size-4 text-neutral-500" /> Architect or designer
              </p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <TextField label="Name" value={p.designer.name} onChange={(v) => pro("designer", "name", v)} />
                <TextField label="License no." value={p.designer.license} onChange={(v) => pro("designer", "license", v)} />
              </div>
            </div>
            <div>
              <p className="flex items-center gap-2 text-[13px] font-medium text-neutral-300">
                <ShieldCheck className="size-4 text-neutral-500" /> Contractor
              </p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <TextField label="Name or company" value={p.contractor.name} onChange={(v) => pro("contractor", "name", v)} />
                <TextField label="License no." value={p.contractor.license} onChange={(v) => pro("contractor", "license", v)} />
              </div>
            </div>
          </div>
        </StepCard>
      );
    }
  }
}

/** "Load demo application" / "Load fixed version", for the live demo. */
function DemoBar({ onLoad, loaded }: { onLoad: (a: AduAnswers) => void; loaded: boolean }) {
  const btn =
    "flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-[13px] font-medium text-neutral-200 transition hover:bg-white/[0.07] active:scale-[0.97]";
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-white/12 p-2.5">
      <button type="button" className={btn} onClick={() => onLoad(demoAnswers)}>
        <PlayCircle className="size-4 text-accent" /> Load demo application
      </button>
      <button type="button" className={btn} onClick={() => onLoad(fixedAnswers)}>
        Load fixed version
      </button>
      <span className="text-xs text-neutral-500">{loaded ? "Sample data loaded. Click Continue." : "Made-up sample data"}</span>
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
