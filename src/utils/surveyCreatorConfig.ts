import type { ICreatorOptions } from "survey-creator-core";
import type { SurveyCreator } from "survey-creator-react";

export const surveyCreatorConfig: ICreatorOptions = {
  showLogicTab: true,
  isAutoSave: false,
  maxNestedPanels: 1,
  showJSONEditorTab: false,
  showSurveyTitle: false,
  allowEditExpressionsInTextEditor: false,
  allowChangeThemeInPreview: false,
  questionTypes: [
    "boolean",
    "checkbox",
    "dropdown",
    "tagbox",
    "multipletext",
    "panel",
    "paneldynamic",
    "radiogroup",
    "signaturepad",
    "text",
  ],
};

export const configureSurveyCreatorToolbox = (creator: SurveyCreator) => {
  const textToolboxItem = creator.toolbox.getItemByName("text");
  for (const subitem of ["color", "month", "week", "time", "range"]) {
    textToolboxItem.removeSubitem(subitem);
  }
};
