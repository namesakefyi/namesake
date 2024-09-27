import { faker } from "@faker-js/faker";
import { internalMutation } from "./_generated/server";
import { JURISDICTIONS } from "./constants";

const seed = internalMutation(async (ctx) => {
  if (process.env.NODE_ENV === "production") {
    console.error("Cannot seed data in production");
    return;
  }

  const users = await ctx.db.query("users").collect();
  const quests = await ctx.db.query("quests").collect();
  if (users.length > 0 || quests.length > 0) {
    console.error("Data already exists, skipping seeding");
    return;
  }

  console.log("Seeding data...");

  for (let i = 0; i < 10; i++) {
    faker.seed();

    try {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const userId = await ctx.db.insert("users", {
        name: firstName,
        email: faker.internet.email({
          firstName: firstName,
          lastName: lastName,
        }),
        image: faker.image.avatar(),
        role: "admin",
        emailVerified: faker.datatype.boolean(),
        theme: faker.helpers.arrayElement(["system", "light", "dark"]),
      });
      console.log(`Created user ${firstName} ${lastName}`);

      const questTitle = faker.helpers.arrayElement([
        "Court Order",
        "State ID",
        "Birth Certificate",
      ]);
      const questJurisdiction = faker.helpers.arrayElement(
        Object.keys(JURISDICTIONS),
      );
      const iconForQuestTitle = (title: string) => {
        switch (title) {
          case "Court Order":
            return "gavel";
          case "State ID":
            return "id";
          case "Birth Certificate":
            return "certificate";
          default:
            return "signpost";
        }
      };
      await ctx.db.insert("quests", {
        icon: iconForQuestTitle(questTitle),
        title: questTitle,
        jurisdiction: questJurisdiction,
        creationUser: userId,
      });
      console.log(`Created quest ${questTitle} (${questJurisdiction})`);
    } catch (e) {
      throw new Error(`Failed to seed data: ${e}`);
    }
  }

  console.log("Finished seeding data");
});

export default seed;
