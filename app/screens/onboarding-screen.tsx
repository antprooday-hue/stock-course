"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleAccountButton } from "../components/google-account-button";
import { useAuth } from "../lib/auth-context";
import { syncNicknameForCurrentUser } from "../lib/remote-progress";

// ─── Quiz storage ─────────────────────────────────────────────────────────────
export const QUIZ_KEY = "stoked_quiz";

export type QuizData = {
  nickname: string;
  experienceLevel: string;
  goal: string;
  timeCommitment: string;
  completedAt: string;
};

export function getQuizData(): QuizData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUIZ_KEY);
    return raw ? (JSON.parse(raw) as QuizData) : null;
  } catch {
    return null;
  }
}

function saveQuizData(data: QuizData) {
  if (typeof window !== "undefined") {
    localStorage.setItem(QUIZ_KEY, JSON.stringify(data));
  }
}

// ─── Quiz content ─────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: "experienceLevel",
    question: "What's your experience level with the stock market?",
    options: [
      { id: "beginner", label: "Complete beginner", desc: "Never invested" },
      { id: "some",     label: "Some knowledge",    desc: "Read articles, watched videos" },
      { id: "active",   label: "Active trader",     desc: "I have a brokerage account" },
      { id: "advanced", label: "Advanced",           desc: "I trade regularly" },
    ],
  },
  {
    id: "goal",
    question: "What's your main goal?",
    options: [
      { id: "education", label: "Learn for school / education", desc: "General knowledge" },
      { id: "invest",    label: "Start investing",              desc: "Want to build a portfolio" },
      { id: "improve",   label: "Improve my trading skills",    desc: "Level up my game" },
      { id: "curious",   label: "Just curious / explore",       desc: "See what it's about" },
    ],
  },
  {
    id: "timeCommitment",
    question: "How much time can you dedicate weekly?",
    options: [
      { id: "casual",    label: "5–15 minutes",  desc: "Casual learner" },
      { id: "committed", label: "30–60 minutes", desc: "Committed" },
      { id: "serious",   label: "2+ hours",      desc: "Very serious" },
    ],
  },
] as const;

const GOAL_BADGE: Record<string, string> = {
  education: "📊 Chart Master",
  invest:    "🎓 Foundations Complete",
  improve:   "🚀 Quick Learner",
  curious:   "🔥 7-Day Streak",
};

const EXP_LABEL: Record<string, string> = {
  beginner: "Complete beginner",
  some:     "Growing knowledge",
  active:   "Active trader",
  advanced: "Advanced trader",
};

const GOAL_LABEL: Record<string, string> = {
  education: "Learn for education",
  invest:    "Start investing",
  improve:   "Improve trading skills",
  curious:   "Explore investing",
};

