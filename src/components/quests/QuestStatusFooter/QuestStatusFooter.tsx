import { Button, Card, IconText, TimeAgo } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import type { Category, Status } from "@convex/constants";
import { CATEGORIES, STATUS } from "@convex/constants";
import type { CoreCategory } from "@convex/constants";
import { useMutation } from "convex/react";
import { Check } from "lucide-react";
import { useState } from "react";
import { Heading } from "react-aria-components";
import { toast } from "sonner";
import { tv } from "tailwind-variants";
import flowerImg from "./flower.png";
import gavelImg from "./gavel.png";
import idImg from "./id.png";
import passportImg from "./passport.png";
import socialSecurityImg from "./social-security.png";

function CoreQuestIllustration({ category }: { category: CoreCategory }) {
  const illustration: Record<CoreCategory, { alt: string; src: string }> = {
    courtOrder: {
      alt: "A gavel with a snail on it",
      src: gavelImg,
    },
    passport: {
      alt: "A snail on a passport",
      src: passportImg,
    },
    socialSecurity: {
      alt: "A snail on a social security card",
      src: socialSecurityImg,
    },
    stateId: {
      alt: "A snail on a Massachusetts ID card",
      src: idImg,
    },
    birthCertificate: {
      alt: "A snail on a flower",
      src: flowerImg,
    },
  };

  return (
    <img
      src={illustration[category].src}
      alt={illustration[category].alt}
      className="h-32 absolute -bottom-6 left-8 mix-blend-multiply dark:mix-blend-screen pointer-events-none select-none z-0"
    />
  );
}

function QuestCompletedDate({ userQuest }: { userQuest: Doc<"userQuests"> }) {
  if (!userQuest || userQuest.status !== "complete" || !userQuest.completedAt)
    return null;

  const completedDate = new Date(userQuest.completedAt);

  return (
    <div className="flex flex-col items-end gap-1">
      <Heading className="text-3xl font-medium">Done!</Heading>
      <IconText icon={Check} className="text-white-a9">
        <TimeAgo date={completedDate} />
      </IconText>
    </div>
  );
}

type QuestStatusButtonProps = {
  quest: Doc<"quests">;
  userQuest?: Doc<"userQuests"> | null;
};

const QuestStatusButton = ({ quest, userQuest }: QuestStatusButtonProps) => {
  const [isAddingQuest, setIsAddingQuest] = useState(false);
  const addQuest = useMutation(api.userQuests.create);
  const setStatus = useMutation(api.userQuests.setStatus);

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

  const sharedButtonStyles = tv({
    base: "w-64",
  });

  if (!userQuest) {
    return (
      <Button
        className={sharedButtonStyles()}
        size="large"
        variant="primary"
        onClick={handleAddQuest}
        isDisabled={isAddingQuest}
      >
        Add to my list
      </Button>
    );
  }

  const handleChangeStatus = async (status: Status) => {
    await setStatus({
      questId: quest._id,
      status,
    });
  };

  if (userQuest?.status === "complete") {
    return <QuestCompletedDate userQuest={userQuest} />;
  }

  if (userQuest?.status === "inProgress") {
    return (
      <Button
        className={sharedButtonStyles()}
        size="large"
        variant="success"
        icon={STATUS.complete.icon}
        onClick={() => handleChangeStatus("complete")}
      >
        Mark as {STATUS.complete.label.toLowerCase()}
      </Button>
    );
  }

  if (userQuest?.status === "notStarted") {
    return (
      <Button
        className={sharedButtonStyles()}
        size="large"
        variant="secondary"
        onClick={() => handleChangeStatus("inProgress")}
      >
        Mark as {STATUS.inProgress.label.toLowerCase()}
      </Button>
    );
  }

  return null;
};

type QuestStatusFooterProps = {
  quest: Doc<"quests">;
  userQuest?: Doc<"userQuests"> | null;
};

export const QuestStatusFooter = ({
  quest,
  userQuest,
}: QuestStatusFooterProps) => {
  const cardStyles = tv({
    base: "flex flex-col justify-center items-end gap-4 p-6 h-24 relative overflow-hidden transition-colors",
    variants: {
      isComplete: {
        true: "bg-green-3 border-green-5",
      },
    },
  });

  return (
    <Card
      className={cardStyles({ isComplete: userQuest?.status === "complete" })}
    >
      {quest?.category && CATEGORIES[quest.category as Category].isCore && (
        <CoreQuestIllustration category={quest?.category as CoreCategory} />
      )}
      <div className="relative z-0">
        <QuestStatusButton quest={quest} userQuest={userQuest} />
      </div>
    </Card>
  );
};
