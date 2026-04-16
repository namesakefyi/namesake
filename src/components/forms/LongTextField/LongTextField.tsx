import { Controller, useFormContext } from "react-hook-form";
import type { FieldName } from "../../../constants/fields";
import { smartquotes } from "../../../utils/smartquotes";
import { TextArea, type TextAreaProps } from "../../common/TextArea";
import "./LongTextField.css";

export interface LongTextFieldProps extends Omit<TextAreaProps, "size"> {
  label: string;
  name: FieldName;
  children?: React.ReactNode;
}

export function LongTextField({
  label,
  name,
  children,
  defaultValue,
  ...props
}: LongTextFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="namesake-long-text-field">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? ""}
        render={({ field, fieldState: { invalid, error } }) => (
          <TextArea
            {...field}
            label={smartquotes(label)}
            isRequired
            validationBehavior="aria"
            isInvalid={invalid}
            {...props}
            errorMessage={error?.message}
          />
        )}
      />
      {children}
    </div>
  );
}
