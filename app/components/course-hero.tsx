"use client";

import { resetCourseProgress } from "../lib/course-progress";
import { AnimatedNumber } from "./animated-number";
import { JourneyLink } from "./journey-link";
import { QaLessonJump } from "./qa-lesson-jump";

type CourseHeroProps = {
  completionPercent: number;
  currentModuleTitle: string;
  nickname: string;
  resumeHref: string;
};

export function CourseHero({
  completionPercent,
  currentModuleTitle,
  nickname,
  resumeHref,
}: CourseHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-[linear-gradient(135deg,#f8fff9_0%,#ffffff_48%,#f4fbf6_100%)] px-7 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
      <div className="course-grid absolute inset-0 opacity-60" />
      <div className="absolute right-[-5rem] top-[-5rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.14)_0%,rgba(34,197,94,0)_72%)]" />
      <div className="absolute bottom-[-6rem] left-[-3rem] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.14)_0%,rgba(16,185,129,0)_70%)]" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Current climb
          </p>
          <h2 className="max-w-2xl text-[2.3rem] font-semibold leading-[1.02] tracking-[-0.05em] text-slate-950 md:text-[2.55rem]">
            {nickname}, keep climbing.
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <span className="rounded-full border border-emerald-100 bg-white/92 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 shadow-[0_10px_24px_rgba(22,163,74,0.08)]">
              {currentModuleTitle}
            </span>
            <span className="text-sm text-slate-600">
              <AnimatedNumber className="progress-value live" suffix="%" value={completionPercent} /> of the course complete
            </span>
          </div>
        </div>

        <div className="flex w-fit flex-col items-start gap-2">
          <QaLessonJump />
          <button
            className="interactive-cta inline-flex items-center rounded-2xl border border-slate-200 bg-white/92 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_12px_24px_rgba(15,23,42,0.05)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
            onClick={resetCourseProgress}
            type="button"
          >
            Restart from lesson 1
          </button>
          <JourneyLink
            className="interactive-cta inline-flex w-fit items-center rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(22,163,74,0.2)] transition-transform duration-200 hover:-translate-y-0.5"
            data-success="true"
            href={resumeHref}
            intent="lesson"
            prefetch={false}
          >
            Enter next lesson
          </JourneyLink>
        </div>
      </div>
    </section>
  );
}
