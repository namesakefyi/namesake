import type { IBrowser } from "ua-parser-js";

export function formatBrowser(browser: Partial<IBrowser> | null) {
  return browser?.name || "this browser";
}
