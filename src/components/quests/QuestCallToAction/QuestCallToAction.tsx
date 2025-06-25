import type { Doc } from "@convex/_generated/dataModel";
import { Check } from "lucide-react";
import { useState } from "react";
import { Heading } from "react-aria-components";
import { tv } from "tailwind-variants";
import { Button, IconText, TimeAgo, TintedImage } from "@/components/common";
import type { Category, Status } from "@/constants";
import { CATEGORIES, STATUS } from "@/constants";
import flowerImg from "./flower.png";
import gavelImg from "./gavel.png";
import idImg from "./id.png";
import passportImg from "./passport.png";
import socialSecurityImg from "./social-security.png";

export type IllustrationType =
  | "courtOrder"
  | "passport"
  | "socialSecurity"
  | "stateId"
  | "birthCertificate";

function QuestIllustration({
  illustration,
  isComplete,
}: {
  illustration: IllustrationType;
  isComplete: boolean;
}) {
  const illustrations: Record<IllustrationType, { alt: string; src: string }> =
    {
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
    base: "w-48 absolute invisible sm:visible top-1/2 -translate-y-1/2 -left-4 md:left-8 z-0",
    variants: {
      isComplete: {
        true: "visible",
      },
    },
  });
  return (
    <div className={illustrationStyles({ isComplete })}>
      <TintedImage
        src={illustrations[illustration].src}
        alt={illustrations[illustration].alt}
      />
    </div>
  );
}

type QuestCTAButtonProps = {
  userQuest?: Doc<"userQuests"> | null;
  status?: Status; // For getting-started mode
  completedAt?: number; // For getting-started mode
  onAddQuest?: () => Promise<void>;
  onChangeStatus?: (status: Status) => Promise<void>;
  isLoading?: boolean;
};

const QuestCTAButton = ({
  userQuest,
  status,
  completedAt,
  onAddQuest,
  onChangeStatus,
  isLoading = false,
}: QuestCTAButtonProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddQuest = async () => {
    if (!onAddQuest) return;
    try {
      setIsSubmitting(true);
      await onAddQuest();
    } catch (_err) {
      // Error handling is now the parent's responsibility
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeStatus = async (newStatus: Status) => {
    if (!onChangeStatus) return;
    try {
      setIsSubmitting(true);
      await onChangeStatus(newStatus);
    } catch (_err) {
      // Error handling is now the parent's responsibility
    } finally {
      setIsSubmitting(false);
    }
  };

  const sharedButtonStyles = tv({
    base: "w-64",
  });

  // Show loading state if explicitly loading
  if (isLoading) {
    return (
      <Button
        className={sharedButtonStyles()}
        size="large"
        variant="secondary"
        isDisabled
        isPending={isLoading}
      />
    );
  }

  // Use either userQuest status or passed status (for getting-started)
  const currentStatus = userQuest?.status || status;
  const currentCompletedAt = userQuest?.completedAt || completedAt;

  // Show "Add to my quests" button only if onAddQuest is provided and no userQuest exists
  if (!userQuest && !status && onAddQuest) {
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

  if (currentStatus === "complete") {
    return (
      <div className="flex flex-col items-end gap-1">
        <Heading className="text-3xl font-medium">Done!</Heading>
        {currentCompletedAt && (
          <IconText icon={Check} className="text-primary-12">
            <TimeAgo date={new Date(currentCompletedAt)} />
          </IconText>
        )}
      </div>
    );
  }

  if (currentStatus === "inProgress" && onChangeStatus) {
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

  if (currentStatus === "notStarted" && onChangeStatus) {
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
  quest?: Doc<"quests">;
  userQuest?: Doc<"userQuests"> | null;
  status?: Status; // For getting-started mode
  completedAt?: number; // For getting-started mode
  illustration?: IllustrationType;
  onAddQuest?: () => Promise<void>;
  onChangeStatus?: (status: Status) => Promise<void>;
  className?: string;
  isLoading?: boolean;
};

export const QuestCallToAction = ({
  quest,
  userQuest,
  status,
  completedAt,
  illustration,
  onAddQuest,
  onChangeStatus,
  className,
  isLoading = false,
}: QuestCallToActionProps) => {
  const containerStyles = tv({
    base: "flex flex-col justify-center items-center sm:items-end gap-4 py-4 px-6 rounded-xl border overflow-hidden h-24 relative transition-colors",
    variants: {
      isComplete: {
        true: "bg-primary-3 border-primary-5 items-end",
        false: "bg-element border-dim",
      },
    },
  });

  // Use either userQuest status or passed status
  const currentStatus = userQuest?.status || status;

  // For core quests, use the quest category as illustration by default
  const displayIllustration =
    illustration ||
    (quest?.category && CATEGORIES[quest.category as Category]?.isCore
      ? (quest.category as IllustrationType)
      : undefined);

  return (
    <div
      className={`${containerStyles({
        isComplete: currentStatus === "complete",
      })} ${className || ""}`}
    >
      {displayIllustration && (
        <QuestIllustration
          illustration={displayIllustration}
          isComplete={currentStatus === "complete"}
        />
      )}
      <div className="relative z-0">
        <QuestCTAButton
          userQuest={userQuest}
          status={status}
          completedAt={completedAt}
          onAddQuest={onAddQuest}
          onChangeStatus={onChangeStatus}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
