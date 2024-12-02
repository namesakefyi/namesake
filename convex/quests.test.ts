import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("quests", () => {
  it("gets all quests", async () => {
    const t = convexTest(schema, modules);
    const quests = await t.query(api.quests.getAllQuests);
    expect(quests).toMatchObject([]);
  });
});
