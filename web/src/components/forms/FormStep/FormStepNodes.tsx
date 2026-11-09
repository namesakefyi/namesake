import type { ComponentType } from "react";
import { resolveText } from "#lib/forms/resolveStepContent";
import type { Data, Step, StepNode } from "#lib/forms/types";
import {
  getChildContext,
  getRootContext,
  type NodeContext,
  usesTitleAsLabel,
} from "#lib/forms/walkNodes";
import { renderers } from "./renderers";

export interface FormStepNodesProps {
  step: Step;
  /** The live answers, watched once by `FormStep`. */
  data: Data;
}

/** Renders a step's body, leaving nodes whose condition fails unmounted. */
export function FormStepNodes({ step, data }: FormStepNodesProps) {
  return <Nodes nodes={step.body} data={data} context={getRootContext(step)} />;
}

interface NodesProps {
  nodes: readonly StepNode[];
  data: Data;
  context: NodeContext;
}

function Nodes({ nodes, data, context }: NodesProps) {
  return nodes.map((node, index) => {
    if ("when" in node && node.when && !node.when(data)) return null;
    // Nodes never reorder, so their position is a stable key.
    const key = `${node.kind}-${index}`;
    return <NodeView key={key} node={node} data={data} context={context} />;
  });
}

function NodeView({
  node,
  data,
  context,
}: { node: StepNode } & Omit<NodesProps, "nodes">) {
  if (node.type === "field") {
    return renderNode({
      node,
      label: resolveText(node.label ?? context.title, data),
      labelHidden: usesTitleAsLabel(node),
    });
  }
  if (node.kind === "block.subsection") {
    return renderNode({
      node,
      data,
      children: (
        <Nodes
          nodes={node.children}
          data={data}
          context={getChildContext(node, context)}
        />
      ),
    });
  }
  return renderNode({ node, data });
}

function renderNode(props: { node: StepNode } & Record<string, unknown>) {
  // The registry is keyed by kind, so this renderer takes these props; the
  // lookup can't carry that link through the union.
  const Renderer = renderers[props.node.kind] as unknown as ComponentType<
    typeof props
  >;
  return <Renderer {...props} />;
}
