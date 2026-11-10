// Public configuration and legal text. Text here must match CONSENT_TEXT_VERSION in shared/schema.js.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

// TODO: replace with the association's real contact point for PDPA access/withdrawal requests.
export const CONTACT_EMAIL = "kasg.secr@gmail.com";

export const PDPA_NOTICE =
  "This census is conducted in compliance with the Singapore Personal Data Protection Act (PDPA). " +
  "All data collected is kept strictly within the association. Only the name, address and contact details " +
  "of the main member will be shared with KA members, and only for wedding invitation purposes. " +
  "No other data will be shared or used for any other purpose.";

export const CONSENT_ACCURACY = "I confirm that the data provided is accurate.";
export const CONSENT_SHARE =
  "I consent to share the main member's name, address and contact details with KA members for wedding invitation purposes only.";

export const RETENTION_NOTE =
  "Your response is kept for 5 years and then reviewed by the association for deletion.";
