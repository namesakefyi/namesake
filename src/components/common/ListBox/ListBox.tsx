import { composeTailwindRenderProps, focusRing } from "@/components/utils";
import { Check } from "lucide-react";
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  type ListBoxProps as AriaListBoxProps,
  Collection,
  Header,
  type ListBoxItemProps,
  ListBoxSection,
  type SectionProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

type ListBoxProps<T> = Omit<AriaListBoxProps<T>, "layout" | "orientation">;

export function ListBox<T extends object>({
  children,
  ...props
}: ListBoxProps<T>) {
  return (
    <AriaListBox
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "outline-none p-1 border border-dim rounded-lg overflow-y-auto",
      )}
    >
      {children}
    </AriaListBox>
  );
}

export const itemStyles = tv({
  extend: focusRing,
  base: "group relative flex items-center gap-8 cursor-pointer select-none py-1.5 px-2.5 rounded-md will-change-transform forced-color-adjust-none",
  variants: {
    isSelected: {
      false: "text-normal -outline-offset-2",
      true: "bg-primary-9 text-white forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] [&:has(+[data-selected])]:rounded-b-none [&+[data-selected]]:rounded-t-none -outline-offset-4 outline-white forced-colors:outline-[HighlightText]",
    },
    isDisabled: {
      true: "text-dim opacity-50 cursor-default forced-colors:text-[GrayText]",
    },
  },
});

export function ListBoxItem(props: ListBoxItemProps) {
  const textValue =
    props.textValue ||
    (typeof props.children === "string" ? props.children : undefined);

  return (
    <AriaListBoxItem {...props} textValue={textValue} className={itemStyles}>
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          <div className="absolute left-4 right-4 bottom-0 h-px bg-white/20 forced-colors:bg-[HighlightText] hidden [.group[data-selected]:has(+[data-selected])_&]:block" />
        </>
      ))}
    </AriaListBoxItem>
  );
}

export const dropdownItemStyles = tv({
  base: "group flex items-center gap-3 cursor-pointer select-none py-2 px-2.5 pr-3 rounded-lg outline-none text-sm forced-color-adjust-none",
  variants: {
    isDisabled: {
      false: "text-normal",
      true: "text-dim opacity-50 forced-colors:text-[GrayText] cursor-default",
    },
    isFocused: {
      true: "bg-theme-3 text-normal forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
    },
    isOpen: {
      true: "bg-theme-3",
    },
  },
});

export function DropdownItem(props: ListBoxItemProps) {
  const textValue =
    props.textValue ||
    (typeof props.children === "string" ? props.children : undefined);

  return (
    <AriaListBoxItem
      {...props}
      textValue={textValue}
      className={dropdownItemStyles}
    >
      {composeRenderProps(props.children, (children, { isSelected }) => (
        <>
          <span className="flex items-center flex-1 gap-2 truncate">
            {children}
          </span>
          {isSelected && (
            <span className="flex items-center size-4">
              <Check className="size-4" />
            </span>
          )}
        </>
      ))}
    </AriaListBoxItem>
  );
}

export interface DropdownSectionProps<T> extends SectionProps<T> {
  title?: string;
}

export function DropdownSection<T extends object>(
  props: DropdownSectionProps<T>,
) {
  return (
    <ListBoxSection>
      <Header className="text-sm font-semibold text-dim px-4 py-1 truncate sticky -top-[5px] -mt-px -mx-1 z-10 bg-element border-b border-dim [&+*]:mt-1">
        {props.title}
      </Header>
      <Collection items={props.items}>{props.children}</Collection>
    </ListBoxSection>
  );
}
