"use client";

import { useMemo } from "react";
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  ExternalLink,
  FileText,
  Info,
  MapPin,
  PencilLine,
  ShieldCheck,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { evaluateAdu } from "@/lib/adu/evaluate";
import { CITY } from "@/lib/adu/newport-beach";
import { evaluateParcel, type ParcelEvaluation } from "@/lib/adu/zoning";
import type { AduAnswers, AduResult, Check, CheckStatus } from "@/lib/adu/types";
import type { Profile } from "@/lib/forms/types";
import { ParcelCard } from "./parcel-card";
import { autofillPreview } from "./review";
import { StepCard, linkClass } from "./ui";

// Documents we fill in automatically; everything else goes in "still to gather".
const FILLED_DOC_NAMES = new Set([CITY.documents.buildingPermit.name, CITY.documents.ownersAffidavit.name]);

export interface CombinedResult {
  result: AduResult;
  parcelEval: ParcelEvaluation | null;
  /** Parcel checks + engine checks. With a GIS lookup, the parcel rules replace the engine's generic "coastal" check. */
  checks: Check[];
  /** Parcel permits (in order) when the lookup gave any, else the engine's. */
  permits: string[];
  notAllowed: boolean;
}

/** The engine result plus the parcel rules from the address lookup, when there is one. */
export function combineResults(answers: AduAnswers, profile: Profile): CombinedResult {
  const result = evaluateAdu(answers);
  const parcelEval = profile.parcel ? evaluateParcel(profile.parcel, answers.aduType) : null;
  return {
    result,
    parcelEval,
    checks: parcelEval ? [...parcelEval.checks, ...result.checks.filter((c) => c.id !== "coastal")] : result.checks,
    permits: parcelEval?.permits.length ? parcelEval.permits : result.permits,
    notAllowed: parcelEval?.eligibility === "not-allowed",
  };
}

