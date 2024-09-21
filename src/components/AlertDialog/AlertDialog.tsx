import { RiAlertLine, RiInformationLine } from "@remixicon/react";
import type { ReactNode } from "react";
import { chain } from "react-aria";
import { Heading } from "react-aria-components";
import { Button } from "../Button";
import { Dialog, type DialogProps } from "../Dialog";

interface AlertDialogProps extends Omit<DialogProps, "children"> {
  title: string;
  children: ReactNode;
  variant?: "info" | "destructive";
  actionLabel: string;
  cancelLabel?: string;
  onAction?: () => void;
}

export function AlertDialog({
  title,
  variant,
  cancelLabel,
  actionLabel,
  onAction,
  children,
  ...props
}: AlertDialogProps) {
  return (
    <Dialog role="alertdialog" {...props}>
      {({ close }) => (
        <>
          <Heading
            slot="title"
            className="text-xl font-medium text-gray-normal leading-6 my-0"
          >
            {title}
          </Heading>
          <div
            className={`w-6 h-6 absolute right-6 top-6 stroke-2 ${variant === "destructive" ? "text-red-9 dark:text-reddark-9" : "text-blue-9 dark:text-bluedark-9"}`}
          >
            {variant === "destructive" ? (
              <RiAlertLine aria-hidden />
            ) : (
              <RiInformationLine aria-hidden />
            )}
          </div>
          <p className="mt-3 text-gray-dim">{children}</p>
          <div className="mt-6 flex justify-end gap-2">
            <Button onPress={close}>{cancelLabel || "Cancel"}</Button>
            <Button
              variant={variant === "destructive" ? "destructive" : "primary"}
              autoFocus
              onPress={chain(onAction, close)}
            >
              {actionLabel}
            </Button>
          </div>
        </>
      )}
    </Dialog>
  );
}
