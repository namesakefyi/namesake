import "survey-core/defaultV2.min.css";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import type { CompleteEvent, SurveyModel } from "survey-core";
import { LayeredDark, LayeredLight } from "survey-core/themes";
import { Model, Survey } from "survey-react-ui";

const surveyJson = {
  elements: [
    {
      name: "firstName",
      title: "Enter your first name:",
      type: "text",
    },
    {
      name: "lastName",
      title: "Enter your last name:",
      type: "text",
    },
  ],
};

export const QuestSurvey = () => {
  const { resolvedTheme } = useTheme();
  const survey = new Model(surveyJson);
  survey.applyTheme(resolvedTheme === "dark" ? LayeredDark : LayeredLight);

  const submitSurvey = useCallback(
    (sender: SurveyModel, _options: CompleteEvent) => {
      alert(JSON.stringify(sender.data));
    },
    [],
  );
  survey.onComplete.add(submitSurvey);

  return <Survey model={survey} />;
};
