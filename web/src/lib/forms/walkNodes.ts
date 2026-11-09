import { resolveText } from "./resolveStepContent";
import type {
  AnyFieldNode,
  Condition,
  Step,
  StepNode,
  SubsectionNode,
  Text,
} from "./types";

/** Composite nodes (no single `name`) label each of their own inputs. */
export function usesTitleAsLabel(node: AnyFieldNode): boolean {
  return node.label === undefined && node.name !== undefined;
}

export interface NodeContext {
  conditions: readonly Condition[];
  /** The nearest titled subsection's title, or the step title. */
  title: Text;
}

export function getRootContext(step: Step): NodeContext {
  return { conditions: [], title: step.title };
}

export function getChildContext(
  node: SubsectionNode,
  context: NodeContext,
): NodeContext {
  const { title } = node;
  return {
    conditions: node.when
      ? [...context.conditions, node.when]
      : context.conditions,
    title:
      typeof title === "function"
        ? (data) => title(data) ?? resolveText(context.title, data)
        : (title ?? context.title),
  };
}

export function walkNodes(
  nodes: readonly StepNode[],
  context: NodeContext,
  visit: (node: StepNode, context: NodeContext) => void,
): void {
  for (const node of nodes) {
    visit(node, context);
    if (node.kind === "subsection") {
      walkNodes(node.children, getChildContext(node, context), visit);
    }
  }
}
