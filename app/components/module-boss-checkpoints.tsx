"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { stableShuffle } from "../lib/stable-shuffle";
import { CheckCircleIcon, LockIcon, XCircleIcon } from "./icons";

type BossPracticeProps = {
  currentStep: number;
  onAdvanceToCheck: () => void;
  onIncorrect: (reviewPrompt: string) => void;
  onStepChange: (step: number) => void;
};

type BossCheckProps = {
  onComplete: () => void;
  onIncorrect: (reviewPrompt: string) => void;
  onSetbackToPractice: (step: number) => void;
};

type BossOption = {
  feedback: string;
  id: string;
  label: string;
  reviewPrompt: string;
};

type SetbackState = {
  buttonLabel: string;
  message: string;
  targetStep: number;
};

function stableShuffleMixed<T>(items: T[], seedSource: string) {
  const shuffled = stableShuffle(items, seedSource);

  if (
    shuffled.length > 1 &&
    shuffled.every((item, index) => Object.is(item, items[index]))
  ) {
    return [...shuffled.slice(1), shuffled[0]];
  }

  return shuffled;
}

function buildSparklinePath(points: number[], width: number, height: number) {
  if (points.length === 0) {
    return "";
  }

  const padding = 8;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  return points
    .map((point, index) => {
      const x = padding + (innerWidth * index) / Math.max(points.length - 1, 1);
      const y = padding + innerHeight - (point / 100) * innerHeight;

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function getPointStyle(
  points: number[],
  index: number,
  width: number,
  height: number,
  inset: { left: number; top: number },
) {
  const padding = 8;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const x = padding + (innerWidth * index) / Math.max(points.length - 1, 1);
  const y = padding + innerHeight - (points[index] / 100) * innerHeight;

  return {
    left: `${inset.left + x}px`,
    top: `${inset.top + y}px`,
  };
}

function BossStepRail({
  activeStep,
  stepLabels,
}: {
  activeStep: number;
  stepLabels: string[];
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {stepLabels.map((label, index) => {
        const complete = index < activeStep;
        const active = index === activeStep;
        const locked = index > activeStep;

        return (
          <div
            key={label}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${
              complete
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-400"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-[11px] text-current">
              {complete ? (
                <CheckCircleIcon className="h-3.5 w-3.5" />
              ) : locked ? (
                <LockIcon className="h-3.5 w-3.5" />
              ) : (
                index + 1
              )}
            </span>
            {label}
          </div>
        );
      })}
    </div>
  );
}

function FeedbackBox({
  kind,
  message,
}: {
  kind: "error" | "success";
  message: string;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        kind === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      <div className="flex items-start gap-2">
        {kind === "success" ? (
          <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
        ) : (
          <XCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
}

function BossChart({
  accent = "#16a34a",
  points,
}: {
  accent?: string;
  points: number[];
}) {
  return (
    <svg className="h-full w-full" viewBox="0 0 304 132" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 8 116 L 296 116"
        fill="none"
        opacity="0.3"
        stroke="#d1d5db"
        strokeDasharray="3 5"
        strokeLinecap="round"
        strokeWidth="1"
      />
      <path
        d={buildSparklinePath(points, 304, 132)}
        fill="none"
        stroke={accent}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
    </svg>
  );
}

function BossShell({
  children,
  badgeTone = "emerald",
}: {
  badgeTone?: "emerald" | "violet";
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.8rem] border border-white/80 bg-white/98 p-7 shadow-[0_22px_44px_rgba(15,23,42,0.06)] md:p-10">
      <div className="mb-8">
        <div
          className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 ${
            badgeTone === "emerald"
              ? "border-emerald-200 bg-emerald-50"
              : "border-violet-200 bg-violet-50"
          }`}
        >
          <span
            className={`text-sm font-semibold ${
              badgeTone === "emerald" ? "text-emerald-700" : "text-purple-700"
            }`}
          >
            Boss checkpoint
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

const chartBossStepLabels = ["Axes", "Time", "Range", "Caution", "Summary"];

const chartBossStepOneOptions: BossOption[] = [
  {
    id: "price-over-time",
    label: "A chart shows price over time",
    feedback: "Correct. A chart gives you price across time, not a promise.",
    reviewPrompt: "",
  },
  {
    id: "guarantee",
    label: "A chart guarantees the next move",
    feedback: "A chart can help you read history, but it never guarantees the next move.",
    reviewPrompt: "chart-price-time",
  },
  {
    id: "revenue-only",
    label: "A chart only shows company revenue",
    feedback: "That confuses price action with business fundamentals.",
    reviewPrompt: "chart-price-time",
  },
  {
    id: "news-only",
    label: "A chart is only a news feed",
    feedback: "News can affect price, but the chart itself is a price-over-time view.",
    reviewPrompt: "chart-price-time",
  },
];

const chartBossSummaryOptions: BossOption[] = [
  {
    id: "correct",
    label:
      "A chart shows price over time, the newest point is usually on the right, higher points mean higher price, and history still does not guarantee the future.",
    feedback: "That is the clean chart-basics summary.",
    reviewPrompt: "",
  },
  {
    id: "guarantee",
    label: "A rising chart proves the stock will keep rising.",
    feedback: "That turns a chart read into a certainty claim.",
    reviewPrompt: "chart-history-not-certainty",
  },
  {
    id: "mix-axes",
    label: "Higher points are always newer points.",
    feedback: "That mixes vertical price with horizontal time.",
    reviewPrompt: "vertical-price-reading",
  },
  {
    id: "revenue",
    label: "The chart mainly shows company revenue over time.",
    feedback: "This module is about price charts, not revenue charts.",
    reviewPrompt: "chart-price-time",
  },
];

export function ChartBasicsBossPractice({
  currentStep,
  onAdvanceToCheck,
  onIncorrect,
  onStepChange,
}: BossPracticeProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sequence, setSequence] = useState<string[]>([]);
  const [selectedRange, setSelectedRange] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);

  const shuffledStepOneOptions = useMemo(
    () => stableShuffle(chartBossStepOneOptions, "chart-basics-boss-step-1"),
    [],
  );

  useEffect(() => {
    setSelectedId(null);
    setSequence([]);
    setSelectedRange([]);
    setSuccessMessage(null);
    setSetback(null);
  }, [currentStep]);

  function triggerSetback(message: string, targetStep: number, reviewPrompt: string) {
    if (reviewPrompt) {
      onIncorrect(reviewPrompt);
    }

    setSetback({
      targetStep,
      message,
      buttonLabel: targetStep === currentStep ? "Retry this step" : `Back to Step ${targetStep + 1}`,
    });
  }

  function renderAxesStep() {
    const selectedOption =
      chartBossStepOneOptions.find((option) => option.id === selectedId) ?? null;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={chartBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 1 · Axes foundation</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          What is the cleanest first description of a stock chart?
        </p>
        <div className="mt-5 space-y-3">
          {shuffledStepOneOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(1)}
              type="button"
            >
              Lock Step 2
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "price-over-time") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — lock the chart map in first.", 0, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderTimeStep() {
    const ordered = ["early", "middle", "late"];
    const labels: Record<string, string> = {
      early: "Early snapshot",
      middle: "Middle snapshot",
      late: "Latest snapshot",
    };
    const remaining = stableShuffleMixed(
      ordered.filter((item) => !sequence.includes(item)),
      `chart-basics-boss-step-2-${sequence.length}`,
    );
    const correct =
      sequence.length === ordered.length &&
      sequence.every((item, index) => item === ordered[index]);

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={chartBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 2 · Time flow</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Build the snapshots from earliest to latest.
        </p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Ordered sequence
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {ordered.map((_, index) => (
              <div
                key={index}
                className={`rounded-full px-3 py-2 text-sm ${
                  sequence[index] ? "bg-emerald-50 text-emerald-800" : "bg-white text-slate-400"
                }`}
              >
                {sequence[index] ? labels[sequence[index]] : `Step ${index + 1}`}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {remaining.map((item) => (
            <button
              key={item}
              className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
              onClick={() => setSequence((current) => [...current, item])}
              type="button"
            >
              <p className="text-sm font-semibold text-slate-900">{labels[item]}</p>
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(2)}
              type="button"
            >
              Lock Step 3
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={sequence.length !== ordered.length}
              onClick={() => {
                if (!correct) {
                  triggerSetback("Not quite — re-lock the time direction first.", 0, "chart-chronology");
                  return;
                }
                setSuccessMessage("Correct. The chart becomes more recent as it moves to the right.");
              }}
              type="button"
            >
              {sequence.length === ordered.length ? "Lock order" : "Finish the order first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderRangeStep() {
    const chartPoints = [28, 72, 46, 32, 78];
    const peakIndex = chartPoints.indexOf(Math.max(...chartPoints));
    const lowIndex = chartPoints.indexOf(Math.min(...chartPoints));
    const correctStage = selectedRange.length === 0 ? "peak" : "low";

    function handleTap(point: "peak" | "low") {
      if (point !== correctStage) {
        triggerSetback("Not quite — re-lock the chart order before the range read.", 1, "chart-range-extremes");
        return;
      }

      const next = [...selectedRange, point];
      setSelectedRange(next);

      if (next.length === 2) {
        setSuccessMessage("Correct. You found the visible high first and the visible low second.");
      }
    }

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={chartBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 3 · Range read</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Tap the highest visible point first, then the lowest visible point.
        </p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="relative h-40 rounded-xl bg-[linear-gradient(180deg,#fbfdfc_0%,#f3f7f4_100%)] p-3">
            <BossChart points={chartPoints} />
            <button
              className={`absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ${
                selectedRange.includes("peak") ? "bg-emerald-500 ring-emerald-100" : "bg-slate-500 ring-white"
              }`}
              onClick={() => handleTap("peak")}
              style={getPointStyle(chartPoints, peakIndex, 304, 132, { left: 18, top: 10 })}
              type="button"
            />
            <button
              className={`absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ${
                selectedRange.includes("low") ? "bg-emerald-500 ring-emerald-100" : "bg-slate-500 ring-white"
              }`}
              onClick={() => handleTap("low")}
              style={getPointStyle(chartPoints, lowIndex, 304, 132, { left: 18, top: 10 })}
              type="button"
            />
          </div>
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(3)}
              type="button"
            >
              Lock Step 4
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled
              type="button"
            >
              Tap peak, then low
            </button>
          )}
        </div>
      </>
    );
  }

  function renderCautionStep() {
    const options: BossOption[] = [
      {
        id: "careful",
        label: "The chart is mostly rising, but history still does not guarantee the next move.",
        feedback: "Correct. That keeps the structure and the caution together.",
        reviewPrompt: "",
      },
      {
        id: "must-rise",
        label: "The chart rose, so it must keep rising.",
        feedback: "That turns chart reading into certainty.",
        reviewPrompt: "chart-history-not-certainty",
      },
      {
        id: "no-meaning",
        label: "The chart means nothing at all.",
        feedback: "That throws away useful chart structure.",
        reviewPrompt: "chart-price-time",
      },
    ];
    const selectedOption = options.find((option) => option.id === selectedId) ?? null;
    const shuffledOptions = stableShuffleMixed(options, "chart-basics-boss-step-4");

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={chartBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 4 · Careful interpretation</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Choose the chart read that keeps the facts without pretending certainty.
        </p>
        <div className="mt-5 space-y-3">
          {shuffledOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={onAdvanceToCheck}
              type="button"
            >
              Enter final summary
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "careful") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — re-lock the range read before the conclusion.", 2, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <BossShell>
      {currentStep === 0
        ? renderAxesStep()
        : currentStep === 1
          ? renderTimeStep()
          : currentStep === 2
            ? renderRangeStep()
            : renderCautionStep()}
    </BossShell>
  );
}

export function ChartBasicsBossCheck({
  onComplete,
  onIncorrect,
  onSetbackToPractice,
}: BossCheckProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);
  const shuffledOptions = useMemo(
    () => stableShuffle(chartBossSummaryOptions, "chart-basics-boss-step-5"),
    [],
  );

  const selectedOption =
    chartBossSummaryOptions.find((option) => option.id === selectedId) ?? null;

  return (
    <BossShell badgeTone="violet">
      <BossStepRail activeStep={4} stepLabels={chartBossStepLabels} />
      <h2 className="text-2xl font-semibold text-slate-950">Step 5 · Final summary</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Choose the only summary that keeps axes, time, price, and caution in the right roles.
      </p>
      <div className="mt-5 space-y-3">
        {shuffledOptions.map((option) => (
          <button
            key={option.id}
            className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
              selectedId === option.id
                ? "selected border-emerald-300 bg-emerald-50"
                : "border-slate-200 bg-white"
            }`}
            onClick={() => setSelectedId(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
      {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
      <div className="mt-6">
        {successMessage ? (
          <button
            className="interactive-cta journey-forward-cta reward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white"
            onClick={onComplete}
            type="button"
          >
            Claim progress
          </button>
        ) : setback ? (
          <button
            className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-800"
            onClick={() => {
              setSetback(null);
              onSetbackToPractice(setback.targetStep);
            }}
            type="button"
          >
            {setback.buttonLabel}
          </button>
        ) : (
          <button
            className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white disabled:opacity-45"
            disabled={!selectedOption}
            onClick={() => {
              if (!selectedOption) return;
              if (selectedOption.id === "correct") {
                setSuccessMessage("Boss cleared. You read chart structure, time, range, and caution in one clean pass.");
                return;
              }
              onIncorrect(selectedOption.reviewPrompt);
              setSetback({
                targetStep: 3,
                buttonLabel: "Back to Step 4",
                message: "Not quite — lock the careful interpretation back in before the final summary.",
              });
            }}
            type="button"
          >
            {selectedOption ? "Lock final answer" : "Choose an answer first"}
          </button>
        )}
      </div>
    </BossShell>
  );
}

const trendBossStepLabels = ["Direction", "Quality", "Noise", "Momentum", "Summary"];

const trendBossDirectionOptions: BossOption[] = [
  {
    id: "uptrend",
    label: "Mostly rising overall",
    feedback: "Correct. The dominant direction is still upward.",
    reviewPrompt: "",
  },
  {
    id: "sideways",
    label: "No direction at all",
    feedback: "This chart still has a stronger upward bias than that.",
    reviewPrompt: "trend-definition",
  },
  {
    id: "guaranteed",
    label: "Guaranteed continuation",
    feedback: "Direction is not the same thing as certainty.",
    reviewPrompt: "trend-definition",
  },
  {
    id: "downtrend",
    label: "Mostly falling overall",
    feedback: "That is the opposite of the dominant path here.",
    reviewPrompt: "trend-definition",
  },
];

const trendBossSummaryOptions: BossOption[] = [
  {
    id: "correct",
    label:
      "The chart is mostly rising, the continuation quality looks decent, the wiggles do not erase the trend, momentum can change, and the final read should stay careful.",
    feedback: "That is the strongest synthesis.",
    reviewPrompt: "",
  },
  {
    id: "guarantee",
    label: "A strong trend means the next move is guaranteed.",
    feedback: "That drops the caution the module was building.",
    reviewPrompt: "trend-boss",
  },
  {
    id: "noise-only",
    label: "One noisy pullback matters more than the trend.",
    feedback: "That gives too much weight to noise.",
    reviewPrompt: "noise-vs-trend",
  },
  {
    id: "pace-equals-direction",
    label: "If direction stays up, momentum cannot fade.",
    feedback: "Direction and momentum are different reads.",
    reviewPrompt: "momentum-fading",
  },
];

export function TrendMomentumBossPractice({
  currentStep,
  onAdvanceToCheck,
  onIncorrect,
  onStepChange,
}: BossPracticeProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sequence, setSequence] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);

  const shuffledDirectionOptions = useMemo(
    () => stableShuffle(trendBossDirectionOptions, "trend-boss-step-1"),
    [],
  );

  useEffect(() => {
    setSelectedId(null);
    setSequence([]);
    setSuccessMessage(null);
    setSetback(null);
  }, [currentStep]);

  function triggerSetback(message: string, targetStep: number, reviewPrompt: string) {
    if (reviewPrompt) {
      onIncorrect(reviewPrompt);
    }

    setSetback({
      targetStep,
      message,
      buttonLabel: targetStep === currentStep ? "Retry this step" : `Back to Step ${targetStep + 1}`,
    });
  }

  function renderDirectionStep() {
    const selectedOption =
      trendBossDirectionOptions.find((option) => option.id === selectedId) ?? null;
    const chartPoints = [22, 30, 40, 36, 50, 60, 56, 70];

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={trendBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 1 · Direction first</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Name the broad direction before you get pulled into details.
        </p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="rounded-xl bg-[linear-gradient(180deg,#fbfdfc_0%,#f3f7f4_100%)] p-3">
            <BossChart points={chartPoints} />
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {shuffledDirectionOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(1)}
              type="button"
            >
              Lock Step 2
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "uptrend") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — name the broad direction first.", 0, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderQualityStep() {
    const ordered = ["weak", "medium", "strong"];
    const steps = {
      weak: { label: "Weak trend", points: [20, 30, 24, 36, 28, 40, 34, 44] },
      medium: { label: "Steadier trend", points: [18, 28, 24, 38, 34, 48, 44, 58] },
      strong: { label: "Strong trend", points: [16, 28, 24, 40, 36, 56, 50, 70] },
    };
    const remaining = stableShuffleMixed(
      ordered.filter((item) => !sequence.includes(item)),
      `trend-boss-step-2-${sequence.length}`,
    );
    const correct =
      sequence.length === ordered.length &&
      sequence.every((item, index) => item === ordered[index]);

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={trendBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 2 · Trend quality</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Rank the three rises from weakest continuation to strongest continuation.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {ordered.map((_, index) => (
            <div
              key={index}
              className={`rounded-full px-3 py-2 text-sm ${
                sequence[index] ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500"
              }`}
            >
              {sequence[index] ? steps[sequence[index] as keyof typeof steps].label : `Slot ${index + 1}`}
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {remaining.map((item) => (
            <button
              key={item}
              className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
              onClick={() => setSequence((current) => [...current, item])}
              type="button"
            >
              <div className="rounded-xl bg-[linear-gradient(180deg,#fbfdfc_0%,#f3f7f4_100%)] p-2">
                <BossChart points={steps[item as keyof typeof steps].points} />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                {steps[item as keyof typeof steps].label}
              </p>
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(2)}
              type="button"
            >
              Lock Step 3
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={sequence.length !== ordered.length}
              onClick={() => {
                if (!correct) {
                  triggerSetback("Not quite — re-lock the broad direction before ranking quality.", 0, "trend-quality");
                  return;
                }
                setSuccessMessage("Correct. Trend quality is about how cleanly the move keeps following through.");
              }}
              type="button"
            >
              {sequence.length === ordered.length ? "Lock order" : "Finish the order first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderNoiseStep() {
    const options: BossOption[] = [
      {
        id: "summary",
        label: "Mostly rising overall, even with the wiggles",
        feedback: "Correct. The noise did not erase the broader trend.",
        reviewPrompt: "",
      },
      {
        id: "noise",
        label: "No trend exists because the line wiggles",
        feedback: "That gives too much power to noise.",
        reviewPrompt: "noise-vs-trend",
      },
      {
        id: "breakout",
        label: "Guaranteed breakout is the only conclusion",
        feedback: "That jumps past the evidence into certainty.",
        reviewPrompt: "noise-vs-trend",
      },
    ];
    const selectedOption = options.find((option) => option.id === selectedId) ?? null;
    const shuffledOptions = stableShuffleMixed(options, "trend-boss-step-3");
    const chartPoints = [22, 36, 28, 44, 38, 56, 50, 70];

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={trendBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 3 · Noise filter</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Keep the broader read even when the chart gets noisy.
        </p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="rounded-xl bg-[linear-gradient(180deg,#fbfdfc_0%,#f3f7f4_100%)] p-3">
            <BossChart points={chartPoints} />
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {shuffledOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(3)}
              type="button"
            >
              Lock Step 4
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "summary") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — re-lock trend quality before you filter the noise.", 1, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderMomentumStep() {
    const options: BossOption[] = [
      {
        id: "faded",
        label: "Momentum faded even though the direction stayed up",
        feedback: "Correct. Pace changed even though the broader direction held.",
        reviewPrompt: "",
      },
      {
        id: "reversed",
        label: "The chart instantly reversed",
        feedback: "That overstates the slowdown.",
        reviewPrompt: "momentum-fading",
      },
      {
        id: "nothing",
        label: "Nothing changed at all",
        feedback: "The pace shift is the clue here.",
        reviewPrompt: "momentum-fading",
      },
    ];
    const selectedOption = options.find((option) => option.id === selectedId) ?? null;
    const shuffledOptions = stableShuffleMixed(options, "trend-boss-step-4");
    const chartPoints = [18, 36, 58, 64, 70];

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={trendBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 4 · Momentum read</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          The chart is still rising. What changed most clearly?
        </p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="rounded-xl bg-[linear-gradient(180deg,#fbfdfc_0%,#f3f7f4_100%)] p-3">
            <BossChart points={chartPoints} />
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {shuffledOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={onAdvanceToCheck}
              type="button"
            >
              Enter final summary
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "faded") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — re-lock the noise read before the momentum read.", 2, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <BossShell>
      {currentStep === 0
        ? renderDirectionStep()
        : currentStep === 1
          ? renderQualityStep()
          : currentStep === 2
            ? renderNoiseStep()
            : renderMomentumStep()}
    </BossShell>
  );
}

export function TrendMomentumBossCheck({
  onComplete,
  onIncorrect,
  onSetbackToPractice,
}: BossCheckProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);
  const shuffledOptions = useMemo(
    () => stableShuffle(trendBossSummaryOptions, "trend-boss-step-5"),
    [],
  );
  const selectedOption =
    trendBossSummaryOptions.find((option) => option.id === selectedId) ?? null;

  return (
    <BossShell badgeTone="violet">
      <BossStepRail activeStep={4} stepLabels={trendBossStepLabels} />
      <h2 className="text-2xl font-semibold text-slate-950">Step 5 · Final summary</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Choose the only takeaway that keeps direction, quality, noise, momentum, and caution in the right places.
      </p>
      <div className="mt-5 space-y-3">
        {shuffledOptions.map((option) => (
          <button
            key={option.id}
            className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
              selectedId === option.id
                ? "selected border-emerald-300 bg-emerald-50"
                : "border-slate-200 bg-white"
            }`}
            onClick={() => setSelectedId(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
      {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
      <div className="mt-6">
        {successMessage ? (
          <button
            className="interactive-cta journey-forward-cta reward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white"
            onClick={onComplete}
            type="button"
          >
            Claim progress
          </button>
        ) : setback ? (
          <button
            className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-800"
            onClick={() => {
              setSetback(null);
              onSetbackToPractice(setback.targetStep);
            }}
            type="button"
          >
            {setback.buttonLabel}
          </button>
        ) : (
          <button
            className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white disabled:opacity-45"
            disabled={!selectedOption}
            onClick={() => {
              if (!selectedOption) return;
              if (selectedOption.id === "correct") {
                setSuccessMessage("Boss cleared. You connected direction, quality, noise, momentum, and caution under pressure.");
                return;
              }
              onIncorrect(selectedOption.reviewPrompt);
              setSetback({
                targetStep: 3,
                buttonLabel: "Back to Step 4",
                message: "Not quite — lock the momentum read back in before the final summary.",
              });
            }}
            type="button"
          >
            {selectedOption ? "Lock final answer" : "Choose an answer first"}
          </button>
        )}
      </div>
    </BossShell>
  );
}

const supportResistanceBossStepLabels = [
  "Support",
  "Resistance",
  "Zones",
  "Reaction",
  "Summary",
];

const supportResistanceStepOneOptions: BossOption[] = [
  {
    id: "support",
    label: "A lower area where price often stops falling and reacts higher",
    feedback: "Correct. That lower reaction area is support.",
    reviewPrompt: "",
  },
  {
    id: "resistance",
    label: "An upper area where price often struggles upward",
    feedback: "That describes resistance, not support.",
    reviewPrompt: "support-basics",
  },
  {
    id: "guarantee",
    label: "A guaranteed floor that can never break",
    feedback: "Support is useful context, not a guarantee.",
    reviewPrompt: "support-basics",
  },
  {
    id: "random",
    label: "Any line drawn near the bottom of the chart",
    feedback: "Support has to come from chart reaction, not from a random line.",
    reviewPrompt: "support-basics",
  },
];

const supportResistanceStepTwoOptions: BossOption[] = [
  {
    id: "resistance",
    label: "An upper area where price often struggles upward and turns lower",
    feedback: "Correct. That upper reaction area is resistance.",
    reviewPrompt: "",
  },
  {
    id: "support",
    label: "A lower area where price often bounces",
    feedback: "That describes support, not resistance.",
    reviewPrompt: "resistance-basics",
  },
  {
    id: "ceiling",
    label: "A permanent ceiling that can never break",
    feedback: "Resistance can matter without becoming permanent.",
    reviewPrompt: "resistance-basics",
  },
  {
    id: "news",
    label: "A news headline on the chart",
    feedback: "Resistance is chart behavior, not a headline label.",
    reviewPrompt: "resistance-basics",
  },
];

const supportResistanceOrder = [
  "Mark the reaction area",
  "Watch how price behaves there",
  "Then decide whether it held or failed",
];

const supportResistanceReactionScenarios = [
  {
    id: "bounce",
    label: "Price reaches a lower zone and lifts away from it",
    target: "Bounce from support",
  },
  {
    id: "reject",
    label: "Price reaches an upper zone and turns lower",
    target: "Resistance rejection",
  },
  {
    id: "fail",
    label: "Price breaks below support and stays there",
    target: "Support failure",
  },
  {
    id: "break",
    label: "Price pushes above resistance and keeps holding there",
    target: "Resistance break",
  },
];

const supportResistanceSummaryOptions: BossOption[] = [
  {
    id: "correct",
    label:
      "Support and resistance are reaction areas, stronger zones earn more respect, reactions decide whether a level held or broke, and none of it is guaranteed.",
    feedback: "That is the clean support-and-resistance summary.",
    reviewPrompt: "",
  },
  {
    id: "guarantee",
    label: "Support and resistance guarantee the next move if you draw the line carefully.",
    feedback: "The whole module is supposed to remove that certainty.",
    reviewPrompt: "areas-not-certainty",
  },
  {
    id: "exact",
    label: "One exact line matters more than the wider reaction area.",
    feedback: "That turns zones into fake precision.",
    reviewPrompt: "zones-not-lines",
  },
  {
    id: "ignore-reaction",
    label: "The touch matters, but the reaction after it does not.",
    feedback: "The reaction is exactly what tells you whether the level held or failed.",
    reviewPrompt: "support-bounce",
  },
];

export function SupportResistanceBossPractice({
  currentStep,
  onAdvanceToCheck,
  onIncorrect,
  onStepChange,
}: BossPracticeProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sequence, setSequence] = useState<string[]>([]);
  const [classified, setClassified] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);

  const shuffledSupportOptions = useMemo(
    () => stableShuffleMixed(supportResistanceStepOneOptions, "support-resistance-boss-step-1"),
    [],
  );
  const shuffledResistanceOptions = useMemo(
    () => stableShuffleMixed(supportResistanceStepTwoOptions, "support-resistance-boss-step-2"),
    [],
  );

  useEffect(() => {
    setSelectedId(null);
    setSequence([]);
    setClassified({});
    setSuccessMessage(null);
    setSetback(null);
  }, [currentStep]);

  const remainingReactionScenario =
    supportResistanceReactionScenarios.find((scenario) => !classified[scenario.id]) ?? null;

  function triggerSetback(message: string, targetStep: number, reviewPrompt: string) {
    if (reviewPrompt) {
      onIncorrect(reviewPrompt);
    }

    setSetback({
      targetStep,
      message,
      buttonLabel: targetStep === currentStep ? "Retry this step" : `Back to Step ${targetStep + 1}`,
    });
  }

  function renderSupportStep() {
    const selectedOption =
      supportResistanceStepOneOptions.find((option) => option.id === selectedId) ?? null;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={supportResistanceBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 1 · Support</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          A lower area keeps stopping the drop and sending price higher. What is that area?
        </p>
        <div className="mt-5 space-y-3">
          {shuffledSupportOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(1)}
              type="button"
            >
              Lock Step 2
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "support") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — lock the lower reaction area in first.", 0, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderResistanceStep() {
    const selectedOption =
      supportResistanceStepTwoOptions.find((option) => option.id === selectedId) ?? null;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={supportResistanceBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 2 · Resistance</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          An upper area keeps slowing the rise and sending price lower. What is that area?
        </p>
        <div className="mt-5 space-y-3">
          {shuffledResistanceOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(2)}
              type="button"
            >
              Lock Step 3
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "resistance") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — the upper reaction area needs to lock in first.", 0, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderZonesStep() {
    const remaining = stableShuffleMixed(
      supportResistanceOrder.filter((item) => !sequence.includes(item)),
      `support-resistance-boss-step-3-${sequence.length}`,
    );
    const correct =
      sequence.length === supportResistanceOrder.length &&
      sequence.every((item, index) => item === supportResistanceOrder[index]);

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={supportResistanceBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 3 · Zone discipline</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Build the careful order for reading a support or resistance area.
        </p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Ordered sequence
            </p>
            {sequence.length > 0 ? (
              <button
                className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
                onClick={() => setSequence((current) => current.slice(0, -1))}
                type="button"
              >
                Undo
              </button>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {supportResistanceOrder.map((_, index) => (
              <div
                key={index}
                className={`rounded-full px-3 py-2 text-sm ${
                  sequence[index] ? "bg-emerald-50 text-emerald-800" : "bg-white text-slate-400"
                }`}
              >
                {sequence[index] ?? `Step ${index + 1}`}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {remaining.map((item) => (
            <button
              key={item}
              className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
              onClick={() => setSequence((current) => [...current, item])}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(3)}
              type="button"
            >
              Lock Step 4
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={sequence.length !== supportResistanceOrder.length}
              onClick={() => {
                if (!correct) {
                  triggerSetback("Not quite — re-lock the careful zone order first.", 1, "zones-not-lines");
                  return;
                }
                setSuccessMessage("Correct. Mark the area first, then read the reaction, then decide whether it held or failed.");
              }}
              type="button"
            >
              {sequence.length === supportResistanceOrder.length ? "Lock order" : "Finish the order first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderReactionStep() {
    const complete = Object.keys(classified).length === supportResistanceReactionScenarios.length;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={supportResistanceBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 4 · Reaction type</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Classify each scenario without mixing bounce, rejection, failure, and break.
        </p>
        {remainingReactionScenario ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_26px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-semibold text-slate-900">
                #{supportResistanceReactionScenarios.findIndex((scenario) => scenario.id === remainingReactionScenario.id) + 1} · {remainingReactionScenario.label}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                "Bounce from support",
                "Resistance rejection",
                "Support failure",
                "Resistance break",
              ].map((bucket) => (
                <button
                  key={bucket}
                  className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
                  onClick={() => {
                    if (bucket !== remainingReactionScenario.target) {
                      triggerSetback("Not quite — re-lock the zone-reading discipline before moving on.", 2, "support-resistance-boss");
                      return;
                    }
                    setClassified((current) => ({
                      ...current,
                      [remainingReactionScenario.id]: bucket,
                    }));
                  }}
                  type="button"
                >
                  {bucket}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {supportResistanceReactionScenarios.map((scenario, index) => {
            const result = classified[scenario.id];

            return (
              <div
                key={scenario.id}
                className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3"
              >
                <p className="text-sm text-slate-700">
                  #{index + 1} · {scenario.label}
                </p>
                {result ? (
                  <div className="mt-2">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      {result}
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={onAdvanceToCheck}
              type="button"
            >
              Enter final summary
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!complete}
              onClick={() =>
                setSuccessMessage(
                  "Correct. You separated support bounce, resistance rejection, support failure, and resistance break under pressure.",
                )
              }
              type="button"
            >
              {complete ? "Lock Step 5" : "Classify every scenario first"}
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <BossShell>
      {currentStep === 0
        ? renderSupportStep()
        : currentStep === 1
          ? renderResistanceStep()
          : currentStep === 2
            ? renderZonesStep()
            : renderReactionStep()}
    </BossShell>
  );
}

export function SupportResistanceBossCheck({
  onComplete,
  onIncorrect,
  onSetbackToPractice,
}: BossCheckProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);
  const shuffledOptions = useMemo(
    () => stableShuffleMixed(supportResistanceSummaryOptions, "support-resistance-boss-step-5"),
    [],
  );
  const selectedOption =
    supportResistanceSummaryOptions.find((option) => option.id === selectedId) ?? null;

  return (
    <BossShell badgeTone="violet">
      <BossStepRail activeStep={4} stepLabels={supportResistanceBossStepLabels} />
      <h2 className="text-2xl font-semibold text-slate-950">Step 5 · Final summary</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Choose the only summary that keeps areas, reactions, breaks, and caution in the right roles.
      </p>
      <div className="mt-5 space-y-3">
        {shuffledOptions.map((option) => (
          <button
            key={option.id}
            className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
              selectedId === option.id
                ? "selected border-emerald-300 bg-emerald-50"
                : "border-slate-200 bg-white"
            }`}
            onClick={() => setSelectedId(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
      {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
      <div className="mt-6">
        {successMessage ? (
          <button
            className="interactive-cta journey-forward-cta reward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white"
            onClick={onComplete}
            type="button"
          >
            Claim progress
          </button>
        ) : setback ? (
          <button
            className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-800"
            onClick={() => {
              setSetback(null);
              onSetbackToPractice(setback.targetStep);
            }}
            type="button"
          >
            {setback.buttonLabel}
          </button>
        ) : (
          <button
            className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white disabled:opacity-45"
            disabled={!selectedOption}
            onClick={() => {
              if (!selectedOption) return;
              if (selectedOption.id === "correct") {
                setSuccessMessage("Boss cleared. You mapped support, resistance, zones, and reactions under pressure.");
                return;
              }
              onIncorrect(selectedOption.reviewPrompt);
              setSetback({
                targetStep: 3,
                buttonLabel: "Back to Step 4",
                message: "Not quite — lock the reaction map back in before the final summary.",
              });
            }}
            type="button"
          >
            {selectedOption ? "Lock final answer" : "Choose an answer first"}
          </button>
        )}
      </div>
    </BossShell>
  );
}

const breakoutBossStepLabels = ["Breakout", "Volume", "Hold", "Context", "Summary"];

const breakoutBossStepOneOptions: BossOption[] = [
  {
    id: "breakout",
    label: "Price moves through a watched level",
    feedback: "Correct. That move through the level is the breakout event.",
    reviewPrompt: "",
  },
  {
    id: "below",
    label: "Price stays trapped under the same level",
    feedback: "That is the opposite of a breakout.",
    reviewPrompt: "breakout-basics",
  },
  {
    id: "guarantee",
    label: "The stock is guaranteed to keep rising",
    feedback: "A breakout is an event, not a guarantee.",
    reviewPrompt: "breakout-basics",
  },
  {
    id: "revenue",
    label: "The company reported higher revenue",
    feedback: "That may matter, but it is not the breakout itself.",
    reviewPrompt: "breakout-basics",
  },
];

const breakoutBossStepTwoOptions: BossOption[] = [
  {
    id: "participation",
    label: "More trading activity joined the move",
    feedback: "Correct. A volume spike mainly tells you participation increased.",
    reviewPrompt: "",
  },
  {
    id: "guarantee",
    label: "The breakout must succeed now",
    feedback: "Volume helps with context. It never guarantees the outcome.",
    reviewPrompt: "volume-basics",
  },
  {
    id: "bullish-only",
    label: "High volume is always bullish",
    feedback: "High volume can show up on selloffs too.",
    reviewPrompt: "volume-context",
  },
  {
    id: "nothing",
    label: "Volume means nothing useful at all",
    feedback: "Volume still matters as a participation clue.",
    reviewPrompt: "volume-basics",
  },
];

const breakoutBossOrder = [
  "The level mattered first",
  "Price broke through it",
  "Then the move had to hold",
];

const breakoutBossScenarios = [
  {
    id: "strong",
    label: "Break above the level, loud volume, and the move keeps holding",
    target: "Strong breakout",
  },
  {
    id: "quiet",
    label: "Break above the level, but the volume stays quiet",
    target: "Quiet breakout",
  },
  {
    id: "fake",
    label: "Break above the level, then fall back below it",
    target: "Fake breakout",
  },
  {
    id: "selloff",
    label: "Sharp drop with very high volume",
    target: "High-volume selloff",
  },
];

const breakoutBossSummaryOptions: BossOption[] = [
  {
    id: "correct",
    label:
      "A breakout is the move through a watched level, volume shows participation, hold versus fail matters, context ranks setup quality, and none of it guarantees success.",
    feedback: "That is the clean breakout-and-volume summary.",
    reviewPrompt: "",
  },
  {
    id: "guarantee",
    label: "Any breakout with volume guarantees the next move.",
    feedback: "That drops the caution the whole module is building.",
    reviewPrompt: "breakout-volume-boss",
  },
  {
    id: "volume-only",
    label: "Volume alone tells you whether the setup is bullish.",
    feedback: "Volume tells you participation. Direction still needs price context.",
    reviewPrompt: "volume-context",
  },
  {
    id: "fake-none",
    label: "Once price breaks a level, hold versus fail no longer matters.",
    feedback: "Hold versus fail is exactly what separates the cleaner move from the fake one.",
    reviewPrompt: "fake-breakout",
  },
];

export function BreakoutVolumeBossPractice({
  currentStep,
  onAdvanceToCheck,
  onIncorrect,
  onStepChange,
}: BossPracticeProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sequence, setSequence] = useState<string[]>([]);
  const [classified, setClassified] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);

  const shuffledBreakoutOptions = useMemo(
    () => stableShuffleMixed(breakoutBossStepOneOptions, "breakout-volume-boss-step-1"),
    [],
  );
  const shuffledVolumeOptions = useMemo(
    () => stableShuffleMixed(breakoutBossStepTwoOptions, "breakout-volume-boss-step-2"),
    [],
  );

  useEffect(() => {
    setSelectedId(null);
    setSequence([]);
    setClassified({});
    setSuccessMessage(null);
    setSetback(null);
  }, [currentStep]);

  const remainingScenario = breakoutBossScenarios.find((scenario) => !classified[scenario.id]) ?? null;

  function triggerSetback(message: string, targetStep: number, reviewPrompt: string) {
    if (reviewPrompt) {
      onIncorrect(reviewPrompt);
    }

    setSetback({
      targetStep,
      message,
      buttonLabel: targetStep === currentStep ? "Retry this step" : `Back to Step ${targetStep + 1}`,
    });
  }

  function renderBreakoutStep() {
    const selectedOption =
      breakoutBossStepOneOptions.find((option) => option.id === selectedId) ?? null;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={breakoutBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 1 · Breakout event</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          What is the breakout itself before you judge quality?
        </p>
        <div className="mt-5 space-y-3">
          {shuffledBreakoutOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(1)}
              type="button"
            >
              Lock Step 2
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "breakout") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — lock the breakout event in first.", 0, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderVolumeStep() {
    const selectedOption =
      breakoutBossStepTwoOptions.find((option) => option.id === selectedId) ?? null;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={breakoutBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 2 · Volume clue</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          A breakout prints a loud volume spike. What does that add first?
        </p>
        <div className="mt-5 space-y-3">
          {shuffledVolumeOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(2)}
              type="button"
            >
              Lock Step 3
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "participation") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — lock the volume clue in before moving on.", 0, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderHoldStep() {
    const remaining = stableShuffleMixed(
      breakoutBossOrder.filter((item) => !sequence.includes(item)),
      `breakout-volume-boss-step-3-${sequence.length}`,
    );
    const correct =
      sequence.length === breakoutBossOrder.length &&
      sequence.every((item, index) => item === breakoutBossOrder[index]);

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={breakoutBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 3 · Hold versus fail</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Build the clean order for judging whether the breakout really held.
        </p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Ordered sequence
            </p>
            {sequence.length > 0 ? (
              <button
                className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
                onClick={() => setSequence((current) => current.slice(0, -1))}
                type="button"
              >
                Undo
              </button>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {breakoutBossOrder.map((_, index) => (
              <div
                key={index}
                className={`rounded-full px-3 py-2 text-sm ${
                  sequence[index] ? "bg-emerald-50 text-emerald-800" : "bg-white text-slate-400"
                }`}
              >
                {sequence[index] ?? `Step ${index + 1}`}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {remaining.map((item) => (
            <button
              key={item}
              className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
              onClick={() => setSequence((current) => [...current, item])}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(3)}
              type="button"
            >
              Lock Step 4
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={sequence.length !== breakoutBossOrder.length}
              onClick={() => {
                if (!correct) {
                  triggerSetback("Not quite — re-lock the hold-versus-fail order first.", 1, "fake-breakout");
                  return;
                }
                setSuccessMessage("Correct. The level mattered first, then the break happened, then the hold decided whether the move was real.");
              }}
              type="button"
            >
              {sequence.length === breakoutBossOrder.length ? "Lock order" : "Finish the order first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderContextStep() {
    const complete = Object.keys(classified).length === breakoutBossScenarios.length;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={breakoutBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 4 · Context rank</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Classify each scenario without mixing strong breaks, quiet breaks, fakeouts, and selloffs.
        </p>
        {remainingScenario ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_26px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-semibold text-slate-900">
                #{breakoutBossScenarios.findIndex((scenario) => scenario.id === remainingScenario.id) + 1} · {remainingScenario.label}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                "Strong breakout",
                "Quiet breakout",
                "Fake breakout",
                "High-volume selloff",
              ].map((bucket) => (
                <button
                  key={bucket}
                  className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
                  onClick={() => {
                    if (bucket !== remainingScenario.target) {
                      triggerSetback("Not quite — re-lock the hold logic before the context read.", 2, "breakout-volume-boss");
                      return;
                    }
                    setClassified((current) => ({
                      ...current,
                      [remainingScenario.id]: bucket,
                    }));
                  }}
                  type="button"
                >
                  {bucket}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {breakoutBossScenarios.map((scenario, index) => {
            const result = classified[scenario.id];

            return (
              <div
                key={scenario.id}
                className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3"
              >
                <p className="text-sm text-slate-700">
                  #{index + 1} · {scenario.label}
                </p>
                {result ? (
                  <div className="mt-2">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      {result}
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={onAdvanceToCheck}
              type="button"
            >
              Enter final summary
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!complete}
              onClick={() =>
                setSuccessMessage(
                  "Correct. You separated strong breaks, quiet breaks, fakeouts, and loud selloffs without guessing from one clue.",
                )
              }
              type="button"
            >
              {complete ? "Lock Step 5" : "Classify every scenario first"}
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <BossShell>
      {currentStep === 0
        ? renderBreakoutStep()
        : currentStep === 1
          ? renderVolumeStep()
          : currentStep === 2
            ? renderHoldStep()
            : renderContextStep()}
    </BossShell>
  );
}

export function BreakoutVolumeBossCheck({
  onComplete,
  onIncorrect,
  onSetbackToPractice,
}: BossCheckProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);
  const shuffledOptions = useMemo(
    () => stableShuffleMixed(breakoutBossSummaryOptions, "breakout-volume-boss-step-5"),
    [],
  );
  const selectedOption =
    breakoutBossSummaryOptions.find((option) => option.id === selectedId) ?? null;

  return (
    <BossShell badgeTone="violet">
      <BossStepRail activeStep={4} stepLabels={breakoutBossStepLabels} />
      <h2 className="text-2xl font-semibold text-slate-950">Step 5 · Final summary</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Choose the only summary that keeps breakout event, volume, hold, context, and caution in the right places.
      </p>
      <div className="mt-5 space-y-3">
        {shuffledOptions.map((option) => (
          <button
            key={option.id}
            className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
              selectedId === option.id
                ? "selected border-emerald-300 bg-emerald-50"
                : "border-slate-200 bg-white"
            }`}
            onClick={() => setSelectedId(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
      {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
      <div className="mt-6">
        {successMessage ? (
          <button
            className="interactive-cta journey-forward-cta reward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white"
            onClick={onComplete}
            type="button"
          >
            Claim progress
          </button>
        ) : setback ? (
          <button
            className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-800"
            onClick={() => {
              setSetback(null);
              onSetbackToPractice(setback.targetStep);
            }}
            type="button"
          >
            {setback.buttonLabel}
          </button>
        ) : (
          <button
            className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white disabled:opacity-45"
            disabled={!selectedOption}
            onClick={() => {
              if (!selectedOption) return;
              if (selectedOption.id === "correct") {
                setSuccessMessage("Boss cleared. You connected breakout event, volume, hold, and context under pressure.");
                return;
              }
              onIncorrect(selectedOption.reviewPrompt);
              setSetback({
                targetStep: 3,
                buttonLabel: "Back to Step 4",
                message: "Not quite — lock the context read back in before the final summary.",
              });
            }}
            type="button"
          >
            {selectedOption ? "Lock final answer" : "Choose an answer first"}
          </button>
        )}
      </div>
    </BossShell>
  );
}

const businessBossStepLabels = ["Lens", "Revenue", "Quality", "Timing", "Summary"];

const businessBossStepOneOptions: BossOption[] = [
  {
    id: "fundamental",
    label: "Business fundamentals",
    feedback: "Correct. Revenue growth belongs to the business lens.",
    reviewPrompt: "",
  },
  {
    id: "technical",
    label: "Chart behavior only",
    feedback: "Revenue growth describes the business, not a chart pattern.",
    reviewPrompt: "technical-vs-fundamental",
  },
  {
    id: "news",
    label: "News headlines only",
    feedback: "News can matter, but revenue growth is still a business metric first.",
    reviewPrompt: "technical-vs-fundamental",
  },
  {
    id: "guarantee",
    label: "A guarantee about the stock",
    feedback: "Revenue growth is a business clue, not a guarantee.",
    reviewPrompt: "technical-vs-fundamental",
  },
];

const businessValueScenarios = [
  { id: "revenue", label: "Money coming in from sales", target: "Revenue" },
  { id: "cost", label: "Money spent to run the business", target: "Cost" },
  { id: "profit", label: "Money left after costs", target: "Profit" },
];

const businessBossStepThreeOptions: BossOption[] = [
  {
    id: "fastgrow",
    label: "FastGrow grew faster but kept less profit from sales",
    feedback: "Correct. FastGrow is the faster grower with weaker profitability here.",
    reviewPrompt: "",
  },
  {
    id: "steadycore",
    label: "SteadyCore grew faster but kept less profit from sales",
    feedback: "SteadyCore is the stronger quality read here, not the faster growth read.",
    reviewPrompt: "growth-vs-quality",
  },
  {
    id: "both",
    label: "Both companies mean the same thing",
    feedback: "The whole point is that growth and quality can point to different companies.",
    reviewPrompt: "growth-vs-quality",
  },
  {
    id: "neither",
    label: "Neither company gives you any useful clue",
    feedback: "The comparison is there to force a real business read.",
    reviewPrompt: "growth-vs-quality",
  },
];

const businessBossOrder = [
  "Expectations shift",
  "Price reacts",
  "Business proof can arrive later",
];

const businessBossSummaryOptions: BossOption[] = [
  {
    id: "correct",
    label:
      "Fundamentals describe the business, revenue is sales in, profit and margin show what survives, growth and quality can differ, price can move before full proof arrives, and a good snapshot stays compact.",
    feedback: "That is the clean business-fundamentals summary.",
    reviewPrompt: "",
  },
  {
    id: "one-metric",
    label: "One metric usually tells the whole business story by itself.",
    feedback: "This module is about resisting one-metric thinking.",
    reviewPrompt: "business-fundamentals-boss",
  },
  {
    id: "revenue-profit",
    label: "Revenue and profit are basically the same thing, so margin does not matter much.",
    feedback: "That collapses sales, leftover profit, and efficiency into the same idea.",
    reviewPrompt: "profit-basics",
  },
  {
    id: "wait-report",
    label: "Price should not move until every business report is final.",
    feedback: "Markets often react faster than the report cycle.",
    reviewPrompt: "price-vs-business-timing",
  },
];

export function BusinessFundamentalsBossPractice({
  currentStep,
  onAdvanceToCheck,
  onIncorrect,
  onStepChange,
}: BossPracticeProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sequence, setSequence] = useState<string[]>([]);
  const [classified, setClassified] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);

  const shuffledLensOptions = useMemo(
    () => stableShuffleMixed(businessBossStepOneOptions, "business-fundamentals-boss-step-1"),
    [],
  );
  const shuffledQualityOptions = useMemo(
    () => stableShuffleMixed(businessBossStepThreeOptions, "business-fundamentals-boss-step-3"),
    [],
  );

  useEffect(() => {
    setSelectedId(null);
    setSequence([]);
    setClassified({});
    setSuccessMessage(null);
    setSetback(null);
  }, [currentStep]);

  const remainingValueScenario = businessValueScenarios.find((scenario) => !classified[scenario.id]) ?? null;

  function triggerSetback(message: string, targetStep: number, reviewPrompt: string) {
    if (reviewPrompt) {
      onIncorrect(reviewPrompt);
    }

    setSetback({
      targetStep,
      message,
      buttonLabel: targetStep === currentStep ? "Retry this step" : `Back to Step ${targetStep + 1}`,
    });
  }

  function renderLensStep() {
    const selectedOption =
      businessBossStepOneOptions.find((option) => option.id === selectedId) ?? null;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={businessBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 1 · Lens</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Revenue growth belongs to which lens first?
        </p>
        <div className="mt-5 space-y-3">
          {shuffledLensOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(1)}
              type="button"
            >
              Lock Step 2
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "fundamental") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — lock the business lens in first.", 0, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderRevenueStep() {
    const complete = Object.keys(classified).length === businessValueScenarios.length;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={businessBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 2 · Revenue, cost, profit</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Classify the business clues without mixing money in, money out, and money left.
        </p>
        {remainingValueScenario ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_26px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-semibold text-slate-900">
                #{businessValueScenarios.findIndex((scenario) => scenario.id === remainingValueScenario.id) + 1} · {remainingValueScenario.label}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {["Revenue", "Cost", "Profit"].map((bucket) => (
                <button
                  key={bucket}
                  className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
                  onClick={() => {
                    if (bucket !== remainingValueScenario.target) {
                      triggerSetback("Not quite — re-lock the lens before the business values.", 0, "profit-basics");
                      return;
                    }
                    setClassified((current) => ({
                      ...current,
                      [remainingValueScenario.id]: bucket,
                    }));
                  }}
                  type="button"
                >
                  {bucket}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {businessValueScenarios.map((scenario, index) => {
            const result = classified[scenario.id];

            return (
              <div
                key={scenario.id}
                className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3"
              >
                <p className="text-sm text-slate-700">
                  #{index + 1} · {scenario.label}
                </p>
                {result ? (
                  <div className="mt-2">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      {result}
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(2)}
              type="button"
            >
              Lock Step 3
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!complete}
              onClick={() =>
                setSuccessMessage(
                  "Correct. You separated sales in, costs out, and the leftover profit cleanly.",
                )
              }
              type="button"
            >
              {complete ? "Lock Step 3" : "Classify every clue first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderQualityStep() {
    const selectedOption =
      businessBossStepThreeOptions.find((option) => option.id === selectedId) ?? null;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={businessBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 3 · Growth versus quality</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          FastGrow shows 30% revenue growth and 7% margin. SteadyCore shows 12% growth and 24% margin. Which statement is strongest?
        </p>
        <div className="mt-5 space-y-3">
          {shuffledQualityOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(3)}
              type="button"
            >
              Lock Step 4
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "fastgrow") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — re-lock revenue, cost, and profit first.", 1, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderTimingStep() {
    const remaining = stableShuffleMixed(
      businessBossOrder.filter((item) => !sequence.includes(item)),
      `business-fundamentals-boss-step-4-${sequence.length}`,
    );
    const correct =
      sequence.length === businessBossOrder.length &&
      sequence.every((item, index) => item === businessBossOrder[index]);

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={businessBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 4 · Timing</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Build the clean order from expectation shift to slower business proof.
        </p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Ordered sequence
            </p>
            {sequence.length > 0 ? (
              <button
                className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
                onClick={() => setSequence((current) => current.slice(0, -1))}
                type="button"
              >
                Undo
              </button>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {businessBossOrder.map((_, index) => (
              <div
                key={index}
                className={`rounded-full px-3 py-2 text-sm ${
                  sequence[index] ? "bg-emerald-50 text-emerald-800" : "bg-white text-slate-400"
                }`}
              >
                {sequence[index] ?? `Step ${index + 1}`}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {remaining.map((item) => (
            <button
              key={item}
              className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
              onClick={() => setSequence((current) => [...current, item])}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={onAdvanceToCheck}
              type="button"
            >
              Enter final summary
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={sequence.length !== businessBossOrder.length}
              onClick={() => {
                if (!correct) {
                  triggerSetback("Not quite — re-lock the growth-versus-quality read before the timing sequence.", 2, "price-vs-business-timing");
                  return;
                }
                setSuccessMessage("Correct. Expectations can shift first, price can react next, and slower business proof can arrive later.");
              }}
              type="button"
            >
              {sequence.length === businessBossOrder.length ? "Lock order" : "Finish the order first"}
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <BossShell>
      {currentStep === 0
        ? renderLensStep()
        : currentStep === 1
          ? renderRevenueStep()
          : currentStep === 2
            ? renderQualityStep()
            : renderTimingStep()}
    </BossShell>
  );
}

export function BusinessFundamentalsBossCheck({
  onComplete,
  onIncorrect,
  onSetbackToPractice,
}: BossCheckProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);
  const shuffledOptions = useMemo(
    () => stableShuffleMixed(businessBossSummaryOptions, "business-fundamentals-boss-step-5"),
    [],
  );
  const selectedOption =
    businessBossSummaryOptions.find((option) => option.id === selectedId) ?? null;

  return (
    <BossShell badgeTone="violet">
      <BossStepRail activeStep={4} stepLabels={businessBossStepLabels} />
      <h2 className="text-2xl font-semibold text-slate-950">Step 5 · Final summary</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Choose the only summary that keeps lens, sales, quality, timing, and snapshot logic in the right roles.
      </p>
      <div className="mt-5 space-y-3">
        {shuffledOptions.map((option) => (
          <button
            key={option.id}
            className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
              selectedId === option.id
                ? "selected border-emerald-300 bg-emerald-50"
                : "border-slate-200 bg-white"
            }`}
            onClick={() => setSelectedId(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
      {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
      <div className="mt-6">
        {successMessage ? (
          <button
            className="interactive-cta journey-forward-cta reward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white"
            onClick={onComplete}
            type="button"
          >
            Claim progress
          </button>
        ) : setback ? (
          <button
            className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-800"
            onClick={() => {
              setSetback(null);
              onSetbackToPractice(setback.targetStep);
            }}
            type="button"
          >
            {setback.buttonLabel}
          </button>
        ) : (
          <button
            className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white disabled:opacity-45"
            disabled={!selectedOption}
            onClick={() => {
              if (!selectedOption) return;
              if (selectedOption.id === "correct") {
                setSuccessMessage("Boss cleared. You separated business lens, revenue, quality, timing, and snapshot logic under pressure.");
                return;
              }
              onIncorrect(selectedOption.reviewPrompt);
              setSetback({
                targetStep: 3,
                buttonLabel: "Back to Step 4",
                message: "Not quite — lock the timing logic back in before the final summary.",
              });
            }}
            type="button"
          >
            {selectedOption ? "Lock final answer" : "Choose an answer first"}
          </button>
        )}
      </div>
    </BossShell>
  );
}

const marketCapRevenueBossStepLabels = ["Cap", "Price", "Revenue", "Compare", "Summary"];

const marketCapRevenueBossDefinitionOptions: BossOption[] = [
  {
    id: "correct",
    label: "Market cap is the total market value of all shares together.",
    feedback: "Correct. Market cap is the whole-company market value.",
    reviewPrompt: "",
  },
  {
    id: "price-only",
    label: "Market cap is only the price of one share.",
    feedback: "That confuses one-share price with the whole-company size.",
    reviewPrompt: "market-cap-basics",
  },
  {
    id: "quality",
    label: "Market cap guarantees company quality.",
    feedback: "Market cap is a size metric, not a quality guarantee.",
    reviewPrompt: "market-cap-basics",
  },
  {
    id: "revenue",
    label: "Market cap is the same thing as revenue growth.",
    feedback: "That mixes company size with business sales growth.",
    reviewPrompt: "size-vs-growth",
  },
];

const marketCapRevenueBossSummaryOptions: BossOption[] = [
  {
    id: "correct",
    label:
      "Market cap is total company size, share price alone can mislead, revenue growth tracks sales speed, and size and growth should stay in separate lanes.",
    feedback: "That is the clean Module 7 synthesis.",
    reviewPrompt: "",
  },
  {
    id: "price-rule",
    label: "The higher stock price usually tells you which company is bigger.",
    feedback: "That repeats the sticker-price trap.",
    reviewPrompt: "share-price-misleading",
  },
  {
    id: "growth-rule",
    label: "The faster grower is automatically the better company.",
    feedback: "That turns one clue into a full verdict.",
    reviewPrompt: "growth-not-automatically-better",
  },
  {
    id: "same-question",
    label: "Market cap and revenue growth answer the same question.",
    feedback: "Module 7 is built around keeping those two questions separate.",
    reviewPrompt: "size-vs-growth",
  },
];

export function MarketCapRevenueBossPractice({
  currentStep,
  onAdvanceToCheck,
  onIncorrect,
  onStepChange,
}: BossPracticeProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sequence, setSequence] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);

  const shuffledDefinitionOptions = useMemo(
    () => stableShuffleMixed(marketCapRevenueBossDefinitionOptions, "market-cap-revenue-boss-step-1"),
    [],
  );

  useEffect(() => {
    setSelectedId(null);
    setSequence([]);
    setAssignments({});
    setSuccessMessage(null);
    setSetback(null);
  }, [currentStep]);

  function triggerSetback(message: string, targetStep: number, reviewPrompt: string) {
    if (reviewPrompt) {
      onIncorrect(reviewPrompt);
    }

    setSetback({
      targetStep,
      message,
      buttonLabel: targetStep === currentStep ? "Retry this step" : `Back to Step ${targetStep + 1}`,
    });
  }

  function renderCapStep() {
    const selectedOption =
      marketCapRevenueBossDefinitionOptions.find((option) => option.id === selectedId) ?? null;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={marketCapRevenueBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 1 · Cap foundation</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Start with the cleanest definition before the comparisons begin.
        </p>
        <div className="mt-5 space-y-3">
          {shuffledDefinitionOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(1)}
              type="button"
            >
              Lock Step 2
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "correct") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — lock the size definition in first.", 0, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderPriceTrapStep() {
    const ordered = ["price", "shares", "cap"];
    const labels: Record<string, string> = {
      price: "Read the share price",
      shares: "Add the share count",
      cap: "Then compare market cap",
    };
    const remaining = stableShuffleMixed(
      ordered.filter((item) => !sequence.includes(item)),
      `market-cap-revenue-boss-step-2-${sequence.length}`,
    );
    const correct =
      sequence.length === ordered.length &&
      sequence.every((item, index) => item === ordered[index]);

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={marketCapRevenueBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 2 · Price trap</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Build the clean order for comparing company size without getting fooled by sticker price.
        </p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Ordered sequence
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {ordered.map((_, index) => (
              <div
                key={index}
                className={`rounded-full px-3 py-2 text-sm ${
                  sequence[index] ? "bg-emerald-50 text-emerald-800" : "bg-white text-slate-400"
                }`}
              >
                {sequence[index] ? labels[sequence[index]] : `Step ${index + 1}`}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {remaining.map((item) => (
            <button
              key={item}
              className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
              onClick={() => setSequence((current) => [...current, item])}
              type="button"
            >
              <p className="text-sm font-semibold text-slate-900">{labels[item]}</p>
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(2)}
              type="button"
            >
              Lock Step 3
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={sequence.length !== ordered.length}
              onClick={() => {
                if (!correct) {
                  triggerSetback("Not quite — re-lock the size definition first.", 0, "share-price-misleading");
                  return;
                }
                setSuccessMessage("Correct. Price alone comes first, but the share count and market cap finish the size read.");
              }}
              type="button"
            >
              {sequence.length === ordered.length ? "Lock order" : "Finish the order first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderRevenueStep() {
    const options: BossOption[] = [
      {
        id: "nova",
        label: "Nova is growing faster",
        feedback: "Correct. Nova’s revenue path is climbing faster.",
        reviewPrompt: "",
      },
      {
        id: "anchor",
        label: "Anchor is growing faster",
        feedback: "Anchor is steadier here, but Nova has the faster sales climb.",
        reviewPrompt: "revenue-growth",
      },
      {
        id: "same",
        label: "They are growing at the same speed",
        feedback: "The revenue paths are different on purpose.",
        reviewPrompt: "revenue-growth",
      },
    ];
    const selectedOption = options.find((option) => option.id === selectedId) ?? null;
    const shuffledOptions = stableShuffleMixed(options, "market-cap-revenue-boss-step-3");

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={marketCapRevenueBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 3 · Revenue lens</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Read the business-growth clue without mixing it up with size.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Nova</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Revenue: 18 → 28 → 42 → 60</p>
            <p className="mt-2 text-sm text-slate-600">The sales jumps keep getting larger.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Anchor</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Revenue: 42 → 45 → 47 → 49</p>
            <p className="mt-2 text-sm text-slate-600">Sales are rising, but much more slowly.</p>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {shuffledOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(3)}
              type="button"
            >
              Lock Step 4
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "nova") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — re-lock the size order before the growth read.", 1, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderCompareStep() {
    const cards = [
      { id: "cap", label: "Market cap is $90B", target: "Size clue", reviewPrompt: "size-vs-growth" },
      { id: "growth", label: "Revenue growth is 28%", target: "Growth clue", reviewPrompt: "size-vs-growth" },
      { id: "price", label: "Share price is $120", target: "Trap", reviewPrompt: "share-price-misleading" },
      { id: "cheap", label: "Low share price means the company is small", target: "Trap", reviewPrompt: "share-price-misleading" },
    ];
    const buckets = ["Size clue", "Growth clue", "Trap"];
    const currentCard = cards.find((card) => !assignments[card.id]) ?? null;
    const complete = cards.every((card) => assignments[card.id]);

    function assign(bucket: string) {
      if (!currentCard) {
        return;
      }

      if (bucket !== currentCard.target) {
        triggerSetback("Not quite — re-lock the revenue read before the mixed comparison.", 2, currentCard.reviewPrompt);
        return;
      }

      const nextAssignments = { ...assignments, [currentCard.id]: bucket };
      setAssignments(nextAssignments);

      if (cards.every((card) => nextAssignments[card.id])) {
        setSuccessMessage("Correct. You kept size clues, growth clues, and price traps in their proper roles.");
      }
    }

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={marketCapRevenueBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 4 · Mixed comparison</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Classify the next clue without mixing up size, growth, and sticker-price traps.
        </p>
        {currentCard ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.05)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Current clue</p>
            <p className="mt-3 text-lg font-semibold text-slate-950">{currentCard.label}</p>
          </div>
        ) : null}
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {buckets.map((bucket) => (
            <button
              key={bucket}
              className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
              onClick={() => assign(bucket)}
              type="button"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Place in</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{bucket}</p>
            </button>
          ))}
        </div>
        {complete ? (
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {buckets.map((bucket) => (
              <div key={bucket} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">{bucket}</p>
                <div className="mt-3 space-y-2">
                  {cards
                    .filter((card) => assignments[card.id] === bucket)
                    .map((card) => (
                      <div key={card.id} className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                        {card.label}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={onAdvanceToCheck}
              type="button"
            >
              Enter final summary
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled
              type="button"
            >
              Classify every clue first
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <BossShell>
      {currentStep === 0
        ? renderCapStep()
        : currentStep === 1
          ? renderPriceTrapStep()
          : currentStep === 2
            ? renderRevenueStep()
            : renderCompareStep()}
    </BossShell>
  );
}

export function MarketCapRevenueBossCheck({
  onComplete,
  onIncorrect,
  onSetbackToPractice,
}: BossCheckProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);
  const shuffledOptions = useMemo(
    () => stableShuffleMixed(marketCapRevenueBossSummaryOptions, "market-cap-revenue-boss-step-5"),
    [],
  );
  const selectedOption =
    marketCapRevenueBossSummaryOptions.find((option) => option.id === selectedId) ?? null;

  return (
    <BossShell badgeTone="violet">
      <BossStepRail activeStep={4} stepLabels={marketCapRevenueBossStepLabels} />
      <h2 className="text-2xl font-semibold text-slate-950">Step 5 · Final summary</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Choose the only summary that keeps size, price, and growth in the right roles.
      </p>
      <div className="mt-5 space-y-3">
        {shuffledOptions.map((option) => (
          <button
            key={option.id}
            className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
              selectedId === option.id
                ? "selected border-emerald-300 bg-emerald-50"
                : "border-slate-200 bg-white"
            }`}
            onClick={() => setSelectedId(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
      {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
      <div className="mt-6">
        {successMessage ? (
          <button
            className="interactive-cta journey-forward-cta reward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white"
            onClick={onComplete}
            type="button"
          >
            Claim progress
          </button>
        ) : setback ? (
          <button
            className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-800"
            onClick={() => {
              setSetback(null);
              onSetbackToPractice(setback.targetStep);
            }}
            type="button"
          >
            {setback.buttonLabel}
          </button>
        ) : (
          <button
            className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white disabled:opacity-45"
            disabled={!selectedOption}
            onClick={() => {
              if (!selectedOption) return;
              if (selectedOption.id === "correct") {
                setSuccessMessage("Boss cleared. You separated company size, share price, revenue growth, and careful comparison under pressure.");
                return;
              }
              onIncorrect(selectedOption.reviewPrompt);
              setSetback({
                targetStep: 3,
                buttonLabel: "Back to Step 4",
                message: "Not quite — re-lock the mixed comparison before the final summary.",
              });
            }}
            type="button"
          >
            {selectedOption ? "Lock final answer" : "Choose an answer first"}
          </button>
        )}
      </div>
    </BossShell>
  );
}

const epsPeBossStepLabels = ["EPS", "Build", "P/E", "Context", "Summary"];

const epsPeBossDefinitionOptions: BossOption[] = [
  {
    id: "correct",
    label: "EPS means earnings per share.",
    feedback: "Correct. EPS is the per-share earnings read.",
    reviewPrompt: "",
  },
  {
    id: "market-cap",
    label: "EPS means the total value of the company.",
    feedback: "That confuses EPS with company-size thinking.",
    reviewPrompt: "eps-basics",
  },
  {
    id: "price",
    label: "EPS means the stock price itself.",
    feedback: "EPS is a business metric, not the stock price.",
    reviewPrompt: "eps-basics",
  },
  {
    id: "guarantee",
    label: "EPS guarantees returns.",
    feedback: "EPS can help you read the business. It never guarantees returns.",
    reviewPrompt: "eps-basics",
  },
];

const epsPeBossSummaryOptions: BossOption[] = [
  {
    id: "correct",
    label:
      "EPS is earnings per share, P/E compares price to earnings, high or low ratios need context, and the best read still uses sector and expectation logic.",
    feedback: "That is the clean Module 8 synthesis.",
    reviewPrompt: "",
  },
  {
    id: "ratio-verdict",
    label: "A high or low P/E usually gives the final verdict by itself.",
    feedback: "That drops the context the whole module was building.",
    reviewPrompt: "pe-context-not-verdict",
  },
  {
    id: "eps-ignore",
    label: "P/E matters, but EPS does not matter much.",
    feedback: "EPS is one side of the ratio and still matters.",
    reviewPrompt: "eps-basics",
  },
  {
    id: "sector-ignore",
    label: "Sector context barely matters when you compare P/E ratios.",
    feedback: "The module spent a whole lesson fixing that shortcut.",
    reviewPrompt: "sector-context",
  },
];

export function EpsPeBossPractice({
  currentStep,
  onAdvanceToCheck,
  onIncorrect,
  onStepChange,
}: BossPracticeProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sequence, setSequence] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);

  const shuffledDefinitionOptions = useMemo(
    () => stableShuffleMixed(epsPeBossDefinitionOptions, "eps-pe-boss-step-1"),
    [],
  );

  useEffect(() => {
    setSelectedId(null);
    setSequence([]);
    setAssignments({});
    setSuccessMessage(null);
    setSetback(null);
  }, [currentStep]);

  function triggerSetback(message: string, targetStep: number, reviewPrompt: string) {
    if (reviewPrompt) {
      onIncorrect(reviewPrompt);
    }

    setSetback({
      targetStep,
      message,
      buttonLabel: targetStep === currentStep ? "Retry this step" : `Back to Step ${targetStep + 1}`,
    });
  }

  function renderEpsStep() {
    const selectedOption =
      epsPeBossDefinitionOptions.find((option) => option.id === selectedId) ?? null;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={epsPeBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 1 · EPS foundation</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Start with the clean per-share definition before the ratio work begins.
        </p>
        <div className="mt-5 space-y-3">
          {shuffledDefinitionOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(1)}
              type="button"
            >
              Lock Step 2
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "correct") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — lock the per-share definition in first.", 0, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderBuildStep() {
    const ordered = ["earnings", "shares", "eps"];
    const labels: Record<string, string> = {
      earnings: "Start with total earnings",
      shares: "Divide across the shares",
      eps: "Read the EPS result",
    };
    const remaining = stableShuffleMixed(
      ordered.filter((item) => !sequence.includes(item)),
      `eps-pe-boss-step-2-${sequence.length}`,
    );
    const correct =
      sequence.length === ordered.length &&
      sequence.every((item, index) => item === ordered[index]);

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={epsPeBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 2 · Build EPS</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Put the per-share logic in the right order.
        </p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Ordered sequence
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {ordered.map((_, index) => (
              <div
                key={index}
                className={`rounded-full px-3 py-2 text-sm ${
                  sequence[index] ? "bg-emerald-50 text-emerald-800" : "bg-white text-slate-400"
                }`}
              >
                {sequence[index] ? labels[sequence[index]] : `Step ${index + 1}`}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {remaining.map((item) => (
            <button
              key={item}
              className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
              onClick={() => setSequence((current) => [...current, item])}
              type="button"
            >
              <p className="text-sm font-semibold text-slate-900">{labels[item]}</p>
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(2)}
              type="button"
            >
              Lock Step 3
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={sequence.length !== ordered.length}
              onClick={() => {
                if (!correct) {
                  triggerSetback("Not quite — re-lock the EPS definition first.", 0, "share-count-matters");
                  return;
                }
                setSuccessMessage("Correct. EPS starts with total earnings, then the share count spreads that profit into a per-share result.");
              }}
              type="button"
            >
              {sequence.length === ordered.length ? "Lock order" : "Finish the order first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderPeStep() {
    const options: BossOption[] = [
      {
        id: "alpha",
        label: "Alpha has the higher P/E",
        feedback: "Correct. Alpha is trading at more price relative to its earnings.",
        reviewPrompt: "",
      },
      {
        id: "beta",
        label: "Beta has the higher P/E",
        feedback: "Beta’s lower ratio makes it the cheaper read in this case.",
        reviewPrompt: "pe-basics",
      },
      {
        id: "same",
        label: "They have the same P/E",
        feedback: "The price and earnings pairs were built to create different ratios.",
        reviewPrompt: "pe-basics",
      },
    ];
    const selectedOption = options.find((option) => option.id === selectedId) ?? null;
    const shuffledOptions = stableShuffleMixed(options, "eps-pe-boss-step-3");

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={epsPeBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 3 · P/E read</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Compare the price-to-earnings relationships, not just one number in isolation.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Alpha</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Price $60 • EPS $2</p>
            <p className="mt-2 text-sm text-slate-600">This points to a richer ratio.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Beta</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Price $36 • EPS $6</p>
            <p className="mt-2 text-sm text-slate-600">This points to a cheaper ratio.</p>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {shuffledOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(3)}
              type="button"
            >
              Lock Step 4
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "alpha") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — re-lock the EPS build before the ratio read.", 1, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderContextStep() {
    const cards = [
      { id: "high-careful", label: "30x can reflect stronger expectations.", target: "Careful", reviewPrompt: "high-pe-context" },
      { id: "low-over", label: "6x is automatically a bargain.", target: "Overreach", reviewPrompt: "low-pe-context" },
      { id: "sector-careful", label: "Compare P/E inside a similar sector first.", target: "Careful", reviewPrompt: "sector-context" },
      { id: "verdict-over", label: "P/E alone gives the final verdict.", target: "Overreach", reviewPrompt: "pe-context-not-verdict" },
    ];
    const buckets = ["Careful", "Overreach"];
    const currentCard = cards.find((card) => !assignments[card.id]) ?? null;
    const complete = cards.every((card) => assignments[card.id]);

    function assign(bucket: string) {
      if (!currentCard) {
        return;
      }

      if (bucket !== currentCard.target) {
        triggerSetback("Not quite — re-lock the ratio read before the context judgment.", 2, currentCard.reviewPrompt);
        return;
      }

      const nextAssignments = { ...assignments, [currentCard.id]: bucket };
      setAssignments(nextAssignments);

      if (cards.every((card) => nextAssignments[card.id])) {
        setSuccessMessage("Correct. You kept the careful valuation reads away from the shortcuts.");
      }
    }

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={epsPeBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 4 · Context under pressure</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Classify the next valuation statement without slipping into shortcut logic.
        </p>
        {currentCard ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.05)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Current statement</p>
            <p className="mt-3 text-lg font-semibold text-slate-950">{currentCard.label}</p>
          </div>
        ) : null}
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {buckets.map((bucket) => (
            <button
              key={bucket}
              className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
              onClick={() => assign(bucket)}
              type="button"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Place in</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{bucket}</p>
            </button>
          ))}
        </div>
        {complete ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {buckets.map((bucket) => (
              <div key={bucket} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">{bucket}</p>
                <div className="mt-3 space-y-2">
                  {cards
                    .filter((card) => assignments[card.id] === bucket)
                    .map((card) => (
                      <div key={card.id} className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                        {card.label}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={onAdvanceToCheck}
              type="button"
            >
              Enter final summary
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled
              type="button"
            >
              Classify every statement first
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <BossShell>
      {currentStep === 0
        ? renderEpsStep()
        : currentStep === 1
          ? renderBuildStep()
          : currentStep === 2
            ? renderPeStep()
            : renderContextStep()}
    </BossShell>
  );
}

export function EpsPeBossCheck({
  onComplete,
  onIncorrect,
  onSetbackToPractice,
}: BossCheckProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);
  const shuffledOptions = useMemo(
    () => stableShuffleMixed(epsPeBossSummaryOptions, "eps-pe-boss-step-5"),
    [],
  );
  const selectedOption =
    epsPeBossSummaryOptions.find((option) => option.id === selectedId) ?? null;

  return (
    <BossShell badgeTone="violet">
      <BossStepRail activeStep={4} stepLabels={epsPeBossStepLabels} />
      <h2 className="text-2xl font-semibold text-slate-950">Step 5 · Final summary</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Choose the only summary that keeps EPS, P/E, and context in the right roles.
      </p>
      <div className="mt-5 space-y-3">
        {shuffledOptions.map((option) => (
          <button
            key={option.id}
            className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
              selectedId === option.id
                ? "selected border-emerald-300 bg-emerald-50"
                : "border-slate-200 bg-white"
            }`}
            onClick={() => setSelectedId(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
      {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
      <div className="mt-6">
        {successMessage ? (
          <button
            className="interactive-cta journey-forward-cta reward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white"
            onClick={onComplete}
            type="button"
          >
            Claim progress
          </button>
        ) : setback ? (
          <button
            className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-800"
            onClick={() => {
              setSetback(null);
              onSetbackToPractice(setback.targetStep);
            }}
            type="button"
          >
            {setback.buttonLabel}
          </button>
        ) : (
          <button
            className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white disabled:opacity-45"
            disabled={!selectedOption}
            onClick={() => {
              if (!selectedOption) return;
              if (selectedOption.id === "correct") {
                setSuccessMessage("Boss cleared. You held EPS, P/E, sector context, and careful valuation logic together under pressure.");
                return;
              }
              onIncorrect(selectedOption.reviewPrompt);
              setSetback({
                targetStep: 3,
                buttonLabel: "Back to Step 4",
                message: "Not quite — re-lock the valuation context before the final summary.",
              });
            }}
            type="button"
          >
            {selectedOption ? "Lock final answer" : "Choose an answer first"}
          </button>
        )}
      </div>
    </BossShell>
  );
}

const puttingItTogetherBossStepLabels = ["Chart", "Lens", "Confluence", "Order", "Summary"];

const puttingItTogetherBossChartOptions: BossOption[] = [
  {
    id: "chart-first",
    label: "Start with the chart before the narrative.",
    feedback: "Correct. The chart is still the first lens.",
    reviewPrompt: "",
  },
  {
    id: "valuation-first",
    label: "Start with valuation because it sounds more advanced.",
    feedback: "That skips the first clean observation.",
    reviewPrompt: "analysis-order",
  },
  {
    id: "headline-first",
    label: "Start with the most dramatic headline.",
    feedback: "That chases story before structure.",
    reviewPrompt: "analysis-order",
  },
  {
    id: "target-first",
    label: "Start with a target price.",
    feedback: "That jumps to a conclusion instead of a read.",
    reviewPrompt: "analysis-order",
  },
];

const puttingItTogetherBossLensCards = [
  { id: "chart", label: "Uptrend above support", target: "Chart lens" },
  { id: "business", label: "Revenue still growing", target: "Business lens" },
  { id: "valuation", label: "P/E still needs context", target: "Valuation lens" },
];

const puttingItTogetherBossConfluenceOptions: BossOption[] = [
  {
    id: "correct",
    label: "Constructive chart, supportive business, and valuation that still needs context.",
    feedback: "Correct. That read uses all three layers without turning them into certainty.",
    reviewPrompt: "",
  },
  {
    id: "one-clue",
    label: "One strong clue proves the full stock case.",
    feedback: "That is the exact shortcut this module should reject.",
    reviewPrompt: "weak-explanation",
  },
  {
    id: "valuation-only",
    label: "Valuation alone is enough to finish the read.",
    feedback: "A full read cannot collapse into one ratio.",
    reviewPrompt: "pe-plus-expectations",
  },
  {
    id: "business-erases-chart",
    label: "Business growth erases whatever the chart is doing.",
    feedback: "That lets one lens replace the others.",
    reviewPrompt: "two-lens-analysis",
  },
];

const puttingItTogetherBossOrder = [
  "Read the chart first",
  "Add business context",
  "Check valuation context",
  "End with one open question",
];

const puttingItTogetherBossSummaryOptions: BossOption[] = [
  {
    id: "correct",
    label:
      "Start with the chart, add the business lens, keep valuation in context, and finish with one honest open question.",
    feedback: "That is the clean Putting It Together summary.",
    reviewPrompt: "",
  },
  {
    id: "skip-valuation",
    label: "Use the chart and business clues, then skip valuation because it slows the read down.",
    feedback: "The endgame read should still keep valuation in view.",
    reviewPrompt: "pre-final-rehearsal",
  },
  {
    id: "certainty",
    label: "If several clues line up, the read should sound certain.",
    feedback: "Even the stronger read should still sound careful.",
    reviewPrompt: "weak-explanation",
  },
  {
    id: "one-lens",
    label: "The strongest lens should replace the rest of the workflow.",
    feedback: "The point of Module 9 is combining the lenses, not replacing them.",
    reviewPrompt: "analysis-order",
  },
];

export function PuttingItTogetherBossPractice({
  currentStep,
  onAdvanceToCheck,
  onIncorrect,
  onStepChange,
}: BossPracticeProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [classified, setClassified] = useState<Record<string, string>>({});
  const [sequence, setSequence] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);

  const shuffledChartOptions = useMemo(
    () => stableShuffleMixed(puttingItTogetherBossChartOptions, "putting-it-together-boss-step-1"),
    [],
  );
  const shuffledConfluenceOptions = useMemo(
    () => stableShuffleMixed(puttingItTogetherBossConfluenceOptions, "putting-it-together-boss-step-3"),
    [],
  );

  useEffect(() => {
    setSelectedId(null);
    setClassified({});
    setSequence([]);
    setSuccessMessage(null);
    setSetback(null);
  }, [currentStep]);

  function triggerSetback(message: string, targetStep: number, reviewPrompt: string) {
    if (reviewPrompt) {
      onIncorrect(reviewPrompt);
    }

    setSetback({
      targetStep,
      message,
      buttonLabel: targetStep === currentStep ? "Retry this step" : `Back to Step ${targetStep + 1}`,
    });
  }

  function renderChartStep() {
    const selectedOption =
      puttingItTogetherBossChartOptions.find((option) => option.id === selectedId) ?? null;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={puttingItTogetherBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 1 · Chart first</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          A full stock read still starts with the first clean observation.
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-[0.98fr_1.02fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.05)]">
            <div className="overflow-hidden rounded-[1.35rem] border border-slate-100 bg-[linear-gradient(180deg,#fbfdfc_0%,#f3f7f4_100%)] p-3">
              <BossChart points={[20, 28, 36, 34, 44, 52, 60]} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Trend
                </p>
                <p className="mt-1 font-semibold text-slate-900">Constructive</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Structure
                </p>
                <p className="mt-1 font-semibold text-slate-900">Support still matters</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {shuffledChartOptions.map((option) => (
              <button
                key={option.id}
                className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                  selectedId === option.id
                    ? "selected border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white"
                }`}
                onClick={() => setSelectedId(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(1)}
              type="button"
            >
              Lock Step 2
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "chart-first") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — lock the first lens in before the rest of the read.", 0, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderLensStep() {
    const remainingCard =
      puttingItTogetherBossLensCards.find((card) => !classified[card.id]) ?? null;
    const complete =
      Object.keys(classified).length === puttingItTogetherBossLensCards.length;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={puttingItTogetherBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 2 · Put each clue in the right lane</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Keep chart, business, and valuation clues separate before you combine them.
        </p>
        {remainingCard ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_26px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-semibold text-slate-900">
                #{puttingItTogetherBossLensCards.findIndex((card) => card.id === remainingCard.id) + 1} · {remainingCard.label}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {["Chart lens", "Business lens", "Valuation lens"].map((bucket) => (
                <button
                  key={bucket}
                  className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
                  onClick={() => {
                    if (bucket !== remainingCard.target) {
                      triggerSetback("Not quite — re-lock the chart-first lens before sorting the evidence.", 0, "two-lens-analysis");
                      return;
                    }
                    setClassified((current) => ({
                      ...current,
                      [remainingCard.id]: bucket,
                    }));
                  }}
                  type="button"
                >
                  {bucket}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {puttingItTogetherBossLensCards.map((card, index) => (
            <div
              key={card.id}
              className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3"
            >
              <p className="text-sm text-slate-700">
                #{index + 1} · {card.label}
              </p>
              {classified[card.id] ? (
                <div className="mt-2">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    {classified[card.id]}
                  </span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(2)}
              type="button"
            >
              Lock Step 3
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!complete}
              onClick={() =>
                setSuccessMessage(
                  "Correct. You kept chart, business, and valuation in separate lanes before combining them.",
                )
              }
              type="button"
            >
              {complete ? "Lock Step 3" : "Sort every clue first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderConfluenceStep() {
    const selectedOption =
      puttingItTogetherBossConfluenceOptions.find((option) => option.id === selectedId) ?? null;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={puttingItTogetherBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 3 · Choose the strongest read</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          The chart looks constructive, the business still shows growth, and valuation still needs context. Which read is strongest?
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.05)]">
            <div className="grid gap-3">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Chart</p>
                <p className="mt-1 font-semibold text-slate-900">Uptrend above support</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Business</p>
                <p className="mt-1 font-semibold text-slate-900">Revenue still growing</p>
              </div>
              <div className="rounded-xl bg-emerald-50/70 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Valuation</p>
                <p className="mt-1 font-semibold text-slate-900">Needs context, not certainty</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {shuffledConfluenceOptions.map((option) => (
              <button
                key={option.id}
                className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                  selectedId === option.id
                    ? "selected border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white"
                }`}
                onClick={() => setSelectedId(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(3)}
              type="button"
            >
              Lock Step 4
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "correct") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — re-lock the evidence lanes before the combined read.", 1, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderOrderStep() {
    const remaining = stableShuffleMixed(
      puttingItTogetherBossOrder.filter((item) => !sequence.includes(item)),
      `putting-it-together-boss-step-4-${sequence.length}`,
    );
    const correct =
      sequence.length === puttingItTogetherBossOrder.length &&
      sequence.every((item, index) => item === puttingItTogetherBossOrder[index]);

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={puttingItTogetherBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 4 · Rebuild the full workflow</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Put the final answer structure back in the right order before the summary lock.
        </p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Ordered sequence
            </p>
            {sequence.length > 0 ? (
              <button
                className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
                onClick={() => setSequence((current) => current.slice(0, -1))}
                type="button"
              >
                Undo
              </button>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {puttingItTogetherBossOrder.map((_, index) => (
              <div
                key={index}
                className={`rounded-full px-3 py-2 text-sm ${
                  sequence[index] ? "bg-emerald-50 text-emerald-800" : "bg-white text-slate-400"
                }`}
              >
                {sequence[index] ?? `Step ${index + 1}`}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {remaining.map((item) => (
            <button
              key={item}
              className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
              onClick={() => setSequence((current) => [...current, item])}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={onAdvanceToCheck}
              type="button"
            >
              Enter final summary
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={sequence.length !== puttingItTogetherBossOrder.length}
              onClick={() => {
                if (!correct) {
                  triggerSetback("Not quite — rebuild the combined read before the final workflow.", 2, "beginner-checklist");
                  return;
                }
                setSuccessMessage("Correct. The full read now flows from chart to business to valuation to one open question.");
              }}
              type="button"
            >
              {sequence.length === puttingItTogetherBossOrder.length ? "Lock order" : "Finish the order first"}
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <BossShell>
      {currentStep === 0
        ? renderChartStep()
        : currentStep === 1
          ? renderLensStep()
          : currentStep === 2
            ? renderConfluenceStep()
            : renderOrderStep()}
    </BossShell>
  );
}

export function PuttingItTogetherBossCheck({
  onComplete,
  onIncorrect,
  onSetbackToPractice,
}: BossCheckProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);
  const shuffledOptions = useMemo(
    () => stableShuffleMixed(puttingItTogetherBossSummaryOptions, "putting-it-together-boss-step-5"),
    [],
  );
  const selectedOption =
    puttingItTogetherBossSummaryOptions.find((option) => option.id === selectedId) ?? null;

  return (
    <BossShell badgeTone="violet">
      <BossStepRail activeStep={4} stepLabels={puttingItTogetherBossStepLabels} />
      <h2 className="text-2xl font-semibold text-slate-950">Step 5 · Final summary</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Choose the only summary that keeps chart, business, valuation, and uncertainty in the right roles.
      </p>
      <div className="mt-5 space-y-3">
        {shuffledOptions.map((option) => (
          <button
            key={option.id}
            className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
              selectedId === option.id
                ? "selected border-emerald-300 bg-emerald-50"
                : "border-slate-200 bg-white"
            }`}
            onClick={() => setSelectedId(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
      {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
      <div className="mt-6">
        {successMessage ? (
          <button
            className="interactive-cta journey-forward-cta reward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white"
            onClick={onComplete}
            type="button"
          >
            Claim progress
          </button>
        ) : setback ? (
          <button
            className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-800"
            onClick={() => {
              setSetback(null);
              onSetbackToPractice(setback.targetStep);
            }}
            type="button"
          >
            {setback.buttonLabel}
          </button>
        ) : (
          <button
            className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white disabled:opacity-45"
            disabled={!selectedOption}
            onClick={() => {
              if (!selectedOption) return;
              if (selectedOption.id === "correct") {
                setSuccessMessage("Boss cleared. You held chart, business, valuation, and uncertainty together under pressure.");
                return;
              }
              onIncorrect(selectedOption.reviewPrompt);
              setSetback({
                targetStep: 3,
                buttonLabel: "Back to Step 4",
                message: "Not quite — rebuild the final workflow before the summary lock.",
              });
            }}
            type="button"
          >
            {selectedOption ? "Lock final answer" : "Choose an answer first"}
          </button>
        )}
      </div>
    </BossShell>
  );
}

const finalMasteryBossStepLabels = ["Known", "Next", "Conflict", "Confidence", "Summary"];

const finalMasteryBossNextQuestionOptions: BossOption[] = [
  {
    id: "valuation-gap",
    label: "Ask what growth or risk context explains the valuation.",
    feedback: "Correct. The next best question closes the biggest remaining gap.",
    reviewPrompt: "",
  },
  {
    id: "double",
    label: "Ask how fast the stock can double.",
    feedback: "That chases hype instead of clarity.",
    reviewPrompt: "next-best-question",
  },
  {
    id: "certainty",
    label: "Ask whether uncertainty can now be ignored.",
    feedback: "That breaks the whole discipline of the final module.",
    reviewPrompt: "next-best-question",
  },
];

const finalMasteryBossConflictOptions: BossOption[] = [
  {
    id: "correct",
    label: "The chart may matter more right now, but the business clue still matters and confidence should stay measured.",
    feedback: "Correct. That is the clean mixed-signal read.",
    reviewPrompt: "",
  },
  {
    id: "erase-business",
    label: "The chart erases the business clue completely.",
    feedback: "That forces the conflict into a fake clean answer.",
    reviewPrompt: "mixed-signals",
  },
  {
    id: "erase-chart",
    label: "The business clue erases the chart completely.",
    feedback: "That makes the same mistake in the other direction.",
    reviewPrompt: "mixed-signals",
  },
  {
    id: "certainty",
    label: "The conflict means the answer should still sound certain.",
    feedback: "Conflict should usually reduce confidence, not increase it.",
    reviewPrompt: "confidence-calibration",
  },
];

const finalMasteryBossKnowledgeCards = [
  { id: "known", label: "The chart is mostly rising", target: "Known now" },
  { id: "context", label: "Whether the valuation is justified", target: "Need more context" },
  { id: "unknown", label: "The next earnings reaction", target: "Unknown yet" },
];

const finalMasteryBossConfidenceCards = [
  { id: "supports-1", label: "Trend still constructive", target: "Supports confidence" },
  { id: "supports-2", label: "Business growth still visible", target: "Supports confidence" },
  { id: "reduces-1", label: "Valuation still needs context", target: "Lowers confidence" },
  { id: "reduces-2", label: "One open question remains", target: "Lowers confidence" },
];

const finalMasteryBossSummaryOptions: BossOption[] = [
  {
    id: "correct",
    label:
      "Name what is known, ask the next best question, handle mixed evidence carefully, set confidence to match the evidence, and finish with a calm summary.",
    feedback: "That is the clean final mastery summary.",
    reviewPrompt: "",
  },
  {
    id: "certainty",
    label: "Pick the strongest clue, sound certain, and skip the open question.",
    feedback: "That breaks the final mastery standard.",
    reviewPrompt: "final-certification",
  },
  {
    id: "one-number",
    label: "Use one number to finish the whole stock read quickly.",
    feedback: "The final module is about rejecting one-number shortcuts.",
    reviewPrompt: "final-certification",
  },
  {
    id: "prediction",
    label: "The final read should mostly be a confident prediction.",
    feedback: "The endgame read is still interpretation, not certainty theater.",
    reviewPrompt: "final-certification",
  },
];

export function FinalMasteryBossPractice({
  currentStep,
  onAdvanceToCheck,
  onIncorrect,
  onStepChange,
}: BossPracticeProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [classified, setClassified] = useState<Record<string, string>>({});
  const [confidenceAssignments, setConfidenceAssignments] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);

  const shuffledNextQuestionOptions = useMemo(
    () => stableShuffleMixed(finalMasteryBossNextQuestionOptions, "final-mastery-boss-step-2"),
    [],
  );
  const shuffledConflictOptions = useMemo(
    () => stableShuffleMixed(finalMasteryBossConflictOptions, "final-mastery-boss-step-3"),
    [],
  );

  useEffect(() => {
    setSelectedId(null);
    setClassified({});
    setConfidenceAssignments({});
    setSuccessMessage(null);
    setSetback(null);
  }, [currentStep]);

  function triggerSetback(message: string, targetStep: number, reviewPrompt: string) {
    if (reviewPrompt) {
      onIncorrect(reviewPrompt);
    }

    setSetback({
      targetStep,
      message,
      buttonLabel: targetStep === currentStep ? "Retry this step" : `Back to Step ${targetStep + 1}`,
    });
  }

  function renderKnowledgeStep() {
    const remainingCard =
      finalMasteryBossKnowledgeCards.find((card) => !classified[card.id]) ?? null;
    const complete =
      Object.keys(classified).length === finalMasteryBossKnowledgeCards.length;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={finalMasteryBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 1 · Separate what you know</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          A final read starts by separating visible facts, open questions, and future unknowns.
        </p>
        {remainingCard ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_26px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-semibold text-slate-900">
                #{finalMasteryBossKnowledgeCards.findIndex((card) => card.id === remainingCard.id) + 1} · {remainingCard.label}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {["Known now", "Need more context", "Unknown yet"].map((bucket) => (
                <button
                  key={bucket}
                  className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
                  onClick={() => {
                    if (bucket !== remainingCard.target) {
                      triggerSetback("Not quite — keep what is visible, open, and unknown in separate lanes.", 0, "known-vs-unknown");
                      return;
                    }
                    setClassified((current) => ({
                      ...current,
                      [remainingCard.id]: bucket,
                    }));
                  }}
                  type="button"
                >
                  {bucket}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {finalMasteryBossKnowledgeCards.map((card, index) => (
            <div key={card.id} className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
              <p className="text-sm text-slate-700">
                #{index + 1} · {card.label}
              </p>
              {classified[card.id] ? (
                <div className="mt-2">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    {classified[card.id]}
                  </span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(1)}
              type="button"
            >
              Lock Step 2
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!complete}
              onClick={() =>
                setSuccessMessage(
                  "Correct. You separated visible evidence, open judgments, and future unknowns cleanly.",
                )
              }
              type="button"
            >
              {complete ? "Lock Step 2" : "Classify every clue first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderNextQuestionStep() {
    const selectedOption =
      finalMasteryBossNextQuestionOptions.find((option) => option.id === selectedId) ?? null;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={finalMasteryBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 2 · Ask the next best question</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          The chart looks constructive and growth still exists, but valuation context is still missing. What is the next best question?
        </p>
        <div className="mt-5 space-y-3">
          {shuffledNextQuestionOptions.map((option) => (
            <button
              key={option.id}
              className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                selectedId === option.id
                  ? "selected border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => setSelectedId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(2)}
              type="button"
            >
              Lock Step 3
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "valuation-gap") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — re-lock what is known before chasing the next question.", 0, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderConflictStep() {
    const selectedOption =
      finalMasteryBossConflictOptions.find((option) => option.id === selectedId) ?? null;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={finalMasteryBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 3 · Handle the conflict</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          The chart looks weaker right now, but the business still looks healthy. Which interpretation is strongest?
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.05)]">
            <div className="grid gap-3">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Chart</p>
                <p className="mt-1 font-semibold text-slate-900">Near-term trend weakened</p>
              </div>
              <div className="rounded-xl bg-emerald-50/70 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Business</p>
                <p className="mt-1 font-semibold text-slate-900">Revenue still growing</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Discipline</p>
                <p className="mt-1 font-semibold text-slate-900">Do not force one clue to erase the other</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {shuffledConflictOptions.map((option) => (
              <button
                key={option.id}
                className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
                  selectedId === option.id
                    ? "selected border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white"
                }`}
                onClick={() => setSelectedId(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={() => onStepChange(3)}
              type="button"
            >
              Lock Step 4
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!selectedOption}
              onClick={() => {
                if (!selectedOption) return;
                if (selectedOption.id === "correct") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — ask the better next question before handling the conflict.", 1, selectedOption.reviewPrompt);
              }}
              type="button"
            >
              {selectedOption ? "Lock answer" : "Choose an answer first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderConfidenceStep() {
    const remainingCard =
      finalMasteryBossConfidenceCards.find((card) => !confidenceAssignments[card.id]) ?? null;
    const complete =
      Object.keys(confidenceAssignments).length === finalMasteryBossConfidenceCards.length;

    return (
      <>
        <BossStepRail activeStep={currentStep} stepLabels={finalMasteryBossStepLabels} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 4 · Set confidence honestly</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sort the clues into what supports confidence and what should pull confidence down.
        </p>
        {remainingCard ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_26px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-semibold text-slate-900">
                #{finalMasteryBossConfidenceCards.findIndex((card) => card.id === remainingCard.id) + 1} · {remainingCard.label}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {["Supports confidence", "Lowers confidence"].map((bucket) => (
                <button
                  key={bucket}
                  className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
                  onClick={() => {
                    if (bucket !== remainingCard.target) {
                      triggerSetback("Not quite — re-lock the mixed-signal read before setting confidence.", 2, "confidence-calibration");
                      return;
                    }
                    setConfidenceAssignments((current) => ({
                      ...current,
                      [remainingCard.id]: bucket,
                    }));
                  }}
                  type="button"
                >
                  {bucket}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {finalMasteryBossConfidenceCards.map((card, index) => (
            <div key={card.id} className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
              <p className="text-sm text-slate-700">
                #{index + 1} · {card.label}
              </p>
              {confidenceAssignments[card.id] ? (
                <div className="mt-2">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    {confidenceAssignments[card.id]}
                  </span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
        {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
        <div className="mt-6">
          {successMessage ? (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white"
              onClick={onAdvanceToCheck}
              type="button"
            >
              Enter final summary
            </button>
          ) : setback ? (
            <button
              className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800"
              onClick={() => {
                setSetback(null);
                onStepChange(setback.targetStep);
              }}
              type="button"
            >
              {setback.buttonLabel}
            </button>
          ) : (
            <button
              className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-6 py-4 text-lg font-semibold text-white disabled:opacity-45"
              disabled={!complete}
              onClick={() =>
                setSuccessMessage(
                  "Correct. You let strong clues support confidence and open questions pull it back down.",
                )
              }
              type="button"
            >
              {complete ? "Lock confidence read" : "Classify every clue first"}
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <BossShell badgeTone="violet">
      {currentStep === 0
        ? renderKnowledgeStep()
        : currentStep === 1
          ? renderNextQuestionStep()
          : currentStep === 2
            ? renderConflictStep()
            : renderConfidenceStep()}
    </BossShell>
  );
}

export function FinalMasteryBossCheck({
  onComplete,
  onIncorrect,
  onSetbackToPractice,
}: BossCheckProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);
  const shuffledOptions = useMemo(
    () => stableShuffleMixed(finalMasteryBossSummaryOptions, "final-mastery-boss-step-5"),
    [],
  );
  const selectedOption =
    finalMasteryBossSummaryOptions.find((option) => option.id === selectedId) ?? null;

  return (
    <BossShell badgeTone="violet">
      <BossStepRail activeStep={4} stepLabels={finalMasteryBossStepLabels} />
      <h2 className="text-2xl font-semibold text-slate-950">Step 5 · Certification summary</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Choose the only final summary that keeps evidence, uncertainty, and confidence in the right roles.
      </p>
      <div className="mt-5 space-y-3">
        {shuffledOptions.map((option) => (
          <button
            key={option.id}
            className={`interactive-choice w-full rounded-2xl border px-4 py-4 text-left ${
              selectedId === option.id
                ? "selected border-emerald-300 bg-emerald-50"
                : "border-slate-200 bg-white"
            }`}
            onClick={() => setSelectedId(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {successMessage ? <div className="mt-5"><FeedbackBox kind="success" message={successMessage} /></div> : null}
      {setback ? <div className="mt-5"><FeedbackBox kind="error" message={setback.message} /></div> : null}
      <div className="mt-6">
        {successMessage ? (
          <button
            className="interactive-cta journey-forward-cta reward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white"
            onClick={onComplete}
            type="button"
          >
            Claim progress
          </button>
        ) : setback ? (
          <button
            className="interactive-cta w-full rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-800"
            onClick={() => {
              setSetback(null);
              onSetbackToPractice(setback.targetStep);
            }}
            type="button"
          >
            {setback.buttonLabel}
          </button>
        ) : (
          <button
            className="interactive-cta journey-forward-cta w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white disabled:opacity-45"
            disabled={!selectedOption}
            onClick={() => {
              if (!selectedOption) return;
              if (selectedOption.id === "correct") {
                setSuccessMessage("Certification cleared. You handled evidence, uncertainty, mixed signals, and confidence like a real endgame read.");
                return;
              }
              onIncorrect(selectedOption.reviewPrompt);
              setSetback({
                targetStep: 3,
                buttonLabel: "Back to Step 4",
                message: "Not quite — re-lock the confidence logic before the certification summary.",
              });
            }}
            type="button"
          >
            {selectedOption ? "Lock final answer" : "Choose an answer first"}
          </button>
        )}
      </div>
    </BossShell>
  );
}
