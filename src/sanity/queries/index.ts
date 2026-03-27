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
  }
}`;

// Pages
export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "page" && (slug.current == "index" || slug.current == "" || !defined(slug))][0]{
    _id,
    title,
    slug,
    description,
    ${portableTextWithInternalLinks},
    ogImage,
    annotation,
    color
  }
`);

export const PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    description,
    ${portableTextWithInternalLinks},
    ogImage,
    annotation,
    color
  }
`);

// Posts
export const POSTS_INDEX_QUERY = defineQuery(`
  *[_type == "post" && defined(slug) && publishDate <= now()]{
    title,
    slug,
    publishDate,
    description,
    image,
    "authors": authors[]->name
  } | order(publishDate desc)
`);

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    publishDate,
    description,
    showDescription,
    image,
    annotation,
    ${portableTextWithInternalLinks},
    "authors": authors[]->{
      _id,
      name,
      role,
      bio,
      avatar,
      socialLinks
    }
  }
`);

export const RSS_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug) && publishDate <= now()]{
    title,
    slug,
    publishDate,
    description,
    "contentText": pt::text(content)
  } | order(publishDate desc)
`);

// Guides
export const GUIDES_INDEX_QUERY = defineQuery(`
  *[_type == "guide" && defined(slug)]{
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
  *[_type == "form" && defined(slug)]{
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

// Press
export const PRESS_ARTICLES_QUERY = defineQuery(`
  *[_type == "press"]{
    _id,
    title,
    outlet,
    url,
    date,
    image
  } | order(date desc)
`);

// States
export const STATES_SUPPORT_QUERY = defineQuery(`
  *[_type == "state"]{
    name,
    "slug": slug.current,
    namesakeSupport
  }
`);

// Sponsors
export const SPONSORS_QUERY = defineQuery(`*[_type == "sponsor"]`);

// Directory
const directoryContactProjection = `{
  name,
  "slug": slug.current,
  description,
  "states": states[]->name | order(@ asc),
  services,
  logo,
  email,
  phone,
  url,
  officialPartner,
}`;

export const DIRECTORY_FILTER_STATES_QUERY = defineQuery(`
  *[_type == "state" && defined(slug)] | order(name asc) {
    name,
    "slug": slug.current
  }
`);

export const DIRECTORY_CONTACTS_LIST_QUERY = defineQuery(
  `*[_type == "contact" && defined(slug) && ($stateSlug == "" || $stateSlug in states[]->slug.current) && ($service == "" || $service in services)] ${directoryContactProjection} | order(officialPartner desc, name asc)`,
);
