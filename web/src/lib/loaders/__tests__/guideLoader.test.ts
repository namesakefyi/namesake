import type { LoaderContext } from "astro/loaders";
import { describe, expect, it, vi } from "vitest";
import { guideLoader, parseJurisdictionFromPath } from "../guideLoader";

interface FakeEntry {
  entry: string;
  data: Record<string, unknown>;
}

let fakeEntries: FakeEntry[] = [];

vi.mock("astro/loaders", () => ({
  glob: ({ base }: { base: string }) => ({
    name: "glob-loader",
    load: async (context: LoaderContext) => {
      for (const { entry, data } of fakeEntries) {
        const filePath = new URL(`${base}/${entry}`, context.config.root)
          .pathname;
        await context.parseData({
          id: entry.replace(/\.mdx$/, ""),
          data,
          filePath,
        });
      }
    },
  }),
}));

async function loadEntries(entries: FakeEntry[]) {
  fakeEntries = entries;
  const parseData = vi.fn(async ({ data }) => data);
  const context = {
    config: { root: new URL("file:///project/") },
    parseData,
  } as unknown as LoaderContext;
  await guideLoader({ base: "./src/content/guides", pattern: "**/*.mdx" }).load(
    context,
  );
  return parseData;
}

describe("parseJurisdictionFromPath", () => {
  const jurisdictions = ["ma", "ri"];

  it("returns undefined for root-level entries", () => {
    expect(parseJurisdictionFromPath("passport.mdx", jurisdictions)).toBe(
      undefined,
    );
  });

  it("returns the folder name for entries in a jurisdiction folder", () => {
    expect(parseJurisdictionFromPath("ma/court-order.mdx", jurisdictions)).toBe(
      "ma",
    );
  });

  it("throws for unknown jurisdiction folders", () => {
    expect(() =>
      parseJurisdictionFromPath("zz/court-order.mdx", jurisdictions),
    ).toThrow(/unknown jurisdiction folder "zz"/);
  });

  it("throws for entries nested more than one folder deep", () => {
    expect(() =>
      parseJurisdictionFromPath("ma/extra/court-order.mdx", jurisdictions),
    ).toThrow(/nested too deeply/);
  });
});

describe("guideLoader", () => {
  it("injects the jurisdiction from the entry's folder", async () => {
    const parseData = await loadEntries([
      { entry: "ny/court-order.mdx", data: { title: "Court Order" } },
      { entry: "passport.mdx", data: { title: "Passport" } },
    ]);

    expect(parseData).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { title: "Court Order", jurisdiction: "ny" },
      }),
    );
    expect(parseData).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { title: "Passport", jurisdiction: undefined },
      }),
    );
  });

  it("rejects entries that set jurisdiction in frontmatter", async () => {
    await expect(
      loadEntries([
        { entry: "ma/court-order.mdx", data: { jurisdiction: "ri" } },
      ]),
    ).rejects.toThrow("sets `jurisdiction` in its frontmatter");
  });
});
