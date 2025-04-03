import { Badge, Link, type LinkProps } from "@/components/common";
import { focusRing } from "@/components/utils";
import { useMatchRoute } from "@tanstack/react-router";
import { ExternalLink, type LucideIcon } from "lucide-react";
import { Header } from "react-aria-components";
import { tv } from "tailwind-variants";

interface NavItemProps extends LinkProps {
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
  size?: "medium" | "large";
}

const navItemStyles = tv({
  extend: focusRing,
  base: "rounded-md no-underline px-2 -mx-2 flex border border-transparent items-center text-base md:text-sm lg:text-base hover:bg-gray-3 hover:text-gray-12 aria-current:font-semibold aria-current:text-gray-normal",
  variants: {
    isActive: {
      true: "bg-gray-3 hover:bg-gray-3 text-gray-normal",
    },
    size: {
      medium: "h-10 md:h-8 lg:h-9 gap-1.5",
      large: "h-12 gap-2",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

const iconStyles = tv({
  base: "text-gray-dim shrink-0",
  variants: {
    isActive: {
      true: "text-gray-normal",
    },
    size: {
      medium: "size-5",
      large: "bg-gray-a3 rounded-sm size-8 p-1 stroke-[1.5px]",
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
          size,
        })
      }
      aria-current={current ? "true" : null}
    >
      {Icon && <Icon className={iconStyles({ isActive: !!current, size })} />}
      {children}
      {props.target === "_blank" && (
        <ExternalLink aria-hidden className="size-4 ml-auto text-gray-8" />
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
    <div className="flex flex-col gap-0.5 not-first:mt-4">
      <Header className="text-sm h-8 font-medium text-gray-dim border-b border-gray-4 flex justify-start items-center gap-1.5">
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
