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

export const supportPaymentsStep = defineStep({
  id: "support-payments",
  title: "Do you have to pay child or spousal support?",
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
    const childDetailsVisible = useFieldVisible(
      stepConfig,
      "areChildSupportPaymentsUpToDate",
    );
    const childArrearsVisible = useFieldVisible(
      stepConfig,
      "childSupportArrearsAmount",
    );
    const spousalDetailsVisible = useFieldVisible(
      stepConfig,
      "areSpousalSupportPaymentsUpToDate",
    );
    const spousalArrearsVisible = useFieldVisible(
      stepConfig,
      "spousalSupportArrearsAmount",
    );
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="paysChildSupport"
          label="Do you have to pay child support?"
        />
        <FormSubsection isVisible={childDetailsVisible}>
          <YesNoField
            name="areChildSupportPaymentsUpToDate"
            label="Are your child support payments up to date?"
          />
          <FormSubsection isVisible={childArrearsVisible}>
            <NumberField
              name="childSupportArrearsAmount"
              label="Child support owed"
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
        <YesNoField
          name="paysSpousalSupport"
          label="Do you have to pay spousal support?"
        />
        <FormSubsection isVisible={spousalDetailsVisible}>
          <YesNoField
            name="areSpousalSupportPaymentsUpToDate"
            label="Are your spousal support payments up to date?"
          />
          <FormSubsection isVisible={spousalArrearsVisible}>
            <NumberField
              name="spousalSupportArrearsAmount"
              label="Spousal support owed"
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
