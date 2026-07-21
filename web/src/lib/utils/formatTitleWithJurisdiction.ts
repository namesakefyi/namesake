/**
 * Given a title and jurisdiction
 * return the full string to display in the page title.
 *
 * @example
 * formatPageTitle("Court Order", "Massachusetts")
 * // "Massachusetts Court Order"
 */
export function formatTitleWithJurisdiction(
  title: string,
  jurisdiction: string,
) {
  return `${jurisdiction} ${title}`;
}
