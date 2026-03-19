"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedNumberProps = {
  className?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  value: number;
};

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

export function AnimatedNumber({
  className,
  decimals = 0,
  prefix = "",
  suffix = "",
  value,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const previousValueRef = useRef(value);

  useEffect(() => {
    const from = previousValueRef.current;
    const to = value;

    if (from === to) {
      setDisplayValue(to);
      return;
    }

    setDirection(to >= from ? "up" : "down");
    setIsAnimating(true);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      previousValueRef.current = to;
      setDisplayValue(to);
      setIsAnimating(false);
      return;
    }

    const duration = Math.min(520, Math.max(200, Math.abs(to - from) * 22));
    const delay = Math.min(56, Math.max(20, Math.abs(to - from) * 2));
    const start = window.performance.now() + delay;
    let frame = 0;
    let settledTimeout = 0;

    const tick = (timestamp: number) => {
      if (timestamp < start) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = easeOutCubic(progress);
      setDisplayValue(from + (to - from) * eased);

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      previousValueRef.current = to;
      setDisplayValue(to);
      settledTimeout = window.setTimeout(() => {
        setIsAnimating(false);
      }, 110);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settledTimeout);
    };
  }, [value]);

  const formattedValue =
    decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toString();

  return (
    <span
      className={className}
      data-animating={isAnimating ? "true" : undefined}
      data-direction={direction}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
