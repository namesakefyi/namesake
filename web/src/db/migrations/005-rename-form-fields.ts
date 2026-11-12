import type { IDBPTransaction } from "idb";
import type { FormFieldRecord, Migration } from "../types";
import { FORM_DATA_STORE } from "../types";

// Booleans now start with a verb such as `is` or `should`, and full-name
// answers moved into name groups. A full name lands in the first-name part,
// so the PDFs print it unchanged. When both names hold an answer, the more
// recently updated one wins.
const RENAMED_FIELDS: Readonly<Record<string, string>> = {
  applySubstitutionSection2: "shouldApplySubstitutionSection2",
  applySubstitutionSection3: "shouldApplySubstitutionSection3",
  paysChildSupport: "doesPayChildSupport",
  paysSpousalSupport: "doesPaySpousalSupport",
  waiveDocumentFees: "shouldWaiveDocumentFees",
  parentsHaveUnknownAddresses: "areParentAddressesUnknown",
  parentsHaveDifferentAddresses: "areParentAddressesDifferent",
  mothersMaidenName: "mothersLastName",
  parent1FullName: "parent1FirstName",
  parent2FullName: "parent2FirstName",
  guardianFullName: "guardianFirstName",
  coGuardianFullName: "coGuardianFirstName",
  guardianOneFullName: "guardianFirstName",
  guardianTwoFullName: "coGuardianFirstName",
};

export const migration: Migration = async (_db, tx) => {
  const store = (
    tx as unknown as IDBPTransaction<any, any, "versionchange">
  ).objectStore(FORM_DATA_STORE);

  for (const [from, to] of Object.entries(RENAMED_FIELDS)) {
    const old: FormFieldRecord | undefined = await store.get(from);
    if (!old) continue;
    const current: FormFieldRecord | undefined = await store.get(to);
    if (!current || current.updatedAt < old.updatedAt) {
      await store.put({ ...old, field: to });
    }
    await store.delete(from);
  }
};
