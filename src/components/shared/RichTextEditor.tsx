import {
  BoldItalicUnderlineToggles,
  CreateLink,
  ListsToggle,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  Separator,
  UndoRedo,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useRef } from "react";

export interface RichTextEditorProps extends MDXEditorProps {}

export function RichTextEditor(props: RichTextEditorProps) {
  const ref = useRef<MDXEditorMethods>(null);

  return (
    <MDXEditor
      className="dark-theme dark-editor border border-gray-dim rounded-lg flex flex-col"
      {...props}
      ref={ref}
      plugins={[
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
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
