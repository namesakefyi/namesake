/**
 * Given a page title, optional delimiter, and site title,
 * return the full string to display in the page title.
 *
 * @example
 * formatPageTitle("Blog")
 * // "Blog · Namesake"
 */
export function formatPageTitle(
  title: string,
  delimiter = " · ",
  siteTitle: string | null | undefined = "Namesake",
) {
  const suffix = siteTitle ? `${delimiter}${siteTitle.trim()}` : "";

  return `${title.trim()}${suffix}`;
}
