import { RiArrowRightSLine } from "@remixicon/react";
import {
  UNSTABLE_Disclosure as AriaDisclosure,
  UNSTABLE_DisclosureGroup as AriaDisclosureGroup,
  type DisclosureGroupProps as AriaDisclosureGroupProps,
  UNSTABLE_DisclosurePanel as AriaDisclosurePanel,
  type DisclosurePanelProps as AriaDisclosurePanelProps,
  type DisclosureProps as AriaDisclosureProps,
  composeRenderProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { AnimateChangeInHeight } from "../AnimateChangeInHeight";
import { Button } from "../Button";

export interface DisclosureProps extends AriaDisclosureProps {
  title: React.ReactNode;
}

export function Disclosure({
  title,
  children,
  className,
  ...props
}: DisclosureProps) {
  return (
    <AriaDisclosure {...props}>
      {composeRenderProps(children, (children, { isExpanded }) => (
        <>
          <Button
            variant="ghost"
            className="w-full justify-between"
            slot="trigger"
            size="small"
          >
            {title}
            <RiArrowRightSLine
              size={16}
              className={twMerge(
                "transition-transform opacity-70",
                isExpanded && "rotate-90",
              )}
            />
          </Button>
          <AnimateChangeInHeight className="w-full">
            <DisclosurePanel className="pb-2">{children}</DisclosurePanel>
          </AnimateChangeInHeight>
        </>
      ))}
    </AriaDisclosure>
  );
}

interface DisclosurePanelProps extends AriaDisclosurePanelProps {}

export function DisclosurePanel({ children, ...props }: DisclosurePanelProps) {
  return <AriaDisclosurePanel {...props}>{children}</AriaDisclosurePanel>;
}

interface DisclosureGroupProps extends AriaDisclosureGroupProps {}

export function DisclosureGroup({ children, ...props }: DisclosureGroupProps) {
  return <AriaDisclosureGroup {...props}>{children}</AriaDisclosureGroup>;
}
