import { Nav, NavGroup, NavItem } from "@/components/common";
import {
  Bug,
  CircleUser,
  DatabaseZap,
  FileClock,
  FileLock2,
  LogOut,
  MessageCircleQuestion,
  Snail,
} from "lucide-react";

export const SettingsNav = ({ className }: { className?: string }) => {
  return (
    <Nav className={className}>
      <NavGroup>
        <NavItem icon={CircleUser} href={{ to: "/settings/account" }}>
          Account
        </NavItem>
        <NavItem icon={FileLock2} href={{ to: "/settings/responses" }}>
          Form Responses
        </NavItem>
      </NavGroup>
      <NavGroup>
        <NavItem
          icon={Snail}
          href="https://namesake.fyi"
          target="_blank"
          rel="noreferrer"
        >
          About
        </NavItem>
        <NavItem
          icon={FileClock}
          href="https://github.com/namesakefyi/namesake/releases"
          target="_blank"
          rel="noreferrer"
        >
          Changelog (v{APP_VERSION})
        </NavItem>
        <NavItem
          href="https://github.com/namesakefyi/namesake/issues/new/choose"
          target="_blank"
          rel="noreferrer"
          icon={Bug}
        >
          Report an Issue
        </NavItem>
        <NavItem
          icon={DatabaseZap}
          href="https://status.namesake.fyi"
          target="_blank"
          rel="noreferrer"
        >
          System Status
        </NavItem>
        <NavItem
          href="https://namesake.fyi/chat"
          target="_blank"
          rel="noreferrer"
          icon={MessageCircleQuestion}
        >
          Discord Community
        </NavItem>
      </NavGroup>
      <NavGroup>
        <NavItem
          href="https://namesake.fyi/terms"
          target="_blank"
          rel="noreferrer"
        >
          Terms of Service
        </NavItem>
        <NavItem
          href="https://namesake.fyi/privacy"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </NavItem>
      </NavGroup>
      <NavGroup>
        <NavItem href="/signout" icon={LogOut}>
          Sign out
        </NavItem>
      </NavGroup>
    </Nav>
  );
};
