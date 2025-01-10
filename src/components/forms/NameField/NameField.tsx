import { TextField } from "@/components/common";

export interface NameFieldProps {
  children?: React.ReactNode;
}

export function NameField({ children }: NameFieldProps) {
  return (
    <div className="@container flex flex-col gap-4">
      <div className="grid grid-cols-1 @lg:grid-cols-3 gap-4">
        <TextField
          label="First name"
          name="firstName"
          autoComplete="given-name"
          size="large"
        />
        <TextField
          label="Middle name"
          name="middleName"
          autoComplete="additional-name"
          size="large"
        />
        <TextField
          label="Last name"
          name="lastName"
          autoComplete="family-name"
          size="large"
        />
      </div>
      {children}
    </div>
  );
}
