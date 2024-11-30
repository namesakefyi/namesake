import {
  Modal as AriaModal,
  Heading,
  ModalOverlay,
  type ModalOverlayProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Dialog } from "../Dialog";

const overlayStyles = tv({
  base: "fixed top-0 left-0 w-full h-[--visual-viewport-height] isolate z-20 bg-black/[15%] flex items-center justify-center p-4 backdrop-blur-lg",
  variants: {
    isEntering: {
      true: "animate-in fade-in duration-2 ease-out",
    },
    isExiting: {
      true: "animate-out fade-out duration-2 ease-in",
    },
  },
});

const modalStyles = tv({
  base: "p-5 w-[400px] max-w-full max-h-full rounded-2xl bg-gray-subtle forced-colors:bg-[Canvas] flex flex-col items-start gap-4 shadow-2xl bg-clip-padding border border-gray-dim",
  variants: {
    isEntering: {
      true: "animate-in zoom-in-105 ease-out duration-2",
    },
    isExiting: {
      true: "animate-out zoom-out-95 ease-in duration-2",
    },
  },
});

export function Modal(props: ModalOverlayProps) {
  return (
    <ModalOverlay {...props} className={overlayStyles}>
      <Dialog>
        <AriaModal {...props} className={modalStyles}>
          {props.children}
        </AriaModal>
      </Dialog>
    </ModalOverlay>
  );
}

type ModalHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export function ModalHeader({ title, children }: ModalHeaderProps) {
  return (
    <header className="flex items-center justify-between w-full">
      <Heading className="text-xl font-medium text-gray-normal" slot="title">
        {title}
      </Heading>
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
