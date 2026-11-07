"use client";

import { useMemo, useState } from "react";
import { ClipboardCheck, Download, FileText, LoaderCircle, PencilLine, Send, TriangleAlert } from "lucide-react";
import { CITY } from "@/lib/adu/newport-beach";
import type { AduAnswers, AduResult } from "@/lib/adu/types";
import { describeWork } from "@/lib/forms/fill";
import type { FilledForm, Person, Profile } from "@/lib/forms/types";
import { PdfPreview, useFilledForms } from "./form-preview";
import { CheckRow, StatusBanner, combineResults, issuesOf } from "./results";
import { StepCard, linkClass } from "./ui";

/** Wizard step that sets each value (see AduWizard). */
export const STEPS = { address: 0, coastal: 1, lot: 2, aduType: 3, size: 4, owner: 5, team: 6 } as const;

interface PreviewField {
  label: string;
  value: string;
  /** Wizard step to change it; absent = set by AutoADU. */
  step?: number;
  note?: string;
}

interface PreviewForm {
  id: string;
  title: string;
  fields: PreviewField[];
}

/**
 * Every value fillAllForms writes into each form, with the form's printed
 * labels in plain English. Mirrors src/lib/forms/fill.ts; keep the two in sync.
 */
export function autofillPreview(a: AduAnswers, p: Profile, valuationEstimated: boolean, today = new Date()): PreviewForm[] {
  const isNew = a.aduType === "detached" || a.aduType === "attached";
  const applicant = p.applicantIsOwner ? p.owner : p.applicant;
  const sameAsOwner = p.applicantIsOwner ? "Same as owner" : undefined;
  const person = (who: string, v: Person, note?: string): PreviewField[] => [
    { label: `${who} name (last, first)`, value: [v.lastName, v.firstName].filter(Boolean).join(", "), step: STEPS.owner, note },
    { label: `${who} mailing address`, value: [v.mailingAddress, v.city, [v.state, v.zip].filter(Boolean).join(" ")].filter(Boolean).join(", "), step: STEPS.owner, note },
    { label: `${who} email`, value: v.email, step: STEPS.owner, note },
    { label: `${who} phone`, value: v.phone, step: STEPS.owner, note },
  ];
  const pro = (who: string, v: Profile["designer"]): PreviewField[] =>
    [
      { label: `${who} name`, value: v.name, step: STEPS.team },
      { label: `${who} license no.`, value: v.license, step: STEPS.team },
      { label: `${who} email`, value: v.email, step: STEPS.team },
      { label: `${who} phone`, value: v.phone, step: STEPS.team },
    ].filter((f) => f.value || f.label.endsWith("name") || f.label.endsWith("license no."));
  // Hazard boxes are checked only from the city's GIS (no lookup: left blank).
  const hz = p.parcel?.hazards;
  const hazards = hz
    ? [hz.floodVE && "Flood", hz.fireDesignation && "Fire", hz.liquefaction && "Liquefaction", hz.landslide && "Landslide"].filter(
        (h): h is string => !!h,
      )
    : null;
  // In the Coastal Commission's permit jurisdiction the city gives an Approval in Concept instead.
  const commissionIssues = p.parcel?.coastalAppealArea.toUpperCase() === "PERMIT JURISDICTION";

  const forms: PreviewForm[] = [
    {
      id: "worksheet",
      title: "Building permit application (Combo Building & Solar worksheet)",
      fields: [
        { label: "Project type", value: "Residential" },
        {
          label: "Permits included",
          value: "Building, Electrical, Mechanical, Plumbing",
          note: "Assumption: every ADU needs new wiring, plumbing and ventilation.",
        },
        ...(hazards
          ? [
              {
                label: "Hazards (Flood / Fire / Liq / Landslide / N/A)",
                value: hazards.length ? hazards.join(", ") : "N/A",
                step: STEPS.address,
                note: "From the city's map for this address.",
              },
            ]
          : []),
        { label: "Project address (not mailing address)", value: a.address, step: STEPS.address },
        { label: "Use", value: a.aduType === "jadu" ? "JADU" : "ADU", step: STEPS.aduType },
        { label: "Description of work", value: describeWork(a), step: STEPS.size },
        { label: "Number of stories", value: "1" },
        { label: "Number of units", value: "1" },
        {
          label: "Valuation (materials and labor)",
          value: p.valuation > 0 ? `$${Math.round(p.valuation).toLocaleString("en-US")}` : "",
          step: STEPS.team,
          note: valuationEstimated ? "Estimate: $300 per sq ft. Replace it with your designer's or contractor's number." : undefined,
        },
        { label: isNew ? "New / added floor area (sq ft)" : "Remodeled floor area (sq ft)", value: String(a.squareFeet), step: STEPS.size },
        ...person("Owner", p.owner),
        ...person("Applicant", applicant, sameAsOwner),
        ...pro("Architect / designer", p.designer),
        ...pro("Contractor", p.contractor),
      ],
    },
  ];
  if (a.coastalZone !== "no") {
    forms.push({
      id: "affidavit",
      title: "Owner's Affidavit (Coastal Development Permit)",
      fields: [
        {
          label: "Permit requested",
          value: commissionIssues ? "Approval in Concept" : "Coastal Development Permit",
          // With a lookup the city's map answered the Coastal Zone question, so change the address instead.
          step: p.parcel ? STEPS.address : STEPS.coastal,
          note: commissionIssues
            ? "The city's map puts this lot in the Coastal Commission's permit jurisdiction: the city gives an Approval in Concept and the Commission issues the CDP."
            : a.coastalZone === "unsure"
              ? "Included because you're not sure the lot is in the Coastal Zone."
              : undefined,
        },
        {
          label: "Project address / parcel number (APN)",
          value: [p.parcel?.matchedAddress ?? a.address, p.apn && `APN ${p.apn}`].filter(Boolean).join(" / "),
          step: STEPS.address,
        },
        { label: "Project description", value: describeWork(a), step: STEPS.size },
        { label: "Property owner name(s)", value: `${p.owner.firstName} ${p.owner.lastName}`.trim(), step: STEPS.owner },
        { label: "Signer's title", value: "Owner" },
        {
          label: "Date",
          value: today.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }),
          note: "You still sign this form by hand.",
        },
      ],
    });
  }
  return forms;
}

