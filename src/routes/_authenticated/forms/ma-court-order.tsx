import { Banner, Button } from "@/components/common";
import {
  AddressField,
  CheckboxField,
  ComboBoxField,
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
  ShortTextField,
  YesNoField,
} from "@/components/forms";
import { QuestCostsTable } from "@/components/quests";
import { BIRTHPLACES, type FieldName, type FieldType } from "@/constants";
import affidavitOfIndigency from "@/forms/ma/affidavit-of-indigency";
import cjd400MotionToImpound from "@/forms/ma/cjd400-motion-to-impound";
import cjd400MotionToWaivePublication from "@/forms/ma/cjd400-motion-to-waive-publication";
import cjp27PetitionToChangeNameOfAdult from "@/forms/ma/cjp27-petition-to-change-name-of-adult";
import cjp34CoriAndWmsReleaseRequest from "@/forms/ma/cjp34-cori-and-wms-release-request";
import { downloadMergedPdf } from "@/forms/utils";
import { useForm } from "@/hooks/useForm";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import type { FormEvent } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/forms/ma-court-order")({
  component: RouteComponent,
});

const FORM_FIELDS: FieldName[] = [
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
  "birthplaceCity",
  "birthplaceState",
  "isCurrentlyUnhoused",
  "residenceStreetAddress",
  "residenceCity",
  "residenceState",
  "residenceZipCode",
  "residenceCounty",
  "isMailingAddressDifferentFromResidence",
  "mailingStreetAddress",
  "mailingCity",
  "mailingState",
  "mailingZipCode",
  "hasPreviousNameChange",
  "previousLegalNames",
  "hasUsedOtherNameOrAlias",
  "otherNamesOrAliases",
  "isInterpreterNeeded",
  "language",
  "isOkayToSharePronouns",
  "pronouns",
  "otherPronouns",
  "shouldReturnOriginalDocuments",
  "shouldWaivePublicationRequirement",
  "reasonToWaivePublication",
  "shouldImpoundCourtRecords",
  "shouldApplyForFeeWaiver",
  "mothersMaidenName",
] as const;

type FormData = {
  [K in (typeof FORM_FIELDS)[number]]: FieldType<K>;
};

function RouteComponent() {
  const { onSubmit, isSubmitting, ...form } = useForm<FormData>(FORM_FIELDS);
  const saveDocuments = useMutation(api.userDocuments.set);
  const quest = useQuery(api.quests.getBySlug, {
    slug: "court-order-ma",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const pdfs = [
        cjp27PetitionToChangeNameOfAdult,
        cjp34CoriAndWmsReleaseRequest,
      ];

      if (form.watch("shouldWaivePublicationRequirement") === true) {
        pdfs.push(cjd400MotionToWaivePublication);
      }

      if (form.watch("shouldImpoundCourtRecords") === true) {
        pdfs.push(cjd400MotionToImpound);
      }

      if (form.watch("shouldApplyForFeeWaiver") === true) {
        pdfs.push(affidavitOfIndigency);
      }

      await downloadMergedPdf({
        title: "Massachusetts Court Order",
        instructions: [
          "Do not sign the Petition to Change Name (CJP 27) until in the presence of a notary.",
          "Review all documents carefully.",
          "File with the Probate and Family Court in your county.",
          form.watch("shouldApplyForFeeWaiver") === true
            ? "Complete the Affidavit of Indigency on your own."
            : "To pay for filing, bring a credit or debit card, a check made payable to the Commonwealth of Massachusetts, or exact cash.",
          "Remember to bring all supporting documents to the court.",
        ],
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
      title="Court Order: Adult Name Change"
      jurisdiction="MA"
      form={form}
      onSubmit={handleSubmit}
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
        <Banner size="large">
          <p>
            <strong>What do I write?</strong> Provide a basic reason—no need to
            go into detail. Examples:
          </p>
          <ul>
            <li>
              &ldquo;I want a name which aligns with my gender identity.&rdquo;
            </li>
            <li>&ldquo;This is the name everyone knows me by.&rdquo;</li>
            <li>
              &ldquo;This is my preferred name and I wish to obtain proper
              documentation.&rdquo;
            </li>
            <li>&ldquo;I am transgender.&rdquo;</li>
          </ul>
        </Banner>
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
        <div className="flex flex-wrap gap-4">
          <ShortTextField name="birthplaceCity" label="City" />
          <ComboBoxField
            name="birthplaceState"
            label="State"
            placeholder="Select a state"
            options={Object.entries(BIRTHPLACES).map(([value, label]) => ({
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
            <AddressField type="residence" includeCounty />
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
      <FormSection title="Do you want your original documents returned afterwards?">
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
        <FormSubsection
          isVisible={form.watch("shouldWaivePublicationRequirement") === true}
        >
          <LongTextField
            name="reasonToWaivePublication"
            label="Reason to waive publication"
            description='Ask for a waiver of publication for your name change and state a "good cause" for it.'
            inputClassName="min-h-32"
          />
          <Banner size="large">
            <p>
              <strong>What do I write?</strong> The court is looking for a legal
              basis to exempt you from the newspaper publishing requirement.
              Recommendations:
            </p>
            <ul>
              <li>
                Note how publishing could pose a threat to your privacy or
                safety.
              </li>
              <li>Be as specific to your personal situation as possible.</li>
              <li>
                Explain that you are not changing your name for an impermissible
                reason, such as evasion of debts or criminal liabilities.
              </li>
              <li>
                If you are not changing your last name, explicitly mention that
                "I am not changing my last name" in the motion. (You can still
                file this form if you are changing your name in its entirety.)
              </li>
            </ul>
          </Banner>
        </FormSubsection>
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
        <FormSubsection
          isVisible={form.watch("shouldImpoundCourtRecords") === true}
        >
          <LongTextField
            name="reasonToImpoundCourtRecords"
            label="Reason to impound"
            description="Explain why you want to keep your case private."
            inputClassName="min-h-32"
          />
          <Banner size="large">
            <p>
              <strong>What do I write?</strong> The court is looking for a legal
              basis to <em>impound</em> (make private) these court records.
              Recommendations:
            </p>
            <ul>
              <li>
                Note how publishing could pose a threat to your privacy or
                safety.
              </li>
              <li>Be as specific to your personal situation as possible.</li>
              <li>
                Note increased rates of violence toward transgender and gender
                non-conforming people.
              </li>
            </ul>
          </Banner>
        </FormSubsection>
      </FormSection>
      <FormSection
        title="Do you need to apply for a fee waiver?"
        description="If you are unable to pay the filing fee, you can file an Affidavit of Indigency—a document proving that you are unable to pay."
      >
        <YesNoField
          name="shouldApplyForFeeWaiver"
          label="Apply for a fee waiver?"
          labelHidden
          yesLabel="Yes, help me waive filing fees"
          noLabel="No, I will pay the filing fee"
        />
        {form.watch("shouldApplyForFeeWaiver") !== true ? (
          <QuestCostsTable costs={quest?.costs} card />
        ) : (
          <Banner size="large">
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
        )}
      </FormSection>
      <FormSection
        title="What is your mother's maiden name?"
        description="The court requests this information in order to look up past court records and verify your identity. The maiden name is the last name (or family name) of your mother (or guardian) before marriage."
      >
        <ShortTextField name="mothersMaidenName" label="Mother's maiden name" />
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
