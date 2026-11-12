import type { FormConfig } from "#constants/forms";
import { parseContentPath } from "#lib/loaders/parseContentPath";
import {
  formIds,
  loadFormDefinition,
  loadFormDownload,
  loadFormSteps,
} from "./loadForm";

/**
 * Every form with its three files joined, keyed by id. Loads all of them, so
 * only build-time code and tests use it.
 */
export const allForms: Readonly<Record<string, FormConfig>> =
  Object.fromEntries(
    await Promise.all(
      formIds.map(async (id) => {
        const [meta, steps, download] = await Promise.all([
          loadFormDefinition(id),
          loadFormSteps(id),
          loadFormDownload(id),
        ]);
        parseContentPath(id, "forms", meta);
        return [id, { ...meta, steps, download }] as const;
      }),
    ),
  );
