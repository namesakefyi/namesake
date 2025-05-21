import { Banner, Button } from "@/components/common";
import {
  AddressField,
  CheckboxGroupField,
  FormContainer,
  FormSection,
  FormSubsection,
  LongTextField,
  MemorableDateField,
  NameField,
  PhoneField,
  RadioGroupField,
  SelectField,
  ShortTextField,
  YesNoField,
} from "@/components/forms";
import {
  BIRTHPLACES,
  COUNTRIES,
  type FieldName,
  type FieldType,
} from "@/constants";
import ss5ApplicationForSocialSecurityCard from "@/forms/federal/ss5-application-for-social-security-card";
import { downloadMergedPdf } from "@/forms/utils";
import { useForm } from "@/hooks/useForm";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import type { FormEvent } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/forms/social-security")({
  component: RouteComponent,
});

const FORM_FIELDS: FieldName[] = [
  "newFirstName",
  "newMiddleName",
  "newLastName",
  "oldFirstName",
  "oldMiddleName",
  "oldLastName",
  "previousLegalNames",
  "birthplaceCity",
  "birthplaceState",
  "birthplaceCountry",
  "dateOfBirth",
  "citizenshipStatus",
  "isHispanicOrLatino",
  "race",
  "sexAssignedAtBirth",
  "mothersFirstName",
  "mothersMiddleName",
  "mothersLastName",
  "fathersFirstName",
  "fathersMiddleName",
  "fathersLastName",
  "hasPreviousSocialSecurityCard",
  "previousSocialSecurityCardFirstName",
  "previousSocialSecurityCardMiddleName",
  "previousSocialSecurityCardLastName",
  "isCurrentlyUnhoused",
  "isFilingForSomeoneElse",
  "relationshipToFilingFor",
  "relationshipToFilingForOther",
] as const;

type FormData = {
  [K in (typeof FORM_FIELDS)[number]]: FieldType<K>;
};

