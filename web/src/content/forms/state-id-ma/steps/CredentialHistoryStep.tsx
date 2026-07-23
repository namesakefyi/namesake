import { Banner } from "#components/common/Banner";
import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "#components/forms/FormStep";
import { ShortTextField } from "#components/forms/ShortTextField";
import { YesNoField } from "#components/forms/YesNoField";
import { defineStep } from "#lib/forms/defineStep";

const whenOtherCredential = (data: Record<string, unknown>) =>
  data.hasOtherJurisdictionCredential === true;

export const credentialHistoryStep = defineStep({
  id: "credential-history",
  title: "Have you held a license somewhere else in the past 10 years?",
  description:
    "Include any class of license from another state, country, or jurisdiction.",
  fields: [
    "hasOtherJurisdictionCredential",
    {
      ids: [
        "otherCredentialJurisdiction",
        "otherCredentialClass",
        "otherCredentialNumber",
        "currentOtherCredentials",
      ],
      when: whenOtherCredential,
    },
  ],
  component: ({ stepConfig }) => {
    const detailsVisible = useFieldVisible(
      stepConfig,
      "otherCredentialJurisdiction",
    );

    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasOtherJurisdictionCredential"
          label="Held a license in another jurisdiction?"
          labelHidden
        />
        <FormSubsection
          title="Tell us about the other credential"
          isVisible={detailsVisible}
        >
          <ShortTextField
            name="otherCredentialJurisdiction"
            label="Country or state"
            size={24}
          />
          <ShortTextField
            name="otherCredentialClass"
            label="Credential class"
            size={18}
          />
          <ShortTextField
            name="otherCredentialNumber"
            label="Credential number"
            size={24}
          />
          <ShortTextField
            name="currentOtherCredentials"
            label="List any other current license or permit"
            description="Leave blank if you do not currently hold another license or permit."
            size={36}
          />
        </FormSubsection>
        <Banner variant="info">
          An out-of-state driver's license or ID card may be canceled when your
          Massachusetts driver's license or ID card is issued.
        </Banner>
      </FormStep>
    );
  },
});
