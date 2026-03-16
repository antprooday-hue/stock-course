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
  const [activityValue, setActivityValue] = useState(35);
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
        <h2 className="mb-2 text-2xl font-semibold text-foreground md:text-3xl">
          {content.mechanicTitle}
        </h2>
        <p className="mb-3 text-base text-muted-foreground">
          {content.mechanicSummary}
        </p>
        <p className="mb-8 text-sm leading-relaxed text-foreground/80">
          {content.prompt}
        </p>

        <div className="mb-8 rounded-2xl bg-secondary p-6">
          <PracticeMechanic
            activityKind={content.activityKind}
            onChange={setActivityValue}
            value={activityValue}
          />
        </div>

        <div className="mb-8 rounded-2xl border border-primary/10 bg-card p-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary/75">
            More ways to interact
          </h3>
          <div className="grid gap-3 md:grid-cols-3">
            {content.supportActivities.map((item) => (
              <div
                key={item}
                className="rounded-xl bg-[linear-gradient(180deg,#f8fbf9_0%,#eef4f0_100%)] px-4 py-4 text-sm text-foreground/85"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <h3 className="mb-4 text-xl font-semibold text-foreground">
          {content.question}
        </h3>

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
                  {showCorrectState ? <span className="text-primary">✓</span> : null}
                  {showIncorrectState ? <span className="text-destructive">✗</span> : null}
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

function PracticeMechanic({
  activityKind,
  onChange,
  value,
}: {
  activityKind: string;
  onChange: (value: number) => void;
  value: number;
}) {
  if (activityKind === "ownership-board") {
    return (
      <div className="grid gap-5 md:grid-cols-[1fr_0.9fr]">
        <div className="flex items-center justify-center">
          <div
            className="h-44 w-44 rounded-full"
            style={{
              background: `conic-gradient(#16994c 0 ${value}%, #dce9df ${value}% 100%)`,
            }}
          />
        </div>
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            Your ownership view
          </p>
          <input
            className="w-full accent-[var(--primary)]"
            max={100}
            min={1}
            onChange={(event) => onChange(Number(event.target.value))}
            type="range"
            value={value}
          />
          <p className="mt-4 text-3xl font-bold text-primary">{value} shares</p>
          <p className="text-sm text-muted-foreground">
            The green slice grows as you stack more shares.
          </p>
        </div>
      </div>
    );
  }

  if (activityKind === "funding-simulator") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-card p-5">
          <p className="text-sm font-semibold text-foreground">
            Ownership kept
          </p>
          <input
            className="mt-4 w-full accent-[var(--primary)]"
            max={90}
            min={30}
            onChange={(event) => onChange(Number(event.target.value))}
            type="range"
            value={value}
          />
          <p className="mt-4 text-3xl font-bold text-foreground">{value}%</p>
        </div>
        <div className="rounded-xl bg-accent p-5">
          <p className="text-sm font-semibold text-accent-foreground">
            Money raised
          </p>
          <p className="mt-4 text-3xl font-bold text-primary">
            ${(100 - value) * 180000}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Selling more ownership raises more capital.
          </p>
        </div>
      </div>
    );
  }

  if (activityKind === "return-builder") {
    const sellPrice = value;
    const gain = sellPrice - 10;
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Buy price" value="$10" />
        <MetricCard label="Sell price" value={`$${sellPrice}`} />
        <MetricCard
          label="Result"
          strong
          value={gain >= 0 ? `+$${gain}` : `-$${Math.abs(gain)}`}
        />
      </div>
    );
  }

  if (activityKind === "news-chart") {
    return (
      <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl bg-card p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">
            Buyer pressure
          </p>
          <input
            className="w-full accent-[var(--primary)]"
            max={100}
            min={0}
            onChange={(event) => onChange(Number(event.target.value))}
            type="range"
            value={value}
          />
          <div className="mt-4 h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
        <div className="rounded-xl bg-card p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">
            Simple chart reaction
          </p>
          <svg className="h-28 w-full" viewBox="0 0 240 120">
            <polyline
              fill="none"
              points={`10,90 55,84 95,${110 - value * 0.5} 145,${95 - value * 0.35} 220,${90 - value * 0.4}`}
              stroke="#16994c"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (activityKind === "exchange-map") {
    return (
      <div className="grid gap-3 md:grid-cols-4">
        {["Buyer", "Order", "Trade", "Seller"].map((item, index) => (
          <div
            key={item}
            className={`rounded-xl px-4 py-5 text-center ${
              index === 2 ? "bg-accent text-primary" : "bg-card text-foreground"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Station
            </p>
            <p className="mt-2 font-semibold">{item}</p>
          </div>
        ))}
      </div>
    );
  }

  if (activityKind === "market-cap-board") {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Share price" value="$25" />
        <MetricCard label="Shares out" value={`${value}M`} />
        <MetricCard label="Market cap" strong value={`$${value * 25}M`} />
      </div>
    );
  }

  if (activityKind === "timeline") {
    return (
      <div className="rounded-xl bg-card p-5">
        <div className="mb-4 flex justify-between text-sm font-semibold text-foreground">
          <span>Short-term</span>
          <span>Long-term</span>
        </div>
        <div className="relative h-3 rounded-full bg-muted">
          <div
            className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-4 border-white bg-primary shadow-md"
            style={{ left: `${Math.max(0, Math.min(92, value))}%` }}
          />
        </div>
      </div>
    );
  }

  if (activityKind === "checklist") {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        {[
          "How does it make money?",
          "What risks matter?",
          "Do I understand it?",
        ].map((item) => (
          <div key={item} className="rounded-xl bg-card px-4 py-4 text-sm text-foreground">
            {item}
          </div>
        ))}
      </div>
    );
  }

  if (activityKind === "portfolio") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-red-50 p-5 text-center">
          <p className="text-sm font-semibold text-red-700">Concentrated</p>
          <p className="mt-3 text-3xl">🥚🥚🥚🥚🥚</p>
        </div>
        <div className="rounded-xl bg-accent p-5 text-center">
          <p className="text-sm font-semibold text-primary">Diversified</p>
          <p className="mt-3 text-3xl">🥚 🥚 🥚</p>
          <p className="text-3xl">🥚 🥚</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card p-4">
      <p className="mb-3 text-sm font-semibold text-foreground">Chart lab</p>
      <div className="grid gap-3 md:grid-cols-5">
        {["volatile", "steady", "uptrend", "drop", "recovery"].map((item) => (
          <div key={item} className="rounded-lg bg-secondary px-3 py-3 text-center text-sm text-foreground">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  strong = false,
  value,
}: {
  label: string;
  strong?: boolean;
  value: string;
}) {
  return (
    <div className={`rounded-xl p-5 text-center ${strong ? "bg-accent" : "bg-card"}`}>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className={`mt-3 text-3xl font-bold ${strong ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
