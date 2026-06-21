import { type MaskitoOptions, maskitoTransform } from "@maskito/core";
import { useEffect, useRef, useState } from "react";
import type { Key } from "react-aria-components";
import {
  Controller,
  type ControllerRenderProps,
  useFormContext,
} from "react-hook-form";
import type { FieldName } from "#constants/fields";
import { JURISDICTIONS } from "#constants/jurisdictions";
import {
  type AddressSuggestion,
  fetchAddressSuggestions,
  isGeoapifyEnabled,
} from "#lib/geoapify";
import { ComboBox, ComboBoxItem } from "../../common/ComboBox";
import { TextField } from "../../common/TextField";
import "./AddressField.css";

const SEARCH_DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 3;
const LOADING_KEY = "__loading__";

interface StreetAutocompleteFieldProps {
  field: ControllerRenderProps;
  isInvalid: boolean;
  errorMessage?: string;
  onSelect: (suggestion: AddressSuggestion) => void;
}

/**
 * Street address input backed by Geoapify autocomplete. Suggestions replace the
 * plain text field only when an API key is configured (see AddressField below);
 * `allowsCustomValue` keeps manual entry working when the API returns nothing.
 */
function StreetAutocompleteField({
  field,
  isInvalid,
  errorMessage,
  onSelect,
}: StreetAutocompleteFieldProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const search = (query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }
    // Keep the listbox open through the debounce + request so late-arriving
    // results are shown (react-aria closes an empty popover otherwise).
    setIsSearching(true);
    debounceRef.current = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      fetchAddressSuggestions(query, controller.signal)
        .then((results) => {
          if (controller.signal.aborted) return;
          setSuggestions(results);
          setIsSearching(false);
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setSuggestions([]);
          setIsSearching(false);
        });
    }, SEARCH_DEBOUNCE_MS);
  };

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    },
    [],
  );

  const handleSelectionChange = (key: Key | null) => {
    const match = suggestions.find((suggestion) => suggestion.id === key);
    if (match) onSelect(match);
  };

  const items: AddressSuggestion[] =
    suggestions.length > 0
      ? suggestions
      : isSearching
        ? [
            {
              id: LOADING_KEY,
              label: "Searching…",
              street: "",
              city: "",
              state: "",
              zip: "",
              county: "",
            },
          ]
        : [];

  return (
    <ComboBox<AddressSuggestion>
      label="Street address"
      name={field.name}
      autoComplete="address-line1"
      className="namesake-address-field-street"
      allowsCustomValue
      menuTrigger="input"
      items={items}
      disabledKeys={[LOADING_KEY]}
      inputValue={field.value ?? ""}
      onInputChange={(value) => {
        field.onChange(value);
        search(value);
      }}
      onSelectionChange={handleSelectionChange}
      onBlur={field.onBlur}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
    >
      {(suggestion) => (
        <ComboBoxItem id={suggestion.id} textValue={suggestion.street}>
          {suggestion.label}
        </ComboBoxItem>
      )}
    </ComboBox>
  );
}

type AddressType = "residence" | "mailing" | "parent1" | "parent2";

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
  const geoapifyEnabled = isGeoapifyEnabled();

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

  const fill = (name: FieldName, value: string) =>
    setValue(name, value, { shouldDirty: true, shouldValidate: true });

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    fill(names[type].street, suggestion.street);
    fill(names[type].city, suggestion.city);
    if (suggestion.state in JURISDICTIONS) {
      fill(names[type].state, suggestion.state);
    }
    fill(names[type].zip, suggestion.zip);
    const countyName = names[type].county;
    if (includeCounty && countyName) fill(countyName, suggestion.county);
  };

  return (
    <div className="namesake-address-field">
      <Controller
        control={control}
        name={names[type].street}
        defaultValue=""
        render={({ field, fieldState: { invalid, error } }) =>
          geoapifyEnabled ? (
            <StreetAutocompleteField
              field={field}
              isInvalid={invalid}
              errorMessage={error?.message}
              onSelect={handleAddressSelect}
            />
          ) : (
            <TextField
              {...field}
              label="Street address"
              autoComplete="address-line1"
              className="namesake-address-field-street"
              maxLength={40}
              size={30}
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )
        }
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
