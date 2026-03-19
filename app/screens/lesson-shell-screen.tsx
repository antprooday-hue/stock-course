"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CourseLesson, CourseModule } from "../data/course-data";
import {
  ArrowLeftIcon,
  ClockIcon,
  LockIcon,
  SparklesIcon,
} from "../components/icons";
import { JourneyLink } from "../components/journey-link";
import { JourneySurface } from "../components/journey-surface";
import { LessonCheckStep } from "../components/lesson-check-step";
import {
  FoundationsBossCheck,
  FoundationsBossPractice,
} from "../components/foundations-boss-checkpoint";
import {
  ChartBasicsBossCheck,
  ChartBasicsBossPractice,
  BreakoutVolumeBossCheck,
  BreakoutVolumeBossPractice,
  BusinessFundamentalsBossCheck,
  BusinessFundamentalsBossPractice,
  EpsPeBossCheck,
  EpsPeBossPractice,
  MarketCapRevenueBossCheck,
  MarketCapRevenueBossPractice,
  FinalMasteryBossCheck,
  FinalMasteryBossPractice,
  PuttingItTogetherBossCheck,
  PuttingItTogetherBossPractice,
  SupportResistanceBossCheck,
  SupportResistanceBossPractice,
  TrendMomentumBossCheck,
  TrendMomentumBossPractice,
} from "../components/module-boss-checkpoints";
import { LessonLearnStep } from "../components/lesson-learn-step";
import { LessonPracticeStep } from "../components/lesson-practice-step";
import { LessonRewardStep } from "../components/lesson-reward-step";
import { ProgressBar } from "../components/progress-bar";
import {
  type DerivedLesson,
  type DerivedModule,
  deriveCourseState,
  getNextLessonRoute,
} from "../lib/course-engine";
import { getLessonExperience } from "../lib/lesson-experience";
import {
  completeLesson,
  getServerCourseProgressSnapshot,
  getStoredCourseProgress,
  openLesson,
  subscribeToCourseProgress,
} from "../lib/course-progress";
import { addReviewPrompt } from "../lib/course-storage";
import { navigateWithJourney } from "../lib/journey-motion";

type LessonShellScreenProps = {
  lesson: CourseLesson;
  module: CourseModule;
};

type PlayerStep = "learn" | "practice" | "check" | "reward";

const stepSequence: PlayerStep[] = ["learn", "practice", "check", "reward"];

