import { formatBirthplaceCountryOrState } from "../../../utils/formatBirthplaceCountryOrState";
import { formatDateMMDDYYYY } from "../../../utils/formatDateMMDDYYYY";
import { joinNames } from "../../../utils/joinNames";
import { definePdf } from "../../utils/definePdf";
import pdf from "./pc8.1-change-of-name.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "pc8.1-change-of-name",
  title: "Change of Name",
  code: "PC-8.1",
  jurisdiction: "RI",
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
      mailingCityStateAndZip: [
        data.mailingCity,
        data.mailingState,
        data.mailingZipCode,
      ]
        .filter(Boolean)
        .join(", "),
      email: data.email,
      nameOnOriginalBirthRecord: joinNames(
        data.oldFirstName,
        data.oldMiddleName,
        data.oldLastName,
      ),
      dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
      placeOfBirth: [
        data.birthplaceCity,
        formatBirthplaceCountryOrState(
          data.birthplaceCountry,
          data.birthplaceState,
        ),
      ]
        .filter(Boolean)
        .join(", "),
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
      previousAddress1: data.previousAddress1,
      previousAddress2: data.previousAddress2,
      previousAddress3: data.previousAddress3,
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
