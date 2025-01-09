import { TextField } from "@/components/common";

export interface NameFieldProps {
  children?: React.ReactNode;
}

export function NameField({ children }: NameFieldProps) {
  return (
    <div className="@container flex flex-col gap-4">
      <div className="flex flex-col @md:flex-row gap-4 *:max-w-[28ch]">
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
