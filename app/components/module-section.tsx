"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { DerivedLesson, DerivedModule } from "../lib/course-engine";
import {
  BarChartIcon,
  BuildingIcon,
  CircleIcon,
  CompassIcon,
  LayersIcon,
  LineChartIcon,
  PercentIcon,
  PieChartIcon,
  PuzzleIcon,
  TrophyIcon,
  TrendingUpIcon,
} from "./icons";
import { AnimatedNumber } from "./animated-number";
import { LessonNode } from "./lesson-node";
import { ProgressBar } from "./progress-bar";

type ModuleSectionProps = {
  allowFreeJump?: boolean;
  module: DerivedModule;
};

// Stock-chart inspired path: impulse moves up with healthy pullbacks, like a bull market
const lessonPath = [
  { x: 7,  y: 87 },  // Entry point
  { x: 18, y: 71 },  // Strong initial move
  { x: 28, y: 77 },  // Pullback (healthy correction)
  { x: 40, y: 60 },  // Recovery + new high
  { x: 50, y: 65 },  // Consolidation
  { x: 61, y: 46 },  // Breakout
  { x: 72, y: 52 },  // Retest
  { x: 82, y: 32 },  // Strong momentum push
  { x: 90, y: 38 },  // Brief pause near highs
  { x: 96, y: 16 },  // All-time high (boss)
];

const moduleIcons = {
  compass: CompassIcon,
  "line-chart": LineChartIcon,
  "trending-up": TrendingUpIcon,
  layers: LayersIcon,
  "bar-chart": BarChartIcon,
  building: BuildingIcon,
  "pie-chart": PieChartIcon,
  percent: PercentIcon,
  puzzle: PuzzleIcon,
  trophy: TrophyIcon,
};

function buildCurvePath() {
  return lessonPath.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = lessonPath[index - 1];
    const midpointY = (previous.y + point.y) / 2;
    return `${path} C ${previous.x} ${midpointY}, ${point.x} ${midpointY}, ${point.x} ${point.y}`;
  }, "");
}

const pathD = buildCurvePath();

