import type { FormData } from "#lib/forms/questions";
import { deriveCurrentAge } from "#lib/utils/deriveCurrentAge";

/** Minors 12 and older also file a court activity record request (CJP 34). */
export const needsRecordRequest = (data: FormData) =>
  deriveCurrentAge(data.dateOfBirth) >= 12;
