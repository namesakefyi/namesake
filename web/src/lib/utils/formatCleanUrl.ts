/**
 * Given a URL, return the URL without protocol, "www", or trailing slash.
 *
 * @example
 * formatCleanUrl("https://www.masstpc.org/")
 * // "masstpc.org"
 */
export function formatCleanUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
