/** A family using the app. All money values are in US dollars. */
export interface Household {
  annualIncome: number;
  /** Other monthly debt payments (car, student loans, credit cards). */
  monthlyDebts: number;
  savingsForDownPayment: number;
  currentJobTitle: string;
  skills: string[];
  /** Places the family travels to each day (job, schools). */
  destinations: Destination[];
  /** Longest one-way commute the family accepts, in minutes. */
  maxCommuteMinutes: number;
}

export interface Destination {
  label: string; // for example "Work" or "Maya's school"
  address: string;
}

export interface Listing {
  id: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  monthlyHoa: number;
  /** True for non-profit, deed-restricted or assistance-eligible homes. */
  affordableProgram: boolean;
  url?: string;
}

export interface Job {
  id: string;
  title: string;
  employer: string;
  city: string;
  annualSalary: number;
  skills: string[];
  url?: string;
}

export interface CommuteResult {
  destination: string;
  minutes: number;
  mode: "drive" | "transit" | "walk" | "bike";
}
