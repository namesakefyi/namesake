import { FormStep } from "../../../../components/forms/FormStep";
import { NameField } from "../../../../components/forms/NameField";
import { defineStep } from "../../../../forms/defineStep";

export const parentTwoNameStep = defineStep({
  id: "parent-two",
  title: "What is your father's (or second parent's) name?",
  fields: ["fathersFirstName", "fathersMiddleName", "fathersLastName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="fathersName" />
    </FormStep>
  ),
});
