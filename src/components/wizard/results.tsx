"use client";

import { useMemo } from "react";
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  ExternalLink,
  FileText,
  Info,
  ListOrdered,
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
  onLoadFixed,
}: {
  answers: AduAnswers;
  profile: Profile;
  onEdit: () => void;
  /** Goes to the review screen; blocked while any check fails. */
  onReview?: () => void;
  /** Shown after the demo is loaded: swaps in the fixed demo application. */
  onLoadFixed?: () => void;
}) {
  const { result, parcelEval, checks, permits, notAllowed } = useMemo(() => combineResults(answers, profile), [answers, profile]);
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
  const { fails, warns } = issuesOf(checks);
  // The deed-restriction conflict has its own "City vs. state conflict" card, so keep it out of "Checks that passed".
  const otherChecks = checks.filter((c) => (c.status === "pass" || c.status === "info") && c.id !== "deed-restriction");
  const conflicts = notAllowed ? [] : result.documents.filter((d) => d.warning);
  const deedRight = result.rights.find((r) => r.id === "deed");

  return (
    <StepCard
      step={0}
      total={0}
      icon={hero.icon}
      title={notAllowed ? "An ADU isn't allowed on this lot" : result.headline}
      subtitle={notAllowed ? blocker?.detail : result.summary}
      onBack={onEdit}
      onContinue={outOfScope || notAllowed ? undefined : onReview}
      continueLabel="Review and submit"
      continueDisabled={fails.length > 0}
      missingHint={`Fix these first: change the ${fails.length} ${fails.length === 1 ? "item" : "items"} marked in red, then review your forms.`}
      wide
    >
      {outOfScope ? null : (
        <div className="space-y-9">
          <div className="space-y-3">
            {!notAllowed && <StatusBanner fails={fails.length} warns={warns.length} />}
            <p className="text-xs text-neutral-500">
              Not legal advice. Rules checked on {result.checkedOn}. Confirm with the City of Newport Beach before you submit.
            </p>
            {onLoadFixed && (
              <button
                type="button"
                onClick={onLoadFixed}
                className="h-9 rounded-xl border border-dashed border-white/15 px-3 text-[13px] font-medium text-neutral-300 transition hover:bg-white/[0.06]"
              >
                Load fixed version (demo)
              </button>
            )}
          </div>

          {profile.parcel && (
            <Section title="Your property" icon={MapPin}>
              <ParcelCard parcel={profile.parcel} />
            </Section>
          )}

          {(fails.length > 0 || warns.length > 0 || conflicts.length > 0) && (
            <Section title={fails.length ? `Fix these first (${fails.length + warns.length})` : `Check these (${warns.length + conflicts.length})`} icon={TriangleAlert}>
              <ul className="space-y-2">
                {[...fails, ...warns].map((c) => (
                  <CheckRow key={c.id} check={c} />
                ))}
                {conflicts.map((d) => (
                  <li key={d.name} className="flex gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/[0.05] p-3.5">
                    <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-400" />
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium text-white">City vs. state conflict: {d.name}</p>
                      <p className="mt-0.5 text-sm leading-snug text-neutral-400">{d.warning}</p>
                      <p className="mt-1.5 flex flex-wrap gap-x-3 text-xs text-neutral-500">
                        {d.url && <SourceLink label="City permit page" url={d.url} />}
                        {deedRight?.citation && d.name.startsWith("Deed restriction") && (
                          <SourceLink label={deedRight.citation.label} url={deedRight.citation.url} />
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {!notAllowed && permits.length > 0 && (
            <Section title="Permits you need, in order" icon={ListOrdered}>
              <ol className="space-y-2">
                {permits.map((pm, i) => (
                  <li key={pm} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 text-[15px] text-white">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">{i + 1}</span>
                    {pm}
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {!notAllowed && (
          <Section title="Forms we fill in for you" icon={FileText}>
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
                  {d.warning && (
                    <p className="mt-2.5 flex gap-2 rounded-xl bg-amber-400/10 p-2.5 text-[13px] leading-snug text-amber-200">
                      <TriangleAlert className="mt-0.5 size-4 shrink-0" /> {d.warning}
                    </p>
                  )}
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
              {(profile.parcel ? result.steps.slice(1) : result.steps).map((s, i) => (
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

/** "Ready to submit" only with no fails and no warnings. */
export function StatusBanner({ fails, warns }: { fails: number; warns: number }) {
  const [tone, Icon, title, text] =
    fails > 0
      ? (["border-red-500/30 bg-red-500/10 text-red-200", CircleX, `Fix these first (${fails + warns} ${fails + warns === 1 ? "issue" : "issues"})`, `${fails} must change before you can submit${warns ? `, ${warns} to check` : ""}.`] as const)
      : warns > 0
        ? (["border-amber-400/30 bg-amber-400/10 text-amber-100", TriangleAlert, `Almost ready: check ${warns} ${warns === 1 ? "warning" : "warnings"}`, "Nothing blocks you, but a plan checker may ask about these."] as const)
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
