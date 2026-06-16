/**
 * Strips protocol, www prefix, and trailing slash from a URL for display.
 * e.g. "https://www.masstpc.org/" -> "masstpc.org"
 */
export function formatCleanUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
