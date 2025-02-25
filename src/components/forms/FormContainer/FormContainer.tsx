import {
  Button,
  Container,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { FormNavigation } from "@/components/forms";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export interface FormContainerProps {
  /** The contents of the page. */
  children?: React.ReactNode;
}

export function FormContainer({ children }: FormContainerProps) {
  const { history } = useRouter();

  return (
    <main className="h-screen w-screen fixed overflow-y-scroll snap-y snap-proximity">
      <Container className="w-[720px]">{children}</Container>
      {/* Intentionally placed *after* content to prioritize tab order */}
      <TooltipTrigger>
        <Button
          className="fixed top-4 left-4 z-10"
          onPress={() => {
            history.go(-1);
          }}
          aria-label="Save and exit"
          icon={ArrowLeft}
          variant="icon"
          size="large"
        />
        <Tooltip placement="right">Save and exit</Tooltip>
      </TooltipTrigger>
      <FormNavigation />
    </main>
  );
}
