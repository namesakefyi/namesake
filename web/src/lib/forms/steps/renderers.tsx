import type { ComponentType, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import Markdown from "react-markdown";
import { Banner } from "#components/common/Banner";
import { TextField } from "#components/common/TextField";
import { AddressField } from "#components/forms/AddressField";
import { CheckboxField } from "#components/forms/CheckboxField";
import { CheckboxGroupField } from "#components/forms/CheckboxGroupField";
import { ComboBoxField } from "#components/forms/ComboBoxField";
import { EmailField } from "#components/forms/EmailField";
import { FormSubsection } from "#components/forms/FormStep";
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
import {
  DONT_KNOW,
  type FieldName,
  type FormData,
  PREFER_NOT_TO_ANSWER,
} from "#constants/fields";
import { resolveText } from "../resolveStepContent";
import { COMBO_BOX_SOURCES } from "./comboBoxSources";
import { toChoices } from "./options";
import type {
  BlockKind,
  BlockNode,
  Data,
  FieldKind,
  FieldNode,
  ListFieldName,
  NodeKind,
} from "./types";

/** What a field renderer receives: its node and the resolved label. */
export interface FieldRendererProps<K extends FieldKind> {
  node: FieldNode<K>;
  label: string;
  labelHidden: boolean;
}

/** What a block renderer receives: its node, the live answers, children. */
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

/** The props every single-field component takes from its node. */
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

/** Radio and checkbox groups render the same way with different components. */
function choiceGroup<K extends "field.radioGroup" | "field.checkboxGroup">(
  Group: typeof RadioGroupField | typeof CheckboxGroupField,
) {
  return (props: FieldRendererProps<K>) => (
    <Group
      {...fieldProps(props)}
      options={toChoices(props.node.props.options)}
      includePreferNotToAnswer={props.node.props.allow?.includes(
        PREFER_NOT_TO_ANSWER,
      )}
    />
  );
}

/**
 * The component each node kind renders with, keyed by builder name. Each
 * renderer's `displayName` is its key. Changing an entry changes that node
 * kind in every form.
 */
export const renderers: {
  [K in NodeKind]: ComponentType<RendererProps<K>>;
} = {
  "field.shortText": (props) => (
    <ShortTextField {...fieldProps(props)} size={props.node.props.size} />
  ),
  "field.longText": (props) => <LongTextField {...fieldProps(props)} />,
  "field.number": (props) => {
    const { min, currency, defaultValue } = props.node.props;
    return (
      <NumberField
        {...fieldProps(props)}
        minValue={min}
        defaultValue={defaultValue}
        formatOptions={
          currency && {
            style: "currency",
            currency: "USD",
            ...(currency === "dollars" && { maximumFractionDigits: 0 }),
          }
        }
      />
    );
  },
  "field.memorableDate": (props) => (
    <MemorableDateField {...fieldProps(props)} />
  ),
  "field.checkbox": (props) => {
    const { name, label } = fieldProps(props);
    return <CheckboxField name={name} label={label} />;
  },
  "field.yesNo": (props) => (
    <YesNoField
      {...fieldProps(props)}
      yesLabel={props.node.props.yesLabel}
      noLabel={props.node.props.noLabel}
      includePreferNotToAnswer={props.node.props.allow?.includes(
        PREFER_NOT_TO_ANSWER,
      )}
      includeDontKnow={props.node.props.allow?.includes(DONT_KNOW)}
    />
  ),
  "field.radioGroup": choiceGroup(RadioGroupField),
  "field.checkboxGroup": choiceGroup(CheckboxGroupField),
  "field.comboBox": (props) => (
    <ComboBoxField
      {...fieldProps(props)}
      placeholder={props.node.props.placeholder}
      options={COMBO_BOX_SOURCES[props.node.props.source]}
    />
  ),
  "field.phone": (props) => {
    const { name, label } = fieldProps(props);
    return <PhoneField name={name} label={label} />;
  },
  "field.email": (props) => {
    const { name, label } = fieldProps(props);
    return <EmailField name={name} label={label} />;
  },
  "field.languageSelect": (props) => (
    <LanguageSelectField name={fieldProps(props).name} />
  ),
  "field.name": ({ node }) => <NameField type={node.props.type} />,
  "field.address": ({ node }) => (
    <AddressField
      type={node.props.type}
      includeAddress2={node.props.address2}
      includeCounty={node.props.county}
    />
  ),
  "field.pronounSelect": () => <PronounSelectField />,
  "field.repeatingEntry": (props) => {
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
  "block.banner": ({ node, data }) => (
    <Banner variant={node.variant}>
      <Markdown>{resolveText(node.content, data)}</Markdown>
    </Banner>
  ),
  "block.subsection": ({ node, data, children }) => (
    <FormSubsection
      title={node.title ? resolveText(node.title, data) : undefined}
    >
      {children}
    </FormSubsection>
  ),
  "block.note": ({ node, data }) => (
    <p className="form-step-note">{resolveText(node.content, data)}</p>
  ),
  "block.display": ({ node }) => {
    const Display = node.component;
    return <Display {...node.props} />;
  },
  "block.custom": ({ node }) => {
    const form = useFormContext<FormData>();
    const Render = node.render;
    return <Render form={form} writes={node.writes} />;
  },
};

for (const [kind, renderer] of Object.entries(renderers)) {
  renderer.displayName = kind;
}
