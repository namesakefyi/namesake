import { Heading } from "react-aria-components";

type SettingsGroupProps = {
  title: string;
  children: React.ReactNode;
};

export const SettingsGroup = ({ title, children }: SettingsGroupProps) => (
  <section className="flex flex-col mb-8 last-of-type:mb-0">
    <Heading className="text-lg font-medium mb-4">{title}</Heading>
    {children}
  </section>
);
