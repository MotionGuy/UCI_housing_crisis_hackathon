"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AduWizard } from "@/components/wizard/adu-wizard";

/** Landing screen ("AutoADU" + Get started), then the ADU intake wizard. */
export function HomeShell() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <section className="step-enter flex w-full max-w-[540px] flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
          Auto<span className="text-accent">ADU</span>
        </h1>
        <p className="mt-4 max-w-[360px] text-[15px] leading-snug text-neutral-400">
          Get your Newport Beach ADU permit application right the first time.
        </p>
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="mt-10 flex h-12 items-center gap-2 rounded-2xl bg-accent px-7 text-base font-semibold text-black transition hover:brightness-110 active:scale-[0.97]"
        >
          Get started <ArrowRight className="size-4" strokeWidth={2.4} />
        </button>
      </section>
    );
  }

  return <AduWizard />;
}
