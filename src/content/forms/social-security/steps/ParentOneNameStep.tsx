import { FormStep } from "../../../../components/forms/FormStep";
import { NameField } from "../../../../components/forms/NameField";
import type { Step } from "../../../../forms/types";

export const parentOneNameStep: Step = {
  id: "parent-one",
  title: "What is your mother's (or first parent's) name?",
  description:
    "Use your parent's name at their birth, before marriage. This is also known as a maiden name.",
  fields: ["mothersFirstName", "mothersMiddleName", "mothersLastName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="mothersName" />
    </FormStep>
  ),
};
