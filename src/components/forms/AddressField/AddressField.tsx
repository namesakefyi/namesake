import type { MaskitoOptions } from "@maskito/core";
import { maskitoTransform } from "@maskito/core";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ComboBox, ComboBoxItem, TextField } from "@/components/common";
import { type FieldName, JURISDICTIONS } from "@/constants";

type AddressType = "residence" | "mailing";

export interface AddressFieldProps {
  children?: React.ReactNode;
  type: AddressType;
  includeCounty?: boolean;
}

export function AddressField({
  children,
  type,
  includeCounty = false,
}: AddressFieldProps) {
  const { control, watch } = useFormContext();
  const [counties, setCounties] = useState<string[]>([]);

  const names: Record<
    AddressType,
    {
      street: FieldName;
      city: FieldName;
      state: FieldName;
      zip: FieldName;
      county: FieldName;
    }
  > = {
    residence: {
      street: "residenceStreetAddress",
      city: "residenceCity",
      state: "residenceState",
      zip: "residenceZipCode",
      county: "residenceCounty",
    },
    mailing: {
      street: "mailingStreetAddress",
      city: "mailingCity",
      state: "mailingState",
      zip: "mailingZipCode",
      county: "mailingCounty",
    },
  };

  const selectedState = watch(names[type].state);

  useEffect(() => {
    if (!includeCounty || !selectedState) {
      setCounties([]);
      return;
    }

    import(/* webpackChunkName: "usa-states" */ "typed-usa-states")
      .then((module) => {
        const state = module.usaStatesWithCounties.find(
          (state) => state.abbreviation === selectedState,
        );
        if (state) {
          setCounties(state.counties ?? []);
        }
      })
      .catch(() => {
        setCounties([]);
      });
  }, [includeCounty, selectedState]);

  // Input mask: enforce ZIP code format of 12345-1234
  const maskitoOptions: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
  };

  return (
    <div className="flex flex-col gap-4 @container">
      <div className="grid gap-4 grid-cols-[1fr_auto] [grid-template-areas:'street_street''city_city''state_state''zip_zip''county_county'] @md:[grid-template-areas:'street_street''city_city''state_zip''county_county']">
        <Controller
          control={control}
          name={names[type].street}
          defaultValue={""}
          shouldUnregister={true}
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
          shouldUnregister={true}
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
          shouldUnregister={true}
          render={({ field, fieldState: { invalid, error } }) => (
            <ComboBox
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
              menuTrigger="focus"
            >
              {Object.entries(JURISDICTIONS).map(([value, label]) => (
                <ComboBoxItem key={value} id={value}>
                  {label}
                </ComboBoxItem>
              ))}
            </ComboBox>
          )}
        />
        {includeCounty && counties.length > 0 && (
          <Controller
            control={control}
            name={names[type].county}
            defaultValue={""}
            shouldUnregister={true}
            render={({ field, fieldState: { invalid, error } }) => (
              <ComboBox
                {...field}
                label="County"
                placeholder="Select county"
                selectedKey={field.value}
                onSelectionChange={(key) => {
                  field.onChange(key);
                }}
                className="[grid-area:county]"
                size="large"
                isInvalid={invalid}
                errorMessage={error?.message}
                menuTrigger="focus"
              >
                {counties.map((county) => (
                  <ComboBoxItem key={county} id={county}>
                    {county}
                  </ComboBoxItem>
                ))}
              </ComboBox>
            )}
          />
        )}
        <Controller
          control={control}
          name={names[type].zip}
          defaultValue={""}
          shouldUnregister={true}
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
