import type { Step } from "#constants/forms";
import type { FormData, Question } from "#lib/forms/questions";
import { resolveText } from "#lib/forms/resolveStepContent";
import {
  getChildContext,
  getRootContext,
  type QuestionContext,
  usesTitleAsLabel,
} from "#lib/forms/walkQuestions";
import { renderBlock, renderField } from "./renderers";

export interface FormStepQuestionsProps {
  step: Step;
  data: FormData;
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
  data: FormData;
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
  if (question.type === "field") {
    return renderField(question, {
      label: resolveText(question.label ?? context.title, data),
      labelHidden: usesTitleAsLabel(question),
    });
  }
  return renderBlock(question, {
    data,
    children: question.kind === "subsection" && (
      <Questions
        questions={question.children}
        data={data}
        context={getChildContext(question, context)}
      />
    ),
  });
}
