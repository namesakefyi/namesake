import { Link, type LinkProps } from "@/components/common";
import { focusRing } from "@/components/utils";
import { useIsMobile } from "@/utils/useIsMobile";
import { useMatchRoute } from "@tanstack/react-router";
import { ChevronRight, ExternalLink, type LucideIcon } from "lucide-react";
import { tv } from "tailwind-variants";

type NavItemBaseProps = {
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
  size?: "medium" | "large";
};

type NavLinkProps = LinkProps;

type NavButtonProps = {
  onClick: () => void;
};

type NavItemProps = NavItemBaseProps & (NavLinkProps | NavButtonProps);

const navItemStyles = tv({
  extend: focusRing,
  base: "rounded-md gap-2 no-underline px-2 -mx-2 flex border border-transparent items-center text-base md:text-sm lg:text-base hover:bg-gray-3 hover:text-gray-12 aria-current:font-semibold aria-current:text-gray-normal cursor-pointer",
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
      <div className="flex flex-1 items-center gap-2">
        {Icon && <Icon className={iconStyles({ isActive: !!current, size })} />}
        {children}
      </div>
      {displayExternalLink && (
        <ExternalLink aria-hidden className="size-4 text-gray-8" />
      )}
      {displayChevron && (
        <ChevronRight aria-hidden className="size-5 -mr-0.5 text-gray-8" />
      )}
    </Link>
  );
};

interface NavGroupProps {
  children: React.ReactNode;
}

export const NavGroup = ({ children }: NavGroupProps) => {
  return (
    <div className="flex flex-col gap-0.5 pt-2 mt-2 border-t border-gray-dim first:mt-0 first:border-0 first:pt-0">
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
