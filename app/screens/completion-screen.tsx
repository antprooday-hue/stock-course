"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  AwardIcon,
  BrainIcon,
  ClockIcon,
  DownloadIcon,
  ShareIcon,
} from "../components/icons";
import { ScrollReveal } from "../components/scroll-reveal";
import {
  getNickname,
  subscribeToCourseStorage,
  subscribeToHydration,
} from "../lib/course-storage";

export function CompletionScreen() {
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
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowConfetti(false), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleShare() {
    const shareData = {
      title: "Stock Academy Certificate",
      text: `${nickname} completed Beginner Stock Foundations.`,
      url: `${window.location.origin}/certificate`,
    };

    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(shareData.url);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      {showConfetti ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="celebration-burst" />
          {Array.from({ length: 36 }, (_, index) => (
            <span
              key={index}
              className={`confetti-dot ${index % 3 === 0 ? "confetti-rect" : index % 3 === 1 ? "confetti-dot--light" : "confetti-dot--leaf"}`}
              style={
                {
                  left: `${(index / 36) * 100}%`,
                  animationDelay: `${(index % 6) * 120}ms`,
                  animationDuration: `${2600 + (index % 5) * 260}ms`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ) : null}

      <div className="w-full max-w-2xl">
        <div className="completion-card rounded-3xl bg-card p-8 text-center shadow-2xl md:p-12">
          <div className="completion-medal-wrap mx-auto mb-6">
            <div className="completion-medal mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-white">
              <AwardIcon className="h-12 w-12" />
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-semibold text-foreground md:text-5xl">
            Congratulations, {nickname}! 🎉
          </h1>
          <p className="mb-10 text-xl text-muted-foreground">
            You&apos;ve completed the Beginner Stock Foundations course
          </p>

          <ScrollReveal className="mb-10" delayMs={80}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <CompletionStat
                icon={<ClockIcon className="mx-auto mb-2 h-6 w-6 text-primary" />}
                label="Completion time"
                value="74 minutes"
              />
              <CompletionStat
                icon={<BrainIcon className="mx-auto mb-2 h-6 w-6 text-primary" />}
                label="Lessons completed"
                value="10"
              />
              <CompletionStat
                icon={<AwardIcon className="mx-auto mb-2 h-6 w-6 text-primary" />}
                label="Accuracy"
                value="96%"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={130}>
            <div className="mb-8 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-accent to-primary/5 p-8">
              <p className="mb-3 text-sm text-muted-foreground">
                Your achievement
              </p>
              <h3 className="mb-4 text-2xl font-semibold text-foreground">
                Certificate of Completion
              </h3>
              <p className="mb-6 text-muted-foreground">
                This certifies that{" "}
                <span className="font-semibold text-foreground">{nickname}</span>{" "}
                has successfully completed the Beginner Stock Foundations course
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-primary-foreground transition-all hover:bg-primary/90"
                  onClick={() => router.push("/certificate")}
                >
                  <AwardIcon className="h-5 w-5" />
                  View certificate
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 text-secondary-foreground transition-all hover:bg-secondary/80"
                  onClick={() => window.print()}
                >
                  <DownloadIcon className="h-5 w-5" />
                  Download
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 text-secondary-foreground transition-all hover:bg-secondary/80"
                  onClick={handleShare}
                >
                  <ShareIcon className="h-5 w-5" />
                  Share
                </button>
              </div>
            </div>
          </ScrollReveal>

          <button
            className="text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => router.push("/course")}
          >
            ← Back to course overview
          </button>
        </div>
      </div>
    </div>
  );
}

function CompletionStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-accent p-6">
      {icon}
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
