import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  category,
  field,
  groupQuestsBy,
  jurisdiction,
  role,
  status,
  theme,
  timeRequiredUnit,
} from "./validators";

/**
 * Represents a collection of steps and forms for a user to complete.
 * @param title - The title of the quest. (e.g. "Court Order")
 * @param category - The category of the quest. (e.g. "Social")
 * @param creationUser - The user who created the quest.
 * @param jurisdiction - The US State the quest applies to. (e.g. "MA")
 * @param costs - The costs of the quest in USD.
 * @param timeRequired - The estimated time required to complete the quest.
 * @param urls - Links to official documentation about changing names for this quest.
 * @param deletionTime - Time in ms since epoch when the quest was deleted.
 * @param content - Text written in markdown comprising the contents of the quest.
 */
const quests = defineTable({
  title: v.string(),
  category: v.optional(category),
  creationUser: v.id("users"),
  jurisdiction: v.optional(jurisdiction),
  costs: v.optional(
    v.array(
      v.object({
        cost: v.number(),
        description: v.string(),
      }),
    ),
  ),
  timeRequired: v.object({
    min: v.number(),
    max: v.number(),
    unit: timeRequiredUnit,
  }),
  urls: v.optional(v.array(v.string())),
  deletionTime: v.optional(v.number()),
  content: v.optional(v.string()),
}).index("category", ["category"]);

/**
 * Represents a single input field which may be shared across multiple quests
 * or steps. Data entered into these fields are end-to-end encrypted and used
 * to pre-fill fields that point to the same data in future quests.
 * @param type - The type of field. (e.g. "text", "select")
 * @param label - The label for the field. (e.g. "First Name")
 * @param slug - A unique identifier for the field, camel cased. (e.g. "firstName")
 * @param helpText - Additional help text for the field.
 * @param deletionTime - Time in ms since epoch when the field was deleted.
 */
const questFields = defineTable({
  type: field,
  label: v.string(),
  slug: v.string(),
  helpText: v.optional(v.string()),
  deletionTime: v.optional(v.number()),
});

/**
 * Represents a PDF form that can be filled out by users.
 * @param title - The title of the form. (e.g. "Petition to Change Name of Adult")
 * @param formCode - The legal code for the form. (e.g. "CJP 27")
 * @param creationUser - The user who created the form.
 * @param file - The storageId for the PDF file.
 * @param state - The US State the form applies to. (e.g. "MA")
 * @param deletionTime - Time in ms since epoch when the form was deleted.
 */
const forms = defineTable({
  title: v.string(),
  formCode: v.optional(v.string()),
  creationUser: v.id("users"),
  file: v.optional(v.id("_storage")),
  jurisdiction: jurisdiction,
  deletionTime: v.optional(v.number()),
});

/**
 * Represents a user of Namesake's identity.
 * @param name - The user's preferred first name.
 * @param role - The user's role: "admin", "editor", or "user".
 * @param image - A URL to the user's profile picture.
 * @param email - The user's email address.
 * @param emailVerified - Denotes whether the user has verified their email.
 * @param residence - The US State the user lives in.
 * @param birthplace - The US State the user was born in.
 * @param isMinor - Denotes users under 18.
 */
const users = defineTable({
  name: v.optional(v.string()),
  role: role,
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerified: v.boolean(),
  residence: v.optional(jurisdiction),
  birthplace: v.optional(jurisdiction),
  isMinor: v.optional(v.boolean()),
}).index("email", ["email"]);

/**
 * Pre-fillable user data entered throughout quests.
 * All data in this table is end-to-end encrypted.
 */
const userEncryptedData = defineTable({
  userId: v.id("users"),
  fieldId: v.id("questFields"),
  value: v.string(),
}).index("userId", ["userId"]);

/**
 * Store user preferences.
 * @param userId
 * @param theme - The user's preferred color scheme.
 * @param groupQuestsBy - The user's preferred way to group quests.
 */
const userSettings = defineTable({
  userId: v.id("users"),
  theme: v.optional(theme),
  groupQuestsBy: v.optional(groupQuestsBy),
}).index("userId", ["userId"]);

/**
 * Represents a user's unique progress in completing a quest.
 * @param userId
 * @param questId
 * @param status - The status of the quest.
 * @param completionTime - Time in ms since epoch when the user marked the quest as complete.
 */
const userQuests = defineTable({
  userId: v.id("users"),
  questId: v.id("quests"),
  status: status,
  completionTime: v.optional(v.number()),
})
  .index("userId", ["userId"])
  .index("questId", ["questId"]);

export default defineSchema({
  ...authTables,
  forms,
  quests,
  questFields,
  users,
  userEncryptedData,
  userSettings,
  userQuests,
});
