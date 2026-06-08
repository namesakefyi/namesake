import { FormStep } from "../../../../components/forms/FormStep";
import { NameField } from "../../../../components/forms/NameField";
import type { Step } from "../../../../forms/types";

export const parentTwoNameStep: Step = {
  id: "parent-two",
  title: "What is your father's (or second parent's) name?",
  fields: ["fathersFirstName", "fathersMiddleName", "fathersLastName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="fathersName" />
    </FormStep>
  ),
};
