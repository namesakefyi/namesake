export const FIELD_DEFS = [
  { name: "oldFirstName", label: "Old first name", type: "string" },
  { name: "oldMiddleName", label: "Old middle name", type: "string" },
  { name: "oldLastName", label: "Old last name", type: "string" },
  { name: "newFirstName", label: "New first name", type: "string" },
  { name: "newMiddleName", label: "New middle name", type: "string" },
  { name: "newLastName", label: "New last name", type: "string" },
  {
    name: "reasonForChangingName",
    label: "Reason for changing name",
    type: "string",
  },
  { name: "phoneNumber", label: "Phone number", type: "string" },
  { name: "email", label: "Email", type: "string" },
  { name: "dateOfBirth", label: "Date of birth", type: "string" },
  { name: "birthplaceCity", label: "City of birth", type: "string" },
  { name: "birthplaceState", label: "State of birth", type: "string" },
  { name: "birthplaceCountry", label: "Country of birth", type: "string" },
  {
    name: "isALegalParentDeceased",
    label: "Is a legal parent deceased?",
    type: "boolean",
  },
  {
    name: "isAllGuardiansAssenting",
    label: "All guardians assenting?",
    type: "boolean",
  },
  {
    name: "isCurrentlyUnhoused",
    label: "Currently unhoused?",
    type: "boolean",
  },
  {
    name: "isInterpreterNeededForChild",
    label: "Interpreter needed for child?",
    type: "boolean",
  },
  {
    name: "isInterpreterNeededForGuardian",
    label: "Interpreter needed for guardian?",
    type: "boolean",
  },
  {
    name: "isInterpreterNeededForParent1",
    label: "Interpreter needed for parent 1?",
    type: "boolean",
  },
  {
    name: "isInterpreterNeededForParent2",
    label: "Interpreter needed for parent 2?",
    type: "boolean",
  },
  {
    name: "areBothParentsListedOnBirthCertificate",
    label: "Both parents listed on the minor's birth certificate?",
    type: "boolean",
  },
  {
    name: "isParent1Assenting",
    label: "Parent 1 assenting?",
    type: "boolean",
  },
  {
    name: "isParent2Assenting",
    label: "Parent 2 assenting?",
    type: "boolean",
  },
  {
    name: "isPresentedByCourtAppointedGuardian",
    label: "Presented by court-appointed guardian?",
    type: "boolean",
  },
  {
    name: "isPresentedByLegalFatherParent2",
    label: "Presented by legal father (parent 2)?",
    type: "boolean",
  },
  {
    name: "isPresentedByLegalMotherParent1",
    label: "Presented by legal mother (parent 1)?",
    type: "boolean",
  },
  {
    name: "isUnderSupervisionOfMassDeptOfYouthServices",
    label: "Under supervision of Mass. Dept. of Youth Services?",
    type: "boolean",
  },
  {
    name: "hasNoRecordOfOtherStateConvictionsProbationParole",
    label: "No record of convictions, probation, or parole in any other state?",
    type: "boolean",
  },
  {
    name: "residenceStreetAddress",
    label: "Residence street address",
    type: "string",
  },
  {
    name: "residenceStreetAddress2",
    label: "Apartment, suite, unit, etc.",
    type: "string",
  },

  { name: "residenceCity", label: "Residence city", type: "string" },
  { name: "residenceCounty", label: "Residence county", type: "string" },
  { name: "residenceState", label: "Residence state", type: "string" },
  { name: "residenceZipCode", label: "Residence zip code", type: "string" },
  {
    name: "isMailingAddressDifferentFromResidence",
    label: "Mailing address different from residence?",
    type: "boolean",
  },
  {
    name: "mailingStreetAddress",
    label: "Mailing street address",
    type: "string",
  },
  {
    name: "mailingStreetAddress2",
    label: "Apartment, suite, unit, etc.",
    type: "string",
  },
  { name: "mailingCity", label: "Mailing city", type: "string" },
  { name: "mailingCounty", label: "Mailing county", type: "string" },
  { name: "mailingState", label: "Mailing state", type: "string" },
  { name: "mailingZipCode", label: "Mailing zip code", type: "string" },
  {
    name: "hasPreviousNameChange",
    label: "Has previous name change?",
    type: "boolean",
  },
  { name: "previousNameFrom", label: "Previous name from", type: "string" },
  { name: "previousNameTo", label: "Previous name to", type: "string" },
  { name: "previousNameReason", label: "Previous name reason", type: "string" },
  {
    name: "hasUsedOtherNameOrAlias",
    label: "Has used other name or alias?",
    type: "boolean",
  },
  {
    name: "otherNamesOrAliases",
    label: "Other names or aliases",
    type: "string",
  },
  {
    name: "parent1City",
    label: "Parent 1 city",
    type: "string",
  },
  {
    name: "parent1DissentReason",
    label: "Parent 1 dissent reason",
    type: "string",
  },
  {
    name: "parent1Email",
    label: "Parent 1 email",
    type: "string",
  },
  {
    name: "parent1FullName",
    label: "Parent 1 full name",
    type: "string",
  },
  {
    name: "parent1Phone",
    label: "Parent 1 phone",
    type: "string",
  },
  {
    name: "parent1State",
    label: "Parent 1 state",
    type: "string",
  },
  {
    name: "parent1StreetAddress",
    label: "Parent 1 street address",
    type: "string",
  },
  {
    name: "parent1ZipCode",
    label: "Parent 1 zip code",
    type: "string",
  },
  {
    name: "parent2City",
    label: "Parent 2 city",
    type: "string",
  },
  {
    name: "parent2DissentReason",
    label: "Parent 2 dissent reason",
    type: "string",
  },
  {
    name: "parent2Email",
    label: "Parent 2 email",
    type: "string",
  },
  {
    name: "parent2FullName",
    label: "Parent 2 full name",
    type: "string",
  },
  {
    name: "parent2Phone",
    label: "Parent 2 phone",
    type: "string",
  },
  {
    name: "parent2State",
    label: "Parent 2 state",
    type: "string",
  },
  {
    name: "parent2StreetAddress",
    label: "Parent 2 street address",
    type: "string",
  },
  {
    name: "parent2ZipCode",
    label: "Parent 2 zip code",
    type: "string",
  },
  {
    name: "parentsHaveUnknownAddresses",
    label: "Parents' addresses are unknown?",
    type: "boolean",
  },
  {
    name: "parentsHaveDifferentAddresses",
    label: "Parents have different addresses?",
    type: "boolean",
  },
  {
    name: "hasOtherLegalNames",
    label: "Has other legal names?",
    type: "boolean",
  },
  { name: "previousLegalNames", label: "Previous legal names", type: "string" },
  {
    name: "isInterpreterNeeded",
    label: "Interpreter needed?",
    type: "boolean",
  },
  { name: "language", label: "Language", type: "string" },
  {
    name: "isOkayToSharePronouns",
    label: "Okay to share pronouns?",
    type: "boolean",
  },
  { name: "pronouns", label: "Pronouns", type: "string[]" },
  { name: "otherPronouns", label: "Other pronouns", type: "string" },
  {
    name: "shouldReturnOriginalDocuments",
    label: "Return original documents?",
    type: "boolean",
  },
  {
    name: "shouldWaivePublicationRequirement",
    label: "Waive publication requirement?",
    type: "boolean",
  },
  {
    name: "reasonToWaivePublication",
    label: "Reason to waive publication",
    type: "string",
  },
  {
    name: "shouldImpoundCourtRecords",
    label: "Impound court records?",
    type: "boolean",
  },
  {
    name: "reasonToImpoundCourtRecords",
    label: "Reason to impound court records",
    type: "string",
  },
  {
    name: "shouldApplyForFeeWaiver",
    label: "Apply for a fee waiver?",
    type: "boolean",
  },
  { name: "mothersMaidenName", label: "Mother's maiden name", type: "string" },
  { name: "occupation", label: "Occupation", type: "string" },
  { name: "maritalStatus", label: "Marital status", type: "string" },
  {
    name: "previousAddresses",
    label: "Previous addresses",
    type: "string[]",
  },
  {
    name: "shouldChangeBirthCertificate",
    label: "Update birth certificate?",
    type: "boolean",
  },
  {
    name: "citizenshipStatus",
    label: "Citizenship status",
    type: "string",
  },
  {
    name: "coGuardianCity",
    label: "Co-guardian city",
    type: "string",
  },
  {
    name: "coGuardianEmail",
    label: "Co-guardian email",
    type: "string",
  },
  {
    name: "coGuardianFullName",
    label: "Co-guardian full name",
    type: "string",
  },
  {
    name: "coGuardianPhone",
    label: "Co-guardian phone",
    type: "string",
  },
  {
    name: "coGuardianState",
    label: "Co-guardian state",
    type: "string",
  },
  {
    name: "coGuardianStreetAddress",
    label: "Co-guardian street address",
    type: "string",
  },
  {
    name: "coGuardianZipCode",
    label: "Co-guardian zip code",
    type: "string",
  },
  {
    name: "sexAssignedAtBirth",
    label: "Sex assigned at birth",
    type: "string",
  },
  {
    name: "isHispanicOrLatino",
    label: "Hispanic or Latino?",
    type: "boolean",
  },
  {
    name: "race",
    label: "Race",
    type: "string[]",
  },
  {
    name: "mothersFirstName",
    label: "Mother's first name",
    type: "string",
  },
  {
    name: "mothersMiddleName",
    label: "Mother's middle name",
    type: "string",
  },
  {
    name: "mothersLastName",
    label: "Mother's last name",
    type: "string",
  },
  {
    name: "fathersFirstName",
    label: "Father's first name",
    type: "string",
  },
  {
    name: "fathersMiddleName",
    label: "Father's middle name",
    type: "string",
  },
  {
    name: "fathersLastName",
    label: "Father's last name",
    type: "string",
  },
  {
    name: "guardianCity",
    label: "Guardian city",
    type: "string",
  },
  {
    name: "guardianDissentReason",
    label: "Guardian dissent reason",
    type: "string",
  },
  {
    name: "guardianEmail",
    label: "Guardian email",
    type: "string",
  },
  {
    name: "guardianFullName",
    label: "Guardian full name",
    type: "string",
  },
  {
    name: "guardianPhone",
    label: "Guardian phone",
    type: "string",
  },
  {
    name: "guardianState",
    label: "Guardian state",
    type: "string",
  },
  {
    name: "guardianStreetAddress",
    label: "Guardian street address",
    type: "string",
  },
  {
    name: "guardianZipCode",
    label: "Guardian zip code",
    type: "string",
  },
  {
    name: "hasCourtAppointedCoGuardian",
    label: "Court-appointed co-guardian?",
    type: "boolean",
  },
  {
    name: "hasCourtAppointedGuardian",
    label: "Court-appointed guardian?",
    type: "boolean",
  },
  {
    name: "hasLegalParentHadParentalRightsTerminated",
    label: "Has legal parent had parental rights terminated?",
    type: "boolean",
  },
  {
    name: "hasPreviousSocialSecurityCard",
    label: "Previous Social Security card?",
    type: "boolean",
  },
  {
    name: "previousSocialSecurityCardFirstName",
    label: "First name on previous Social Security card",
    type: "string",
  },
  {
    name: "previousSocialSecurityCardMiddleName",
    label: "Middle name on previous Social Security card",
    type: "string",
  },
  {
    name: "previousSocialSecurityCardLastName",
    label: "Last name on previous Social Security card",
    type: "string",
  },
  {
    name: "isFilingForSomeoneElse",
    label: "Are you filing this form for someone else?",
    type: "boolean",
  },
  {
    name: "relationshipToFilingFor",
    label: "Relationship to the person you are filing for",
    type: "string",
  },
  {
    name: "relationshipToFilingForOther",
    label: "Relationship to the person you are filing for (other)",
    type: "string",
  },
  {
    name: "indigencyBasis",
    label: "Reason for indigency",
    type: "string",
    options: {
      "public-assistance": "Public assistance",
      income: "Income at or below poverty level",
      "unable-to-pay": "Unable to pay without depriving myself or dependents",
      none: "None of the above",
    },
  },
  { name: "isReceivingTAFDC", label: "Receiving TAFDC?", type: "boolean" },
  { name: "isReceivingEAEDC", label: "Receiving EAEDC?", type: "boolean" },
  {
    name: "isReceivingMedicaid",
    label: "Receiving Medicaid?",
    type: "boolean",
  },
  { name: "isReceivingSSI", label: "Receiving SSI?", type: "boolean" },
  {
    name: "isReceivingVeteransBenefits",
    label: "Receiving veterans benefits?",
    type: "boolean",
  },
  {
    name: "incomeAmount",
    label: "Income amount",
    type: "string",
    format: "currency",
  },
  {
    name: "incomePeriod",
    label: "Income period",
    type: "string",
    options: {
      weekly: "Weekly",
      biweekly: "Biweekly",
      monthly: "Monthly",
      yearly: "Yearly",
    },
  },
  { name: "householdSize", label: "Household size", type: "string" },
  { name: "numberOfDependents", label: "Number of dependents", type: "string" },
  {
    name: "otherHouseholdIncome",
    label: "Other household income",
    type: "string",
    format: "currency",
  },
  {
    name: "shouldWaiveFilingFeeAndSurcharge",
    label: "Waive filing fee and surcharge?",
    type: "boolean",
  },
  {
    name: "filingFeeAndSurcharge",
    label: "Filing fee and surcharge amount",
    type: "string",
    format: "currency",
  },
  {
    name: "shouldWaiveFilingFeeAndSurchargeForAppeal",
    label: "Waive filing fee and surcharge for appeal?",
    type: "boolean",
  },
  {
    name: "filingFeeAndSurchargeForAppeal",
    label: "Filing fee and surcharge for appeal amount",
    type: "string",
    format: "currency",
  },
  {
    name: "shouldWaiveFeesForCourtSummons",
    label: "Waive fees for court summons?",
    type: "boolean",
  },
  {
    name: "feesForCourtSummons",
    label: "Fees for court summons amount",
    type: "string",
    format: "currency",
  },
  {
    name: "shouldWaiveOtherFeesSection2",
    label: "Waive other fees (Section 2)?",
    type: "boolean",
  },
  {
    name: "otherFeesSection2",
    label: "Other fees amount (Section 2)",
    type: "string",
    format: "currency",
  },
  {
    name: "otherFeesSection2Details",
    label: "Other fees details (Section 2)",
    type: "string",
  },
  {
    name: "applySubstitutionSection2",
    label: "Apply substitution (Section 2)?",
    type: "boolean",
  },
  {
    name: "substitutionDetailsSection2",
    label: "Substitution details (Section 2)",
    type: "string",
  },
  {
    name: "shouldWaiveExpertServices",
    label: "Waive expert services?",
    type: "boolean",
  },
  {
    name: "costOfExpertServices",
    label: "Expert services cost",
    type: "string",
    format: "currency",
  },
  {
    name: "expertServicesDetails",
    label: "Expert services details",
    type: "string",
  },
  {
    name: "shouldWaiveCostOfTranscription",
    label: "Waive cost of transcription?",
    type: "boolean",
  },
  {
    name: "costOfTranscription",
    label: "Transcription cost",
    type: "string",
    format: "currency",
  },
  {
    name: "shouldWaiveRecordingOfTrialForAppeal",
    label: "Waive recording of trial for appeal?",
    type: "boolean",
  },
  {
    name: "shouldWaiveAppealBond",
    label: "Waive appeal bond?",
    type: "boolean",
  },
  {
    name: "shouldWaiveCostOfWrittenTranscriptPreparation",
    label: "Waive cost of written transcript preparation?",
    type: "boolean",
  },
  {
    name: "costOfWrittenTranscriptPreparation",
    label: "Written transcript preparation cost",
    type: "string",
    format: "currency",
  },
  {
    name: "shouldWaiveOtherFeesSection3",
    label: "Waive other fees (Section 3)?",
    type: "boolean",
  },
  {
    name: "otherFeesSection3",
    label: "Other fees amount (Section 3)",
    type: "string",
    format: "currency",
  },
  {
    name: "otherFeesSection3Details",
    label: "Other fees details (Section 3)",
    type: "string",
  },
  {
    name: "applySubstitutionSection3",
    label: "Apply substitution (Section 3)?",
    type: "boolean",
  },
  {
    name: "substitutionDetailsSection3",
    label: "Substitution details (Section 3)",
    type: "string",
  },
  {
    name: "oldGender",
    label: "Existing gender marker",
    type: "string",
  },
  {
    name: "newGender",
    label: "Desired gender marker",
    type: "string",
  },
  {
    // Specific to R-116 in MA
    name: "nameChangeDecreeIncluded",
    label:
      "Applicant will include court-certified copy of legal name-change decree",
    type: "boolean",
  },
  {
    // Specific to R-116 in MA
    name: "paymentIncluded",
    label: "Applicant will include all fees with the application",
    type: "boolean",
  },
  {
    name: "guardianOneFullName",
    label: "Guardian/parent 1's full name",
    type: "string",
  },
  {
    name: "guardianTwoFullName",
    label: "Guardian/parent 2's full name",
    type: "string",
  },
  {
    name: "waiveDocumentFees",
    label: "Waive fees?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "stateIdType",
    label: "ID type",
    type: "string",
    options: {
      realId: "REAL ID",
      standardId: "Standard ID",
    },
  },
  {
    // Specific to LIC100 in MA
    name: "stateIdDocumentType",
    label: "Document to issue",
    type: "string",
    options: {
      learnersPermit: "Learner's permit",
      driversLicense: "Driver's license",
      massachusettsIdCard: "Massachusetts ID card",
    },
  },
  {
    // Specific to LIC100 in MA
    name: "driversLicenseClass",
    label: "Permit or license class",
    type: "string",
    options: {
      passenger: "Passenger (Class D)",
      motorcycle: "Motorcycle (Class M)",
      both: "Both (Class D/M)",
    },
  },
  {
    // Specific to LIC100 in MA
    name: "nameSuffix",
    label: "Name suffix",
    type: "string",
  },
  {
    // Specific to LIC100 in MA
    name: "currentMassachusettsCredentialNumber",
    label: "Current Massachusetts credential number",
    type: "string",
  },
  {
    // Specific to LIC100 in MA
    name: "shouldChangeAddress",
    label: "Change address?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "shouldChangeDateOfBirth",
    label: "Change date of birth?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "shouldChangeGenderMarker",
    label: "Change gender marker?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "shouldChangeHeight",
    label: "Change height?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "shouldChangeEyeColor",
    label: "Change eye color?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "phoneType",
    label: "Phone type",
    type: "string",
    options: { cell: "Cell", home: "Home", work: "Work" },
  },
  {
    // Specific to LIC100 in MA
    name: "hasEmergencyContact",
    label: "Include an emergency contact?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "emergencyContactEmail",
    label: "Emergency contact email",
    type: "string",
  },
  {
    // Specific to LIC100 in MA
    name: "emergencyContactName",
    label: "Emergency contact name",
    type: "string",
  },
  {
    // Specific to LIC100 in MA
    name: "emergencyContactPhoneType",
    label: "Emergency contact phone type",
    type: "string",
    options: { cell: "Cell", home: "Home", work: "Work" },
  },
  {
    // Specific to LIC100 in MA
    name: "emergencyContactPhoneNumber",
    label: "Emergency contact phone number",
    type: "string",
  },
  {
    // Specific to LIC100 in MA
    name: "eyeColor",
    label: "Eye color",
    type: "string",
  },
  {
    // Specific to LIC100 in MA
    name: "heightFeet",
    label: "Height (feet)",
    type: "string",
  },
  {
    // Specific to LIC100 in MA
    name: "heightInches",
    label: "Height (inches)",
    type: "string",
  },
  {
    // Specific to LIC100 in MA
    name: "isOrganDonor",
    label: "Organ and tissue donor?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "isActiveDutyMilitary",
    label: "Active-duty military member?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "isVeteran",
    label: "Veteran?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "shouldAddVeteranDesignation",
    label: "Add veteran designation?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "militaryBranch",
    label: "Military branch",
    type: "string",
  },
  {
    // Specific to LIC100 in MA
    name: "isUSCitizen",
    label: "U.S. citizen?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "hasOtherJurisdictionCredential",
    label: "Held a license in another jurisdiction in the past 10 years?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "otherCredentialJurisdiction",
    label: "Other credential jurisdiction",
    type: "string",
  },
  {
    // Specific to LIC100 in MA
    name: "otherCredentialClass",
    label: "Other credential class",
    type: "string",
  },
  {
    // Specific to LIC100 in MA
    name: "otherCredentialNumber",
    label: "Other credential number",
    type: "string",
  },
  {
    // Specific to LIC100 in MA
    name: "currentOtherCredentials",
    label: "Other current licenses or permits",
    type: "string",
  },
  {
    // Specific to LIC100 in MA
    name: "hasDrivingImpairment",
    label: "Impairment that may affect safe driving?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "takesDrivingMedication",
    label: "Medication that may affect safe driving?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "hasSuspendedLicense",
    label: "License or driving right suspended or revoked?",
    type: "boolean",
  },
  {
    // Specific to LIC100 in MA
    name: "consentProviderType",
    label: "Person giving consent",
    type: "string",
    options: {
      parent: "Parent",
      legalGuardian: "Legal guardian",
      departmentOfChildrenAndFamilies: "Department of Children and Families",
      boardingSchoolHeadmaster: "Boarding school headmaster",
    },
  },
  {
    // Specific to LIC100 in MA
    name: "guardianAddress",
    label: "Parent or guardian address",
    type: "string",
  },
] as const;

export type FieldName = (typeof FIELD_DEFS)[number]["name"];

// Map the string type to actual TS types
export type FieldType<K extends FieldName> = K extends any
  ? Extract<(typeof FIELD_DEFS)[number], { name: K }>["type"] extends "string"
    ? string
    : Extract<
          (typeof FIELD_DEFS)[number],
          { name: K }
        >["type"] extends "boolean"
      ? boolean | typeof PREFER_NOT_TO_ANSWER | typeof DONT_KNOW
      : Extract<
            (typeof FIELD_DEFS)[number],
            { name: K }
          >["type"] extends "string[]"
        ? string[]
        : never
  : never;

export type FormData = {
  [K in FieldName]: FieldType<K>;
};

export const COMMON_PRONOUNS = ["they/them", "she/her", "he/him"];

export const PREFER_NOT_TO_ANSWER = "preferNotToAnswer";
export const DONT_KNOW = "dontKnow";
