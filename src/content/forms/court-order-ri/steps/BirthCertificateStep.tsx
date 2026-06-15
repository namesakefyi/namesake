import { FormStep } from "../../../../components/forms/FormStep";
import { YesNoField } from "../../../../components/forms/YesNoField";
import { defineStep } from "../../../../forms/defineStep";

export const birthCertificateStep = defineStep({
  id: "birth-certificate",
  title: "Do you want to update your Rhode Island birth certificate?",
  fields: ["shouldChangeBirthCertificate"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <YesNoField
        name="shouldChangeBirthCertificate"
        label="Update birth certificate?"
        labelHidden
        yesLabel="Yes, update my birth certificate to my new name"
        noLabel="No, don't change my birth certificate"
      />
    </FormStep>
  ),
});
