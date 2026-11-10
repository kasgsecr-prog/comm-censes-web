import { API_BASE_URL } from "./config.js";

/** RFC 4122 v4 UUID. crypto.randomUUID needs Safari 15.4+, so fall back to getRandomValues. */
export function newToken() {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  const b = new Uint8Array(16);
  c.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export class ApiError extends Error {
  constructor(status, code, message, details = []) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/** POST /api/submissions. Resolves { referenceNo, duplicate } or throws ApiError. */
export async function submitCensus(payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      credentials: "omit",
    });
  } catch {
    throw new ApiError(
      0,
      "NETWORK",
      "Could not reach the server. Check your connection and try again.",
    );
  } finally {
    clearTimeout(timer);
  }

  let json = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON error page */
  }
  if (res.ok && json?.data?.referenceNo) return json.data;

  const e = json?.error;
  throw new ApiError(
    res.status,
    e?.code ?? "UNKNOWN",
    e?.message ?? "Something went wrong. Please try again.",
    e?.details ?? [],
  );
}
