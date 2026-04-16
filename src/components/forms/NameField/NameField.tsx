import type { FieldName } from "../../../constants/fields";
import { ShortTextField } from "../ShortTextField/ShortTextField";
import "./NameField.css";

type NameType =
  | "newName"
  | "oldName"
  | "mothersName"
  | "fathersName"
  | "previousSocialSecurityCardName";

export interface NameFieldProps {
  children?: React.ReactNode;
  type: NameType;
}

export function NameField({ children, type }: NameFieldProps) {
  const names: Record<
    NameType,
    {
      first: FieldName;
      middle: FieldName;
      last: FieldName;
    }
  > = {
    newName: {
      first: "newFirstName",
      middle: "newMiddleName",
      last: "newLastName",
    },
    oldName: {
      first: "oldFirstName",
      middle: "oldMiddleName",
      last: "oldLastName",
    },
    mothersName: {
      first: "mothersFirstName",
      middle: "mothersMiddleName",
      last: "mothersLastName",
    },
    fathersName: {
      first: "fathersFirstName",
      middle: "fathersMiddleName",
      last: "fathersLastName",
    },
    previousSocialSecurityCardName: {
      first: "previousSocialSecurityCardFirstName",
      middle: "previousSocialSecurityCardMiddleName",
      last: "previousSocialSecurityCardLastName",
    },
  };

  return (
    <div className="namesake-name-field">
      <div className="namesake-name-field-inputs">
        <ShortTextField
          label="First name"
          name={names[type].first}
          autoComplete="given-name"
          size={24}
        />
        <ShortTextField
          label="Middle name"
          name={names[type].middle}
          autoComplete="additional-name"
          size={24}
        />
        <ShortTextField
          label="Last or family name"
          name={names[type].last}
          autoComplete="family-name"
          size={24}
        />
      </div>
      {children}
    </div>
  );
}
