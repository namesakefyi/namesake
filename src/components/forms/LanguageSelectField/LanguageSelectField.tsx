import languageNameMap from "language-name-map/map";
import { Text } from "react-aria-components";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldName } from "../../../constants/fields";
import { ComboBox, ComboBoxItem } from "../../common/ComboBox";
import "./LanguageSelectField.css";

export interface LanguageSelectFieldProps {
  name: FieldName;
  children?: React.ReactNode;
  defaultValue?: string;
}

export function LanguageSelectField({
  name,
  children,
  defaultValue,
  ...props
}: LanguageSelectFieldProps) {
  const { control } = useFormContext();

  const collator = new Intl.Collator("en");

  return (
    <div className="namesake-language-select-field">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? null}
        render={({ field, fieldState: { invalid, error } }) => (
          <ComboBox
            {...field}
            label="Language"
            placeholder="Select a language"
            className="w-fit"
            value={field.value}
            onChange={field.onChange}
            isInvalid={invalid}
            errorMessage={error?.message}
            {...props}
          >
            {Object.entries(languageNameMap)
              .sort(([_, { name: aName }], [_2, { name: bName }]) =>
                collator.compare(aName, bName),
              )
              .map(([language, { name, native }]) => (
                <ComboBoxItem
                  key={language}
                  id={language}
                  textValue={`${name} (${native})`}
                >
                  {name}
                  <Text
                    slot="description"
                    className="text-dim"
                    data-testid="native-name"
                  >
                    {native}
                  </Text>
                </ComboBoxItem>
              ))}
          </ComboBox>
        )}
      />
      {children}
    </div>
  );
}
