import type { UserFormDataField } from "@convex/constants";
import { ShortTextField } from "../ShortTextField/ShortTextField";

type NameType = "newName" | "oldName";

export interface NameFieldProps {
  children?: React.ReactNode;
  type: NameType;
}

export function NameField({ children, type }: NameFieldProps) {
  const names: Record<
    NameType,
    {
      first: UserFormDataField;
      middle: UserFormDataField;
      last: UserFormDataField;
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
  };

  return (
    <div className="@container flex flex-col gap-4">
      <div className="grid grid-cols-1 @lg:grid-cols-3 gap-4">
        <ShortTextField
          label="First or given name"
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
