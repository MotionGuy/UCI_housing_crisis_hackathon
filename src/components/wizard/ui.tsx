"use client";

import { ArrowLeft, ArrowRight, CornerUpRight, type LucideIcon } from "lucide-react";

/** The dark card with progress dashes, hero icon, title and footer buttons. */
export function StepCard({
  step,
  total,
  icon: Icon,
  title,
  subtitle,
  children,
  onBack,
  onSkip,
  onContinue,
  continueLabel = "Continue",
  continueDisabled,
  missingHint,
  wide,
}: {
  step: number;
  total: number;
  icon: LucideIcon;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  onBack?: () => void;
  onSkip?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  /** Shown under the buttons while Continue is disabled, e.g. "Add your last name". */
  missingHint?: string;
  wide?: boolean;
}) {
  return (
    <section
      className={`relative w-full ${wide ? "max-w-2xl" : "max-w-[540px]"} overflow-hidden rounded-[32px] border border-white/[0.07] bg-panel shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]`}
    >
      {/* green glow on the left edge */}
      <div className="pointer-events-none absolute top-[38%] left-0 h-48 w-px bg-gradient-to-b from-transparent via-accent to-transparent opacity-70" />
      <div className="pointer-events-none absolute top-[38%] -left-10 h-48 w-20 bg-accent/10 blur-2xl" />
      <div className="dot-grid pointer-events-none absolute inset-0" />

      <div className="relative px-6 pt-8 pb-7 sm:px-10 sm:pt-10">
        {total > 0 && <Progress step={step} total={total} />}

        <div key={step} className="step-enter">
          <div className="mx-auto mt-9 flex size-[76px] items-center justify-center rounded-[22px] border border-white/10 bg-gradient-to-b from-neutral-700/80 to-neutral-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_30px_-8px_rgba(0,0,0,0.8)]">
            <Icon className="size-9 text-neutral-100" strokeWidth={1.6} />
          </div>
          <h1 className="mt-6 text-center text-[26px] leading-tight font-semibold tracking-tight text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-2 max-w-[340px] text-center text-[15px] leading-snug text-neutral-400">
              {subtitle}
            </p>
          )}
          <div className="mt-8">{children}</div>
        </div>

        <div className="mt-9 flex items-center justify-between gap-3">
          {onBack ? (
            <FooterButton onClick={onBack} icon={ArrowLeft} label="Back" />
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
            {onSkip && <FooterButton onClick={onSkip} icon={CornerUpRight} label="Skip" />}
            {onContinue && (
              <button
                type="button"
                onClick={onContinue}
                disabled={continueDisabled}
                className="flex h-11 items-center gap-2 rounded-2xl bg-accent px-5 text-[15px] font-semibold text-black transition hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-30"
              >
                {continueLabel}
                <ArrowRight className="size-4" strokeWidth={2.4} />
              </button>
            )}
          </div>
        </div>
        {continueDisabled && missingHint && (
          <p className="mt-3 text-right text-[13px] text-amber-300/90" aria-live="polite">
            {missingHint}
          </p>
        )}
      </div>
    </section>
  );
}

function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex justify-center gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-[5px] w-9 rounded-full transition-colors duration-300 ${
            i < step ? "bg-accent/45" : i === step ? "bg-accent shadow-[0_0_10px_rgba(46,232,111,0.6)]" : "bg-white/12"
          }`}
        />
      ))}
    </div>
  );
}

function FooterButton({ onClick, icon: Icon, label }: { onClick: () => void; icon: LucideIcon; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.02] pr-5 pl-3 text-[15px] text-neutral-300 transition hover:bg-white/[0.06] active:scale-[0.97]"
    >
      <span className="flex size-6 items-center justify-center rounded-md bg-white/10">
        <Icon className="size-3.5" strokeWidth={2.2} />
      </span>
      {label}
    </button>
  );
}

export interface Option<T extends string> {
  value: T;
  title: string;
  description: string;
  icon: LucideIcon;
}

/** Rows like "Collaboration / Treated as partnership  →". Picking one moves on. */
export function OptionList<T extends string>({
  options,
  value,
  onPick,
}: {
  options: Option<T>[];
  value?: T;
  onPick: (v: T) => void;
}) {
  return (
    <ul className="space-y-2">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <li key={o.value}>
            <button
              type="button"
              onClick={() => onPick(o.value)}
              className={`group flex w-full items-center gap-4 rounded-2xl border px-3 py-3 text-left transition ${
                selected ? "border-accent/40 bg-accent/[0.06]" : "border-transparent hover:bg-white/[0.04]"
              }`}
            >
              <span className="flex size-[52px] shrink-0 items-center justify-center rounded-[14px] bg-accent/12">
                <o.icon className="size-[22px] text-accent" strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-medium text-white">{o.title}</span>
                <span className="mt-0.5 block text-[14.5px] leading-snug text-neutral-400">{o.description}</span>
              </span>
              <span className="flex size-[46px] shrink-0 items-center justify-center rounded-[14px] border border-white/12 bg-white/[0.02] text-white transition group-hover:border-white/25 group-hover:bg-white/[0.06]">
                <ArrowRight className="size-[18px] transition group-hover:translate-x-0.5" strokeWidth={2.2} />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  required,
  className = "",
}: {
  label: string;
  hint?: React.ReactNode;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[13px] font-medium text-neutral-300">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3.5 text-[15px] text-white placeholder:text-neutral-600 transition outline-none focus:border-accent/60 focus:ring-4 focus:ring-accent/10"
      />
      {hint && <span className="mt-1.5 block text-xs leading-snug text-neutral-500">{hint}</span>}
    </label>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
}) {
  return (
    <fieldset>
      <legend className="text-[13px] font-medium text-neutral-300">{label}</legend>
      <div className="mt-1.5 flex rounded-xl border border-white/10 bg-black/30 p-1">
        {options.map(([v, text]) => (
          <button
            key={v}
            type="button"
            aria-pressed={value === v}
            onClick={() => onChange(v)}
            className={`h-9 flex-1 rounded-lg text-sm transition ${
              value === v ? "bg-white/10 font-medium text-white" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 text-left text-[14.5px] text-neutral-200"
    >
      {label}
      <span className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${checked ? "bg-accent" : "bg-white/15"}`}>
        <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-[left] ${checked ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

export const linkClass = "text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent";
