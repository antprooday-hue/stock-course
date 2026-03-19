"use client";

import { AnimatedNumber } from "./animated-number";
import { CheckCircleIcon, SparklesIcon, TrendingUpIcon } from "./icons";
import { ProgressBar } from "./progress-bar";

type LessonRewardStepProps = {
  accentColor: string;
  completedLessons: number;
  completionLine?: string;
  courseCompletionPercent: number;
  isBossLesson: boolean;
  lessonTitle: string;
  masteryTags: string[];
  moduleCompleted: boolean;
  moduleProgressPercent: number;
  moduleTitle: string;
  moduleProgressLabel: string;
  nextUnlockTitle?: string | null;
  onContinue: () => void;
  rankLabel: string;
};

export function LessonRewardStep({
  accentColor,
  completedLessons,
  completionLine,
  courseCompletionPercent,
  isBossLesson,
  lessonTitle,
  masteryTags,
  moduleCompleted,
  moduleProgressPercent,
  moduleTitle,
  moduleProgressLabel,
  nextUnlockTitle,
  onContinue,
  rankLabel,
}: LessonRewardStepProps) {
  const rewardEyebrow = moduleCompleted
    ? "Module complete"
    : isBossLesson
      ? "Boss cleared"
      : "Reward";
  const rewardTitle = moduleCompleted
    ? `${moduleTitle} is complete.`
    : isBossLesson
      ? `${lessonTitle} cleared.`
      : `${lessonTitle} is complete.`;
  const rewardSupport = moduleCompleted
    ? nextUnlockTitle
      ? `${completionLine ?? "You cleared the module."} ${nextUnlockTitle} is now open.`
      : completionLine ?? "You cleared the final module."
    : completionLine ?? "Nice work. Your path is updated and the next lesson is ready.";

  return (
    <div
      className={`reward-panel-enter reward-surface journey-milestone-panel rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcf9_100%)] p-8 shadow-[0_24px_48px_rgba(15,23,42,0.07)] md:p-12 ${
        moduleCompleted ? "journey-milestone-panel--module" : isBossLesson ? "journey-milestone-panel--boss" : ""
      }`}
      data-milestone={moduleCompleted ? "module" : isBossLesson ? "boss" : "lesson"}
    >
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
        <span className="text-sm font-semibold text-emerald-700">{rewardEyebrow}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {(moduleCompleted || isBossLesson) ? (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white px-3.5 py-2 text-sm font-semibold text-emerald-700 shadow-[0_12px_26px_rgba(22,163,74,0.08)]">
              <SparklesIcon className="h-4 w-4" />
              {moduleCompleted ? "Major milestone reached" : "Checkpoint complete"}
            </div>
          ) : null}
          <div
            className="reward-badge-glow journey-milestone-medal mb-5 flex h-16 w-16 items-center justify-center rounded-[1.4rem] text-white shadow-[0_18px_34px_rgba(15,23,42,0.14)]"
            style={{ backgroundColor: accentColor }}
          >
            <CheckCircleIcon className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            {rewardTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            {rewardSupport}
          </p>
          {masteryTags.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {masteryTags.slice(0, 4).map((tag, index) => (
                <span
                  key={tag}
                  className="reward-chip inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                  {tag.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          ) : null}
          {nextUnlockTitle ? (
            <div className="journey-unlock-card mt-6 rounded-[1.4rem] border border-emerald-200 bg-[linear-gradient(135deg,#ffffff_0%,#f0fff5_100%)] p-4 shadow-[0_16px_30px_rgba(22,163,74,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Next unlock
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{nextUnlockTitle}</p>
              <p className="mt-1 text-sm text-slate-600">
                Your next path is open and ready.
              </p>
            </div>
          ) : null}
        </div>

        <div
          className="reward-progress-card rounded-[1.5rem] border border-slate-200 bg-slate-50/85 p-5"
          data-milestone={moduleCompleted ? "module" : isBossLesson ? "boss" : "lesson"}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Progress update
          </p>
          <div className="mt-4 space-y-4">
            <div className="reward-progress-row" style={{ animationDelay: "70ms" }}>
              <p className="text-xs text-slate-500">Course completion count</p>
              <p className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                <AnimatedNumber className="progress-value live" value={completedLessons} /> lessons
              </p>
            </div>
            <div className="reward-progress-row space-y-2" style={{ animationDelay: "130ms" }}>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Course progress</span>
                <AnimatedNumber
                  className="progress-value live font-semibold text-slate-900"
                  suffix="%"
                  value={courseCompletionPercent}
                />
              </div>
              <ProgressBar className="reward-progress-bar" value={courseCompletionPercent} />
            </div>
            <div className="reward-progress-row space-y-2" style={{ animationDelay: "190ms" }}>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{moduleTitle}</span>
                <AnimatedNumber
                  className="progress-value live font-semibold text-slate-900"
                  suffix="%"
                  value={moduleProgressPercent}
                />
              </div>
              <ProgressBar className="reward-progress-bar" value={moduleProgressPercent} />
            </div>
            <div className="reward-progress-row" style={{ animationDelay: "250ms" }}>
              <p className="text-xs text-slate-500">Module status</p>
              <p className="text-sm font-semibold text-slate-900">{moduleProgressLabel}</p>
            </div>
            <div
              className="reward-progress-row flex items-center gap-2 text-sm font-medium text-slate-700"
              style={{ animationDelay: "310ms" }}
            >
              <TrendingUpIcon className="h-4 w-4 text-emerald-600" />
              {rankLabel}
            </div>
          </div>
        </div>
      </div>

      <button
        className="interactive-cta journey-forward-cta reward-cta mt-8 w-full rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-8 py-4 text-lg font-semibold text-white shadow-[0_18px_34px_rgba(22,163,74,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(22,163,74,0.24)]"
        data-ready="true"
        data-success="true"
        data-win="true"
        data-milestone={moduleCompleted ? "module" : isBossLesson ? "boss" : "lesson"}
        onClick={onContinue}
        type="button"
      >
        {nextUnlockTitle ? "Enter the next module" : "Start next lesson"}
      </button>
    </div>
  );
}
