import { type MaskitoOptions, maskitoTransform } from "@maskito/core";
import { type Key, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { getCountyOptions, matchCounty } from "#constants/counties";
import { JURISDICTION_OPTIONS } from "#constants/jurisdictions";
import { ComboBox, ComboBoxItem } from "../../common/ComboBox";
import { TextField } from "../../common/TextField";
import "./AddressField.css";
import { useAsyncList } from "react-aria-components";
import {
  ADDRESS_FIELDS,
  type AddressNames,
  type AddressType,
} from "#constants/fieldGroups";
import {
  createLocationLoader,
  type GeoapifyResult,
} from "#lib/utils/fetchLocationResults.ts";
import { Autocomplete } from "../../common/Autocomplete";
import { MenuItem } from "../../common/Menu";

const FIELD_FOR_GEOAPIFY = {
  address_line1: "street",
  city: "city",
  state_code: "state",
  postcode: "zip",
  county: "county",
} as const satisfies Partial<Record<keyof GeoapifyResult, keyof AddressNames>>;

export function mapPlaceToFields(
  place: GeoapifyResult,
  names: AddressNames,
): Array<[string, string]> {
  const updates: Array<[string, string]> = [];
  for (const [source, key] of Object.entries(FIELD_FOR_GEOAPIFY) as [
    keyof GeoapifyResult,
    keyof AddressNames,
  ][]) {
    const fieldName = names[key];
    if (!fieldName) continue;
    const value = place[source] ?? "";
    updates.push([
      fieldName,
      key === "county" ? matchCounty(place.state_code, value) : value,
    ]);
  }
  return updates;
}

export interface AddressFieldProps {
  children?: React.ReactNode;
  type: AddressType;
  address2?: boolean;
  county?: boolean;
}

export function AddressField({
  children,
  type,
  address2 = false,
  county = false,
}: AddressFieldProps) {
  const { control, getValues, setValue } = useFormContext();

  const names: AddressNames = ADDRESS_FIELDS[type];

  const state = useWatch({ control, name: names.state });
  const countyOptions = getCountyOptions(state);

  const street2Name = names.street2;
  const canAddAddress2 = address2 && !!street2Name;
  const [address2Expanded, setAddress2Expanded] = useState(
    () => !!street2Name && !!getValues(street2Name),
  );

  // Input mask: enforce ZIP code format of 12345-1234
  const maskitoOptions: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
  };

  const list = useAsyncList<GeoapifyResult>({ load: createLocationLoader() });

  const autocompleteAddress = (id: Key): void => {
    const place = list.items.find((i) => i.place_id === id);
    if (!place) return;
    for (const [field, value] of mapPlaceToFields(place, names)) {
      setValue(field, value, { shouldValidate: true, shouldDirty: true });
    }
    list.setFilterText("");
  };

  return (
    <div className="namesake-address-field">
      <Controller
        control={control}
        name={names.street}
        defaultValue=""
        render={({ field, fieldState: { invalid, error } }) => (
          <Autocomplete
            {...field}
            label="Street address"
            autoComplete="off"
            size={30}
            items={list.items}
            inputValue={field.value}
            onInputChange={(text) => {
              list.setFilterText(text);
              field.onChange(text);
              setValue(names.street, text);
            }}
            isAsync={true}
            isLoading={list.isLoading}
            onAction={autocompleteAddress}
            isInvalid={invalid}
            errorMessage={error?.message}
          >
            {(item) => <MenuItem id={item.place_id}>{item.formatted}</MenuItem>}
          </Autocomplete>
        )}
      />
      {canAddAddress2 &&
        (!address2Expanded ? (
          <button
            type="button"
            className="button-as-link namesake-address-field-add-address2"
            onClick={() => setAddress2Expanded(true)}
          >
            Add apartment, suite, unit, etc.
          </button>
        ) : (
          <Controller
            control={control}
            name={street2Name}
            defaultValue=""
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                label="Apartment, suite, unit, etc."
                autoComplete="address-line2"
                className="namesake-address-field-street"
                maxLength={40}
                size={30}
                isInvalid={invalid}
                errorMessage={error?.message}
              />
            )}
          />
        ))}
      <Controller
        control={control}
        name={names.city}
        defaultValue=""
        render={({ field, fieldState: { invalid, error } }) => (
          <TextField
            {...field}
            label="City"
            autoComplete="address-level2"
            maxLength={40}
            size={30}
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name={names.state}
        defaultValue=""
        render={({ field, fieldState: { invalid, error } }) => (
          <ComboBox
            {...field}
            label="State"
            placeholder="Select state"
            autoComplete="address-level1"
            value={field.value}
            onChange={field.onChange}
            isInvalid={invalid}
            errorMessage={error?.message}
            menuTrigger="focus"
          >
            {JURISDICTION_OPTIONS.map((option) => (
              <ComboBoxItem key={option.value} id={option.value}>
                {option.label}
              </ComboBoxItem>
            ))}
          </ComboBox>
        )}
      />
      {county && names.county && (
        <Controller
          control={control}
          name={names.county}
          defaultValue=""
          render={({ field, fieldState: { invalid, error } }) =>
            countyOptions ? (
              <ComboBox
                {...field}
                label="County"
                placeholder="Select a county"
                value={field.value ?? ""}
                onChange={field.onChange}
                isInvalid={invalid}
                errorMessage={error?.message}
                menuTrigger="focus"
              >
                {countyOptions.map(({ label, value }) => (
                  <ComboBoxItem key={value} id={value} textValue={label}>
                    {label}
                  </ComboBoxItem>
                ))}
              </ComboBox>
            ) : (
              <TextField
                {...field}
                label="County"
                isInvalid={invalid}
                errorMessage={error?.message}
              />
            )
          }
        />
      )}
      <Controller
        control={control}
        name={names.zip}
        defaultValue=""
        render={({ field, fieldState: { invalid, error } }) => (
          <TextField
            {...field}
            label="ZIP"
            autoComplete="postal-code"
            onChange={(value) => {
              const transformedValue = maskitoTransform(value, maskitoOptions);
              field.onChange(transformedValue);
            }}
            maxLength={10}
            size={13}
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      {children}
    </div>
  );
}
