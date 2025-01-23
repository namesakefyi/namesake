import { Badge } from "@/components/common";
import { StatusSelect } from "@/components/quests";
import { api } from "@convex/_generated/api";
import { CORE_QUESTS, type CoreQuest, type Status } from "@convex/constants";
import { useMutation, useQuery } from "convex/react";
import { Heading } from "react-aria-components";

interface CoreQuestHeaderProps {
  type: CoreQuest;
  badge: string;
  children?: React.ReactNode;
}

export const CoreQuestHeader = ({
  type,
  badge,
  children,
}: CoreQuestHeaderProps) => {
  const coreQuest = useQuery(api.userCoreQuests.getByType, {
    type,
  });

  const changeStatus = useMutation(api.userCoreQuests.setStatus);

  const handleStatusChange = (status: Status) => {
    changeStatus({ type, status });
  };

  const illustration: Record<CoreQuest, { alt: string; src: string }> = {
    "court-order": {
      alt: "A gavel with a snail on it",
      src: "/images/gavel.png",
    },
    passport: {
      alt: "A snail on a passport",
      src: "/images/passport.png",
    },
    "social-security": {
      alt: "A snail on a social security card",
      src: "/images/social-security.png",
    },
    "state-id": {
      alt: "A snail on a Massachusetts ID card",
      src: "/images/id.png",
    },
    "birth-certificate": {
      alt: "A snail on a flower",
      src: "/images/flower.png",
    },
  };

  return (
    <div className="relative flex gap-2 items-end mb-6 border-b border-gray-dim overflow-hidden pt-8 pb-4">
      <div className="flex flex-col gap-1 items-start">
        {badge && <Badge>{badge}</Badge>}
        <div className="flex gap-2 items-center">
          <Heading className="text-4xl font-medium">
            {CORE_QUESTS[type].label}
          </Heading>
          {coreQuest && (
            <StatusSelect
              status={coreQuest.status as Status}
              onChange={handleStatusChange}
            />
          )}
          {children}
        </div>
      </div>
      {illustration[type] && (
        <img
          src={illustration[type].src}
          alt={illustration[type].alt}
          className="h-32 absolute -bottom-4 right-4 mix-blend-multiply dark:mix-blend-screen pointer-events-none select-none"
        />
      )}
    </div>
  );
};
