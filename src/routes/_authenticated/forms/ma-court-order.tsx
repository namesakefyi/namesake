import { Banner, Button } from "@/components/common";
import {
  AddressField,
  CheckboxField,
  EmailField,
  FormContainer,
  FormSection,
  FormSubsection,
  LanguageSelectField,
  LongTextField,
  MemorableDateField,
  NameField,
  PhoneField,
  PronounSelectField,
  SelectField,
  ShortTextField,
  YesNoField,
} from "@/components/forms";
import { useForm } from "@/utils/useForm";
import {
  type FieldType,
  JURISDICTIONS,
  type UserFormDataField,
} from "@convex/constants";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/forms/ma-court-order")({
  component: RouteComponent,
});

const FORM_FIELDS: UserFormDataField[] = [
  "newFirstName",
  "newMiddleName",
  "newLastName",
  "oldFirstName",
  "oldMiddleName",
  "oldLastName",
  "reasonForChangingName",
  "phoneNumber",
  "email",
  "dateOfBirth",
  "isCurrentlyUnhoused",
  "residenceStreetAddress",
  "residenceCity",
  "residenceState",
  "residenceZipCode",
  "isMailingAddressDifferentFromResidence",
  "mailingStreetAddress",
  "mailingCity",
  "mailingState",
  "mailingZipCode",
  "hasPreviousNameChange",
  "previousLegalNames",
  "isInterpreterNeeded",
  "language",
  "isOkayToSharePronouns",
  "pronouns",
  "otherPronouns",
  "shouldReturnOriginalDocuments",
  "shouldWaivePublicationRequirement",
  "shouldImpoundCourtRecords",
  "shouldApplyForFeeWaiver",
] as const;

type FormData = {
  [K in UserFormDataField]: FieldType<K>;
};

