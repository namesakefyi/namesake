import { Select, SelectItem, TextField } from "@/components/common";
import { JURISDICTIONS, type Jurisdiction } from "@convex/constants";
import { useMaskito } from "@maskito/react";
import { useState } from "react";

export interface AddressFieldProps {
  children?: React.ReactNode;
}

export function AddressField({ children }: AddressFieldProps) {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState<Jurisdiction | null>(null);
  const [zip, setZip] = useState("");

  const maskedZIPRef = useMaskito({
    options: {
      mask: [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 grid-cols-[1fr_auto] [grid-template-areas:'street_street''city_city''state_zip'] max-w-[48ch]">
        <TextField
          label="Street address"
          name="addressStreet"
          autoComplete="street-address"
          value={address}
          onChange={setAddress}
          maxLength={40}
          size="large"
          className="[grid-area:street]"
        />
        <TextField
          label="City"
          name="addressCity"
          autoComplete="address-level2"
          value={city}
          onChange={setCity}
          maxLength={40}
          size="large"
          className="[grid-area:city]"
        />
        <Select
          label="State"
          name="addressState"
          placeholder="Select state"
          autoComplete="address-level1"
          selectedKey={state}
          onSelectionChange={(key) => {
            setState(key as Jurisdiction);
          }}
          className="[grid-area:state]"
          size="large"
        >
          {Object.entries(JURISDICTIONS).map(([value, label]) => (
            <SelectItem key={value} id={value}>
              {label}
            </SelectItem>
          ))}
        </Select>
        <TextField
          label="ZIP"
          name="addressZip"
          autoComplete="postal-code"
          value={zip}
          onInput={(e) => setZip(e.currentTarget.value)}
          ref={maskedZIPRef}
          className="max-w-[14ch] [grid-area:zip]"
          maxLength={10}
          size="large"
        />
      </div>
      {children}
    </div>
  );
}
