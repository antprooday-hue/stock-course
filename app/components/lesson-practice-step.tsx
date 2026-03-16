"use client";

import { useState } from "react";
import { practiceContent } from "../lib/course-data";

type LessonPracticeStepProps = {
  stepId: string;
  onContinue: () => void;
  onIncorrect: (reviewPrompt: string) => void;
};

export function LessonPracticeStep({
  stepId,
  onContinue,
  onIncorrect,
}: LessonPracticeStepProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const content = practiceContent[stepId] ?? practiceContent["1-2"];

  const selectedOptionData = content.options.find(
    (option) => option.id === selectedOption,
  );
  const isCorrect = !!selectedOptionData?.correct;

  function handleCheck() {
    setShowFeedback(true);

    if (selectedOptionData && !selectedOptionData.correct) {
      onIncorrect(selectedOptionData.reviewPrompt);
    }
  }

  return (
    <div className="rounded-3xl bg-card p-8 shadow-lg md:p-12">
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2">
          <span className="text-sm font-semibold text-blue-700">Practice</span>
        </div>
        <h2 className="mb-8 text-2xl font-semibold text-foreground md:text-3xl">
          {content.question}
        </h2>

        {content.chart ? (
          <div className="mb-8 rounded-2xl bg-secondary p-6">
            <svg className="h-48 w-full" viewBox="0 0 400 200">
              <polyline
                fill="none"
                points="20,150 80,145 140,130 200,100 260,95 320,80 380,75"
                stroke="#16A34A"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
              <line x1="20" x2="380" y1="180" y2="180" stroke="#E5E7EB" strokeWidth="2" />
              <line x1="20" x2="20" y1="20" y2="180" stroke="#E5E7EB" strokeWidth="2" />
              <text x="140" y="195" className="fill-muted-foreground text-xs">
                March
              </text>
              <text x="260" y="195" className="fill-muted-foreground text-xs">
                June
              </text>
            </svg>
          </div>
        ) : null}

        <div className="mb-6 space-y-3">
          {content.options.map((option) => {
            const isSelected = selectedOption === option.id;
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
                } ${showFeedback ? "cursor-default" : "cursor-pointer hover:scale-[1.01]"}`}
                disabled={showFeedback}
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      showCorrectState
                        ? "border-primary bg-primary"
                        : showIncorrectState
                          ? "border-destructive bg-destructive"
                          : isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                    }`}
                  >
                    {isSelected || showCorrectState ? (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    ) : null}
                  </div>
                  <span className="flex-1 text-foreground">{option.text}</span>
                  {showCorrectState ? (
                    <span className="text-primary">✓</span>
                  ) : null}
                  {showIncorrectState ? (
                    <span className="text-destructive">✗</span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

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
              {isCorrect ? "Correct! 🎉" : "Not quite"}
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
          disabled={!selectedOption}
          onClick={handleCheck}
        >
          Check answer
        </button>
      )}
    </div>
  );
}

