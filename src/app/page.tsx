import { AduWizard } from "@/components/wizard/adu-wizard";

export default function Home() {
  return (
    <main className="page-glow flex min-h-dvh flex-col items-center px-4 py-10 sm:py-16">
      <p className="mb-6 text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
        Clear it · Newport Beach ADU permits
      </p>
      <AduWizard />
      <p className="mt-8 max-w-md text-center text-xs leading-relaxed text-neutral-600">
        Guidance, not legal advice. Rules checked November 7, 2026. Confirm with the Newport Beach
        Planning Division at (949) 644-3204.
      </p>
    </main>
  );
}
