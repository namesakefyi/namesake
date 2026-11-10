import type { LoaderContext } from "astro/loaders";
import { describe, expect, it, vi } from "vitest";
import { jurisdictionGlobLoader } from "../jurisdictionGlobLoader";

interface FakeEntry {
  id: string;
  data: Record<string, unknown>;
}

let fakeEntries: FakeEntry[] = [];

vi.mock("astro/loaders", () => ({
  glob: () => ({
    name: "glob-loader",
    load: async (context: LoaderContext) => {
      for (const { id, data } of fakeEntries) {
        await context.parseData({ id, data });
      }
    },
  }),
}));

async function loadEntries(entries: FakeEntry[]) {
  fakeEntries = entries;
  const parseData = vi.fn(async ({ data }) => data);
  const context = { parseData } as unknown as LoaderContext;
  await jurisdictionGlobLoader({
    collection: "forms",
    base: "./src/content/forms",
    pattern: "**/index.yml",
  }).load(context);
  return parseData;
}

describe("jurisdictionGlobLoader", () => {
  it("injects the jurisdiction from the entry's folder", async () => {
    const parseData = await loadEntries([
      { id: "ny/court-order", data: { title: "Court Order" } },
      { id: "social-security", data: { title: "Social Security" } },
    ]);

    expect(parseData).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { title: "Court Order", jurisdiction: "ny" },
      }),
    );
    expect(parseData).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { title: "Social Security", jurisdiction: undefined },
      }),
    );
  });

  it("rejects entries that set jurisdiction", async () => {
    await expect(
      loadEntries([{ id: "ma/court-order", data: { jurisdiction: "ri" } }]),
    ).rejects.toThrow("sets `jurisdiction`");
  });
});
