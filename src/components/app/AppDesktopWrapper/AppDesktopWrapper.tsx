import { twMerge } from "tailwind-merge";

type AppDesktopWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export const AppDesktopWrapper = ({
  children,
  className,
}: AppDesktopWrapperProps) => {
  return <div className={twMerge("flex min-w-0", className)}>{children}</div>;
};
