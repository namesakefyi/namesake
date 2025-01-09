import { TextField } from "@/components/common";

export interface EmailFieldProps {
  children?: React.ReactNode;
}

export function EmailField({ children }: EmailFieldProps) {
  return (
    <div className="flex flex-col gap-4">
      <TextField
        label="Email address"
        type="email"
        name="email"
        autoComplete="email"
        size="large"
        className="max-w-[40ch]"
      />
      {children}
    </div>
  );
}
