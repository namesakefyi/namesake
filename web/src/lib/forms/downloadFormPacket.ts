import type { Step } from "#constants/forms";
import {
  isShown,
  resolveFormVisibility,
  resolveInstructions,
} from "./formVisibility";
import { loadFormDownload } from "./loadForm";
import type { FormData } from "./questions";

/**
 * Downloads the form's PDFs behind a cover page, filled from the answers to
 * `steps`, or every PDF blank when there are no answers.
 */
export async function downloadFormPacket(
  formId: string,
  answers?: { steps: readonly Step[]; data: FormData },
) {
  const [download, { downloadPdfPacket }] = await Promise.all([
    loadFormDownload(formId),
    import("#lib/pdfs/downloadPdfPacket"),
  ]);
  const data = answers?.data ?? {};

  await downloadPdfPacket({
    title: download.title,
    instructions: resolveInstructions(download.instructions, data),
    pdfs: answers
      ? download.pdfs.filter((pdf) => isShown(pdf, data))
      : download.pdfs,
    data: answers && resolveFormVisibility(answers.steps, data).visibleFields,
  });
}
