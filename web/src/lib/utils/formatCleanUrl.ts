/**
 * Given a URL or hostname, return its hostname without "www".
 *
 * @example
 * formatCleanUrl("https://www.masstpc.org/")
 * // "masstpc.org"
 */
export function formatCleanUrl(url: string): string {
  // Ensure handling of links that are already hostnames without typeerror
  const absoluteUrl = url.includes("://") ? url : `https://${url}`;

  return new URL(absoluteUrl).hostname.replace(/^www\./, "");
}