export function LessonShellScreen({
  lesson,
  module,
}: LessonShellScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storedProgress = useSyncExternalStore(
    subscribeToCourseProgress,
    getStoredCourseProgress,
    getServerCourseProgressSnapshot,
  );
  const [currentStep, setCurrentStep] = useState<PlayerStep>("learn");
  const [foundationsBossStep, setFoundationsBossStep] = useState(0);
  const [chartBossStep, setChartBossStep] = useState(0);
  const [trendBossStep, setTrendBossStep] = useState(0);
  const [supportBossStep, setSupportBossStep] = useState(0);
  const [breakoutBossStep, setBreakoutBossStep] = useState(0);
  const [businessBossStep, setBusinessBossStep] = useState(0);
  const [marketCapBossStep, setMarketCapBossStep] = useState(0);
  const [epsBossStep, setEpsBossStep] = useState(0);
  const [puttingItTogetherBossStep, setPuttingItTogetherBossStep] = useState(0);
  const [finalMasteryBossStep, setFinalMasteryBossStep] = useState(0);
  const [phaseDirection, setPhaseDirection] = useState<"forward" | "back">("forward");
  const [phaseTransitionKey, setPhaseTransitionKey] = useState(0);
  const previousStepIndexRef = useRef(0);

  const courseState = useMemo(
    () => deriveCourseState(storedProgress),
    [storedProgress],
  );
  const derivedModule = courseState.modules.find(
    (item) => item.id === module.id,
  ) as DerivedModule | undefined;
  const derivedLesson = derivedModule?.lessons.find(
    (item) => item.id === lesson.id,
  ) as DerivedLesson | undefined;
  const experience = useMemo(
    () => getLessonExperience(module, lesson),
    [lesson, module],
  );
  const currentStepIndex = stepSequence.indexOf(currentStep);
  const stepProgress = ((currentStepIndex + 1) / stepSequence.length) * 100;
  const nextModule = courseState.modules.find((item) => item.id === module.id + 1);
  const qaUnlocked = searchParams.get("qa") === "1";
  const isFoundationsBoss = module.id === 1 && lesson.lessonNumber === 10;
  const isChartBasicsBoss = module.id === 2 && lesson.lessonNumber === 10;
  const isTrendBoss = module.id === 3 && lesson.lessonNumber === 10;
  const isSupportBoss = module.id === 4 && lesson.lessonNumber === 10;
  const isBreakoutBoss = module.id === 5 && lesson.lessonNumber === 10;
  const isBusinessBoss = module.id === 6 && lesson.lessonNumber === 10;
  const isMarketCapBoss = module.id === 7 && lesson.lessonNumber === 10;
  const isEpsBoss = module.id === 8 && lesson.lessonNumber === 10;
  const isPuttingItTogetherBoss = module.id === 9 && lesson.lessonNumber === 10;
  const isFinalMasteryBoss = module.id === 10 && lesson.lessonNumber === 10;

  useEffect(() => {
    setCurrentStep("learn");
    setFoundationsBossStep(0);
    setChartBossStep(0);
    setTrendBossStep(0);
    setSupportBossStep(0);
    setBreakoutBossStep(0);
    setBusinessBossStep(0);
    setMarketCapBossStep(0);
    setEpsBossStep(0);
    setPuttingItTogetherBossStep(0);
    setFinalMasteryBossStep(0);
    previousStepIndexRef.current = 0;
  }, [lesson.id]);

  useEffect(() => {
    const previousIndex = previousStepIndexRef.current;

    if (previousIndex === currentStepIndex) {
      return;
    }

    setPhaseDirection(currentStepIndex >= previousIndex ? "forward" : "back");
    setPhaseTransitionKey((value) => value + 1);
    previousStepIndexRef.current = currentStepIndex;
  }, [currentStepIndex]);

  useEffect(() => {
    if (
      derivedLesson &&
      derivedLesson.state !== "locked" &&
      storedProgress.lastOpenedLessonId !== lesson.id
    ) {
      openLesson(lesson.id);
    }
  }, [derivedLesson, lesson.id, storedProgress.lastOpenedLessonId]);

  if (!derivedLesson) {
    return null;
  }

  const lessonStatusLabel = derivedLesson.state === "completed" ? "Completed review" : "Active lesson";

  function renderStep() {
    const stepLesson = derivedLesson;

    if (!stepLesson) {
      return null;
    }

    if (stepLesson.state === "locked" && !qaUnlocked) {
      return (
        <div className="rounded-[1.4rem] border border-slate-200 bg-white px-6 py-8 text-center shadow-[0_16px_34px_rgba(15,23,42,0.06)]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <LockIcon className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            This lesson is still locked.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600">
            Complete every lesson earlier in this module path before entering
            this screen.
          </p>
          <JourneyLink
            className="interactive-cta mt-6 inline-flex rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(22,163,74,0.18)] transition hover:-translate-y-0.5"
            href="/course"
            intent="return"
            prefetch={false}
          >
            Return to course map
          </JourneyLink>
        </div>
      );
    }

    if (currentStep === "learn") {
      return (
        <LessonLearnStep
          content={experience.learn}
          onContinue={() => setCurrentStep("practice")}
        />
      );
    }

    if (currentStep === "practice") {
      if (isFoundationsBoss) {
        return (
          <FoundationsBossPractice
            currentStep={Math.min(foundationsBossStep, 3)}
            onAdvanceToCheck={() => setCurrentStep("check")}
            onIncorrect={addReviewPrompt}
            onStepChange={setFoundationsBossStep}
          />
        );
      }

      if (isChartBasicsBoss) {
        return (
          <ChartBasicsBossPractice
            currentStep={Math.min(chartBossStep, 3)}
            onAdvanceToCheck={() => setCurrentStep("check")}
            onIncorrect={addReviewPrompt}
            onStepChange={setChartBossStep}
          />
        );
      }

      if (isTrendBoss) {
        return (
          <TrendMomentumBossPractice
            currentStep={Math.min(trendBossStep, 3)}
            onAdvanceToCheck={() => setCurrentStep("check")}
            onIncorrect={addReviewPrompt}
            onStepChange={setTrendBossStep}
          />
        );
      }

      if (isSupportBoss) {
        return (
          <SupportResistanceBossPractice
            currentStep={Math.min(supportBossStep, 3)}
            onAdvanceToCheck={() => setCurrentStep("check")}
            onIncorrect={addReviewPrompt}
            onStepChange={setSupportBossStep}
          />
        );
      }

      if (isBreakoutBoss) {
        return (
          <BreakoutVolumeBossPractice
            currentStep={Math.min(breakoutBossStep, 3)}
            onAdvanceToCheck={() => setCurrentStep("check")}
            onIncorrect={addReviewPrompt}
            onStepChange={setBreakoutBossStep}
          />
        );
      }

      if (isBusinessBoss) {
        return (
          <BusinessFundamentalsBossPractice
            currentStep={Math.min(businessBossStep, 3)}
            onAdvanceToCheck={() => setCurrentStep("check")}
            onIncorrect={addReviewPrompt}
            onStepChange={setBusinessBossStep}
          />
        );
      }

      if (isMarketCapBoss) {
        return (
          <MarketCapRevenueBossPractice
            currentStep={Math.min(marketCapBossStep, 3)}
            onAdvanceToCheck={() => setCurrentStep("check")}
            onIncorrect={addReviewPrompt}
            onStepChange={setMarketCapBossStep}
          />
        );
      }

      if (isEpsBoss) {
        return (
          <EpsPeBossPractice
            currentStep={Math.min(epsBossStep, 3)}
            onAdvanceToCheck={() => setCurrentStep("check")}
            onIncorrect={addReviewPrompt}
            onStepChange={setEpsBossStep}
          />
        );
      }

      if (isPuttingItTogetherBoss) {
        return (
          <PuttingItTogetherBossPractice
            currentStep={Math.min(puttingItTogetherBossStep, 3)}
            onAdvanceToCheck={() => setCurrentStep("check")}
            onIncorrect={addReviewPrompt}
            onStepChange={setPuttingItTogetherBossStep}
          />
        );
      }

      if (isFinalMasteryBoss) {
        return (
          <FinalMasteryBossPractice
            currentStep={Math.min(finalMasteryBossStep, 3)}
            onAdvanceToCheck={() => setCurrentStep("check")}
            onIncorrect={addReviewPrompt}
            onStepChange={setFinalMasteryBossStep}
          />
        );
      }

      return (
        <LessonPracticeStep
          content={experience.practice}
          onContinue={() => setCurrentStep("check")}
          onIncorrect={addReviewPrompt}
        />
      );
    }

    if (currentStep === "check") {
      if (isFoundationsBoss) {
        return (
          <FoundationsBossCheck
            onComplete={() => {
              completeLesson(lesson.id);
              setCurrentStep("reward");
            }}
            onIncorrect={addReviewPrompt}
            onSetbackToPractice={(step) => {
              setFoundationsBossStep(step);
              setCurrentStep("practice");
            }}
          />
        );
      }

      if (isChartBasicsBoss) {
        return (
          <ChartBasicsBossCheck
            onComplete={() => {
              completeLesson(lesson.id);
              setCurrentStep("reward");
            }}
            onIncorrect={addReviewPrompt}
            onSetbackToPractice={(step) => {
              setChartBossStep(step);
              setCurrentStep("practice");
            }}
          />
        );
      }

      if (isTrendBoss) {
        return (
          <TrendMomentumBossCheck
            onComplete={() => {
              completeLesson(lesson.id);
              setCurrentStep("reward");
            }}
            onIncorrect={addReviewPrompt}
            onSetbackToPractice={(step) => {
              setTrendBossStep(step);
              setCurrentStep("practice");
            }}
          />
        );
      }

      if (isSupportBoss) {
        return (
          <SupportResistanceBossCheck
            onComplete={() => {
              completeLesson(lesson.id);
              setCurrentStep("reward");
            }}
            onIncorrect={addReviewPrompt}
            onSetbackToPractice={(step) => {
              setSupportBossStep(step);
              setCurrentStep("practice");
            }}
          />
        );
      }

      if (isBreakoutBoss) {
        return (
          <BreakoutVolumeBossCheck
            onComplete={() => {
              completeLesson(lesson.id);
              setCurrentStep("reward");
            }}
            onIncorrect={addReviewPrompt}
            onSetbackToPractice={(step) => {
              setBreakoutBossStep(step);
              setCurrentStep("practice");
            }}
          />
        );
      }

      if (isBusinessBoss) {
        return (
          <BusinessFundamentalsBossCheck
            onComplete={() => {
              completeLesson(lesson.id);
              setCurrentStep("reward");
            }}
            onIncorrect={addReviewPrompt}
            onSetbackToPractice={(step) => {
              setBusinessBossStep(step);
              setCurrentStep("practice");
            }}
          />
        );
      }

      if (isMarketCapBoss) {
        return (
          <MarketCapRevenueBossCheck
            onComplete={() => {
              completeLesson(lesson.id);
              setCurrentStep("reward");
            }}
            onIncorrect={addReviewPrompt}
            onSetbackToPractice={(step) => {
              setMarketCapBossStep(step);
              setCurrentStep("practice");
            }}
          />
        );
      }

      if (isEpsBoss) {
        return (
          <EpsPeBossCheck
            onComplete={() => {
              completeLesson(lesson.id);
              setCurrentStep("reward");
            }}
            onIncorrect={addReviewPrompt}
            onSetbackToPractice={(step) => {
              setEpsBossStep(step);
              setCurrentStep("practice");
            }}
          />
        );
      }

      if (isPuttingItTogetherBoss) {
        return (
          <PuttingItTogetherBossCheck
            onComplete={() => {
              completeLesson(lesson.id);
              setCurrentStep("reward");
            }}
            onIncorrect={addReviewPrompt}
            onSetbackToPractice={(step) => {
              setPuttingItTogetherBossStep(step);
              setCurrentStep("practice");
            }}
          />
        );
      }

      if (isFinalMasteryBoss) {
        return (
          <FinalMasteryBossCheck
            onComplete={() => {
              completeLesson(lesson.id);
              setCurrentStep("reward");
            }}
            onIncorrect={addReviewPrompt}
            onSetbackToPractice={(step) => {
              setFinalMasteryBossStep(step);
              setCurrentStep("practice");
            }}
          />
        );
      }

      return (
        <LessonCheckStep
          content={experience.check}
          onContinue={() => {
            completeLesson(lesson.id);
            setCurrentStep("reward");
          }}
          onIncorrect={addReviewPrompt}
        />
      );
    }

    return (
      <LessonRewardStep
        accentColor={module.accentColor}
        completedLessons={courseState.completedLessons}
        completionLine={experience.rewardLine}
        courseCompletionPercent={courseState.completionPercent}
        isBossLesson={lesson.isBoss}
        lessonTitle={lesson.title}
        masteryTags={experience.masteryTags ?? []}
        moduleCompleted={Boolean(derivedModule?.completed)}
        moduleProgressPercent={derivedModule?.progressPercent ?? 0}
        moduleTitle={module.title}
        moduleProgressLabel={`${derivedModule?.completionCount ?? 0}/10 lessons completed in ${module.title}`}
        nextUnlockTitle={derivedModule?.completed ? nextModule?.title ?? null : null}
        onContinue={() => {
          const latestProgress = getStoredCourseProgress();
          const latestCourseState = deriveCourseState(latestProgress);

          if (latestCourseState.allLessonsCompleted) {
            navigateWithJourney(router, "/completion", "milestone");
            return;
          }

          navigateWithJourney(
            router,
            getNextLessonRoute(latestProgress),
            derivedModule?.completed ? "milestone" : "lesson",
          );
        }}
        rankLabel={courseState.rank}
      />
    );
  }

  return (
    <JourneySurface surface="lesson">
      <div className="min-h-screen bg-[linear-gradient(180deg,#f7f8fb_0%,#f4f7fb_50%,#f7f8fb_100%)] px-8 py-10">
        <div className="mx-auto max-w-6xl">
          <JourneyLink
            className="interactive-cta mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
            href="/course"
            intent="return"
            prefetch={false}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to course map
          </JourneyLink>

          <div
            className="lesson-journey-shell overflow-hidden rounded-[2rem] border border-white/80 bg-white/92 shadow-[0_28px_60px_rgba(15,23,42,0.08)]"
            style={{
              boxShadow: `0 28px 60px ${module.accentColor}12`,
            }}
          >
            <div
              className="course-grid relative overflow-hidden border-b border-slate-200 px-8 py-8"
              style={{
                background: `linear-gradient(135deg, ${module.accentSoft} 0%, #ffffff 46%, ${module.accentSoftAlt} 100%)`,
              }}
            >
              <div className="absolute inset-y-0 right-[-5rem] w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.56)_0%,rgba(255,255,255,0)_72%)]" />
              <div className="relative max-w-3xl">
                  <p
                    className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: module.accentColor }}
                  >
                    Module {module.id} · Lesson {lesson.lessonNumber}
                  </p>
                  <h1 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950">
                    {lesson.title}
                  </h1>
                  <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
                    {experience.objective ?? "Learn it, try it, check it, move on."}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 shadow-[0_10px_20px_rgba(15,23,42,0.05)]">
                      <SparklesIcon className="h-3.5 w-3.5" style={{ color: module.accentColor }} />
                      {lessonStatusLabel}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/82 px-3 py-1.5 text-sm text-slate-600 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                      <ClockIcon className="h-4 w-4" />
                      {lesson.estimatedTime}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/80 bg-white/82 px-3 py-1.5 text-sm text-slate-600 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                      {lesson.xp} XP reward
                    </span>
                  </div>
                </div>
            </div>

            <div className={`lesson-phase-rail border-b border-slate-200 px-8 py-5 ${phaseTransitionKey ? "is-shifting" : ""}`}>
              <div className="mx-auto max-w-3xl">
                <div className="mb-3 flex flex-wrap gap-2">
                  {stepSequence.map((step, index) => {
                    const active = currentStep === step;
                    const complete = index < currentStepIndex;

                    return (
                      <div
                        className={`lesson-step-pill rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${
                          active
                            ? "active text-white"
                            : complete
                              ? "complete bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                        }`}
                        key={step}
                        style={{
                          background:
                            active
                              ? "linear-gradient(135deg,#16a34a 0%,#22c55e 100%)"
                              : undefined,
                        }}
                      >
                        {step}
                      </div>
                    );
                  })}
                </div>
                <div className="lesson-phase-progress">
                  <ProgressBar className="mx-auto h-2.5 bg-slate-200/90" value={stepProgress} />
                </div>
              </div>
            </div>

            <div className="px-8 py-8">
              <div
                className="lesson-stage lesson-phase-stage mx-auto max-w-4xl"
                data-direction={phaseDirection}
                data-phase={currentStep}
                key={`${currentStep}-${phaseTransitionKey}`}
              >
                {renderStep()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </JourneySurface>
  );
}
