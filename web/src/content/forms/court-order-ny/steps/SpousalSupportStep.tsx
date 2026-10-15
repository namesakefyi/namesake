import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "#components/forms/FormStep";
import { NumberField } from "#components/forms/NumberField";
import { ShortTextField } from "#components/forms/ShortTextField";
import { YesNoField } from "#components/forms/YesNoField";
import { defineStep } from "#lib/forms/defineStep";
import { requestsNameChange } from "../conditions";

export const spousalSupportStep = defineStep({
  id: "spousal-support",
  title: "Do you have to pay spousal support?",
  when: requestsNameChange,
  fields: [
    "paysSpousalSupport",
    {
      ids: [
        "areSpousalSupportPaymentsUpToDate",
        "courtIssuingSpousalSupportOrder",
      ],
      when: (data) => data.paysSpousalSupport === true,
    },
    {
      id: "spousalSupportArrearsAmount",
      when: (data) =>
        data.paysSpousalSupport === true &&
        data.areSpousalSupportPaymentsUpToDate === false,
    },
  ],
  component: ({ stepConfig }) => {
    const detailsVisible = useFieldVisible(
      stepConfig,
      "areSpousalSupportPaymentsUpToDate",
    );
    const arrearsVisible = useFieldVisible(
      stepConfig,
      "spousalSupportArrearsAmount",
    );
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="paysSpousalSupport"
          label="Do you have to pay spousal support?"
        />
        <FormSubsection isVisible={detailsVisible}>
          <YesNoField
            name="areSpousalSupportPaymentsUpToDate"
            label="Are your spousal support payments up to date?"
          />
          <FormSubsection isVisible={arrearsVisible}>
            <NumberField
              name="spousalSupportArrearsAmount"
              label="Amount owed"
              minValue={0}
              formatOptions={{ style: "currency", currency: "USD" }}
            />
          </FormSubsection>
          <ShortTextField
            name="courtIssuingSpousalSupportOrder"
            label="Court that issued the spousal support order"
          />
        </FormSubsection>
      </FormStep>
    );
  },
});
