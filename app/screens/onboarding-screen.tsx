"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SparklesIcon } from "../components/icons";
import { setNickname } from "../lib/course-storage";

export function OnboardingScreen() {
  const [nickname, setNicknameDraft] = useState("");
  const router = useRouter();

  function handleContinue() {
    if (!nickname.trim()) {
      return;
    }

    setNickname(nickname.trim());
    router.push("/course");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
            <SparklesIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-4 text-4xl font-semibold text-foreground">
            What should we call you?
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose a nickname to personalize your learning journey
          </p>
        </div>

        <div className="rounded-2xl bg-card p-8 shadow-lg">
          <label className="mb-3 block text-foreground">Your nickname</label>
          <input
            autoFocus
            className="w-full rounded-xl border-2 border-border bg-input-background px-5 py-4 text-lg transition-colors focus:border-primary focus:outline-none"
            maxLength={20}
            onChange={(event) => setNicknameDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleContinue();
              }
            }}
            placeholder="e.g., Alex"
            type="text"
            value={nickname}
          />
          <p className="mt-3 text-sm text-muted-foreground">
            This will appear on your certificate
          </p>

          <button
            className="mt-6 w-full rounded-xl bg-primary px-8 py-4 text-lg text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!nickname.trim()}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

