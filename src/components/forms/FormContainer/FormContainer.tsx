import {
  Button,
  Container,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import type { Jurisdiction } from "@convex/constants";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export interface FormContainerProps {
  /** The title of the quest. */
  title: string;
  /** The state for the quest. */
  jurisdiction?: Jurisdiction;
  /** The contents of the page. */
  children?: React.ReactNode;
}

export function FormContainer({ children }: FormContainerProps) {
  const { history } = useRouter();

  return (
    <main className="h-screen w-screen fixed overflow-y-scroll snap-y snap-proximity">
      <TooltipTrigger>
        <Button
          className="fixed top-4 left-4 z-10"
          onPress={() => {
            history.go(-1);
          }}
          aria-label="Go back"
          icon={ArrowLeft}
          variant="icon"
          size="large"
        />
        <Tooltip placement="right">Go back</Tooltip>
      </TooltipTrigger>
      <Container className="w-[720px]">{children}</Container>
    </main>
  );
}
