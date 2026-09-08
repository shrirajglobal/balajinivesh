/**
 * Temporary external login redirect.
 * All in-app login entry points send users to Wealth Elite until the final
 * auth process is frozen.
 */
export const EXTERNAL_LOGIN_URL = "https://login.arn.wealthelite.in/";

/** Open the temporary external login page in a new tab. */
export function openExternalLogin() {
  if (typeof window !== "undefined") {
    window.open(EXTERNAL_LOGIN_URL, "_blank", "noopener,noreferrer");
  }
}
