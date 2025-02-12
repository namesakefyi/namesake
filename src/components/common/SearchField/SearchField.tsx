import {
  Button,
  FieldDescription,
  FieldError,
  FieldGroup,
  Input,
  Label,
} from "@/components/common";
import { composeTailwindRenderProps } from "@/components/utils";
import { CircleX, Search } from "lucide-react";
import {
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
  type ValidationResult,
} from "react-aria-components";

export interface SearchFieldProps extends AriaSearchFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
}

export function SearchField({
  label,
  description,
  errorMessage,
  placeholder,
  ...props
}: SearchFieldProps) {
  return (
    <AriaSearchField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1 min-w-[40px]",
      )}
    >
      {(renderProps) => (
        <>
          {label && <Label>{label}</Label>}
          <FieldGroup {...renderProps}>
            <Search
              aria-hidden
              className="w-4 h-4 ml-3 text-gray-dim forced-colors:text-[ButtonText] group-disabled:opacity-50 forced-colors:group-disabled:text-[GrayText]"
            />
            <Input
              placeholder={placeholder}
              className="[&::-webkit-search-cancel-button]:hidden"
            />
            <Button
              variant="icon"
              className="mr-1 w-7 h-7 p-0 group-empty:invisible"
              size="small"
              icon={CircleX}
              aria-label="Clear search"
            />
          </FieldGroup>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError>{errorMessage}</FieldError>
        </>
      )}
    </AriaSearchField>
  );
}
