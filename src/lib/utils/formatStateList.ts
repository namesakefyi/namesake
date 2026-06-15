export function formatStateList(stateNames: string[]): string {
  const formatter = new Intl.ListFormat("en-US", {
    type: "conjunction",
    style: "long",
  });
  const formattedStates = formatter.format(stateNames);

  return formattedStates;
}
