import { Link, Tooltip, TooltipTrigger } from "@/components/common";
import { CircleArrowDown } from "lucide-react";

export type DocumentCardProps = {
  title: string;
  formCode?: string;
  downloadUrl?: string;
};

export const DocumentCard = ({
  title,
  formCode,
  downloadUrl,
}: DocumentCardProps) => {
  const fileTitle = formCode ? `${formCode} ${title}` : title;

  return (
    <div className="flex flex-col w-48 h-60 shrink-0 p-4 bg-gray-1 dark:bg-graydark-3 shadow-md rounded">
      {formCode && <p className="text-gray-dim text-sm mb-1">{formCode}</p>}
      <header className="font-medium text-pretty leading-tight">{title}</header>
      <div className="mt-auto -mb-2 -mr-2 flex justify-end">
        {downloadUrl && (
          <TooltipTrigger>
            <Link
              href={downloadUrl}
              button={{ variant: "icon" }}
              aria-label="Download"
              className="mt-auto self-end"
              download={fileTitle}
            >
              <CircleArrowDown size={16} className="text-gray-dim" />
            </Link>
            <Tooltip>Download</Tooltip>
          </TooltipTrigger>
        )}
      </div>
    </div>
  );
};
