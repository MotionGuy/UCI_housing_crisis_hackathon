// Fills Newport Beach's fillable PDF forms from the interview answers.
// Field names were matched to their printed labels by position on the page
// (see docs/forms/newport-beach/README.md). Works in the browser and in Node.
import { PDFDocument } from "pdf-lib";
import type { AduAnswers } from "@/lib/adu/types";
import type { FilledForm, Person, Professional, Profile } from "./types";

/** Field names in "Worksheet for Combo Building & Solar Permit Application". */
const WORKSHEET = {
  residential: "F[0].P1[0].CheckBox3[0]",
  building: "F[0].P1[0].CheckBox1[0]",
  electrical: "F[0].P1[0].CheckBox1[3]",
  mechanical: "F[0].P1[0].CheckBox1[4]",
  plumbing: "F[0].P1[0].CheckBox1[5]",
  // Hazard boxes next to "Project Address": Flood, Fire, Liq, Landslide, N/A
  flood: "F[0].P1[0].CheckBox4[0]",
  fire: "F[0].P1[0].CheckBox5[0]",
  liquefaction: "F[0].P1[0].CheckBox6[0]",
  landslide: "F[0].P1[0].CheckBox7[0]",
  hazardNone: "F[0].P1[0].CheckBox8[0]",
  projectAddress: "F[0].P1[0].TextField1[2]",
  use: "F[0].P1[0].TextField1[3]",
  description: "F[0].P1[0].TextField2[0]",
  stories: "F[0].P1[0].NumericField4[0]",
  units: "F[0].P1[0].NumericField2[0]",
  valuation: "F[0].P1[0].TextField3[0]",
  newAddSf: "F[0].P1[0].NumericField6[0]",
  remodelSf: "F[0].P1[0].NumericField5[0]",
  owner: person("38", "39", "40", "41", "42", "43", "44", "45"),
  applicant: person("4", "5", "10", "11", "6", "7", "8", "9"),
  // Architect/Designer and Engineer rows (tooltips and positions checked against the PDF).
  designer: pro("19", "18", "20", "17", "12", "13", "14", "16", "15"),
  engineer: pro("28", "27", "46", "25", "24", "23", "22", "26", "21"),
  contractor: { name: tf("36"), license: tf("35"), email: tf("34"), phone: tf("29") },
};

/** Field names in "Discretionary Application Owner's Affidavit". */
const AFFIDAVIT = {
  approvalInConcept: "checkbox_1xepg",
  coastalDevelopmentPermit: "checkbox_48bjzn",
  projectAddress: "text_43ueah",
  description: "textarea_41jrte",
  ownerNames: "text_42pvay",
  title1: "text_44gidb",
  date1: "text_46pmcr",
};

export const FORM_SOURCES = {
  worksheet: "/forms/newport-beach/building-permit-application-worksheet.pdf",
  affidavit: "/forms/newport-beach/owners-affidavit-discretionary-application.pdf",
};

const ADU_WORDS: Record<AduAnswers["aduType"], string> = {
  detached: "new detached accessory dwelling unit (ADU)",
  attached: "new attached accessory dwelling unit (ADU)",
  converted: "accessory dwelling unit (ADU) by converting existing space",
  jadu: "junior accessory dwelling unit (JADU) within the existing house",
};

export function describeWork(a: AduAnswers): string {
  const verb = a.aduType === "detached" || a.aduType === "attached" ? "Construct a" : "Create a";
  const beds = a.bedrooms === 0 ? "studio" : `${a.bedrooms} bedroom${a.bedrooms > 1 ? "s" : ""}`;
  const garage = a.convertingGarage ? " Converts an existing garage." : "";
  return `${verb} ${a.squareFeet} sq ft ${ADU_WORDS[a.aduType]}, ${beds}, per NBMC 20.48.200 and Cal. Gov. Code 66314-66342.${garage}`;
}

export async function fillWorksheet(pdfBytes: ArrayBuffer | Uint8Array, a: AduAnswers, p: Profile): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const form = doc.getForm();
  form.deleteXFA(); // the form is also an XFA form; drop it so viewers show our values
  const set = (name: string, value: string | number | undefined) => {
    if (value === undefined || value === "") return;
    form.getTextField(name).setText(String(value));
  };
  const check = (name: string) => form.getCheckBox(name).check();

  check(WORKSHEET.residential);
  check(WORKSHEET.building);
  check(WORKSHEET.electrical);
  check(WORKSHEET.mechanical);
  check(WORKSHEET.plumbing);

  // Hazard boxes come only from the city's GIS; leave them blank without a lookup.
  const hz = p.parcel?.hazards;
  if (hz) {
    if (hz.floodVE) check(WORKSHEET.flood);
    if (hz.fireDesignation) check(WORKSHEET.fire);
    if (hz.liquefaction) check(WORKSHEET.liquefaction);
    if (hz.landslide) check(WORKSHEET.landslide);
    if (!hz.floodVE && !hz.fireDesignation && !hz.liquefaction && !hz.landslide) check(WORKSHEET.hazardNone);
  }

  set(WORKSHEET.projectAddress, a.address);
  set(WORKSHEET.use, a.aduType === "jadu" ? "JADU" : "ADU");
  set(WORKSHEET.description, describeWork(a));
  set(WORKSHEET.stories, 1);
  set(WORKSHEET.units, 1);
  if (p.valuation > 0) set(WORKSHEET.valuation, `$${Math.round(p.valuation).toLocaleString("en-US")}`);
  const isNew = a.aduType === "detached" || a.aduType === "attached";
  set(isNew ? WORKSHEET.newAddSf : WORKSHEET.remodelSf, a.squareFeet);

  setPerson(set, WORKSHEET.owner, p.owner);
  setPerson(set, WORKSHEET.applicant, p.applicantIsOwner ? p.owner : p.applicant);
  setPro(set, WORKSHEET.designer, p.designer);
  setPro(set, WORKSHEET.engineer, p.engineer);
  setContractor(set, p.contractor);

  return doc.save();
}

