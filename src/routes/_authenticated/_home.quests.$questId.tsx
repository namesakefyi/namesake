import {
  Badge,
  Button,
  Container,
  Empty,
  Menu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  PageHeader,
} from "@/components";
import { QuestStep } from "@/components/QuestStep/QuestStep";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { RiMoreFill, RiSignpostLine } from "@remixicon/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/_home/quests/$questId")({
  component: QuestDetailRoute,
});

function QuestDetailRoute() {
  const { questId } = Route.useParams();
  const navigate = useNavigate();
  // TODO: Opportunity to combine these queries?
  const quest = useQuery(api.quests.getQuest, {
    questId: questId as Id<"quests">,
  });
  const questSteps = useQuery(api.questSteps.getStepsForQuest, {
    questId: questId as Id<"quests">,
  });
  const userQuest = useQuery(api.userQuests.getUserQuestByQuestId, {
    questId: questId as Id<"quests">,
  });
  const markComplete = useMutation(api.userQuests.markComplete);
  const markIncomplete = useMutation(api.userQuests.markIncomplete);
  const removeQuest = useMutation(api.userQuests.removeQuest);

  const handleMarkComplete = (questId: Id<"quests">, title: string) => {
    markComplete({ questId }).then(() => {
      toast(`Marked ${title} complete`);
    });
  };
  const handleMarkIncomplete = (questId: Id<"quests">, title: string) => {
    markIncomplete({ questId }).then(() => {
      toast(`Marked ${title} as in progress`);
    });
  };
  const handleRemoveQuest = (questId: Id<"quests">, title: string) => {
    removeQuest({ questId }).then(() => {
      toast(`Removed ${title} quest`);
      navigate({ to: "/" });
    });
  };

  // TODO: Improve loading state to prevent flash of empty
  if (quest === undefined || userQuest === undefined) return;
  if (quest === null || userQuest === null)
    return <Empty title="Quest not found" icon={RiSignpostLine} />;

  return (
    <div className="flex flex-col flex-1">
      <PageHeader
        title={quest.title}
        badge={
          <div className="flex gap-1">
            {quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
            {userQuest?.completionTime ? (
              <Badge variant="success">Complete</Badge>
            ) : (
              <Badge variant="info">In progress</Badge>
            )}
          </div>
        }
        className="px-6 border-b border-gray-dim h-16"
      >
        <MenuTrigger>
          <Button
            aria-label="Quest settings"
            variant="icon"
            icon={RiMoreFill}
            className="-mr-2"
          />
          <Menu placement="bottom end">
            {!userQuest.completionTime && (
              <MenuItem
                onAction={() => handleMarkComplete(quest._id, quest.title)}
              >
                Mark complete
              </MenuItem>
            )}
            {userQuest.completionTime && (
              <MenuItem
                onAction={() => handleMarkIncomplete(quest._id, quest.title)}
              >
                Mark as in progress
              </MenuItem>
            )}
            <MenuSeparator />
            <MenuItem
              onAction={() => handleRemoveQuest(quest._id, quest.title)}
            >
              Remove quest
            </MenuItem>
          </Menu>
        </MenuTrigger>
      </PageHeader>
      <Container className="overflow-y-auto">
        {questSteps && questSteps.length > 0 ? (
          <ol className="flex flex-col gap-6">
            {questSteps.map((step, i) => {
              if (!step) return;
              return (
                <li key={`${quest.title}-step-${i}`}>
                  <QuestStep
                    title={step.title}
                    description={step.description}
                    fields={step.fields}
                  />
                </li>
              );
            })}
          </ol>
        ) : (
          <Empty title="This quest has no steps" icon={RiSignpostLine} />
        )}
      </Container>
    </div>
  );
}
