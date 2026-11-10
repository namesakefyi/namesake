import type { ComponentType } from "react";
import { resolveText } from "#lib/forms/resolveStepContent";
import type { Data, Question, Step } from "#lib/forms/types";
import {
  getChildContext,
  getRootContext,
  type QuestionContext,
  usesTitleAsLabel,
} from "#lib/forms/walkQuestions";
import { renderers } from "./renderers";

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
    if ("when" in question && question.when && !question.when(data))
      return null;
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
  if (question.type === "field") {
    return renderQuestion({
      question,
      label: resolveText(question.label ?? context.title, data),
      labelHidden: usesTitleAsLabel(question),
    });
  }
  if (question.kind === "subsection") {
    return renderQuestion({
      question,
      data,
      children: (
        <Questions
          questions={question.children}
          data={data}
          context={getChildContext(question, context)}
        />
      ),
    });
  }
  return renderQuestion({ question, data });
}

function renderQuestion(
  props: { question: Question } & Record<string, unknown>,
) {
  // The registry is keyed by kind, so this renderer takes these props; the
  // lookup can't carry that link through the union.
  const Renderer = renderers[props.question.kind] as unknown as ComponentType<
    typeof props
  >;
  return <Renderer {...props} />;
}