function RouteComponent() {
  const { onSubmit, isSubmitting, ...form } = useForm<FormData>(FORM_FIELDS);

  return (
    <FormContainer
      title="Massachusetts Court Order"
      form={form}
      onSubmit={onSubmit}
    >
      <FormSection
        title="What is your new name?"
        description="This is the name you're making official! Type it exactly as you want it to appear."
      >
        <NameField type="newName" />
      </FormSection>
      <FormSection
        title="What is your current legal name?"
        description="This is the name you're leaving behind. Type it exactly as it appears on your ID."
      >
        <NameField type="oldName" />
      </FormSection>
      <FormSection title="What is the reason you're changing your name?">
        <LongTextField
          name="reasonForChangingName"
          label="Reason for name change"
        />
      </FormSection>
      <FormSection
        title="What is your contact information?"
        description="The court uses this to communicate with you about your status."
        className="@container"
      >
        <div className="grid grid-cols-1 @lg:grid-cols-[auto_1fr] gap-4">
          <PhoneField name="phoneNumber" />
          <EmailField name="email" />
        </div>
      </FormSection>
      <FormSection title="Where were you born?">
        <div className="grid grid-cols-[1fr_auto] gap-4">
          <ShortTextField name="birthplaceCity" label="City" />
          <SelectField
            name="birthplaceState"
            label="State"
            placeholder="Select a state"
            options={Object.entries(JURISDICTIONS).map(([value, label]) => ({
              label,
              value,
            }))}
          />
        </div>
      </FormSection>
      <FormSection title="What is your date of birth?">
        <MemorableDateField name="dateOfBirth" label="Date of birth" />
      </FormSection>
      <FormSection
        title="What is your residential address?"
        description="You must reside in the same county where you file your name change. We'll help you find where to file."
      >
        <CheckboxField
          name="isCurrentlyUnhoused"
          label="I am currently unhoused or without permanent housing"
        />
        {!form.watch("isCurrentlyUnhoused") === true && (
          <>
            <AddressField type="residence" />
            <CheckboxField
              name="isMailingAddressDifferentFromResidence"
              label="I use a different mailing address"
            />
          </>
        )}
        <FormSubsection
          title="What is your mailing address?"
          isVisible={
            form.watch("isMailingAddressDifferentFromResidence") === true
          }
        >
          <AddressField type="mailing" />
        </FormSubsection>
      </FormSection>
      <FormSection title="Have you legally changed your name before?">
        <YesNoField
          name="hasPreviousNameChange"
          label="Have you ever changed your name before?"
          labelHidden
          yesLabel="Yes, I've changed my name"
          noLabel="No, I've never changed my name"
        />
        <FormSubsection
          title="Please list your past legal name."
          isVisible={form.watch("hasPreviousNameChange") === true}
        >
          <div className="grid grid-cols-2 gap-4">
            <ShortTextField name="previousNameFrom" label="From" />
            <ShortTextField name="previousNameTo" label="To" />
          </div>
          <LongTextField name="previousNameReason" label="Reason for change" />
        </FormSubsection>
      </FormSection>
      <FormSection
        title="Have you ever used any other name or alias?"
        description="This includes any names that you have used over a long period of time but did not change legally. This does not include nicknames or other names you've used for short periods of time."
      >
        <YesNoField
          name="hasUsedOtherNameOrAlias"
          label="Have you ever used any other name or alias?"
          labelHidden
          yesLabel="Yes, I've used other names"
          noLabel="No, there are no other major names I've used"
        />
        <FormSubsection
          title="Please list all names you haven't previously listed."
          isVisible={form.watch("hasUsedOtherNameOrAlias") === true}
        >
          <LongTextField
            name="otherNamesOrAliases"
            label="Other names or aliases"
          />
        </FormSubsection>
      </FormSection>
      <FormSection
        title="If there is a hearing for your name change, do you need an interpreter?"
        description="In most cases, a hearing is not required."
      >
        <YesNoField
          name="isInterpreterNeeded"
          label="If there is a hearing for your name change, do you need an interpreter?"
          labelHidden
          yesLabel="Yes, I need an interpreter"
          noLabel="No, I don't need an interpreter"
        />
        <FormSubsection isVisible={form.watch("isInterpreterNeeded") === true}>
          <LanguageSelectField name="language" />
        </FormSubsection>
      </FormSection>
      <FormSection title="Do you want to share your pronouns with the court staff?">
        <YesNoField
          name="isOkayToSharePronouns"
          label="Share my pronouns with the court staff?"
          labelHidden
        />
        <FormSubsection
          isVisible={form.watch("isOkayToSharePronouns") === true}
        >
          <PronounSelectField />
        </FormSubsection>
      </FormSection>
      <FormSection
        title="Do you want your original documents returned afterwards?"
        description="The court will return your birth certificate and any other documents you provided."
      >
        <YesNoField
          name="shouldReturnOriginalDocuments"
          label="Return original documents?"
          labelHidden
          yesLabel="Yes, return my documents"
          noLabel="No, I don't need my documents returned"
        />
        {form.watch("shouldReturnOriginalDocuments") === false && (
          <Banner variant="warning" size="large">
            We strongly recommend getting your original documents back from the
            court.
          </Banner>
        )}
      </FormSection>
      <FormSection
        title="Would you like to waive the newspaper publication requirement?"
        description="The legal name change process requires publication in a newspaper. However, we can help you file a motion to waive this requirement."
      >
        <YesNoField
          name="shouldWaivePublicationRequirement"
          label="Waive the publication requirement?"
          labelHidden
          yesLabel="Yes, apply to waive the publication requirement"
          noLabel="No, I will publish my name change in a newspaper"
        />
      </FormSection>
      <FormSection
        title="Would you like to impound your case?"
        description="All court actions are public record by default. However, you can apply to impound your case to keep it private."
      >
        <YesNoField
          name="shouldImpoundCourtRecords"
          label="Impound my case?"
          labelHidden
          yesLabel="Yes, apply to impound my case and keep my name change private"
          noLabel="No, it's okay for my case to be public"
        />
      </FormSection>
      <FormSection
        title="Do you need to apply for a fee waiver?"
        description="If you are unable to pay the filing fee, you can file an affidavit of indigency—a document proving that you are unable to pay. You will need to provide proof of income."
      >
        <YesNoField
          name="shouldApplyForFeeWaiver"
          label="Apply for a fee waiver?"
          labelHidden
          yesLabel="Yes, I am unable to pay the filing fees"
          noLabel="No, I can pay the filing fee"
        />
      </FormSection>
      <FormSection
        title="What is your mother's maiden name?"
        description="The court requests this information in order to look up past court records and verify your identity. The maiden name is the last name or family name of your mother or guardian before marriage."
      >
        <ShortTextField name="mothersMaidenName" label="Mother's maiden name" />
      </FormSection>
      <Button
        type="submit"
        size="large"
        variant="primary"
        isSubmitting={isSubmitting}
      >
        {isSubmitting ? "Submitting…" : "Submit"}
      </Button>
    </FormContainer>
  );
}
