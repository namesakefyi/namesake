import { Banner } from "@/components/common";
import {
  AddressField,
  CheckboxField,
  EmailField,
  FormContainer,
  FormSection,
  LanguageSelectField,
  LongTextField,
  NameField,
  PhoneField,
  PronounSelectField,
} from "@/components/forms";
import { YesNoField } from "@/components/forms/YesNoField/YesNoField";
import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/forms/court-order/ma")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <FormContainer>
      <FormSection
        title="Let's get started."
        description="The questions below are used to fill out the necessary forms to file your name change."
      >
        <Banner variant="info" icon={Lock} size="large">
          Namesake takes your privacy seriously. All responses are end-to-end
          encrypted. That means no one—not even Namesake!—can see your answers.
        </Banner>
      </FormSection>
      <FormSection
        title="What is your new name?"
        description="This is the name you're making official! Type it exactly as you want it to appear."
      >
        <NameField />
      </FormSection>
      <FormSection
        title="What is your current legal name?"
        description="This is the name you're leaving behind. Type it exactly as it appears on your ID."
      >
        <NameField />
      </FormSection>
      <FormSection title="What is the reason you're changing your name?">
        <LongTextField name="reason" label="Reason for name change" />
      </FormSection>
      <FormSection
        title="What is your contact information?"
        description="The court uses this to communicate with you about your status."
        className="@container"
      >
        <div className="grid grid-cols-1 @-lg:grid-cols-[auto_1fr] @lg:grid- gap-4">
          <PhoneField />
          <EmailField />
        </div>
      </FormSection>
      <FormSection title="Are you currently unhoused or without permanent housing?">
        <YesNoField
          name="unhoused"
          label="Are you currently unhoused or without permanent housing?"
          noLabel="No, I have a Massachusetts residential address"
          labelHidden
        />
      </FormSection>
      <FormSection
        title="What is your residential address?"
        description="You must reside in the same county where you file your name change. We'll help you find where to file."
      >
        {/* TODO: Make Massachusetts state always selected */}
        <AddressField />
        <CheckboxField
          name="differentMailingAddress"
          label="I use a different mailing address"
        />
      </FormSection>
      {/* TODO: Make conditional */}
      <FormSection title="What is your mailing address?">
        <AddressField />
      </FormSection>
      <FormSection title="Have you legally changed your name before?">
        <YesNoField
          name="nameChangeBefore"
          label="Have you ever changed your name before?"
          labelHidden
          yesLabel="Yes, I've changed my name"
          noLabel="No, I've never changed my name"
        />
      </FormSection>
      <FormSection title="Please list all past legal names.">
        <LongTextField name="pastNames" label="Past legal names" />
      </FormSection>
      <FormSection
        title="If there is a hearing for your name change, do you need an interpreter?"
        description="In most cases, a hearing is not required."
      >
        <YesNoField
          name="interpreter"
          label="If there is a hearing for your name change, do you need an interpreter?"
          labelHidden
          yesLabel="I need an interpreter"
          noLabel="I don't need an interpreter"
        />
        {/* TODO: Make conditional */}
        <LanguageSelectField />
      </FormSection>
      <FormSection title="Do you want to share your pronouns with the court staff?">
        <YesNoField
          name="sharePronouns"
          label="Share my pronouns with the court staff?"
          labelHidden
        />
        <PronounSelectField />
      </FormSection>
      <FormSection
        title="Do you want your original documents returned afterwards?"
        description="The court will return your birth certificate and any other documents you provided."
      >
        <YesNoField
          name="returnMyDocuments"
          label="Return original documents?"
          labelHidden
          yesLabel="Yes, return my documents"
          noLabel="No, I don't need my documents returned"
        />
      </FormSection>
    </FormContainer>
  );
}
