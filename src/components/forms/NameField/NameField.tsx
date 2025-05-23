import type { FieldName } from "@/constants";
import { ShortTextField } from "../ShortTextField/ShortTextField";

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
    <div className="@container flex flex-col gap-4">
      <div className="grid grid-cols-1 @lg:grid-cols-3 gap-4">
        <ShortTextField
          label="First name"
          name={names[type].first}
          autoComplete="given-name"
        />
        <ShortTextField
          label="Middle name"
          name={names[type].middle}
          autoComplete="additional-name"
        />
        <ShortTextField
          label="Last or family name"
          name={names[type].last}
          autoComplete="family-name"
        />
      </div>
      {children}
    </div>
  );
}
