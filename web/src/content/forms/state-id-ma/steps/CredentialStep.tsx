import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "#components/forms/FormStep";
import { RadioGroupField } from "#components/forms/RadioGroupField";
import { defineStep } from "#lib/forms/defineStep";

const whenLicenseOrPermit = (data: Record<string, unknown>) =>
  data.stateIdDocumentType === "learnersPermit" ||
  data.stateIdDocumentType === "driversLicense";

export const credentialStep = defineStep({
  id: "credential",
  title: "What kind of Massachusetts credential are you updating?",
  fields: [
    "stateIdType",
    "stateIdDocumentType",
    { id: "driversLicenseClass", when: whenLicenseOrPermit },
  ],
  component: ({ stepConfig }) => {
    const licenseClassVisible = useFieldVisible(
      stepConfig,
      "driversLicenseClass",
    );

    return (
      <FormStep stepConfig={stepConfig}>
        <RadioGroupField
          name="stateIdType"
          label="ID type"
          options={[
            {
              label: "REAL ID",
              value: "realId",
              description:
                "A Massachusetts REAL ID has a star in the top-right corner.",
            },
            {
              label: "Standard ID",
              value: "standardId",
              description:
                "A Standard ID does not have a star and is not acceptable as federal identification.",
            },
          ]}
        />
        <RadioGroupField
          name="stateIdDocumentType"
          label="Document to issue"
          options={[
            { label: "Learner's permit", value: "learnersPermit" },
            { label: "Driver's license", value: "driversLicense" },
            {
              label: "Massachusetts ID card",
              value: "massachusettsIdCard",
            },
          ]}
        />
        <FormSubsection
          title="What class is your permit or license?"
          isVisible={licenseClassVisible}
        >
          <RadioGroupField
            name="driversLicenseClass"
            label="Permit or license class"
            labelHidden
            options={[
              { label: "Passenger (Class D)", value: "passenger" },
              { label: "Motorcycle (Class M)", value: "motorcycle" },
              { label: "Both (Class D/M)", value: "both" },
            ]}
          />
        </FormSubsection>
      </FormStep>
    );
  },
});
