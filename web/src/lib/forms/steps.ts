/**
 * Everything a form needs to describe its steps: the `node` builders, and
 * the types they use. Conditions are plain `(data) => boolean` functions;
 * `withDeps` declares reads that tracing can miss.
 */
export { withDeps } from "./conditions";
export { getStepFields, type StepField } from "./getStepFields";
export { node } from "./node";
export type {
  BooleanFieldName,
  Condition,
  Data,
  StepNode,
  StringFieldName,
  Text,
  TextFieldName,
} from "./types";
