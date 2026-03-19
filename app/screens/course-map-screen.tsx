"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { CourseHero } from "../components/course-hero";
import { CourseProgressHeader } from "../components/course-progress-header";
import { FinalAchievementCard } from "../components/final-achievement-card";
import { JourneySurface } from "../components/journey-surface";
import { ModulePreviewCard } from "../components/module-preview-card";
import { ModuleSection } from "../components/module-section";
import { deriveCourseState, getNextLessonRoute } from "../lib/course-engine";
import {
  getServerCourseProgressSnapshot,
  getStoredCourseProgress,
  subscribeToCourseProgress,
} from "../lib/course-progress";
import {
  getNickname,
  subscribeToCourseStorage,
} from "../lib/course-storage";

export function CourseMapScreen() {
  const moduleAnchorRef = useRef<HTMLDivElement | null>(null);
  const nickname = useSyncExternalStore(
    subscribeToCourseStorage,
    getNickname,
    () => "Learner",
  );
  const storedProgress = useSyncExternalStore(
    subscribeToCourseProgress,
    getStoredCourseProgress,
    getServerCourseProgressSnapshot,
  );

  const courseState = useMemo(
    () => deriveCourseState(storedProgress),
    [storedProgress],
  );
  const currentModule = courseState.modules.find(
    (module) => module.id === courseState.currentModuleId,
  );
  const completedModules = courseState.modules.filter(
    (module) => module.id < courseState.currentModuleId,
  );
  const upcomingModules = courseState.modules.filter(
    (module) => module.id > courseState.currentModuleId,
  );
  const resumeHref = useMemo(
    () => getNextLessonRoute(storedProgress),
    [storedProgress],
  );

  useEffect(() => {
    const section = moduleAnchorRef.current;

    if (!section) {
      return;
    }

    const rect = section.getBoundingClientRect();
    const outsideViewport = rect.top < 92 || rect.bottom > window.innerHeight - 28;

    if (!outsideViewport) {
      return;
    }

    const timeout = window.setTimeout(() => {
      section.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 140);

    return () => window.clearTimeout(timeout);
  }, [currentModule?.id]);

  return (
    <JourneySurface surface="map">
      <div className="min-h-screen bg-[linear-gradient(180deg,#f7f8fb_0%,#f3f7fb_42%,#f7f8fb_100%)]">
      <CourseProgressHeader
        completionPercent={courseState.completionPercent}
        completedLessons={courseState.completedLessons}
        currentModuleId={courseState.currentModuleId}
        nickname={nickname}
        rank={courseState.rank}
        resumeHref={resumeHref}
        streak={courseState.streak}
        totalLessons={courseState.totalLessons}
      />

      <div className="mx-auto max-w-[1460px] px-8 pb-24 pt-10">
        <main className="space-y-10">
          <CourseHero
            completionPercent={courseState.completionPercent}
            currentModuleTitle={currentModule?.title ?? "Foundations"}
            nickname={nickname}
            resumeHref={resumeHref}
          />

          {currentModule ? (
            <div
              className="mx-auto max-w-[1320px]"
              id={`module-${currentModule.slug}`}
              ref={moduleAnchorRef}
            >
              <ModuleSection module={currentModule} />
            </div>
          ) : null}

          {upcomingModules.length ? (
            <section className="mx-auto max-w-[1180px] space-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Locked ahead
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                  Next worlds
                </h3>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {upcomingModules.map((module) => (
                  <ModulePreviewCard
                    key={module.id}
                    module={module}
                    variant="locked"
                  />
                ))}
              </div>
            </section>
          ) : null}

          {completedModules.length ? (
            <section className="mx-auto max-w-[1180px] space-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Completed
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                  Finished worlds
                </h3>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {completedModules.map((module) => (
                  <ModulePreviewCard
                    key={module.id}
                    module={module}
                    variant="completed"
                  />
                ))}
              </div>
            </section>
          ) : null}

          <div className="mx-auto max-w-[1180px]">
            <FinalAchievementCard completionPercent={courseState.completionPercent} />
          </div>
        </main>
      </div>
    </div>
    </JourneySurface>
  );
}
