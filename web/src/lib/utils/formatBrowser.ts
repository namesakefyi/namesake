import type { IBrowser } from "ua-parser-js";

/**
 * Given a browser from `UAParser()`, return the browser name
 * or "this browser" if unknown.
 *
 * Use with `UAParser(navigator.userAgent).browser` from "ua-parser-js".
 *
 * @example
 * formatBrowser({ name: "Chrome" })
 * // "Chrome"
 * formatBrowser(null)
 * // "this browser"
 */
export function formatBrowser(browser: Partial<IBrowser> | null) {
  return browser?.name || "this browser";
}
