import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { jurisdiction, theme } from "./validators";

export default defineSchema({
  ...authTables,

  /**
   * Represents a PDF form that can be filled out by users.
   * @param title - The title of the form. (e.g. "Petition to Change Name of Adult")
   * @param formCode - The legal code for the form. (e.g. "CJP 27")
   * @param creationUser - The user who created the form.
   * @param file - The storageId for the PDF file.
   * @param state - The US State the form applies to. (e.g. "MA")
   * @param deletionTime - Time in ms since epoch when the form was deleted.
   */
  forms: defineTable({
    title: v.string(),
    formCode: v.optional(v.string()),
    creationUser: v.id("users"),
    file: v.optional(v.id("_storage")),
    jurisdiction: jurisdiction,
    deletionTime: v.optional(v.number()),
  }),

  /**
   * Represents a single field of a form.
   * @param formId - The form this field belongs to.
   * @param label - The label of the field.
   * @param type - The data type of the field.
   * @param maxLength - The maximum character length of the field.
   */
  formFields: defineTable({
    formId: v.id("forms"),
    label: v.string(),
    // TODO: Make this a constant
    type: v.union(
      v.literal("boolean"),
      v.literal("date"),
      v.literal("number"),
      v.literal("string"),
    ),
    maxLength: v.optional(v.number()),
  }).index("formId", ["formId"]),

  /**
   * Represents a single question presented to a user as part of a quest.
   * May contain one or more form fields.
   * @param formId - The form this question is based on.
   * @param question - The question to ask the user.
   * @param description - Additional context for the question.
   * @param fields - Form fields to present to the user.
   * @param isRequired - Whether the user must answer the question.
   */
  formQuestions: defineTable({
    formId: v.id("forms"),
    question: v.string(),
    description: v.optional(v.string()),
    fields: v.array(v.id("formFields")),
    isRequired: v.boolean(),
  }).index("formId", ["formId"]),

  /**
   * Represents a collection of steps and forms for a user to complete.
   * @param title - The title of the quest. (e.g. "Court Order")
   * @param creationUser - The user who created the quest.
   * @param state - The US State the quest applies to. (e.g. "MA")
   * @param deletionTime - Time in ms since epoch when the quest was deleted.
   * @param steps - An ordered list of steps to complete the quest.
   */
  quests: defineTable({
    title: v.string(),
    creationUser: v.id("users"),
    jurisdiction: v.optional(jurisdiction),
    deletionTime: v.optional(v.number()),
    steps: v.optional(
      v.array(
        v.object({
          title: v.string(),
          body: v.optional(v.string()),
        }),
      ),
    ),
  }),

  /**
   * Represents a user of Namesake.
   * @param name - The user's preferred first name.
   * @param image - A URL to the user's profile picture.
   * @param email - The user's email address.
   * @param emailVerificationTime - Time in ms since epoch when the user verified their email.
   * @param isAnonymous - Denotes anonymous/unauthenticated users.
   * @param isMinor - Denotes users under 18.
   * @param preferredTheme - The user's preferred color scheme.
   */
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    isMinor: v.optional(v.boolean()),
    theme: v.optional(theme),
  }).index("email", ["email"]),

  /**
   * Represents a user's unique progress in completing a quest.
   * @param userId
   * @param questId
   * @param completionTime - Time in ms since epoch when the user marked the quest as complete.
   */
  usersQuests: defineTable({
    userId: v.id("users"),
    questId: v.id("quests"),
    completionTime: v.optional(v.number()),
  })
    .index("userId", ["userId"])
    .index("questId", ["questId"]),
});
