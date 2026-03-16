"use client";

import { useState } from "react";
import { checkContent } from "../lib/course-data";
import { CheckCircleIcon, XCircleIcon } from "./icons";

type LessonCheckStepProps = {
  stepId: string;
  onContinue: () => void;
  onIncorrect: (reviewPrompt: string) => void;
};

export function LessonCheckStep({
  stepId,
  onContinue,
  onIncorrect,
}: LessonCheckStepProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | string | null>(
    null,
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const content = checkContent[stepId] ?? checkContent["1-3"];

  const isCorrect =
    content.type === "truefalse"
      ? selectedAnswer === content.correctAnswer
      : !!content.options.find((option) => option.id === selectedAnswer)?.correct;

  function handleSubmit() {
    setShowFeedback(true);

    if (!isCorrect) {
      if (content.type === "truefalse") {
        onIncorrect(content.reviewPrompt);
      } else {
        const selected = content.options.find(
          (option) => option.id === selectedAnswer,
        );
        onIncorrect(selected?.reviewPrompt || content.reviewPrompt);
      }
    }
  }

  return (
    <div className="rounded-3xl bg-card p-8 shadow-lg md:p-12">
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2">
          <span className="text-sm font-semibold text-purple-700">Check</span>
        </div>
        <h2 className="mb-8 text-2xl font-semibold text-foreground md:text-3xl">
          {content.question}
        </h2>

        {content.type === "truefalse" ? (
          <div className="mb-6 space-y-3">
            {[
              { value: true, label: "True" },
              { value: false, label: "False" },
            ].map((option) => {
              const isSelected = selectedAnswer === option.value;
              const showCorrectState =
                showFeedback && option.value === content.correctAnswer;
              const showIncorrectState =
                showFeedback && isSelected && option.value !== content.correctAnswer;

              return (
                <button
                  key={option.label}
                  className={`w-full rounded-xl border-2 p-6 text-left transition-all ${
                    showCorrectState
                      ? "border-primary bg-accent"
                      : showIncorrectState
                        ? "border-destructive bg-destructive/5"
                        : isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-secondary hover:border-primary/40"
                  }`}
                  disabled={showFeedback}
                  onClick={() => setSelectedAnswer(option.value)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-foreground">
                      {option.label}
                    </span>
                    {showCorrectState ? (
                      <CheckCircleIcon className="h-6 w-6 fill-primary text-primary" />
                    ) : null}
                    {showIncorrectState ? (
                      <XCircleIcon className="h-6 w-6 fill-destructive text-destructive" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mb-6 space-y-3">
            {content.options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const showCorrectState = showFeedback && option.correct;
              const showIncorrectState = showFeedback && isSelected && !option.correct;

              return (
                <button
                  key={option.id}
                  className={`w-full rounded-xl border-2 p-5 text-left transition-all ${
                    showCorrectState
                      ? "border-primary bg-accent"
                      : showIncorrectState
                        ? "border-destructive bg-destructive/5"
                        : isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-secondary hover:border-primary/40"
                  }`}
                  disabled={showFeedback}
                  onClick={() => setSelectedAnswer(option.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-1 text-foreground">{option.text}</span>
                    {showCorrectState ? (
                      <CheckCircleIcon className="h-5 w-5 fill-primary text-primary" />
                    ) : null}
                    {showIncorrectState ? (
                      <XCircleIcon className="h-5 w-5 fill-destructive text-destructive" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {showFeedback ? (
          <div
            className={`mb-6 rounded-2xl border p-6 ${
              isCorrect
                ? "border-primary/20 bg-accent"
                : "border-destructive/20 bg-destructive/5"
            }`}
          >
            <h4
              className={`mb-2 font-semibold ${
                isCorrect ? "text-primary" : "text-destructive"
              }`}
            >
              {isCorrect ? "Perfect! ✨" : "Not quite, but that's okay!"}
            </h4>
            <p className="text-foreground/80">{content.explanation}</p>
          </div>
        ) : null}
      </div>

      {showFeedback ? (
        <button
          className="w-full rounded-xl bg-primary px-8 py-4 text-lg text-primary-foreground shadow-md transition-all hover:bg-primary/90"
          onClick={onContinue}
        >
          Continue
        </button>
      ) : (
        <button
          className="w-full rounded-xl bg-primary px-8 py-4 text-lg text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={selectedAnswer === null}
          onClick={handleSubmit}
        >
          Submit
        </button>
      )}
    </div>
  );
}

