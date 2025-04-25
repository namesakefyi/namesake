import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  birthplace,
  category,
  jurisdiction,
  role,
  status,
  theme,
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
      })
    )
  ),
  /** The estimated time required to complete the quest. */
  timeRequired: v.optional(
    v.object({
      min: v.number(),
      max: v.number(),
      unit: timeRequiredUnit,
      description: v.optional(v.string()),
    })
  ),
  /** Time in ms since epoch when the quest was deleted. */
  deletedAt: v.optional(v.number()),
  /** Rich text comprising the contents of the quest, stored as HTML. */
  content: v.optional(v.string()),
  /** Questions related to the quest. */
  faqs: v.optional(v.array(v.id("questFaqs"))),
  /** Time in ms since epoch when the quest was last updated. */
  updatedAt: v.number(),
  /** The user who last updated the quest. */
  updatedBy: v.optional(v.id("users")),
})
  .index("slug", ["slug"])
  .index("category", ["category"])
  .index("categoryAndJurisdiction", ["category", "jurisdiction"])
  .index("faqs", ["faqs"])
  .index("updatedAt", ["updatedAt"])
  .index("updatedBy", ["updatedBy"]);

/**
 * A frequently asked question and its answer.
 */
const questFaqs = defineTable({
  /** A frequently asked question. */
  question: v.string(),
  /** The rich text answer to the question, stored as HTML. */
  answer: v.string(),
  /** The user who published the FAQ. */
  author: v.id("users"),
  /** Date the FAQ was updated, in ms since epoch. */
  updatedAt: v.number(),
})
  .index("author", ["author"])
  .index("updatedAt", ["updatedAt"]);

/**
 * A PDF document that can be filled out by users.
 */
const documents = defineTable({
  /** The quest this document belongs to. */
  questId: v.id("quests"),
  /** The title of the document. (e.g. "Petition to Change Name of Adult") */
  title: v.string(),
  /** The legal code for the document. (e.g. "CJP 27") */
  code: v.optional(v.string()),
  /** The user who created the document. */
  creationUser: v.id("users"),
  /** The storageId for the PDF file. */
  file: v.optional(v.id("_storage")),
  /** Time in ms since epoch when the document was deleted. */
  deletedAt: v.optional(v.number()),
}).index("quest", ["questId"]);

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
  /** The US State where the user resides. */
  residence: v.optional(jurisdiction),
  /** The US State where the user was born, or "other" if they were born outside the US. */
  birthplace: v.optional(birthplace),
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
 * A user's preferences.
 */
const userSettings = defineTable({
  /** The user who owns the settings. */
  userId: v.id("users"),
  /** The user's preferred color scheme. (e.g. "system", "light", "dark") */
  theme: v.optional(theme),
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
  ...authTables,
  earlyAccessCodes,
  documents,
  quests,
  questFaqs,
  users,
  userFormResponses,
  userSettings,
  userQuests,
});
