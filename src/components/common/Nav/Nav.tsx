import { focusRing } from "@/components/utils";
import { useMatchRoute } from "@tanstack/react-router";
import { ExternalLink, type LucideIcon } from "lucide-react";
import { Header } from "react-aria-components";
import { tv } from "tailwind-variants";
import { Badge } from "../Badge";
import { Link, type LinkProps } from "../Link";

interface NavItemProps extends LinkProps {
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}

const navItemStyles = tv({
  extend: focusRing,
  base: "rounded-md no-underline flex items-center text-sm lg:text-base gap-1.5 hover:bg-gray-3/50 dark:hover:bg-graydark-3/50 h-8 lg:h-9 px-2 -mx-2 aria-current:font-semibold aria-current:text-gray-normal",
  variants: {
    isActive: {
      true: "bg-gray-3 hover:bg-gray-3 dark:bg-graydark-3 dark:hover:bg-graydark-3",
    },
  },
});

const iconStyles = tv({
  base: "text-gray-dim",
  variants: {
    isActive: {
      true: "text-gray-normal",
    },
  },
});

export const NavItem = ({
  icon: Icon,
  className,
  children,
  ...props
}: NavItemProps) => {
  const matchRoute = useMatchRoute();
  let current: boolean | undefined;

  if (typeof props.href === "string") {
    // Link is external, so we can't match it
    current = false;
  } else {
    current = Boolean(matchRoute({ ...props.href, fuzzy: true }));
  }

  return (
    <Link
      {...props}
      className={({ isFocusVisible }) =>
        navItemStyles({
          isFocusVisible,
          isActive: !!current,
          class: className,
        })
      }
      aria-current={current ? "true" : null}
    >
      {Icon && (
        <Icon size={20} className={iconStyles({ isActive: !!current })} />
      )}
      {children}
      {props.target === "_blank" && (
        <ExternalLink
          aria-hidden
          className="size-4 ml-auto text-gray-8 dark:text-graydark-8"
        />
      )}
    </Link>
  );
};

interface NavGroupProps {
  label: string;
  children: React.ReactNode;
  count?: number;
  icon?: LucideIcon;
}

export const NavGroup = ({
  label,
  children,
  count,
  icon: Icon,
}: NavGroupProps) => {
  return (
    <div className="flex flex-col gap-0.5 [&:not(:first-child)]:mt-4">
      <Header className="text-sm h-8 font-medium text-gray-dim border-b border-gray-4 dark:border-graydark-4 flex justify-start items-center gap-1.5">
        {Icon && <Icon size={20} className="size-4" />}
        {label}
        {count && (
          <Badge size="xs" className="rounded-full">
            {count}
          </Badge>
        )}
      </Header>
      {children}
    </div>
  );
};

interface NavProps {
  children: React.ReactNode;
}

export const Nav = ({ children }: NavProps) => {
  return <nav className="flex flex-col gap-0.5">{children}</nav>;
};
