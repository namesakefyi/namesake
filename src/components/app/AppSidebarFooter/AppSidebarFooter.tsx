import {
  Button,
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

export const AppSidebarFooter = () => {
  const { signOut } = useAuthActions();
  const { theme, themeSelection, setTheme } = useTheme();

  const user = useQuery(api.users.getCurrent);
  const isAdmin = user?.role === "admin";

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Authenticated>
      <MenuTrigger>
        <Button aria-label="User settings" variant="icon" icon={CircleUser} />
        <Menu placement="top start">
          {isAdmin && (
            <MenuItem icon={GlobeLock} href={{ to: "/admin" }}>
              Admin
            </MenuItem>
          )}
          <MenuItem href={{ to: "/settings" }} icon={Cog}>
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
  );
};
