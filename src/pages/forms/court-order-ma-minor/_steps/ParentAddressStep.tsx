import { useFormContext } from "react-hook-form";
import { Banner } from "@/components/react/common/Banner";
import { AddressField } from "@/components/react/forms/AddressField";
import { CheckboxField } from "@/components/react/forms/CheckboxField";
import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { nameOrFallback } from "@/forms/resolveStepContent";
import type { Step } from "@/forms/types";

export const parentAddressStep: Step = {
  id: "parent-address",
  title: (data) =>
    `Where do ${nameOrFallback(data, "the minor")}'s parents live?`,
  fields: [
    "parentsHaveUnknownAddresses",
    {
      ids: [
        "parentsHaveDifferentAddresses",
        "parent1StreetAddress",
        "parent1City",
        "parent1State",
        "parent1ZipCode",
      ],
      when: (data) => data.parentsHaveUnknownAddresses === false,
    },
    {
      ids: [
        "parent2StreetAddress",
        "parent2City",
        "parent2State",
        "parent2ZipCode",
      ],
      when: (data) =>
        data.parentsHaveUnknownAddresses === false &&
        data.parentsHaveDifferentAddresses === true,
    },
  ],
  component: ({ stepConfig }) => {
    const form = useFormContext();
    const parentsHaveUnknownAddresses =
      form.watch("parentsHaveUnknownAddresses") === true;
    const secondAddressVisible = useFieldVisible(
      stepConfig,
      "parent2StreetAddress",
    );
    return (
      <FormStep stepConfig={stepConfig}>
        <CheckboxField
          name="parentsHaveUnknownAddresses"
          label="The addresses of the parents are unknown"
        />
        {parentsHaveUnknownAddresses ? (
          <Banner>
            Since the address or whereabouts of legal parents are unknown, you
            must also file a{" "}
            <a href="https://www.mass.gov/info-details/probate-and-family-court-motion-for-service-by-alternate-means-and-affidavit-of-diligent-search-cjp-31">
              Motion for Service by Alternate Means and Affidavit of Diligent
              Search (CJP 31)
            </a>{" "}
            with a{" "}
            <a href="https://www.mass.gov/doc/military-affidavit/download">
              Military Affidavit (TC0002)
            </a>
            .
          </Banner>
        ) : (
          <>
            <CheckboxField
              name="parentsHaveDifferentAddresses"
              label="Parents have different addresses"
            />
            {!secondAddressVisible && <AddressField type="parent1" />}
            <FormSubsection
              title="First parent's address"
              isVisible={secondAddressVisible}
            >
              <AddressField type="parent1" />
            </FormSubsection>
            <FormSubsection
              title="Second parent's address"
              isVisible={secondAddressVisible}
            >
              <AddressField type="parent2" />
            </FormSubsection>
          </>
        )}
      </FormStep>
    );
  },
};
