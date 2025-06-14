/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as __tests___helpers from "../__tests__/helpers.js";
import type * as auth from "../auth.js";
import type * as earlyAccessCodes from "../earlyAccessCodes.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as migrations from "../migrations.js";
import type * as model_authModel from "../model/authModel.js";
import type * as model_earlyAccessCodesModel from "../model/earlyAccessCodesModel.js";
import type * as model_questsModel from "../model/questsModel.js";
import type * as model_userDocumentsModel from "../model/userDocumentsModel.js";
import type * as model_userFormResponsesModel from "../model/userFormResponsesModel.js";
import type * as model_userQuestsModel from "../model/userQuestsModel.js";
import type * as model_userSettingsModel from "../model/userSettingsModel.js";
import type * as model_usersModel from "../model/usersModel.js";
import type * as passwordReset from "../passwordReset.js";
import type * as quests from "../quests.js";
import type * as seed from "../seed.js";
import type * as userDocuments from "../userDocuments.js";
import type * as userFormResponses from "../userFormResponses.js";
import type * as userQuests from "../userQuests.js";
import type * as userSettings from "../userSettings.js";
import type * as users from "../users.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "__tests__/helpers": typeof __tests___helpers;
  auth: typeof auth;
  earlyAccessCodes: typeof earlyAccessCodes;
  helpers: typeof helpers;
  http: typeof http;
  migrations: typeof migrations;
  "model/authModel": typeof model_authModel;
  "model/earlyAccessCodesModel": typeof model_earlyAccessCodesModel;
  "model/questsModel": typeof model_questsModel;
  "model/userDocumentsModel": typeof model_userDocumentsModel;
  "model/userFormResponsesModel": typeof model_userFormResponsesModel;
  "model/userQuestsModel": typeof model_userQuestsModel;
  "model/userSettingsModel": typeof model_userSettingsModel;
  "model/usersModel": typeof model_usersModel;
  passwordReset: typeof passwordReset;
  quests: typeof quests;
  seed: typeof seed;
  userDocuments: typeof userDocuments;
  userFormResponses: typeof userFormResponses;
  userQuests: typeof userQuests;
  userSettings: typeof userSettings;
  users: typeof users;
  validators: typeof validators;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  migrations: {
    lib: {
      cancel: FunctionReference<
        "mutation",
        "internal",
        { name: string },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
      cancelAll: FunctionReference<
        "mutation",
        "internal",
        { sinceTs?: number },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      clearAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number },
        null
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { limit?: number; names?: Array<string> },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      migrate: FunctionReference<
        "mutation",
        "internal",
        {
          batchSize?: number;
          cursor?: string | null;
          dryRun: boolean;
          fnHandle: string;
          name: string;
          next?: Array<{ fnHandle: string; name: string }>;
        },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
    };
  };
};
