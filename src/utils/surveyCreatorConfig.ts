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
  // https://surveyjs.io/form-library/documentation/api-reference/question#getType
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
  // https://surveyjs.io/survey-creator/documentation/toolbox-customization#remove-subitems
  const textItemExclude = ["color", "month", "week", "time", "range"];
  for (const subitem of textItemExclude) {
    textToolboxItem.removeSubitem(subitem);
  }
};
