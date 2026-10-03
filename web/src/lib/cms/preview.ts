import {
  type CustomPreviewTemplateProps,
  React,
  registerPreviewStyle,
  registerPreviewTemplate,
  renderRichText,
} from "@sveltia/cms";
import type { NamesakeColor } from "#constants/colors";
import { JURISDICTIONS } from "#constants/jurisdictions";
import { SERVICE_LABELS, type Service } from "#constants/services";
import { formatCleanUrl } from "#lib/utils/formatCleanUrl";
import { formatLanguage } from "#lib/utils/formatLanguage";
import { smartquotes } from "#lib/utils/smartquotes";
import boldFont from "../../fonts/AtkinsonHyperlegibleSoft-Bold.woff2?url";
import boldItalicFont from "../../fonts/AtkinsonHyperlegibleSoft-BoldItalic.woff2?url";
import regularFont from "../../fonts/AtkinsonHyperlegibleSoft-Regular.woff2?url";
import regularItalicFont from "../../fonts/AtkinsonHyperlegibleSoft-RegularItalic.woff2?url";
import baseCss from "../../styles/base.css?inline";
import directoryCss from "../../styles/directory.css?inline";
import pageHeadCss from "../../styles/page-head.css?inline";
import proseCss from "../../styles/prose.css?inline";
import resetCss from "../../styles/reset.css?inline";
import themeCss from "../../styles/theme.css?inline";

// Use the copy of React bundled with the CMS, without JSX: a .tsx file
// here would be transformed for React Fast Refresh, which only works on
// pages with React islands.
const { createElement: h, useEffect, useRef, useState } = React;

const fontFaces = [
  { src: regularFont, weight: 400, style: "normal" },
  { src: regularItalicFont, weight: 400, style: "italic" },
  { src: boldFont, weight: 700, style: "normal" },
  { src: boldItalicFont, weight: 700, style: "italic" },
]
  .map(
    (font) => `@font-face {
  font-family: "Atkinson Hyperlegible Soft";
  src: url("${new URL(font.src, window.location.origin)}") format("woff2");
  font-weight: ${font.weight};
  font-style: ${font.style};
  font-display: swap;
}`,
  )
  .join("\n");

registerPreviewStyle(
  [
    fontFaces,
    `:root { --font-sans: "Atkinson Hyperlegible Soft", Helvetica, Arial, sans-serif; }`,
    resetCss,
    themeCss,
    baseCss,
    proseCss,
    pageHeadCss,
    directoryCss,
    // The rich text preview sets `translate: 0`, which creates a stacking
    // context and keeps images from blending with the page background.
    ".prose [data-rich-text-preview] { translate: none; }",
  ].join("\n"),
  { raw: true },
);

/** Read an entry field. The CMS types `getIn` results as `never`. */
const getField = <T>(
  entry: CustomPreviewTemplateProps["entry"],
  ...keyPath: string[]
): T | undefined => entry.getIn(["data", ...keyPath]) as T | undefined;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

/** Mirrors the `color` prop of BaseLayout. */
const useBodyColor = (document: Document, color?: NamesakeColor) => {
  useEffect(() => {
    if (color) document.body.dataset.color = color;
    else delete document.body.dataset.color;
  }, [document, color]);
};

type ArticlePreviewProps = CustomPreviewTemplateProps & {
  color?: NamesakeColor;
  date?: string;
  afterHeader?: React.ReactNode;
  afterContent?: React.ReactNode;
  children?: React.ReactNode;
};

/** Mirrors ProseLayout and PageHeader. */
const ArticlePreview = ({
  entry,
  document,
  color,
  date,
  afterHeader,
  afterContent,
  children,
}: ArticlePreviewProps) => {
  const title = getField<string>(entry, "title") ?? "";
  const description = getField<string>(entry, "description");
  const showDescription = getField<boolean>(entry, "showDescription") !== false;

  useBodyColor(document, color);

  return h(
    "main",
    null,
    h(
      "article",
      { className: "article-grid" },
      h(
        "div",
        { className: "page-head" },
        date &&
          h(
            "time",
            { className: "date", dateTime: date },
            dateFormatter.format(new Date(date)),
          ),
        h("h1", { "data-key-path": "title" }, smartquotes(title)),
        description &&
          showDescription &&
          h(
            "p",
            { className: "subhead", "data-key-path": "description" },
            smartquotes(description),
          ),
      ),
      afterHeader,
      h("section", { className: "prose" }, children),
      afterContent,
    ),
  );
};

