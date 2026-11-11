import backgroundCheck from "#content/pdfs/ri/background-check-authorization-of-release";
import pc81 from "#content/pdfs/ri/pc8.1-change-of-name";
import { defineDownload } from "#lib/forms/defineForm";
import { asList } from "#lib/utils/fieldValue";
import { formatAddress } from "#lib/utils/formatAddress";
import { formatBirthplaceCountryOrState } from "#lib/utils/formatBirthplaceCountryOrState";
import { formatDateMMDDYYYY } from "#lib/utils/formatDateMMDDYYYY";
import { fullName } from "#lib/utils/fullName";
import { joinParts } from "#lib/utils/joinParts";

export default defineDownload({
  title: "Rhode Island Court Order",
  instructions: [
    "Do not sign either form until in the presence of a notary.",
    "Review all documents carefully.",
    "File with the Probate Court in the city or town where you live.",
    "Remember to bring a certified copy of your original birth certificate and a BCI (criminal background) report.",
    {
      text: "Attach a copy of each prior court order or marriage license to your petition.",
      when: (data) => data.hasPreviousNameChange === true,
    },
  ],
  pdfs: [
    {
      pdf: backgroundCheck,
      fill: (data) => ({
        fullName: fullName(data, "oldName"),
        otherNames: joinParts(data.previousNameFrom, fullName(data, "newName")),
        dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
        residenceAddress: formatAddress({
          street: data.residenceStreetAddress,
          city: data.residenceCity,
          state: data.residenceState,
          zip: data.residenceZipCode,
        }),
        nameChange: "Legal name change",
      }),
    },
    {
      pdf: pc81,
      fill: (data) => {
        const previousAddresses = asList(data.previousAddresses);
        return {
          currentLegalName: fullName(data, "oldName"),
          residenceStreetAddress: data.residenceStreetAddress,
          residenceCity: data.residenceCity,
          residenceState: data.residenceState,
          residenceZipCode: data.residenceZipCode,
          phoneNumber: data.phoneNumber,
          mailingStreetAddress: data.mailingStreetAddress,
          mailingCityStateAndZip: joinParts(
            data.mailingCity,
            data.mailingState,
            data.mailingZipCode,
          ),
          email: data.email,
          nameOnOriginalBirthRecord: fullName(data, "oldName"),
          dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
          placeOfBirth: joinParts(
            data.birthplaceCity,
            formatBirthplaceCountryOrState(
              data.birthplaceCountry,
              data.birthplaceState,
            ),
          ),
          mothersMaidenName: fullName(data, "mothersName"),
          fathersName: fullName(data, "fathersName"),
          occupation: data.occupation,
          maritalStatus: data.maritalStatus,
          previousAddress1: previousAddresses?.[0],
          previousAddress2: previousAddresses?.[1],
          previousAddress3: previousAddresses?.[2],
          reasonForNameChange: data.reasonForChangingName,
          reasonForNameChange2: undefined,
          newFirstName: data.newFirstName,
          newMiddleName: data.newMiddleName,
          newLastName: data.newLastName,
          newBirthCertFirstName: data.shouldChangeBirthCertificate
            ? data.newFirstName
            : undefined,
          newBirthCertMiddleName: data.shouldChangeBirthCertificate
            ? data.newMiddleName
            : undefined,
          newBirthCertLastName: data.shouldChangeBirthCertificate
            ? data.newLastName
            : undefined,
        };
      },
    },
  ],
});
