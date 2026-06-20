import {
  Autocomplete as AriaAutocomplete,
  type AutocompleteProps as AriaAutocompleteProps,
  type Key,
  Popover,
  useFilter,
} from "react-aria-components";
import { Menu } from "../Menu";
import { SearchField } from "../SearchField";

import "./Autocomplete.css";
import { useRef } from "react";

export interface AutocompleteProps<T extends object>
  extends Omit<AriaAutocompleteProps, "children"> {
  label?: string;
  placeholder?: string;
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
  onAction?: (id: Key) => void;
  renderEmptyState?: () => React.ReactNode;
  isAsync?: boolean;
  isLoading?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  size?: number;
  name?: string;
  autoComplete?: string;
}

export function Autocomplete<T extends object>({
  label,
  placeholder,
  items,
  children,
  onAction,
  renderEmptyState,
  isAsync,
  isLoading,
  isInvalid,
  errorMessage,
  size,
  name,
  autoComplete,
  ...props
}: AutocompleteProps<T>) {
  const { contains } = useFilter({ sensitivity: "base" });
  const appliedFilter = isAsync ? undefined : contains;

  const triggerRef = useRef<HTMLDivElement>(null);
  const isEmpty = !items || isEmptyIterable(items);

  return (
    <AriaAutocomplete filter={appliedFilter} {...props}>
      <SearchField
        isInvalid={isInvalid}
        isLoading={isLoading}
        errorMessage={errorMessage}
        size={size}
        label={label}
        placeholder={placeholder}
        name={name}
        autoComplete={autoComplete}
        ref={triggerRef}
      />
      <Popover isOpen={!isEmpty} triggerRef={triggerRef} isNonModal>
        <Menu
          items={items}
          onAction={onAction}
          renderEmptyState={renderEmptyState}
        >
          {children}
        </Menu>
      </Popover>
    </AriaAutocomplete>
  );
}

function isEmptyIterable<T>(items: Iterable<T>): boolean {
  for (const _ of items) return false;
  return true;
}
