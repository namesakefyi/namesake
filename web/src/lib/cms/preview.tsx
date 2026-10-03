/** @jsxRuntime classic */
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
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

// Hooks only work with the React bundled with the CMS, so JSX compiles to
// its `createElement`. See the React integration in astro.config.ts.
const { useEffect, useRef, useState } = React;

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
const getField = <T,>(
  entry: CustomPreviewTemplateProps["entry"],
  ...keyPath: string[]
): T | undefined => entry.getIn(["data", ...keyPath]) as T | undefined;

const getList = <T = string>(
  entry: CustomPreviewTemplateProps["entry"],
  name: string,
): T[] => getField<{ toJS(): T[] }>(entry, name)?.toJS() ?? [];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

const useBodyColor = (document: Document, color?: NamesakeColor) => {
  useEffect(() => {
    if (color) document.body.dataset.color = color;
    else delete document.body.dataset.color;
  }, [document, color]);
};

const entryImages = import.meta.glob<string>(
  "../../content/{authors,directory}/*/*.{jpg,jpeg,png,webp,avif,svg}",
  { eager: true, query: "?url", import: "default" },
);

/** Images that aren't committed yet, such as new uploads, come from the CMS. */
const getImageUrl = (
  collection: "authors" | "directory",
  slug: string,
  path: string,
  getAsset: CustomPreviewTemplateProps["getAsset"],
) =>
  (path.startsWith("./") &&
    entryImages[`../../content/${collection}/${slug}/${path.slice(2)}`]) ||
  getAsset(path)?.url;

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

  return (
    <main>
      <article className="article-grid">
        <div className="page-head">
          {date && (
            <time className="date" dateTime={date}>
              {dateFormatter.format(new Date(date))}
            </time>
          )}
          <h1 data-key-path="title">{smartquotes(title)}</h1>
          {description && showDescription && (
            <p className="subhead" data-key-path="description">
              {smartquotes(description)}
            </p>
          )}
        </div>
        {afterHeader}
        <section className="prose">{children}</section>
        {afterContent}
      </article>
    </main>
  );
};

type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  socialLinks?: { name: string; url: string }[];
};

const usePostAuthors = ({
  entry,
  getCollection,
  getAsset,
}: CustomPreviewTemplateProps) => {
  const slugsKey = getList(entry, "authors").join(",");
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    let cancelled = false;
    const slugs = slugsKey ? slugsKey.split(",") : [];
    Promise.all(
      slugs.map(async (slug) => {
        const authorEntry = (await getCollection(
          "authors",
          slug,
        )) as CustomPreviewTemplateProps["entry"];
        const data = getField<{
          toJS(): Omit<Author, "slug" | "avatarUrl"> & { avatar?: string };
        }>(authorEntry)?.toJS();
        if (!data?.name) return undefined;
        const { avatar, ...author } = data;
        return {
          ...author,
          slug,
          avatarUrl: avatar && getImageUrl("authors", slug, avatar, getAsset),
        };
      }),
    ).then((results) => {
      if (!cancelled) setAuthors(results.filter((author) => !!author));
    });
    return () => {
      cancelled = true;
    };
  }, [slugsKey]);

  return authors;
};

const AuthorAvatar = ({
  author,
  className,
  size,
}: {
  author: Author;
  className: string;
  size: number;
}) =>
  author.avatarUrl ? (
    <img
      className={`avatar ${className}`}
      src={author.avatarUrl}
      alt={author.name}
      width={size}
      height={size}
    />
  ) : null;

const AuthorList = ({ authors }: { authors: Author[] }) =>
  authors.length > 0 && (
    <div className="authors">
      {authors.map((author) => (
        <span key={author.slug} className="author">
          <AuthorAvatar author={author} className="author-avatar" size={32} />
          <div className="author-info">
            <strong>{author.name}</strong>
            <span className="role">{author.role}</span>
          </div>
        </span>
      ))}
    </div>
  );

