import { RiArrowDownSLine, RiArrowRightSLine } from "@remixicon/react";
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
            icon={isExpanded ? RiArrowDownSLine : RiArrowRightSLine}
            variant="ghost"
            className="w-full justify-start"
            slot="trigger"
            size="small"
          >
            {title}
          </Button>
          <DisclosurePanel
            className={twMerge(
              "transition-all pl-7 pb-2",
              isExpanded && "h-auto",
              !isExpanded && "h-0",
            )}
          >
            {children}
          </DisclosurePanel>
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
