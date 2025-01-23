import { AnimateChangeInHeight, Button } from "@/components/common";
import { ChevronRight } from "lucide-react";
import {
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  type DisclosureGroupProps as AriaDisclosureGroupProps,
  DisclosurePanel as AriaDisclosurePanel,
  type DisclosureProps as AriaDisclosureProps,
  Header,
  type Key,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

export interface DisclosureProps
  extends Omit<AriaDisclosureProps, "children" | "id"> {
  id: Key;
  title: React.ReactNode;
  children?: React.ReactNode;
}

export function Disclosure({ title, children, ...props }: DisclosureProps) {
  return (
    <AriaDisclosure className={twMerge("group")} {...props}>
      <Header>
        <Button
          variant="ghost"
          className="w-full justify-start"
          slot="trigger"
          size="small"
          icon={ChevronRight}
          iconProps={{
            className: twMerge(
              "transition-transform opacity-60",
              "group-data-[expanded]:rotate-90",
            ),
          }}
        >
          {title}
        </Button>
      </Header>
      <AnimateChangeInHeight className="w-full">
        <AriaDisclosurePanel className="group-data-[expanded]:pb-2">
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
