import { Banner } from "#components/common/Banner";
import { FormStep } from "#components/forms/FormStep";
import { RadioGroupField } from "#components/forms/RadioGroupField";
import { ShortTextField } from "#components/forms/ShortTextField";
import { defineStep } from "#lib/forms/defineStep";
import { deriveCurrentAge } from "#lib/utils/deriveCurrentAge";

export const guardianConsentStep = defineStep({
  id: "guardian-consent",
  title: "Who will give consent for your application?",
  description:
    "Because you are under 18, the person giving consent must sign the printed application.",
  fields: ["consentProviderType", "guardianFullName", "guardianAddress"],
  when: (data) => {
    // deriveCurrentAge returns -1 until a valid date of birth is available.
    const age = deriveCurrentAge(data.dateOfBirth);
    return age >= 0 && age < 18;
  },
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <RadioGroupField
        name="consentProviderType"
        label="Person giving consent"
        options={[
          { label: "Parent", value: "parent" },
          { label: "Legal guardian", value: "legalGuardian" },
          {
            label: "Department of Children and Families",
            value: "departmentOfChildrenAndFamilies",
          },
          {
            label: "Boarding school headmaster",
            value: "boardingSchoolHeadmaster",
          },
        ]}
      />
      <ShortTextField
        name="guardianFullName"
        label="Parent or guardian's full name"
        size={30}
      />
      <ShortTextField
        name="guardianAddress"
        label="Parent or guardian's full address"
        size={40}
      />
      <Banner variant="info">
        If the person giving consent is not your parent, they must show proper
        documentation of their authority.
      </Banner>
    </FormStep>
  ),
});
