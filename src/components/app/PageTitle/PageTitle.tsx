export interface PageTitleProps {
  /** The title of the page. */
  title: string;
  /** The divider between the title and the site title.
   * @default " · "
   */
  divider?: string;
  /** The site title.
   * @default "Namesake"
   */
  siteTitle?: string | null;
}

function constructPageTitle({
  title,
  divider = " · ",
  siteTitle = "Namesake",
}: PageTitleProps) {
  const suffix = siteTitle ? `${divider}${siteTitle}` : "";

  return `${title.trim()}${suffix}`;
}

export function PageTitle(props: PageTitleProps) {
  return <title>{constructPageTitle(props)}</title>;
}
