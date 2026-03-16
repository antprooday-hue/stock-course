"use client";

import { useEffect, useState } from "react";
import { AwardIcon, TrendingUpIcon } from "./icons";

type MilestoneModalProps = {
  onContinue: () => void;
};

export function MilestoneModal({ onContinue }: MilestoneModalProps) {
  const rank = 1247;
  const newRank = 856;
  const [animatedRank, setAnimatedRank] = useState(rank);

  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const decrement = (rank - newRank) / steps;
    let currentStep = 0;

    const interval = window.setInterval(() => {
      currentStep += 1;

      if (currentStep >= steps) {
        setAnimatedRank(newRank);
        window.clearInterval(interval);
      } else {
        setAnimatedRank(Math.round(rank - decrement * currentStep));
      }
    }, duration / steps);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
      <div className="max-w-md rounded-3xl bg-card p-8 text-center shadow-2xl md:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/60 text-white">
          <AwardIcon className="h-10 w-10" />
        </div>

        <h2 className="mb-3 text-3xl font-semibold text-foreground">
          Lesson Complete! 🎉
        </h2>
        <p className="mb-8 text-muted-foreground">
          You&apos;re making great progress on your learning journey
        </p>

        <div className="mb-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-accent to-primary/5 p-6">
          <div className="mb-3 flex items-center justify-center gap-2">
            <TrendingUpIcon className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Leaderboard Update
            </span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <span className="text-2xl text-muted-foreground line-through">
              #{rank}
            </span>
            <span className="text-3xl">→</span>
            <span className="text-4xl font-bold text-primary">
              #{animatedRank}
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            You moved up {rank - newRank} positions!
          </p>
        </div>

        <button
          className="w-full rounded-xl bg-primary px-8 py-4 text-lg text-primary-foreground shadow-md transition-all hover:bg-primary/90"
          onClick={onContinue}
        >
          Continue learning
        </button>
      </div>
    </div>
  );
}

