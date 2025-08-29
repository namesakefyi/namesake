export function formatPageTitle(
  title: string,
  divider = " · ",
  siteTitle: string | null | undefined = "Namesake",
) {
  const suffix = siteTitle ? `${divider}${siteTitle.trim()}` : "";

  return `${title.trim()}${suffix}`;
}
