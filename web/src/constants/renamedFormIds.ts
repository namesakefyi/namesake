/**
 * Form ids from before forms moved into jurisdiction folders, mapped to their
 * current ids. Old URLs redirect from these, and IndexedDB migration 004 moves
 * saved progress with them. `web/migrations/002_form_ids.sql` repeats this map
 * because SQL migrations can't import it.
 */
export const RENAMED_FORM_IDS: Record<string, string> = {
  "court-order-ma": "ma/court-order",
  "court-order-ma-minor": "ma/court-order-minor",
  "affidavit-of-indigency-ma": "ma/affidavit-of-indigency",
  "birth-certificate-affidavit-ma": "ma/birth-certificate-affidavit",
  "court-order-ny": "ny/court-order",
  "court-order-ri": "ri/court-order",
};
