import {
  type ModalOverlayProps,
  Modal as RACModal,
} from "react-aria-components";
import "./Modal.css";

export function Modal(props: ModalOverlayProps) {
  return <RACModal {...props} />;
}
