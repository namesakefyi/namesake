import { Link } from "@/components/common";
import { Link as LinkIcon } from "lucide-react";

type QuestUrlsProps = {
  urls?: string[];
};

export const QuestUrls = ({ urls }: QuestUrlsProps) => {
  if (!urls || urls.length === 0) return null;

  return (
    <div className="flex flex-col items-start gap-1 mb-4">
      {urls.map((url) => (
        <Link key={url} href={url} className="inline-flex gap-1 items-center">
          <LinkIcon size={20} />
          {url}
        </Link>
      ))}
    </div>
  );
};
