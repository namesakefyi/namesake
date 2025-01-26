import { RichText } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Step, Steps } from "../Steps/Steps";

type QuestStepsProps = {
  quest: Doc<"quests">;
};

export const QuestSteps = ({ quest }: QuestStepsProps) => {
  if (!quest.steps) return null;

  const steps = useQuery(api.questSteps.getByIds, {
    questStepIds: quest.steps,
  });

  if (!steps) return null;

  return (
    <Steps>
      {steps
        .filter((step) => step !== null)
        .map((step) => (
          <Step key={step._id} title={step.title}>
            <RichText initialContent={step.content} editable={false} />
          </Step>
        ))}
    </Steps>
  );
};
