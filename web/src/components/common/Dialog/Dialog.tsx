import clsx from "clsx";
import {
  type DialogProps,
  type DialogTriggerProps,
  Dialog as RACDialog,
  DialogTrigger as RACDialogTrigger,
} from "react-aria-components";
import "./Dialog.css";

export function Dialog({ className, ...props }: DialogProps) {
  return (
    <RACDialog {...props} className={clsx("react-aria-Dialog", className)} />
  );
}

export function DialogTrigger(props: DialogTriggerProps) {
  return <RACDialogTrigger {...props} />;
}
