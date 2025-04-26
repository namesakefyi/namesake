import { Empty } from "@/components/common";
import { AlertCircle } from "lucide-react";
import { PostHogErrorBoundary } from "posthog-js/react";

type AppSidebarProps = {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const AppSidebar = ({ header, children, footer }: AppSidebarProps) => {
  const fallback = () => {
    return (
      <Empty
        title="Something went wrong"
        icon={AlertCircle}
        subtitle="We've been notified of the issue. Refresh the page to try again."
      />
    );
  };

  return (
    <div className="w-72 lg:w-80 xl:w-[22rem] flex flex-col shrink-0 sticky top-0 h-screen max-h-full align-self-stretch overflow-y-auto bg-sidebar border-r border-gray-a4">
      <PostHogErrorBoundary fallback={fallback}>
        {header && (
          <div className="app-padding h-header flex items-center shrink-0 sticky top-0 bg-sidebar z-20">
            {header}
          </div>
        )}
        <div className="app-padding flex-1">{children}</div>
        {footer && (
          <div className="h-header shrink-0 flex items-center sticky bottom-0 bg-sidebar">
            {footer}
          </div>
        )}
      </PostHogErrorBoundary>
    </div>
  );
};
