import { Dialog } from "@/components/common";
import {
  Modal as AriaModal,
  Heading,
  ModalOverlay,
  type ModalOverlayProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const overlayStyles = tv({
  base: "fixed top-0 left-0 w-full h-(--visual-viewport-height) isolate z-20 bg-black/[15%] flex items-center justify-center p-4 backdrop-blur-lg",
  variants: {
    isEntering: {
      true: "animate-in fade-in duration-200 ease-out",
    },
    isExiting: {
      true: "animate-out fade-out duration-200 ease-in",
    },
  },
});

const modalStyles = tv({
  base: "p-5 w-[400px] max-w-full max-h-full rounded-2xl bg-app forced-colors:bg-[Canvas] flex flex-col items-start gap-4 shadow-2xl bg-clip-padding border border-dim",
  variants: {
    isEntering: {
      true: "animate-in zoom-in-105 ease-out duration-200",
    },
    isExiting: {
      true: "animate-out zoom-out-95 ease-in duration-200",
    },
  },
});

export function Modal({ className, ...props }: ModalOverlayProps) {
  return (
    <ModalOverlay {...props} className={overlayStyles}>
      <Dialog>
        <AriaModal
          {...props}
          className={composeRenderProps(className, (className, renderProps) =>
            modalStyles({ ...renderProps, className }),
          )}
        >
          {props.children}
        </AriaModal>
      </Dialog>
    </ModalOverlay>
  );
}

type ModalHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function ModalHeader({
  title,
  description,
  children,
}: ModalHeaderProps) {
  return (
    <header className="flex items-center justify-between w-full">
      <div className="flex flex-col gap-1">
        <Heading className="text-xl font-medium text-normal" slot="title">
          {title}
        </Heading>
        {description && (
          <p className="text-dim text-sm text-pretty">{description}</p>
        )}
      </div>
      {children}
    </header>
  );
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <footer className="flex w-full justify-end items-center gap-2">
      {children}
    </footer>
  );
}
