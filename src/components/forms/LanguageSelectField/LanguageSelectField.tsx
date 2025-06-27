import languageNameMap from "language-name-map/map";
import { Text } from "react-aria-components";
import { Controller, useFormContext } from "react-hook-form";
import { ComboBox, ComboBoxItem } from "@/components/common";
import type { FieldName } from "@/constants";

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

  return (
    <div className="flex flex-col gap-4">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? null}
        shouldUnregister={true}
        render={({ field, fieldState: { invalid, error } }) => (
          <ComboBox
            {...field}
            label="Language"
            size="large"
            placeholder="Select a language"
            className="w-fit"
            selectedKey={field.value}
            onSelectionChange={(key) => {
              field.onChange(key);
            }}
            isInvalid={invalid}
            errorMessage={error?.message}
            {...props}
          >
            {Object.entries(languageNameMap)
              .sort(([_, { name: aName }], [_2, { name: bName }]) =>
                aName.localeCompare(bName),
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
