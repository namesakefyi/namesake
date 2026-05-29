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
    isReceivingPublicAssistance: data.indigencyBasis === "public-assistance",
    isReceivingTAFDC: data.isReceivingTAFDC,
    isReceivingMedicaid: data.isReceivingMedicaid,
    isReceivingEAEDC: data.isReceivingEAEDC,
    isReceivingSSI: data.isReceivingSSI,
    isReceivingVeteransBenefits: data.isReceivingVeteransBenefits,

    // Section B: Income at or below poverty level
    dollarAmount: data.incomeAmount,
    isUnderPovertyLevel: data.indigencyBasis === "income",
    perWeek: data.incomePeriod === "weekly",
    biweekly: data.incomePeriod === "biweekly",
    perMonth: data.incomePeriod === "monthly",
    perYear: data.incomePeriod === "yearly",
    householdSize: data.householdSize,
    numberOfDependents: data.numberOfDependents,
    otherHouseholdIncome: data.otherHouseholdIncome,

    // Section C: Unable to pay
    isUnableToPay: data.indigencyBasis === "unable-to-pay",

    // Section 2: Fee waivers
    shouldWaiveFilingFeeAndSurcharge: data.shouldWaiveFilingFeeAndSurcharge,
    filingFeeAndSurcharge: data.filingFeeAndSurcharge,
    shouldWaiveFilingFeeAndSurchargeForAppeal:
      data.shouldWaiveFilingFeeAndSurchargeForAppeal,
    filingFeeAndSurchargeForAppeal: data.filingFeeAndSurchargeForAppeal,
    shouldWaiveFeesForCourtSummons: data.shouldWaiveFeesForCourtSummons,
    feesForCourtSummons: data.feesForCourtSummons,
    shouldWaiveOtherFeesSection2: data.shouldWaiveOtherFeesSection2,
    otherFeesSection2: data.otherFeesSection2,
    otherFeesSection2Details: data.otherFeesSection2Details,
    applySubstitutionSection2: data.applySubstitutionSection2,
    substitutionDetailsSection2: data.substitutionDetailsSection2,

    // Section 3: Expense waivers
    shouldWaiveExpertServices: data.shouldWaiveExpertServices,
    costOfExpertServices: data.costOfExpertServices,
    expertServicesDetails: data.expertServicesDetails,
    shouldWaiveCostOfTranscription: data.shouldWaiveCostOfTranscription,
    costOfTranscription: data.costOfTranscription,
    shouldWaiveRecordingOfTrialForAppeal:
      data.shouldWaiveRecordingOfTrialForAppeal,
    shouldWaiveAppealBond: data.shouldWaiveAppealBond,
    shouldWaiveCostOfWrittenTranscriptPreparation:
      data.shouldWaiveCostOfWrittenTranscriptPreparation,
    costOfWrittenTranscriptPreparation: data.costOfWrittenTranscriptPreparation,
    shouldWaiveOtherFeesSection3: data.shouldWaiveOtherFeesSection3,
    otherFeesSection3: data.otherFeesSection3,
    otherFeesSection3Details: data.otherFeesSection3Details,
    applySubstitutionSection3: data.applySubstitutionSection3,
    substitutionDetailsSection3: data.substitutionDetailsSection3,
  }),
});
