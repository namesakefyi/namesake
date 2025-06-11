import { Button, type ButtonProps } from "@/components/common";
import { Heading } from "react-aria-components";

type QuestSectionProps = {
  title: string;
  children: React.ReactNode;
  action?: Omit<ButtonProps, "variant" | "size">;
};

export const QuestSection = ({
  title,
  children,
  action,
}: QuestSectionProps) => {
  return (
    <section>
      <div className="flex justify-between items-center border-b border-dim h-9 pb-1 mb-4">
        <Heading className="text-lg text-medium">{title}</Heading>
        {action && <Button variant="ghost" size="small" {...action} />}
      </div>
      {children}
    </section>
  );
};
