import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useTheme } from "next-themes";
import type { CompleteEvent, SurveyModel } from "survey-core";
import {
  LayeredDarkPanelless,
  LayeredLightPanelless,
} from "survey-core/themes";
import { Model, Survey } from "survey-react-ui";

export const Route = createFileRoute(
  "/_authenticated/_home_/quests/$questId/form",
)({
  component: QuestFormRoute,
});

function QuestFormRoute() {
  const navigate = useNavigate();
  const { questId } = Route.useParams();
  const { resolvedTheme } = useTheme();
  const quest = useQuery(api.quests.getById, {
    questId: questId as Id<"quests">,
  });

  const saveData = useMutation(api.userFormData.set);

  const survey = new Model(quest?.formSchema);
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

      navigate({ to: "/quests/$questId", params: { questId } });
    } catch (err) {
      console.error(err);
    }
  };

  survey.onComplete.add(handleSubmit);

  return <Survey model={survey} />;
}
