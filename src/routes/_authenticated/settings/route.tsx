import { AppContent, AppSidebar } from "@/components/app";
import { Nav, NavGroup, NavItem } from "@/components/common";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import {
  Bug,
  CircleUser,
  Database,
  DatabaseZap,
  FileClock,
  MessageCircleQuestion,
  Snail,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  return (
    <div className="flex">
      <AppSidebar>
        <Nav>
          <NavGroup label="Settings">
            <NavItem icon={CircleUser} href={{ to: "/settings/account" }}>
              Account
            </NavItem>
            <NavItem icon={Database} href={{ to: "/settings/data" }}>
              Data
            </NavItem>
          </NavGroup>
          <NavGroup label="Help">
            <NavItem
              icon={Snail}
              href="https://namesake.fyi"
              target="_blank"
              rel="noreferrer"
            >
              About Namesake
            </NavItem>
            <NavItem
              icon={FileClock}
              href="https://github.com/namesakefyi/namesake/releases"
              target="_blank"
              rel="noreferrer"
            >
              View Changelog (v{APP_VERSION})
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
          <NavGroup label="Legal">
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
        </Nav>
      </AppSidebar>
      <AppContent>
        <Outlet />
      </AppContent>
    </div>
  );
}
