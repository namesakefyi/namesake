import type { CmsConfig } from "@sveltia/cms";
import { ANNOTATION_TYPES } from "#constants/annotations";
import { CATEGORIES } from "#constants/categories";
import { COLOR_KEYS } from "#constants/colors";
import { JURISDICTIONS } from "#constants/jurisdictions";
import { DIRECTORY_LANGUAGES } from "#constants/languages";
import { SERVICES } from "#constants/services";

const CONTENT = "web/src/content";

const jurisdictionOptions = Object.entries(JURISDICTIONS).map(
  ([id, jurisdiction]) => ({ label: jurisdiction.name, value: id }),
);

const categoryOptions = Object.entries(CATEGORIES).map(([id, category]) => ({
  label: category.name,
  value: id,
}));

const languageNames = new Intl.DisplayNames(["en"], { type: "language" });
const languageOptions = DIRECTORY_LANGUAGES.map((language) => ({
  label: languageNames.of(language) ?? language,
  value: language,
}));

const serviceOptions = SERVICES.map((service) => ({
  label: service.title,
  value: service.value,
}));

export const cmsConfig: CmsConfig = {
  load_config_file: false,
  backend: {
    name: "github",
    repo: "namesakefyi/namesake",
    branch: "main",
    base_url: "https://sveltia-cms-auth.namesake.workers.dev",
    open_authoring: true,
    auth_scope: "public_repo",
    squash_merges: true,
    preview_context: "Workers Builds: web",
  },
  site_url: "https://namesake.fyi",
  publish_mode: "editorial_workflow",
  media_folder: "web/public/images",
  public_folder: "/images",
  output: {
    omit_empty_optional_fields: true,
  },
  collections: [
    {
      name: "posts",
      label: "Blog Posts",
      label_singular: "Blog Post",
      folder: `${CONTENT}/posts`,
      preview_path: "/blog/{{slug}}",
      path: "{{slug}}/index",
      extension: "mdx",
      format: "yaml-frontmatter",
      media_folder: "",
      public_folder: "",
      sortable_fields: ["publishDate", "title"],
      fields: [
        { name: "title", label: "Title" },
        { name: "description", label: "Description", widget: "text" },
        {
          name: "showDescription",
          label: "Show Description",
          widget: "boolean",
          default: true,
          required: false,
        },
        {
          name: "publishDate",
          label: "Publish Date",
          widget: "datetime",
          type: "date",
          default: "{{now}}",
        },
        {
          name: "authors",
          label: "Authors",
          widget: "relation",
          collection: "authors",
          display_fields: ["name"],
          search_fields: ["name"],
          multiple: true,
          required: false,
        },
        {
          name: "image",
          label: "Cover Image",
          widget: "object",
          required: false,
          fields: [
            { name: "src", label: "Image", widget: "image" },
            { name: "alt", label: "Alt Text" },
          ],
        },
        {
          name: "annotation",
          label: "Title Annotation",
          widget: "select",
          options: [...ANNOTATION_TYPES],
          required: false,
        },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
    {
      name: "guides",
      label: "Guides",
      label_singular: "Guide",
      folder: `${CONTENT}/guides`,
      preview_path: "/guides/{{slug}}",
      extension: "mdx",
      format: "yaml-frontmatter",
      nested: { subfolders: false },
      meta: { path: {} },
      fields: [
        { name: "title", label: "Title" },
        {
          name: "description",
          label: "Description",
          widget: "text",
          required: false,
        },
        {
          name: "jurisdiction",
          label: "Jurisdiction",
          widget: "select",
          options: jurisdictionOptions,
          required: false,
        },
        {
          name: "category",
          label: "Category",
          widget: "select",
          options: categoryOptions,
        },
        {
          name: "stub",
          label: "Stub",
          widget: "boolean",
          default: false,
          required: false,
        },
        {
          name: "unlisted",
          label: "Unlisted",
          widget: "boolean",
          default: false,
          required: false,
        },
        // Guides import and render Astro components, which the rich text
        // editor doesn't support, so edit the MDX source directly.
        {
          name: "body",
          label: "Body",
          widget: "code",
          default_language: "mdx",
          allow_language_selection: false,
          output_code_only: true,
        },
      ],
    },
    {
      name: "pages",
      label: "Pages",
      label_singular: "Page",
      folder: `${CONTENT}/pages`,
      preview_path: "/{{slug}}",
      extension: "md",
      format: "yaml-frontmatter",
      fields: [
        { name: "title", label: "Title" },
        { name: "description", label: "Description", widget: "text" },
        {
          name: "annotation",
          label: "Title Annotation",
          widget: "select",
          options: [...ANNOTATION_TYPES],
          required: false,
        },
        {
          name: "color",
          label: "Color",
          widget: "select",
          options: [...COLOR_KEYS],
          required: false,
        },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
    {
      name: "directory",
      label: "Directory",
      label_singular: "Organization",
      folder: `${CONTENT}/directory`,
      preview_path: "/directory/{{slug}}",
      path: "{{slug}}/index",
      extension: "yml",
      format: "yml",
      identifier_field: "name",
      media_folder: "",
      public_folder: "",
      fields: [
        { name: "name", label: "Name" },
        { name: "description", label: "Description", widget: "text" },
        {
          name: "jurisdictions",
          label: "Jurisdictions",
          widget: "select",
          options: jurisdictionOptions,
          multiple: true,
        },
        { name: "url", label: "Website URL" },
        {
          name: "services",
          label: "Services",
          widget: "select",
          options: serviceOptions,
          multiple: true,
        },
        {
          name: "languages",
          label: "Languages",
          widget: "select",
          options: languageOptions,
          multiple: true,
          default: ["en"],
        },
        {
          name: "officialPartner",
          label: "Official Partner",
          widget: "boolean",
          default: false,
          required: false,
        },
        { name: "email", label: "Email", required: false },
        {
          name: "phone",
          label: "Phone",
          required: false,
          pattern: [
            "^\\d{3}-\\d{3}-\\d{4}(;\\d{1,4})?$",
            "Use the format 555-555-5555, with an optional extension like ;123",
          ],
        },
        { name: "logo", label: "Logo", widget: "image", required: false },
      ],
    },
    {
      name: "authors",
      label: "Authors",
      label_singular: "Author",
      folder: `${CONTENT}/authors`,
      path: "{{slug}}/index",
      extension: "yml",
      format: "yml",
      identifier_field: "name",
      media_folder: "",
      public_folder: "",
      fields: [
        { name: "name", label: "Name" },
        { name: "role", label: "Role" },
        { name: "bio", label: "Bio", widget: "text" },
        { name: "avatar", label: "Avatar", widget: "image" },
        {
          name: "socialLinks",
          label: "Social Links",
          widget: "list",
          required: false,
          fields: [
            { name: "name", label: "Name" },
            { name: "url", label: "URL" },
          ],
        },
      ],
    },
    {
      name: "press",
      label: "Press",
      label_singular: "Press Mention",
      folder: `${CONTENT}/press`,
      preview_path: "/press",
      path: "{{slug}}/index",
      extension: "yml",
      format: "yml",
      media_folder: "",
      public_folder: "",
      sortable_fields: ["date", "title"],
      fields: [
        { name: "title", label: "Title" },
        { name: "outlet", label: "Outlet" },
        { name: "url", label: "URL" },
        { name: "date", label: "Date", widget: "datetime", type: "date" },
        {
          name: "image",
          label: "Image",
          widget: "object",
          required: false,
          fields: [
            { name: "src", label: "Image", widget: "image" },
            { name: "alt", label: "Alt Text" },
          ],
        },
      ],
    },
    {
      name: "sponsors",
      label: "Sponsors",
      label_singular: "Sponsor",
      folder: `${CONTENT}/sponsors`,
      preview_path: "/",
      path: "{{slug}}/index",
      extension: "yml",
      format: "yml",
      identifier_field: "name",
      media_folder: "",
      public_folder: "",
      fields: [
        { name: "name", label: "Name" },
        { name: "url", label: "URL" },
        { name: "logo", label: "Logo", widget: "image" },
      ],
    },
  ],
};
