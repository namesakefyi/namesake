import type { Condition } from "#lib/forms/questions";

export const GOVERNMENT_DOCUMENT =
  "You must provide a document from a U.S. Federal, State, or local government agency that explains why you need a Social Security number and that you meet all the requirements for the government benefit.";

export const needsGovernmentDocument: Condition = (data) =>
  data.citizenshipStatus === "legalAlienNotAllowedToWork" ||
  data.citizenshipStatus === "other";
