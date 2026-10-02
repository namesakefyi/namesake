import {
  type CustomPreviewTemplateProps,
  React,
  registerPreviewStyle,
  registerPreviewTemplate,
  renderRichText,
} from "@sveltia/cms";
import type { NamesakeColor } from "#constants/colors";
import { smartquotes } from "#lib/utils/smartquotes";
import boldFont from "../../fonts/AtkinsonHyperlegibleSoft-Bold.woff2?url";
import boldItalicFont from "../../fonts/AtkinsonHyperlegibleSoft-BoldItalic.woff2?url";
import regularFont from "../../fonts/AtkinsonHyperlegibleSoft-Regular.woff2?url";
import regularItalicFont from "../../fonts/AtkinsonHyperlegibleSoft-RegularItalic.woff2?url";
import baseCss from "../../styles/base.css?inline";
import pageHeadCss from "../../styles/page-head.css?inline";
import proseCss from "../../styles/prose.css?inline";
import resetCss from "../../styles/reset.css?inline";
import themeCss from "../../styles/theme.css?inline";
import previewCss from "./preview.css?inline";

// Use the copy of React bundled with the CMS, without JSX: a .tsx file
// here would be transformed for React Fast Refresh, which only works on
// pages with React islands.
const { createElement: h, useEffect, useRef } = React;

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
    previewCss,
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

type ArticlePreviewProps = CustomPreviewTemplateProps & {
  color?: NamesakeColor;
  date?: string;
  children?: React.ReactNode;
};

/** Mirrors ProseLayout and PageHeader. */
const ArticlePreview = ({
  entry,
  document,
  color,
  date,
  children,
}: ArticlePreviewProps) => {
  const title = getField<string>(entry, "title") ?? "";
  const description = getField<string>(entry, "description");
  const showDescription = getField<boolean>(entry, "showDescription") !== false;

  useEffect(() => {
    if (color) document.body.dataset.color = color;
    else delete document.body.dataset.color;
  }, [document, color]);

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
      h("section", { className: "prose" }, children),
    ),
  );
};

const PostPreview = (props: CustomPreviewTemplateProps) => {
  const { entry, getAsset, widgetFor } = props;
  const imageSrc = getField<string>(entry, "image", "src");
  const imageAlt = getField<string>(entry, "image", "alt") ?? "";
  const imageUrl = imageSrc ? getAsset(imageSrc)?.url : undefined;

  return h(
    ArticlePreview,
    {
      ...props,
      color: "blue",
      date: getField<string>(entry, "publishDate"),
    },
    imageUrl &&
      h("img", {
        className: "cover-image",
        src: imageUrl,
        alt: imageAlt,
        "data-key-path": "image",
      }),
    widgetFor("body"),
  );
};

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
    return renderRichText(bodyRef.current, markdown);
  }, [body]);

  return h(
    ArticlePreview,
    { ...props, color: "white" },
    h("div", { ref: bodyRef, "data-key-path": "body" }),
  );
};

registerPreviewTemplate("posts", PostPreview);
registerPreviewTemplate("pages", PagePreview);
registerPreviewTemplate("guides", GuidePreview);
