"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { consumeJourneyIntent, type JourneyIntent } from "../lib/journey-motion";

type JourneySurfaceProps = {
  children: ReactNode;
  className?: string;
  surface:
    | "landing"
    | "onboarding"
    | "map"
    | "lesson"
    | "completion"
    | "certificate";
  tone?: "standard" | "milestone" | "finale";
};

export function JourneySurface({
  children,
  className = "",
  surface,
  tone = "standard",
}: JourneySurfaceProps) {
  const pathname = usePathname();
  const [intent, setIntent] = useState<JourneyIntent>(() => {
    if (typeof window === "undefined") {
      return "forward";
    }

    return consumeJourneyIntent(window.location.pathname)?.intent ?? "forward";
  });
  const [entryKey, setEntryKey] = useState(0);

  useEffect(() => {
    const nextIntent = consumeJourneyIntent(pathname)?.intent;

    if (!nextIntent) {
      return;
    }

    setIntent(nextIntent);
    setEntryKey((value) => value + 1);
  }, [pathname]);

  return (
    <div
      className={`journey-surface journey-surface--${surface} journey-surface--${tone} ${className}`}
      data-intent={intent}
      data-surface={surface}
      data-tone={tone}
    >
      <div className="journey-surface__veil" />
      <div className="journey-surface__content" key={`${pathname}-${entryKey}-${intent}`}>
        {children}
      </div>
    </div>
  );
}