type Author = {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socialLinks?: { name: string; url: string }[];
};

/** Images stored alongside entries, keyed by file path. */
const entryImages = import.meta.glob<string>(
  "../../content/{authors,directory}/*/*.{jpg,jpeg,png,webp,avif,svg}",
  { eager: true, query: "?url", import: "default" },
);

/**
 * Resolve an image field, which is usually relative to its entry. Images
 * that aren't committed yet, such as new uploads, come from the CMS.
 */
const getImageUrl = (
  collection: "authors" | "directory",
  slug: string,
  path: string,
  getAsset: CustomPreviewTemplateProps["getAsset"],
) =>
  (path.startsWith("./") &&
    entryImages[`../../content/${collection}/${slug}/${path.slice(2)}`]) ||
  getAsset(path)?.url;

/** Mirrors the author list and bios on blog post pages. */
const usePostAuthors = ({
  entry,
  getCollection,
  getAsset,
}: CustomPreviewTemplateProps) => {
  const slugs = getField<{ toJS(): string[] }>(entry, "authors")?.toJS() ?? [];
  const slugsKey = slugs.join(",");
  const [authors, setAuthors] = useState<(Author & { slug: string })[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      slugs.map(async (slug) => {
        const authorEntry = (await getCollection(
          "authors",
          slug,
        )) as CustomPreviewTemplateProps["entry"];
        const data = getField<{ toJS(): Author }>(authorEntry)?.toJS();
        return data?.name ? { ...data, slug } : undefined;
      }),
    ).then((results) => {
      if (!cancelled) setAuthors(results.filter((author) => !!author));
    });
    return () => {
      cancelled = true;
    };
  }, [slugsKey]);

  const avatar = (author: Author & { slug: string }, size: number) => {
    const src = getImageUrl(
      "authors",
      author.slug,
      author.avatar ?? "",
      getAsset,
    );
    return (
      src &&
      h("img", {
        className: `avatar ${size === 32 ? "author" : "bio"}-avatar`,
        src,
        alt: `${author.name} photo`,
        width: size,
        height: size,
      })
    );
  };

  if (authors.length === 0) return {};

  return {
    afterHeader: h(
      "div",
      { className: "authors" },
      authors.map((author) =>
        h(
          "span",
          { key: author.slug, className: "author" },
          avatar(author, 32),
          h(
            "div",
            { className: "author-info" },
            h("strong", null, author.name),
            h("span", { className: "role" }, author.role),
          ),
        ),
      ),
    ),
    afterContent: h(
      "div",
      { className: "bios" },
      authors.map((author) =>
        h(
          "div",
          { key: author.slug, className: "bio" },
          avatar(author, 80),
          h(
            "div",
            { className: "content" },
            h("strong", null, author.name),
            h("p", null, author.bio),
            author.socialLinks &&
              author.socialLinks.length > 0 &&
              h(
                "ul",
                { className: "social" },
                author.socialLinks.map((link) =>
                  h(
                    "li",
                    { key: link.url },
                    h(
                      "a",
                      {
                        href: link.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      },
                      link.name,
                    ),
                  ),
                ),
              ),
          ),
        ),
      ),
    ),
  };
};

const PostPreview = (props: CustomPreviewTemplateProps) =>
  h(
    ArticlePreview,
    {
      ...props,
      ...usePostAuthors(props),
      color: "blue",
      date: getField<string>(props.entry, "publishDate"),
    },
    props.widgetFor("body"),
  );

const PagePreview = (props: CustomPreviewTemplateProps) =>
  h(
    ArticlePreview,
    { ...props, color: getField<NamesakeColor>(props.entry, "color") },
    props.widgetFor("body"),
  );

