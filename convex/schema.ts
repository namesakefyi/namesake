import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  category,
  groupQuestsBy,
  jurisdiction,
  role,
  status,
  theme,
  timeRequiredUnit,
} from "./validators";

// ----------------------------------------------
// Questions
// ----------------------------------------------

/**
 * A shared topic used to tag and organize questions.
 */
const topics = defineTable({
  /** The name of the topic. Should be short and unique. */
  topic: v.string(),
});

/**
 * A frequently asked question and its answer.
 */
const questions = defineTable({
  /** A frequently asked question. */
  question: v.string(),
  /** The rich text answer to the question, stored as HTML. */
  answer: v.string(),
  /** One or more topics related to the question. */
  topics: v.array(v.id("topics")),
  /** Optional quests related to the question. */
  relatedQuests: v.optional(v.array(v.id("quests"))),
})
  .index("topics", ["topics"])
  .index("relatedQuests", ["relatedQuests"]);

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
  /** The category of the quest. (e.g. "Core", "Social") */
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
  /** Links to official documentation about changing names for this quest. */
  urls: v.optional(v.array(v.string())),
  /** Time in ms since epoch when the quest was deleted. */
  deletionTime: v.optional(v.number()),
  /** Rich text comprising the contents of the quest, stored as HTML. */
  content: v.optional(v.string()),
  /** A JSON schema defining the form fields for this quest. */
  formSchema: v.optional(v.string()),
}).index("category", ["category"]);

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
  /** The US State the document applies to. */
  jurisdiction: jurisdiction,
  /** Time in ms since epoch when the document was deleted. */
  deletionTime: v.optional(v.number()),
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
  /** The US State where the user was born. */
  birthplace: v.optional(jurisdiction),
  /** Whether the user is a minor. */
  isMinor: v.optional(v.boolean()),
}).index("email", ["email"]);

/**
 * A unique piece of user data that has been enteed through filling a form.
 */
const userFormData = defineTable({
  /** The user who owns the data. */
  userId: v.id("users"),
  /** The name of the field, e.g. "firstName". */
  field: v.string(),
  /** The value of the field. */
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
  /** The user's preferred way to group quests. (e.g. "dateAdded", "category") */
  groupQuestsBy: v.optional(groupQuestsBy),
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
  completionTime: v.optional(v.number()),
})
  .index("userId", ["userId"])
  .index("questId", ["questId"]);

export default defineSchema({
  ...authTables,
  questions,
  topics,
  documents,
  quests,
  users,
  userFormData,
  userSettings,
  userQuests,
});
