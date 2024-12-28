import { RichText, type RichTextProps } from "@/components/common";

interface QuestContentProps extends RichTextProps {}

export function QuestContent({ ...props }: QuestContentProps) {
  return <RichText {...props} />;
}
