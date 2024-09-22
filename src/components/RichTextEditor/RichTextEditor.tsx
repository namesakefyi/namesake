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

export interface RichTextEditorProps extends MDXEditorProps {}

export function RichTextEditor({ className, ...props }: RichTextEditorProps) {
  const ref = useRef<MDXEditorMethods>(null);

  return (
    <MDXEditor
      className={twMerge(
        className,
        "dark-theme dark-editor border border-gray-dim text-gray-normal rounded-lg flex flex-col",
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
            </>
          ),
        }),
      ]}
    />
  );
}
