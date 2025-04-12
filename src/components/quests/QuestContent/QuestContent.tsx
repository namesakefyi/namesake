import { Editor, type EditorProps } from "@/components/common";

interface QuestContentProps extends EditorProps {}

export function QuestContent({ ...props }: QuestContentProps) {
  return <Editor {...props} />;
}
