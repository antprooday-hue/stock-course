"use client";

import { useMemo, useState } from "react";
import { practiceContent, type PracticeContent } from "../lib/course-data";
import { LessonActivity } from "./lesson-activity";

type LegacyLessonPracticeStepProps = {
  stepId: string;
  onContinue: () => void;
  onIncorrect: (reviewPrompt: string) => void;
  content?: never;
};

type ModernLessonPracticeStepProps = {
  content: PracticeContent;
  onContinue: () => void;
  onIncorrect: (reviewPrompt: string) => void;
  stepId?: never;
};

type LessonPracticeStepProps =
  | LegacyLessonPracticeStepProps
  | ModernLessonPracticeStepProps;

export function LessonPracticeStep(props: LessonPracticeStepProps) {
  const content =
    "content" in props
      ? props.content
      : practiceContent[props.stepId] ?? practiceContent["1-2"];

  const [activityReady, setActivityReady] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const selected = useMemo(
    () => content.options.find((option) => option.id === selectedOption) ?? null,
    [content.options, selectedOption],
  );
  const hasQuestion = Boolean(content.question && content.options.length);
  const activitySatisfied =
    !content.activityKind || activityReady || !content.useActivityAsPractice;
  const isCorrect = Boolean(selected?.correct);

  function handleCheck() {
    if (!selected) {
      return;
    }

    setShowFeedback(true);

    if (!selected.correct) {
      props.onIncorrect(selected.reviewPrompt);
    }
  }

  function handleContinue() {
    if (content.useActivityAsPractice && !content.options.length) {
      if (!activityReady && content.activityKind) {
        return;
      }
      props.onContinue();
      return;
    }

    if (!hasQuestion) {
      props.onContinue();
      return;
    }

    if (showFeedback && isCorrect) {
      props.onContinue();
    }
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcf9_100%)] p-8 shadow-[0_24px_48px_rgba(15,23,42,0.07)] md:p-12">
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
          <span className="text-sm font-semibold text-emerald-700">Practice</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
          {content.mechanicTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
          {content.mechanicSummary}
        </p>
      </div>

      {content.activityKind ? (
        <div className="mb-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            {content.prompt}
          </p>
          <LessonActivity
            activityData={content.activityData}
            activityKind={content.activityKind}
            onReadyChange={setActivityReady}
          />
        </div>
      ) : null}

      {hasQuestion ? (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-950">{content.question}</h3>
          <div className="mt-4 space-y-3">
            {content.options.map((option) => {
              const active = selectedOption === option.id;
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
                    setSelectedOption(option.id);
                    if (showFeedback) {
                      setShowFeedback(false);
                    }
                  }}
                  type="button"
                >
                  <span>{option.text}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    {showCorrect ? "Correct" : showIncorrect ? "Try again" : active ? "Selected" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {showFeedback ? (
        <div
          className={`mb-6 rounded-[1.5rem] border p-4 text-sm leading-7 ${
            isCorrect
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          {selected?.feedback ?? content.explanation}
        </div>
      ) : null}

      <div className="flex items-center justify-end">
        {content.useActivityAsPractice && !content.options.length ? (
          <button
            className={`rounded-[1.4rem] px-6 py-4 text-base font-semibold text-white transition ${
              activityReady || !content.activityKind
                ? "bg-[linear-gradient(135deg,#34d399_0%,#22c55e_60%,#16a34a_100%)] shadow-[0_18px_34px_rgba(34,197,94,0.18)]"
                : "bg-slate-300"
            }`}
            disabled={Boolean(content.activityKind) && !activityReady}
            onClick={handleContinue}
            type="button"
          >
            {content.actionLabel ?? "Continue to check"}
          </button>
        ) : hasQuestion ? (
          showFeedback && isCorrect ? (
            <button
              className="rounded-[1.4rem] bg-[linear-gradient(135deg,#34d399_0%,#22c55e_60%,#16a34a_100%)] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_34px_rgba(34,197,94,0.18)]"
              onClick={handleContinue}
              type="button"
            >
              {content.actionLabel ?? "Continue to check"}
            </button>
          ) : (
            <button
              className={`rounded-[1.4rem] px-6 py-4 text-base font-semibold text-white transition ${
                selectedOption && activitySatisfied
                  ? "bg-[linear-gradient(135deg,#34d399_0%,#22c55e_60%,#16a34a_100%)] shadow-[0_18px_34px_rgba(34,197,94,0.18)]"
                  : "bg-slate-300"
              }`}
              disabled={!selectedOption || !activitySatisfied}
              onClick={handleCheck}
              type="button"
            >
              {selectedOption || !content.activityKind
                ? "Check answer"
                : content.readinessLabel ?? "Try the interaction first"}
            </button>
          )
        ) : (
          <button
            className="rounded-[1.4rem] bg-[linear-gradient(135deg,#34d399_0%,#22c55e_60%,#16a34a_100%)] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_34px_rgba(34,197,94,0.18)]"
            onClick={handleContinue}
            type="button"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
