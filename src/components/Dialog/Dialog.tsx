import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  type DialogProps,
  type DialogTriggerProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

export function Dialog(props: DialogProps) {
  return (
    <AriaDialog
      {...props}
      className={twMerge(
        "outline outline-0 p-6 [[data-placement]>&]:p-4 max-h-[inherit] overflow-auto relative",
        props.className,
      )}
    />
  );
}

export function DialogTrigger(props: DialogTriggerProps) {
  return <AriaDialogTrigger {...props} />;
}
