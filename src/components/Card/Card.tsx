import { twMerge } from "tailwind-merge";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={twMerge(
        className,
        "p-4 bg-gray-subtle border border-gray-dim rounded-xl",
      )}
    >
      {children}
    </div>
  );
}
