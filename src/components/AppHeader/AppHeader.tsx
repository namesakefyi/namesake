import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { RiAccountCircleFill } from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import { Authenticated, useQuery } from "convex/react";
import { Button } from "../Button";
import { Link } from "../Link";
import { Logo } from "../Logo";
import { Menu, MenuItem, MenuTrigger } from "../Menu";

export const AppHeader = () => {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();
  const role = useQuery(api.users.getCurrentUserRole);
  const isAdmin = role === "admin";

  const handleSignOut = async () => {
    await signOut().then(() => navigate({ to: "/signin" }));
  };

  return (
    <div className="flex shrink-0 gap-4 bg-gray-app items-center w-screen h-14 px-4 border-b border-gray-dim sticky top-0 z-20">
      <Link href={{ to: "/" }}>
        <Logo className="h-[1.25rem]" />
      </Link>
      <Authenticated>
        <Link href={{ to: "/" }}>Quests</Link>
        {isAdmin && <Link href={{ to: "/admin/quests" }}>Admin</Link>}
        <div className="ml-auto">
          <MenuTrigger>
            <Button
              aria-label="User settings"
              variant="icon"
              icon={RiAccountCircleFill}
            />
            <Menu>
              <MenuItem href={{ to: "/settings/overview" }}>Settings</MenuItem>
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
        </div>
      </Authenticated>
    </div>
  );
};
