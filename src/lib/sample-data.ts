// Made-up sample data so the UI and API routes work before real sources are connected.
// Replace with real listings / job sources. Never put real family data here.
import type { Household, Job, Listing } from "./types";

export const sampleHousehold: Household = {
  annualIncome: 72000,
  monthlyDebts: 450,
  savingsForDownPayment: 25000,
  currentJobTitle: "Medical Assistant",
  skills: ["patient intake", "EHR", "scheduling", "bilingual Spanish"],
  destinations: [
    { label: "Work", address: "Irvine, CA" },
    { label: "Elementary school", address: "Santa Ana, CA" },
  ],
  maxCommuteMinutes: 35,
};

export const sampleListings: Listing[] = [
  { id: "l1", address: "123 Example St", city: "Santa Ana", price: 385000, bedrooms: 2, monthlyHoa: 320, affordableProgram: true },
  { id: "l2", address: "45 Sample Ave", city: "Anaheim", price: 520000, bedrooms: 3, monthlyHoa: 0, affordableProgram: false },
  { id: "l3", address: "9 Demo Ct", city: "Garden Grove", price: 299000, bedrooms: 2, monthlyHoa: 410, affordableProgram: true },
];

export const sampleJobs: Job[] = [
  { id: "j1", title: "Patient Services Coordinator", employer: "Example Health", city: "Irvine", annualSalary: 84000, skills: ["patient intake", "scheduling", "EHR"] },
  { id: "j2", title: "Bilingual Care Navigator", employer: "Sample Clinic", city: "Santa Ana", annualSalary: 91000, skills: ["bilingual Spanish", "patient intake"] },
  { id: "j3", title: "Warehouse Associate", employer: "Demo Logistics", city: "Tustin", annualSalary: 48000, skills: ["forklift"] },
];
