import { Button, IconText, TimeAgo } from "@/components/common";
import type { Category, Status } from "@/constants";
import { CATEGORIES, STATUS } from "@/constants";
import type { CoreCategory } from "@/constants";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
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

function CoreQuestIllustration({
  category,
  isComplete,
}: { category: CoreCategory; isComplete: boolean }) {
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

  const illustrationStyles = tv({
    base: "w-48 absolute invisible sm:visible top-1/2 -translate-y-1/2 -left-4 md:left-8 mix-blend-multiply dark:mix-blend-screen pointer-events-none select-none z-0",
    variants: {
      isComplete: {
        true: "visible",
      },
    },
  });
  return (
    <img
      src={illustration[category].src}
      alt={illustration[category].alt}
      className={illustrationStyles({ isComplete })}
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
      <IconText icon={Check} className="text-primary-12">
        <TimeAgo date={completedDate} />
      </IconText>
    </div>
  );
}

type QuestCTAButtonProps = {
  quest: Doc<"quests">;
  userQuest?: Doc<"userQuests"> | null;
};

const QuestCTAButton = ({ quest, userQuest }: QuestCTAButtonProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addQuest = useMutation(api.userQuests.create);
  const setStatus = useMutation(api.userQuests.setStatus);

  const handleAddQuest = async () => {
    try {
      setIsSubmitting(true);
      if (quest) await addQuest({ questId: quest._id });
    } catch (err) {
      toast.error("Failed to add quest. Please try again.");
    } finally {
      setIsSubmitting(false);
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
        isSubmitting={isSubmitting}
      >
        Add to my quests
      </Button>
    );
  }

  const handleChangeStatus = async (status: Status) => {
    try {
      setIsSubmitting(true);
      await setStatus({
        questId: quest._id,
        status,
      });
    } catch (err) {
      toast.error("Failed to change status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        isSubmitting={isSubmitting}
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
        isSubmitting={isSubmitting}
      >
        Mark as {STATUS.inProgress.label.toLowerCase()}
      </Button>
    );
  }

  return null;
};

type QuestCallToActionProps = {
  quest: Doc<"quests">;
  userQuest?: Doc<"userQuests"> | null;
};

export const QuestCallToAction = ({
  quest,
  userQuest,
}: QuestCallToActionProps) => {
  const containerStyles = tv({
    base: "flex flex-col justify-center items-center sm:items-end gap-4 py-4 app-padding rounded-xl border overflow-hidden h-24 relative transition-colors",
    variants: {
      isComplete: {
        true: "bg-primary-3 border-primary-5 items-end",
        false: "bg-element border-dim",
      },
    },
  });

  return (
    <div
      className={containerStyles({
        isComplete: userQuest?.status === "complete",
      })}
    >
      {quest?.category && CATEGORIES[quest.category as Category].isCore && (
        <CoreQuestIllustration
          category={quest?.category as CoreCategory}
          isComplete={userQuest?.status === "complete"}
        />
      )}
      <div className="relative z-0">
        <QuestCTAButton quest={quest} userQuest={userQuest} />
      </div>
    </div>
  );
};
