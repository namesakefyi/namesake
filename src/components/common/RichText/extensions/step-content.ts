import { Node, mergeAttributes } from "@tiptap/core";

export interface StepContentOptions {
  HTMLAttributes: Record<string, any>;
  placeholder?: string;
}

export const StepContent = Node.create<StepContentOptions>({
  name: "stepContent",
  content: "block+",
  defining: true,
  isolating: true,
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
    return {};
  },
});
