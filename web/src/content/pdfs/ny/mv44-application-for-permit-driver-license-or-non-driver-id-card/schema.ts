/** Auto-generated from mv44-application-for-permit-driver-license-or-non-driver-id-card.pdf — do not edit */

export type Fields = {
  documentType: "radio";
  purpose: "radio";
  hasNyDocument: "radio";
  lastName: "text";
  hasOtherLicense: "radio";
  otherLicenseIssuer: "text";
  firstName: "text";
  middleName: "text";
  otherLicenseExpiration: "text";
  otherLicenseType: "text";
  phoneType: "text";
  suffix: "text";
  birthMonth: "text";
  birthDay: "text";
  birthYear: "text";
  genderMarker: "radio";
  heightFeet: "text";
  heightInches: "text";
  eyeColor: "text";
  areaCode: "text";
  localPhone: "text";
  hasChangedName: "radio";
  formerName: "text";
  otherChange: "text";
  neverIssuedSsn: "checkbox";
  residenceStreetAddress: "text";
  residenceStreetAddress2: "text";
  residenceCity: "text";
  residenceState: "text";
  residenceZipCode: "text";
  residenceCounty: "text";
  mailingStreetAddress: "text";
  mailingStreetAddress2: "text";
  mailingCity: "text";
  mailingState: "text";
  mailingZipCode: "text";
  mailingCounty: "text";
  mailingAddressChanged: "radio";
  residenceAddressChanged: "radio";
  keepVehicleAddress: "checkbox";
  keepVoterAddress: "checkbox";
  veteranDesignation: "checkbox";
  donorRegistry: "radio";
  donatesDollar: "checkbox";
  declinesSelectiveService: "checkbox";
  needsHearingAidOrMirror: "radio";
  hasDrivingAction: "radio";
  hasLostUse: "radio";
  drivingPrivilegeRestored: "radio";
  lossSinceLastLicense: "radio";
  conditionWorsened: "radio";
  hasMedicalTreatment: "radio";
  guardianDocument: "radio";
  guardianRelationship: "text";
  hasOtherCommercialLicenseHistory: "radio";
  priorLicenseStates: "text";
  isCommerciallyDisqualified: "radio";
  commercialDrivingType: "radio";
  printedName: "text";
  declinesVoterRegistration: "checkbox";
  isCitizen: "radio";
  willBeEighteen: "radio";
  understandsPreregistration: "radio";
  hasVotedBefore: "radio";
  priorVoterName: "text";
  lastVotingYear: "text";
  priorVoterAddress: "text";
  priorVoterArea: "text";
  voterEmail: "text";
  voterPhone: "text";
  party: "radio";
  otherParty: "text";
};

/** Fields present in the PDF but excluded from the schema */
export const pdfExcludedFields = [
  "AFFIDAVIT Date",
  "CERTIFICATION DATE",
  "Donor Consent Date",
  "ID Identification NUMBER ON NEW YORK STATE DRIVER LICENSE LEARNER PERMIT or NONDRIVER ID Identification CARD",
  "ID Identification Number on New York State Driver License Permit or Nondriver ID Identification Card of Consenting Parent or Guardian Above Required",
  "Out of State Permit or License ID Identification No Number",
  "PARENT GUARDIAN CONSENT Date",
  "SOCIAL SECURITY NUMBER SSN",
  "reset clear",
] as const;
