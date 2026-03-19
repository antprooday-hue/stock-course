"use client";

export type JourneyIntent =
  | "forward"
  | "threshold"
  | "lesson"
  | "return"
  | "milestone"
  | "certificate";

type JourneyRecord = {
  intent: JourneyIntent;
  target?: string;
  createdAt: number;
};

const journeyKey = "stock-course:journey-motion";

function supportsSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function setJourneyIntent(intent: JourneyIntent, target?: string) {
  if (!supportsSessionStorage()) {
    return;
  }

  const record: JourneyRecord = {
    intent,
    target,
    createdAt: Date.now(),
  };

  window.sessionStorage.setItem(journeyKey, JSON.stringify(record));
}

export function consumeJourneyIntent(pathname?: string) {
  if (!supportsSessionStorage()) {
    return null;
  }

  const raw = window.sessionStorage.getItem(journeyKey);

  if (!raw) {
    return null;
  }

  window.sessionStorage.removeItem(journeyKey);

  try {
    const parsed = JSON.parse(raw) as JourneyRecord;

    if (parsed.target && pathname && parsed.target !== pathname) {
      return null;
    }

    if (Date.now() - parsed.createdAt > 7000) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type RouterLike = {
  push: (href: string) => void;
};

export function navigateWithJourney(
  router: RouterLike,
  href: string,
  intent: JourneyIntent = "forward",
) {
  setJourneyIntent(intent, href);

  if (prefersReducedMotion()) {
    router.push(href);
    return;
  }

  const documentWithTransition = document as Document & {
    startViewTransition?: (callback: () => void) => { finished: Promise<void> };
  };

  if (typeof documentWithTransition.startViewTransition === "function") {
    documentWithTransition.startViewTransition(() => {
      router.push(href);
    });
    return;
  }

  router.push(href);
}
