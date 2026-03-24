import { FormStep } from "@/components/react/forms/FormStep";
import { NameField } from "@/components/react/forms/NameField";
import type { Step } from "@/forms/types";

export const newNameStep: Step = {
  id: "new-name",
  title: "What is the minor's new name?",
  description: "This is the name being made official!",
  fields: ["newFirstName", "newMiddleName", "newLastName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="newName" />
    </FormStep>
  ),
};
