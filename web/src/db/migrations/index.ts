import type { Migration } from "../types";
import { migration as createFormFields } from "./001-create-form-fields";
import { migration as renameFormFieldsToFormData } from "./002-rename-form-fields-to-form-data";
import { migration as fixFormDataForSafari } from "./003-fix-form-data-for-safari";
import { migration as keyFormProgressByFormId } from "./004-key-form-progress-by-form-id";

export const migrations: Migration[] = [
  createFormFields,
  renameFormFieldsToFormData,
  fixFormDataForSafari,
  keyFormProgressByFormId,
];
