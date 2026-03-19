"use client";

import { useMemo, useState } from "react";
import { learnContent, type LearnContent } from "../lib/course-data";
import { AlertCircleIcon, LightbulbIcon } from "./icons";
import { LessonActivity } from "./lesson-activity";

type LegacyLessonLearnStepProps = {
  stepId: string;
  onContinue: () => void;
  content?: never;
};

type ModernLessonLearnStepProps = {
  content: LearnContent;
  onContinue: () => void;
  stepId?: never;
};

type LessonLearnStepProps =
  | LegacyLessonLearnStepProps
  | ModernLessonLearnStepProps;

export function LessonLearnStep(props: LessonLearnStepProps) {
  const content =
    "content" in props
      ? props.content
      : learnContent[props.stepId] ?? learnContent["1-1"];

  const panels = content.panels?.length
    ? content.panels
    : [
        {
          id: "core",
          title: content.title,
          copy: content.explanation,
          eyebrow: "Learn",
          highlights: content.supportActivities,
          noteLabel: "What this means",
          note: content.whatThisMeans,
        },
      ];

  const [panelIndex, setPanelIndex] = useState(0);
  const [readyPanels, setReadyPanels] = useState<Record<string, boolean>>({});
  const panel = panels[Math.min(panelIndex, panels.length - 1)];
  const hasInteractivePanel = Boolean(panel?.activityKind);
  const isPanelReady = readyPanels[panel?.id ?? ""] || !hasInteractivePanel;
  const isLastPanel = panelIndex === panels.length - 1;

  const progressPercent = useMemo(
    () => ((panelIndex + 1) / panels.length) * 100,
    [panelIndex, panels.length],
  );

  function handleAdvance() {
    if (isLastPanel) {
      props.onContinue();
      return;
    }
    setPanelIndex((current) => current + 1);
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcf9_100%)] p-8 shadow-[0_24px_48px_rgba(15,23,42,0.07)] md:p-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
          <span className="text-sm font-semibold text-emerald-700">
            {panel.eyebrow ?? "Learn"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-400">
          <span>
            {panelIndex + 1} / {panels.length}
          </span>
          <div className="flex gap-2">
            {panels.map((item, index) => (
              <span
                key={item.id}
                className={`h-3 w-3 rounded-full transition ${
                  index === panelIndex
                    ? "bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]"
                    : index < panelIndex
                      ? "bg-emerald-200"
                      : "bg-emerald-100"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
          {panel.eyebrow ?? "Learn"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
          {panel.title}
        </h2>
        <p className="mt-4 text-lg leading-8 text-slate-600">{panel.copy}</p>
      </div>

      {panel.activityKind ? (
        <div className="mb-6">
          <LessonActivity
            activityData={panel.activityData}
            activityKind={panel.activityKind}
            activityStartValue={panel.activityStartValue}
            onReadyChange={(ready) =>
              setReadyPanels((current) => ({
                ...current,
                [panel.id]: ready,
              }))
            }
          />
        </div>
      ) : null}

      {panel.highlights?.length ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {panel.highlights.map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}

      {panel.note ? (
        <div className="mb-6 rounded-[1.6rem] border border-emerald-200 bg-emerald-50/70 p-5">
          <div className="flex items-start gap-3">
            <LightbulbIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {panel.noteLabel ?? "What this means"}
              </p>
              <p className="mt-1 text-sm leading-7 text-slate-600">{panel.note}</p>
            </div>
          </div>
        </div>
      ) : null}

      {!content.panels?.length ? (
        <>
          <div className="mb-4 rounded-[1.6rem] border border-emerald-200 bg-emerald-50/70 p-5">
            <div className="flex items-start gap-3">
              <LightbulbIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              <div>
                <p className="text-sm font-semibold text-slate-900">What this means</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">{content.whatThisMeans}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-rose-200 bg-rose-50/70 p-5">
            <div className="flex items-start gap-3">
              <AlertCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Common mistake</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">{content.commonMistake}</p>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <div className="mt-8 flex items-center justify-end">
        <button
          className={`rounded-[1.4rem] px-6 py-4 text-base font-semibold text-white transition ${
            isPanelReady
              ? "bg-[linear-gradient(135deg,#34d399_0%,#22c55e_60%,#16a34a_100%)] shadow-[0_18px_34px_rgba(34,197,94,0.18)]"
              : "bg-slate-300"
          }`}
          disabled={!isPanelReady}
          onClick={handleAdvance}
          type="button"
        >
          {isLastPanel ? "Start practice" : "Next idea"}
        </button>
      </div>
    </div>
  );
}
