import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  category,
  field,
  jurisdiction,
  role,
  sortQuestsBy,
  theme,
} from "./validators";

/**
 * Represents a collection of steps and forms for a user to complete.
 * @param title - The title of the quest. (e.g. "Court Order")
 * @param category - The category of the quest. (e.g. "Social")
 * @param creationUser - The user who created the quest.
 * @param jurisdiction - The US State the quest applies to. (e.g. "MA")
 * @param deletionTime - Time in ms since epoch when the quest was deleted.
 * @param steps - An ordered list of steps to complete the quest.
 */
const quests = defineTable({
  title: v.string(),
  icon: v.optional(v.string()), // TODO: Delete
  category: v.optional(category),
  creationUser: v.id("users"),
  jurisdiction: v.optional(jurisdiction),
  deletionTime: v.optional(v.number()),
  steps: v.optional(v.array(v.id("questSteps"))),
}).index("category", ["category"]);

/**
 * Represents a single step in a quest.
 * @param questId - The quest this step belongs to.
 * @param creationUser - The user who created the step.
 * @param title - The title of the step. (e.g. "Fill out form")
 * @param description - A description of the step.
 * @param fields - An array of form fields to complete the step.
 */
const questSteps = defineTable({
  questId: v.id("quests"),
  creationUser: v.id("users"),
  title: v.string(),
  description: v.optional(v.string()),
  fields: v.optional(v.array(v.id("questFields"))),
}).index("questId", ["questId"]);

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
 * Represents a user of Namesake.
 * @param name - The user's preferred first name.
 * @param role - The user's role: "admin", "editor", or "user".
 * @param image - A URL to the user's profile picture.
 * @param email - The user's email address.
 * @param emailVerificationTime - Time in ms since epoch when the user verified their email.
 * @param isAnonymous - Denotes anonymous/unauthenticated users.
 * @param isMinor - Denotes users under 18.
 * @param preferredTheme - The user's preferred color scheme.
 */
const users = defineTable({
  name: v.optional(v.string()),
  role: role,
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerified: v.boolean(),
  jurisdiction: v.optional(jurisdiction),
  isMinor: v.optional(v.boolean()),
  theme: theme,
  sortQuestsBy: v.optional(sortQuestsBy),
}).index("email", ["email"]);

/**
 * Represents a user's unique progress in completing a quest.
 * @param userId
 * @param questId
 * @param completionTime - Time in ms since epoch when the user marked the quest as complete.
 */
const userQuests = defineTable({
  userId: v.id("users"),
  questId: v.id("quests"),
  completionTime: v.optional(v.number()),
})
  .index("userId", ["userId"])
  .index("questId", ["questId"]);

/**
 * Pre-fillable user data entered throughout quests.
 * All data in this table is end-to-end encrypted.
 */
const userData = defineTable({
  userId: v.id("users"),
  fieldId: v.id("questFields"),
  value: v.string(),
}).index("userId", ["userId"]);

export default defineSchema({
  ...authTables,
  forms,
  quests,
  questSteps,
  questFields,
  users,
  userQuests,
  userData,
});
