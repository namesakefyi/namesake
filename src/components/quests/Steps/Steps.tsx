import { Skeleton, SkeletonText } from "@/components/common";
import { Heading } from "react-aria-components";
import { twMerge } from "tailwind-merge";

interface StepProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
  actions?: React.ReactNode;
  isLoading?: boolean;
}

export const Step = ({
  title,
  children,
  className,
  actions,
  isLoading,
}: StepProps) => {
  return (
    <li
      className={twMerge(
        "relative pl-12 pb-8 last:pb-0 before:text-gray-dim before:size-8 before:rounded-full before:bg-gray-3 dark:before:bg-graydark-3 before:flex before:text-xl before:items-center before:justify-center before:content-[counter(steps)] before:[counter-increment:steps] before:absolute before:left-0 after:w-[2px] after:h-[calc(100%-2rem)] after:bg-gray-3 dark:after:bg-graydark-3 after:absolute after:bottom-0 after:left-[calc(1rem-1px)] last:after:invisible flex flex-col",
        className,
      )}
    >
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="max-w-60 h-8" />
          <SkeletonText lines={3} />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            {title && (
              <Heading className="text-2xl font-medium pb-3">{title}</Heading>
            )}
            {actions}
          </div>
          {children && (
            <div className="text-gray-dim flex flex-col gap-4">{children}</div>
          )}
        </>
      )}
    </li>
  );
};

interface StepsProps {
  children: React.ReactNode;
}

export const Steps = ({ children }: StepsProps) => {
  return <ol className="flex flex-col [counter-reset:steps]">{children}</ol>;
};
