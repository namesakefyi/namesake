import type { CollectionEntry } from "astro:content";
import { getCollection, getEntry } from "astro:content";
import { GUIDE_CATEGORY_ORDER } from "#constants/guides";

const categoryRank = (id: string) => {
  const i = GUIDE_CATEGORY_ORDER.indexOf(id);
  return i === -1 ? GUIDE_CATEGORY_ORDER.length : i;
};

export type GuideJurisdictionGroup = {
  jurisdiction: CollectionEntry<"jurisdictions">;
  guides: CollectionEntry<"guides">[];
};

export async function getGuidesByJurisdiction(): Promise<{
  generalGuides: CollectionEntry<"guides">[];
  guidesByJurisdiction: GuideJurisdictionGroup[];
}> {
  const allGuides = await getCollection("guides", ({ data }) => !data.unlisted);

  const generalGuides = allGuides.filter(({ data }) => !data.jurisdiction);

  const withJurisdiction = await Promise.all(
    allGuides.flatMap((guide) =>
      guide.data.jurisdiction
        ? [
            getEntry(guide.data.jurisdiction).then((jurisdiction) => ({
              guide,
              jurisdiction,
            })),
          ]
        : [],
    ),
  );

  const byJurisdiction = Object.groupBy(
    withJurisdiction,
    ({ jurisdiction }) => jurisdiction.id,
  );

  const guidesByJurisdiction = Object.values(byJurisdiction)
    .filter((group): group is typeof withJurisdiction => !!group)
    .map((group) => ({
      jurisdiction: group[0].jurisdiction,
      guides: group
        .map(({ guide }) => guide)
        .sort(
          (a, b) =>
            categoryRank(a.data.category.id) -
              categoryRank(b.data.category.id) ||
            a.data.title.localeCompare(b.data.title),
        ),
    }))
    .sort((a, b) =>
      a.jurisdiction.data.name.localeCompare(b.jurisdiction.data.name),
    );

  return { generalGuides, guidesByJurisdiction };
}
