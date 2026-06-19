import { type LinkProps, Link as RACLink } from "react-aria-components";
import "./Link.css";

export function Link(props: LinkProps) {
  return <RACLink {...props} />;
}
