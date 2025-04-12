import { Node, findParentNode, mergeAttributes } from "@tiptap/core";

export interface StepTitleOptions {
  HTMLAttributes: Record<string, any>;
  placeholder?: string;
}

export const StepTitle = Node.create<StepTitleOptions>({
  name: "stepTitle",
  content: "text*",
  marks: "italic",
  defining: true,
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
          const { $from, $to } = selection;

          // Only handle if we're in a step title
          if ($from.parent.type.name !== "stepTitle") return false;

          const steps = findParentNode((node) => node.type.name === "steps")(
            editor.state.selection,
          );
          if (!steps) return false;

          const stepItem = findParentNode(
            (node) => node.type.name === "stepItem",
          )(editor.state.selection);
          if (!stepItem) return false;

          const stepTitle = findParentNode(
            (node) => node.type.name === "stepTitle",
          )(editor.state.selection);
          if (!stepTitle) return false;

          const isFirstStep = stepItem.start === steps.start + 1;
          const isCursorAtStartOfStepTitle = $to.pos === stepTitle.start;
          const posBeforeSteps = steps.start - 1;

          // If we're at the start of the first step title, insert paragraph above steps
          if (isFirstStep && isCursorAtStartOfStepTitle) {
            return editor
              .chain()
              .insertContentAt(posBeforeSteps, { type: "paragraph" })
              .focus(posBeforeSteps)
              .run();
          }

          const isLastStep =
            stepItem.pos + stepItem.node.content.size + 1 ===
            steps.pos + steps.node.content.size;
          const isLastStepEmpty = stepItem.node.textContent.trim() === "";

          // If we're at the end of the last step and the step is empty,
          // delete the step and then insert a paragraph below steps
          if (isLastStep && isLastStepEmpty) {
            editor.chain().deleteStep().run();

            // We have to find the steps node again to recalculate the position
            const steps = findParentNode((node) => node.type.name === "steps")(
              editor.state.selection,
            );
            if (!steps) return false;

            const posAfterSteps = steps.pos + steps.node.nodeSize;
            return (
              editor
                .chain()
                .insertContentAt(posAfterSteps, {
                  type: "paragraph",
                })
                // +2 for end token of steps + start token of new paragraph
                .focus(posAfterSteps + 2)
                .run()
            );
          }

          // TODO: There's a way to not have to calculate this logic, I'm sure of it
          // Research "isolation" in Tiptap

          const endOfTitle = stepTitle.start + stepTitle.node.content.size;
          // +2 for end token of title + start token of content
          const startOfContent = endOfTitle + 2;

          // If cursor is at the end of the title text, just move to content
          if ($to.pos === endOfTitle) {
            return editor.chain().focus(startOfContent).run();
          }

          // Otherwise, cut the title text after the cursor and move to content
          return editor
            .chain()
            .cut({ from: $to.pos, to: endOfTitle }, startOfContent)
            .focus(startOfContent)
            .run();
        } catch (error) {
          console.error(error);
          return false;
        }
      },

      Backspace: ({ editor }) => {
        try {
          const { state } = editor;
          const { selection } = state;
          const { $from } = selection;

          // Only handle if we're in a step title
          if ($from.parent.type.name !== "stepTitle") return false;

          return editor.chain().deleteStep().run();
        } catch (error) {
          console.error(error);
          return false;
        }
      },
    };
  },
});
