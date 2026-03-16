import { learnContent } from "../lib/course-data";
import { AlertCircleIcon, LightbulbIcon } from "./icons";

type LessonLearnStepProps = {
  stepId: string;
  onContinue: () => void;
};

export function LessonLearnStep({
  stepId,
  onContinue,
}: LessonLearnStepProps) {
  const content = learnContent[stepId] ?? learnContent["1-1"];

  return (
    <div className="rounded-3xl bg-card p-8 shadow-lg md:p-12">
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2">
          <span className="text-sm font-semibold text-accent-foreground">
            Learn
          </span>
        </div>
        <h2 className="mb-6 text-3xl font-semibold text-foreground md:text-4xl">
          {content.title}
        </h2>

        <div className="mb-8 rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-accent p-8">
          <VisualAid type={content.visual} />
        </div>

        <div className="mb-6 rounded-2xl bg-secondary p-6">
          <p className="text-lg leading-relaxed text-foreground">
            {content.explanation}
          </p>
        </div>

        <div className="mb-4 rounded-2xl border border-primary/20 bg-accent/50 p-6">
          <div className="flex items-start gap-3">
            <LightbulbIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h4 className="mb-1 font-semibold text-foreground">
                What this means
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80">
                {content.whatThisMeans}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <AlertCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <h4 className="mb-1 font-semibold text-foreground">
                Common mistake
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80">
                {content.commonMistake}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        className="w-full rounded-xl bg-primary px-8 py-4 text-lg text-primary-foreground shadow-md transition-all hover:bg-primary/90"
        onClick={onContinue}
      >
        Continue
      </button>
    </div>
  );
}

function VisualAid({
  type,
}: {
  type: "ownership" | "price" | "chart" | "change";
}) {
  if (type === "ownership") {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-8">
          <div className="text-center">
            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 text-3xl">
              🏢
            </div>
            <p className="text-sm font-semibold">NVIDIA</p>
            <p className="text-xs text-muted-foreground">The Company</p>
          </div>
          <div className="text-3xl text-primary">→</div>
          <div className="text-center">
            <div className="mb-3 grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }, (_, index) => (
                <div
                  key={index}
                  className="h-6 w-6 rounded bg-primary/30"
                />
              ))}
            </div>
            <p className="text-sm font-semibold">2.5B shares</p>
            <p className="text-xs text-muted-foreground">Divided ownership</p>
          </div>
        </div>
      </div>
    );
  }

  if (type === "price") {
    return (
      <div className="text-center">
        <div className="inline-block rounded-xl border-2 border-primary/30 bg-card p-6">
          <p className="mb-2 text-sm text-muted-foreground">NVDA Share Price</p>
          <p className="text-5xl font-bold text-primary">$500.00</p>
          <p className="mt-2 text-sm text-green-600">+$12.50 (+2.56%)</p>
        </div>
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="rounded-xl bg-card p-4">
        <svg className="h-48 w-full" viewBox="0 0 400 200">
          <polyline
            fill="none"
            points="20,150 60,140 100,120 140,130 180,100 220,110 260,80 300,70 340,60 380,50"
            stroke="#16A34A"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <line x1="20" x2="380" y1="180" y2="180" stroke="#E5E7EB" strokeWidth="2" />
          <line x1="20" x2="20" y1="20" y2="180" stroke="#E5E7EB" strokeWidth="2" />
        </svg>
        <div className="mt-2 flex justify-between px-2 text-xs text-muted-foreground">
          <span>Jan</span>
          <span>Mar</span>
          <span>Jun</span>
          <span>Sep</span>
          <span>Dec</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4">
      <div className="rounded-xl border-2 border-green-500 bg-green-50 p-4 text-center">
        <p className="mb-1 text-xs text-muted-foreground">Positive Change</p>
        <p className="text-2xl font-bold text-green-600">+$5.00</p>
        <p className="text-sm text-green-600">+2.5%</p>
      </div>
      <div className="rounded-xl border-2 border-red-500 bg-red-50 p-4 text-center">
        <p className="mb-1 text-xs text-muted-foreground">Negative Change</p>
        <p className="text-2xl font-bold text-red-600">-$3.20</p>
        <p className="text-sm text-red-600">-1.6%</p>
      </div>
    </div>
  );
}

