import { twMerge } from "tailwind-merge";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={twMerge(
        "p-6 text-gray-normal bg-element border border-gray-dim rounded-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
