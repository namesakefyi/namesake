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
    courtName: undefined,
    caseNameAndNumber: undefined,
    applicantName: joinNames(
      data.oldFirstName,
      data.oldMiddleName,
      data.oldLastName,
    ),
    residenceStreetAddress: data.residenceStreetAddress,
    residenceCity: data.residenceCity,
    residenceStateAndZip: `${data.residenceState} ${data.residenceZipCode}`,

    // Section A: Public assistance
    isReceivingPublicAssistance: undefined,
    isReceivingTAFDC: undefined,
    isReceivingMedicaid: undefined,
    isReceivingEAEDC: undefined,
    isReceivingSSI: undefined,
    isReceivingVeteransBenefits: undefined,

    // Section B: Income at or below poverty level
    dollarAmount: undefined,
    isUnderPovertyLevel: undefined,
    perWeek: undefined,
    biweekly: undefined,
    perMonth: undefined,
    perYear: undefined,
    householdSize: undefined,
    numberOfDependents: undefined,
    otherHouseholdIncome: undefined,

    // Section C: Unable to pay
    isUnableToPay: undefined,

    // Section 2: Fee waivers
    shouldWaiveFilingFeeAndSurcharge: undefined,
    filingFeeAndSurcharge: undefined,
    shouldWaiveFilingFeeAndSurchargeForAppeal: undefined,
    filingFeeAndSurchargeForAppeal: undefined,
    shouldWaiveFeesForCourtSummons: undefined,
    feesForCourtSummons: undefined,
    shouldWaiveOtherFeesSection2: undefined,
    otherFeesSection2: undefined,
    otherFeesSection2Details: undefined,
    applySubstitutionSection2: undefined,
    substitutionDetailsSection2: undefined,

    // Section 3: Expense waivers
    shouldWaiveExpertServices: undefined,
    costOfExpertServices: undefined,
    expertServicesDetails: undefined,
    shouldWaiveCostOfTranscription: undefined,
    costOfTranscription: undefined,
    shouldWaiveRecordingOfTrialForAppeal: undefined,
    shouldWaiveAppealBond: undefined,
    shouldWaiveCostOfWrittenTranscriptPreparation: undefined,
    costOfWrittenTranscriptPreparation: undefined,
    shouldWaiveOtherFeesSection3: undefined,
    otherFeesSection3: undefined,
    otherFeesSection3Details: undefined,
    applySubstitutionSection3: undefined,
    substitutionDetailsSection3: undefined,
  }),
});
