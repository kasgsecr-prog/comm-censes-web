// Public configuration and legal text. Text here must match CONSENT_TEXT_VERSION in shared/schema.js.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

// TODO: replace with the association's real contact point for PDPA access/withdrawal requests.
export const CONTACT_EMAIL = "kasg.secr@gmail.com";

export const PDPA_NOTICE =
  "This census is conducted in compliance with the Singapore Personal Data Protection Act (PDPA). " +
  "All personal data collected will be kept confidential and used only for legitimate association purposes. " +
  "Only the full name, family name, address, and contact details of the main family member " +
  "may be shared with KA members solely for wedding invitations and other family occasion-related communications.";

export const CONSENT_ACCURACY =
  "I confirm that the information provided is accurate and correct.";
export const CONSENT_SHARE =
  "I consent to the collection and use of my personal data for Association purposes and to the sharing of " +
  "the main family member's name, address, and contact details with KA members solely for wedding invitations " +
  "and family occasion-related communications, in accordance with the PDPA.";

export const RETENTION_NOTE =
  "Personal data will be retained and reviewed periodically. Members are encouraged to update the Association whenever their details change.";
