import {
  type DisclosureGroupProps,
  DisclosureGroup as RACDisclosureGroup,
} from "react-aria-components";
import "./DisclosureGroup.css";

export function DisclosureGroup(props: DisclosureGroupProps) {
  return <RACDisclosureGroup {...props} />;
}
