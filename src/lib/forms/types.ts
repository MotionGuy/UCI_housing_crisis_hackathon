import type { ParcelInfo } from "@/lib/parcel/types";

export interface Person {
  firstName: string;
  lastName: string;
  mailingAddress: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
}

export interface Professional {
  name: string; // person or company
  license: string;
  email: string;
  phone: string;
}

/** Everything about the people and project that goes onto the city forms. */
export interface Profile {
  owner: Person;
  applicantIsOwner: boolean;
  applicant: Person;
  /** Assessor's parcel number, if known. */
  apn: string;
  /** Zoning district from the city's Address Search Tool, e.g. "R-1". */
  zoningDistrict: string;
  /** Estimated construction cost in USD. */
  valuation: number;
  designer: Professional;
  contractor: Professional;
  /** Facts from the city's GIS, when the address lookup worked. */
  parcel?: ParcelInfo;
}

export const EMPTY_PERSON: Person = {
  firstName: "",
  lastName: "",
  mailingAddress: "",
  city: "",
  state: "CA",
  zip: "",
  email: "",
  phone: "",
};

export const EMPTY_PRO: Professional = { name: "", license: "", email: "", phone: "" };

export interface FilledForm {
  id: string;
  title: string;
  fileName: string;
  bytes: Uint8Array;
}
