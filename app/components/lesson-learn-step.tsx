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

        <div className="mb-6 rounded-2xl border border-primary/10 bg-card p-6 shadow-[0_10px_24px_rgba(22,153,76,0.06)]">
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary/80">
            In This Lesson
          </h4>
          <div className="grid gap-3 md:grid-cols-3">
            {content.supportActivities.map((item) => (
              <div
                key={item}
                className="rounded-xl bg-[linear-gradient(180deg,#f7fbf8_0%,#eef6f1_100%)] px-4 py-4 text-sm text-foreground/85"
              >
                {item}
              </div>
            ))}
          </div>
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

        <div className="mb-4 rounded-2xl border border-primary/20 bg-[linear-gradient(180deg,#f0fff5_0%,#eafbf1_100%)] p-6">
          <h4 className="mb-2 font-semibold text-foreground">Try it in the lab</h4>
          <p className="text-sm leading-relaxed text-foreground/80">
            {content.labMoment}
          </p>
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
  type:
    | "ownership"
    | "funding"
    | "returns"
    | "news"
    | "exchange"
    | "marketcap"
    | "timeline"
    | "checklist"
    | "diversification"
    | "sandbox";
}) {
  if (type === "ownership") {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-8">
          <div className="text-center">
            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 text-3xl">
              🏢
            </div>
            <p className="text-sm font-semibold">The Company</p>
            <p className="text-xs text-muted-foreground">split into shares</p>
          </div>
          <div className="text-3xl text-primary">→</div>
          <div className="text-center">
            <div className="mb-3 grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }, (_, index) => (
                <div key={index} className="h-6 w-6 rounded bg-primary/30" />
              ))}
            </div>
            <p className="text-sm font-semibold">Ownership slices</p>
            <p className="text-xs text-muted-foreground">some yours, some others</p>
          </div>
        </div>
      </div>
    );
  }

  if (type === "funding") {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <CardMetric label="Borrow" value="$2M" />
        <CardMetric accent label="Sell Ownership" value="$5M" />
        <CardMetric label="Founder Keeps" value="72%" />
      </div>
    );
  }

  if (type === "returns") {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <CardMetric label="Buy" value="$10" />
        <CardMetric label="Sell" value="$14" />
        <CardMetric accent label="Outcome" value="Gain" />
      </div>
    );
  }

  if (type === "news") {
    return (
      <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl bg-card p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">
            Headline reaction
          </p>
          <div className="space-y-2">
            <div className="rounded-lg bg-accent px-3 py-2 text-sm text-foreground">
              Strong earnings report
            </div>
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-foreground">
              Product recall warning
            </div>
            <div className="rounded-lg bg-secondary px-3 py-2 text-sm text-foreground">
              New product rumor
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-card p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">
            Price pressure
          </p>
          <div className="h-3 rounded-full bg-muted">
            <div className="h-3 w-[68%] rounded-full bg-primary" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            More buyers than sellers can push price up.
          </p>
        </div>
      </div>
    );
  }

  if (type === "exchange") {
    return (
      <div className="grid gap-3 md:grid-cols-4">
        {["Buyer", "Exchange", "Trade", "Seller"].map((item, index) => (
          <div
            key={item}
            className={`rounded-xl p-4 text-center ${
              index === 1 ? "bg-accent text-primary" : "bg-card text-foreground"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Node
            </p>
            <p className="mt-2 text-lg font-semibold">{item}</p>
          </div>
        ))}
      </div>
    );
  }

  if (type === "marketcap") {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <CardMetric label="Share Price" value="$40" />
        <CardMetric label="Shares Out" value="1B" />
        <CardMetric accent label="Market Cap" value="$40B" />
      </div>
    );
  }

  if (type === "timeline") {
    return (
      <div className="rounded-xl bg-card p-5">
        <div className="mb-4 flex items-center justify-between text-sm font-semibold text-foreground">
          <span>Short-term</span>
          <span>Long-term</span>
        </div>
        <div className="relative h-3 rounded-full bg-muted">
          <div className="absolute left-[18%] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-4 border-white bg-primary shadow-md" />
          <div className="absolute left-[76%] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-4 border-white bg-accent-foreground shadow-md" />
        </div>
      </div>
    );
  }

  if (type === "checklist") {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        {[
          "How does it make money?",
          "What risks matter first?",
          "Do I understand the business?",
        ].map((item) => (
          <div key={item} className="rounded-xl bg-card px-4 py-4 text-sm text-foreground">
            {item}
          </div>
        ))}
      </div>
    );
  }

  if (type === "diversification") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-red-50 p-5 text-center">
          <p className="text-sm font-semibold text-red-700">One basket</p>
          <div className="mt-3 flex justify-center gap-1">
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} className="text-2xl">
                🥚
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-accent p-5 text-center">
          <p className="text-sm font-semibold text-primary">Spread out</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} className="text-2xl text-center">
                🥚
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Chart labels</p>
        <span className="rounded-full bg-accent px-3 py-1 text-xs text-primary">
          tap to compare
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {["volatile", "steady", "uptrend", "drop", "recovery"].map((item) => (
          <div key={item} className="rounded-lg bg-secondary px-3 py-3 text-center text-sm text-foreground">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function CardMetric({
  accent = false,
  label,
  value,
}: {
  accent?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className={`rounded-xl p-4 text-center ${accent ? "bg-accent" : "bg-card"}`}>
      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-bold ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
