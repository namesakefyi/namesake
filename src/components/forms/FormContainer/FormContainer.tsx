import { Banner, Container, Form } from "@/components/common";
import { FormNavigation, FormSection } from "@/components/forms";
import { getFormSectionId } from "@/utils/getFormSectionId";
import { smartquotes } from "@/utils/smartquotes";
import {
  FormSectionContext,
  type FormSectionData,
} from "@/utils/useFormSections";
import { ShieldCheck } from "lucide-react";
import { Children, isValidElement, useMemo } from "react";
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

interface FormSectionProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function FormContainer({
  title,
  description,
  children,
  form,
  onSubmit,
}: FormContainerProps) {
  // Scan children for form sections
  const sections = useMemo(() => {
    const foundSections: FormSectionData[] = [];

    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === FormSection) {
        const props = child.props as FormSectionProps;
        const hash = getFormSectionId(props.title);
        foundSections.push({ hash, title: props.title });
      }
    });

    return foundSections;
  }, [children]);

  return (
    <FormProvider {...form}>
      <FormSectionContext value={{ sections }}>
        <FormNavigation title={title} />
        <Container className="w-full max-w-[720px] flex-1 py-16 px-6">
          <Form
            onSubmit={onSubmit}
            autoComplete="on"
            className="gap-0 divide-y divide-gray-a3"
          >
            <header className="flex flex-col gap-6 mb-8">
              <Heading className="text-4xl lg:text-5xl font-medium text-pretty">
                {title}
              </Heading>
              {description && (
                <p className="text-sm text-gray-dim">
                  {smartquotes(description)}
                </p>
              )}
              <Banner variant="success" icon={ShieldCheck} size="large">
                Namesake takes your privacy seriously. All responses are
                end-to-end encrypted. That means no one—not even Namesake—can
                see your answers.
              </Banner>
            </header>
            {children}
          </Form>
        </Container>
      </FormSectionContext>
    </FormProvider>
  );
}
