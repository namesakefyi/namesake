import {
  Link,
  type LinkProps,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { useIsMobile } from "@/hooks/useIsMobile";
import { api } from "@convex/_generated/api";
import { type ToOptions, useMatchRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { File, GlobeLock, Home, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { tv } from "tailwind-variants";

interface AppNavItemProps extends Omit<LinkProps, "href"> {
  icon: LucideIcon;
  label: string;
  href: ToOptions;
}

const navItemStyles = tv({
  base: "font-medium flex flex-col items-center h-12 gap-0.5 justify-center no-underline text-xs text-gray-dim hover:text-gray-normal leading-none rounded-md py-1 px-2 transition-colors",
  variants: {
    isActive: {
      false: "text-gray-dim",
      true: "text-gray-normal",
    },
  },
});

const iconStyles = tv({
  variants: {
    isActive: {
      false: "text-gray-9 stroke-[1.5px]",
      true: "text-gray-11 stroke-2",
    },
  },
});

const AppNavItem = ({ icon: Icon, label, ...props }: AppNavItemProps) => {
  const matchRoute = useMatchRoute();
  const isMobile = useIsMobile();

  const isActive =
    label === "Home"
      ? Boolean(
          matchRoute({ to: "/", fuzzy: true }) ||
            matchRoute({ to: "/quests/$questSlug", fuzzy: true }),
        )
      : Boolean(matchRoute({ ...props.href, fuzzy: true }));

  if (isMobile) {
    return (
      <Link {...props} className={navItemStyles({ isActive })}>
        <Icon className={iconStyles({ isActive })} />
        {label}
      </Link>
    );
  }

  return (
    <TooltipTrigger>
      <Link {...props} className={navItemStyles({ isActive })}>
        <Icon className={iconStyles({ isActive })} />
      </Link>
      <Tooltip offset={0}>{label}</Tooltip>
    </TooltipTrigger>
  );
};

export const AppNav = () => {
  const user = useQuery(api.users.getCurrent);
  const isAdmin = user?.role === "admin";
  const isMobile = useIsMobile();

  const styles = tv({
    base: "w-full shrink-0 flex *:flex-1 *:shrink-0 gap-1 h-mobile-nav p-1 items-center ",
    variants: {
      isMobile: {
        true: "fixed bottom-0 bg-element border-t border-gray-a4 shadow-2xl",
        false: "absolute bottom-0 bg-sidebar",
      },
    },
  });

  return (
    <div className={styles({ isMobile })}>
      <AppNavItem icon={Home} label="Home" href={{ to: "/" }} />
      <AppNavItem icon={File} label="Documents" href={{ to: "/documents" }} />
      <AppNavItem icon={Settings} label="Settings" href={{ to: "/settings" }} />
      {isAdmin && (
        <AppNavItem icon={GlobeLock} label="Admin" href={{ to: "/admin" }} />
      )}
    </div>
  );
};
