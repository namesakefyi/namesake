import { TextField } from "@/components/common";
import type { UserFormDataField } from "@convex/constants";
import { useFormContext } from "react-hook-form";
import { Controller } from "react-hook-form";

type NameType = "newName" | "oldName";

export interface NameFieldProps {
  children?: React.ReactNode;
  type: NameType;
}

export function NameField({ children, type }: NameFieldProps) {
  const { control } = useFormContext();

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
        <Controller
          control={control}
          name={names[type].first}
          defaultValue={""}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              {...field}
              label="First name"
              autoComplete="given-name"
              size="large"
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name={names[type].middle}
          defaultValue={""}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              {...field}
              label="Middle name"
              autoComplete="additional-name"
              size="large"
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name={names[type].last}
          defaultValue={""}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              {...field}
              label="Last name"
              autoComplete="family-name"
              size="large"
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
        />
      </div>
      {children}
    </div>
  );
}
