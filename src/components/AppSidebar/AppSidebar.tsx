import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import {
  RiAccountCircleFill,
  RiAddLine,
  RiAdminLine,
  RiSettings3Line,
} from "@remixicon/react";
import { useQuery } from "convex/react";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { Link } from "../Link";
import { Logo } from "../Logo";
import { Menu, MenuItem, MenuTrigger } from "../Menu";
import { Tooltip } from "../Tooltip";
import { TooltipTrigger } from "../Tooltip";

type AppSidebarProps = {
  children: React.ReactNode;
};

export const AppSidebar = ({ children }: AppSidebarProps) => {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.getCurrentUser);
  const isAdmin = user?.role === "admin";

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="w-72 flex flex-col shrink-0 sticky top-0 h-screen -ml-4 overflow-y-auto border-r border-gray-dim">
      <div className="flex gap-2 items-center h-16 shrink-0 px-4 sticky top-0 bg-gray-app z-20">
        <Link href={{ to: "/" }} className="p-1 -m-1">
          <Logo className="h-[1.25rem]" />
        </Link>
        <Badge className="-mb-1" variant="waiting">
          Beta
        </Badge>
        <div className="ml-auto">
          <TooltipTrigger>
            <Link
              href={{ to: "/browse" }}
              button={{
                variant: "icon",
                className: "-mr-1",
              }}
            >
              <RiAddLine size={20} />
            </Link>
            <Tooltip placement="right">Browse and add quests</Tooltip>
          </TooltipTrigger>
        </div>
      </div>
      <div className="px-4 flex-1">{children}</div>
      <div className="px-4 h-16 shrink-0 flex items-center sticky bottom-0 bg-gray-app">
        <MenuTrigger>
          <Button
            aria-label="User settings"
            variant="ghost"
            icon={RiAccountCircleFill}
          >
            {user?.name}
          </Button>
          <Menu placement="top start">
            <MenuItem
              href="https://namesake.fyi/chat"
              target="_blank"
              rel="noreferrer"
            >
              Support&hellip;
            </MenuItem>
            <MenuItem onAction={handleSignOut}>Sign out</MenuItem>
          </Menu>
        </MenuTrigger>
        <div className="flex ml-auto">
          {isAdmin && (
            <TooltipTrigger>
              <Link
                aria-label="Admin"
                href={{ to: "/admin" }}
                button={{ variant: "icon" }}
              >
                <RiAdminLine size={20} />
              </Link>
              <Tooltip placement="top">Admin</Tooltip>
            </TooltipTrigger>
          )}
          <TooltipTrigger>
            <Link
              aria-label="Settings"
              href={{ to: "/settings/overview" }}
              button={{ variant: "icon" }}
            >
              <RiSettings3Line size={20} />
            </Link>
            <Tooltip placement="top">Settings</Tooltip>
          </TooltipTrigger>
        </div>
      </div>
    </div>
  );
};
