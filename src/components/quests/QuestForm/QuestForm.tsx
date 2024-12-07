import "survey-core/defaultV2.min.css";

import { Button, Modal } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useTheme } from "next-themes";
import { useState } from "react";
import type { CompleteEvent, SurveyModel } from "survey-core";
import {
  LayeredDarkPanelless,
  LayeredLightPanelless,
} from "survey-core/themes";
import { Model, Survey } from "survey-react-ui";

export type QuestFormProps = {
  quest: Doc<"quests">;
};

export const QuestForm = ({ quest }: QuestFormProps) => {
  const { resolvedTheme } = useTheme();
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const saveData = useMutation(api.userFormData.set);

  if (!quest.formSchema) return null;

  const survey = new Model(quest.formSchema);
  survey.applyTheme(
    resolvedTheme === "dark" ? LayeredDarkPanelless : LayeredLightPanelless,
  );

  const handleSubmit = async (sender: SurveyModel, _options: CompleteEvent) => {
    try {
      // Validate JSON against schema and remove invalid values
      sender.clearIncorrectValues(true);
      for (const key in sender.data) {
        const question = sender.getQuestionByName(key);
        if (question) {
          saveData({
            field: key,
            value: question.value,
          });
        }
      }
      setIsSurveyOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  survey.onComplete.add(handleSubmit);

  return (
    <>
      <Button onPress={() => setIsSurveyOpen(true)}>Get Started</Button>
      <Modal isOpen={isSurveyOpen}>
        <Survey model={survey} />
      </Modal>
    </>
  );
};
