import { ArrowLeft } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Link, type LinkProps } from "@/components/common";
import { useIsMobile } from "@/hooks/useIsMobile";

export interface PageHeaderProps {
  /** The title of the page. */
  title: string;
  /** An arrow button which only displays on mobile devices. */
  mobileBackLink?: LinkProps["href"];
  /** A badge which displays inline to the right of the title. */
  badge?: React.ReactNode;
  /**
   * Additional content to display to the right of the title.
   * Often used for buttons.
   */
  children?: React.ReactNode;
  /** Additional classes to apply to the header. */
  className?: string;
}

export const PageHeader = ({
  title,
  mobileBackLink,
  badge,
  children,
  className,
}: PageHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <header
      className={twMerge(
        "h-header px-(--app-gutter) full-bleed bg-app text-normal sticky top-0 z-20",
        className,
      )}
    >
      <div className="flex max-w-(--container-width) mx-auto h-full shrink-0 items-center justify-between gap-6">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex gap-2 items-center">
            {isMobile && mobileBackLink && (
              <Link
                href={mobileBackLink}
                button={{ variant: "icon" }}
                className="-ml-2 -mr-1"
              >
                <ArrowLeft className="size-5" />
              </Link>
            )}
            <h1 className="text-xl lg:text-2xl truncate font-medium">
              {title}
            </h1>
            {badge}
          </div>
        </div>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
};
