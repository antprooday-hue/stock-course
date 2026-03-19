"use client";

import Link from "next/link";
import type { DerivedModule } from "../lib/course-engine";
import { AnimatedNumber } from "./animated-number";
import {
  BarChartIcon,
  BuildingIcon,
  CheckCircleIcon,
  CompassIcon,
  LayersIcon,
  LineChartIcon,
  LockIcon,
  PercentIcon,
  PieChartIcon,
  PuzzleIcon,
  TrophyIcon,
  TrendingUpIcon,
} from "./icons";
import { ProgressBar } from "./progress-bar";

type ModulePreviewCardProps = {
  module: DerivedModule;
  variant: "completed" | "current" | "locked";
};

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

export function ModulePreviewCard({
  module,
  variant,
}: ModulePreviewCardProps) {
  const Icon = moduleIcons[module.icon];
  const isCurrent = variant === "current";
  const isLocked = variant === "locked";

  return (
    <div
      className={`surface-lift rounded-[1.4rem] border p-4 shadow-[0_12px_26px_rgba(15,23,42,0.04)] ${
        isCurrent
          ? "border-primary/15 bg-[linear-gradient(135deg,#ffffff_0%,#f2fff5_100%)]"
          : "border-white/80 bg-white/95"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80"
            style={{
              backgroundColor: isLocked ? "#F8FAFC" : module.accentSoft,
              color: isLocked ? "#94A3B8" : module.accentColor,
            }}
          >
            {isLocked ? <LockIcon className="h-4 w-4" /> : <Icon className="h-5 w-5" />}
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Module {module.id}
            </p>
            <h3 className="text-base font-semibold text-slate-950">{module.title}</h3>
          </div>
        </div>

        {variant === "completed" ? (
          <CheckCircleIcon className="h-5 w-5 text-primary" />
        ) : null}
        {variant === "locked" ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            Locked
          </span>
        ) : null}
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            <AnimatedNumber className="progress-value live" value={module.completionCount} />/10
          </span>
          <AnimatedNumber
            className="progress-value live font-semibold text-slate-900"
            suffix="%"
            value={module.progressPercent}
          />
        </div>
        <ProgressBar value={module.progressPercent} />
      </div>

      {isCurrent ? (
        <Link
          className="interactive-cta mt-4 inline-flex rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(22,163,74,0.22)] transition-all hover:-translate-y-0.5"
          data-success="true"
          href={`#module-${module.slug}`}
          prefetch={false}
        >
          Open active module
        </Link>
      ) : null}
    </div>
  );
}
