const roadmapLoginGateTriggerKey = "stoked-roadmap-login-gate-trigger";
const roadmapLoginGateSeenKey = "stoked-roadmap-login-gate-seen";

export function queueRoadmapLoginGate() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(roadmapLoginGateTriggerKey, "1");
}

export function hasRoadmapLoginGateTrigger() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(roadmapLoginGateTriggerKey) === "1";
}

export function clearRoadmapLoginGateTrigger() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(roadmapLoginGateTriggerKey);
}

export function hasSeenRoadmapLoginGate() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(roadmapLoginGateSeenKey) === "1";
}

export function markRoadmapLoginGateSeen() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(roadmapLoginGateSeenKey, "1");
}
