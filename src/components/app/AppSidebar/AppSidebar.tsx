import { Logo } from "@/components/app";
import {
  Badge,
  Button,
  Link,
  Menu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  SubmenuTrigger,
} from "@/components/common";
import { useTheme } from "@/utils/useTheme";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { THEMES, type Theme } from "@convex/constants";
import { Authenticated, useQuery } from "convex/react";
import { CircleUser, Cog, GlobeLock, LogOut } from "lucide-react";

type AppSidebarProps = {
  children: React.ReactNode;
};

export const AppSidebar = ({ children }: AppSidebarProps) => {
  const { signOut } = useAuthActions();
  const { theme, themeSelection, setTheme } = useTheme();

  const user = useQuery(api.users.getCurrent);
  const isAdmin = user?.role === "admin";

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="w-72 lg:w-80 xl:w-[22rem] flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto bg-sidebar border-r border-gray-a4">
      <div className="app-padding h-header flex gap-2 items-center shrink-0 sticky top-0 bg-sidebar z-20">
        <Link href={{ to: "/" }} className="p-1 -m-1">
          <Logo className="h-5 lg:h-[1.35rem]" />
        </Link>
        <Badge className="-mb-1" variant="waiting">
          Early Access
        </Badge>
      </div>
      <div className="app-padding flex-1">{children}</div>
      <div className="app-padding h-header -ml-3 shrink-0 flex items-center sticky bottom-0 bg-sidebar">
        <Authenticated>
          <MenuTrigger>
            <Button
              aria-label="User settings"
              variant="icon"
              icon={CircleUser}
            />
            <Menu placement="top start">
              {isAdmin && (
                <MenuItem icon={GlobeLock} href={{ to: "/admin" }}>
                  Admin
                </MenuItem>
              )}
              <MenuItem href={{ to: "/settings/account" }} icon={Cog}>
                Settings and Help
              </MenuItem>
              <SubmenuTrigger>
                <MenuItem icon={THEMES[theme as Theme].icon} textValue="Theme">
                  <span>Theme</span>
                  <span slot="shortcut" className="ml-auto text-gray-dim">
                    {THEMES[theme as Theme].label}
                  </span>
                </MenuItem>
                <Menu
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={themeSelection}
                  onSelectionChange={setTheme}
                >
                  {Object.entries(THEMES).map(([theme, details]) => (
                    <MenuItem key={theme} id={theme} icon={details.icon}>
                      {details.label}
                    </MenuItem>
                  ))}
                </Menu>
              </SubmenuTrigger>
              <MenuSeparator />
              <MenuItem icon={LogOut} onAction={handleSignOut}>
                Sign out
              </MenuItem>
            </Menu>
          </MenuTrigger>
        </Authenticated>
      </div>
    </div>
  );
};
