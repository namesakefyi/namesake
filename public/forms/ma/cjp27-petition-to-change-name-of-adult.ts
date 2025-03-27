import { definePdf } from "@/utils/pdf";

export default definePdf({
  title: "Petition to Change Name of Adult",
  code: "CJP 27",
  pdfPath: "/forms/ma/cjp27-petition-to-change-name-of-adult.pdf",
  jurisdiction: "MA",
  fields: (data: {
    newFirstName: string;
    newMiddleName: string;
    newLastName: string;
    oldFirstName: string;
    oldMiddleName: string;
    oldLastName: string;
    residenceStreetAddress: string;
    residenceCity: string;
    residenceState: string;
    residenceZipCode: string;
    email: string;
    phoneNumber: string;
    isMailingAddressDifferentFromResidence: boolean;
    mailingStreetAddress: string;
    mailingCity: string;
    mailingState: string;
    mailingZipCode: string;
    dateOfBirth: string;
    hasPreviousNameChange: boolean;
    shouldReturnOriginalDocuments: boolean;
    reasonForChangingName: string;
    isInterpreterNeeded: boolean;
    language: string;
    isOkayToSharePronouns: boolean;
    pronouns: string;
  }) => ({
    // In the matter of:
    "First Name": data.oldFirstName,
    "Middle Name": data.oldMiddleName,
    "Last Name": data.newLastName,

    // Division (County)
    Division: "Suffolk", // TODO: Add county helper

    // Current legal name:
    "Old First Name": data.oldFirstName,
    "Old Middle Name": data.oldMiddleName,
    "Old Last Name": data.oldLastName,

    // I was born in:
    // TODO: Add birth city and state
    // "CityTown": data.birthCity,
    on: data.dateOfBirth,

    // I currently reside at:
    "2 I currently reside at": data.residenceStreetAddress,
    CityTown_2: data.residenceCity,
    State_2: data.residenceState,
    Zip: data.residenceZipCode,

    // Mailing address (if different)
    ...(data.isMailingAddressDifferentFromResidence
      ? {
          Address: data.mailingStreetAddress,
          CityTown_3: data.mailingCity,
          State_3: data.mailingState,
          Zip_2: data.mailingZipCode,
        }
      : {}),

    // Contact
    "Email Address": data.email,
    "Phone Number": data.phoneNumber,

    // Previous name change
    legally_changed_name_yes: data.hasPreviousNameChange,
    legally_changed_name_no: !data.hasPreviousNameChange,

    // Previous legal names
    // TO ADD

    // Return certified documents
    certified_copy_checkbox: data.shouldReturnOriginalDocuments,

    // Other names or aliases
    // TO ADD

    // New legal name
    "First Name_2": data.newFirstName,
    "Middle Name_2": data.newMiddleName,
    "Last Name_2": data.newLastName,

    // Reason for changing name
    Reason: data.reasonForChangingName,

    // Interpreter
    ...(data.isInterpreterNeeded
      ? {
          Language_Checkbox: data.isInterpreterNeeded,
          Language: data.language,
        }
      : {}),

    // Okay to share pronouns
    ...(data.isOkayToSharePronouns
      ? {
          Pronouns_Checkbox: data.isOkayToSharePronouns,
          Pronouns: data.pronouns,
        }
      : {}),
  }),
});
