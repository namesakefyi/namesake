import { Heading } from "react-aria-components";

interface StepProps {
  title: string;
  children: React.ReactNode;
}

export const Step = ({ title, children }: StepProps) => {
  return (
    <li className="relative pl-12 before:text-gray-dim before:size-8 before:rounded-full before:bg-gray-3 dark:before:bg-graydark-3 before:flex before:text-xl before:items-center before:justify-center before:content-[counter(steps)] before:[counter-increment:steps] before:absolute before:left-0 after:w-[2px] after:h-[calc(100%-2rem)] after:bg-gray-3 dark:after:bg-graydark-3 after:absolute after:bottom-0 after:left-[calc(1rem-1px)] after:last:invisible flex flex-col">
      <Heading className="text-2xl font-medium">{title}</Heading>
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
