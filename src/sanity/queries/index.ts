import { defineQuery } from "groq";

/** Portable text `content` projection with internalLink reference resolution */
export const portableTextWithInternalLinks = `content[]{
  ...,
  markDefs[]{
    ...,
    _type == "internalLink" => {
      ...,
      "reference": @.reference->{_type, slug, title}
    }
  },
  _type == "formEmbed" => {
    ...,
    "form": form->{title, slug}
  }
}`;

// Guides
export const GUIDES_INDEX_QUERY = defineQuery(`
  *[_type == "guide" && defined(slug) && !unlisted]{
    title,
    slug,
    "state": state->name,
    "category": category->name,
    _updatedAt,
  } | order(publishDate desc)
`);

export const GUIDE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "guide" && slug.current == $slug][0]{
    ...,
    ${portableTextWithInternalLinks}
  }
`);

// Forms
export const FORMS_INDEX_QUERY = defineQuery(`
  *[_type == "form" && defined(slug) && !unlisted]{
    title,
    slug,
    _updatedAt,
  } | order(publishDate desc)
`);

export const FORM_BY_SLUG_QUERY = defineQuery(`
  *[_type == "form" && slug.current == $slug][0]
`);

export const FORM_BY_SLUG_WITH_GUIDE_COSTS_QUERY = defineQuery(`
  *[_type == "form" && slug.current == $slug][0]{
    title,
    description,
    banner,
    _updatedAt,
    state,
    category,
    "costs": *[_type == "guide" && state._ref == ^.state._ref && category._ref == ^.category._ref][0].costs
  }
`);

// References & guide costs
export const DOCUMENT_REFERENCE_BY_ID_QUERY = defineQuery(`
  *[_id == $ref]{_type, slug, title}[0]
`);

export const GUIDE_COSTS_BY_ID_QUERY = defineQuery(`
  *[_type == "guide" && _id == $_ref][0]{
    costs
  }
`);
