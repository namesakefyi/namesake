import { Heading } from "react-aria-components";
import { smartquotes } from "#lib/utils/smartquotes";

interface FormSubsectionProps {
  title?: string;
  children?: React.ReactNode;
}

/** A titled group of questions within a step. */
export function FormSubsection({ title, children }: FormSubsectionProps) {
  return (
    <fieldset className="form-subsection">
      {title && <Heading>{smartquotes(title)}</Heading>}
      {children}
    </fieldset>
  );
}
