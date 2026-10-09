import { FormStep } from "#components/forms/FormStep";
import { NameField } from "#components/forms/NameField";
import { defineStep } from "#lib/forms/defineStep";
import { requestsNameChange } from "../conditions";

export const currentNameStep = defineStep({
  id: "current-name",
  title: "What is your current legal name?",
  description: (data) =>
    requestsNameChange(data)
      ? "This is the name you're leaving behind. Type it exactly as it appears on your ID."
      : "Type it exactly as it appears on your ID.",
  fields: ["oldFirstName", "oldMiddleName", "oldLastName"],
  component: ({ stepConfig }) => {
    return (
      <FormStep stepConfig={stepConfig}>
        <NameField type="oldName" />
      </FormStep>
    );
  },
});
