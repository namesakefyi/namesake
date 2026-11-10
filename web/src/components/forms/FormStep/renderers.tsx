import type { ComponentType, ReactNode } from "react";
import { Banner } from "#components/common/Banner";
import { TextField } from "#components/common/TextField";
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
import { RepeatingEntry } from "#components/forms/RepeatingEntry";
import { ShortTextField } from "#components/forms/ShortTextField";
import { YesNoField } from "#components/forms/YesNoField";
import type { FieldName, ListFieldName } from "#constants/fields";
import type {
  BlockQuestion,
  Data,
  FieldKind,
  FieldQuestion,
  OptionLabels,
  QuestionKind,
} from "#lib/forms/questions";
import { resolveText } from "#lib/forms/resolveStepContent";
import { useFormStep } from "../FormContainer/FormStepContext";
import { FormSubsection } from "./FormSubsection";
import { MarkdownText } from "./MarkdownText";

export type QuestionOfKind<K extends QuestionKind> = K extends FieldKind
  ? FieldQuestion<K>
  : Extract<BlockQuestion, { kind: K }>;

/** Every renderer gets the same props; blocks ignore the label. */
export interface RendererProps<K extends QuestionKind> {
  question: QuestionOfKind<K>;
  data: Data;
  label: string;
  labelHidden: boolean;
  children?: ReactNode;
}

/** US dollars, with cents only when entered. */
const CURRENCY_FORMAT: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
};

function fieldProps({
  question,
  label,
  labelHidden,
}: Omit<RendererProps<FieldKind>, "question"> & { question: FieldQuestion }) {
  if (!question.name)
    throw new Error(`${question.kind} writes no single field`);
  return {
    name: question.name as FieldName,
    label,
    labelHidden,
    description: question.description,
  };
}

function toChoices(options: OptionLabels) {
  return Object.entries(options).map(([value, option]) =>
    typeof option === "string"
      ? { value, label: option }
      : { value, label: option.label, description: option.description },
  );
}

function choiceGroup<K extends "radioGroup" | "checkboxGroup">(
  Group: typeof RadioGroupField | typeof CheckboxGroupField,
) {
  return (props: RendererProps<K>) => (
    <Group
      {...fieldProps(props)}
      options={toChoices(props.question.props.options)}
    />
  );
}

export const renderers: {
  [K in QuestionKind]: ComponentType<RendererProps<K>>;
} = {
  shortText: (props) => (
    <ShortTextField {...fieldProps(props)} size={props.question.props.size} />
  ),
  longText: (props) => <LongTextField {...fieldProps(props)} />,
  number: (props) => {
    const { min, currency, defaultValue } = props.question.props;
    return (
      <NumberField
        {...fieldProps(props)}
        minValue={min}
        defaultValue={defaultValue}
        formatOptions={currency ? CURRENCY_FORMAT : undefined}
      />
    );
  },
  memorableDate: (props) => <MemorableDateField {...fieldProps(props)} />,
  checkbox: (props) => {
    const { name, label } = fieldProps(props);
    return <CheckboxField name={name} label={label} />;
  },
  yesNo: (props) => (
    <YesNoField
      {...fieldProps(props)}
      yesLabel={props.question.props.yesLabel}
      noLabel={props.question.props.noLabel}
      extraChoices={props.question.props.extraChoices}
    />
  ),
  radioGroup: choiceGroup(RadioGroupField),
  checkboxGroup: choiceGroup(CheckboxGroupField),
  comboBox: (props) => (
    <ComboBoxField
      {...fieldProps(props)}
      placeholder={props.question.props.placeholder}
      options={props.question.props.options}
    />
  ),
  phone: (props) => {
    const { name, label, description } = fieldProps(props);
    return <PhoneField name={name} label={label} description={description} />;
  },
  email: (props) => {
    const { name, label, description } = fieldProps(props);
    return <EmailField name={name} label={label} description={description} />;
  },
  languageSelect: (props) => (
    <LanguageSelectField name={fieldProps(props).name} />
  ),
  name: ({ question }) => <NameField type={question.props.type} />,
  address: ({ question }) => (
    <AddressField
      type={question.props.type}
      includeAddress2={question.props.address2}
      includeCounty={question.props.county}
    />
  ),
  pronounSelect: () => <PronounSelectField />,
  repeatingEntry: (props) => {
    const { min, max, itemLabel, size } = props.question.props;
    return (
      <RepeatingEntry
        name={fieldProps(props).name as ListFieldName}
        min={min}
        max={max}
        defaultCount={Math.max(min, 1)}
      >
        {(value, onChange, index) => (
          <TextField
            value={value}
            onChange={onChange}
            label={`${itemLabel} ${index + 1}`}
            size={size}
          />
        )}
      </RepeatingEntry>
    );
  },
  banner: ({ question, data }) => (
    <Banner variant={question.variant}>
      <MarkdownText text={resolveText(question.content, data)} />
    </Banner>
  ),
  costsTable: () => <CostsTable costs={useFormStep().costs} />,
  subsection: ({ question, data, children }) => (
    <FormSubsection title={resolveText(question.title, data)}>
      {children}
    </FormSubsection>
  ),
  display: ({ question }) => {
    const Display = question.component;
    return <Display {...question.props} />;
  },
};

for (const [kind, renderer] of Object.entries(renderers)) {
  renderer.displayName = `q.${kind}`;
}
