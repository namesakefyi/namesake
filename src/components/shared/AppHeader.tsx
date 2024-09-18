import { useAuthActions } from "@convex-dev/auth/react";
import { RiAccountCircleFill } from "@remixicon/react";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button, Link, Menu, MenuItem, MenuSeparator, MenuTrigger } from "..";

export const AppHeader = () => {
  const { signOut } = useAuthActions();

  return (
    <div className="flex gap-4 items-center w-screen py-3 px-4 border-b border-gray-dim">
      <Link href={{ to: "/" }}>Namesake</Link>
      <Authenticated>
        {/* TODO: Gate this by role */}
        <Link href={{ to: "/admin" }}>Admin</Link>
      </Authenticated>
      <div className="ml-auto">
        <Authenticated>
          <MenuTrigger>
            <Button aria-label="User settings" variant="icon">
              <RiAccountCircleFill />
            </Button>
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
              <MenuItem onAction={signOut}>Sign Out</MenuItem>
            </Menu>
          </MenuTrigger>
        </Authenticated>
        <Unauthenticated>
          <Link href={{ to: "/signin" }}>Register or Sign In</Link>
        </Unauthenticated>
      </div>
    </div>
  );
};
