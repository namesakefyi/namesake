import { Node, findParentNode, mergeAttributes } from "@tiptap/core";

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

      /**
       * Delete the current step.
       */
      deleteStep: () => ReturnType;
    };
  }
}

export const StepItem = Node.create<StepItemOptions>({
  name: "stepItem",
  group: "listItem",
  content: "stepTitle stepContent",
  defining: true,
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

  addCommands() {
    return {
      addStep:
        () =>
        ({ state, chain }) => {
          try {
            const currentStep = findParentNode(
              (node) => node.type.name === "stepItem",
            )(state.selection);

            if (!currentStep) return false;

            const positionAfterCurrentItem =
              currentStep.pos + currentStep.node.nodeSize;

            // +2 moves cursor over the end token and start token
            // to the beginning of the new node
            const startOfNewStep = positionAfterCurrentItem + 2;

            return chain()
              .insertContentAt(positionAfterCurrentItem, {
                type: this.name,
                content: [
                  {
                    type: "stepTitle",
                  },
                  {
                    type: "stepContent",
                    content: [{ type: "paragraph" }],
                  },
                ],
              })
              .focus(startOfNewStep)
              .run();
          } catch (error) {
            console.error(error);
            return false;
          }
        },

      deleteStep:
        () =>
        ({ state, chain }) => {
          try {
            const steps = findParentNode((node) => node.type.name === "steps")(
              state.selection,
            );
            if (!steps) return false;

            const currentStep = findParentNode(
              (node) => node.type.name === "stepItem",
            )(state.selection);
            if (!currentStep) return false;

            // If the step has content, don't delete
            const stepHasContent = currentStep.node.textContent.length > 0;
            if (stepHasContent) return false;

            // If this is the last step, delete the entire steps list node
            const isLastStep = steps.node.content.childCount === 1;
            if (isLastStep) return chain().deleteNode("steps").run();

            // Otherwise, step is empty and can be safely deleted
            return chain().deleteNode("stepItem").run();
          } catch (error) {
            console.error(error);
            return false;
          }
        },
    };
  },
});
