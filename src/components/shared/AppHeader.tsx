import { useAuthActions } from "@convex-dev/auth/react";
import { RiAccountCircleFill } from "@remixicon/react";
import { useQuery } from "convex/react";
import {
  Button,
  Link,
  Logo,
  Menu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "..";
import { api } from "../../../convex/_generated/api";

export const AppHeader = () => {
  const { signOut } = useAuthActions();
  const role = useQuery(api.users.getCurrentUserRole);
  const isAdmin = role === "admin";

  return (
    <div className="flex gap-4 items-center w-screen py-3 px-4 border-b border-gray-dim">
      <Link href={{ to: "/" }}>
        <Logo className="h-[1.25rem]" />
      </Link>
      {isAdmin && <Link href={{ to: "/admin" }}>Admin</Link>}
      <div className="ml-auto">
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
      </div>
    </div>
  );
};
