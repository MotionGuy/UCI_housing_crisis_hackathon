"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Download,
  ExternalLink,
  FileText,
  Info,
  ListOrdered,
  LoaderCircle,
  MapPin,
  PencilLine,
  ShieldCheck,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { evaluateAdu } from "@/lib/adu/evaluate";
import { CITY } from "@/lib/adu/newport-beach";
import { evaluateParcel } from "@/lib/adu/zoning";
import { ParcelCard } from "./parcel-card";
import type { AduAnswers, Check, CheckStatus } from "@/lib/adu/types";
import { fillAllForms } from "@/lib/forms/fill";
import type { FilledForm, Profile } from "@/lib/forms/types";
import { StepCard, linkClass } from "./ui";

// Documents we fill in automatically; everything else goes in "still to gather".
const FILLED_DOC_NAMES = new Set([CITY.documents.buildingPermit.name, CITY.documents.ownersAffidavit.name]);

export function AduResultsView({ answers, profile, onEdit }: { answers: AduAnswers; profile: Profile; onEdit: () => void }) {
  const result = useMemo(() => evaluateAdu(answers), [answers]);
  const parcelEval = useMemo(
    () => (profile.parcel ? evaluateParcel(profile.parcel, answers.aduType) : null),
    [profile.parcel, answers.aduType],
  );
  const notAllowed = parcelEval?.eligibility === "not-allowed";
  const [forms, setForms] = useState<FilledForm[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const outOfScope = result.verdict === "out-of-scope";

  useEffect(() => {
    if (outOfScope || notAllowed) return;
    let cancelled = false;
    fillAllForms(answers, profile)
      .then((f) => !cancelled && setForms(f))
      .catch((e: unknown) => !cancelled && setError(e instanceof Error ? e.message : "Could not fill the forms"));
    return () => {
      cancelled = true;
    };
  }, [answers, profile, outOfScope, notAllowed]);

  const hero: { icon: LucideIcon; tone: string } = notAllowed
    ? { icon: CircleX, tone: "text-red-400" }
    : result.verdict === "fast-path"
      ? { icon: ShieldCheck, tone: "text-accent" }
      : result.verdict === "needs-changes"
        ? { icon: TriangleAlert, tone: "text-amber-400" }
        : { icon: CircleX, tone: "text-neutral-300" };

  // With a GIS lookup, the parcel rules replace the engine's generic "coastal" check.
  const checks = parcelEval
    ? [...parcelEval.checks, ...result.checks.filter((c) => c.id !== "coastal")]
    : result.checks;
  const toGather = [...result.documents.filter((d) => !FILLED_DOC_NAMES.has(d.name)), ...(parcelEval?.documents ?? [])];
  const permits = parcelEval?.permits.length ? parcelEval.permits : result.permits;
  const blocker = parcelEval?.checks.find((c) => c.status === "fail");

  return (
    <StepCard
      step={0}
      total={0}
      icon={hero.icon}
      title={notAllowed ? "An ADU isn't allowed on this lot" : result.headline}
      subtitle={notAllowed ? blocker?.detail : result.summary}
      onBack={onEdit}
      wide
    >
      {outOfScope ? null : (
        <div className="space-y-9">
          {profile.parcel && (
            <Section title="Your property" icon={MapPin}>
              <ParcelCard parcel={profile.parcel} />
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
          <Section title="Your forms, filled in" icon={FileText}>
            {error ? (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>
            ) : !forms ? (
              <p className="flex items-center gap-2 text-sm text-neutral-400">
                <LoaderCircle className="size-4 animate-spin" /> Filling your forms…
              </p>
            ) : (
              <ul className="space-y-2">
                {forms.map((f) => (
                  <li key={f.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/12">
                      <FileText className="size-5 text-accent" />
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] text-white">{f.title}</span>
                    <button
                      type="button"
                      onClick={() => download(f)}
                      className="flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.97]"
                    >
                      <Download className="size-4" strokeWidth={2.4} /> PDF
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-neutral-500">Check every value, then sign where the form asks for a signature.</p>
          </Section>
          )}

          <Section title="Rule check" icon={CircleCheck}>
            <ul className="space-y-2">
              {checks.map((c) => (
                <CheckRow key={c.id} check={c} />
              ))}
            </ul>
          </Section>

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

function CheckRow({ check }: { check: Check }) {
  const s = STATUS[check.status];
  return (
    <li className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5">
      <s.icon className={`mt-0.5 size-5 shrink-0 ${s.tone}`} />
      <div className="min-w-0">
        <p className="text-[15px] font-medium text-white">{check.title}</p>
        <p className="mt-0.5 text-sm leading-snug text-neutral-400">{check.detail}</p>
        {check.citation && (
          <p className="mt-1.5 text-xs text-neutral-500">
            {check.citation.url ? (
              <a className="underline decoration-white/20 underline-offset-2 hover:text-neutral-300" href={check.citation.url} target="_blank" rel="noreferrer">
                {check.citation.label}
              </a>
            ) : (
              check.citation.label
            )}
          </p>
        )}
      </div>
    </li>
  );
}

function download(f: FilledForm) {
  const url = URL.createObjectURL(new Blob([f.bytes as BlobPart], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = f.fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
