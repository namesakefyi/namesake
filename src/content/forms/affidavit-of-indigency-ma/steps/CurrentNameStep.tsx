import { FormStep } from "~/components/forms/FormStep";
import { NameField } from "~/components/forms/NameField";
import { defineStep } from "~/forms/defineStep";

export const currentNameStep = defineStep({
  id: "current-name",
  title: "What is your current legal name?",
  description:
    "This name will attach the fee waiver to your name change application.",
  fields: ["oldFirstName", "oldMiddleName", "oldLastName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="oldName" />
    </FormStep>
  ),
});
