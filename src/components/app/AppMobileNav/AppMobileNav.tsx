import { Link, type LinkProps } from "@/components/common";
import { type ToOptions, useMatchRoute } from "@tanstack/react-router";
import { Home, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { tv } from "tailwind-variants";

interface AppMobileNavItemProps extends Omit<LinkProps, "href"> {
  icon: LucideIcon;
  label: string;
  href: ToOptions;
}

const navItemStyles = tv({
  base: "flex flex-col items-center h-12 gap-0.5 justify-center no-underline text-xs text-gray-dim hover:text-gray-normal leading-none rounded-md py-1 px-2 transition-colors",
  variants: {
    isActive: {
      true: "text-gray-normal font-bold",
    },
  },
});

const AppMobileNavItem = ({
  icon: Icon,
  label,
  ...props
}: AppMobileNavItemProps) => {
  const matchRoute = useMatchRoute();

  const isActive =
    label === "Home"
      ? Boolean(
          matchRoute({ to: "/", fuzzy: true }) ||
            matchRoute({ to: "/quests/$questSlug", fuzzy: true }),
        )
      : Boolean(matchRoute({ ...props.href, fuzzy: true }));

  return (
    <Link {...props} className={navItemStyles({ isActive })}>
      <Icon className="opacity-80" />
      {label}
    </Link>
  );
};

export const AppMobileNav = () => {
  return (
    <div className="w-full shrink-0 bg-element border-t border-gray-a4 grid grid-cols-2 gap-1 p-2 items-center sticky bottom-0 mt-auto shadow-2xl">
      <AppMobileNavItem icon={Home} label="Home" href={{ to: "/" }} />
      <AppMobileNavItem
        icon={Settings}
        label="Settings"
        href={{ to: "/settings" }}
      />
    </div>
  );
};
