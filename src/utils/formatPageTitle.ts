export function formatPageTitle(
	title: string,
	divider = " · ",
	siteTitle = "Namesake",
) {
	const suffix = siteTitle ? `${divider}${siteTitle}` : "";

	return `${title.trim()}${suffix}`;
}
