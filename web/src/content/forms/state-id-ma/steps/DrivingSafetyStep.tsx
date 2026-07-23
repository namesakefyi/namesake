import { FormStep } from "#components/forms/FormStep";
import { YesNoField } from "#components/forms/YesNoField";
import { defineStep } from "#lib/forms/defineStep";

export const drivingSafetyStep = defineStep({
  id: "driving-safety",
  title: "Answer the RMV's driving safety questions",
  description:
    "These questions apply only to driver's license and learner's permit applicants.",
  fields: [
    "hasDrivingImpairment",
    "takesDrivingMedication",
    "hasSuspendedLicense",
  ],
  when: (data) =>
    data.stateIdDocumentType === "learnersPermit" ||
    data.stateIdDocumentType === "driversLicense",
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <YesNoField
        name="hasDrivingImpairment"
        label="Do you have a cognitive, neurologic, physical, or other impairment that may affect your ability to operate a motor vehicle safely?"
      />
      <YesNoField
        name="takesDrivingMedication"
        label="Are you taking any medication that may affect your ability to safely operate a motor vehicle?"
      />
      <YesNoField
        name="hasSuspendedLicense"
        label="Is your license or right to operate suspended, revoked, canceled, withdrawn, or disqualified here or in another jurisdiction?"
      />
    </FormStep>
  ),
});
