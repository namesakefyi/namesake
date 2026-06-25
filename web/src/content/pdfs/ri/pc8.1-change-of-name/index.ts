import { definePdf } from "#lib/pdfs/definePdf";
import { formatBirthplaceCountryOrState } from "#lib/utils/formatBirthplaceCountryOrState";
import { formatDateMMDDYYYY } from "#lib/utils/formatDateMMDDYYYY";
import { joinNames } from "#lib/utils/joinNames";
import { joinParts } from "#lib/utils/joinParts";
import pdf from "./pc8.1-change-of-name.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "pc8.1-change-of-name",
  title: "Change of Name",
  code: "PC-8.1",
  jurisdiction: "ri",
  canonicalUrl:
    "https://docs.sos.ri.gov/documents/BusinessServices/PC8.1-change-of-name.pdf",
  pdfPath: pdf,
  resolver: (data) => {
    return {
      currentLegalName: joinNames(
        data.oldFirstName,
        data.oldMiddleName,
        data.oldLastName,
      ),
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
      nameOnOriginalBirthRecord: joinNames(
        data.oldFirstName,
        data.oldMiddleName,
        data.oldLastName,
      ),
      dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
      placeOfBirth: joinParts(
        data.birthplaceCity,
        formatBirthplaceCountryOrState(
          data.birthplaceCountry,
          data.birthplaceState,
        ),
      ),
      mothersMaidenName: joinNames(
        data.mothersFirstName,
        data.mothersMiddleName,
        data.mothersLastName,
      ),
      fathersName: joinNames(
        data.fathersFirstName,
        data.fathersMiddleName,
        data.fathersLastName,
      ),
      occupation: data.occupation,
      maritalStatus: data.maritalStatus,
      previousAddress1: data.previousAddresses?.[0],
      previousAddress2: data.previousAddresses?.[1],
      previousAddress3: data.previousAddresses?.[2],
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
});
