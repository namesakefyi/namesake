import { ArrowLeft } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { Link, type LinkProps } from "@/components/common";
import { useIsMobile } from "@/hooks/useIsMobile";
import { formatPageTitle } from "@/utils/formatPageTitle";

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
  /** Whether the contents of the header should stretch to fill the width of the container.
   * @default false
   */
  fullWidth?: boolean;
}

export const PageHeader = ({
  title,
  mobileBackLink,
  badge,
  children,
  className,
  fullWidth = false,
}: PageHeaderProps) => {
  const isMobile = useIsMobile();

  const containerStyles = tv({
    base: "flex mx-auto h-full shrink-0 items-center justify-between gap-6",
    variants: {
      fullWidth: {
        true: "max-w-full",
        false: "max-w-(--container-width)",
      },
    },
  });

  return (
    <header
      className={twMerge(
        "h-header px-(--app-gutter) full-bleed bg-app text-normal sticky top-0 z-20",
        className,
      )}
    >
      <title>{formatPageTitle(title)}</title>
      <div className={containerStyles({ fullWidth })}>
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
