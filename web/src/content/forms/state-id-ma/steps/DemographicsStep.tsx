import { Banner } from "#components/common/Banner";
import { FormStep, FormSubsection } from "#components/forms/FormStep";
import { NumberField } from "#components/forms/NumberField";
import { RadioGroupField } from "#components/forms/RadioGroupField";
import { YesNoField } from "#components/forms/YesNoField";
import { defineStep } from "#lib/forms/defineStep";

export const demographicsStep = defineStep({
  id: "demographics",
  title: "What information should appear on your ID?",
  fields: [
    "newGender",
    "eyeColor",
    "heightFeet",
    "heightInches",
    "isOrganDonor",
  ],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <RadioGroupField
        name="newGender"
        label="Gender marker"
        options={[
          { label: "M", value: "Male" },
          { label: "F", value: "Female" },
          { label: "X", value: "X" },
        ]}
      />
      <Banner variant="info">
        <p>The X designation may be used by:</p>
        <ul>
          <li>
            <strong>
              Nonbinary, gender-fluid, or gender-nonconforming people
            </strong>{" "}
            whose gender identity is not strictly male or female
          </li>
          <li>
            <strong>Intersex people</strong> whose sex characteristics do not
            fit typical binary definitions
          </li>
          <li>
            <strong>Anyone seeking privacy</strong>
          </li>
        </ul>
        <p>
          Massachusetts does not require medical proof or documentation to
          choose or switch to an X designation on a driver's license or state
          ID.
        </p>
      </Banner>
      <RadioGroupField
        name="eyeColor"
        label="Eye color"
        options={[
          { label: "Black", value: "Black" },
          { label: "Brown", value: "Brown" },
          { label: "Gray", value: "Gray" },
          { label: "Hazel", value: "Hazel" },
          { label: "Pink", value: "Pink" },
          { label: "Blue", value: "Blue" },
          { label: "Dichromatic", value: "Dichromatic" },
          { label: "Green", value: "Green" },
          { label: "Maroon", value: "Maroon" },
          { label: "Unknown", value: "Unknown" },
        ]}
      />
      <FormSubsection title="Height">
        <NumberField name="heightFeet" label="Feet" minValue={1} maxValue={8} />
        <NumberField
          name="heightInches"
          label="Inches"
          minValue={0}
          maxValue={11}
        />
      </FormSubsection>
      <YesNoField
        name="isOrganDonor"
        label="Register me, or keep me registered, as an organ and tissue donor"
        yesLabel="Yes"
        noLabel="No"
      />
      <Banner variant="info">
        If you are already registered as an organ and tissue donor, select Yes
        to remain registered.
      </Banner>
    </FormStep>
  ),
});