export function AduResultsView({
  answers,
  profile,
  onEdit,
  onReview,
}: {
  answers: AduAnswers;
  profile: Profile;
  /**
   * Back to the intake. Shown only when this page is a dead end (no review possible);
   * otherwise edits happen from the review screen's Change buttons, so there's no Back.
   */
  onEdit: () => void;
  /** Goes to the review screen; blocked while any check fails. */
  onReview?: () => void;
}) {
  const { result, parcelEval, checks, notAllowed } = useMemo(() => combineResults(answers, profile), [answers, profile]);
  const outOfScope = result.verdict === "out-of-scope";
  const forms = useMemo(() => autofillPreview(answers, profile, false), [answers, profile]);

  const hero: { icon: LucideIcon; tone: string } = notAllowed
    ? { icon: CircleX, tone: "text-red-400" }
    : result.verdict === "fast-path"
      ? { icon: ShieldCheck, tone: "text-accent" }
      : result.verdict === "needs-changes"
        ? { icon: TriangleAlert, tone: "text-amber-400" }
        : { icon: CircleX, tone: "text-neutral-300" };

  const toGather = [...result.documents.filter((d) => !FILLED_DOC_NAMES.has(d.name)), ...(parcelEval?.documents ?? [])];
  const blocker = parcelEval?.checks.find((c) => c.status === "fail");
  // Reaching results means every step passed, so only fails matter here (a safety net); warnings stay on their intake steps.
  const { fails } = issuesOf(checks);
  // The deed-restriction conflict is a pitch talking point, not something the applicant fixes: keep it out of "Checks that passed".
  const otherChecks = checks.filter((c) => (c.status === "pass" || c.status === "info") && c.id !== "deed-restriction");

  return (
    <StepCard
      step={0}
      total={0}
      icon={hero.icon}
      title={notAllowed ? "An ADU isn't allowed on this lot" : result.headline}
      subtitle={notAllowed ? blocker?.detail : result.summary}
      onBack={outOfScope || notAllowed || fails.length > 0 ? onEdit : undefined}
      onContinue={outOfScope || notAllowed ? undefined : onReview}
      continueLabel="Review and submit"
      continueDisabled={fails.length > 0}
      missingHint={`Fix these first: change the ${fails.length} ${fails.length === 1 ? "item" : "items"} marked in red, then review your forms.`}
      wide
    >
      {outOfScope ? null : (
        <div className="space-y-9">
          <div className="space-y-3">
            {!notAllowed && <StatusBanner fails={fails.length} />}
            <p className="text-xs text-neutral-500">
              Not legal advice. Rules checked on {result.checkedOn}. Confirm with the City of Newport Beach before you submit.
            </p>
          </div>

          {profile.parcel && (
            <Section title="Your property" icon={MapPin}>
              <ParcelCard parcel={profile.parcel} />
            </Section>
          )}

          {fails.length > 0 && (
            <Section title={`Fix these first (${fails.length})`} icon={TriangleAlert}>
              <ul className="space-y-2">
                {fails.map((c) => (
                  <CheckRow key={c.id} check={c} />
                ))}
              </ul>
            </Section>
          )}

          {!notAllowed && (
          <Section title="Forms completed" icon={FileText}>
            <ul className="space-y-2">
              {forms.map((f) => (
                <li key={f.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/12">
                    <FileText className="size-5 text-accent" />
                  </span>
                  <span className="min-w-0 flex-1 text-[15px] text-white">{f.title}</span>
                  <span className="shrink-0 text-xs text-neutral-500">{f.fields.length} fields</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-neutral-500">Next you&apos;ll check every value we filled in, then download the forms to sign and file.</p>
          </Section>
          )}

          {otherChecks.length > 0 && (
            <details className="group">
              <summary className="mb-3 flex cursor-pointer list-none items-center gap-2 text-[13px] font-semibold tracking-wide text-neutral-400 uppercase hover:text-neutral-200">
                <CircleCheck className="size-4" /> Checks that passed ({otherChecks.length})
                <span className="text-[11px] font-normal tracking-normal normal-case text-neutral-500 group-open:hidden">Show</span>
              </summary>
              <ul className="space-y-2">
                {otherChecks.map((c) => (
                  <CheckRow key={c.id} check={c} />
                ))}
              </ul>
            </details>
          )}

          {!notAllowed && (<>
          <Section title="Still to gather" icon={CircleAlert}>
            <ul className="space-y-2">
              {toGather.map((d) => (
                <li key={d.name} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-medium text-white">{d.name}</p>
                      <p className="mt-0.5 text-sm text-neutral-400">{d.why}</p>
                    </div>
                    {d.url && (
                      <a href={d.url} target="_blank" rel="noreferrer" className="shrink-0 text-neutral-400 hover:text-white" aria-label={`Open ${d.name}`}>
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Fees" icon={Info}>
            <dl className="divide-y divide-white/[0.06] rounded-2xl border border-white/10">
              {result.fees.map((f) => (
                <div key={f.name} className="flex items-start justify-between gap-4 px-4 py-3">
                  <dt>
                    <span className="text-[15px] text-white">{f.name}</span>
                    {f.note && <span className="mt-0.5 block text-xs text-neutral-500">{f.note}</span>}
                  </dt>
                  <dd className="shrink-0 text-[15px] font-medium text-white tabular-nums">{f.amount}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-xs text-neutral-500">
              Estimate your total with the{" "}
              <a className={linkClass} href={CITY.feeCalculator} target="_blank" rel="noreferrer">
                OC ADU calculator
              </a>
              .
            </p>
          </Section>

          <Section title="Next steps" icon={PencilLine}>
            <ol className="space-y-3">
              {result.steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-[14.5px] leading-snug text-neutral-300">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Your rights under state law" icon={ShieldCheck}>
            <ul className="space-y-2">
              {result.rights.map((c) => (
                <CheckRow key={c.id} check={c} />
              ))}
            </ul>
          </Section>
          </>)}
        </div>
      )}
    </StepCard>
  );
}

/** Fail and warn checks, fails first. */
export function issuesOf(checks: Check[]): { fails: Check[]; warns: Check[] } {
  return {
    fails: checks.filter((c) => c.status === "fail"),
    warns: checks.filter((c) => c.status === "warn"),
  };
}

/** "Ready to submit" when no check fails. Fails can't normally reach results (the intake blocks them), so "Fix these first" is a safety net. */
export function StatusBanner({ fails }: { fails: number }) {
  const [tone, Icon, title, text] =
    fails > 0
      ? (["border-red-500/30 bg-red-500/10 text-red-200", CircleX, `Fix these first (${fails} ${fails === 1 ? "issue" : "issues"})`, `${fails} must change before you can submit.`] as const)
      : (["border-accent/30 bg-accent/10 text-white", ShieldCheck, "Ready to submit", "No rule problems found. Review your forms, then file them with the city."] as const);
  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 ${tone}`} role="status">
      <Icon className="mt-0.5 size-6 shrink-0" />
      <div>
        <p className="text-[18px] font-semibold">{title}</p>
        <p className="mt-0.5 text-sm opacity-80">{text}</p>
      </div>
    </div>
  );
}

function SourceLink({ label, url }: { label: string; url?: string }) {
  const assumption = label.startsWith("Assumption:");
  const text = assumption ? label : `Source: ${label}`;
  return (
    <span className={assumption ? "rounded bg-amber-400/10 px-1.5 py-0.5 text-amber-200" : undefined}>
      {url ? (
        <a className="underline decoration-white/20 underline-offset-2 hover:text-neutral-300" href={url} target="_blank" rel="noreferrer">
          {text}
        </a>
      ) : (
        text
      )}
    </span>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-[13px] font-semibold tracking-wide text-neutral-400 uppercase">
        <Icon className="size-4" /> {title}
      </h2>
      {children}
    </section>
  );
}

const STATUS: Record<CheckStatus, { icon: LucideIcon; tone: string }> = {
  pass: { icon: CircleCheck, tone: "text-accent" },
  warn: { icon: TriangleAlert, tone: "text-amber-400" },
  fail: { icon: CircleX, tone: "text-red-400" },
  info: { icon: Info, tone: "text-sky-400" },
};

export function CheckRow({ check }: { check: Check }) {
  const s = STATUS[check.status];
  return (
    <li className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5">
      <s.icon className={`mt-0.5 size-5 shrink-0 ${s.tone}`} />
      <div className="min-w-0">
        <p className="text-[15px] font-medium text-white">{check.title}</p>
        <p className="mt-0.5 text-sm leading-snug text-neutral-400">{check.detail}</p>
        {check.citation && (
          <p className="mt-1.5 text-xs text-neutral-500">
            <SourceLink label={check.citation.label} url={check.citation.url} />
          </p>
        )}
      </div>
    </li>
  );
}
