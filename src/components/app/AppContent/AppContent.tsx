import { AlertCircle } from "lucide-react";
import { PostHogErrorBoundary } from "posthog-js/react";
import { twMerge } from "tailwind-merge";
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
      <main className={twMerge("flex-1 w-full container mx-auto", className)}>
        {children}
      </main>
    </PostHogErrorBoundary>
  );
};
