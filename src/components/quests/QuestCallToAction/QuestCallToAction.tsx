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

export type QuestCTAData =
  | {
      quest: Doc<"quests"> | null | undefined;
      userQuest: Doc<"userQuests"> | null | undefined;
    }
  | { gettingStarted: Doc<"userGettingStarted"> | null | undefined }
  | { quest: Doc<"quests"> | null | undefined };

type QuestCTAButtonProps = {
  data: QuestCTAData;
  onAddQuest?: () => Promise<void>;
  onChangeStatus?: (status: Status) => Promise<void>;
  isLoading?: boolean;
};

const QuestCTAButton = ({
  data,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeStatus = async (newStatus: Status) => {
    if (!onChangeStatus) return;
    try {
      setIsSubmitting(true);
      await onChangeStatus(newStatus);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sharedButtonStyles = tv({
    base: "w-64",
  });

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

  const currentStatus =
    "gettingStarted" in data
      ? data.gettingStarted?.status
      : "userQuest" in data
        ? data.userQuest?.status
        : undefined;

  const currentCompletedAt =
    "gettingStarted" in data
      ? data.gettingStarted?.completedAt
      : "userQuest" in data
        ? data.userQuest?.completedAt
        : undefined;

  if ("quest" in data && !("userQuest" in data) && onAddQuest) {
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
  data: QuestCTAData;
  illustration?: IllustrationType;
  onAddQuest?: () => Promise<void>;
  onChangeStatus?: (status: Status) => Promise<void>;
  className?: string;
  isLoading?: boolean;
};

export const QuestCallToAction = ({
  data,
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

  const currentStatus =
    "gettingStarted" in data
      ? data.gettingStarted?.status
      : "userQuest" in data
        ? data.userQuest?.status
        : undefined;

  const quest = "quest" in data ? data.quest : undefined;

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
          data={data}
          onAddQuest={onAddQuest}
          onChangeStatus={onChangeStatus}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
