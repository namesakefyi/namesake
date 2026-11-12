import type { Instruction } from "#constants/forms";
import type { FormData } from "./questions";
import { isShown } from "./resolveFormVisibility";

export function resolveInstructions(
  instructions: readonly Instruction[],
  formData: FormData,
): string[] {
  return instructions.flatMap((item) =>
    typeof item === "string"
      ? [item]
      : isShown(item, formData)
        ? [item.text]
        : [],
  );
}
