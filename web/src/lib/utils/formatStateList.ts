/**
 * Given a list of state names, joins them into a grammatical English list.
 *
 * @example
 * formatStateList(["Massachusetts", "New York", "Vermont"])
 * // "Massachusetts, New York, and Vermont"
 */
export function formatStateList(stateNames: string[]): string {
  const formatter = new Intl.ListFormat("en-US", {
    type: "conjunction",
    style: "long",
  });
  const formattedStates = formatter.format(stateNames);

  return formattedStates;
}
