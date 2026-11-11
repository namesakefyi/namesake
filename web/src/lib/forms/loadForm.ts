import type { FormDownload, Step } from "#constants/forms";
import { loadFormFile } from "./formIds";

// Lazy, so a form page downloads only its own form's steps, and its PDFs only
// once the person starts filling.
const steps = import.meta.glob<readonly Step[]>(
  "../../content/forms/**/steps.ts",
  { import: "default" },
);
const downloads = import.meta.glob<FormDownload>(
  "../../content/forms/**/download.ts",
  { import: "default" },
);

export const loadFormSteps = (formId: string) =>
  loadFormFile(steps, formId, "steps.ts");

export const loadFormDownload = (formId: string) =>
  loadFormFile(downloads, formId, "download.ts");
