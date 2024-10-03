import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { RiAccountCircleFill } from "@remixicon/react";
import { Authenticated, useQuery } from "convex/react";
import { Button } from "../Button";
import { Link } from "../Link";
import { Logo } from "../Logo";
import { Menu, MenuItem, MenuSeparator, MenuTrigger } from "../Menu";

export const AppHeader = () => {
  const { signOut } = useAuthActions();
  const role = useQuery(api.users.getCurrentUserRole);
  const isAdmin = role === "admin";

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="flex gap-4 bg-gray-app items-center w-screen h-14 px-4 border-b border-gray-dim sticky top-0 z-50">
      <Link href={{ to: "/" }}>
        <Logo className="h-[1.25rem]" />
      </Link>
      <Authenticated>
        {isAdmin && <Link href={{ to: "/admin" }}>Admin</Link>}
        <div className="ml-auto">
          <MenuTrigger>
            <Button
              aria-label="User settings"
              variant="icon"
              icon={RiAccountCircleFill}
            />
            <Menu>
              <MenuItem href={{ to: "/settings" }}>Settings</MenuItem>
              <MenuSeparator />
              <MenuItem
                href="https://namesake.fyi/chat"
                target="_blank"
                rel="noreferrer"
              >
                Support&hellip;
              </MenuItem>
              <MenuSeparator />
              <MenuItem onAction={handleSignOut}>Sign out</MenuItem>
            </Menu>
          </MenuTrigger>
        </div>
      </Authenticated>
    </div>
  );
};
