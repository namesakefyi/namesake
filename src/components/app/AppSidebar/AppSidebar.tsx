import { AlertCircle } from "lucide-react";
import { PostHogErrorBoundary } from "posthog-js/react";
import { tv } from "tailwind-variants";
import { Empty } from "@/components/common";
import { useIsMobile } from "@/hooks/useIsMobile";

interface AppSidebarProps {
  children: React.ReactNode;
}

export const AppSidebar = ({ children }: AppSidebarProps) => {
  const isMobile = useIsMobile();

  const sidebarStyles = tv({
    base: "flex flex-col shrink-0 sticky top-0 h-screen max-h-full align-self-stretch bg-app",
    variants: {
      isMobile: {
        false:
          "w-72 lg:w-80 xl:w-[22rem] border-r border-overlay overflow-y-auto",
        true: "w-full",
      },
    },
  });

  return <div className={sidebarStyles({ isMobile })}>{children}</div>;
};

interface AppSidebarHeaderProps {
  children: React.ReactNode;
}

export const AppSidebarHeader = ({ children }: AppSidebarHeaderProps) => {
  const isMobile = useIsMobile();

  const headerStyles = tv({
    base: "flex items-center shrink-0 sticky top-0 bg-app z-40",
    variants: {
      isMobile: {
        false: "px-6",
      },
    },
  });

  return <div className={headerStyles({ isMobile })}>{children}</div>;
};

type AppSidebarContentProps = {
  children: React.ReactNode;
};

export const AppSidebarContent = ({ children }: AppSidebarContentProps) => {
  const isMobile = useIsMobile();

  const fallback = () => {
    return (
      <Empty
        title="Something went wrong"
        icon={AlertCircle}
        subtitle="We've been notified of the issue. Refresh the page to try again."
      />
    );
  };

  const contentStyles = tv({
    base: "flex-1 pt-1.5",
    variants: {
      isMobile: {
        false: "px-6",
      },
    },
  });

  return (
    <PostHogErrorBoundary fallback={fallback}>
      <div className={contentStyles({ isMobile })}>{children}</div>
    </PostHogErrorBoundary>
  );
};

type AppSidebarFooterProps = {
  children: React.ReactNode;
};

export const AppSidebarFooter = ({ children }: AppSidebarFooterProps) => {
  return (
    <div className="h-header shrink-0 flex items-center sticky bottom-0 bg-app z-20">
      {children}
    </div>
  );
};
