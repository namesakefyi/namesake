import { TextField } from "@/components/common";
import { useMaskito } from "@maskito/react";
import type React from "react";
import { useState } from "react";

export interface PhoneFieldProps {
  children?: React.ReactNode;
}

export function PhoneField({ children }: PhoneFieldProps) {
  const [value, setValue] = useState("");
  const maskedInputRef = useMaskito({
    options: {
      mask: [
        "+",
        "1",
        " ",
        "(",
        /\d/,
        /\d/,
        /\d/,
        ")",
        " ",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ],
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <TextField
        label="Phone number"
        name="phone"
        type="tel"
        autoComplete="tel"
        ref={maskedInputRef}
        value={value}
        onInput={(e) => setValue(e.currentTarget.value)}
        className="max-w-[20ch]"
        size="large"
      />
      {children}
    </div>
  );
}
