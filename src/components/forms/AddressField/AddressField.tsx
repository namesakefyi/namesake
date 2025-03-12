import { Select, SelectItem, TextField } from "@/components/common";
import { JURISDICTIONS, type UserFormDataField } from "@convex/constants";
import { maskitoTransform } from "@maskito/core";
import type { MaskitoOptions } from "@maskito/core";
import { Controller, useFormContext } from "react-hook-form";

type AddressType = "residence" | "mailing";

export interface AddressFieldProps {
  children?: React.ReactNode;
  type: AddressType;
}

export function AddressField({ children, type }: AddressFieldProps) {
  const { control } = useFormContext();

  const names: Record<
    AddressType,
    {
      street: UserFormDataField;
      city: UserFormDataField;
      state: UserFormDataField;
      zip: UserFormDataField;
    }
  > = {
    residence: {
      street: "residenceStreetAddress",
      city: "residenceCity",
      state: "residenceState",
      zip: "residenceZipCode",
    },
    mailing: {
      street: "mailingStreetAddress",
      city: "mailingCity",
      state: "mailingState",
      zip: "mailingZipCode",
    },
  };

  const maskitoOptions: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 grid-cols-[1fr_auto] [grid-template-areas:'street_street''city_city''state_zip']">
        <Controller
          control={control}
          name={names[type].street}
          defaultValue={""}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              {...field}
              label="Street address"
              autoComplete="street-address"
              maxLength={40}
              size="large"
              className="[grid-area:street]"
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name={names[type].city}
          defaultValue={""}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              {...field}
              label="City"
              autoComplete="address-level2"
              maxLength={40}
              size="large"
              className="[grid-area:city]"
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name={names[type].state}
          defaultValue={""}
          render={({ field, fieldState: { invalid, error } }) => (
            <Select
              {...field}
              label="State"
              placeholder="Select state"
              autoComplete="address-level1"
              selectedKey={field.value}
              onSelectionChange={(key) => {
                field.onChange(key);
              }}
              className="[grid-area:state]"
              size="large"
              isInvalid={invalid}
              errorMessage={error?.message}
            >
              {Object.entries(JURISDICTIONS).map(([value, label]) => (
                <SelectItem key={value} id={value}>
                  {label}
                </SelectItem>
              ))}
            </Select>
          )}
        />
        <Controller
          control={control}
          name={names[type].zip}
          defaultValue={""}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              {...field}
              label="ZIP"
              autoComplete="postal-code"
              onChange={(value) => {
                const transformedValue = maskitoTransform(
                  value,
                  maskitoOptions,
                );
                field.onChange(transformedValue);
              }}
              className="max-w-[14ch] [grid-area:zip]"
              maxLength={10}
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
