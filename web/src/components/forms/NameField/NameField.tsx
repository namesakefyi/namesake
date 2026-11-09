import { NAME_FIELDS, type NameType } from "#constants/fieldGroups";
import { ShortTextField } from "../ShortTextField/ShortTextField";
import "./NameField.css";

export interface NameFieldProps {
  children?: React.ReactNode;
  type: NameType;
}

export function NameField({ children, type }: NameFieldProps) {
  const names = NAME_FIELDS[type];

  return (
    <div className="namesake-name-field">
      <div className="namesake-name-field-inputs">
        <ShortTextField
          label="First name"
          name={names.first}
          autoComplete="given-name"
          size={24}
        />
        <ShortTextField
          label="Middle name"
          name={names.middle}
          autoComplete="additional-name"
          size={24}
        />
        <ShortTextField
          label="Last or family name"
          name={names.last}
          autoComplete="family-name"
          size={24}
        />
      </div>
      {children}
    </div>
  );
}
