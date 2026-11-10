import type { ComponentType } from "react";
import type { Step } from "#constants/forms";
import type { Data, Question, QuestionKind } from "#lib/forms/questions";
import { resolveText } from "#lib/forms/resolveStepContent";
import {
  getChildContext,
  getRootContext,
  type QuestionContext,
  usesTitleAsLabel,
} from "#lib/forms/walkQuestions";
import {
  type QuestionOfKind,
  type RendererProps,
  renderers,
} from "./renderers";

export interface FormStepQuestionsProps {
  step: Step;
  data: Data;
}

export function FormStepQuestions({ step, data }: FormStepQuestionsProps) {
  return (
    <Questions
      questions={step.questions}
      data={data}
      context={getRootContext(step)}
    />
  );
}

interface QuestionsProps {
  questions: readonly Question[];
  data: Data;
  context: QuestionContext;
}

function Questions({ questions, data, context }: QuestionsProps) {
  return questions.map((question, index) => {
    if (question.when && !question.when(data)) return null;
    const key = `${question.kind}-${index}`;
    return (
      <QuestionView
        key={key}
        question={question}
        data={data}
        context={context}
      />
    );
  });
}

function QuestionView({
  question,
  data,
  context,
}: { question: Question } & Omit<QuestionsProps, "questions">) {
  const isField = question.type === "field";
  return renderQuestion(question, {
    data,
    label: isField ? resolveText(question.label ?? context.title, data) : "",
    labelHidden: isField && usesTitleAsLabel(question),
    children:
      question.kind === "subsection" ? (
        <Questions
          questions={question.children}
          data={data}
          context={getChildContext(question, context)}
        />
      ) : undefined,
  });
}

/** Renders a question with the renderer for its kind. */
function renderQuestion<K extends QuestionKind>(
  question: QuestionOfKind<K> & { kind: K },
  props: Omit<RendererProps<K>, "question">,
) {
  const Renderer: ComponentType<RendererProps<K>> = renderers[question.kind];
  return <Renderer {...props} question={question} />;
}
