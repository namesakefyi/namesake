import { Node } from "@tiptap/core";

/**
 * The default document node which represents the top level node of the editor.
 * We're modifying it to allow steps to display in the editor, without defining
 * steps as a "block" type that can be nested within other blocks.
 * @see https://tiptap.dev/api/nodes/document
 */
export const DocumentWithSteps = Node.create({
  name: "doc",
  topNode: true,
  content: "(block | steps)+",
});
