// Latam vs Europe storefront resolution. Mirrors the list in the
// Criptoremesa-Frontend router guard (src/router/index.ts) — keep them in
// sync if a country is ever added.
const AMERICA_ISO_CODES = new Set([
  "AR", "BO", "BR", "CL", "CO", "CR", "CU", "DO", "EC", "SV",
  "GT", "HN", "MX", "NI", "PA", "PY", "PE", "PR", "UY", "VE",
  "CA", "US", "AG", "BS", "BB", "BZ", "DM", "GD", "HT", "JM",
  "KN", "LC", "VC", "TT", "SR", "GY",
]);

export function isInAmerica(iso) {
  return !!iso && AMERICA_ISO_CODES.has(String(iso).toUpperCase());
}

/**
 * Infer the storefront ('es' | 'com') from the incoming HTTP request's host
 * header. Use this when the email is triggered by the user themselves
 * (signup, forgot password, welcome) and the trust signal is the domain
 * they are navigating.
 */
export function inferDomainFromRequest(req) {
  if (!req) return "com";
  const host = String(
    (req.get && (req.get("origin") || req.get("host"))) ||
      req.hostname ||
      "",
  ).toLowerCase();
  return host.endsWith(".es") ? "es" : "com";
}

/**
 * Infer the storefront from a user's iso_code_resid_country. Use this when
 * the email is triggered by a third party (admin approving / rejecting a
 * verification, remittance completion) and the user's country is the
 * source of truth.
 */
export function inferDomainFromIso(iso) {
  return isInAmerica(iso) ? "com" : "es";
}
