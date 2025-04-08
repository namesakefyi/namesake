import { Nav, NavGroup, NavItem } from "@/components/common";
import { FlaskConical, Milestone } from "lucide-react";

export const AdminNav = () => {
  return (
    <Nav>
      <NavGroup>
        <NavItem icon={Milestone} href={{ to: "/admin/quests" }}>
          Quests
        </NavItem>
        <NavItem icon={FlaskConical} href={{ to: "/admin/early-access" }}>
          Early Access
        </NavItem>
      </NavGroup>
    </Nav>
  );
};
