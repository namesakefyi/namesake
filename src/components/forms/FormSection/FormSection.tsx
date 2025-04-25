import { getFormQuestionHash } from "@/utils/getFormQuestionHash";
import { smartquotes } from "@/utils/smartquotes";
import { Heading } from "react-aria-components";
import { twMerge } from "tailwind-merge";

export interface FormSectionProps {
  /** The title of the section. */
  title: string;

  /** The description of the section. */
  description?: string;

  /** The contents of the page. */
  children?: React.ReactNode;

  /** Optional styles for the container. */
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <fieldset
      id={getFormQuestionHash(title)}
      data-form-section
      data-testid="form-section"
      className={twMerge("flex flex-col gap-8 py-12 justify-center", className)}
    >
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
      {children}
    </fieldset>
  );
}

interface FormSubsectionProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  isVisible?: boolean;
}

export function FormSubsection({
  title,
  children,
  className,
  isVisible = true,
}: FormSubsectionProps) {
  if (!isVisible) return null;

  return (
    <fieldset
      className={twMerge(
        "flex flex-col gap-8 pl-6 py-2 border-l-3 border-gray-a3 justify-center",
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
