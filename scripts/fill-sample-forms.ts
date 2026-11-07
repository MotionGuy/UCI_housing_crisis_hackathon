/**
 * Fills the Newport Beach forms with made-up sample data, to check the field mapping.
 * Run: npm run forms:sample [output-folder]   (default: ./sample-forms, which git ignores)
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { AduAnswers } from "../src/lib/adu/types";
import { fillAllForms } from "../src/lib/forms/fill";
import type { Profile } from "../src/lib/forms/types";

const outDir = process.argv[2] ?? "sample-forms";

const answers: AduAnswers = {
  address: "123 Example St, Newport Beach, CA 92663",
  lotType: "existing-single-family",
  coastalZone: "yes",
  aduType: "detached",
  squareFeet: 750,
  bedrooms: 1,
  heightFeet: 16,
  houseHeightFeet: 20,
  sideRearSetbackFeet: 4,
  nearTransit: "yes",
  convertingGarage: false,
  ownerLivesOnSite: true,
  usingPreapprovedPlan: true,
};

const maria = {
  firstName: "Maria",
  lastName: "Lopez",
  mailingAddress: "123 Example St",
  city: "Newport Beach",
  state: "CA",
  zip: "92663",
  email: "maria@example.com",
  phone: "(949) 555-0100",
};

const profile: Profile = {
  owner: maria,
  applicantIsOwner: true,
  applicant: maria,
  apn: "000-000-00",
  zoningDistrict: "R-1",
  valuation: 225000,
  designer: { name: "Sam Rivera", license: "C-00000", email: "sam@example.com", phone: "(949) 555-0111" },
  contractor: { name: "Example Builders Inc", license: "0000000", email: "", phone: "" },
};

async function main() {
  const forms = await fillAllForms(answers, profile, async (p) => {
    const buf = readFileSync(path.join("public", p));
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  });
  mkdirSync(outDir, { recursive: true });
  for (const f of forms) {
    writeFileSync(path.join(outDir, f.fileName), f.bytes);
    console.log(`Wrote ${path.join(outDir, f.fileName)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
