import { XIcon } from "lucide-react";
import { createContext, useContext } from "react";
import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  type TagGroupProps as AriaTagGroupProps,
  type TagProps as AriaTagProps,
  Button,
  TagList,
  type TagListProps,
  Text,
  composeRenderProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { FieldDescription, Label } from "../Field";
import { focusRing } from "../utils";

const colors = {
  gray: "bg-gray-1 text-gray-6 border-gray-2 hover:border-gray-3 dark:bg-gray-8 dark:text-gray-3 dark:border-gray-6 dark:hover:border-gray-5",
  green:
    "bg-green-1 text-green-10 border-green-2 hover:border-green-3 dark:bg-green-3/20 dark:text-green-4 dark:border-green-3/10 dark:hover:border-green-3/20",
  yellow:
    "bg-yellow-1 text-yellow-10 border-yellow-2 hover:border-yellow-3 dark:bg-yellow-3/20 dark:text-yellow-4 dark:border-yellow-3/10 dark:hover:border-yellow-3/20",
  blue: "bg-blue-1 text-blue-10 border-blue-2 hover:border-blue-3 dark:bg-blue-4/20 dark:text-blue-3 dark:border-blue-4/10 dark:hover:border-blue-4/20",
};

type Color = keyof typeof colors;
const ColorContext = createContext<Color>("gray");

const tagStyles = tv({
  extend: focusRing,
  base: "transition cursor-default text-xs rounded-full border px-3 py-0.5 flex items-center max-w-fit gap-1",
  variants: {
    color: {
      gray: "",
      green: "",
      yellow: "",
      blue: "",
    },
    allowsRemoving: {
      true: "pr-1",
    },
    isSelected: {
      true: "bg-blue-9 text-white border-transparent forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-color-adjust-none",
    },
    isDisabled: {
      true: "bg-gray-1 text-gray-3 forced-colors:text-[GrayText]",
    },
  },
  compoundVariants: (Object.keys(colors) as Color[]).map((color) => ({
    isSelected: false,
    color,
    class: colors[color],
  })),
});

export interface TagGroupProps<T>
  extends Omit<AriaTagGroupProps, "children">,
    Pick<TagListProps<T>, "items" | "children" | "renderEmptyState"> {
  color?: Color;
  label?: string;
  description?: string;
  errorMessage?: string;
}

export interface TagProps extends AriaTagProps {
  color?: Color;
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
    <AriaTagGroup
      {...props}
      className={twMerge("flex flex-col gap-1", props.className)}
    >
      <Label>{label}</Label>
      <ColorContext.Provider value={props.color || "gray"}>
        <TagList
          items={items}
          renderEmptyState={renderEmptyState}
          className="flex flex-wrap gap-1"
        >
          {children}
        </TagList>
      </ColorContext.Provider>
      {description && <FieldDescription>{description}</FieldDescription>}
      {errorMessage && (
        <Text slot="errorMessage" className="text-sm text-red-9">
          {errorMessage}
        </Text>
      )}
    </AriaTagGroup>
  );
}

const removeButtonStyles = tv({
  extend: focusRing,
  base: "cursor-default rounded-full transition-[background-color] p-0.5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 pressed:bg-black/20 dark:pressed:bg-white/20",
});

export function Tag({ children, color, ...props }: TagProps) {
  const textValue = typeof children === "string" ? children : undefined;
  const groupColor = useContext(ColorContext);
  return (
    <AriaTag
      textValue={textValue}
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tagStyles({ ...renderProps, className, color: color || groupColor }),
      )}
    >
      {({ allowsRemoving }) => (
        <>
          {children}
          {allowsRemoving && (
            <Button slot="remove" className={removeButtonStyles}>
              <XIcon aria-hidden className="w-3 h-3" />
            </Button>
          )}
        </>
      )}
    </AriaTag>
  );
}
