import { Banner } from "../../../../components/common/Banner";
import { FormStep } from "../../../../components/forms/FormStep";
import { RadioGroupField } from "../../../../components/forms/RadioGroupField";
import type { Step } from "../../../../forms/types";

export const sexStep: Step = {
  id: "sex",
  title: "What is your sex?",
  description:
    "The Social Security Administration accepts only two options: male or female.",
  fields: ["sexAssignedAtBirth"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <RadioGroupField
        name="sexAssignedAtBirth"
        label="Sex"
        options={[
          {
            label: "Male",
            value: "male",
          },
          {
            label: "Female",
            value: "female",
          },
        ]}
      />
      <Banner variant="warning">
        <p>
          <strong>
            Namesake recommends selecting the same gender marker that the Social
            Security Administration already has on file.
          </strong>{" "}
          The gender marker is not shown on your Social Security card.
        </p>
        <p>
          As of January 20, 2025, the Trump administration has directed the
          Social Security Administration to{" "}
          <a
            href="https://www.whitehouse.gov/presidential-actions/2025/01/defending-women-from-gender-ideology-extremism-and-restoring-biological-truth-to-the-federal-government/"
            target="_blank"
            rel="noreferrer"
          >
            stop processing gender marker updates
          </a>{" "}
          associated with social security records. Per{" "}
          <a
            href="https://lambdalegal.org/tgnc-checklist-under-trump/#:~:text=If%20you%20apply%20for%20a%20gender%20marker%20change%20with%20Social%20Security%20now%2C%20you%20will%20likely%20be%20told%20that%20they%20cannot%20process%20your%20request."
            target="_blank"
            rel="noreferrer"
          >
            Lambda Legal
          </a>
          , if you apply for a gender marker change with Social Security now,
          you will likely be told that they cannot process your request.
        </p>
      </Banner>
    </FormStep>
  ),
};
