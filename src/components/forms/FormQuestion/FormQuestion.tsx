import { Heading } from "react-aria-components";

export interface FormQuestionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function FormQuestion({
  title,
  description,
  children,
}: FormQuestionProps) {
  return (
    <section className="flex flex-col">
      <Heading className="text-2xl font-semibold text-gray-normal">
        {title}
      </Heading>
      {description && <p className="text-base text-gray-dim">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
