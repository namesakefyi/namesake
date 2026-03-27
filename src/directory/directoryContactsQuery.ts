export const DIRECTORY_CONTACT_PROJECTION = `{
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

export const DIRECTORY_CONTACTS_LIST_GROQ = `*[_type == "contact" && defined(slug) && ($stateSlug == "" || $stateSlug in states[]->slug.current) && ($service == "" || $service in services)] ${DIRECTORY_CONTACT_PROJECTION} | order(officialPartner desc, name asc)`;
