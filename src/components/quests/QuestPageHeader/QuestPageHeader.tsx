import type { PageHeaderProps } from "@/components/app";
import { Badge, Button } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import {
  CATEGORIES,
  type Category,
  type CoreCategory,
  type Status,
} from "@convex/constants";
import { Authenticated, useMutation } from "convex/react";
import { useState } from "react";
import { Heading } from "react-aria-components";
import { toast } from "sonner";
import { StatusSelect } from "../StatusSelect/StatusSelect";

interface QuestPageHeaderProps extends Omit<PageHeaderProps, "title"> {
  quest?: Doc<"quests"> | null;
  userQuest?: Doc<"userQuests"> | null;
}

function CoreQuestIllustration({ category }: { category: CoreCategory }) {
  const illustration: Record<CoreCategory, { alt: string; src: string }> = {
    courtOrder: {
      alt: "A gavel with a snail on it",
      src: "/images/gavel.png",
    },
    passport: {
      alt: "A snail on a passport",
      src: "/images/passport.png",
    },
    socialSecurity: {
      alt: "A snail on a social security card",
      src: "/images/social-security.png",
    },
    stateId: {
      alt: "A snail on a Massachusetts ID card",
      src: "/images/id.png",
    },
    birthCertificate: {
      alt: "A snail on a flower",
      src: "/images/flower.png",
    },
  };

  return (
    <img
      src={illustration[category].src}
      alt={illustration[category].alt}
      className="h-32 absolute -bottom-4 right-4 mix-blend-multiply dark:mix-blend-screen pointer-events-none select-none"
    />
  );
}

export function QuestPageHeader({
  quest,
  userQuest,
  badge,
  children,
}: QuestPageHeaderProps) {
  const changeStatus = useMutation(api.userQuests.setStatus);
  const addQuest = useMutation(api.userQuests.create);
  const [isAddingQuest, setIsAddingQuest] = useState(false);

  const handleStatusChange = (status: Status) => {
    if (quest) changeStatus({ questId: quest._id, status });
  };

  const handleAddQuest = async () => {
    try {
      setIsAddingQuest(true);
      if (quest) await addQuest({ questId: quest._id });
    } catch (err) {
      toast.error("Failed to add quest. Please try again.");
    } finally {
      setIsAddingQuest(false);
    }
  };

  return (
    <div className="relative flex gap-2 items-end mb-6 border-b border-gray-dim overflow-hidden pt-8 pb-4">
      <div className="flex flex-col gap-1 items-start">
        {badge && <Badge>{badge}</Badge>}
        <div className="flex gap-2 items-center">
          <Heading className="text-4xl font-medium">{quest?.title}</Heading>
          <div className="flex gap-2 items-center -mb-1">
            {userQuest && (
              <StatusSelect
                status={userQuest.status as Status}
                onChange={handleStatusChange}
              />
            )}
            <Authenticated>
              {userQuest === null && (
                <Button
                  size="small"
                  onPress={handleAddQuest}
                  isDisabled={isAddingQuest}
                >
                  Add Quest
                </Button>
              )}
            </Authenticated>
            {children}
          </div>
        </div>
      </div>
      {quest?.category && CATEGORIES[quest.category as Category].isCore && (
        <CoreQuestIllustration category={quest?.category as CoreCategory} />
      )}
    </div>
  );
}
