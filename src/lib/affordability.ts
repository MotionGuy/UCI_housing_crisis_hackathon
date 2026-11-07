export interface LoanAssumptions {
  /** Annual interest rate, for example 0.065 for 6.5%. */
  interestRate: number;
  termYears: number;
  /** Annual property tax as a fraction of price. Orange County is about 1.1%. */
  propertyTaxRate: number;
  /** Annual homeowner's insurance as a fraction of price. */
  insuranceRate: number;
  /** Highest housing cost / gross income ratio (front-end). */
  maxFrontEndRatio: number;
  /** Highest total debt / gross income ratio (back-end). */
  maxBackEndRatio: number;
}

export const DEFAULT_ASSUMPTIONS: LoanAssumptions = {
  interestRate: 0.065,
  termYears: 30,
  propertyTaxRate: 0.011,
  insuranceRate: 0.0035,
  maxFrontEndRatio: 0.31,
  maxBackEndRatio: 0.43,
};

export interface AffordabilityInput {
  price: number;
  downPayment: number;
  monthlyHoa: number;
  annualIncome: number;
  monthlyDebts: number;
}

export interface AffordabilityResult {
  monthlyPrincipalAndInterest: number;
  monthlyTaxAndInsurance: number;
  monthlyHousingCost: number;
  frontEndRatio: number;
  backEndRatio: number;
  affordable: boolean;
  /** Gross annual income needed to afford this home with the same debts. */
  requiredAnnualIncome: number;
  /** requiredAnnualIncome - annualIncome, or 0 if already affordable. */
  incomeGap: number;
}

/** Standard fixed-rate mortgage payment. */
export function monthlyMortgagePayment(
  principal: number,
  annualRate: number,
  termYears: number,
): number {
  const n = termYears * 12;
  if (principal <= 0) return 0;
  if (annualRate === 0) return principal / n;
  const r = annualRate / 12;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

export function checkAffordability(
  input: AffordabilityInput,
  a: LoanAssumptions = DEFAULT_ASSUMPTIONS,
): AffordabilityResult {
  const loan = Math.max(0, input.price - input.downPayment);
  const pi = monthlyMortgagePayment(loan, a.interestRate, a.termYears);
  const ti = (input.price * (a.propertyTaxRate + a.insuranceRate)) / 12;
  const housing = pi + ti + input.monthlyHoa;
  const monthlyIncome = input.annualIncome / 12;

  const frontEndRatio = monthlyIncome > 0 ? housing / monthlyIncome : Infinity;
  const backEndRatio =
    monthlyIncome > 0 ? (housing + input.monthlyDebts) / monthlyIncome : Infinity;

  const requiredMonthly = Math.max(
    housing / a.maxFrontEndRatio,
    (housing + input.monthlyDebts) / a.maxBackEndRatio,
  );
  const requiredAnnualIncome = requiredMonthly * 12;

  return {
    monthlyPrincipalAndInterest: pi,
    monthlyTaxAndInsurance: ti,
    monthlyHousingCost: housing,
    frontEndRatio,
    backEndRatio,
    affordable:
      frontEndRatio <= a.maxFrontEndRatio && backEndRatio <= a.maxBackEndRatio,
    requiredAnnualIncome,
    incomeGap: Math.max(0, requiredAnnualIncome - input.annualIncome),
  };
}
