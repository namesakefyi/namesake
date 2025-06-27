import { JURISDICTIONS } from "../src/constants";
import { internalMutation } from "./_generated/server";

const seed = internalMutation(async (ctx) => {
  if (process.env.NODE_ENV === "production") {
    console.error("Cannot seed data in production");
    return;
  }

  const quests = await ctx.db.query("quests").collect();

  if (quests.length > 0) {
    console.log("Quest data already exists, skipping seeding quests");
  } else {
    console.log("Seeding quest data...");

    const systemUserId = await ctx.db.insert("users", {
      name: "System",
      email: "system@namesake.fyi",
      emailVerified: true,
      role: "admin",
    });

    console.log("Created system user");

    for (const jurisdiction of Object.keys(JURISDICTIONS)) {
      const slug = `court-order-${jurisdiction.toLowerCase()}`;

      await ctx.db.insert("quests", {
        title: "Court Order",
        slug,
        category: "courtOrder",
        jurisdiction,
        creationUser: systemUserId,
        updatedAt: Date.now(),
        updatedBy: systemUserId,
      });

      console.log(
        `Created quest: Court Order (${JURISDICTIONS[jurisdiction]})`,
      );
    }

    for (const jurisdiction of Object.keys(JURISDICTIONS)) {
      const slug = `state-id-${jurisdiction.toLowerCase()}`;

      await ctx.db.insert("quests", {
        title: "State ID",
        slug,
        category: "stateId",
        jurisdiction,
        creationUser: systemUserId,
        updatedAt: Date.now(),
        updatedBy: systemUserId,
      });

      console.log(`Created quest: State ID (${JURISDICTIONS[jurisdiction]})`);
    }

    for (const jurisdiction of Object.keys(JURISDICTIONS)) {
      const slug = `birth-certificate-${jurisdiction.toLowerCase()}`;

      await ctx.db.insert("quests", {
        title: "Birth Certificate",
        slug,
        category: "birthCertificate",
        jurisdiction,
        creationUser: systemUserId,
        updatedAt: Date.now(),
        updatedBy: systemUserId,
      });

      console.log(
        `Created quest: Birth Certificate (${JURISDICTIONS[jurisdiction]})`,
      );
    }

    await ctx.db.insert("quests", {
      title: "Social Security",
      slug: "social-security",
      category: "socialSecurity",
      creationUser: systemUserId,
      updatedAt: Date.now(),
      updatedBy: systemUserId,
    });

    console.log("Created quest: Social Security");

    await ctx.db.insert("quests", {
      title: "US Passport",
      slug: "passport",
      category: "passport",
      creationUser: systemUserId,
      updatedAt: Date.now(),
      updatedBy: systemUserId,
    });

    console.log("Created quest: Social Security");
  }
});

export default seed;
