import { NextResponse } from "next/server";
import { checkAffordability, type AffordabilityInput } from "@/lib/affordability";

// POST /api/affordability
// Body: { price, downPayment, monthlyHoa, annualIncome, monthlyDebts }
export async function POST(request: Request) {
  const body = (await request.json()) as Partial<AffordabilityInput>;
  const fields = ["price", "downPayment", "monthlyHoa", "annualIncome", "monthlyDebts"] as const;
  for (const f of fields) {
    if (typeof body[f] !== "number") {
      return NextResponse.json({ error: `"${f}" must be a number` }, { status: 400 });
    }
  }
  return NextResponse.json(checkAffordability(body as AffordabilityInput));
}