function RouteComponent() {
  const { onSubmit, isSubmitting, ...form } = useForm<FormData>(FORM_FIELDS);
  const saveDocuments = useMutation(api.userDocuments.set);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const pdfs = [ss5ApplicationForSocialSecurityCard];

      await downloadMergedPdf({
        title: "Social Security Card",
        pdfs,
        userData: form.getValues(),
      });

      // Save form to user documents
      await saveDocuments({ pdfIds: pdfs.map((pdf) => pdf.id) });

      // Save encrypted responses
      await onSubmit();
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    }
  };

  return (
    <FormContainer
      title="Social Security Card"
      form={form}
      onSubmit={handleSubmit}
    >
      <FormSection
        title="What is your new name?"
        description="This is the name that will show on your new card."
      >
        <NameField type="newName" />
      </FormSection>
      <FormSection
        title="What was your name at birth?"
        description="This is the name that appears on your original birth certificate."
      >
        <NameField type="oldName" />
      </FormSection>
      <FormSection title="What other legal names have you used, if any?">
        <LongTextField name="previousLegalNames" label="Other names used" />
      </FormSection>
      <FormSection title="Where were you born?">
        <div className="flex flex-wrap gap-4">
          <ShortTextField name="birthplaceCity" label="City" />
          <SelectField
            name="birthplaceState"
            label="State"
            placeholder="Select a state"
            options={Object.entries(BIRTHPLACES).map(([value, label]) => ({
              label,
              value,
            }))}
          />
          {form.watch("birthplaceState") === "other" && (
            <SelectField
              name="birthplaceCountry"
              label="Country"
              placeholder="Select a country"
              options={Object.entries(COUNTRIES)
                .filter(([value]) => value !== "US")
                .map(([value, label]) => ({
                  label,
                  value,
                }))}
            />
          )}
        </div>
      </FormSection>
      <FormSection title="What is your date of birth?">
        <MemorableDateField name="dateOfBirth" label="Date of birth" />
      </FormSection>
      <FormSection title="What is your citizenship status?">
        <RadioGroupField
          name="citizenshipStatus"
          label="Citizenship status"
          labelHidden
          options={[
            {
              label: "U.S. Citizen",
              value: "usCitizen",
            },
            {
              label: "Legal Alien Allowed To Work",
              value: "legalAlienAllowedToWork",
            },
            {
              label: "Legal Alien Not Allowed To Work",
              value: "legalAlienNotAllowedToWork",
            },
            {
              label: "Other",
              value: "other",
            },
          ]}
        />
        {(form.watch("citizenshipStatus") === "other" ||
          form.watch("citizenshipStatus") === "legalAlienNotAllowedToWork") && (
          <Banner variant="warning" size="large">
            You must provide a document from a U.S. Federal, State, or local
            government agency that explains why you need a Social Security
            number and that you meet all the requirements for the government
            benefit.
          </Banner>
        )}
      </FormSection>
      <FormSection
        title="What is your ethnicity?"
        description="This response is optional and does not affect your application. The Social Security Administration requests this information for research and statistical purposes."
      >
        <YesNoField
          name="isHispanicOrLatino"
          label="Are you Hispanic or Latino?"
          yesLabel="I am Hispanic or Latino"
          noLabel="I am not Hispanic or Latino"
        />
      </FormSection>
      <FormSection
        title="What is your race?"
        description="This response is optional."
      >
        <CheckboxGroupField
          name="race"
          label="Race"
          labelHidden
          options={[
            {
              label: "Native Hawaiian",
              value: "nativeHawaiian",
            },
            {
              label: "Alaska Native",
              value: "alaskaNative",
            },
            {
              label: "Asian",
              value: "asian",
            },
            {
              label: "American Indian",
              value: "americanIndian",
            },
            {
              label: "Black or African American",
              value: "black",
            },
            {
              label: "Other Pacific Islander",
              value: "otherPacificIslander",
            },
            {
              label: "White",
              value: "white",
            },
          ]}
        />
      </FormSection>
      <FormSection
        title="What is your sex?"
        description="The Social Security Administration accepts only two options: male or female."
      >
        <Banner variant="warning" size="large">
          <p>
            <strong>
              Namesake recommends selecting the same gender marker that the
              Social Security Administration already has on file.
            </strong>{" "}
            The gender marker is not shown on your Social Security card.
          </p>
          <p>
            As of January 31, 2025, the Trump administration has directed the
            Social Security Administration to stop processing gender marker
            updates associated with social security records. If you apply for a
            gender marker change with Social Security now, you will likely be
            told that they cannot process your request.
          </p>
        </Banner>
        <RadioGroupField
          name="sexAssignedAtBirth"
          label="Sex"
          labelHidden
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
      </FormSection>
      <FormSection title="What are your parents' names?">
        <FormSubsection title="What is your mother's (or first parent's) name at birth?">
          <NameField type="mothersName" />
        </FormSubsection>
        <FormSubsection title="What is your father's (or second parent's) name at birth?">
          <NameField type="fathersName" />
        </FormSubsection>
      </FormSection>
      <FormSection
        title="Do you have a previous Social Security card?"
        description="Or, have you ever filed for a Social Security number in the past?"
      >
        <YesNoField
          name="hasPreviousSocialSecurityCard"
          label="Have you ever filed for or received a Social Security number card before?"
          labelHidden
          yesLabel="Yes, I have a previous Social Security card or have applied for one"
          noLabel="No, I have never filed for or received a Social Security card before"
        />
        {form.watch("hasPreviousSocialSecurityCard") === true && (
          <FormSubsection title="What is the name shown on your most recent Social Security card?">
            <NameField type="previousSocialSecurityCardName" />
          </FormSubsection>
        )}
      </FormSection>
      <FormSection title="What is your phone number?">
        <PhoneField name="phoneNumber" />
      </FormSection>
      <FormSection title="What is your mailing address?">
        <AddressField type="mailing" />
      </FormSection>
      <FormSection title="Are you filing this form for someone else?">
        <YesNoField
          name="isFilingForSomeoneElse"
          label="Are you filing this form for someone else?"
          yesLabel="Yes, I am filing this for someone else"
          noLabel="No, I am filing this for myself"
        />
        {form.watch("isFilingForSomeoneElse") === true && (
          <FormSubsection title="What is your relationship to the person you are filing for?">
            <RadioGroupField
              name="relationshipToFilingFor"
              label="Relationship"
              labelHidden
              options={[
                { label: "Natural or Adoptive Parent", value: "parent" },
                { label: "Legal Guardian", value: "legalGuardian" },
                { label: "Other", value: "other" },
              ]}
            />
            {form.watch("relationshipToFilingFor") === "other" && (
              <ShortTextField
                name="relationshipToFilingForOther"
                label="Specify relationship"
              />
            )}
          </FormSubsection>
        )}
      </FormSection>
      <Button
        type="submit"
        size="large"
        variant="primary"
        isSubmitting={isSubmitting}
      >
        Download and Save
      </Button>
    </FormContainer>
  );
}
