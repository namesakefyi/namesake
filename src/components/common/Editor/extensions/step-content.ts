import { Node, findParentNode, mergeAttributes } from "@tiptap/core";

export interface StepContentOptions {
  HTMLAttributes: Record<string, any>;
  placeholder?: string;
}

export const StepContent = Node.create<StepContentOptions>({
  name: "stepContent",
  content: "block+",
  defining: true,
  selectable: false,

  parseHTML() {
    return [
      {
        tag: "div[data-type='step-content']",
        priority: 500,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        {
          "data-type": "step-content",
          "data-placeholder": "Add step instructions…",
        },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      0,
    ];
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $anchor } = selection;

        // If we're not in step content, ignore
        if (this.type.name !== "stepContent") return false;

        const stepContent = findParentNode(
          (node) => node.type.name === "stepContent",
        )(state.selection);

        // If no step content found, ignore
        if (!stepContent) return false;

        const endOfContent = stepContent.pos + stepContent.node.content.size;

        // If cursor is not at the end of the content, ignore
        if ($anchor.pos !== endOfContent) return false;

        // If the selected node has text, ignore
        if ($anchor.node().textContent.length > 0) return false;

        // Otherwise, we're at the end of the content with an empty line,
        // so delete the empty line and add a new step
        return editor.chain().joinTextblockBackward().addStep().run();
      },

      Backspace: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $to } = selection;

        const stepContent = findParentNode(
          (node) => node.type.name === "stepContent",
        )(state.selection);
        if (!stepContent) return false;

        // If we're not in step content, ignore
        if (this.type.name !== "stepContent") return false;

        // If we're not at the start of the content, ignore
        // +1 to account for the start token of the paragraph node
        if ($to.pos !== stepContent.start + 1) return false;

        // Otherwise, jump back to the end of the title node
        return (
          editor
            .chain()
            // -2 to skip start and end tokens
            .focus(stepContent.start - 2)
            .run()
        );
      },
    };
  },
});
