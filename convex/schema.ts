import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  category,
  formField,
  groupQuestsBy,
  jurisdiction,
  role,
  status,
  theme,
  timeRequiredUnit,
} from "./validators";

// ----------------------------------------------
// Forms
// ----------------------------------------------

/**
 * A series of fields and pages to guide a user through
 * an application for a single quest.
 */
const forms = defineTable({
  /** The user who created the form. */
  createdBy: v.id("users"),
  /** The date the form was last updated. */
  updatedAt: v.optional(v.number()),
  /** The user who updated the form. */
  updatedBy: v.optional(v.id("users")),
  /** The pages that make up the form. */
  pages: v.array(v.id("formPages")),
});

/**
 * A single page within a form which contains one or more fields.
 */
const formPages = defineTable({
  /** The form that this page belongs to. */
  formId: v.id("forms"),
  /** The title of the page. (e.g. "What is your name?") */
  title: v.string(),
  /** An optional page description. */
  description: v.optional(v.string()),
  /** The fields for the page. */
  fields: v.optional(v.array(v.id("formFields"))),
  /** Optional faqs related to the page. */
  faqs: v.optional(v.array(v.id("faqs"))),
}).index("formId", ["formId"]);

/**
 * A single field or a group of related fields within a page.
 */
const formFields = defineTable({
  /** The type of field, e.g. "email", "checkboxGroup", "longText" */
  type: formField,
  /** The user-visible label for the field. */
  label: v.string(),
  /** A unique key for the field used to store user data. */
  name: v.string(),
  /** Whether the field is required. */
  required: v.optional(v.boolean()),
  /** Options for group fields like checkboxes, radios, and selects. */
  options: v.optional(
    v.array(
      v.object({
        label: v.string(),
        value: v.string(),
      }),
    ),
  ),
});

// ----------------------------------------------
// FAQs
// ----------------------------------------------

/**
 * A frequently asked question and its answer.
 */
const faqs = defineTable({
  /** A frequently asked question. */
  question: v.string(),
  /** The rich text answer to the question, stored as HTML. */
  answer: v.string(),
  /** One or more topics related to the question. */
  topics: v.array(v.id("faqTopics")),
  /** Optional quests related to the question. */
  relatedQuests: v.optional(v.array(v.id("quests"))),
})
  .index("topics", ["topics"])
  .index("relatedQuests", ["relatedQuests"]);

/**
 * A shared topic used to tag and organize faqs.
 */
const faqTopics = defineTable({
  /** The name of the topic. Should be short and unique. */
  title: v.string(),
});

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
  deletedAt: v.optional(v.number()),
  /** Rich text comprising the contents of the quest, stored as HTML. */
  content: v.optional(v.string()),
  /** A form ID used to fill out this quest. */
  formId: v.optional(v.id("forms")),
})
  .index("category", ["category"])
  .index("formId", ["formId"]);

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
  completedAt: v.optional(v.number()),
})
  .index("userId", ["userId"])
  .index("questId", ["questId"]);

export default defineSchema({
  ...authTables,
  faqs,
  faqTopics,
  forms,
  formPages,
  formFields,
  documents,
  quests,
  users,
  userFormData,
  userSettings,
  userQuests,
});
