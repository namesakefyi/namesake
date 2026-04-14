import { RiArrowDropRightLine } from "@remixicon/react";
import {
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  Button,
  type DisclosurePanelProps,
  type DisclosureProps,
  type HeadingProps,
} from "react-aria-components";
import { Heading } from "../Content";
import "./Disclosure.css";

export function Disclosure(props: DisclosureProps) {
  return <AriaDisclosure {...props} />;
}

export function DisclosureHeader({ children, ...props }: HeadingProps) {
  return (
    <Heading {...props}>
      <Button slot="trigger">
        <RiArrowDropRightLine size={24} />
        {children}
      </Button>
    </Heading>
  );
}

export function DisclosurePanel(props: DisclosurePanelProps) {
  return (
    <AriaDisclosurePanel {...props}>
      <div>{props.children}</div>
    </AriaDisclosurePanel>
  );
}
