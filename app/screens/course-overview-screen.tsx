"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  CheckCircleIcon,
  CircleIcon,
  LockIcon,
  TrendingUpIcon,
} from "../components/icons";
import { ProgressBar } from "../components/progress-bar";
import { ScrollReveal } from "../components/scroll-reveal";
import { SiteHeader } from "../components/site-header";
import { lessonCatalog } from "../lib/course-data";
import {
  defaultProgress,
  getCourseProgress,
  getNickname,
  subscribeToHydration,
  subscribeToCourseStorage,
} from "../lib/course-storage";

export function CourseOverviewScreen() {
  const storedNickname = useSyncExternalStore(
    subscribeToCourseStorage,
    getNickname,
    () => "Learner",
  );
  const storedProgressState = useSyncExternalStore(
    subscribeToCourseStorage,
    getCourseProgress,
    () => defaultProgress,
  );
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const nickname = isHydrated ? storedNickname : "Learner";
  const progressState = isHydrated ? storedProgressState : defaultProgress;

  const completedCount = progressState.completedLessonIds.length;
  const progress = (completedCount / lessonCatalog.length) * 100;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f4fff7_0%,#faf9f6_38%,#f2f7f3_100%)]">
      <SiteHeader nickname={nickname} showProfile={true} />

      <div className="border-b border-border bg-card/90 shadow-[0_12px_40px_rgba(22,163,74,0.06)] backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground md:text-[2rem]">
                Welcome back,{" "}
                <span className="text-gradient-emerald">{nickname}</span>! 👋
              </h2>
              <p className="mt-1 text-muted-foreground">
                Continue your stock learning journey
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-xl border border-primary/15 bg-[linear-gradient(135deg,#f2fff5_0%,#e8fff1_100%)] px-4 py-2 shadow-[0_10px_30px_rgba(22,163,74,0.12)] md:flex">
              <TrendingUpIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">
                {completedCount}/{lessonCatalog.length}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Course progress</span>
              <span className="font-semibold text-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <ProgressBar value={progress} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <h3 className="mb-6 text-lg font-semibold text-slate-900">
          Understanding Stocks with NVIDIA
        </h3>
        <ScrollReveal delayMs={40}>
          <div className="space-y-4">
          {lessonCatalog.map((lesson) => {
            const completed = progressState.completedLessonIds.includes(lesson.id);
            const playable = !lesson.locked;

            return playable ? (
              <Link
                key={lesson.id}
                className="group block rounded-2xl border-2 border-transparent bg-card p-6 text-left shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card/80 hover:shadow-[0_20px_40px_rgba(22,163,74,0.12)]"
                href={`/lesson/${lesson.id}`}
              >
                <LessonRow
                  completed={completed}
                  description={lesson.description}
                  duration={lesson.duration}
                  locked={false}
                  title={lesson.title}
                />
              </Link>
            ) : (
              <div
                key={lesson.id}
                className="cursor-not-allowed rounded-2xl bg-card p-6 text-left opacity-50 shadow-sm"
              >
                <LessonRow
                  completed={false}
                  description={lesson.description}
                  duration={lesson.duration}
                  locked={true}
                  title={lesson.title}
                />
              </div>
            );
          })}
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={100}>
          <div className="mt-10 rounded-2xl border border-primary/20 bg-[linear-gradient(135deg,rgba(22,163,74,0.12)_0%,rgba(236,253,245,0.92)_52%,rgba(255,255,255,0.95)_100%)] p-6 shadow-[0_18px_40px_rgba(22,163,74,0.08)]">
            <h4 className="mb-2 font-semibold text-foreground">
              <span className="text-gradient-emerald">🎯 Your goal</span>
            </h4>
            <p className="text-sm text-muted-foreground">
              Complete all lessons to earn your certificate and gain confidence in
              understanding stocks
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={140}>
          <div className="mt-6 rounded-2xl border border-border bg-card/95 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <div className="mb-2 flex items-center justify-between gap-4">
            <h4 className="font-semibold text-foreground">Review queue</h4>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              {progressState.reviewQueue.length} item
              {progressState.reviewQueue.length === 1 ? "" : "s"}
            </span>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Wrong answers are saved here for lightweight follow-up.
          </p>
          {progressState.reviewQueue.length ? (
            <ul className="space-y-2 text-sm text-foreground">
              {progressState.reviewQueue.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-primary/10 bg-[linear-gradient(180deg,#f8fbf9_0%,#f2f5f3_100%)] px-4 py-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
              No review items yet. Keep going.
            </div>
          )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

function LessonRow({
  completed,
  description,
  duration,
  locked,
  title,
}: {
  completed: boolean;
  description: string;
  duration: string;
  locked: boolean;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="shrink-0 transition-transform group-hover:scale-110">
        {completed ? (
          <CheckCircleIcon className="h-8 w-8 fill-primary text-primary" />
        ) : locked ? (
          <LockIcon className="h-8 w-8 text-muted-foreground" />
        ) : (
          <CircleIcon className="h-8 w-8 text-primary" />
        )}
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-start justify-between">
          <h4 className="font-semibold text-foreground transition-colors group-hover:text-primary">
            {title}
          </h4>
          <span className="ml-4 text-sm text-muted-foreground">{duration}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
