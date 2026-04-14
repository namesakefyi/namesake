import {
  type DropZoneProps,
  DropZone as RACDropZone,
} from "react-aria-components";
import "./DropZone.css";

export function DropZone(props: DropZoneProps) {
  return <RACDropZone {...props} />;
}