const AuthorBios = ({ authors }: { authors: Author[] }) =>
  authors.length > 0 && (
    <div className="bios">
      {authors.map((author) => (
        <div key={author.slug} className="bio">
          <AuthorAvatar author={author} className="bio-avatar" size={80} />
          <div className="content">
            <strong>{author.name}</strong>
            <p>{author.bio}</p>
            {author.socialLinks && author.socialLinks.length > 0 && (
              <ul className="social">
                {author.socialLinks.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );

const PostPreview = (props: CustomPreviewTemplateProps) => {
  const authors = usePostAuthors(props);

  return (
    <ArticlePreview
      {...props}
      color="blue"
      date={getField<string>(props.entry, "publishDate")}
      afterHeader={<AuthorList authors={authors} />}
      afterContent={<AuthorBios authors={authors} />}
    >
      {props.widgetFor("body")}
    </ArticlePreview>
  );
};

const PagePreview = (props: CustomPreviewTemplateProps) => (
  <ArticlePreview
    {...props}
    color={getField<NamesakeColor>(props.entry, "color")}
  >
    {props.widgetFor("body")}
  </ArticlePreview>
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

  return (
    <ArticlePreview {...props} color="white">
      <div ref={bodyRef} data-key-path="body" />
    </ArticlePreview>
  );
};

const InlineLinkList = ({
  items,
}: {
  items: { name: string; href: string }[];
}) =>
  items.map((item, index) => (
    <React.Fragment key={item.href}>
      <a href={item.href}>{item.name}</a>
      {index < items.length - 1 && ", "}
    </React.Fragment>
  ));

const MetaItem = ({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) => (
  <>
    <dt>{term}</dt>
    <dd>{children}</dd>
  </>
);

const getCleanUrl = (url: string) => {
  try {
    return formatCleanUrl(url);
  } catch {
    return url;
  }
};

const DirectoryPreview = ({
  entry,
  document,
  getAsset,
}: CustomPreviewTemplateProps) => {
  useBodyColor(document, "pink");

  const name = getField<string>(entry, "name") ?? "";
  const description = getField<string>(entry, "description");
  const url = getField<string>(entry, "url");
  const email = getField<string>(entry, "email");
  const phone = getField<string>(entry, "phone");
  const logo = getField<string>(entry, "logo");
  const logoUrl =
    logo &&
    getImageUrl("directory", String(entry.get("slug") ?? ""), logo, getAsset);
  const jurisdictions = getList(entry, "jurisdictions")
    .map((id) => ({
      id,
      name: JURISDICTIONS[id as keyof typeof JURISDICTIONS]?.name ?? id,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main>
      <div className="page-head">
        {logoUrl && (
          <img
            className="directory-logo entry-logo"
            src={logoUrl}
            alt=""
            data-key-path="logo"
          />
        )}
        <h1 data-key-path="name">{smartquotes(name)}</h1>
        {description && (
          <p className="subhead" data-key-path="description">
            {smartquotes(description)}
          </p>
        )}
      </div>
      <section className="entry-layout">
        <dl className="entry-meta">
          <MetaItem term="Services">
            <InlineLinkList
              items={getList(entry, "services").map((service) => ({
                name: SERVICE_LABELS[service as Service] ?? service,
                href: `/directory?service=${service}`,
              }))}
            />
          </MetaItem>
          <MetaItem term="Languages">
            <InlineLinkList
              items={getList(entry, "languages").map((language) => ({
                name: formatLanguage(language) ?? language,
                href: `/directory?language=${language}`,
              }))}
            />
          </MetaItem>
          <MetaItem term={jurisdictions.length > 1 ? "States" : "State"}>
            <InlineLinkList
              items={jurisdictions.map((jurisdiction) => ({
                name: jurisdiction.name,
                href: `/directory?state=${jurisdiction.id}`,
              }))}
            />
          </MetaItem>
          {url && (
            <MetaItem term="Website">
              <a href={url}>{getCleanUrl(url)}</a>
            </MetaItem>
          )}
          {email && (
            <MetaItem term="Email">
              <a href={`mailto:${email}`}>{email}</a>
            </MetaItem>
          )}
          {phone && (
            <MetaItem term="Phone">
              <a href={`tel:${phone}`}>{phone}</a>
            </MetaItem>
          )}
        </dl>
      </section>
    </main>
  );
};

registerPreviewTemplate("posts", PostPreview);
registerPreviewTemplate("pages", PagePreview);
registerPreviewTemplate("guides", GuidePreview);
registerPreviewTemplate("directory", DirectoryPreview);
