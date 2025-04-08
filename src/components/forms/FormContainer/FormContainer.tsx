import {
  Banner,
  Button,
  Container,
  Form,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { FormNavigation } from "@/components/forms";
import { smartquotes } from "@/utils/smartquotes";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Heading } from "react-aria-components";
import { FormProvider, type UseFormReturn } from "react-hook-form";

export interface FormContainerProps {
  /** The title of the page. */
  title: string;

  /** An optional description to provide more context. */
  description?: string;

  /** The contents of the page. */
  children?: React.ReactNode;

  /** The form from react-hook-form's useForm hook. */
  form: UseFormReturn<any>;

  /** Submit handler for the form. */
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function FormContainer({
  title,
  description,
  children,
  form,
  onSubmit,
}: FormContainerProps) {
  const { history } = useRouter();

  return (
    <FormProvider {...form}>
      <Container className="w-full max-w-[720px] py-16 px-6">
        <Form
          onSubmit={onSubmit}
          autoComplete="on"
          className="gap-0 divide-y divide-gray-a3"
        >
          <header className="flex flex-col gap-6 mb-8">
            <Heading className="text-5xl font-medium text-pretty">
              {title}
            </Heading>
            {description && (
              <p className="text-sm text-gray-dim">
                {smartquotes(description)}
              </p>
            )}
            <Banner variant="success" icon={ShieldCheck} size="large">
              Namesake takes your privacy seriously. All responses are
              end-to-end encrypted. That means no one—not even Namesake—can see
              your answers.
            </Banner>
          </header>
          {children}
        </Form>
      </Container>
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
    </FormProvider>
  );
}
