// Placeholder for the Clear It intake. See docs/project-context.md.
// Flow to build: step-by-step intake about the lot and project -> results page
// (forms needed, sign-off departments, fees, issues with plain-English fixes,
// ready-to-submit status). Pass/fail comes from cited rules, never from the AI.
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Clear It</h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        Get your Newport Beach ADU permit application right the first time.
      </p>
      <p className="mt-8 text-sm text-stone-500">
        This tool is not legal advice. Confirm all requirements with the City of
        Newport Beach before you submit.
      </p>
    </main>
  );
}
