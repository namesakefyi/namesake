import {
  BoldItalicUnderlineToggles,
  CreateLink,
  ListsToggle,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  Separator,
  UndoRedo,
  listsPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";
import { useDebounce } from "use-debounce";
import { ReadingScore } from "../ReadingScore";

export interface RichTextEditorProps extends MDXEditorProps {
  showReadingScore?: boolean;
}

export function RichTextEditor({
  className,
  showReadingScore = false,
  ...props
}: RichTextEditorProps) {
  const ref = useRef<MDXEditorMethods>(null);
  const [debouncedMarkdown] = useDebounce(props.markdown, 500);

  return (
    <MDXEditor
      className={twMerge(
        className,
        "dark-theme dark-editor border border-gray-dim text-gray-normal rounded-lg flex flex-col w-full",
      )}
      contentEditableClassName="prose dark:prose-invert"
      suppressHtmlProcessing
      {...props}
      ref={ref}
      plugins={[
        listsPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles options={["Bold", "Italic"]} />
              <Separator />
              <ListsToggle options={["bullet", "number"]} />
              <CreateLink />
              {showReadingScore && (
                <div className="ml-auto">
                  <ReadingScore text={debouncedMarkdown} />
                </div>
              )}
            </>
          ),
        }),
      ]}
    />
  );
}