/**
 * Guide bodies are raw MDX. Render them as Markdown with the import
 * statements removed; Astro components can't be rendered here and are
 * dropped by the sanitizer.
 */
const GuidePreview = (props: CustomPreviewTemplateProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const body = getField<string>(props.entry, "body") ?? "";

  useEffect(() => {
    if (!bodyRef.current) return;
    const markdown = body.replace(/^(import|export)\s.*$/gm, "");
    // The preview renders in an iframe, and `renderRichText` rejects
    // elements from other windows (`instanceof Element`). Render into an
    // element from the CMS window, then move it into the preview.
    const target = window.document.createElement("div");
    const destroy = renderRichText(target, markdown);
    bodyRef.current.replaceChildren(target);
    return () => {
      destroy();
      target.remove();
    };
  }, [body]);

  return h(
    ArticlePreview,
    { ...props, color: "white" },
    h("div", { ref: bodyRef, "data-key-path": "body" }),
  );
};

/** Comma-separated links, like InlineLinkList. */
const inlineLinks = (items: { name: string; href: string }[]) =>
  items.flatMap((item, index) => [
    index > 0 && ", ",
    h("a", { key: item.href, href: item.href }, item.name),
  ]);

const getCleanUrl = (url: string) => {
  try {
    return formatCleanUrl(url);
  } catch {
    return url;
  }
};

/** Mirrors the directory entry page. */
const DirectoryPreview = ({
  entry,
  document,
  getAsset,
}: CustomPreviewTemplateProps) => {
  useBodyColor(document, "pink");

  const getList = (name: string) =>
    getField<{ toJS(): string[] }>(entry, name)?.toJS() ?? [];
  const name = getField<string>(entry, "name") ?? "";
  const description = getField<string>(entry, "description");
  const url = getField<string>(entry, "url");
  const email = getField<string>(entry, "email");
  const phone = getField<string>(entry, "phone");
  const logo = getField<string>(entry, "logo");
  const logoUrl =
    logo &&
    getImageUrl("directory", String(entry.get("slug") ?? ""), logo, getAsset);
  const jurisdictions = getList("jurisdictions")
    .map((id) => ({
      id,
      name: JURISDICTIONS[id as keyof typeof JURISDICTIONS]?.name ?? id,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const meta = (term: string, details: React.ReactNode) => [
    h("dt", { key: `${term}-term` }, term),
    h("dd", { key: `${term}-details` }, details),
  ];

  return h(
    "main",
    null,
    h(
      "div",
      { className: "page-head" },
      logoUrl &&
        h("img", {
          className: "directory-logo entry-logo",
          src: logoUrl,
          alt: "",
          "data-key-path": "logo",
        }),
      h("h1", { "data-key-path": "name" }, smartquotes(name)),
      description &&
        h(
          "p",
          { className: "subhead", "data-key-path": "description" },
          smartquotes(description),
        ),
    ),
    h(
      "section",
      { className: "entry-layout" },
      h(
        "dl",
        { className: "entry-meta" },
        meta(
          "Services",
          inlineLinks(
            getList("services").map((service) => ({
              name: SERVICE_LABELS[service as Service] ?? service,
              href: `/directory?service=${service}`,
            })),
          ),
        ),
        meta(
          "Languages",
          inlineLinks(
            getList("languages").map((language) => ({
              name: formatLanguage(language) ?? language,
              href: `/directory?language=${language}`,
            })),
          ),
        ),
        meta(
          jurisdictions.length > 1 ? "States" : "State",
          inlineLinks(
            jurisdictions.map((jurisdiction) => ({
              name: jurisdiction.name,
              href: `/directory?state=${jurisdiction.id}`,
            })),
          ),
        ),
        url && meta("Website", h("a", { href: url }, getCleanUrl(url))),
        email && meta("Email", h("a", { href: `mailto:${email}` }, email)),
        phone && meta("Phone", h("a", { href: `tel:${phone}` }, phone)),
      ),
    ),
  );
};

registerPreviewTemplate("posts", PostPreview);
registerPreviewTemplate("pages", PagePreview);
registerPreviewTemplate("guides", GuidePreview);
registerPreviewTemplate("directory", DirectoryPreview);
