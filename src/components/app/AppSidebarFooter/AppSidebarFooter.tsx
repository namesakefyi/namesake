import { Link, Tooltip, TooltipTrigger } from "@/components/common";
import { api } from "@convex/_generated/api";
import { Authenticated, useQuery } from "convex/react";
import { Cog, GlobeLock } from "lucide-react";

export const AppSidebarFooter = () => {
  const user = useQuery(api.users.getCurrent);
  const isAdmin = user?.role === "admin";

  return (
    <Authenticated>
      <div className="flex items-center gap-1 justify-end w-full px-4">
        <TooltipTrigger>
          <Link
            button={{ variant: "icon" }}
            href={{ to: "/settings" }}
            aria-label="Settings"
          >
            <Cog className="size-5" />
          </Link>
          <Tooltip>Settings</Tooltip>
        </TooltipTrigger>
        {isAdmin && (
          <TooltipTrigger>
            <Link
              button={{ variant: "icon" }}
              href={{ to: "/admin" }}
              aria-label="Admin"
            >
              <GlobeLock className="size-5" />
            </Link>
            <Tooltip>Admin</Tooltip>
          </TooltipTrigger>
        )}
      </div>
    </Authenticated>
  );
};
