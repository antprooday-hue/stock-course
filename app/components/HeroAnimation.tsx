"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

// Word trigger points mapped to animation progress
const WORDS = [
  { id: "w-stock",    text: "Stock",            progress: 0.22, left: "22%", top: "50%" },
  { id: "w-learning", text: "learning",         progress: 0.42, left: "42%", top: "37%" },
  { id: "w-that",     text: "that",             progress: 0.62, left: "62%", top: "26%" },
  { id: "w-clicks",   text: "actually clicks.", progress: 0.85, left: "78%", top: "8%", isClimax: true },
] as const;

// Real stock-chart feel: starts bottom-right (~980,640), ends upper-left (~20,80)
// with authentic rises, dips, and micro-bounces along the way
const PATH =
  "M 980 640" +
  " C 948 618, 922 598, 894 572" +
  " C 866 546, 858 560, 832 534" +
  " C 806 508, 800 488, 773 462" +
  " C 746 436, 736 452, 710 426" +
  " C 684 400, 678 376, 651 350" +
  " C 624 324, 612 342, 586 316" +
  " C 560 290, 553 266, 526 240" +
  " C 499 214, 488 232, 461 208" +
  " C 434 184, 426 158, 399 136" +
  " C 372 114, 358 130, 330 110" +
  " C 302 90, 290 72, 262 62" +
  " C 234 52, 218 64, 190 56" +
  " C 162 48, 144 54, 116 48" +
  " C 88 42, 62 50, 20 80";

