import { ChevronDown } from "lucide-react";
import {
  Button as AriaButton,
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  type DisclosureGroupProps as AriaDisclosureGroupProps,
  DisclosurePanel as AriaDisclosurePanel,
  type DisclosureProps as AriaDisclosureProps,
  composeRenderProps,
  Header,
  type Key,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { focusRing } from "@/components/utils";

export interface DisclosureProps
  extends Omit<AriaDisclosureProps, "children" | "id"> {
  id: Key;
  title: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

const disclosureTriggerStyles = tv({
  extend: focusRing,
  base: "group flex-1 flex rounded-lg transition-colors text-dim hover:text-normal justify-between text-lg font-medium text-left py-2",
});

const disclosurePanelStyles = tv({
  base: "transition-all duration-800 opacity-0 h-0 group-data-expanded:h-auto group-data-expanded:opacity-100 group-data-expanded:pb-4",
});

export function Disclosure({
  title,
  children,
  className,
  actions,
  ...props
}: DisclosureProps) {
  return (
    <AriaDisclosure className={twMerge("group", className)} {...props}>
      <Header className="flex items-start gap-1 w-full">
        <AriaButton
          className={composeRenderProps(className, (className, renderProps) =>
            disclosureTriggerStyles({
              ...renderProps,
              className,
            }),
          )}
          slot="trigger"
        >
          <span className="my-0.5">{title}</span>
          <ChevronDown
            size={20}
            className={twMerge(
              "group-hover:bg-theme-a3 group-hover:text-normal rounded-full size-8 p-1.5 shrink-0 ml-2",
              "transition-transform opacity-60",
              "group-data-expanded:rotate-180",
            )}
          />
        </AriaButton>
        {actions && <div className="shrink-0 mt-2">{actions}</div>}
      </Header>
      <AriaDisclosurePanel className={disclosurePanelStyles()}>
        {children}
      </AriaDisclosurePanel>
    </AriaDisclosure>
  );
}

interface DisclosureGroupProps extends AriaDisclosureGroupProps {}

export function DisclosureGroup({ children, ...props }: DisclosureGroupProps) {
  return <AriaDisclosureGroup {...props}>{children}</AriaDisclosureGroup>;
}
