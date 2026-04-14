import { Banner } from "../../../../components/common/Banner";
import { FormStep } from "../../../../components/forms/FormStep";
import { ShortTextField } from "../../../../components/forms/ShortTextField";
import type { Step } from "../../../../forms/types";

export const mothersMaidenNameStep: Step = {
  id: "mothers-maiden-name",
  title: "What is your mother's maiden name?",
  description:
    "The court requests this information in order to look up past court records and verify your identity.",
  fields: ["mothersMaidenName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <ShortTextField name="mothersMaidenName" label="Mother's maiden name" />
      <Banner variant="info">
        The maiden name is the last name (or family name) of your mother (or
        guardian) before marriage.
      </Banner>
    </FormStep>
  ),
};