export async function fillAffidavit(pdfBytes: ArrayBuffer | Uint8Array, a: AduAnswers, p: Profile, today = new Date()): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const form = doc.getForm();
  const set = (name: string, value: string) => value && form.getTextField(name).setText(value);

  // In the Coastal Commission's permit jurisdiction, the city gives an Approval in Concept
  // and the Commission issues the CDP (NBMC § 21.52.015(B)(1)(a)).
  const commissionIssues = p.parcel?.coastalAppealArea.toUpperCase() === "PERMIT JURISDICTION";
  form.getCheckBox(commissionIssues ? AFFIDAVIT.approvalInConcept : AFFIDAVIT.coastalDevelopmentPermit).check();
  set(AFFIDAVIT.projectAddress, [p.parcel?.matchedAddress ?? a.address, p.apn && `APN ${p.apn}`].filter(Boolean).join(" / "));
  set(AFFIDAVIT.description, describeWork(a));
  set(AFFIDAVIT.ownerNames, `${p.owner.firstName} ${p.owner.lastName}`.trim());
  set(AFFIDAVIT.title1, "Owner");
  set(AFFIDAVIT.date1, today.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }));

  return doc.save();
}

/** Fetches the blank forms and fills the ones this project needs. */
export async function fillAllForms(
  a: AduAnswers,
  p: Profile,
  load: (path: string) => Promise<ArrayBuffer> = (path) => fetch(path).then((r) => r.arrayBuffer()),
): Promise<FilledForm[]> {
  const forms: FilledForm[] = [
    {
      id: "worksheet",
      title: "Building permit application (Combo Building & Solar worksheet)",
      fileName: "newport-beach-building-permit-application.pdf",
      bytes: await fillWorksheet(await load(FORM_SOURCES.worksheet), a, p),
    },
  ];
  if (a.coastalZone !== "no") {
    forms.push({
      id: "affidavit",
      title: "Owner's Affidavit (Coastal Development Permit)",
      fileName: "newport-beach-owners-affidavit-cdp.pdf",
      bytes: await fillAffidavit(await load(FORM_SOURCES.affidavit), a, p),
    });
  }
  return forms;
}

// ---- helpers ----

type Setter = (name: string, value: string | number | undefined) => void;
type PersonFields = ReturnType<typeof person>;

function tf(n: string) {
  return `F[0].P1[0].TextField1[${n}]`;
}

function person(last: string, first: string, address: string, email: string, city: string, state: string, zip: string, phone: string) {
  return { last: tf(last), first: tf(first), address: tf(address), email: tf(email), city: tf(city), state: tf(state), zip: tf(zip), phone: tf(phone) };
}

function setPerson(set: Setter, f: PersonFields, v: Person) {
  set(f.last, v.lastName);
  set(f.first, v.firstName);
  set(f.address, v.mailingAddress);
  set(f.email, v.email);
  set(f.city, v.city);
  set(f.state, v.state);
  set(f.zip, v.zip);
  set(f.phone, v.phone);
}

function pro(last: string, first: string, license: string, address: string, city: string, state: string, zip: string, email: string, phone: string) {
  return {
    last: tf(last),
    first: tf(first),
    license: tf(license),
    address: tf(address),
    city: tf(city),
    state: tf(state),
    zip: tf(zip),
    email: tf(email),
    phone: tf(phone),
  };
}

/** A designer or engineer row: "First Last" splits into the Last/First boxes (one word goes in Last). */
function setPro(set: Setter, f: ReturnType<typeof pro>, v: Professional) {
  const [first, ...rest] = v.name.trim().split(/\s+/);
  set(f.first, rest.length ? first : "");
  set(f.last, rest.length ? rest.join(" ") : first);
  set(f.license, v.license);
  set(f.address, v.address);
  set(f.city, v.city);
  set(f.state, v.state);
  set(f.zip, v.zip);
  set(f.email, v.email);
  set(f.phone, v.phone);
}

function setContractor(set: Setter, v: Professional) {
  set(WORKSHEET.contractor.name, v.name);
  set(WORKSHEET.contractor.license, v.license);
  set(WORKSHEET.contractor.email, v.email);
  set(WORKSHEET.contractor.phone, v.phone);
}
