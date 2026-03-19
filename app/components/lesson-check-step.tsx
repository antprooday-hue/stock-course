"use client";

import { useMemo, useState } from "react";
import { checkContent, type CheckContent } from "../lib/course-data";

type LegacyLessonCheckStepProps = {
  stepId: string;
  onContinue: () => void;
  onIncorrect: (reviewPrompt: string) => void;
  content?: never;
};

type ModernLessonCheckStepProps = {
  content: CheckContent;
  onContinue: () => void;
  onIncorrect: (reviewPrompt: string) => void;
  stepId?: never;
};

type LessonCheckStepProps =
  | LegacyLessonCheckStepProps
  | ModernLessonCheckStepProps;

export function LessonCheckStep(props: LessonCheckStepProps) {
  const content =
    "content" in props
      ? props.content
      : checkContent[props.stepId] ?? checkContent["1-3"];

  const [selectedAnswer, setSelectedAnswer] = useState<boolean | string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const isCorrect = useMemo(() => {
    if (content.type === "truefalse") {
      return selectedAnswer === content.correctAnswer;
    }

    return Boolean(
      content.options?.find((option) => option.id === selectedAnswer)?.correct,
    );
  }, [content, selectedAnswer]);

  function handleSubmit() {
    setShowFeedback(true);

    if (isCorrect) {
      return;
    }

    if (content.type === "truefalse") {
      props.onIncorrect(content.reviewPrompt);
      return;
    }

    const selected = content.options?.find((option) => option.id === selectedAnswer);
    props.onIncorrect(selected?.reviewPrompt || content.reviewPrompt);
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcf9_100%)] p-8 shadow-[0_24px_48px_rgba(15,23,42,0.07)] md:p-12">
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2">
          <span className="text-sm font-semibold text-indigo-700">Check</span>
        </div>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
          {content.question}
        </h2>
      </div>

      {content.type === "truefalse" ? (
        <div className="space-y-3">
          {[
            { value: true, label: "True" },
            { value: false, label: "False" },
          ].map((option) => {
            const active = selectedAnswer === option.value;
            const showCorrect = showFeedback && option.value === content.correctAnswer;
            const showIncorrect =
              showFeedback && active && option.value !== content.correctAnswer;

            return (
              <button
                key={option.label}
                className={`flex w-full items-center justify-between rounded-[1.4rem] border px-5 py-4 text-left transition ${
                  showCorrect
                    ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                    : showIncorrect
                      ? "border-rose-300 bg-rose-50 text-rose-900"
                      : active
                        ? "border-slate-400 bg-slate-50 text-slate-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
                onClick={() => {
                  setSelectedAnswer(option.value);
                  if (showFeedback) {
                    setShowFeedback(false);
                  }
                }}
                type="button"
              >
                <span>{option.label}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {showCorrect ? "Correct" : showIncorrect ? "Wrong" : active ? "Selected" : ""}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {content.options?.map((option) => {
            const active = selectedAnswer === option.id;
            const showCorrect = showFeedback && option.correct;
            const showIncorrect = showFeedback && active && !option.correct;

            return (
              <button
                key={option.id}
                className={`flex w-full items-center justify-between rounded-[1.4rem] border px-5 py-4 text-left transition ${
                  showCorrect
                    ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                    : showIncorrect
                      ? "border-rose-300 bg-rose-50 text-rose-900"
                      : active
                        ? "border-slate-400 bg-slate-50 text-slate-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
                onClick={() => {
                  setSelectedAnswer(option.id);
                  if (showFeedback) {
                    setShowFeedback(false);
                  }
                }}
                type="button"
              >
                <span>{option.text}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {showCorrect ? "Correct" : showIncorrect ? "Wrong" : active ? "Selected" : ""}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {showFeedback ? (
        <div
          className={`mt-6 rounded-[1.5rem] border p-4 text-sm leading-7 ${
            isCorrect
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          {content.explanation}
        </div>
      ) : null}

      <div className="mt-8 flex items-center justify-end">
        {showFeedback && isCorrect ? (
          <button
            className="rounded-[1.4rem] bg-[linear-gradient(135deg,#34d399_0%,#22c55e_60%,#16a34a_100%)] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_34px_rgba(34,197,94,0.18)]"
            onClick={props.onContinue}
            type="button"
          >
            Continue
          </button>
        ) : (
          <button
            className={`rounded-[1.4rem] px-6 py-4 text-base font-semibold text-white transition ${
              selectedAnswer !== null
                ? "bg-[linear-gradient(135deg,#34d399_0%,#22c55e_60%,#16a34a_100%)] shadow-[0_18px_34px_rgba(34,197,94,0.18)]"
                : "bg-slate-300"
            }`}
            disabled={selectedAnswer === null}
            onClick={handleSubmit}
            type="button"
          >
            Check answer
          </button>
        )}
      </div>
    </div>
  );
}
