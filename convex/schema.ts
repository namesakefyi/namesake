import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  category,
  jurisdiction,
  pdfId,
  role,
  status,
  theme,
  themeColor,
  timeRequiredUnit,
} from "./validators";

// ----------------------------------------------
// Quests
// ----------------------------------------------

/**
 * A series of steps and documents which guides users through
 * changing their name for a single location / entity.
 */
const quests = defineTable({
  /** The title of the quest. (e.g. "Court Order") */
  title: v.string(),
  /** The slug of the quest. (e.g. "court-order") */
  slug: v.string(),
  /** The category of the quest. (e.g. "Education", "Social") */
  category: v.optional(category),
  /** The user who created the quest. */
  creationUser: v.id("users"),
  /** The US State the quest applies to. */
  jurisdiction: v.optional(jurisdiction),
  /** The costs of the quest in USD. */
  costs: v.optional(
    v.array(
      v.object({
        cost: v.number(),
        description: v.string(),
        isRequired: v.optional(v.boolean()),
      }),
    ),
  ),
  /** The estimated time required to complete the quest. */
  timeRequired: v.optional(
    v.object({
      min: v.number(),
      max: v.number(),
      unit: timeRequiredUnit,
      description: v.optional(v.string()),
    }),
  ),
  /** Time in ms since epoch when the quest was deleted. */
  deletedAt: v.optional(v.number()),
  /** Rich text comprising the contents of the quest, stored as HTML. */
  content: v.optional(v.string()),
  /** Time in ms since epoch when the quest was last updated. */
  updatedAt: v.number(),
  /** The user who last updated the quest. */
  updatedBy: v.optional(v.id("users")),
})
  .index("slug", ["slug"])
  .index("category", ["category"])
  .index("categoryAndJurisdiction", ["category", "jurisdiction"])
  .index("updatedAt", ["updatedAt"])
  .index("updatedBy", ["updatedBy"]);

// ----------------------------------------------
// Users
// ----------------------------------------------

/**
 * A Namesake user's identity.
 */
const users = defineTable({
  /** The user's name. */
  name: v.optional(v.string()),
  /** The user's role. */
  role: role,
  /** The user's profile image. */
  image: v.optional(v.string()),
  /** The user's email address. */
  email: v.optional(v.string()),
  /** Whether the user's email address has been verified. */
  emailVerified: v.optional(v.boolean()),
  /** Whether the user is a minor. */
  isMinor: v.optional(v.boolean()),
}).index("email", ["email"]);

/**
 * A unique piece of user data that has been entered through filling a form.
 */
const userFormResponses = defineTable({
  /** The user who owns the data. */
  userId: v.id("users"),
  /** The name of the field, e.g. "firstName" or "isMinor". */
  field: v.string(),
  /** The value of the field, e.g. "Eva" or "false". */
  value: v.any(),
})
  .index("userId", ["userId"])
  .index("userIdAndField", ["userId", "field"]);

/**
 * A specific PDF form connected to a user.
 */
const userDocuments = defineTable({
  /** The user who owns the document. */
  userId: v.id("users"),
  /** A reference to the PDF ID. */
  pdfId: pdfId,
})
  .index("userId", ["userId"])
  .index("userIdAndPdfId", ["userId", "pdfId"]);

/**
 * A user's preferences.
 */
const userSettings = defineTable({
  /** The user who owns the settings. */
  userId: v.id("users"),
  /** The user's preferred color scheme. (e.g. "system", "light", "dark") */
  theme: v.optional(theme),
  /** The user's preferred color. */
  color: v.optional(themeColor),
}).index("userId", ["userId"]);

/**
 * A user's unique progress in completing a quest.
 */
const userQuests = defineTable({
  /** The user who is working on the quest. */
  userId: v.id("users"),
  /** The quest that the user is working on. */
  questId: v.id("quests"),
  /** The status of the quest. */
  status: status,
  /** Time in ms since epoch when the user marked the quest as complete. */
  completedAt: v.optional(v.number()),
  /** Time in ms since epoch when the user started the quest. */
  startedAt: v.optional(v.number()),
})
  .index("userId", ["userId"])
  .index("questId", ["questId"]);

/**
 * Placeholders for core quests.
 */
const userQuestPlaceholders = defineTable({
  /** The user who owns the placeholder. */
  userId: v.id("users"),
  /** The category of the placeholder. */
  category: category,
  /** Time the placeholder was dismissed. */
  dismissedAt: v.optional(v.number()),
})
  .index("userId", ["userId"])
  .index("userIdAndCategory", ["userId", "category"]);

// ----------------------------------------------
// Early Access
// ----------------------------------------------

/**
 * Codes to enable early access to the app.
 */
const earlyAccessCodes = defineTable({
  /** The user who created the code. */
  createdBy: v.id("users"),
  /** The time the code was claimed. */
  claimedAt: v.optional(v.number()),
}).index("createdBy", ["createdBy"]);

export default defineSchema({
  earlyAccessCodes,
  quests,
  users,
  userDocuments,
  userFormResponses,
  userSettings,
  userQuests,
  userQuestPlaceholders,
});
