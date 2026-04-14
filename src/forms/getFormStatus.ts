import { getFormProgress } from "../db/database";
import { getPhase } from "./createFormMachine";

export type FormStatus = "inProgress" | "complete";

export async function getFormStatus(
  formSlug: string,
): Promise<FormStatus | null> {
  const snapshot = await getFormProgress(formSlug);
  if (!snapshot || typeof snapshot !== "object") return null;
  const value = (snapshot as { value?: unknown }).value;
  const phase = getPhase(value);

  switch (phase) {
    case "title":
      return null;
    case "filling":
    case "review":
    case "editing":
    case "submitting":
      return "inProgress";
    case "complete":
      return "complete";
    default:
      return null;
  }
}
