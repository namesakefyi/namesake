import { RiCloseLine } from "@remixicon/react";
import {
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
  Button,
  Input,
  type ValidationResult,
} from "react-aria-components";
import { Text } from "../Content";
import { FieldError, Label } from "../Form";
import "./SearchField.css";
import { ProgressCircle } from "../ProgressCircle";

export interface SearchFieldProps extends AriaSearchFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
  isLoading?: boolean;
  size?: number;
}

export function SearchField({
  label,
  description,
  errorMessage,
  placeholder,
  isLoading,
  size,
  ...props
}: SearchFieldProps) {
  return (
    <AriaSearchField {...props}>
      {label && <Label>{label}</Label>}
      <Input size={size} placeholder={placeholder} />
      {isLoading && (
        <ProgressCircle aria-label="Loading.." isIndeterminate={true} />
      )}
      <Button>
        <RiCloseLine size={20} />
      </Button>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </AriaSearchField>
  );
}
