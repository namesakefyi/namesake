import { Node, findParentNode, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ButtonComponent from "./ButtonComponent";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    button: {
      setButton: (href: string) => ReturnType;
      unsetButton: () => ReturnType;
      toggleButton: () => ReturnType;
    };
  }
}

export interface ButtonOptions {
  HTMLAttributes: Record<string, any>;
}

export const Button = Node.create<ButtonOptions>({
  name: "button",
  group: "block",
  content: "inline*",
  marks: "",
  priority: 500,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      href: {
        default: null,
        parseHTML: (element) => element.getAttribute("href"),
        renderHTML: (attributes) => {
          if (!attributes.href) return {};
          return { href: attributes.href };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "a[data-type='button']",
        priority: 500,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "a",
      mergeAttributes(
        { "data-type": "button" },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonComponent);
  },

  addCommands() {
    return {
      setButton:
        (href: string) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: { href },
              content: [{ type: "text", text: "Click here" }],
            })
            .run();
        },

      unsetButton:
        () =>
        ({ state, chain }) => {
          const button = findParentNode((node) => node.type === this.type)(
            state.selection,
          );
          if (!button) return false;

          return chain()
            .setNode("paragraph", {
              content: [
                {
                  type: "text",
                  text: button.node.textContent,
                },
              ],
            })
            .setMark("link", { href: button.node.attrs.href })
            .run();
        },

      toggleButton:
        () =>
        ({ state, chain }) => {
          const button = findParentNode((node) => node.type === this.type)(
            state.selection,
          );

          if (button) {
            return chain().unsetButton().run();
          }

          return chain().setButton("").run();
        },
    };
  },
});
