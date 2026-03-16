"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  BrainIcon,
  CheckCircleIcon,
  ClockIcon,
  TrendingUpIcon,
} from "../components/icons";
import { ScrollReveal } from "../components/scroll-reveal";
import { SiteHeader } from "../components/site-header";
import { performanceData } from "../lib/course-data";
import {
  getNickname,
  subscribeToCourseStorage,
  subscribeToHydration,
} from "../lib/course-storage";

export function FinalAnalysisScreen() {
  const router = useRouter();
  const storedNickname = useSyncExternalStore(
    subscribeToCourseStorage,
    getNickname,
    () => "Learner",
  );
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const nickname = isHydrated ? storedNickname : "Learner";

  const overallScore = useMemo(
    () =>
      Math.round(
        performanceData.reduce((acc, item) => acc + item.score, 0) /
          performanceData.length,
      ),
    [],
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader nickname={nickname} showProfile={true} />

      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Your Learning Analysis
          </h2>
          <p className="mt-1 text-muted-foreground">
            See how you performed across the full beginner course, {nickname}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <ScrollReveal>
          <div className="mb-8 rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-accent p-8 text-center md:p-12">
            <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white">
              <TrendingUpIcon className="h-10 w-10" />
            </div>
            <h3 className="mb-2 text-5xl font-bold text-foreground">
              {overallScore}%
            </h3>
            <p className="mb-6 text-xl text-muted-foreground">
              Overall Performance
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-accent px-6 py-3">
              <CheckCircleIcon className="h-5 w-5 fill-primary text-primary" />
              <span className="font-semibold text-foreground">
                Excellent work!
              </span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={80}>
          <div className="mb-8 rounded-2xl bg-card p-8 shadow-lg">
            <h4 className="mb-6 flex items-center gap-2 text-xl font-semibold text-foreground">
              <BrainIcon className="h-6 w-6 text-primary" />
              Concept Breakdown
            </h4>
            <div className="space-y-4">
              {performanceData.map((item) => (
                <div key={item.concept} className="rounded-xl bg-secondary p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h5 className="font-semibold text-foreground">
                      {item.concept}
                    </h5>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {item.score}%
                      </span>
                      {item.score === 100 ? (
                        <CheckCircleIcon className="h-5 w-5 fill-primary text-primary" />
                      ) : null}
                    </div>
                  </div>
                  <div className="mb-2 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-10" delayMs={120}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <StatCard
              icon={<ClockIcon className="h-6 w-6 text-primary" />}
              label="Total Time"
              value="74 min"
            />
            <StatCard
              icon={<BrainIcon className="h-6 w-6 text-primary" />}
              label="Lessons Mastered"
              value="10 lessons"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal className="text-center" delayMs={160}>
          <button
            className="rounded-xl bg-primary px-12 py-4 text-lg text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
            onClick={() => router.push("/completion")}
          >
            View certificate
          </button>
        </ScrollReveal>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}
