import { Nav, NavGroup, NavItem } from "@/components/common";
import { Milestone } from "lucide-react";

export const AdminNav = ({ className }: { className?: string }) => {
  return (
    <Nav className={className}>
      <NavGroup>
        <NavItem icon={Milestone} href={{ to: "/admin/quests" }}>
          Quests
        </NavItem>
      </NavGroup>
    </Nav>
  );
};
