import type { Step } from "#constants/forms";
import type {
  AnyFieldQuestion,
  Condition,
  Question,
  SubsectionQuestion,
  Text,
} from "./questions";
import { resolveText } from "./resolveText";

/** Composite questions (no single `name`) label each of their own inputs. */
export function usesTitleAsLabel(question: AnyFieldQuestion): boolean {
  return question.label === undefined && question.name !== undefined;
}

export interface QuestionContext {
  conditions: readonly Condition[];
  /** The nearest titled subsection's title, or the step title. */
  title: Text;
}

export function getRootContext(step: Step): QuestionContext {
  return { conditions: [], title: step.title };
}

export function getChildContext(
  question: SubsectionQuestion,
  context: QuestionContext,
): QuestionContext {
  const { title } = question.props;
  return {
    conditions: question.when
      ? [...context.conditions, question.when]
      : context.conditions,
    title:
      typeof title === "function"
        ? (data) => title(data) ?? resolveText(context.title, data)
        : (title ?? context.title),
  };
}

export function walkQuestions(
  questions: readonly Question[],
  context: QuestionContext,
  visit: (question: Question, context: QuestionContext) => void,
): void {
  for (const question of questions) {
    visit(question, context);
    if (question.kind === "subsection") {
      walkQuestions(
        question.children,
        getChildContext(question, context),
        visit,
      );
    }
  }
}
