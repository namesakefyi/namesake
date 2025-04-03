import { Badge, Link } from "@/components/common";
import { Logo } from "../Logo/Logo";

export const AppSidebarHeader = () => {
  return (
    <div className="flex gap-2 items-center">
      <Link href={{ to: "/" }} className="p-1 -m-1">
        <Logo className="h-5 lg:h-[1.35rem]" />
      </Link>
      <Badge className="-mb-1" variant="waiting">
        Early Access
      </Badge>
    </div>
  );
};
