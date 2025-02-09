import { Select, SelectItem } from "@/components/common";
import languageNameMap from "language-name-map/map";
import { Text } from "react-aria-components";

export interface LanguageSelectFieldProps {
  children?: React.ReactNode;
}

export function LanguageSelectField({ children }: LanguageSelectFieldProps) {
  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Language"
        name="language"
        size="large"
        placeholder="Select a language"
        className="w-fit"
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
      {children}
    </div>
  );
}
