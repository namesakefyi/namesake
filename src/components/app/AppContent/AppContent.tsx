import { tv } from "tailwind-variants";

type AppContentProps = {
  children: React.ReactNode;
  className?: string;
};

export const AppContent = ({ children, className }: AppContentProps) => {
  const styles = tv({
    base: "flex-1 w-full max-w-[960px] mx-auto",
  });
  return <main className={styles({ className })}>{children}</main>;
};
