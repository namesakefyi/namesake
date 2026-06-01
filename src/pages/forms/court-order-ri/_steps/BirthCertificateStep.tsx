import { Banner } from "../../../../components/common/Banner";
import { FormStep } from "../../../../components/forms/FormStep";
import { YesNoField } from "../../../../components/forms/YesNoField";
import type { Step } from "../../../../forms/types";

export const birthCertificateStep: Step = {
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
      <Banner variant="info">
        If you select yes, the court will also order your Rhode Island birth
        certificate to be updated to reflect your new name.
      </Banner>
    </FormStep>
  ),
};