const TIME_LABEL: Record<string, string> = {
  casual:    "5–15 min / week",
  committed: "30–60 min / week",
  serious:   "2+ hours / week",
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const QUIZ_CSS = `
  @keyframes quiz-slide-in  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  @keyframes quiz-slide-out { from{opacity:1;transform:none} to{opacity:0;transform:translateY(-10px)} }
  .quiz-q-enter { animation: quiz-slide-in 240ms ease-out both; }

  @keyframes results-in { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
  .results-enter { animation: results-in 380ms cubic-bezier(0.34,1.1,0.64,1) both; }

  @keyframes stagger-in { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:none} }
  .stagger-1 { animation: stagger-in 320ms 60ms  ease-out both; }
  .stagger-2 { animation: stagger-in 320ms 160ms ease-out both; }
  .stagger-3 { animation: stagger-in 320ms 260ms ease-out both; }

  @keyframes btn-pulse { 0%,100%{box-shadow:0 5px 0 #16a34a} 50%{box-shadow:0 5px 16px rgba(34,197,94,0.5), 0 5px 0 #16a34a} }
  .start-btn-pulse { animation: btn-pulse 1.8s ease-in-out infinite; }

  .quiz-opt {
    display: flex; align-items: center; gap: 14px;
    border: 2px solid #e5e7eb; border-radius: 14px;
    padding: 14px 16px; cursor: pointer; background: #fff;
    transition: border-color 150ms, background 150ms;
    text-align: left; width: 100%;
    font-family: var(--font-dm-sans,'DM Sans',system-ui,sans-serif);
  }
  .quiz-opt:hover { border-color: #86efac; background: #f0fdf4; }
  .quiz-opt.selected { border-color: #22c55e; background: #f0fdf4; }
  .quiz-opt .radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #d1d5db; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: border-color 150ms, background 150ms; }
  .quiz-opt.selected .radio { border-color: #22c55e; background: #22c55e; }
  .quiz-opt.selected .radio::after { content:''; width:8px; height:8px; border-radius:50%; background:#fff; }

  .quiz-bar { transition: width 400ms cubic-bezier(0.4,0,0.2,1); }

  @media(prefers-reduced-motion:reduce) {
    .quiz-q-enter,.results-enter,.stagger-1,.stagger-2,.stagger-3,.start-btn-pulse { animation:none !important; }
  }
`;

// ─── Onboarding screen ────────────────────────────────────────────────────────
type QuizStep = "hidden" | 0 | 1 | 2 | "results";

export function OnboardingScreen() {
  const router = useRouter();
  const { loading: authLoading, signInWithGoogle, user } = useAuth();
  const [nickname, setNicknameDraft] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);
  const [showContinueChoices, setShowContinueChoices] = useState(false);
  const [autoContinuePending, setAutoContinuePending] = useState(false);

  // Quiz state
  const [quizStep, setQuizStep] = useState<QuizStep>("hidden");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState("");
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ready = nickname.trim().length > 0;
  const signedInEmail = user?.email ?? null;
  const signedInName =
    typeof user?.user_metadata?.nickname === "string"
      ? user.user_metadata.nickname
      : typeof user?.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : typeof user?.user_metadata?.name === "string"
          ? user.user_metadata.name
          : null;
  const photoUrl =
    typeof user?.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : typeof user?.user_metadata?.picture === "string"
        ? user.user_metadata.picture
        : null;

  useEffect(() => {
    setNicknameDraft((current) => current || signedInName || "");
  }, [signedInName]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("auth_error");
    const continueMode = params.get("continue");
    if (authError) setAuthErrorMessage(authError);
    if (continueMode === "google") {
      setAutoContinuePending(true);
      setShowContinueChoices(true);
    }
  }, []);

  // Save nickname then check if quiz already done
  const persistNicknameAndContinue = useCallback(() => {
    if (!ready) return;
    import("../lib/course-storage").then(({ setNickname }) => {
      const trimmed = nickname.trim();
      setNickname(trimmed);
      void syncNicknameForCurrentUser(trimmed).catch((error) => {
        console.error("Failed to sync nickname during onboarding", error);
      });

      const alreadyDone = Boolean(getQuizData());
      if (alreadyDone) {
        router.push("/course");
      } else {
        setQuizStep(0);
        setSelected("");
      }
    });
  }, [nickname, ready, router]);

  function handleContinueToCourse() {
    if (!ready) return;
    if (user) { persistNicknameAndContinue(); return; }
    setShowContinueChoices((c) => !c);
  }

  function handleContinueAsGuest() { persistNicknameAndContinue(); }

  const handleContinueWithGoogle = useCallback(async () => {
    if (googleLoading) return;
    if (user) { persistNicknameAndContinue(); return; }
    try {
      setGoogleLoading(true);
      setAuthErrorMessage(null);
      await signInWithGoogle("/onboarding?continue=google");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in with Google.";
      setAuthErrorMessage(message);
      setGoogleLoading(false);
    }
  }, [googleLoading, persistNicknameAndContinue, signInWithGoogle, user]);

  useEffect(() => {
    if (!autoContinuePending || !user || !ready) return;
    setAutoContinuePending(false);
    void handleContinueWithGoogle();
  }, [autoContinuePending, handleContinueWithGoogle, ready, user]);

  async function handleGoogleSignIn() {
    if (googleLoading) return;
    try {
      if (user) { router.push("/profile"); return; }
      setGoogleLoading(true);
      setAuthErrorMessage(null);
      await signInWithGoogle("/profile");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in with Google.";
      setAuthErrorMessage(message);
      setGoogleLoading(false);
    }
  }

  // Quiz navigation
  function handleQuizNext() {
    if (typeof quizStep !== "number") return;
    const q = QUESTIONS[quizStep];
    const value = selected || (q.options[0]?.id ?? "");
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (quizStep < QUESTIONS.length - 1) {
      setSelected("");
      setQuizStep((quizStep + 1) as QuizStep);
    } else {
      // Final question — save and show results
      const quizData: QuizData = {
        nickname: nickname.trim(),
        experienceLevel: newAnswers.experienceLevel ?? "beginner",
        goal:            newAnswers.goal ?? "curious",
        timeCommitment:  newAnswers.timeCommitment ?? "casual",
        completedAt:     new Date().toISOString(),
      };
      saveQuizData(quizData);
      setQuizStep("results");
      autoAdvanceRef.current = setTimeout(() => router.push("/course"), 3200);
    }
  }

  function handleQuizBack() {
    if (typeof quizStep !== "number" || quizStep === 0) return;
    setSelected(answers[QUESTIONS[quizStep - 1].id] ?? "");
    setQuizStep((quizStep - 1) as QuizStep);
  }

  function handleSkip() {
    const quizData: QuizData = {
      nickname:        nickname.trim() || "Learner",
      experienceLevel: "beginner",
      goal:            "curious",
      timeCommitment:  "casual",
      completedAt:     new Date().toISOString(),
    };
    saveQuizData(quizData);
    router.push("/course");
  }

  useEffect(() => () => { if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current); }, []);

  const f = "var(--font-dm-sans,'DM Sans',system-ui,sans-serif)";
  const displayName = nickname.trim() || "Learner";
  const finalAnswers = answers as Partial<Record<string, string>>;

  // ── Render: Quiz or Results ───────────────────────────────────────────────
  if (quizStep !== "hidden") {
    return (
      <div style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: f, display: "flex", flexDirection: "column" }}>
        <style dangerouslySetInnerHTML={{ __html: QUIZ_CSS }} />

        {/* Minimal nav */}
        <header style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "flex-end", gap: 3, textDecoration: "none" }}>
            <span style={{ fontWeight: 900, fontSize: 22, color: "#172b4d", letterSpacing: "-0.5px", lineHeight: 1 }}>stoked</span>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#22c55e", flexShrink: 0, marginBottom: 3 }} />
          </Link>
          <button type="button" onClick={handleSkip} style={{ fontSize: 13, fontWeight: 600, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Skip for now
          </button>
        </header>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ width: "100%", maxWidth: 500 }}>

            {quizStep === "results" ? (
              // ── Results screen ─────────────────────────────────────────
              <div className="results-enter" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>🎯</div>
                <h2 style={{ fontWeight: 900, fontSize: "clamp(22px,4vw,28px)", color: "#172b4d", letterSpacing: "-0.5px", marginBottom: 8, lineHeight: 1.2 }}>
                  Your Personalized Path
                </h2>
                <p style={{ fontSize: 16, color: "#6b7280", marginBottom: 28, lineHeight: 1.6 }}>
                  Hey <strong style={{ color: "#172b4d" }}>{displayName}</strong>! Based on your answers…
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, textAlign: "left" }}>
                  <div className="stagger-1" style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: 16, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>🎓</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "#172b4d", marginBottom: 2 }}>
                        {EXP_LABEL[finalAnswers.experienceLevel ?? ""] ?? "Learner"} → Starting with Foundations
                      </div>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>We&apos;ll build your knowledge from the ground up</div>
                    </div>
                  </div>
                  <div className="stagger-2" style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: 16, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>🎯</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "#172b4d", marginBottom: 2 }}>
                        Goal: {GOAL_LABEL[finalAnswers.goal ?? ""] ?? "Learn basics"} → Unlock {GOAL_BADGE[finalAnswers.goal ?? ""] ?? "🎓 Foundations Complete"}
                      </div>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>Tailored modules will help you reach this goal</div>
                    </div>
                  </div>
                  <div className="stagger-3" style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: 16, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>⏱️</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "#172b4d", marginBottom: 2 }}>
                        Time goal: {TIME_LABEL[finalAnswers.timeCommitment ?? ""] ?? "30–60 min / week"}
                      </div>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>Lessons fit perfectly into your schedule</div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="start-btn-pulse"
                  onClick={() => { if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current); router.push("/course"); }}
                  style={{
                    width: "100%", padding: "18px", fontSize: 16, fontFamily: f,
                    fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em",
                    color: "#fff", background: "#22c55e", boxShadow: "0 5px 0 #16a34a",
                    border: "none", borderRadius: 16, cursor: "pointer",
                  }}
                >
                  Start Learning →
                </button>
                <p style={{ marginTop: 12, fontSize: 12, color: "#9ca3af" }}>Auto-starting in a moment…</p>
              </div>

            ) : (
              // ── Quiz question ──────────────────────────────────────────
              <>
                {/* Header */}
                <div style={{ marginBottom: 28, textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
                    Question {(quizStep as number) + 1} of {QUESTIONS.length}
                  </p>
                  {/* Progress bar */}
                  <div style={{ height: 6, background: "#e5e7eb", borderRadius: 99, overflow: "hidden", marginBottom: 16 }}>
                    <div
                      className="quiz-bar"
                      style={{
                        height: "100%", background: "#22c55e", borderRadius: 99,
                        width: `${(((quizStep as number) + 1) / QUESTIONS.length) * 100}%`,
                      }}
                    />
                  </div>
                  <h2 style={{ fontWeight: 900, fontSize: "clamp(18px,3.5vw,24px)", color: "#172b4d", lineHeight: 1.3, letterSpacing: "-0.3px" }}>
                    {QUESTIONS[quizStep as number].question}
                  </h2>
                  <p style={{ marginTop: 6, fontSize: 14, color: "#9ca3af" }}>
                    Let&apos;s personalize your path, <strong style={{ color: "#172b4d" }}>{displayName}</strong>
                  </p>
                </div>

                {/* Options */}
                <div key={quizStep as number} className="quiz-q-enter" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {QUESTIONS[quizStep as number].options.map((opt) => {
                    const isSelected = (selected || answers[QUESTIONS[quizStep as number].id]) === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`quiz-opt${isSelected ? " selected" : ""}`}
                        onClick={() => setSelected(opt.id)}
                      >
                        <span className="radio" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15, color: "#172b4d" }}>{opt.label}</div>
                          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{opt.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation buttons */}
                <div style={{ display: "flex", gap: 10 }}>
                  {(quizStep as number) > 0 && (
                    <button
                      type="button"
                      onClick={handleQuizBack}
                      style={{
                        flex: "0 0 auto", padding: "14px 20px", borderRadius: 14,
                        border: "2px solid #e5e7eb", background: "#fff", color: "#6b7280",
                        fontFamily: f, fontSize: 14, fontWeight: 700, cursor: "pointer",
                        transition: "border-color 150ms",
                      }}
                    >
                      ← Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleQuizNext}
                    style={{
                      flex: 1, padding: "16px", borderRadius: 14, border: "none",
                      background: "#22c55e", boxShadow: "0 5px 0 #16a34a",
                      color: "#fff", fontFamily: f, fontWeight: 800,
                      fontSize: 15, textTransform: "uppercase", letterSpacing: "0.06em",
                      cursor: "pointer",
                    }}
                    onMouseDown={e => { const el = e.currentTarget; el.style.transform = "translateY(3px)"; el.style.boxShadow = "0 2px 0 #16a34a"; }}
                    onMouseUp={e => { const el = e.currentTarget; el.style.transform = ""; el.style.boxShadow = "0 5px 0 #16a34a"; }}
                  >
                    {(quizStep as number) === QUESTIONS.length - 1 ? "See My Path →" : "Next →"}
                  </button>
                </div>

                <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#9ca3af" }}>
                  <button type="button" onClick={handleSkip} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", textDecoration: "underline", fontSize: 13 }}>
                    Skip for now
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Original nickname form ────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: f, display: "flex", flexDirection: "column" }}>
      <style dangerouslySetInnerHTML={{ __html: QUIZ_CSS }} />

      {/* Nav */}
      <header style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "flex-end", gap: 3, textDecoration: "none" }}>
          <span style={{ fontWeight: 900, fontSize: 22, color: "#172b4d", letterSpacing: "-0.5px", lineHeight: 1 }}>stoked</span>
          <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#22c55e", flexShrink: 0, marginBottom: 3 }} />
        </Link>
        <GoogleAccountButton
          disabled={googleLoading || (authLoading && !user)}
          onClick={handleGoogleSignIn}
          photoUrl={photoUrl}
          signedInHref="/profile"
          signedIn={Boolean(user)}
        />
      </header>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: 480 }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "flex-end", gap: 3, marginBottom: 24, background: "#dcfce7", borderRadius: 24, padding: "16px 24px" }}>
              <span style={{ fontFamily: f, fontWeight: 900, fontSize: 40, color: "#172b4d", letterSpacing: "-1.5px", lineHeight: 1 }}>stoked</span>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", flexShrink: 0, marginBottom: 5, display: "inline-block" }} />
            </div>
            <h1 style={{ fontWeight: 900, fontSize: "clamp(28px,5vw,40px)", color: "#172b4d", letterSpacing: "-0.5px", marginBottom: 12, lineHeight: 1.15 }}>
              What should we call you?
            </h1>
            <p style={{ fontSize: 18, color: "#6b7280", lineHeight: 1.6 }}>
              Choose a nickname to personalize your learning journey
            </p>
          </div>

          {/* Card */}
          <div style={{ background: "#fff", borderRadius: 24, border: "2px solid #e5e7eb", boxShadow: "0 8px 0 #e5e7eb", padding: 32 }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ display: "block", fontWeight: 700, fontSize: 14, color: "#374151", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {signedInEmail ? "Connected account" : "Account"}
              </p>
              {signedInEmail ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#f0fdf4", border: "2px solid #bbf7d0", borderRadius: 999, padding: "6px 12px", marginBottom: 10, color: "#15803d", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
                  Google connected
                </div>
              ) : null}
              <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 8 }}>
                {signedInEmail
                  ? `Signed in as ${signedInEmail}`
                  : "You can continue as a guest, or connect the same Google account from your previous version."}
              </p>
              {authErrorMessage ? (
                <p style={{ fontSize: 13, color: "#dc2626", marginTop: 10 }}>{authErrorMessage}</p>
              ) : null}
            </div>

            <div style={{ height: 1, background: "#e5e7eb", margin: "0 0 20px" }} />

            <label style={{ display: "block", fontWeight: 700, fontSize: 14, color: "#374151", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Your nickname
            </label>
            <input
              autoFocus
              maxLength={20}
              onChange={(e) => setNicknameDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleContinueToCourse(); }}
              placeholder="e.g., Alex"
              type="text"
              value={nickname}
              style={{
                width: "100%", padding: "16px 20px", fontSize: 18, fontFamily: f,
                fontWeight: 600, color: "#172b4d", background: "#fff",
                border: `2px solid ${ready ? "#22c55e" : "#e5e7eb"}`,
                borderRadius: 16, outline: "none", boxSizing: "border-box",
                transition: "border-color 200ms",
              }}
            />
            <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 8, marginBottom: 24 }}>
              This will appear on your certificate{signedInName ? ` and defaults to ${signedInName}` : ""}
            </p>

            <button
              disabled={!ready}
              onClick={handleContinueToCourse}
              type="button"
              style={{
                width: "100%", padding: "16px", fontSize: 16, fontFamily: f,
                fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em",
                color: "#fff", background: ready ? "#22c55e" : "#d1d5db",
                boxShadow: ready ? "0 5px 0 #16a34a" : "0 5px 0 #b0b7c3",
                border: "none", borderRadius: 16, cursor: ready ? "pointer" : "not-allowed",
                transition: "background 200ms, box-shadow 200ms",
              }}
              onMouseDown={(e) => { if (!ready) return; const el = e.currentTarget; el.style.transform = "translateY(3px)"; el.style.boxShadow = "0 2px 0 #16a34a"; }}
              onMouseUp={(e) => { const el = e.currentTarget; el.style.transform = ""; el.style.boxShadow = ready ? "0 5px 0 #16a34a" : "0 5px 0 #b0b7c3"; }}
            >
              Continue to course
            </button>

            {showContinueChoices ? (
              <div style={{ marginTop: 16, display: "grid", gap: 10, background: "#f9fafb", border: "2px solid #e5e7eb", borderRadius: 18, padding: 14 }}>
                <button type="button" onClick={handleContinueAsGuest}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "2px solid #e5e7eb", background: "#ffffff", color: "#172b4d", fontFamily: f, fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer" }}>
                  Continue as guest
                </button>
                <button type="button" onClick={handleContinueWithGoogle} disabled={googleLoading || authLoading}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "none", background: "#22c55e", boxShadow: "0 4px 0 #16a34a", color: "#ffffff", fontFamily: f, fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", cursor: googleLoading || authLoading ? "not-allowed" : "pointer", opacity: googleLoading || authLoading ? 0.7 : 1 }}>
                  {user ? "Continue with connected account" : googleLoading ? "Connecting Google..." : "Continue with Google"}
                </button>
              </div>
            ) : null}
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#9ca3af" }}>
            Already started?{" "}
            <Link href="/course" style={{ color: "#22c55e", fontWeight: 700, textDecoration: "none" }}>Go to your course</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
