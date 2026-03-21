"use client";

import Image from "next/image";
import { useAnimationFrame } from "framer-motion";
import { useRef } from "react";

// ─── Laptop ────────────────────────────────────────────────────────────────────
// CSS-drawn MacBook-style laptop with stoked logo on screen.
// Deliberately flat/2D so the orbiting icons carry the depth illusion.
function Laptop() {
  return (
    <div
      style={{
        position: "relative",
        filter:
          "drop-shadow(0 28px 48px rgba(0,0,0,0.30)) drop-shadow(0 8px 16px rgba(0,0,0,0.18))",
      }}
    >
      {/* ── Screen panel ─────────────────────────────── */}
      <div
        style={{
          width: 306,
          background: "#0f1d36",
          borderRadius: "14px 14px 0 0",
          padding: "10px 10px 0",
          border: "2.5px solid #1e3a5f",
          borderBottom: "none",
        }}
      >
        {/* Camera dot */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 7 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#1e3558",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
            }}
          />
        </div>

        {/* Screen face — light background so the logo reads cleanly */}
        <div
          style={{
            height: 192,
            background: "linear-gradient(160deg, #f4f8ff 0%, #eef4ff 100%)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Subtle screen sheen */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.55) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />
          {/* Stoked logo */}
          <Image
            src="/hero-icons/stoked-logo.png"
            alt="Stoked"
            width={172}
            height={58}
            style={{ objectFit: "contain", position: "relative", zIndex: 1 }}
            priority
          />
        </div>
      </div>

      {/* ── Hinge strip ──────────────────────────────── */}
      <div
        style={{
          height: 7,
          margin: "0 -3px",
          background: "linear-gradient(to bottom, #162d4a 0%, #0c1c30 100%)",
        }}
      />

      {/* ── Base / keyboard ──────────────────────────── */}
      <div
        style={{
          width: 330,
          marginLeft: -9,
          background: "linear-gradient(175deg, #1e3a5f 0%, #152d4a 100%)",
          borderRadius: "0 0 10px 10px",
          padding: "10px 18px 12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 5,
        }}
      >
        {/* Keyboard rows */}
        {[13, 13, 12].map((count, row) => (
          <div key={row} style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: count }).map((_, col) => (
              <div
                key={col}
                style={{
                  width: 17,
                  height: 8,
                  background: "#1a3356",
                  borderRadius: 2.5,
                  boxShadow: "0 1.5px 0 #0c1c30",
                }}
              />
            ))}
          </div>
        ))}

        {/* Spacebar */}
        <div
          style={{
            width: 110,
            height: 8,
            background: "#1a3356",
            borderRadius: 2.5,
            boxShadow: "0 1.5px 0 #0c1c30",
            marginTop: 1,
          }}
        />

        {/* Trackpad */}
        <div
          style={{
            width: 96,
            height: 44,
            background: "#162d4a",
            border: "1px solid #1e3a5f",
            borderRadius: 6,
            marginTop: 4,
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.35)",
          }}
        />
      </div>

      {/* ── Ground shadow ─────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: -16,
          left: "50%",
          transform: "translateX(-50%)",
          width: 240,
          height: 18,
          background: "radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.22) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

// ─── Icon orbit configuration ─────────────────────────────────────────────────
// Each icon has an independent elliptical orbit around the laptop center.
//
// Depth illusion is driven by sin(angle):
//   sin = -1  →  icon is at TOP of ellipse (far back)  →  small, faint
//   sin = +1  →  icon at BOTTOM (front layer) →  large, full opacity
//
// Tunable values per icon:
//   orbitRx / orbitRy   — shape of ellipse (wider Rx = more horizontal spread)
//   speed               — rad/sec (negative = counter-clockwise)
//   startAngle          — where in the orbit the icon begins
//   scaleFront/Back     — scale at front and back of orbit
//   rotBias             — constant tilt on the icon itself
//   rotWobble           — how much the tilt oscillates over time
//   wobbleSpeed         — frequency of the tilt wobble
interface IconConfig {
  id: string;
  src: string;
  size: number;
  orbitRx: number;
  orbitRy: number;
  speed: number;
  startAngle: number;
  scaleFront: number;
  scaleBack: number;
  rotBias: number;
  rotWobble: number;
  wobbleSpeed: number;
}

const ICONS: IconConfig[] = [
  // Rocket — upper-right accent, prominent, tilted
  {
    id: "rocket",
    src: "/hero-icons/icon_rocket.png",
    size: 92,
    orbitRx: 198,
    orbitRy: 70,
    speed: 0.26,
    startAngle: -0.55,    // upper-right at start
    scaleFront: 1.20,
    scaleBack: 0.56,
    rotBias: -18,
    rotWobble: 10,
    wobbleSpeed: 0.85,
  },
  // Book analysis — upper-left, slightly smaller
  {
    id: "bookAnalysis",
    src: "/hero-icons/icon_book_analysis.png",
    size: 76,
    orbitRx: 172,
    orbitRy: 60,
    speed: -0.21,         // counter-clockwise
    startAngle: 2.55,     // upper-left at start
    scaleFront: 1.10,
    scaleBack: 0.54,
    rotBias: 8,
    rotWobble: 7,
    wobbleSpeed: 1.10,
  },
  // Happy bull — lower-right, front layer, largest presence
  {
    id: "happybull",
    src: "/hero-icons/icon_happybull.png",
    size: 98,
    orbitRx: 184,
    orbitRy: 65,
    speed: 0.19,
    startAngle: 1.15,     // lower-right (front) at start
    scaleFront: 1.26,
    scaleBack: 0.52,
    rotBias: 6,
    rotWobble: 8,
    wobbleSpeed: 0.95,
  },
  // Money bag — lower-left, front layer, medium
  {
    id: "moneyBag",
    src: "/hero-icons/icon_money_bag.png",
    size: 84,
    orbitRx: 160,
    orbitRy: 57,
    speed: -0.23,         // counter-clockwise
    startAngle: 1.85,     // lower-left (front) at start
    scaleFront: 1.16,
    scaleBack: 0.58,
    rotBias: -7,
    rotWobble: 6,
    wobbleSpeed: 1.20,
  },
  // Charging bull — smaller accent, farther back ring, slow
  {
    id: "chargingBull",
    src: "/hero-icons/icon_charging_bull.png",
    size: 64,
    orbitRx: 218,
    orbitRy: 77,
    speed: 0.15,
    startAngle: 3.9,      // starts near back
    scaleFront: 0.94,
    scaleBack: 0.46,
    rotBias: 15,
    rotWobble: 5,
    wobbleSpeed: 0.70,
  },
];

// Laptop sits at z-index 10. Icons in front = 18, icons behind = 4.
const LAPTOP_Z = 10;

// ─── Main component ────────────────────────────────────────────────────────────
export default function HeroVisual() {
  // Direct DOM refs for each icon wrapper — updated every frame without
  // triggering React re-renders.
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Orbit center is at (54%, 55%) of the container — matches the laptop position.
  // On each frame, x/y are computed from the ellipse formula and applied directly
  // to the icon's transform. z-index flips when the icon crosses the front/back
  // threshold (sin(angle) = 0).
  useAnimationFrame((ms) => {
    const t = ms / 1000;

    ICONS.forEach((icon, i) => {
      const el = iconRefs.current[i];
      if (!el) return;

      const angle = icon.startAngle + t * icon.speed;

      // Ellipse position
      const x = Math.cos(angle) * icon.orbitRx;
      const y = Math.sin(angle) * icon.orbitRy;

      // Depth: sin ranges from -1 (top/back) to +1 (bottom/front)
      const sinA = Math.sin(angle);
      const depth = (sinA + 1) / 2; // 0 = back, 1 = front

      // Scale and opacity driven by depth
      const scale = icon.scaleBack + depth * (icon.scaleFront - icon.scaleBack);
      const opacity = 0.48 + depth * 0.52;

      // Icon self-rotation: fixed tilt + gentle wobble over time
      const rotation =
        icon.rotBias + Math.sin(t * icon.wobbleSpeed) * icon.rotWobble;

      // z-index: flip when crossing mid-plane
      const zIndex = sinA > 0 ? LAPTOP_Z + 8 : LAPTOP_Z - 6;

      el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale}) rotate(${rotation}deg)`;
      el.style.opacity = String(opacity);
      el.style.zIndex = String(zIndex);
    });
  });

  return (
    <div
      style={{
        position: "relative",
        width: 580,
        height: 520,
        flexShrink: 0,
        // Prevent icon overflow clipping
        overflow: "visible",
      }}
    >
      {/* ── Laptop anchor — center-right, slightly lower ── */}
      <div
        style={{
          position: "absolute",
          left: "54%",
          top: "55%",
          transform: "translate(-50%, -50%)",
          zIndex: LAPTOP_Z,
        }}
      >
        <Laptop />
      </div>

      {/* ── Orbiting icons ─────────────────────────────── */}
      {ICONS.map((icon, i) => (
        <div
          key={icon.id}
          ref={(el) => {
            iconRefs.current[i] = el;
          }}
          style={{
            position: "absolute",
            left: "54%",
            top: "55%",
            // Initial transform keeps all icons off-screen until first frame
            transform: "translate(-50%, -50%) scale(0.8)",
            willChange: "transform, opacity, z-index",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          <Image
            src={icon.src}
            alt={icon.id}
            width={icon.size}
            height={icon.size}
            style={{ display: "block" }}
            priority={i < 3}
          />
        </div>
      ))}
    </div>
  );
}
