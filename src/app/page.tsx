import { checkAffordability } from "@/lib/affordability";
import { sampleHousehold, sampleJobs, sampleListings } from "@/lib/sample-data";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// Starter page: runs the affordability check on sample data, and for homes
// that are out of reach, shows matching jobs that would close the income gap.
// Replace with the real intake form and results UI.
export default function Home() {
  const h = sampleHousehold;
  const skills = h.skills.map((s) => s.toLowerCase());

  const rows = sampleListings.map((listing) => {
    const result = checkAffordability({
      price: listing.price,
      downPayment: h.savingsForDownPayment,
      monthlyHoa: listing.monthlyHoa,
      annualIncome: h.annualIncome,
      monthlyDebts: h.monthlyDebts,
    });
    const bridgeJobs = result.affordable
      ? []
      : sampleJobs.filter(
          (j) =>
            j.annualSalary >= result.requiredAnnualIncome &&
            j.skills.some((s) => skills.includes(s.toLowerCase())),
        );
    return { listing, result, bridgeJobs };
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Home Within Reach</h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        Sample household: {h.currentJobTitle}, {usd(h.annualIncome)}/year,{" "}
        {usd(h.savingsForDownPayment)} saved.
      </p>

      <ul className="mt-8 space-y-4">
        {rows.map(({ listing, result, bridgeJobs }) => (
          <li
            key={listing.id}
            className="rounded-xl border border-stone-200 p-5 dark:border-stone-800"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-medium">
                {listing.address}, {listing.city}
              </h2>
              <span className="tabular-nums">{usd(listing.price)}</span>
            </div>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              {usd(result.monthlyHousingCost)}/month &middot;{" "}
              {(result.frontEndRatio * 100).toFixed(0)}% of income
              {listing.affordableProgram && " · affordable program"}
            </p>
            {result.affordable ? (
              <p className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Works on current income.
              </p>
            ) : (
              <div className="mt-3 text-sm">
                <p className="font-medium text-amber-700 dark:text-amber-400">
                  Needs {usd(result.requiredAnnualIncome)}/year (gap{" "}
                  {usd(result.incomeGap)}).
                </p>
                {bridgeJobs.length > 0 && (
                  <p className="mt-1">
                    Jobs that close the gap:{" "}
                    {bridgeJobs
                      .map((j) => `${j.title} (${usd(j.annualSalary)})`)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
