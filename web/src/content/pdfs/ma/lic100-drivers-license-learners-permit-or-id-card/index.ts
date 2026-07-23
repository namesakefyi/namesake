import { definePdf } from "#lib/pdfs/definePdf";
import { formatDateMMDDYYYY } from "#lib/utils/formatDateMMDDYYYY";
import { joinNames } from "#lib/utils/joinNames";
import { joinParts } from "#lib/utils/joinParts";
import pdf from "./lic100-drivers-license-learners-permit-or-id-card.pdf";
import type { PdfFieldName } from "./schema";

const stateIdType: Record<string, string> = {
  realId: "REAL ID",
  standardId: "Standard",
};

const documentToIssue: Record<string, string> = {
  learnersPermit: "Learner's Permit",
  driversLicense: "Driver's License",
  massachusettsIdCard: "Massachusetts ID Card",
};

const licenseClass: Record<string, string> = {
  passenger: "Passenger (Class D)",
  motorcycle: "Motorcycle (Class M)",
  both: "Both (Class D/M)",
};

const phoneType: Record<string, string> = {
  cell: "Cell",
  home: "Home",
  work: "Work",
};

const gender: Record<string, string> = {
  Female: "Female",
  Male: "Male",
  X: "Non-Binary",
};

const consentProviderType: Record<string, string> = {
  parent: "Parent",
  legalGuardian: "Legal guardian",
  departmentOfChildrenAndFamilies: "Department of children and families",
  boardingSchoolHeadmaster: "Boarding school headmaster",
};

const yesNo = (value: unknown) => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return undefined;
};

// Ignore legacy or malformed unanswered radio values instead of sending them to libpdf.
const radioValue = (value: unknown) =>
  typeof value === "string" && value.length > 0 ? value : undefined;

const formatHeight = (feet?: string, inches?: string) => {
  if (!feet && !inches) return undefined;
  return `${feet ?? ""}' ${inches ?? ""}"`.trim();
};

export default definePdf<PdfFieldName>({
  id: "lic100-drivers-license-learners-permit-or-id-card",
  title: "Driver's License, Learner's Permit, or ID Card Application",
  code: "LIC100",
  jurisdiction: "ma",
  canonicalUrl:
    "https://www.mass.gov/doc/license-and-id-application-0/download",
  pdfPath: pdf,
  drawFormControlValues: true,
  resolver: (data) => ({
    // A. Service Type
    Type: stateIdType[radioValue(data.stateIdType) ?? ""],
    "Document to Issue":
      documentToIssue[radioValue(data.stateIdDocumentType) ?? ""],
    "Class of Learner's Permit/License":
      licenseClass[radioValue(data.driversLicenseClass) ?? ""],
    "Service Type": "Change of Information",
    Name: true,
    Address: data.shouldChangeAddress === true,
    DOB: data.shouldChangeDateOfBirth === true,
    "Gender change": data.shouldChangeGenderMarker === true,
    Height: data.shouldChangeHeight === true,
    "Eye color": data.shouldChangeEyeColor === true,
    // B. Applicant Information
    "Last Name": data.newLastName,
    "First Name": data.newFirstName,
    "Middle Name": data.newMiddleName,
    Suffix: data.nameSuffix,
    "Current Massachusetts Learners Permit or Drivers License #":
      data.currentMassachusettsCredentialNumber,
    "Date of Birth": formatDateMMDDYYYY(data.dateOfBirth),
    "Social Security Number": undefined,
    "Foreign Passport": false,
    Number: undefined,
    "Consular ID": false,
    "Country of Issuance": undefined,
    "Name and number": joinParts(
      joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
      data.currentMassachusettsCredentialNumber,
    ),
    "Have you had a MA permit, license, ID, or registration?": true,
    "Residential Address - Street": data.residenceStreetAddress,
    "Residential Address - Apt #": data.residenceStreetAddress2,
    "Residential Address - City": data.residenceCity,
    "Residential Address - State": data.residenceState,
    "Residential Address - Zip Code": data.residenceZipCode,
    "Mailing Address - Street": data.isMailingAddressDifferentFromResidence
      ? data.mailingStreetAddress
      : undefined,
    "same as above": data.isMailingAddressDifferentFromResidence === false,
    "Mailing Address - Apt #": data.isMailingAddressDifferentFromResidence
      ? data.mailingStreetAddress2
      : undefined,
    "Mailing Address - City": data.isMailingAddressDifferentFromResidence
      ? data.mailingCity
      : undefined,
    "Mailing Address - State": data.isMailingAddressDifferentFromResidence
      ? data.mailingState
      : undefined,
    "Mailing Address - Zip Code": data.isMailingAddressDifferentFromResidence
      ? data.mailingZipCode
      : undefined,
    Email: data.email,
    "Phone Type 1": phoneType[radioValue(data.phoneType) ?? ""],
    Phone: data.phoneNumber,
    "Emergency Contact Email": data.hasEmergencyContact
      ? data.emergencyContactEmail
      : undefined,
    "Emergency Contact Name": data.hasEmergencyContact
      ? data.emergencyContactName
      : undefined,
    "Phone Type 2": data.hasEmergencyContact
      ? phoneType[radioValue(data.emergencyContactPhoneType) ?? ""]
      : undefined,
    "Emergency Contact Phone #": data.hasEmergencyContact
      ? data.emergencyContactPhoneNumber
      : undefined,
    // C. Out of State Conversion
    "Drivers License Learners Permit or ID Card": undefined,
    "Document Type": undefined,
    "Restrictions if applicable": undefined,
    Country: undefined,
    State: undefined,
    "Issue Date": undefined,
    "Expiration Date": undefined,
    // D. Required Demographic Information
    Gender: gender[radioValue(data.newGender) ?? ""],
    "Eye Color": radioValue(data.eyeColor),
    "Height (feet, inches)": formatHeight(data.heightFeet, data.heightInches),
    "Organ and tissue donor": yesNo(data.isOrganDonor),
    "Donate to organ and tissue donor fund": undefined,
    "Are you an active duty member": data.isActiveDutyMilitary === true,
    "If you are a veteran of the US Armed Forces do you":
      data.shouldAddVeteranDesignation === true,
    "Are you a veteran": data.isVeteran === true,
    "What military branch": data.militaryBranch,
    // E. CDL Downgrade does not apply to this transaction.

    // F. Voter Registration
    "Citizen of the Unites States of America": yesNo(data.isUSCitizen),
    // G. Mandatory Questions
    "License in another state, country, or jurisdiction": yesNo(
      data.hasOtherJurisdictionCredential,
    ),
    "If yes where": data.otherCredentialJurisdiction,
    "What credential class": data.otherCredentialClass,
    "What credential #": data.otherCredentialNumber,
    "List any current license/permit": data.currentOtherCredentials,
    "Any impairment": yesNo(data.hasDrivingImpairment),
    "Any medication": yesNo(data.takesDrivingMedication),
    "License suspended": yesNo(data.hasSuspendedLicense),
    // H. Parent/Guardian Consent
    "Person giving consent":
      consentProviderType[radioValue(data.consentProviderType) ?? ""],
    "Parent/Guardian's Printed Name": data.guardianFullName,
    "Parent/Guardian's Address": data.guardianAddress,
    // I. Certification and Signature
    Date: undefined,
  }),
});