export function ModuleSection({ allowFreeJump = false, module }: ModuleSectionProps) {
  const Icon = moduleIcons[module.icon] ?? CircleIcon;
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isReturnFocused, setIsReturnFocused] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [sequenceKey, setSequenceKey] = useState(0);
  const lessonItems = module.lessons as DerivedLesson[];
  const currentLessonId = useMemo(
    () => lessonItems.find((lesson) => lesson.state === "current")?.id ?? null,
    [lessonItems],
  );
  const previousStateRef = useRef({
    currentLessonId,
    lessonCount: module.completionCount,
    moduleId: module.id,
  });
  const sectionStyle = {
    "--module-color": module.accentColor,
    "--module-soft": module.accentSoft,
    "--module-soft-alt": module.accentSoftAlt,
  } as CSSProperties;
  const gradientId = `module-path-gradient-${module.id}`;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAnimatedProgress(module.progressPercent);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [module.progressPercent, module.id]);

  useEffect(() => {
    setIsReturnFocused(true);

    const timeout = window.setTimeout(() => {
      setIsReturnFocused(false);
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [module.id]);

  useEffect(() => {
    const previous = previousStateRef.current;
    const hasAdvanced =
      module.completionCount > previous.lessonCount ||
      (currentLessonId !== null && previous.currentLessonId !== currentLessonId);

    if (!hasAdvanced) {
      previousStateRef.current = {
        currentLessonId,
        lessonCount: module.completionCount,
        moduleId: module.id,
      };
      return;
    }

    setIsAdvancing(true);
    setIsReturnFocused(true);
    setSequenceKey((value) => value + 1);

    const timeout = window.setTimeout(() => {
      setIsAdvancing(false);
    }, 1680);

    const focusTimeout = window.setTimeout(() => {
      setIsReturnFocused(false);
    }, 2100);

    previousStateRef.current = {
      currentLessonId,
      lessonCount: module.completionCount,
      moduleId: module.id,
    };

    return () => {
      window.clearTimeout(timeout);
      window.clearTimeout(focusTimeout);
    };
  }, [currentLessonId, module.completionCount, module.id]);

  useEffect(() => {
    const storageKey = "stock-course:last-current-module";
    const previousId = window.sessionStorage.getItem(storageKey);

    if (previousId && Number(previousId) !== module.id) {
      setIsUnlocking(true);
      setIsReturnFocused(true);

      const timeout = window.setTimeout(() => {
        setIsUnlocking(false);
      }, 2600);

      const focusTimeout = window.setTimeout(() => {
        setIsReturnFocused(false);
      }, 2800);

      window.sessionStorage.setItem(storageKey, String(module.id));
      return () => {
        window.clearTimeout(timeout);
        window.clearTimeout(focusTimeout);
      };
    }

    window.sessionStorage.setItem(storageKey, String(module.id));
  }, [module.id]);

  return (
    <section className={`relative ${module.locked && !allowFreeJump ? "opacity-70" : ""}`} style={sectionStyle}>
      {/* Open roadmap — no hard box, path flows on the page */}
      <div
        className={`roadmap-shell relative overflow-hidden rounded-[1.5rem] ${
          isReturnFocused ? "roadmap-shell--focus" : ""
        } ${isAdvancing ? "roadmap-shell--advancing" : ""} ${isUnlocking ? "roadmap-shell--unlock" : ""}`}
        data-advancing={isAdvancing}
        data-return-focus={isReturnFocused}
        data-unlocking={isUnlocking}
        style={{ height: 640 }}
      >
        {/* Two atmospheric glow zones: bottom-left origin, top-right summit */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 14% 92%, ${module.accentSoft}50 0%, transparent 44%),
              radial-gradient(ellipse at 86% 6%, ${module.accentSoftAlt}60 0%, transparent 40%)
            `,
          }}
        />
        <div className="course-grid absolute inset-0 opacity-18" />

        {/* Header: module icon + title on left, progress on right */}
        <div className="absolute inset-x-7 top-6 z-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.10)]"
              style={{ color: module.accentColor }}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-[0.18em]"
                style={{ color: module.accentColor }}
              >
                Module {String(module.id).padStart(2, "0")} · Active path
              </p>
              <h2 className="text-xl font-black leading-tight tracking-[-0.03em] text-[#172b4d]">
                {module.title}
              </h2>
            </div>
          </div>

          {/* Progress: right-aligned like a price target */}
          <div className={`roadmap-progress-band w-[200px] flex-shrink-0 ${isAdvancing ? "is-advancing" : ""}`}>
            <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>
                <AnimatedNumber className="progress-value live" value={module.completionCount} />/10 done
              </span>
              <AnimatedNumber
                className="progress-value live font-black text-[#172b4d]"
                suffix="%"
                value={module.progressPercent}
              />
            </div>
            <ProgressBar value={module.progressPercent} />
          </div>
        </div>

        {/* Chart level lines — evoke support / resistance zones */}
        <div
          className="absolute inset-x-6 top-[30%] h-px"
          style={{ background: `linear-gradient(90deg, transparent 0%, ${module.accentColor}28 25%, ${module.accentColor}28 75%, transparent 100%)` }}
        />
        <div
          className="absolute inset-x-6 top-[56%] h-px"
          style={{ background: `linear-gradient(90deg, transparent 0%, ${module.accentColor}22 25%, ${module.accentColor}22 75%, transparent 100%)` }}
        />
        <div
          className="absolute inset-x-6 top-[78%] h-px"
          style={{ background: `linear-gradient(90deg, transparent 0%, ${module.accentColor}16 25%, ${module.accentColor}16 75%, transparent 100%)` }}
        />

        {/* SVG: stock-chart path with impulse moves and pullbacks */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" x2="100%" y1="100%" y2="0%">
              <stop offset="0%" stopColor={module.accentColor} stopOpacity="0.06" />
              <stop offset="55%" stopColor={module.accentColor} stopOpacity="0.22" />
              <stop offset="100%" stopColor={module.accentColor} stopOpacity="0.08" />
            </linearGradient>
          </defs>
          {/* Track: ghost of the full path */}
          <path
            d={pathD}
            fill="none"
            opacity="0.13"
            stroke={module.accentColor}
            strokeLinecap="round"
            strokeWidth="3.2"
            pathLength="100"
          />
          {/* Fine inner track */}
          <path
            d={pathD}
            fill="none"
            opacity="0.20"
            stroke={module.accentColor}
            strokeLinecap="round"
            strokeWidth="0.8"
            pathLength="100"
          />
          {/* Progress line — the completed portion glows */}
          <path
            className="path-progress-line"
            d={pathD}
            fill="none"
            opacity="1"
            pathLength="100"
            stroke={module.accentColor}
            strokeDasharray="100"
            strokeDashoffset={100 - animatedProgress}
            strokeLinecap="round"
            strokeWidth="3.0"
            style={{
              filter: `drop-shadow(0 0 10px ${module.accentColor}88)`,
            }}
          />
          {/* Energy shimmer — animated when advancing */}
          <path
            className={`path-energy-line ${isAdvancing || isReturnFocused || isUnlocking ? "is-active" : ""}`}
            d={pathD}
            fill="none"
            pathLength="100"
            stroke={`url(#${gradientId})`}
            strokeDasharray="10 20"
            strokeDashoffset="0"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>

        {/* Lesson nodes — milestone markers on the chart */}
        {lessonItems.map((lesson, index) => (
          <LessonNode
            allowFreeJump={allowFreeJump}
            key={lesson.id}
            accentColor={module.accentColor}
            estimatedTime={lesson.estimatedTime}
            href={lesson.route}
            isBoss={lesson.isBoss}
            lessonNumber={lesson.lessonNumber}
            position={lessonPath[index]}
            sequenceKey={sequenceKey}
            state={lesson.state}
            title={lesson.title}
          />
        ))}
      </div>
    </section>
  );
}
