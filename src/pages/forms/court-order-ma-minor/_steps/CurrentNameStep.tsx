import { FormStep } from "@/components/react/forms/FormStep";
import { NameField } from "@/components/react/forms/NameField";
import type { Step } from "@/forms/types";

export const currentNameStep: Step = {
  id: "current-name",
  title: (data) =>
    `What is ${data.newFirstName ?? "the minor"}'s current legal name?`,
  description:
    "This is the name being left behind. Type it exactly as it appears on the minor's ID.",
  fields: ["oldFirstName", "oldMiddleName", "oldLastName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="oldName" />
    </FormStep>
  ),
};
