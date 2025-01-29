import { AnimateChangeInHeight } from "@/components/common";
import { focusRing } from "@/components/utils";
import { ChevronRight } from "lucide-react";
import {
  Button as AriaButton,
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  type DisclosureGroupProps as AriaDisclosureGroupProps,
  DisclosurePanel as AriaDisclosurePanel,
  type DisclosureProps as AriaDisclosureProps,
  Header,
  type Key,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

export interface DisclosureProps
  extends Omit<AriaDisclosureProps, "children" | "id"> {
  id: Key;
  title: React.ReactNode;
  children?: React.ReactNode;
}

const disclosureTriggerStyles = tv({
  extend: focusRing,
  base: "w-full relative pl-8 flex items-center text-lg font-medium rounded-lg h-10 hover:bg-graya-3 dark:hover:bg-graydarka-3",
});

const disclosurePanelStyles = tv({
  base: "transition-opacity duration-800 opacity-0 group-data-[expanded]:opacity-100 group-data-[expanded]:pb-4 pl-8",
});

export function Disclosure({ title, children, ...props }: DisclosureProps) {
  return (
    <AriaDisclosure className={twMerge("group")} {...props}>
      <Header>
        <AriaButton className={disclosureTriggerStyles()} slot="trigger">
          <ChevronRight
            size={20}
            className={twMerge(
              "absolute left-1.5",
              "transition-transform opacity-60",
              "group-data-[expanded]:rotate-90",
            )}
          />
          {title}
        </AriaButton>
      </Header>
      <AnimateChangeInHeight className="w-full">
        <AriaDisclosurePanel className={disclosurePanelStyles()}>
          {children}
        </AriaDisclosurePanel>
      </AnimateChangeInHeight>
    </AriaDisclosure>
  );
}

interface DisclosureGroupProps extends AriaDisclosureGroupProps {}

export function DisclosureGroup({ children, ...props }: DisclosureGroupProps) {
  return <AriaDisclosureGroup {...props}>{children}</AriaDisclosureGroup>;
}
