// Form defaults, per-step schemas, extra cross-field checks and payload builder.
import { z } from "zod";
import {
  mainSchema,
  addressSchema,
  spouseSchema,
  childSchema,
  consentSchema,
  isAdult,
  CONSENT_TEXT_VERSION,
} from "./shared/schema.js";

const emptyAdult = {
  fullName: "",
  familyName: "",
  fatherName: "",
  motherName: "",
  yearOfBirth: "",
  gender: "",
  mobile: "",
  email: "",
};
export const emptyChild = {
  fullName: "",
  yearOfBirth: "",
  gender: "",
  mobile: "",
  email: "",
};

// Keys must match the strict Zod schemas exactly (unknown keys are rejected).
export const defaultValues = {
  website: "", // honeypot
  main: { ...emptyAdult, maritalStatus: "" },
  address: { block: "", street: "", unitNo: "", postalCode: "" },
  spouse: {
    ...emptyAdult,
    isFromKoothanallur: null,
    nativePlace: "",
    numberOfChildren: "",
  },
  children: [],
  consent: {
    accuracyConfirmed: false,
    shareConsent: false,
    consentTextVersion: CONSENT_TEXT_VERSION,
  },
};

// One schema per wizard step; the resolver picks the one for the current step.
export const STEP_SCHEMAS = {
  main: z.object({ main: mainSchema, address: addressSchema }),
  spouse: z.object({ spouse: spouseSchema }),
  children: z.object({ children: z.array(childSchema) }),
  review: z.object({ consent: consentSchema }),
};

const validYear = (y) => /^\d{4}$/.test(String(y ?? "").trim());
export const isAdultYear = (y) => validYear(y) && isAdult(y);
const blank = (v) => !String(v ?? "").trim();

/** Rules Zod would only report after every other field is valid. */
export function extraErrors(step, v) {
  const out = [];
  if (
    step === "spouse" &&
    v.spouse.isFromKoothanallur === false &&
    blank(v.spouse.nativePlace)
  ) {
    out.push({
      name: "spouse.nativePlace",
      message: "Native place is required when spouse is not from Koothanallur",
    });
  }
  if (step === "children") {
    v.children.forEach((c, i) => {
      if (!isAdultYear(c.yearOfBirth)) return;
      if (blank(c.mobile))
        out.push({
          name: `children.${i}.mobile`,
          message: "Mobile number is required for children aged 18 or over",
        });
      if (blank(c.email))
        out.push({
          name: `children.${i}.email`,
          message: "Email is required for children aged 18 or over",
        });
    });
  }
  return out;
}

const pick = (o, keys) => Object.fromEntries(keys.map((k) => [k, o[k]]));
const ADULT_KEYS = [
  "fullName",
  "familyName",
  "fatherName",
  "motherName",
  "yearOfBirth",
  "gender",
  "mobile",
  "email",
];

/** Builds the exact JSON the API expects. Hidden/irrelevant fields are omitted. */
export function buildPayload(v, clientToken) {
  const married = v.main.maritalStatus === "MARRIED";
  const n = Number(v.spouse.numberOfChildren) || 0;

  const payload = {
    clientToken,
    website: v.website,
    main: pick(v.main, [...ADULT_KEYS, "maritalStatus"]),
    address: pick(v.address, ["block", "street", "unitNo", "postalCode"]),
    children: [],
    consent: pick(v.consent, [
      "accuracyConfirmed",
      "shareConsent",
      "consentTextVersion",
    ]),
  };

  if (married) {
    const s = v.spouse;
    payload.spouse = {
      ...pick(s, ADULT_KEYS),
      isFromKoothanallur: s.isFromKoothanallur,
      numberOfChildren: n,
      ...(s.isFromKoothanallur === false ? { nativePlace: s.nativePlace } : {}),
    };
    payload.children = v.children.slice(0, n).map((c) => {
      const base = pick(c, ["fullName", "yearOfBirth", "gender"]);
      return isAdultYear(c.yearOfBirth)
        ? { ...base, mobile: c.mobile, email: c.email }
        : base;
    });
  }
  return payload;
}

/** Which wizard step owns an API error path such as "children.0.mobile". */
export function stepForPath(path) {
  const root = String(path).split(".")[0];
  if (root === "main" || root === "address") return "main";
  if (root === "spouse") return "spouse";
  if (root === "children") return "children";
  return "review";
}
