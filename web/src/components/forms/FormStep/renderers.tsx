import type { Attributes, ComponentType, ReactNode } from "react";
import { Banner } from "#components/common/Banner";
import { AddressField } from "#components/forms/AddressField";
import { CheckboxField } from "#components/forms/CheckboxField";
import { CheckboxGroupField } from "#components/forms/CheckboxGroupField";
import { ComboBoxField } from "#components/forms/ComboBoxField";
import { CostsTable } from "#components/forms/CostsTable";
import { EmailField } from "#components/forms/EmailField";
import { LanguageSelectField } from "#components/forms/LanguageSelectField";
import { LongTextField } from "#components/forms/LongTextField";
import { MemorableDateField } from "#components/forms/MemorableDateField";
import { NameField } from "#components/forms/NameField";
import { NumberField } from "#components/forms/NumberField";
import { PhoneField } from "#components/forms/PhoneField";
import { PronounSelectField } from "#components/forms/PronounSelectField";
import { RadioGroupField } from "#components/forms/RadioGroupField";
import { RepeatingEntryField } from "#components/forms/RepeatingEntry";
import { ShortTextField } from "#components/forms/ShortTextField";
import { YesNoField } from "#components/forms/YesNoField";
import type {
  BlockKind,
  BlockPropsByKind,
  FieldKind,
  FieldPropsByKind,
  FormData,
} from "#lib/forms/questions";
import { resolveText } from "#lib/forms/resolveStepContent";
import { useFormStep } from "../FormContainer/FormStepContext";
import { FormSubsection } from "./FormSubsection";
import { MarkdownText } from "./MarkdownText";

export interface FieldRenderProps extends Attributes {
  label: string;
  labelHidden: boolean;
}

export interface BlockRenderProps extends Attributes {
  data: FormData;
  children?: ReactNode;
}

const fields: {
  [K in FieldKind]: ComponentType<FieldRenderProps & FieldPropsByKind[K]>;
} = {
  shortText: ShortTextField,
  longText: LongTextField,
  number: NumberField,
  memorableDate: MemorableDateField,
  checkbox: CheckboxField,
  yesNo: YesNoField,
  radioGroup: RadioGroupField,
  checkboxGroup: CheckboxGroupField,
  comboBox: ComboBoxField,
  phone: PhoneField,
  email: EmailField,
  languageSelect: LanguageSelectField,
  name: NameField,
  address: AddressField,
  pronounSelect: PronounSelectField,
  repeatingEntry: RepeatingEntryField,
};

const blocks: {
  [K in BlockKind]: ComponentType<BlockRenderProps & BlockPropsByKind[K]>;
} = {
  banner: ({ content, variant, data }) => (
    <Banner variant={variant}>
      <MarkdownText text={resolveText(content, data)} />
    </Banner>
  ),
  subsection: ({ title, data, children }) => (
    <FormSubsection title={resolveText(title, data)}>{children}</FormSubsection>
  ),
  costsTable: () => <CostsTable costs={useFormStep().costs} />,
  display: ({ component: Display, props }) => <Display {...props} />,
};

export function renderField<K extends FieldKind>(
  question: { kind: K; props: FieldPropsByKind[K] },
  renderProps: FieldRenderProps,
) {
  const Field: ComponentType<FieldRenderProps & FieldPropsByKind[K]> =
    fields[question.kind];
  return <Field {...renderProps} {...question.props} />;
}

export function renderBlock<K extends BlockKind>(
  question: { kind: K; props: BlockPropsByKind[K] },
  renderProps: BlockRenderProps,
) {
  const Block: ComponentType<BlockRenderProps & BlockPropsByKind[K]> =
    blocks[question.kind];
  return <Block {...renderProps} {...question.props} />;
}
