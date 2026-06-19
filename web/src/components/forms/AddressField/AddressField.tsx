import { type MaskitoOptions, maskitoTransform } from "@maskito/core";
import { type Key, useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldName } from "#constants/fields";
import { JURISDICTIONS } from "#constants/jurisdictions";
import { ComboBox, ComboBoxItem } from "../../common/ComboBox";
import { TextField } from "../../common/TextField";
import "./AddressField.css";
import { useAsyncList } from "react-aria-components";
import type { GeoapifyResult } from "../../../pages/api/location";
import { Autocomplete } from "../../common/Autocomplete";
import { MenuItem } from "../../common/Menu";

type AddressType = "residence" | "mailing" | "parent1" | "parent2";

// Custom hook that waits a set delay before showing a spinner
// unsure where this should live.
function useDelayedFlag(active: boolean, delayms = 200) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!active) {
      setShow(false);
      return;
    }
    const id = setTimeout(() => setShow(true), delayms);
    return () => clearTimeout(id);
  }, [active, delayms]);
  return show;
}

export interface AddressFieldProps {
  children?: React.ReactNode;
  type: AddressType;
  includeAddress2?: boolean;
  includeCounty?: boolean;
}

export function AddressField({
  children,
  type,
  includeAddress2 = false,
  includeCounty = false,
}: AddressFieldProps) {
  const { control, getValues, setValue } = useFormContext();

  const names: Record<
    AddressType,
    {
      street: FieldName;
      street2?: FieldName;
      city: FieldName;
      state: FieldName;
      zip: FieldName;
      county?: FieldName;
    }
  > = {
    residence: {
      street: "residenceStreetAddress",
      street2: "residenceStreetAddress2",
      city: "residenceCity",
      state: "residenceState",
      zip: "residenceZipCode",
      county: "residenceCounty",
    },
    mailing: {
      street: "mailingStreetAddress",
      street2: "mailingStreetAddress2",
      city: "mailingCity",
      state: "mailingState",
      zip: "mailingZipCode",
      county: "mailingCounty",
    },
    parent1: {
      street: "parent1StreetAddress",
      city: "parent1City",
      state: "parent1State",
      zip: "parent1ZipCode",
    },
    parent2: {
      street: "parent2StreetAddress",
      city: "parent2City",
      state: "parent2State",
      zip: "parent2ZipCode",
    },
  };

  const street2Name = names[type].street2;
  const canAddAddress2 = includeAddress2 && !!street2Name;
  const [address2Expanded, setAddress2Expanded] = useState(
    () => !!street2Name && !!getValues(street2Name),
  );

  // Input mask: enforce ZIP code format of 12345-1234
  const maskitoOptions: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
  };

  const apiFailedRef = useRef(false);

  const list = useAsyncList<GeoapifyResult>({
    async load({ signal, filterText }) {
      if (!filterText || filterText.length < 3) {
        return { items: [] };
      }
      try {
        const res = await fetch(
          `/api/location?text=${encodeURIComponent(filterText)}`,
          { signal },
        );
        if (!res.ok) throw new Error(`Location API ${res.status}`);
        const json: any = await res.json();
        return { items: json.results };
      } catch (err) {
        // This isn't a failure if the request was canceled due to a keystroke
        if (signal.aborted) throw err;
        apiFailedRef.current = true;
        return { items: [] };
      }
    },
  });

  const showLoading = useDelayedFlag(list.isLoading);

  const autocompleteAddress = (id: Key): void => {
    const place = list.items.find((i) => i.place_id === id);
    if (!place) return;
    setValue(
      names[type].street,
      [place.housenumber, place.street].filter(Boolean).join(" "),
    );
    setValue(names[type].city, place.city ?? "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(names[type].state, place.state_code ?? "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(names[type].zip, place.postcode ?? "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (names[type].county) {
      setValue(names[type].county, place.county ?? "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    list.setFilterText("");
  };

  return (
    <div className="namesake-address-field">
      <Controller
        control={control}
        name={names[type].street}
        defaultValue=""
        render={({ field, fieldState: { invalid, error } }) => (
          <Autocomplete
            {...field}
            autoComplete="address-line1"
            label="Street address"
            size={30}
            items={list.items}
            inputValue={field.value}
            onInputChange={(text) => {
              list.setFilterText(text);
              field.onChange(text);
              setValue(names[type].street, text);
            }}
            isAsync={true}
            isLoading={showLoading}
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
            className="namesake-address-field-add-address2"
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
        name={names[type].city}
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
        name={names[type].state}
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
            {Object.entries(JURISDICTIONS).map(([value, label]) => (
              <ComboBoxItem key={value} id={value}>
                {label}
              </ComboBoxItem>
            ))}
          </ComboBox>
        )}
      />
      {includeCounty && names[type].county && (
        <Controller
          control={control}
          name={names[type].county}
          defaultValue=""
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              {...field}
              label="County"
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
        />
      )}
      <Controller
        control={control}
        name={names[type].zip}
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
