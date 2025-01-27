import type { PageHeaderProps } from "@/components/app";
import {
  Badge,
  Button,
  Link,
  Menu,
  MenuItem,
  MenuTrigger,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import {
  CATEGORIES,
  type Category,
  type CoreCategory,
  type Status,
} from "@convex/constants";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Authenticated, useMutation, useQuery } from "convex/react";
import { Ellipsis } from "lucide-react";
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
  const navigate = useNavigate();
  const changeStatus = useMutation(api.userQuests.setStatus);
  const addQuest = useMutation(api.userQuests.create);
  const deleteForever = useMutation(api.userQuests.deleteForever);
  const [isAddingQuest, setIsAddingQuest] = useState(false);
  const user = useQuery(api.users.getCurrent);
  const search = useSearch({
    strict: false,
  });
  const canEdit = user?.role === "admin";
  const isEditing = search.edit;

  const handleRemoveQuest = (questId: Id<"quests">, title: string) => {
    deleteForever({ questId }).then(() => {
      toast(`Removed ${title} quest`);
      navigate({ to: "/" });
    });
  };

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
            {userQuest && !isEditing && (
              <StatusSelect
                status={userQuest.status as Status}
                onChange={handleStatusChange}
              />
            )}
            <Authenticated>
              {userQuest === null && !isEditing && (
                <Button
                  size="small"
                  onPress={handleAddQuest}
                  isDisabled={isAddingQuest}
                >
                  Add Quest
                </Button>
              )}
              {isEditing && (
                <Link
                  button={{
                    size: "small",
                  }}
                  href={{
                    search: { edit: undefined },
                  }}
                >
                  Finish editing
                </Link>
              )}
              {quest && (
                <MenuTrigger>
                  <Button
                    aria-label="Quest settings"
                    variant="icon"
                    icon={Ellipsis}
                    className="-mr-2"
                    size="small"
                  />
                  <Menu placement="bottom end">
                    {canEdit && !isEditing && (
                      <MenuItem
                        href={{
                          search: { edit: true },
                        }}
                      >
                        Edit quest
                      </MenuItem>
                    )}
                    {userQuest && (
                      <MenuItem
                        onAction={() =>
                          handleRemoveQuest(quest._id, quest.title)
                        }
                      >
                        Remove quest
                      </MenuItem>
                    )}
                  </Menu>
                </MenuTrigger>
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
