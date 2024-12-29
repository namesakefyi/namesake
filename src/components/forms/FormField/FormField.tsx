import {
  AddressField,
  CheckboxGroupField,
  EmailField,
  LongTextField,
  MemorableDateField,
  NameField,
  RadioGroupField,
  ShortTextField,
} from "@/components/forms";
import type { Doc } from "@convex/_generated/dataModel";
import type { FormField as FormFieldType } from "@convex/constants";

type FieldComponent = React.ComponentType<any>;

const FIELD_COMPONENTS: Record<FormFieldType, FieldComponent> = {
  address: AddressField,
  shortText: ShortTextField,
  longText: LongTextField,
  email: EmailField,
  checkboxGroup: CheckboxGroupField,
  radioGroup: RadioGroupField,
  memorableDate: MemorableDateField,
  name: NameField,
};

interface FormFieldProps {
  field: Doc<"formFields">;
}

export const FormField: React.FC<FormFieldProps> = ({ field }) => {
  const FieldComponent = FIELD_COMPONENTS[field.type as FormFieldType];

  if (!FieldComponent) {
    console.warn(`No component found for field type: ${field.type}`);
    return null;
  }

  // Pass props dynamically based on field type
  const componentProps = {
    ...(field.label && { label: field.label }),
    ...(field.name && { name: field.name }),
    ...(field.options && { options: field.options }),
  };

  return <FieldComponent {...componentProps} />;
};
