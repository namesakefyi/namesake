import { Node, mergeAttributes } from "@tiptap/core";

export interface StepTitleOptions {
  HTMLAttributes: Record<string, any>;
  placeholder?: string;
}

export const StepTitle = Node.create<StepTitleOptions>({
  name: "stepTitle",
  content: "text*",
  marks: "italic",
  defining: true,
  isolating: true,
  selectable: false,

  parseHTML() {
    return [
      {
        tag: "div[data-type='step-title']",
        priority: 500,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        {
          "data-type": "step-title",
          "data-placeholder": "Step title",
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
        try {
          const { state } = editor;
          const { selection } = state;
          const { $from, $to, $anchor } = selection;

          // Only handle if we're in a step title
          if ($from.parent.type.name !== "stepTitle") {
            return false;
          }

          const $pos = state.doc.resolve($anchor.pos);
          const stepItem = $pos.node($pos.depth - 1);
          const stepContent = stepItem.lastChild;

          if (!stepContent) {
            return false;
          }

          // Target the start of the step content
          const targetPos =
            $pos.before($pos.depth - 1) +
            stepItem.nodeSize -
            stepContent.nodeSize;

          // If cursor is at the end of the title text, just move to content
          if ($to.pos === $from.end()) {
            return editor.chain().focus(targetPos).run();
          }

          // Otherwise, cut the title text after the cursor and move to content
          return editor
            .chain()
            .cut(
              {
                from: $to.pos,
                to: $from.before() + $from.parent.nodeSize - 1,
              },
              targetPos,
            )
            .focus()
            .run();
        } catch (error) {
          console.error(error);
          return false;
        }
      },
    };
  },
});
