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

          // Get the selected content
          const slice = state.doc.slice(range.start, range.end);
          const selectedContent =
            slice.content.size > 0 ? slice.toJSON().content : [];

          // If no content, create empty step
          if (selectedContent.length === 0) {
            return chain()
              .deleteRange({ from: range.start, to: range.end })
              .addStep()
              .run();
          }

          // Check if first node is a paragraph that could be used as title
          const [firstNode, ...remainingNodes] = selectedContent;
          const titleContent =
            firstNode.type === "paragraph" &&
            (!firstNode.content || firstNode.content.length <= 1) &&
            firstNode.content?.[0]?.type === "text"
              ? [{ type: "text", text: firstNode.content?.[0]?.text || "" }]
              : [];

          const contentNodes =
            firstNode.type === "paragraph" ? remainingNodes : selectedContent;

          return chain()
            .insertContentAt(
              { from: range.start, to: range.end },
              {
                type: this.name,
                content: [
                  {
                    type: "stepItem",
                    content: [
                      {
                        type: "stepTitle",
                        content: titleContent,
                      },
                      {
                        type: "stepContent",
                        content:
                          contentNodes.length > 0
                            ? contentNodes
                            : [{ type: "paragraph" }],
                      },
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
          const steps = findParentNode((node) => node.type === this.type)(
            state.selection,
          );
          if (!steps) return false;

          const range = {
            from: steps.pos,
            to: steps.pos + steps.node.nodeSize,
          };

          // Convert each step into paragraphs with bold titles
          const content = steps.node.content.content.flatMap((stepItem) => {
            const title = stepItem.firstChild;
            const content = stepItem.lastChild;

            if (!title || !content) {
              return [];
            }

            const hasTitle = title.textContent.length > 0;
            const boldTitle = hasTitle && [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: title.textContent,
                  },
                ],
              },
            ];

            return [...(boldTitle || []), ...(content.content.toJSON() || [])];
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
