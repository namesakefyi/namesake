import { smartquotes } from "@/helpers/smartquotes";
import { Heading } from "react-aria-components";
import { twMerge } from "tailwind-merge";

interface FormHeaderProps {
  /** The question rendered at the top of the page. */
  title: string;

  /** An optional description to provide more context. */
  description?: string;
}

function FormHeader({ title, description }: FormHeaderProps) {
  return (
    <header className="flex flex-col gap-2">
      <Heading
        className="text-3xl font-medium text-gray-normal text-pretty"
        data-section-title
      >
        {smartquotes(title)}
      </Heading>
      {description && (
        <p className="text-lg text-gray-dim text-pretty">
          {smartquotes(description)}
        </p>
      )}
    </header>
  );
}

function getQuestionId(question: string) {
  let sanitizedQuestion = question;
  // Remove trailing punctuation
  sanitizedQuestion = sanitizedQuestion.replace(/[^\w\s]/g, "");
  // Remove apostrophes
  sanitizedQuestion = sanitizedQuestion.replace(/'/g, "");

  return encodeURIComponent(sanitizedQuestion.toLowerCase().replace(/ /g, "-"));
}

export interface FormSectionProps extends FormHeaderProps {
  /** The contents of the page. */
  children?: React.ReactNode;

  /** Optional styles for the container. */
  className?: string;

  /**
   * Whether the section is visible.
   * @default true
   */
  isVisible?: boolean;
}

export function FormSection({
  title,
  description,
  children,
  className,
  isVisible = true,
}: FormSectionProps) {
  if (!isVisible) return null;

  return (
    <fieldset
      id={getQuestionId(title)}
      data-form-section
      data-testid="form-section"
      className={twMerge(
        "flex flex-col gap-8 p-8 pb-9 justify-center outline outline-1 outline-graya-4 dark:outline-graydarka-4 shadow-sm rounded-2xl bg-white dark:bg-graydark-2",
        className,
      )}
      // TODO: React-hook-form is supposed to prevent disabled fields from being submitted
      // but it's not working for some reason
      disabled={!isVisible}
    >
      <FormHeader title={title} description={description} />
      {children}
    </fieldset>
  );
}

interface FormSubSectionProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  isVisible?: boolean;
}

export function FormSubSection({
  title,
  children,
  className,
  isVisible = true,
}: FormSubSectionProps) {
  if (!isVisible) return null;

  return (
    <fieldset
      className={twMerge(
        "flex flex-col gap-8 -mx-8 px-8 pt-8 border-t border-graya-3 dark:border-graydarka-3 justify-center",
        className,
      )}
      disabled={!isVisible}
    >
      {title && (
        <Heading className="text-2xl font-medium text-gray-normal text-pretty">
          {smartquotes(title)}
        </Heading>
      )}
      {children}
    </fieldset>
  );
}
