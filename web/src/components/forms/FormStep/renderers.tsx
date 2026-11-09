import type { ComponentType, ReactNode } from "react";
import { Banner } from "#components/common/Banner";
import { TextField } from "#components/common/TextField";
import { AddressField } from "#components/forms/AddressField";
import { CheckboxField } from "#components/forms/CheckboxField";
import { CheckboxGroupField } from "#components/forms/CheckboxGroupField";
import { ComboBoxField } from "#components/forms/ComboBoxField";
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
import { COMBO_BOX_SOURCES } from "#constants/comboBoxSources";
import type { FieldName } from "#constants/fields";
import { resolveText } from "#lib/forms/resolveStepContent";
import type {
  BlockKind,
  BlockNode,
  Data,
  FieldKind,
  FieldNode,
  ListFieldName,
  NodeKind,
  OptionLabels,
} from "#lib/forms/types";
import { FormSubsection } from "./FormSubsection";
import { MarkdownText } from "./MarkdownText";

export interface FieldRendererProps<K extends FieldKind> {
  node: FieldNode<K>;
  label: string;
  labelHidden: boolean;
}

export interface BlockRendererProps<K extends BlockKind> {
  node: Extract<BlockNode, { kind: K }>;
  data: Data;
  children?: ReactNode;
}

export type RendererProps<K extends NodeKind> = K extends FieldKind
  ? FieldRendererProps<K>
  : K extends BlockKind
    ? BlockRendererProps<K>
    : never;

/** US dollars, with cents only when entered. */
const CURRENCY_FORMAT: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
};

function fieldProps({
  node,
  label,
  labelHidden,
}: FieldRendererProps<FieldKind>) {
  if (!node.name) throw new Error(`${node.kind} writes no single field`);
  return {
    name: node.name as FieldName,
    label,
    labelHidden,
    description: node.description,
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
  return (props: FieldRendererProps<K>) => (
    <Group
      {...fieldProps(props)}
      options={toChoices(props.node.props.options)}
      extraChoices={props.node.props.extraChoices}
    />
  );
}

export const renderers: {
  [K in NodeKind]: ComponentType<RendererProps<K>>;
} = {
  shortText: (props) => (
    <ShortTextField {...fieldProps(props)} size={props.node.props.size} />
  ),
  longText: (props) => <LongTextField {...fieldProps(props)} />,
  number: (props) => {
    const { min, currency, defaultValue } = props.node.props;
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
      yesLabel={props.node.props.yesLabel}
      noLabel={props.node.props.noLabel}
      extraChoices={props.node.props.extraChoices}
    />
  ),
  radioGroup: choiceGroup(RadioGroupField),
  checkboxGroup: choiceGroup(CheckboxGroupField),
  comboBox: (props) => (
    <ComboBoxField
      {...fieldProps(props)}
      placeholder={props.node.props.placeholder}
      options={COMBO_BOX_SOURCES[props.node.props.source]}
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
  name: ({ node }) => <NameField type={node.props.type} />,
  address: ({ node }) => (
    <AddressField
      type={node.props.type}
      includeAddress2={node.props.address2}
      includeCounty={node.props.county}
    />
  ),
  pronounSelect: () => <PronounSelectField />,
  repeatingEntry: (props) => {
    const { min, max, itemLabel, size } = props.node.props;
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
  banner: ({ node, data }) => (
    <Banner variant={node.variant}>
      <MarkdownText text={resolveText(node.content, data)} />
    </Banner>
  ),
  subsection: ({ node, data, children }) => (
    <FormSubsection
      title={typeof node.title === "function" ? node.title(data) : node.title}
    >
      {children}
    </FormSubsection>
  ),
  display: ({ node }) => {
    const Display = node.component;
    return <Display {...node.props} />;
  },
};

for (const [kind, renderer] of Object.entries(renderers)) {
  renderer.displayName = `node.${kind}`;
}
