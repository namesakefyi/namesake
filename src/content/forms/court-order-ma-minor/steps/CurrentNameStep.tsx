import { FormStep } from "../../../../components/forms/FormStep";
import { NameField } from "../../../../components/forms/NameField";
import { defineStep } from "../../../../forms/defineStep";

export const currentNameStep = defineStep({
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
});
