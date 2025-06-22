import { Link } from "@/components/common";
import { Logo } from "../Logo/Logo";

interface NamesakeHeaderProps {
  onLogoPress?: () => void;
  children?: React.ReactNode;
}

export const NamesakeHeader = ({
  onLogoPress,
  children,
}: NamesakeHeaderProps) => {
  return (
    <div className="flex gap-2 items-center h-header w-full">
      <Link href={{ to: "/" }} className="p-1 -m-1" onPress={onLogoPress}>
        <Logo className="h-5 lg:h-[1.35rem]" />
      </Link>
      {children}
    </div>
  );
};
