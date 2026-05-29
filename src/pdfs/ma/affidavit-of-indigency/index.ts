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
    filingFeeAndSurcharge: data.shouldWaiveFilingFeeAndSurcharge
      ? data.filingFeeAndSurcharge
      : undefined,
    shouldWaiveFilingFeeAndSurchargeForAppeal:
      data.shouldWaiveFilingFeeAndSurchargeForAppeal,
    filingFeeAndSurchargeForAppeal:
      data.shouldWaiveFilingFeeAndSurchargeForAppeal
        ? data.filingFeeAndSurchargeForAppeal
        : undefined,
    shouldWaiveFeesForCourtSummons: data.shouldWaiveFeesForCourtSummons,
    feesForCourtSummons: data.shouldWaiveFeesForCourtSummons
      ? data.feesForCourtSummons
      : undefined,
    shouldWaiveOtherFeesSection2: data.shouldWaiveOtherFeesSection2,
    otherFeesSection2: data.shouldWaiveOtherFeesSection2
      ? data.otherFeesSection2
      : undefined,
    otherFeesSection2Details: data.shouldWaiveOtherFeesSection2
      ? data.otherFeesSection2Details
      : undefined,
    applySubstitutionSection2: data.applySubstitutionSection2,
    substitutionDetailsSection2: data.applySubstitutionSection2
      ? data.substitutionDetailsSection2
      : undefined,

    // Section 3: Expense waivers
    shouldWaiveExpertServices: data.shouldWaiveExpertServices,
    costOfExpertServices: data.shouldWaiveExpertServices
      ? data.costOfExpertServices
      : undefined,
    expertServicesDetails: data.shouldWaiveExpertServices
      ? data.expertServicesDetails
      : undefined,
    shouldWaiveCostOfTranscription: data.shouldWaiveCostOfTranscription,
    costOfTranscription: data.shouldWaiveCostOfTranscription
      ? data.costOfTranscription
      : undefined,
    shouldWaiveRecordingOfTrialForAppeal:
      data.shouldWaiveRecordingOfTrialForAppeal,
    shouldWaiveAppealBond: data.shouldWaiveAppealBond,
    shouldWaiveCostOfWrittenTranscriptPreparation:
      data.shouldWaiveCostOfWrittenTranscriptPreparation,
    costOfWrittenTranscriptPreparation:
      data.shouldWaiveCostOfWrittenTranscriptPreparation
        ? data.costOfWrittenTranscriptPreparation
        : undefined,
    shouldWaiveOtherFeesSection3: data.shouldWaiveOtherFeesSection3,
    otherFeesSection3: data.shouldWaiveOtherFeesSection3
      ? data.otherFeesSection3
      : undefined,
    otherFeesSection3Details: data.shouldWaiveOtherFeesSection3
      ? data.otherFeesSection3Details
      : undefined,
    applySubstitutionSection3: data.applySubstitutionSection3,
    substitutionDetailsSection3: data.applySubstitutionSection3
      ? data.substitutionDetailsSection3
      : undefined,
  }),
});
