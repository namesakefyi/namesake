import { Banner } from "../../../../components/common/Banner";
import { FormStep } from "../../../../components/forms/FormStep";
import { YesNoField } from "../../../../components/forms/YesNoField";
import type { Step } from "../../../../forms/types";

export const ethnicityStep: Step = {
  id: "ethnicity",
  title: "What is your ethnicity?",
  description:
    "This response is optional and does not affect your application. The Social Security Administration requests this information for research and statistical purposes.",
  fields: ["isHispanicOrLatino"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <YesNoField
        name="isHispanicOrLatino"
        label="Ethnicity"
        yesLabel="I am Hispanic or Latino"
        noLabel="I am not Hispanic or Latino"
        includePreferNotToAnswer
      />
      <Banner variant="info">
        The Social Security Administration requests this information for
        research and statistical purposes.
      </Banner>
    </FormStep>
  ),
};
