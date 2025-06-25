import { AlertCircle } from "lucide-react";
import { PostHogErrorBoundary } from "posthog-js/react";
import { Empty } from "@/components/common";

type AppContentProps = {
  children: React.ReactNode;
  className?: string;
};

export const AppContent = ({ children, className }: AppContentProps) => {
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
      <main className="flex-1 w-full min-w-0">
        <div className={`app-content ${className}`}>{children}</div>
      </main>
    </PostHogErrorBoundary>
  );
};
