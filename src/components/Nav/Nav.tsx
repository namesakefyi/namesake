import type { RemixiconComponentType } from "@remixicon/react";
import { type LinkProps, useMatchRoute } from "@tanstack/react-router";
import { Header } from "react-aria-components";
import { tv } from "tailwind-variants";
import { Badge } from "../Badge";
import { Link } from "../Link";
import { focusRing } from "../utils";

interface NavItemProps {
  href: LinkProps;
  icon?: RemixiconComponentType;
  className?: string;
  children?: React.ReactNode;
}

const navItemStyles = tv({
  extend: focusRing,
  base: "rounded-md no-underline flex items-center text-sm gap-1.5 hover:bg-gray-3 dark:hover:bg-graydark-3 h-8 px-2 -mx-2 aria-current:font-semibold aria-current:text-gray-normal",
  variants: {
    isActive: {
      true: "bg-gray-3 dark:bg-graydark-3",
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
  href,
  className,
  children,
}: NavItemProps) => {
  const matchRoute = useMatchRoute();
  const current = matchRoute({ ...href, fuzzy: true });

  return (
    <Link
      href={{ ...href }}
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
    </Link>
  );
};

interface NavGroupProps {
  label: string;
  children: React.ReactNode;
  count?: number;
}

export const NavGroup = ({ label, children, count }: NavGroupProps) => {
  return (
    <div className="flex flex-col gap-0.5 [&:not(:first-child)]:mt-4">
      <Header className="text-sm h-8 font-semibold text-gray-dim border-b border-gray-4 dark:border-graydark-4 flex justify-start items-center gap-1.5">
        {label}
        {count && <Badge size="xs">{count}</Badge>}
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
