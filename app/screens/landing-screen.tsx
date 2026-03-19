"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { HeroAnimation } from "../components/HeroAnimation";

// ─────────────────────────────────────────────────────────────
// Scroll reveal hook — uses IntersectionObserver, no libraries
// ─────────────────────────────────────────────────────────────
function useReveal(ref: React.RefObject<Element | null>, options?: IntersectionObserverInit) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { obs.unobserve(el); } },
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, options]);
}

// ─────────────────────────────────────────────────────────────
// Stats counter — counts up when el enters viewport
// ─────────────────────────────────────────────────────────────
function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Extract numeric part
    const numMatch = value.match(/\d+/);
    if (!numMatch) { el.textContent = value; return; }
    const target = parseInt(numMatch[0], 10);
    const prefix = value.slice(0, numMatch.index);
    const suffix = value.slice((numMatch.index ?? 0) + numMatch[0].length);

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasRun.current) return;
      hasRun.current = true;
      obs.unobserve(el);

      const duration = 1200;
      const start = performance.now();
      function tick(now: number) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        el.textContent = prefix + Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });

    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div style={{ textAlign: "center", padding: "0 2rem" }}>
      <span
        ref={ref}
        style={{
          display: "block",
          fontFamily: "var(--font-dm-serif, 'DM Serif Display', Georgia, serif)",
          fontSize: "clamp(2.4rem, 5vw, 4rem)",
          fontWeight: 400,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        0
      </span>
      <span
        style={{
          display: "block",
          fontFamily: "var(--font-dm-sans, 'DM Sans', system-ui, sans-serif)",
          fontSize: "0.9rem",
          color: "rgba(255,255,255,0.5)",
          marginTop: "0.5rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Module roadmap data
// ─────────────────────────────────────────────────────────────
const MODULES = [
  { n: 1,  name: "Foundations",          unlocked: true  },
  { n: 2,  name: "Chart Basics",         unlocked: false },
  { n: 3,  name: "Trend & Momentum",     unlocked: false },
  { n: 4,  name: "Support & Resistance", unlocked: false },
  { n: 5,  name: "Breakouts & Volume",   unlocked: false },
  { n: 6,  name: "Business Fundamentals",unlocked: false },
  { n: 7,  name: "Market Cap & Revenue", unlocked: false },
  { n: 8,  name: "EPS & P/E Ratios",     unlocked: false },
  { n: 9,  name: "Putting It Together",  unlocked: false },
  { n: 10, name: "Final Mastery",        unlocked: false },
];

// ─────────────────────────────────────────────────────────────
// Main landing screen
// ─────────────────────────────────────────────────────────────
export function LandingScreen() {
  const statsRef   = useRef<HTMLDivElement>(null);
  const howRef     = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);

  // Stagger scroll reveals
  useEffect(() => {
    function setupReveal(
      container: Element | null,
      selector: string,
      staggerMs: number
    ) {
      if (!container) return;
      const items = Array.from(container.querySelectorAll<HTMLElement>(selector));
      items.forEach((el) => {
        el.style.opacity    = "0";
        el.style.transform  = "translateY(20px)";
        el.style.transition = "none";
      });

      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(container);
        items.forEach((el, i) => {
          setTimeout(() => {
            el.style.transition = "opacity 600ms ease-out, transform 600ms ease-out";
            el.style.opacity    = "1";
            el.style.transform  = "translateY(0)";
          }, i * staggerMs);
        });
      }, { threshold: 0.1 });

      obs.observe(container);
      return () => obs.disconnect();
    }

    const cleanups = [
      setupReveal(howRef.current,     ".how-step",    150),
      setupReveal(roadmapRef.current, ".module-item", 80),
    ];

    // CTA fade+scale
    const ctaEl = ctaRef.current;
    if (ctaEl) {
      ctaEl.style.opacity   = "0";
      ctaEl.style.transform = "scale(0.97)";
      ctaEl.style.transition = "none";
      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(ctaEl);
        ctaEl.style.transition = "opacity 700ms ease-out, transform 700ms ease-out";
        ctaEl.style.opacity    = "1";
        ctaEl.style.transform  = "scale(1)";
      }, { threshold: 0.2 });
      obs.observe(ctaEl);
      cleanups.push(() => obs.disconnect());
    }

    return () => cleanups.forEach((c) => c?.());
  }, []);

  return (
    <div style={{ background: "#ffffff", fontFamily: "var(--font-dm-sans, 'DM Sans', system-ui, sans-serif)" }}>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <HeroAnimation />

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <div
        ref={statsRef}
        style={{
          background: "#0f172a",
          padding: "4rem 2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0",
          flexWrap: "wrap",
        }}
      >
        {[
          { value: "100", label: "lessons"   },
          { value: "10",  label: "modules"   },
          { value: "0",   label: "confusion" },
        ].map((stat, i) => (
          <div key={stat.label} style={{ display: "flex", alignItems: "center" }}>
            <StatCounter value={stat.value} label={stat.label} />
            {i < 2 && (
              <div style={{
                width: "1px",
                height: "3rem",
                background: "rgba(255,255,255,0.12)",
                margin: "0 1rem",
              }} />
            )}
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <div
        ref={howRef}
        style={{
          background: "#fafaf8",
          padding: "7rem 2rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font-dm-serif, 'DM Serif Display', Georgia, serif)",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 400,
            color: "#0f172a",
            letterSpacing: "-0.02em",
            textAlign: "center",
            marginBottom: "4rem",
          }}>
            Built different.
          </h2>

          {/* Steps with connecting line */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0",
            position: "relative",
          }}>
            {/* Connecting line */}
            <div style={{
              position: "absolute",
              top: "2rem",
              left: "calc(16.66% + 1rem)",
              right: "calc(16.66% + 1rem)",
              height: "1px",
              background: "#e2e8f0",
              zIndex: 0,
            }} />

            {[
              { n: "01", title: "Learn",    copy: "One concept at a time. No walls of text, no overwhelm." },
              { n: "02", title: "Practice", copy: "Real interactions that build instinct, not multiple-choice spam." },
              { n: "03", title: "Level up",  copy: "Track your progress and earn your knowledge, step by step." },
            ].map((step) => (
              <div
                key={step.n}
                className="how-step"
                style={{ textAlign: "center", padding: "0 2rem", position: "relative", zIndex: 1 }}
              >
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "4rem",
                  height: "4rem",
                  borderRadius: "50%",
                  background: "#ffffff",
                  border: "1px solid #f1f5f9",
                  marginBottom: "1.5rem",
                }}>
                  <span style={{
                    fontFamily: "var(--font-dm-serif, 'DM Serif Display', Georgia, serif)",
                    fontSize: "1.5rem",
                    color: "#22c55e",
                    fontWeight: 400,
                    opacity: 0.7,
                  }}>
                    {step.n}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "var(--font-dm-serif, 'DM Serif Display', Georgia, serif)",
                  fontSize: "1.4rem",
                  fontWeight: 400,
                  color: "#0f172a",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.01em",
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: "0.95rem",
                  color: "#64748b",
                  lineHeight: 1.6,
                  maxWidth: "240px",
                  margin: "0 auto",
                }}>
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── COURSE ROADMAP ───────────────────────────────────── */}
      <div
        ref={roadmapRef}
        style={{
          background: "#ffffff",
          padding: "7rem 2rem",
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font-dm-serif, 'DM Serif Display', Georgia, serif)",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 400,
            color: "#0f172a",
            letterSpacing: "-0.02em",
            textAlign: "center",
            marginBottom: "0.75rem",
          }}>
            10 modules. One clear path.
          </h2>
          <p style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "1rem",
            marginBottom: "3.5rem",
          }}>
            Start at the foundation. Unlock as you grow.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {MODULES.map((mod, i) => (
              <div
                key={mod.n}
                className="module-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  borderRadius: "12px",
                  border: mod.unlocked ? "1px solid #22c55e" : "1px solid #f1f5f9",
                  background: mod.unlocked ? "#f0fdf4" : "#fafaf8",
                  transition: "border-color 200ms",
                  // stagger handled by JS reveal, but set initial for non-JS
                  transitionDelay: `${i * 40}ms`,
                }}
              >
                {/* Number */}
                <span style={{
                  fontFamily: "var(--font-dm-serif, 'DM Serif Display', Georgia, serif)",
                  fontSize: "1.1rem",
                  fontWeight: 400,
                  color: mod.unlocked ? "#22c55e" : "#cbd5e1",
                  minWidth: "2rem",
                }}>
                  {String(mod.n).padStart(2, "0")}
                </span>

                {/* Name */}
                <span style={{
                  flex: 1,
                  fontSize: "0.975rem",
                  fontWeight: mod.unlocked ? 500 : 400,
                  color: mod.unlocked ? "#0f172a" : "#94a3b8",
                }}>
                  {mod.name}
                </span>

                {/* Lock / check icon */}
                {mod.unlocked ? (
                  <span style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#22c55e",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}>
                    Start
                  </span>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#cbd5e1" strokeWidth="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <div
        ref={ctaRef}
        style={{
          background: "#0f172a",
          padding: "8rem 2rem",
          textAlign: "center",
        }}
      >
        <h2 style={{
          fontFamily: "var(--font-dm-serif, 'DM Serif Display', Georgia, serif)",
          fontSize: "clamp(2rem, 4.5vw, 4rem)",
          fontWeight: 400,
          color: "#ffffff",
          letterSpacing: "-0.025em",
          marginBottom: "1rem",
          lineHeight: 1.2,
          maxWidth: "700px",
          margin: "0 auto 1rem",
        }}>
          Ready to actually understand stocks?
        </h2>
        <p style={{
          color: "#86efac",
          fontSize: "1rem",
          marginBottom: "2.5rem",
          fontFamily: "var(--font-dm-sans, 'DM Sans', system-ui, sans-serif)",
        }}>
          Free to start. No account needed.
        </p>
        <Link
          href="/onboarding"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#22c55e",
            color: "#ffffff",
            fontFamily: "var(--font-dm-sans, 'DM Sans', system-ui, sans-serif)",
            fontWeight: 600,
            fontSize: "1.1rem",
            padding: "16px 44px",
            borderRadius: "100px",
            textDecoration: "none",
            boxShadow: "0 4px 32px rgba(34,197,94,0.35)",
            transition: "transform 200ms ease-out, box-shadow 200ms ease-out",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform  = "translateY(-2px)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 40px rgba(34,197,94,0.55)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform  = "translateY(0)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 32px rgba(34,197,94,0.35)";
          }}
        >
          Start Learning Free →
        </Link>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{
        background: "#0a1020",
        padding: "2rem",
        textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <p style={{
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.85rem",
          fontFamily: "var(--font-dm-sans, 'DM Sans', system-ui, sans-serif)",
        }}>
          © 2025 Stoked. Stock learning that actually clicks.
        </p>
      </footer>
    </div>
  );
}
