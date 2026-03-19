"use client";

type LessonTooltipProps = {
  accentColor: string;
  completed: boolean;
  estimatedTime: string;
  isBoss: boolean;
  lessonNumber: number;
  lockedNotice?: boolean;
  state: "locked" | "unlocked" | "current" | "completed";
  title: string;
  visible: boolean;
};

export function LessonTooltip({
  accentColor,
  completed,
  estimatedTime,
  isBoss,
  lessonNumber,
  lockedNotice = false,
  state,
  title,
  visible,
}: LessonTooltipProps) {
  return (
    <div
      className={`pointer-events-none absolute left-1/2 top-[-6.5rem] z-20 w-52 -translate-x-1/2 rounded-2xl border bg-white/98 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition-all duration-200 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      }`}
      style={{ borderColor: `${accentColor}28` }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
          style={{ backgroundColor: `${accentColor}14`, color: accentColor }}
        >
          {isBoss ? "Boss" : `Lesson ${lessonNumber}`}
        </span>
        <span className="text-xs font-medium text-slate-500">{estimatedTime}</span>
      </div>
      <p className="text-sm font-semibold leading-snug text-slate-900">{title}</p>
      <p className="mt-1 text-xs text-slate-500">
        {completed
          ? "Completed. Locked in on your path."
          : state === "locked"
            ? lockedNotice
              ? "Unlock the earlier lessons to open this step."
              : "Finish earlier lessons first."
            : state === "current"
              ? "Your next lesson. This is the live target."
              : "Available now. Open when you're ready."}
      </p>
    </div>
  );
}
