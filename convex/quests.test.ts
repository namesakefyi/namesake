import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

// TODO: Remove this import and this file;
// shouldn't need to use it since everything is in the default location
import { modules } from "./test.setup";

test("get all quests", async () => {
  const t = convexTest(schema, modules);
  const quests = await t.query(api.quests.getAllQuests);
  expect(quests).toMatchObject([]);
});
