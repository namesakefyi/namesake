import { Empty } from "@/components/common";
import { AlertCircle } from "lucide-react";
import { PostHogErrorBoundary } from "posthog-js/react";
import { tv } from "tailwind-variants";

type AppContentProps = {
  children: React.ReactNode;
  className?: string;
};

export const AppContent = ({ children, className }: AppContentProps) => {
  const styles = tv({
    base: "flex-1 w-full min-w-0 max-w-[960px] mx-auto",
  });

  const fallback = () => {
    return (
      <Empty
        title="Something went wrong"
        subtitle="We've been notified of the issue. Refresh the page to try again."
        icon={AlertCircle}
      />
    );
  };

  return (
    <PostHogErrorBoundary fallback={fallback}>
      <main className={styles({ className })}>{children}</main>
    </PostHogErrorBoundary>
  );
};
