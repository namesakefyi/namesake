import { Node, mergeAttributes } from "@tiptap/core";

export interface StepItemOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    stepItem: {
      /**
       * Add a new step to the bottom of the list.
       */
      addStep: () => ReturnType;
    };
  }
}

export const StepItem = Node.create<StepItemOptions>({
  name: "stepItem",
  group: "listItem",
  content: "stepTitle stepContent",
  defining: true,
  isolating: true,
  draggable: false,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: "li[data-type='step-item']",
        priority: 500,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "li",
      mergeAttributes(
        { "data-type": "step-item" },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      0,
    ];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        if ($from.parent.type.name !== "stepTitle" || $from.parentOffset > 0) {
          return false;
        }

        const stepItem = $from.node(-1);
        if (!stepItem || stepItem.type.name !== "stepItem") {
          return false;
        }

        if ($from.index(-2) === 0 && stepItem.textContent.length === 0) {
          return editor.commands.toggleSteps();
        }

        return editor.chain().joinBackward().run();
      },
    };
  },
});
