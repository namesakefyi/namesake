import { FormStep } from "~/components/forms/FormStep";
import { NameField } from "~/components/forms/NameField";
import { defineStep } from "~/forms/defineStep";

export const oldNameStep = defineStep({
  id: "old-name",
  title: "What was your name at birth?",
  description:
    "This is the name that appears on your original birth certificate.",
  fields: ["oldFirstName", "oldMiddleName", "oldLastName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="oldName" />
    </FormStep>
  ),
});
