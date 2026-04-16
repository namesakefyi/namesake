import { useFormContext } from "react-hook-form";
import { Banner } from "../../../../components/common/Banner";
import { CostsTable } from "../../../../components/forms/CostsTable";
import { useFormStep } from "../../../../components/forms/FormContainer";
import { FormStep } from "../../../../components/forms/FormStep";
import { YesNoField } from "../../../../components/forms/YesNoField";
import type { Step } from "../../../../forms/types";

export const feeWaiverStep: Step = {
  id: "fee-waiver",
  title: "Do you need to apply for a fee waiver?",
  description:
    "If you are unable to pay the filing fee, you can file an Affidavit of Indigency—a document proving that you are unable to pay.",
  fields: ["shouldApplyForFeeWaiver"],
  component: ({ stepConfig }) => {
    const { costs } = useFormStep();
    const form = useFormContext();

    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="shouldApplyForFeeWaiver"
          label="Apply for a fee waiver?"
          labelHidden
          yesLabel="Yes, help me waive filing fees"
          noLabel="No, I will pay the filing fee"
        />
        {form.watch("shouldApplyForFeeWaiver") === true ? (
          <Banner>
            Your download will include an Affidavit of Indigency.{" "}
            <strong>
              There are additional fields in the download you have to fill out.
            </strong>{" "}
            Additionally, you can{" "}
            <a
              href="https://www.masstpc.org/what-we-do/ida-network/ida-financial-assistance/"
              target="_blank"
              rel="noopener noreferrer"
            >
              request financial assistance through the Massachusetts Transgender
              Political Coalition.
            </a>
          </Banner>
        ) : (
          <CostsTable costs={costs ?? []} />
        )}
      </FormStep>
    );
  },
};
