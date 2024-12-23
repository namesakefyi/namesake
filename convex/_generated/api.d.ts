/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as constants from "../constants.js";
import type * as documents from "../documents.js";
import type * as errors from "../errors.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as passwordReset from "../passwordReset.js";
import type * as questions from "../questions.js";
import type * as quests from "../quests.js";
import type * as seed from "../seed.js";
import type * as topics from "../topics.js";
import type * as userFormData from "../userFormData.js";
import type * as userQuests from "../userQuests.js";
import type * as userSettings from "../userSettings.js";
import type * as users from "../users.js";
import type * as validators from "../validators.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  constants: typeof constants;
  documents: typeof documents;
  errors: typeof errors;
  helpers: typeof helpers;
  http: typeof http;
  passwordReset: typeof passwordReset;
  questions: typeof questions;
  quests: typeof quests;
  seed: typeof seed;
  topics: typeof topics;
  userFormData: typeof userFormData;
  userQuests: typeof userQuests;
  userSettings: typeof userSettings;
  users: typeof users;
  validators: typeof validators;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
