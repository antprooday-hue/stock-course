"use client";

import { usePathname, useRouter } from "next/navigation";
import { courseModules } from "../data/course-data";
import { navigateWithJourney } from "../lib/journey-motion";

export function QaLessonJump() {
  const router = useRouter();
  const pathname = usePathname();
  const selectedRoute = courseModules
    .flatMap((module) => module.lessons)
    .find((lesson) => lesson.route === pathname)?.route ?? "";

  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        QA jump
      </span>
      <select
        className="interactive-cta min-w-[280px] rounded-2xl border border-slate-200 bg-white/94 px-4 py-3 text-sm font-medium text-slate-800 shadow-[0_12px_24px_rgba(15,23,42,0.05)] outline-none transition hover:border-slate-300"
        onChange={(event) => {
          const route = event.target.value;

          if (!route) {
            return;
          }

          navigateWithJourney(router, `${route}?qa=1`, "lesson");
        }}
        value={selectedRoute}
      >
        <option value="">Skip to any lesson</option>
        {courseModules.map((module) => (
          <optgroup key={module.id} label={`Module ${module.id} · ${module.title}`}>
            {module.lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.route}>
                {`L${lesson.lessonNumber} · ${lesson.title}`}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
