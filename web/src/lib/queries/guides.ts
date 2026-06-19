import type { CollectionEntry } from "astro:content";
import { getCollection, getEntry } from "astro:content";
import { GUIDE_CATEGORY_ORDER } from "#constants/guides";

const categoryRank = (id: string) => {
  const i = GUIDE_CATEGORY_ORDER.indexOf(id);
  return i === -1 ? GUIDE_CATEGORY_ORDER.length : i;
};

export type GuideStateGroup = {
  state: CollectionEntry<"states">;
  guides: CollectionEntry<"guides">[];
};

export async function getGuidesByState(): Promise<{
  generalGuides: CollectionEntry<"guides">[];
  guidesByState: GuideStateGroup[];
}> {
  const allGuides = await getCollection("guides", ({ data }) => !data.unlisted);

  const generalGuides = allGuides.filter(({ data }) => !data.state);

  const withState = await Promise.all(
    allGuides.flatMap((guide) =>
      guide.data.state
        ? [getEntry(guide.data.state).then((state) => ({ guide, state }))]
        : [],
    ),
  );

  const byState = Object.groupBy(withState, ({ state }) => state.id);

  const guidesByState = Object.values(byState)
    .filter((group): group is typeof withState => !!group)
    .map((group) => ({
      state: group[0].state,
      guides: group
        .map(({ guide }) => guide)
        .sort(
          (a, b) =>
            categoryRank(a.data.category.id) -
              categoryRank(b.data.category.id) ||
            a.data.title.localeCompare(b.data.title),
        ),
    }))
    .sort((a, b) => a.state.data.name.localeCompare(b.state.data.name));

  return { generalGuides, guidesByState };
}
