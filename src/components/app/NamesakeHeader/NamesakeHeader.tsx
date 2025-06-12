import { Badge, Link } from "@/components/common";
import { Logo } from "../Logo/Logo";

interface NamesakeHeaderProps {
  children?: React.ReactNode;
}

export const NamesakeHeader = ({ children }: NamesakeHeaderProps) => {
  return (
    <div className="flex gap-2 items-center h-header w-full">
      <Link href={{ to: "/" }} className="p-1 -m-1">
        <Logo className="h-5 lg:h-[1.35rem]" />
      </Link>
      <Badge className="-mb-1">Early Access</Badge>
      {children}
    </div>
  );
};