/** Review every autofilled value, then confirm before Submit. */
export function ReviewView({
  answers,
  profile,
  valuationEstimated,
  onBack,
  onEditStep,
  onSubmit,
}: {
  answers: AduAnswers;
  profile: Profile;
  valuationEstimated: boolean;
  onBack: () => void;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
}) {
  const { result, checks, notAllowed } = useMemo(() => combineResults(answers, profile), [answers, profile]);
  const forms = useMemo(() => autofillPreview(answers, profile, valuationEstimated), [answers, profile, valuationEstimated]);
  const [confirmed, setConfirmed] = useState(false);
  const pdfs = useFilledForms(answers, profile);
  const { fails, warns } = issuesOf(checks);
  const blocked = fails.length > 0 || notAllowed || result.verdict === "out-of-scope";
  const conflicts = result.documents.filter((d) => d.warning);

  return (
    <StepCard
      step={0}
      total={0}
      icon={ClipboardCheck}
      title="Check what we filled in"
      subtitle="Every value AutoADU put on your city forms. Change anything that's wrong."
      onBack={onBack}
      onContinue={onSubmit}
      continueLabel="Submit"
      continueDisabled={blocked || !confirmed}
      missingHint={blocked ? "Fix these first: change the items marked in red." : "Confirm you checked these values to continue."}
      wide
    >
      <div className="space-y-8">
        {(blocked || warns.length > 0 || conflicts.length > 0) && (
          <div className="space-y-3">
            {fails.length > 0 && <StatusBanner fails={fails.length} warns={warns.length} />}
            <ul className="space-y-2">
              {[...fails, ...warns].map((c) => (
                <CheckRow key={c.id} check={c} />
              ))}
              {conflicts.map((d) => (
                <li key={d.name} className="flex gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/[0.05] p-3.5 text-sm text-neutral-300">
                  <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-400" />
                  <span>
                    <span className="font-medium text-white">{d.name}: </span>
                    {d.warning}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {forms.map((f) => (
          <section key={f.id}>
            <h2 className="mb-3 flex items-center gap-2 text-[13px] font-semibold tracking-wide text-neutral-400 uppercase">
              <FileText className="size-4" /> {f.title}
            </h2>
            <dl className="divide-y divide-white/[0.06] rounded-2xl border border-white/10">
              {f.fields.map((field) => (
                <div key={field.label} className="flex items-start justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <dt className="text-xs text-neutral-500">{field.label}</dt>
                    <dd className={`mt-0.5 text-[15px] break-words ${field.value ? "text-white" : "text-neutral-600 italic"}`}>{field.value || "Left blank"}</dd>
                    {field.note && <p className="mt-1 text-xs text-amber-200/80">{field.note}</p>}
                  </div>
                  {field.step !== undefined ? (
                    <button
                      type="button"
                      onClick={() => onEditStep(field.step!)}
                      className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-xs text-neutral-300 transition hover:bg-white/[0.06]"
                    >
                      <PencilLine className="size-3.5" /> Change
                    </button>
                  ) : (
                    <span className="shrink-0 pt-1 text-[11px] text-neutral-600">Set by AutoADU</span>
                  )}
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <PdfPreview pdf={pdfs.forms?.find((x) => x.id === f.id)} title={f.title} error={pdfs.error} updating={pdfs.updating} />
            </div>
          </section>
        ))}

        <label className={`flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 ${blocked ? "opacity-40" : "cursor-pointer"}`}>
          <input
            type="checkbox"
            className="mt-0.5 size-5 accent-accent"
            checked={confirmed && !blocked}
            disabled={blocked}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          <span className="text-[15px] text-white">I checked these and they&apos;re correct.</span>
        </label>
        <p className="text-xs text-neutral-500">Not legal advice. AutoADU fills the forms; you are responsible for what you file.</p>
      </div>
    </StepCard>
  );
}

/** Final step: download the filled forms and a how-to-file summary. Never files with the city. */
export function SubmitView({ answers, profile, onBack }: { answers: AduAnswers; profile: Profile; onBack: () => void }) {
  const { result, permits } = useMemo(() => combineResults(answers, profile), [answers, profile]);
  // With a lookup, the first step ("check your address") is already done.
  const steps = profile.parcel ? result.steps.slice(1) : result.steps;
  const { forms, error, updating } = useFilledForms(answers, profile);

  const summary = useMemo(() => howToFile(answers, result, permits, steps), [answers, result, permits, steps]);
  const downloadSummary = () => save(new Blob([summary], { type: "text/plain" }), "newport-beach-adu-how-to-file.txt");
  const downloadAll = () => {
    forms?.forEach(download);
    downloadSummary();
  };

  return (
    <StepCard step={0} total={0} icon={Send} title="Your package is ready to file" subtitle="Download it, sign it, and file it with the city yourself." onBack={onBack} wide>
      <div className="space-y-8">
        <p className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm leading-snug text-neutral-300">
          AutoADU doesn&apos;t file anything with the City of Newport Beach. You (or your designer) file the package with the city, following
          the steps below. Track it in the city&apos;s{" "}
          <a className={linkClass} href={CITY.portal} target="_blank" rel="noreferrer">
            CiViC portal
          </a>
          .
        </p>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-[13px] font-semibold tracking-wide text-neutral-400 uppercase">
            <Download className="size-4" /> Download
          </h2>
          {error ? (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>
          ) : !forms ? (
            <p className="flex items-center gap-2 text-sm text-neutral-400">
              <LoaderCircle className="size-4 animate-spin" /> Filling your forms…
            </p>
          ) : (
            <ul className="space-y-2">
              {forms.map((f) => (
                <DownloadRow key={f.id} title={f.title} label="PDF" onClick={() => download(f)} />
              ))}
              <DownloadRow title="How to file (summary)" label="TXT" onClick={downloadSummary} />
              <li>
                <button
                  type="button"
                  onClick={downloadAll}
                  className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 text-[15px] font-semibold text-black transition hover:brightness-110 active:scale-[0.97]"
                >
                  <Download className="size-4" strokeWidth={2.4} /> Download everything
                </button>
              </li>
            </ul>
          )}
        </section>

        {forms && forms.length > 0 && (
          <section className="space-y-6">
            <h2 className="flex items-center gap-2 text-[13px] font-semibold tracking-wide text-neutral-400 uppercase">
              <FileText className="size-4" /> Your filled forms
            </h2>
            {forms.map((f) => (
              <div key={f.id}>
                <p className="mb-2 text-[15px] font-medium text-white">{f.title}</p>
                <PdfPreview pdf={f} title={f.title} updating={updating} />
              </div>
            ))}
          </section>
        )}

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-[13px] font-semibold tracking-wide text-neutral-400 uppercase">
            <PencilLine className="size-4" /> How to file
          </h2>
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-3 text-[14.5px] leading-snug text-neutral-300">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </section>
        <p className="text-xs text-neutral-500">Not legal advice. Rules checked on {result.checkedOn}. Confirm requirements with the city before you file.</p>
      </div>
    </StepCard>
  );
}

function DownloadRow({ title, label, onClick }: { title: string; label: string; onClick: () => void }) {
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/12">
        <FileText className="size-5 text-accent" />
      </span>
      <span className="min-w-0 flex-1 text-[15px] text-white">{title}</span>
      <button
        type="button"
        onClick={onClick}
        className="flex h-10 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/[0.06] active:scale-[0.97]"
      >
        <Download className="size-4" strokeWidth={2.4} /> {label}
      </button>
    </li>
  );
}

function howToFile(a: AduAnswers, r: AduResult, permits: string[], steps: string[]): string {
  const list = (items: string[]) => items.map((s, i) => `${i + 1}. ${s}`).join("\n");
  return [
    "AutoADU: how to file your Newport Beach ADU application",
    `Property: ${a.address}`,
    "",
    "AutoADU does not file anything with the city. You file this package yourself.",
    "",
    "Permits you need, in order:",
    list(permits),
    "",
    "Steps:",
    list(steps),
    "",
    "Bring or upload with the filled forms:",
    list(r.documents.map((d) => (d.warning ? `${d.name} (note: ${d.warning})` : d.name))),
    "",
    "Fees:",
    list(r.fees.map((f) => `${f.name}: ${f.amount}${f.note ? ` (${f.note})` : ""}`)),
    "",
    `Rules checked on ${r.checkedOn}. This is not legal advice. Confirm with the Planning Division, ${CITY.planningPhone}.`,
    "",
  ].join("\n");
}

function download(f: FilledForm) {
  save(new Blob([f.bytes as BlobPart], { type: "application/pdf" }), f.fileName);
}

function save(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
