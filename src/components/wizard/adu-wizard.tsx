"use client";

import { useState } from "react";
import {
  CircleHelp,
  DoorOpen,
  FileSignature,
  House,
  HousePlus,
  MapPin,
  Ruler,
  ShieldCheck,
  Trees,
  UserRound,
  Users,
  Warehouse,
  Waves,
} from "lucide-react";
import type { AduAnswers, AduType, LotType, YesNoUnsure } from "@/lib/adu/types";
import { CITY } from "@/lib/adu/newport-beach";
import { EMPTY_PERSON, EMPTY_PRO, type Person, type Profile } from "@/lib/forms/types";
import { AduResultsView } from "./results";
import { OptionList, Segmented, StepCard, TextField, Toggle, linkClass, type Option } from "./ui";

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
  const [done, setDone] = useState(false);

  const setAnswer = <K extends keyof AduAnswers>(k: K, v: AduAnswers[K]) => setA((prev) => ({ ...prev, [k]: v }));
  const setProfile = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((prev) => ({ ...prev, [k]: v }));
  const setOwner = (k: keyof Person, v: string) => setP((prev) => ({ ...prev, owner: { ...prev.owner, [k]: v } }));

  const next = () => (step + 1 < STEP_COUNT ? setStep(step + 1) : setDone(true));
  const back = step > 0 ? () => setStep(step - 1) : undefined;
  const pick =
    <K extends keyof AduAnswers>(k: K) =>
    (v: AduAnswers[K]) => {
      setAnswer(k, v);
      next();
    };

  if (done) {
    return (
      <AduResultsView
        answers={a}
        profile={{ ...p, valuation: p.valuation || a.squareFeet * 300 }}
        onEdit={() => {
          setDone(false);
          setStep(0);
        }}
      />
    );
  }

  const isNew = a.aduType === "detached" || a.aduType === "attached";
  const common = { step, total: STEP_COUNT, onBack: back };

  switch (step) {
    case 0:
      return (
        <StepCard
          {...common}
          icon={MapPin}
          title="Where's your property?"
          subtitle="We'll use this on every form. Find your zoning in the city's Address Search Tool."
          onContinue={next}
          continueDisabled={!a.address.trim()}
          missingHint="Add the property address to continue."
        >
          <div className="space-y-4">
            <TextField label="Property address" required autoComplete="street-address" placeholder="123 Example St, Newport Beach, CA 92663" value={a.address} onChange={(v) => setAnswer("address", v)} />
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
          </div>
        </StepCard>
      );

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
        <StepCard {...common} icon={Ruler} title="Size it up" subtitle="Rough numbers are fine. Your designer will confirm them." onContinue={next} continueDisabled={!(a.squareFeet > 0)} missingHint="Add the size in square feet to continue.">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Size (sq ft)" type="number" inputMode="numeric" value={a.squareFeet || ""} onChange={(v) => setAnswer("squareFeet", Number(v))} />
              <TextField label="Bedrooms" type="number" inputMode="numeric" value={a.bedrooms} onChange={(v) => setAnswer("bedrooms", Number(v))} hint="0 for a studio" />
              {isNew && (
                <>
                  <TextField label="Height (ft)" type="number" inputMode="numeric" value={a.heightFeet ?? ""} onChange={(v) => setAnswer("heightFeet", Number(v))} />
                  <TextField label="Side and rear setback (ft)" type="number" inputMode="numeric" value={a.sideRearSetbackFeet ?? ""} onChange={(v) => setAnswer("sideRearSetbackFeet", Number(v))} hint="Distance to the nearest side or rear line" />
                </>
              )}
            </div>
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
          onContinue={next}
          continueDisabled={missing.length > 0}
          missingHint={missingHint}
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
          onSkip={next}
          onContinue={next}
          continueLabel="Fill my forms"
        >
          <div className="space-y-5">
            <TextField
              label="Estimated construction cost ($)"
              type="number"
              inputMode="numeric"
              placeholder={`${(a.squareFeet * 300).toLocaleString("en-US")} (city estimate: $300 per sq ft)`}
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

/** ["a", "b", "c"] -> "a, b and c" */
function listWords(words: string[]): string {
  return words.length < 2 ? words.join("") : `${words.slice(0, -1).join(", ")} and ${words.at(-1)}`;
}
