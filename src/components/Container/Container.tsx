import { tv } from "tailwind-variants";

export interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

const containerStyles = tv({
  base: "max-w-full w-[1200px] px-4 lg:px-6 xl:px-8 mx-auto",
});

export function Container({ className, children }: ContainerProps) {
  return <div className={containerStyles({ className })}>{children}</div>;
}
