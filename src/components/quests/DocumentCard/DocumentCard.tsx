import { Link, Tooltip, TooltipTrigger } from "@/components/common";
import { CircleArrowDown } from "lucide-react";

export type DocumentCardProps = {
  title: string;
  code?: string;
  downloadUrl?: string;
};

export const DocumentCard = ({
  title,
  code,
  downloadUrl,
}: DocumentCardProps) => {
  const fileTitle = code ? `${code} ${title}` : title;

  return (
    <div className="flex flex-col w-48 h-60 shrink-0 p-4 bg-white shadow-md rounded-sm">
      {code && <p className="text-gray-11 text-sm mb-1">{code}</p>}
      <header className="font-medium text-pretty leading-tight text-gray-12">
        {title}
      </header>
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
              <CircleArrowDown size={16} className="text-gray-11" />
            </Link>
            <Tooltip>Download</Tooltip>
          </TooltipTrigger>
        )}
      </div>
    </div>
  );
};
