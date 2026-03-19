"use client";

import {
  createDemoCourseProgress,
  defaultCourseProgress,
  type CourseProgressRecord,
} from "./course-engine";

const courseProgressStorageKey = "premiumStockCourseMapProgress";
const storageEventName = "premium-stock-course-map-storage";
const noopSubscribe = () => () => undefined;
const emptyProgressSnapshot = defaultCourseProgress;
let hasLoadedProgressSnapshot = false;
let cachedProgressRaw: string | null = null;
let cachedProgressSnapshot: CourseProgressRecord = emptyProgressSnapshot;

function safeParseProgress(raw: string | null) {
  if (!raw) {
    return emptyProgressSnapshot;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CourseProgressRecord>;

    return {
      completedLessonIds: Array.isArray(parsed.completedLessonIds)
        ? [...new Set(parsed.completedLessonIds.filter(Boolean))]
        : [],
      lastOpenedLessonId:
        typeof parsed.lastOpenedLessonId === "string" ? parsed.lastOpenedLessonId : null,
      seededDemo: Boolean(parsed.seededDemo),
    };
  } catch {
    return emptyProgressSnapshot;
  }
}

function syncCourseProgressSnapshot(raw?: string | null) {
  const nextRaw =
    raw === undefined
      ? window.localStorage.getItem(courseProgressStorageKey)
      : raw;

  if (hasLoadedProgressSnapshot && nextRaw === cachedProgressRaw) {
    return cachedProgressSnapshot;
  }

  cachedProgressRaw = nextRaw ?? null;
  cachedProgressSnapshot = safeParseProgress(cachedProgressRaw);
  hasLoadedProgressSnapshot = true;
  return cachedProgressSnapshot;
}

function writeCourseProgressSnapshot(progress: CourseProgressRecord) {
  if (typeof window === "undefined") {
    return emptyProgressSnapshot;
  }

  const normalized = safeParseProgress(JSON.stringify(progress));
  const nextRaw = JSON.stringify(normalized);

  if (hasLoadedProgressSnapshot && nextRaw === cachedProgressRaw) {
    return cachedProgressSnapshot;
  }

  cachedProgressRaw = nextRaw;
  cachedProgressSnapshot = normalized;
  hasLoadedProgressSnapshot = true;
  window.localStorage.setItem(courseProgressStorageKey, nextRaw);
  window.dispatchEvent(new Event(storageEventName));
  return cachedProgressSnapshot;
}

export function getStoredCourseProgress() {
  if (typeof window === "undefined") {
    return emptyProgressSnapshot;
  }

  return syncCourseProgressSnapshot();
}

export function getServerCourseProgressSnapshot() {
  return emptyProgressSnapshot;
}

export function saveStoredCourseProgress(progress: CourseProgressRecord) {
  if (typeof window === "undefined") {
    return emptyProgressSnapshot;
  }

  return writeCourseProgressSnapshot(progress);
}

export function openLesson(lessonId: string) {
  const progress = getStoredCourseProgress();

  if (progress.lastOpenedLessonId === lessonId) {
    return progress;
  }

  return saveStoredCourseProgress({
    ...progress,
    lastOpenedLessonId: lessonId,
  });
}

export function completeLesson(lessonId: string) {
  const progress = getStoredCourseProgress();

  if (progress.completedLessonIds.includes(lessonId)) {
    if (progress.lastOpenedLessonId === lessonId) {
      return progress;
    }

    return saveStoredCourseProgress({
      ...progress,
      lastOpenedLessonId: lessonId,
    });
  }

  const next: CourseProgressRecord = {
    ...progress,
    completedLessonIds: [...progress.completedLessonIds, lessonId],
    lastOpenedLessonId: lessonId,
  };

  return saveStoredCourseProgress(next);
}

export function resetCourseProgress() {
  saveStoredCourseProgress(defaultCourseProgress);
}

export function seedDemoCourseProgress() {
  saveStoredCourseProgress(createDemoCourseProgress());
}

export function subscribeToCourseProgress(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return noopSubscribe();
  }

  const handleStorage = (event: Event) => {
    if (
      event instanceof StorageEvent &&
      event.key &&
      event.key !== courseProgressStorageKey
    ) {
      return;
    }

    syncCourseProgressSnapshot();
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(storageEventName, handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(storageEventName, handleStorage);
  };
}

export function subscribeToProgressHydration() {
  return noopSubscribe();
}
