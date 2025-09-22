import { tv } from "tailwind-variants";

const skeletonStyles = tv({
  base: "w-full h-full relative animate-fade-in before:inset-0 before:absolute before:bg-theme-a3 before:rounded-sm before:animate-pulse forced-colors:before:bg-[ButtonBorder]",
  variants: {
    type: {
      circle: "before:rounded-full",
      text: "h-4",
    },
  },
});

type SkeletonProps = {
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={skeletonStyles({ className })}
      aria-hidden
      data-testid="skeleton"
    />
  );
};

export const SkeletonCircle = ({ className }: SkeletonProps) => {
  return (
    <div
      className={skeletonStyles({ className, type: "circle" })}
      aria-hidden
      data-testid="skeleton-circle"
    />
  );
};

const skeletonParagraphStyles = tv({
  base: "flex flex-col gap-2",
  variants: {
    align: {
      left: "items-start",
      center: "items-center",
      right: "items-end",
    },
  },
});

type SkeletonTextProps = {
  className?: string;
  lines?: number;
  align?: "left" | "center" | "right";
} & React.HTMLAttributes<HTMLDivElement>;

export const SkeletonText = ({
  className,
  lines = 2,
  align = "left",
}: SkeletonTextProps) => {
  return (
    <div
      className={skeletonParagraphStyles({ className, align })}
      aria-hidden
      data-testid="skeleton-text"
    >
      {Array.from({ length: lines }).map((_, index) => {
        const minWidth = 70;
        const maxWidth = 90;
        const randomWidth = `${Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth}%`;

        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: Fine
            key={index}
            className={skeletonStyles({ type: "text", className })}
            style={{ width: randomWidth }}
          />
        );
      })}
    </div>
  );
};
