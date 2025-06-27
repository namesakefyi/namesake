import { Logo } from "@/components/app";
import { AnimateChangeInHeight, Card, Link } from "@/components/common";

interface SignInWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const SignInWrapper = ({ children, className }: SignInWrapperProps) => {
  return (
    <div className="flex flex-col w-96 max-w-full mx-auto min-h-dvh items-center justify-center gap-8 px-6 py-12">
      <Link href="https://namesake.fyi">
        <Logo />
      </Link>
      <AnimateChangeInHeight className="w-full">
        <Card className={className}>{children}</Card>
      </AnimateChangeInHeight>
      <div className="flex gap-4 justify-center text-sm">
        <Link href="https://github.com/namesakefyi/namesake/releases">{`v${APP_VERSION}`}</Link>
        <Link href="https://namesake.fyi/chat">Support</Link>
        <Link href="https://status.namesake.fyi">Status</Link>
      </div>
    </div>
  );
};