// Eased progress → raw progress to get natural cubic ease-in-out
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function HeroAnimation() {
  const pathRef   = useRef<SVGPathElement>(null);
  const dotRef    = useRef<SVGCircleElement>(null);
  const ringRef   = useRef<SVGCircleElement>(null);
  const rippleRef = useRef<SVGCircleElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const totalLength = path.getTotalLength();
    path.style.strokeDasharray  = String(totalLength);
    path.style.strokeDashoffset = String(totalLength);

    const DURATION = 3400;
    let startTime: number | null = null;
    const triggered = new Set<string>();

    function snapWord(word: typeof WORDS[number]) {
      const el = document.getElementById(word.id);
      if (!el) return;
      el.style.transition = "none";
      el.style.opacity    = "1";

      if ("isClimax" in word && word.isClimax) {
        // Scale pulse: 1 → 1.05 → 1
        el.style.transform = "translateX(-50%) scale(1.05)";
        setTimeout(() => {
          el.style.transition = "transform 200ms ease-out";
          el.style.transform  = "translateX(-50%) scale(1)";
        }, 200);

        // SVG ripple from the line's current touch point
        const ripple = rippleRef.current;
        if (ripple) {
          const pt = path.getPointAtLength(totalLength * (1 - word.progress));
          ripple.setAttribute("cx", String(pt.x));
          ripple.setAttribute("cy", String(pt.y));
          ripple.style.opacity = "1";
          ripple.setAttribute("r", "0");
          const rs = performance.now();
          function animRipple(now: number) {
            const p = Math.min((now - rs) / 700, 1);
            ripple.setAttribute("r", String(p * 80));
            ripple.style.opacity = String(1 - p);
            if (p < 1) requestAnimationFrame(animRipple);
          }
          requestAnimationFrame(animRipple);
        }
      }
    }

    function frame(now: number) {
      if (!startTime) startTime = now;
      const raw   = Math.min((now - startTime) / DURATION, 1);
      const eased = easeInOut(raw);

      path.style.strokeDashoffset = String(totalLength * (1 - eased));

      for (const word of WORDS) {
        if (!triggered.has(word.id) && eased >= word.progress) {
          triggered.add(word.id);
          snapWord(word);
        }
      }

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      // Animation complete — show live endpoint elements
      const endpoint = path.getPointAtLength(0); // path ends at index 0 (upper-left)
      const dot  = dotRef.current;
      const ring = ringRef.current;

      if (dot) {
        dot.setAttribute("cx", String(endpoint.x));
        dot.setAttribute("cy", String(endpoint.y));
        dot.style.opacity = "1";
      }

      if (ring) {
        ring.setAttribute("cx", String(endpoint.x));
        ring.setAttribute("cy", String(endpoint.y));
        const rs = performance.now();
        function animRing(now: number) {
          const p = Math.min((now - rs) / 800, 1);
          ring.setAttribute("r", String(6 + p * 14));
          ring.style.opacity = String(0.55 * (1 - p));
          if (p < 1) requestAnimationFrame(animRing);
        }
        requestAnimationFrame(animRing);
      }

      // CTA fades up
      setTimeout(() => {
        const cta = document.getElementById("ha-cta");
        if (cta) {
          cta.style.transition = "opacity 500ms ease-out, transform 500ms ease-out";
          cta.style.opacity    = "1";
          cta.style.transform  = "translateX(-50%) translateY(0)";
        }
      }, 500);
    }

    const t = setTimeout(() => {
      rafRef.current = requestAnimationFrame(frame);
    }, 200);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <style>{`
        .ha-section {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 540px;
          background: #ffffff;
          overflow: hidden;
        }

        /* Subtle green glow at endpoint (upper-left) */
        .ha-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 12% 12%, #f0fdf4 0%, transparent 52%);
          pointer-events: none;
        }

        .ha-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .ha-word {
          position: absolute;
          font-family: var(--font-dm-serif, 'DM Serif Display', Georgia, serif);
          font-size: clamp(2.8rem, 5.5vw, 6.5rem);
          font-weight: 400;
          letter-spacing: -0.025em;
          color: #0f172a;
          white-space: nowrap;
          transform: translateX(-50%);
          line-height: 1.1;
          pointer-events: none;
          user-select: none;
          /* No transition — words snap in instantly */
        }

        #ha-cta {
          position: absolute;
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%) translateY(14px);
          opacity: 0;
        }

        .ha-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #22c55e;
          color: #ffffff;
          font-family: var(--font-dm-sans, 'DM Sans', system-ui, sans-serif);
          font-weight: 600;
          font-size: 1.1rem;
          padding: 16px 40px;
          border-radius: 100px;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 4px 24px rgba(34,197,94,0.35);
          transition: transform 200ms ease-out, box-shadow 200ms ease-out;
        }
        .ha-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 36px rgba(34,197,94,0.55);
        }

        @media (max-width: 640px) {
          #w-clicks { left: 68% !important; }
          .ha-word  { font-size: clamp(1.6rem, 6vw, 3rem); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ha-word         { opacity: 1 !important; }
          #ha-dot,
          #ha-dot-ring,
          #ha-cta          { opacity: 1 !important; transform: translateX(-50%) !important; }
        }
      `}</style>

      <section className="ha-section" role="banner" aria-label="Stock learning that actually clicks.">
        <div className="ha-glow" />

        <svg
          className="ha-svg"
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            ref={pathRef}
            d={PATH}
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Green ripple on "actually clicks." */}
          <circle
            ref={rippleRef}
            r="0"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            style={{ opacity: 0 }}
          />

          {/* Live indicator dot at endpoint */}
          <circle
            ref={dotRef}
            id="ha-dot"
            r="5"
            fill="#22c55e"
            style={{ opacity: 0, transition: "opacity 400ms ease-out" }}
          />

          {/* Pulse ring around dot */}
          <circle
            ref={ringRef}
            id="ha-dot-ring"
            r="6"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            style={{ opacity: 0 }}
          />
        </svg>

        {/* Tagline words — snap into existence as line touches them */}
        {WORDS.map((word) => (
          <div
            key={word.id}
            id={word.id}
            className="ha-word"
            style={{ left: word.left, top: word.top, opacity: 0 }}
          >
            {word.text}
          </div>
        ))}

        {/* CTA — fades up after animation */}
        <div id="ha-cta">
          <Link href="/onboarding" className="ha-cta-btn">
            Start Learning →
          </Link>
        </div>
      </section>
    </>
  );
}
