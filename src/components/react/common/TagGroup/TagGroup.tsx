import { RiCheckLine, RiCloseLine } from "@remixicon/react";
import { forwardRef } from "react";
import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  type TagGroupProps as AriaTagGroupProps,
  Button,
  TagList,
  type TagListProps,
  type TagProps,
} from "react-aria-components";
import { Text } from "../Content";
import { Label } from "../Form";
import "./TagGroup.css";

export interface TagGroupProps<T>
  extends Omit<AriaTagGroupProps, "children">,
    Pick<TagListProps<T>, "items" | "children" | "renderEmptyState"> {
  label?: string;
  description?: string;
  errorMessage?: string;
}

export function TagGroup<T extends object>({
  label,
  description,
  errorMessage,
  items,
  children,
  renderEmptyState,
  ...props
}: TagGroupProps<T>) {
  return (
    <AriaTagGroup {...props}>
      {label && <Label>{label}</Label>}
      <TagList items={items} renderEmptyState={renderEmptyState}>
        {children}
      </TagList>
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <Text slot="errorMessage">{errorMessage}</Text>}
    </AriaTagGroup>
  );
}

export const Tag = forwardRef<
  HTMLDivElement,
  Omit<TagProps, "children"> & { children?: React.ReactNode }
>(function Tag({ children, ...props }, ref) {
  const textValue = typeof children === "string" ? children : undefined;
  return (
    <AriaTag ref={ref} textValue={textValue} {...props}>
      {({ allowsRemoving, isSelected }) => (
        <>
          {isSelected && <RiCheckLine />}
          {children}
          {allowsRemoving && (
            <Button slot="remove">
              <RiCloseLine size={12} />
            </Button>
          )}
        </>
      )}
    </AriaTag>
  );
});
