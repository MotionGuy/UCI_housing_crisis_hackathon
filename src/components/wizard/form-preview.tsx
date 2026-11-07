"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, FileText, LoaderCircle } from "lucide-react";
import type { AduAnswers } from "@/lib/adu/types";
import { fillAllForms } from "@/lib/forms/fill";
import type { FilledForm, Profile } from "@/lib/forms/types";
import { linkClass } from "./ui";

export interface PreviewPdf extends FilledForm {
  /** blob: URL of the filled PDF; revoked when the forms are refilled or the view closes. */
  url: string;
}

/**
 * Fills the city forms in the browser (the same fillAllForms the downloads use) and
 * makes a blob URL for each. Refills when the answers or profile change.
 */
export function useFilledForms(answers: AduAnswers, profile: Profile): { forms: PreviewPdf[] | null; error: string | null; updating: boolean } {
  const [forms, setForms] = useState<PreviewPdf[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(true);
  const urls = useRef<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    // Short delay so typing on another screen doesn't refill on every key.
    const timer = setTimeout(() => {
      setUpdating(true);
      fillAllForms(answers, profile)
        .then((filled) => {
          if (cancelled) return;
          const next = filled.map((f) => ({ ...f, url: URL.createObjectURL(new Blob([f.bytes as BlobPart], { type: "application/pdf" })) }));
          urls.current.forEach((u) => URL.revokeObjectURL(u));
          urls.current = next.map((f) => f.url);
          setForms(next);
          setError(null);
        })
        .catch((e: unknown) => !cancelled && setError(e instanceof Error ? e.message : "Could not fill the forms"))
        .finally(() => !cancelled && setUpdating(false));
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [answers, profile]);

  // Revoke the last set of URLs when the view closes.
  useEffect(
    () => () => {
      urls.current.forEach((u) => URL.revokeObjectURL(u));
      urls.current = [];
    },
    [],
  );

  return { forms, error, updating };
}

/**
 * The filled PDF itself, embedded. On a phone (or a browser that can't embed PDFs)
 * it's a button that opens the PDF in a new tab.
 */
export function PdfPreview({ pdf, title, error, updating }: { pdf?: PreviewPdf; title: string; error?: string | null; updating?: boolean }) {
  if (error) return <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">Couldn&apos;t show the filled form: {error}</p>;
  if (!pdf) {
    return (
      <p className="flex items-center gap-2 rounded-2xl border border-white/10 p-4 text-sm text-neutral-400">
        <LoaderCircle className="size-4 animate-spin" /> Filling the form…
      </p>
    );
  }
  const openLink = (
    <a className={linkClass} href={pdf.url} target="_blank" rel="noreferrer">
      Open in a new tab <ExternalLink className="inline size-3 align-[-1px]" />
    </a>
  );
  return (
    <div>
      {/* Phone width: a button instead of a cramped embed. */}
      <a
        href={pdf.url}
        target="_blank"
        rel="noreferrer"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] text-[15px] font-medium text-white transition hover:bg-white/[0.07] sm:hidden"
      >
        <FileText className="size-4 text-accent" /> View the filled form (PDF)
      </a>
      <div className="hidden sm:block">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            {updating ? <LoaderCircle className="size-3.5 animate-spin" /> : <FileText className="size-3.5" />}
            {updating ? "Updating the filled form…" : "The filled form, as it will print"}
          </span>
          {openLink}
        </div>
        <object
          key={pdf.url}
          data={`${pdf.url}#view=FitH`}
          type="application/pdf"
          aria-label={`Filled form: ${title}`}
          className="h-[640px] w-full rounded-2xl border border-white/10 bg-white"
        >
          <p className="p-4 text-sm text-neutral-700">
            Your browser can&apos;t show PDFs here.{" "}
            <a className="underline" href={pdf.url} target="_blank" rel="noreferrer">
              Open the filled form in a new tab
            </a>
            .
          </p>
        </object>
      </div>
    </div>
  );
}
