import { RiMoreLine } from "@remixicon/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import Markdown from "react-markdown";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  Badge,
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  PageHeader,
} from "../../components";

export const Route = createFileRoute("/quests/$questId")({
  component: QuestDetailRoute,
});

function QuestDetailRoute() {
  const { questId } = Route.useParams();
  // TODO: Opportunity to combine the `quest` and `userQuest` queries
  const quest = useQuery(api.quests.getQuest, {
    questId: questId as Id<"quests">,
  });
  const userQuest = useQuery(api.usersQuests.getUserQuestByQuestId, {
    questId: questId as Id<"quests">,
  });
  const markComplete = useMutation(api.usersQuests.markComplete);
  const markIncomplete = useMutation(api.usersQuests.markIncomplete);

  const handleMarkComplete = (questId: Id<"quests">) =>
    markComplete({ questId });
  const handleMarkIncomplete = (questId: Id<"quests">) =>
    markIncomplete({ questId });

  if (quest === undefined || userQuest === undefined) return;
  if (quest === null || userQuest === null) return "Quest not found";

  return (
    <main>
      <PageHeader
        title={quest.title}
        badge={
          <div className="flex gap-1">
            <Badge>{quest.jurisdiction}</Badge>
            {userQuest?.completionTime ? (
              <Badge variant="success">Complete</Badge>
            ) : (
              <Badge variant="info">In progress</Badge>
            )}
          </div>
        }
      >
        <MenuTrigger>
          <Button aria-label="Quest settings" variant="icon">
            <RiMoreLine />
          </Button>
          <Menu>
            {!userQuest.completionTime && (
              <MenuItem onAction={() => handleMarkComplete(quest._id)}>
                Mark complete
              </MenuItem>
            )}
            {userQuest.completionTime && (
              <MenuItem onAction={() => handleMarkIncomplete(quest._id)}>
                Mark as in progress
              </MenuItem>
            )}
          </Menu>
        </MenuTrigger>
      </PageHeader>
      {quest.steps ? (
        <ol className="flex flex-col gap-4">
          {quest.steps.map((step, i) => (
            <li key={`${quest.title}-step-${i}`}>
              <h2>{step.title}</h2>
              <Markdown>{step.body}</Markdown>
            </li>
          ))}
        </ol>
      ) : (
        <p>This quest has no steps yet.</p>
      )}
    </main>
  );
}
