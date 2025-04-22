import { Node, findParentNode, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ButtonComponent from "./ButtonComponent";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    button: {
      setButton: (href?: string) => ReturnType;
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
        (href?: string) =>
        ({ chain, state, editor }) => {
          const { from, to } = state.selection;

          const existingText = state.doc.textBetween(from, to, "");
          const hasExistingText = existingText.length > 0;
          const text = hasExistingText ? existingText : undefined;

          // Does the selection contain a link?
          const existingLink = editor.isActive("link")
            ? editor.getAttributes("link").href
            : "";

          // Insert button
          return chain()
            .extendMarkRange("link")
            .insertContent({
              type: this.name,
              attrs: { href: href ?? existingLink },
              content: text ? [{ type: "text", text }] : undefined,
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

          const range = {
            from: button.start,
            to: button.start + button.node.content.size,
          };
          const beforeButton = button.start - 1;
          const hasLink =
            button.node.attrs.href && button.node.attrs.href !== "";

          chain()
            .deleteNode("button")
            .insertContentAt(beforeButton, {
              type: "text",
              text: button.node.textContent,
            })
            .run();

          if (hasLink) {
            chain()
              .setTextSelection(range)
              .extendMarkRange("link")
              .setLink({ href: button.node.attrs.href })
              .run();
          }

          return true;
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

          return chain().setButton().run();
        },
    };
  },
});
