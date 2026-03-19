"use client";

import { AnimatedNumber } from "./animated-number";

type FinalAchievementCardProps = {
  completionPercent: number;
};

export function FinalAchievementCard({
  completionPercent,
}: FinalAchievementCardProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,#f4fff7_0%,#ffffff_45%,#eef9f1_100%)] px-8 py-10 shadow-[0_28px_60px_rgba(15,23,42,0.08)]">
      <div className="course-grid absolute inset-0 opacity-55" />
      <div className="relative flex items-center justify-between gap-8">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            End goal
          </p>
          <h3 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
            Reach lesson 100 and unlock the graduate finish line.
          </h3>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Finish every module to reach the final milestone.
          </p>
        </div>

        <div className="surface-lift min-w-[240px] rounded-[1.8rem] border border-white/80 bg-white/92 p-5 text-center shadow-[0_18px_36px_rgba(15,23,42,0.08)]">
          <div className="reward-badge-glow mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] text-3xl font-semibold text-white shadow-[0_18px_34px_rgba(22,163,74,0.24)]">
            100
          </div>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Course summit
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            <AnimatedNumber
              className="progress-value live"
              suffix="% complete"
              value={completionPercent}
            />
          </p>
        </div>
      </div>
    </section>
  );
}
