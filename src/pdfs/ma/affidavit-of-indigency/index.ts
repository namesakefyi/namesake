import { joinNames } from "../../../utils/joinNames";
import { definePdf } from "../../utils/definePdf";
import pdf from "./affidavit-of-indigency.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "affidavit-of-indigency",
  title: "Affidavit of Indigency",
  jurisdiction: "MA",
  pdfPath: pdf,
  resolver: (data) => ({
    applicantName: joinNames(
      data.oldFirstName,
      data.oldMiddleName,
      data.oldLastName,
    ),
    residenceStreetAddress: data.residenceStreetAddress,
    residenceCity: data.residenceCity,
    residenceStateAndZip: `${data.residenceState} ${data.residenceZipCode}`,

    // TODO: Map public assistance type checkboxes to form data
    isSectionAChecked: undefined,
    "Transitional Aid to Families with Dependent Children TAFDC": undefined,
    "Emergency Aid to Elderly Disabled or Children EAEDC": undefined,
    "Massachusetts Veterans Benefits Programs or": undefined,
    "Medicaid MassHealth": undefined,
    "Supplemental Security Income SSI": undefined,
    "persons consisting of myself and": undefined,
    week: undefined,
    biweekly: undefined,
    month: undefined,
    year: undefined,
    "check the period that applies for a household of": undefined,
    "which income is at or below the court systems poverty level Note The court systems poverty levels for households":
      undefined,
    "List any other available household income for the checked period on this line":
      undefined,

    // Pre-printed form fields not driven by user data
    courtName: undefined,
    caseNameAndNumber: undefined,
    "lower cost paid for by the state Check all that apply and in any":
      undefined,
    "guess as to the cost if known": undefined,
    "Filing fee and any surcharge": undefined,
    "Filing fee and any surcharge for appeal": undefined,
    "Fees or costs for serving court summons witness subpoenas or other court papers":
      undefined,
    "Other fees or costs of": undefined,
    "Substitution specify": undefined,
    undefined: undefined,
    undefined_2: undefined,
    undefined_3: undefined,
    "for  specify": undefined,
    undefined_4: undefined,
    Cost: undefined,
    "of expert services for testing examination testimony or other assistance specify":
      undefined,
    Cost_2: undefined,
    "of taking andor transcribing a deposition of specify name of person":
      undefined,
    undefined_5: undefined,
    "Cassette copies of tape recording of trial or other proceeding needed to prepare appeal for applicant not":
      undefined,
    "Appeal bond": undefined,
    Cost_3: undefined,
    "of preparing written transcript of trial or other proceeding": undefined,
    undefined_6: undefined,
    "for  specify_2": undefined,
    "Other fees and costs": undefined,
    "Substitution specify_2": undefined,
    undefined_7: undefined,
    "Date signed": undefined,
    x: undefined,
    B: undefined,
    C: undefined,
  }),
});
