import type { ComponentType } from "react";
import type { FieldName } from "#constants/fields";
import type {
  BannerNode,
  Condition,
  DisplayNode,
  NoteNode,
  OptionalText,
  StepNode,
  SubsectionNode,
  Text,
} from "./types";

interface DisplayOptions<P> {
  reads?: readonly FieldName[];
  props?: P;
}

/** `props` is required when the component has required props. */
type DisplayArguments<P> =
  Record<never, never> extends P
    ? [options?: DisplayOptions<P>]
    : [options: DisplayOptions<P> & { props: P }];

/** Builders for nodes that write no data. */
export const block = {
  /** `Banner`: a callout. `content` is markdown. */
  banner(
    content: Text,
    options?: { variant?: BannerNode["variant"]; when?: Condition },
  ): BannerNode {
    return { type: "block", kind: "block.banner", content, ...options };
  },

  /** `FormSubsection`: a group of nodes with an optional title. */
  subsection(
    children: readonly StepNode[],
    options?: { title?: OptionalText; when?: Condition },
  ): SubsectionNode {
    return { type: "block", kind: "block.subsection", children, ...options };
  },

  /** A plain paragraph. */
  note(content: Text): NoteNode {
    return { type: "block", kind: "block.note", content };
  },

  /**
   * A component that writes no data: a shared banner, or a computed view.
   * `reads` lists the fields it depends on.
   */
  display<P extends object>(
    component: ComponentType<P>,
    ...[options]: DisplayArguments<P>
  ): DisplayNode {
    const { reads = [], props } = (options ?? {}) as DisplayOptions<P>;
    return { type: "block", kind: "block.display", component, props, reads };
  },
};
