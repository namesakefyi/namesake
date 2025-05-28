import { Link, type LinkProps } from "@/components/common";
import { focusRing } from "@/components/utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMatchRoute } from "@tanstack/react-router";
import { ChevronRight, ExternalLink, type LucideIcon } from "lucide-react";
import { Heading } from "react-aria-components";
import { tv } from "tailwind-variants";

type NavItemBaseProps = {
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  size?: "medium" | "large";
};

type NavLinkProps = LinkProps;

type NavButtonProps = {
  onClick: () => void;
};

type NavItemProps = NavItemBaseProps & (NavLinkProps | NavButtonProps);

const navItemStyles = tv({
  extend: focusRing,
  base: "rounded-md gap-2 no-underline px-2 -mx-2 flex border border-transparent items-center text-base md:text-sm lg:text-base hover:bg-gray-3 text-gray-normal aria-current:font-semibold aria-current:text-gray-normal cursor-pointer",
  variants: {
    isActive: {
      true: "bg-gray-3 hover:bg-gray-3 text-gray-normal",
    },
    size: {
      medium: "h-9 md:h-8 lg:h-9",
      large: "h-12",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

const iconStyles = tv({
  base: "text-gray-dim shrink-0 stroke-[1.5px]",
  variants: {
    isActive: {
      true: "text-gray-normal",
    },
    size: {
      medium: "size-5",
      large: "bg-gray-a3 rounded-sm size-8 p-1",
    },
  },
  compoundVariants: [
    {
      size: "large",
      isActive: true,
      className: "stroke-[2px]",
    },
  ],
  defaultVariants: {
    size: "medium",
  },
});

export const NavItem = ({
  icon: Icon,
  className,
  children,
  actions,
  size,
  ...props
}: NavItemProps) => {
  const isMobile = useIsMobile();
  const matchRoute = useMatchRoute();
  let current: boolean | undefined;
  let displayExternalLink = false;
  let displayChevron = false;

  if ("href" in props) {
    if (typeof props.href === "string" || !props.href) {
      // Link is external, so we can't match it
      current = false;
    } else {
      current = Boolean(matchRoute({ ...props.href, fuzzy: true }));
    }

    displayExternalLink = props.target === "_blank";
    displayChevron = isMobile && !displayExternalLink;
  }

  return (
    <div className="grid *:[grid-area:1/1] ">
      <Link
        {...props}
        className={({ isFocusVisible }) =>
          navItemStyles({
            isFocusVisible,
            isActive: !!current,
            class: className,
            size,
          })
        }
        aria-current={current ? "true" : null}
      >
        <div className="flex flex-1 items-center gap-2 min-w-0 pointer-events-none">
          {Icon && (
            <Icon className={iconStyles({ isActive: !!current, size })} />
          )}
          {children}
        </div>
      </Link>
      <div className="justify-self-end flex items-center gap-1 z-10 pointer-events-none">
        <span className="pointer-events-auto">{actions}</span>
        {displayExternalLink && (
          <ExternalLink aria-hidden className="size-4 text-gray-8" />
        )}
        {displayChevron && (
          <ChevronRight aria-hidden className="size-5 -mr-0.5 text-gray-8" />
        )}
      </div>
    </div>
  );
};

interface NavGroupProps {
  children: React.ReactNode;
  label?: string;
  icon?: LucideIcon;
}

export const NavGroup = ({ children, label, icon: Icon }: NavGroupProps) => {
  return (
    <div className="flex flex-col gap-0.5 pt-2 mt-2 first:mt-0 border-gray-dim not-has-[header]:border-t first:border-0 first:pt-0">
      {label && (
        <header className="flex items-center gap-2 border-b border-gray-dim pb-2">
          {Icon && <Icon className="size-4 text-gray-dim" />}
          <Heading className="flex-1  text-sm font-medium text-gray-dim">
            {label}
          </Heading>
        </header>
      )}
      {children}
    </div>
  );
};

interface NavProps {
  children: React.ReactNode;
  className?: string;
}

export const Nav = ({ children, className }: NavProps) => {
  const navStyles = tv({ base: "flex flex-col gap-0.5 pb-4" });

  return <nav className={navStyles({ className })}>{children}</nav>;
};
