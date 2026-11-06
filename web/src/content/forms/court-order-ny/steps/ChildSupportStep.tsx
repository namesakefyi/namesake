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

export const childSupportStep = defineStep({
  id: "child-support",
  title: "Do you have to pay child support?",
  when: requestsNameChange,
  fields: [
    "paysChildSupport",
    {
      ids: [
        "areChildSupportPaymentsUpToDate",
        "courtIssuingChildSupportOrder",
        "supportCollectionsUnit",
      ],
      when: (data) => data.paysChildSupport === true,
    },
    {
      id: "childSupportArrearsAmount",
      when: (data) =>
        data.paysChildSupport === true &&
        data.areChildSupportPaymentsUpToDate === false,
    },
  ],
  component: ({ stepConfig }) => {
    const detailsVisible = useFieldVisible(
      stepConfig,
      "areChildSupportPaymentsUpToDate",
    );
    const arrearsVisible = useFieldVisible(
      stepConfig,
      "childSupportArrearsAmount",
    );
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="paysChildSupport"
          label="Do you have to pay child support?"
        />
        <FormSubsection isVisible={detailsVisible}>
          <YesNoField
            name="areChildSupportPaymentsUpToDate"
            label="Are your child support payments up to date?"
          />
          <FormSubsection isVisible={arrearsVisible}>
            <NumberField
              name="childSupportArrearsAmount"
              label="Amount owed"
              minValue={0}
              formatOptions={{ style: "currency", currency: "USD" }}
            />
          </FormSubsection>
          <ShortTextField
            name="courtIssuingChildSupportOrder"
            label="Court that issued the child support order"
          />
          <ShortTextField
            name="supportCollectionsUnit"
            label="Child Support Collections Unit"
          />
        </FormSubsection>
      </FormStep>
    );
  },
});
