import { Node, findParentNode, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    steps: {
      setSteps: () => ReturnType;
      unsetSteps: () => ReturnType;
      toggleSteps: () => ReturnType;
    };
  }
}

export interface StepsOptions {
  HTMLAttributes: Record<string, any>;
}

export const Steps = Node.create<StepsOptions>({
  name: "steps",
  group: "block list",
  content: "stepItem+",
  defining: true,
  isolating: true,
  priority: 500,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: "ol[data-type='steps']",
        priority: 500,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "ol",
      mergeAttributes(
        { "data-type": "steps" },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      0,
    ];
  },

  addCommands() {
    return {
      setSteps:
        () =>
        ({ state, chain }) => {
          const range = state.selection.$from.blockRange(state.selection.$to);
          if (!range) {
            return false;
          }

          const slice = state.doc.slice(range.start, range.end);
          const content =
            slice.content.size > 0 ? (slice.toJSON()?.content ?? []) : [];

          return chain()
            .insertContentAt(
              { from: range.start, to: range.end },
              {
                type: this.name,
                content: [
                  {
                    type: "stepItem",
                    content: [
                      { type: "stepTitle", content },
                      { type: "stepContent", content },
                    ],
                  },
                ],
              },
            )
            .run();
        },

      unsetSteps:
        () =>
        ({ state, chain }) => {
          const parent = findParentNode((node) => node.type === this.type)(
            state.selection,
          );
          if (!parent) {
            return false;
          }

          const range = {
            from: parent.pos,
            to: parent.pos + parent.node.nodeSize,
          };
          const content = parent.node.content.content.flatMap((stepItem) => {
            const contentNode = stepItem.content.content[1]; // Get stepContent
            return contentNode.content.toJSON() ?? [];
          });

          return chain()
            .insertContentAt(range, content)
            .setTextSelection(range.from)
            .run();
        },

      toggleSteps:
        () =>
        ({ state, chain }) => {
          const node = findParentNode((node) => node.type === this.type)(
            state.selection,
          );
          if (node) {
            return chain().unsetSteps().run();
          }

          return chain().setSteps().run();
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-s": () => this.editor.commands.toggleSteps(),
    };
  },
});
