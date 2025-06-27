import { X } from "lucide-react";
import { createContext, use } from "react";
import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  type TagGroupProps as AriaTagGroupProps,
  type TagProps as AriaTagProps,
  composeRenderProps,
  TagList,
  type TagListProps,
  Text,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Button, FieldDescription, Label } from "@/components/common";
import { focusRing } from "@/components/utils";

const SizeContext = createContext<"medium" | "large">("medium");

const tagStyles = tv({
  extend: focusRing,
  base: "transition cursor-pointer rounded-full border flex items-center max-w-fit gap-1",
  variants: {
    allowsRemoving: {
      true: "pr-1",
    },
    isSelected: {
      false: "text-dim border-dim hover:text-normal hover:border-normal",
      true: "bg-primary-9 text-white border border-transparent forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-color-adjust-none",
    },
    isDisabled: {
      true: "cursor-default text-dim opacity-50 forced-colors:text-[GrayText]",
    },
    size: {
      medium: "text-sm px-3 py-1",
      large: "text-base px-4 py-1.5",
    },
  },
});

export interface TagGroupProps<T>
  extends Omit<AriaTagGroupProps, "children">,
    Pick<TagListProps<T>, "items" | "children" | "renderEmptyState"> {
  label?: string;
  description?: string;
  errorMessage?: string;
  size?: "medium" | "large";
}

export interface TagProps extends AriaTagProps {
  size?: "medium" | "large";
}

const tagGroupStyles = tv({
  base: "flex flex-col gap-2",
});

const tagListStyles = tv({
  base: "flex flex-wrap",
  variants: {
    size: {
      medium: "gap-y-2 gap-x-1",
      large: "gap-y-2.5 gap-x-1.5",
    },
  },
});

export function TagGroup<T extends object>({
  label,
  description,
  errorMessage,
  items,
  children,
  className,
  size = "medium",
  renderEmptyState,
  ...props
}: TagGroupProps<T>) {
  return (
    <SizeContext value={size}>
      <AriaTagGroup {...props} className={tagGroupStyles({ className })}>
        <Label size={size}>{label}</Label>
        <TagList
          items={items}
          renderEmptyState={renderEmptyState}
          className={tagListStyles({ size, className })}
        >
          {children}
        </TagList>
        {description && <FieldDescription>{description}</FieldDescription>}
        {errorMessage && (
          <Text slot="errorMessage" className="text-sm text-red-9">
            {errorMessage}
          </Text>
        )}
      </AriaTagGroup>
    </SizeContext>
  );
}

const removeButtonStyles = tv({
  extend: focusRing,
  base: "cursor-pointer rounded-full transition-[background-color] p-0.5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 pressed:bg-black/20 dark:pressed:bg-white/20",
});

export function Tag({ children, ...props }: TagProps) {
  const size = use(SizeContext);
  const textValue = typeof children === "string" ? children : undefined;

  return (
    <AriaTag
      textValue={textValue}
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tagStyles({ ...renderProps, size, className }),
      )}
    >
      {composeRenderProps(children, (children, { allowsRemoving }) => (
        <>
          {children}
          {allowsRemoving && (
            <Button
              slot="remove"
              size="small"
              variant="icon"
              className={removeButtonStyles}
              icon={X}
              aria-label="Remove tag"
            />
          )}
        </>
      ))}
    </AriaTag>
  );
}
