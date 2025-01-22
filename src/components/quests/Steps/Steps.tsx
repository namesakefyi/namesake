import { Heading } from "react-aria-components";

interface StepProps {
  title: string;
  children: React.ReactNode;
}

export const Step = ({ title, children }: StepProps) => {
  return (
    <li className="relative pl-12 before:text-gray-6 before:size-8 before:rounded-full before:bg-gray-3 dark:before:bg-graydark-3 before:flex before:items-center before:justify-center before:content-[counter(steps)] before:[counter-increment:steps] before:absolute before:left-0 flex flex-col">
      <Heading className="text-xl font-medium m-0 pt-0.5">{title}</Heading>
      <div className="pt-3 pb-8 text-gray-dim flex flex-col gap-4">
        {children}
      </div>
    </li>
  );
};

interface StepsProps {
  children: React.ReactNode;
}

export const Steps = ({ children }: StepsProps) => {
  return <ol className="flex flex-col [counter-reset:steps]">{children}</ol>;
};
