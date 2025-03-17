import { Select, SelectItem } from "@/components/common";
import type { UserFormDataField } from "@convex/constants";
import languageNameMap from "language-name-map/map";
import { Text } from "react-aria-components";
import { useFormContext } from "react-hook-form";
import { Controller } from "react-hook-form";

export interface LanguageSelectFieldProps {
  name: UserFormDataField;
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
        render={({ field, fieldState: { invalid, error } }) => (
          <Select
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
                <SelectItem key={language} id={language} textValue={name}>
                  {name}
                  <Text
                    slot="description"
                    className="text-gray-dim"
                    data-testid="native-name"
                  >
                    {native}
                  </Text>
                </SelectItem>
              ))}
          </Select>
        )}
      />
      {children}
    </div>
  );
}
