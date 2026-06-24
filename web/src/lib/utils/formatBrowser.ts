import type { IBrowser } from "ua-parser-js";

/**
 * @param browser
 * Use with `UAParser(navigator.userAgent).browser` from "ua-parser-js".
 *
 * @returns The browser name, or "this browser" if unknown.
 *
 * @example
 * formatBrowser({ name: "Chrome" }) -> "Chrome"
 * formatBrowser(null) -> "this browser"
 */
export function formatBrowser(browser: Partial<IBrowser> | null) {
  return browser?.name || "this browser";
}
