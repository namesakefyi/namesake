import { type ComponentType, type ReactNode, useMemo, useRef } from "react";
import {
  Controller,
  FormProvider,
  type UseFormReturn,
  useFormContext,
} from "react-hook-form";
import type { FieldName, FormData } from "#constants/fields";
import { toChoices } from "#lib/forms/optionLabels";
import { resolveText } from "#lib/forms/resolveStepContent";
import type {
  AnyFieldNode,
  Data,
  FieldRenderProps,
  Step,
  StepNode,
  WrittenField,
} from "#lib/forms/types";
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
  return (
    <Nodes
      nodes={step.body}
      step={step}
      data={data}
      context={getRootContext(step)}
    />
  );
}

interface NodesProps {
  nodes: readonly StepNode[];
  step: Step;
  data: Data;
  context: NodeContext;
}

type NodeProps<N> = { node: N } & Omit<NodesProps, "nodes">;

function Nodes({ nodes, ...props }: NodesProps) {
  return nodes.map((node, index) => {
    if ("when" in node && node.when && !node.when(props.data)) return null;
    // Nodes never reorder, so their position is a stable key.
    const key = `${node.kind}-${index}`;
    return <NodeView key={key} node={node} {...props} />;
  });
}

function NodeView({ node, step, data, context }: NodeProps<StepNode>) {
  if (node.type === "field") {
    return <FieldView node={node} step={step} data={data} context={context} />;
  }

  switch (node.kind) {
    case "block.subsection":
      return renderNode({
        node,
        data,
        children: (
          <Nodes
            nodes={node.children}
            step={step}
            data={data}
            context={getChildContext(node, context)}
          />
        ),
      });
    case "block.custom":
      return (
        <WritesGuard
          writes={node.writes}
          owner={`block.custom in "${step.id}"`}
        >
          {renderNode({ node, data })}
        </WritesGuard>
      );
    default:
      return renderNode({ node, data });
  }
}

function renderNode(props: { node: StepNode } & Record<string, unknown>) {
  // The registry is keyed by kind, so this renderer takes these props; the
  // lookup can't carry that link through the union.
  const Renderer = renderers[props.node.kind] as unknown as ComponentType<
    typeof props
  >;
  return <Renderer {...props} />;
}

function FieldView({ node, step, data, context }: NodeProps<AnyFieldNode>) {
  const label = resolveText(node.label ?? context.title, data);
  const labelHidden = usesTitleAsLabel(node);

  if (!node.render) {
    return renderNode({ node, label, labelHidden });
  }

  const Render = node.render;
  const props: FieldRenderProps = {
    name: node.name,
    label,
    labelHidden,
    description: node.description,
    choices:
      "options" in node.props ? toChoices(node.props.options) : undefined,
  };
  const owner = `render override on ${node.kind} in "${step.id}"`;

  return (
    <WritesGuard writes={node.writes} owner={owner}>
      {node.name ? (
        <Controller<FormData>
          name={node.name}
          render={({ field, fieldState }) => (
            <Render {...props} field={field} fieldState={fieldState} />
          )}
        />
      ) : (
        <Render {...props} />
      )}
    </WritesGuard>
  );
}

interface WritesGuardProps {
  writes: readonly (FieldName | WrittenField)[];
  owner: string;
  children: ReactNode;
}

/**
 * In development, warns when a fallback registers a form field it did not
 * declare in `writes`, since readers only know about declared writes.
 */
function DevWritesGuard({ writes, owner, children }: WritesGuardProps) {
  const methods = useFormContext<FormData>();
  const warned = useRef(new Set<string>());

  const guarded = useMemo((): UseFormReturn<FormData> => {
    const allowed = new Set<string>(
      writes.map((written) =>
        typeof written === "string" ? written : written.id,
      ),
    );
    const check = (name: string) => {
      const root = name.split(".")[0];
      if (allowed.has(root) || warned.current.has(root)) return;
      warned.current.add(root);
      console.warn(
        `[FormStep] The ${owner} registers "${root}", which is not in its writes.`,
      );
    };
    const register: typeof methods.register = (name, options) => {
      check(name);
      return methods.register(name, options);
    };
    const control = new Proxy(methods.control, {
      get(target, property, receiver) {
        if (property === "register") return register;
        return Reflect.get(target, property, receiver);
      },
    });
    return { ...methods, register, control };
  }, [methods, writes, owner]);

  return <FormProvider {...guarded}>{children}</FormProvider>;
}

/** The writes check runs only in development; in production it adds nothing. */
const WritesGuard = import.meta.env.DEV
  ? DevWritesGuard
  : ({ children }: WritesGuardProps) => children;
