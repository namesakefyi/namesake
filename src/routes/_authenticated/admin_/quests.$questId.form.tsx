import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";

import { Badge, Button } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { CircleCheck, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";

export const Route = createFileRoute(
  "/_authenticated/admin_/quests/$questId/form",
)({
  component: AdminQuestSurveyRoute,
});

function AdminQuestSurveyRoute() {
  const { questId } = Route.useParams();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const quest = useQuery(api.quests.getById, {
    questId: questId as Id<"quests">,
  });

  const setFormSchema = useMutation(api.quests.setFormSchema);

  const creator = new SurveyCreator({
    showLogicTab: true,
    isAutoSave: false,
    maxNestedPanels: 1,
    showJSONEditorTab: false,
    showSurveyTitle: false,
    questionTypes: [
      // https://surveyjs.io/form-library/documentation/api-reference/question#getType
      "boolean",
      "checkbox",
      // "comment",
      "dropdown",
      "tagbox",
      // "expression",
      // "file",
      // "html",
      // "image",
      // "imagepicker",
      // "matrix",
      // "matrixdropdown",
      // "matrixdynamic",
      "multipletext",
      "panel",
      "paneldynamic",
      "radiogroup",
      // "rating",
      // "ranking",
      "signaturepad",
      "text",
    ],
    allowEditExpressionsInTextEditor: false,
    allowChangeThemeInPreview: false,
  });

  const textToolboxItem = creator.toolbox.getItemByName("text");
  textToolboxItem.removeSubitem("color");
  textToolboxItem.removeSubitem("month");
  textToolboxItem.removeSubitem("week");
  textToolboxItem.removeSubitem("time");
  textToolboxItem.removeSubitem("range");

  useEffect(() => {
    if (quest?.formSchema) creator.text = quest.formSchema;
  }, [quest, creator]);

  const handleSave = (
    saveNo: number,
    callback: (saveNo: number, success: boolean) => void,
  ) => {
    setIsPending(true);

    try {
      setFormSchema({
        questId: questId as Id<"quests">,
        saveNo,
        formSchema: JSON.stringify(creator.text),
      });
      callback(saveNo, true);
    } catch (err) {
      console.error(err);
      callback(saveNo, false);
    } finally {
      setIsPending(false);
    }
  };

  creator.saveSurveyFunc = handleSave;

  const handleSaveAndExit = () => {
    try {
      creator.saveSurvey();
      router.history.back();
      toast.success("Saved form changes");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between gap-2 h-12 px-3 shrink-0 border-b border-gray-dim">
        <h1 className="text-base flex items-center gap-1.5">
          <Pencil className="text-gray-dim" size={16} />
          <span className="text-gray-dim">Editing</span>
          <strong className="font-medium">{quest?.title}</strong>
          {quest?.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
        </h1>
        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            onPress={() => router.history.back()}
            size="small"
            isDisabled={isPending}
          >
            Discard changes
          </Button>
          <Button
            variant="primary"
            onPress={handleSaveAndExit}
            icon={CircleCheck}
            size="small"
            isDisabled={isPending}
          >
            Save and exit
          </Button>
        </div>
      </header>
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
}
