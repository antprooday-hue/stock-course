"use client";

import { useEffect, useMemo, useState } from "react";
import { stableShuffle } from "../lib/stable-shuffle";
import { CheckCircleIcon, LockIcon, XCircleIcon } from "./icons";

type FoundationsBossPracticeProps = {
  currentStep: number;
  onAdvanceToCheck: () => void;
  onIncorrect: (reviewPrompt: string) => void;
  onStepChange: (step: number) => void;
};

type FoundationsBossCheckProps = {
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

const stepLabels = [
  "Ownership",
  "Capital",
  "Reaction",
  "Returns",
  "Summary",
];

const stepOneOptions: BossOption[] = [
  {
    id: "ownership",
    label: "Ownership in the company",
    feedback: "Buying shares gives ownership, not a paycheck or a loan claim.",
    reviewPrompt: "",
  },
  {
    id: "salary",
    label: "A guaranteed salary from the company",
    feedback: "A salary comes from working there, not from buying shares.",
    reviewPrompt: "ownership-basics",
  },
  {
    id: "loan",
    label: "A promise of loan repayment",
    feedback: "That describes lending. Stock is ownership.",
    reviewPrompt: "ownership-basics",
  },
  {
    id: "control",
    label: "Control of every business decision",
    feedback: "Owning shares does not mean total control.",
    reviewPrompt: "ownership-basics",
  },
];

const stepTwoOptions: BossOption[] = [
  {
    id: "capital",
    label: "Capital raising for growth",
    feedback: "Correct. Issuing shares connects first to raising money for expansion.",
    reviewPrompt: "",
  },
  {
    id: "dividend",
    label: "Guaranteed dividend income",
    feedback: "Issuing shares does not guarantee a dividend.",
    reviewPrompt: "capital-raising",
  },
  {
    id: "profit",
    label: "Guaranteed profit for shareholders",
    feedback: "Raising capital is a financing move, not a profit promise.",
    reviewPrompt: "capital-raising",
  },
  {
    id: "control",
    label: "Total control over the market price",
    feedback: "Issuing shares does not control the market that way.",
    reviewPrompt: "capital-raising",
  },
];

const reactionOrder = [
  "Company announces a strong growth plan",
  "Market expectations improve",
  "Price may move higher",
];

const returnScenarios = [
  { id: "gain", label: "Buy at 20, sell at 25", target: "Gain" },
  { id: "flat", label: "Buy at 20, sell at 20", target: "Break-even" },
  { id: "loss", label: "Buy at 20, sell at 17", target: "Loss" },
  { id: "dividend", label: "Hold shares and receive cash from the company", target: "Dividend" },
];

const summaryOptions: BossOption[] = [
  {
    id: "correct",
    label:
      "A stock gives ownership, companies may issue shares to raise capital, news can change expectations, returns can come from price moves or dividends, and nothing is guaranteed.",
    feedback: "That is the clean summary. It keeps ownership, capital, expectations, and return types in the right places.",
    reviewPrompt: "",
  },
  {
    id: "omit-dividend",
    label:
      "A stock gives ownership, companies issue shares for growth, and returns only come from price changes.",
    feedback: "That misses dividends as a real return type.",
    reviewPrompt: "dividends-vs-price-gain",
  },
  {
    id: "lending",
    label:
      "A stock is mostly a loan to the company, and strong plans should guarantee profit.",
    feedback: "That mixes up ownership with lending and adds a guarantee that does not exist.",
    reviewPrompt: "ownership-basics",
  },
  {
    id: "random",
    label:
      "Prices move randomly, so company news and expectations do not matter much.",
    feedback: "That ignores how expectations can shift after company news.",
    reviewPrompt: "expectations-news",
  },
];

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

function BossStepRail({
  activeStep,
}: {
  activeStep: number;
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
              {complete ? <CheckCircleIcon className="h-3.5 w-3.5" /> : locked ? <LockIcon className="h-3.5 w-3.5" /> : index + 1}
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

function OutcomeTone({
  label,
}: {
  label: string;
}) {
  const tone =
    label === "Gain"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : label === "Loss"
        ? "border-red-200 bg-red-50 text-red-800"
        : label === "Break-even"
          ? "border-slate-200 bg-slate-100 text-slate-700"
          : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${tone}`}>
      {label}
    </span>
  );
}

export function FoundationsBossPractice({
  currentStep,
  onAdvanceToCheck,
  onIncorrect,
  onStepChange,
}: FoundationsBossPracticeProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sequence, setSequence] = useState<string[]>([]);
  const [classified, setClassified] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);
  const shuffledStepOneOptions = useMemo(
    () => stableShuffle(stepOneOptions, "foundations-boss-step-1"),
    [],
  );
  const shuffledStepTwoOptions = useMemo(
    () => stableShuffle(stepTwoOptions, "foundations-boss-step-2"),
    [],
  );

  useEffect(() => {
    setSelectedId(null);
    setSequence([]);
    setClassified({});
    setSuccessMessage(null);
    setSetback(null);
  }, [currentStep]);

  const remainingReturnScenario =
    returnScenarios.find((scenario) => !classified[scenario.id]) ?? null;

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

  function renderOwnershipStep() {
    const selectedOption = stepOneOptions.find((option) => option.id === selectedId) ?? null;

    return (
      <>
        <h2 className="text-2xl font-semibold text-slate-950">Step 1 · Ownership foundation</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          A company issues shares. What does buying those shares most directly give you?
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
                if (selectedOption.id === "ownership") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — lock the ownership idea back in.", 0, selectedOption.reviewPrompt);
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

  function renderCapitalStep() {
    const selectedOption = stepTwoOptions.find((option) => option.id === selectedId) ?? null;

    return (
      <>
        <h2 className="text-2xl font-semibold text-slate-950">Step 2 · Company action</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          A company says it will issue shares to raise money for expansion. Which concept does that connect to first?
        </p>
        <div className="mt-5 space-y-3">
          {shuffledStepTwoOptions.map((option) => (
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
                if (selectedOption.id === "capital") {
                  setSuccessMessage(selectedOption.feedback);
                  return;
                }
                triggerSetback("Not quite — the financing logic needs to lock in first.", 0, selectedOption.reviewPrompt);
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

  function renderReactionStep() {
    const remaining = stableShuffleMixed(
      reactionOrder.filter((item) => !sequence.includes(item)),
      `foundations-boss-step-3-${sequence.length}`,
    );
    const correct =
      sequence.length === reactionOrder.length &&
      sequence.every((item, index) => item === reactionOrder[index]);

    return (
      <>
        <h2 className="text-2xl font-semibold text-slate-950">Step 3 · Cause before reaction</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Build the clean order from company action to market reaction.
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
            {reactionOrder.map((_, index) => (
              <div
                key={index}
                className={`rounded-full px-3 py-2 text-sm ${
                  sequence[index]
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-white text-slate-400"
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
              disabled={sequence.length !== reactionOrder.length}
              onClick={() => {
                if (!correct) {
                  triggerSetback("Not quite — lock the cause-and-reaction order back in.", 1, "expectations-news");
                  return;
                }
                setSuccessMessage("Correct. Company action comes first, expectations shift next, and price may react after that.");
              }}
              type="button"
            >
              {sequence.length === reactionOrder.length ? "Lock order" : "Finish the order first"}
            </button>
          )}
        </div>
      </>
    );
  }

  function renderReturnsStep() {
    const complete = Object.keys(classified).length === returnScenarios.length;

    return (
      <>
        <h2 className="text-2xl font-semibold text-slate-950">Step 4 · Return type</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Classify each outcome cleanly. Price result and dividend are not the same thing.
        </p>
        {remainingReturnScenario ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_26px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-semibold text-slate-900">
                #{returnScenarios.findIndex((scenario) => scenario.id === remainingReturnScenario.id) + 1} · {remainingReturnScenario.label}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {["Gain", "Loss", "Break-even", "Dividend"].map((bucket) => (
                <button
                  key={bucket}
                  className="interactive-choice rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left"
                  onClick={() => {
                    if (bucket !== remainingReturnScenario.target) {
                      triggerSetback("Not quite — re-lock the return logic before moving on.", 2, "gain-loss-basics");
                      return;
                    }
                    setClassified((current) => ({
                      ...current,
                      [remainingReturnScenario.id]: bucket,
                    }));
                  }}
                  type="button"
                >
                  <OutcomeTone label={bucket} />
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {returnScenarios.map((scenario, index) => {
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
                    <OutcomeTone label={result} />
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
              onClick={() => {
                onStepChange(4);
                onAdvanceToCheck();
              }}
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
                  "Correct. You separated gain, loss, break-even, and dividends without mixing them together.",
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
    <div className="rounded-[1.8rem] border border-white/80 bg-white/98 p-7 shadow-[0_22px_44px_rgba(15,23,42,0.06)] md:p-10">
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
          <span className="text-sm font-semibold text-emerald-700">Boss checkpoint</span>
        </div>
        <BossStepRail activeStep={currentStep} />
        {currentStep === 0
          ? renderOwnershipStep()
          : currentStep === 1
            ? renderCapitalStep()
            : currentStep === 2
              ? renderReactionStep()
              : renderReturnsStep()}
      </div>
    </div>
  );
}

export function FoundationsBossCheck({
  onComplete,
  onIncorrect,
  onSetbackToPractice,
}: FoundationsBossCheckProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [setback, setSetback] = useState<SetbackState | null>(null);
  const shuffledSummaryOptions = useMemo(
    () => stableShuffle(summaryOptions, "foundations-boss-step-5"),
    [],
  );

  const selectedOption = useMemo(
    () => summaryOptions.find((option) => option.id === selectedId) ?? null,
    [selectedId],
  );

  return (
    <div className="rounded-[2rem] border border-white/80 bg-white/98 p-8 shadow-[0_24px_48px_rgba(15,23,42,0.07)] md:p-12">
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2">
          <span className="text-sm font-semibold text-purple-700">Boss checkpoint</span>
        </div>
        <BossStepRail activeStep={4} />
        <h2 className="text-2xl font-semibold text-slate-950">Step 5 · Final summary</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Choose the only summary that keeps ownership, capital, expectations, returns, and uncertainty in the right roles.
        </p>
        <div className="mt-5 space-y-3">
          {shuffledSummaryOptions.map((option) => (
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
      </div>
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
              setSuccessMessage("Boss cleared. You connected ownership, capital, expectations, and returns under pressure.");
              return;
            }
            onIncorrect(selectedOption.reviewPrompt);
            setSetback({
              targetStep: 3,
              buttonLabel: "Back to Step 4",
              message: "Not quite — lock the return logic back in before the final summary.",
            });
          }}
          type="button"
        >
          {selectedOption ? "Lock final answer" : "Choose an answer first"}
        </button>
      )}
    </div>
  );
}
