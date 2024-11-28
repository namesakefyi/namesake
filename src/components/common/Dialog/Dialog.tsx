import {
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  DialogTrigger as AriaDialogTrigger,
  type DialogTriggerProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

export interface DialogProps extends AriaDialogProps {}

export function Dialog(props: DialogProps) {
  return (
    <AriaDialog
      {...props}
      className={twMerge(
        "outline outline-0 p-0 max-h-[inherit] relative",
        props.className,
      )}
    />
  );
}

export function DialogTrigger(props: DialogTriggerProps) {
  return <AriaDialogTrigger {...props} />;
}
