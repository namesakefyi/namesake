import { twMerge } from "tailwind-merge";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={twMerge(
        "p-6 text-normal bg-app border border-dim rounded-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
