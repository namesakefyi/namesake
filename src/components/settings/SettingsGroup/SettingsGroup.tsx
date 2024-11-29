import { Card } from "@/components/common";
import { Heading } from "react-aria-components";

type SettingsGroupProps = {
  title: string;
  children: React.ReactNode;
};

export const SettingsGroup = ({ title, children }: SettingsGroupProps) => (
  <section className="flex flex-col gap-4 mb-8 last-of-type:mb-0">
    <Heading className="text-lg font-medium">{title}</Heading>
    <Card className="flex flex-col p-0 divide-y divide-gray-dim">
      {children}
    </Card>
  </section>
);
