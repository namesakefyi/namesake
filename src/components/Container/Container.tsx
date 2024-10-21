import { twMerge } from "tailwind-merge";

export interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export function Container({ className, children }: ContainerProps) {
  return (
    <div className={twMerge("w-full flex-1 p-6 mx-auto", className)}>
      {children}
    </div>
  );
}
