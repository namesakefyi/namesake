import {
  type DialogProps,
  type DialogTriggerProps,
  Dialog as RACDialog,
  DialogTrigger as RACDialogTrigger,
} from "react-aria-components";
import "./Dialog.css";

export function Dialog(props: DialogProps) {
  return <RACDialog {...props} />;
}

export function DialogTrigger(props: DialogTriggerProps) {
  return <RACDialogTrigger {...props} />;
}
