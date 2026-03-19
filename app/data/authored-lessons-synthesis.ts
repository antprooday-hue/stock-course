import type {
  CheckContent,
  LearnPanel,
  PracticeContent,
  PracticeOption,
} from "../lib/course-data";
import type { AuthoredLessonExperience } from "./authored-lessons";

function choice(
  id: string,
  text: string,
  correct: boolean,
  reviewPrompt: string,
  feedback?: string,
): PracticeOption {
  return { id, text, correct, reviewPrompt, feedback };
}

function panel(
  id: string,
  title: string,
  copy: string,
  config: Omit<LearnPanel, "id" | "title" | "copy"> = {},
): LearnPanel {
  return {
    id,
    title,
    copy,
    ...config,
  };
}

function lesson(
  objective: string,
  rewardLine: string,
  masteryTags: string[],
  learnPanels: LearnPanel[],
  practice: PracticeContent,
  check: CheckContent,
): AuthoredLessonExperience {
  return {
    objective,
    rewardLine,
    masteryTags,
    learn: {
      title: learnPanels[0]?.title ?? "Learn",
      visual: "sandbox",
      explanation: learnPanels[0]?.copy ?? "",
      whatThisMeans: "",
      commonMistake: "",
      labMoment: "",
      supportActivities: [],
      panels: learnPanels,
    },
    practice,
    check,
  };
}

const puttingItTogetherLessons: Record<string, AuthoredLessonExperience> = {
  "putting-it-together-1": lesson(
    "Teach that the chart is the cleanest first observation in a beginner stock read.",
    "You now start the stock read with the chart before reaching for deeper explanation.",
    ["analysis-order", "chart-first"],
    [
      panel(
        "hook",
        "Start with what price is already showing",
        "A chart gives you the first clean observation. It tells you whether price is rising, weak, or stuck before you pile on business context.",
        {
          eyebrow: "Hook",
          activityKind: "sequence-lab",
          activityData: {
            steps: [
              { id: "chart", label: "Chart first", description: "Read trend and structure." },
              { id: "business", label: "Business next", description: "Then add company context." },
              { id: "valuation", label: "Valuation later", description: "Then ask what the numbers imply." },
            ],
            orderedSteps: [
              { id: "first", label: "First" },
              { id: "then", label: "Then" },
              { id: "last", label: "Then" },
            ],
          },
          noteLabel: "Why it matters",
          note: "The chart helps you begin with observation instead of story-telling.",
        },
      ),
      panel(
        "learn",
        "The chart gives you immediate context",
        "Direction and structure show you whether price is strong, weak, or mixed right now.",
        {
          eyebrow: "Learn",
          activityKind: "chart-lab",
          activityData: {
            variant: "trend-clinic",
            chartPoints: [22, 28, 36, 32, 46, 54, 62],
            clues: [
              { title: "Direction", detail: "Mostly rising" },
              { title: "Structure", detail: "Pullbacks still hold higher" },
              { title: "Read", detail: "Start here before the narrative" },
            ],
          },
          noteLabel: "Common mistake",
          note: "Jumping straight into valuation or hype can hide what the chart is already saying.",
        },
      ),
      panel(
        "micro-example",
        "A chart-first read is faster and calmer",
        "You do not need every answer yet. You need the first clean lens first.",
        {
          eyebrow: "Micro example",
          activityKind: "checklist",
          activityData: {
            items: [
              "Read direction",
              "Check structure",
              "Then ask why",
            ],
          },
          highlights: [
            "Chart first.",
            "Explanation second.",
            "Prediction last.",
          ],
        },
      ),
    ],
    {
      mechanicTitle: "First lens practice",
      mechanicSummary: "Put the beginner workflow in order and make sure the chart comes first.",
      prompt: "What should you check first?",
      question: "What should you check first?",
      activityKind: "sequence-lab",
      activityData: {
        steps: [
          { id: "chart", label: "Chart behavior", description: "Trend and structure first." },
          { id: "business", label: "Business context", description: "What the company is doing." },
          { id: "valuation", label: "Valuation clues", description: "Price versus business metrics." },
        ],
        orderedSteps: [
          { id: "slot-1", label: "Step 1" },
          { id: "slot-2", label: "Step 2" },
          { id: "slot-3", label: "Step 3" },
        ],
      },
      supportActivities: ["Observe first.", "Use the chart to orient yourself.", "Only then layer on the rest."],
      options: [
        choice("a", "The chart", true, ""),
        choice("b", "A target price", false, "analysis-order", "That jumps to a conclusion before the first observation."),
        choice("c", "One favorite metric only", false, "analysis-order", "You want the first clean lens, not one isolated number."),
      ],
      explanation: "Correct. The chart is the cleanest first observation in a beginner walkthrough.",
    },
    {
      question: "What should you check first?",
      type: "multiple",
      options: [
        choice("a", "The chart", true, ""),
        choice("b", "A target price", false, "analysis-order", "That skips the observation step."),
        choice("c", "Only one metric", false, "analysis-order", "That is too narrow for a first read."),
        choice("d", "A confident prediction", false, "analysis-order", "Prediction should come after evidence."),
      ],
      explanation: "Start with the chart so your first step is observation, not explanation.",
      reviewPrompt: "analysis-order",
    },
  ),
  "putting-it-together-2": lesson(
    "Teach that business context comes after the chart, not instead of it.",
    "You now separate chart clues from business clues before combining them.",
    ["two-lens-analysis", "business-second"],
    [
      panel(
        "hook",
        "Chart and business clues answer different questions",
        "One lens tells you what price is doing. The other tells you what the company is doing.",
        {
          eyebrow: "Hook",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Chart lens", "Business lens"],
            cards: [
              { id: "trend", label: "Trend direction", target: "Chart lens" },
              { id: "support", label: "Support zone", target: "Chart lens" },
              { id: "growth", label: "Revenue growth", target: "Business lens" },
              { id: "margin", label: "Profit margin", target: "Business lens" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "The second lens should clarify the first one",
        "After the chart tells you what price is doing, business context helps you judge whether the story underneath is strong, weak, or still unclear.",
        {
          eyebrow: "Learn",
          activityKind: "signal-stack",
          activityData: {
            clues: [
              { title: "Chart lens", detail: "Direction and structure" },
              { title: "Business lens", detail: "Growth and profitability" },
              { title: "Combined read", detail: "Better context, not total certainty" },
            ],
          },
          noteLabel: "Common mistake",
          note: "Beginners often let one lens replace the other instead of using both in sequence.",
        },
      ),
      panel(
        "micro-example",
        "Revenue growth belongs to the business lens",
        "The chart cannot answer every business question. The business lens exists for that.",
        {
          eyebrow: "Micro example",
          activityKind: "checklist",
          activityData: {
            items: [
              "What is price doing?",
              "What is the business doing?",
              "What still remains unclear?",
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Two-lens sorter",
      mechanicSummary: "Sort the clues into the chart lens and business lens before making a combined read.",
      prompt: "What does revenue growth belong to?",
      question: "What does revenue growth belong to?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Chart lens", "Business lens"],
        cards: [
          { id: "breakout", label: "Breakout", target: "Chart lens" },
          { id: "cap", label: "Market cap", target: "Business lens" },
          { id: "growth", label: "Revenue growth", target: "Business lens" },
          { id: "trend", label: "Trend", target: "Chart lens" },
        ],
      },
      supportActivities: ["Keep the lenses separate.", "Use the chart first.", "Add business context second."],
      options: [
        choice("a", "The business lens", true, ""),
        choice("b", "The chart lens", false, "two-lens-analysis", "Revenue growth is a business clue, not a chart pattern."),
        choice("c", "Neither lens", false, "two-lens-analysis", "It clearly belongs to the business side."),
      ],
      explanation: "Correct. Revenue growth belongs to the business lens.",
    },
    {
      question: "What does revenue growth belong to?",
      type: "multiple",
      options: [
        choice("a", "The business lens", true, ""),
        choice("b", "The chart lens", false, "two-lens-analysis", "That is the wrong lens."),
        choice("c", "Neither lens", false, "two-lens-analysis", "It is absolutely a business clue."),
        choice("d", "Only the news feed", false, "two-lens-analysis", "The news may mention it, but it is still a business metric."),
      ],
      explanation: "Revenue growth belongs to the business lens after the chart gives you the first read.",
      reviewPrompt: "two-lens-analysis",
    },
  ),
  "putting-it-together-3": lesson(
    "Teach how trend and support work together in one chart read.",
    "You now combine direction with structural support more carefully.",
    ["trend-plus-support", "structure-context"],
    [
      panel(
        "hook",
        "Direction alone is not the full read",
        "A rising chart feels different when price is also reacting near support. The trend tells you the lean. Support tells you where behavior has mattered.",
        {
          eyebrow: "Hook",
          activityKind: "chart-lab",
          activityData: {
            variant: "trend-clinic",
            chartPoints: [20, 28, 36, 32, 44, 40, 52, 60],
            clues: [
              { title: "Trend", detail: "Mostly rising" },
              { title: "Pullback", detail: "Price revisits a lower area" },
              { title: "Question", detail: "Is the lower area still holding?" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "Support adds structure to the trend read",
        "When price keeps reacting above a support zone, the trend read usually looks healthier than a chart that is losing that area.",
        {
          eyebrow: "Learn",
          activityKind: "zone-map",
          activityData: {
            variant: "chart-zones",
            chartPoints: [22, 30, 38, 34, 46, 42, 58, 66],
            candidates: [
              { id: "upper", label: "Too high", top: 26, height: 24 },
              { id: "support", label: "Support zone", top: 88, height: 28 },
              { id: "low", label: "Too low", top: 116, height: 20 },
            ],
          },
          noteLabel: "Common mistake",
          note: "Many beginners name the trend but ignore where price is reacting inside that trend.",
        },
      ),
      panel(
        "micro-example",
        "Healthy trend plus support is a stronger pair",
        "You are not predicting. You are combining two chart clues into one better summary.",
        {
          eyebrow: "Micro example",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Stronger read", "Weaker read"],
            cards: [
              { id: "holds", label: "Uptrend still respects support", target: "Stronger read" },
              { id: "fails", label: "Uptrend loses support", target: "Weaker read" },
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Trend plus support read",
      mechanicSummary: "Read direction and structure together before choosing the better summary.",
      prompt: "What matters most here?",
      question: "What matters most here?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "Trend", detail: "Still mostly rising" },
          { title: "Support", detail: "The zone is still being defended" },
          { title: "Takeaway", detail: "Use both clues together" },
        ],
      },
      supportActivities: ["Name the direction.", "Check the support behavior.", "Choose the combined read."],
      options: [
        choice("a", "The trend and support behavior together", true, ""),
        choice("b", "One candle only", false, "trend-plus-support", "That ignores the bigger structural read."),
        choice("c", "A guaranteed bounce", false, "trend-plus-support", "Support does not guarantee the next move."),
      ],
      explanation: "Correct. The stronger read combines the trend with the support behavior.",
    },
    {
      question: "What matters most here?",
      type: "multiple",
      options: [
        choice("a", "The trend and support behavior together", true, ""),
        choice("b", "One candle only", false, "trend-plus-support", "That is too narrow."),
        choice("c", "A guaranteed bounce", false, "trend-plus-support", "That overstates what support can do."),
        choice("d", "Ignoring structure entirely", false, "trend-plus-support", "Structure is part of the lesson."),
      ],
      explanation: "Trend and support work best when you read them together.",
      reviewPrompt: "trend-plus-support",
    },
  ),
  "putting-it-together-4": lesson(
    "Teach how breakout and volume work together in one event read.",
    "You now compare event quality using both the breakout and the participation behind it.",
    ["breakout-volume-combo", "event-quality"],
    [
      panel(
        "hook",
        "A breakout gets better when participation confirms it",
        "Price clearing a level matters more when volume also shows broader participation.",
        {
          eyebrow: "Hook",
          activityKind: "chart-lab",
          activityData: {
            variant: "breakout-volume",
            pricePoints: [18, 24, 28, 32, 38, 60, 72],
            volumeBars: [12, 14, 16, 18, 20, 44, 50],
            breakoutIndex: 5,
            level: 50,
          },
        },
      ),
      panel(
        "learn",
        "Volume helps you judge the event quality",
        "The breakout is the event. Volume helps you see whether more traders showed up for it.",
        {
          eyebrow: "Learn",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Helpful clue", "Not enough alone"],
            cards: [
              { id: "break", label: "Clear level break", target: "Helpful clue" },
              { id: "volume", label: "Louder participation", target: "Helpful clue" },
              { id: "guarantee", label: "Guaranteed success", target: "Not enough alone" },
            ],
          },
          noteLabel: "Common mistake",
          note: "Volume can strengthen the read, but it never removes uncertainty.",
        },
      ),
      panel(
        "micro-example",
        "Strong event quality still needs a careful summary",
        "The better summary ranks the move without pretending it is risk-free.",
        {
          eyebrow: "Micro example",
          activityKind: "signal-stack",
          activityData: {
            clues: [
              { title: "Event", detail: "Level cleared" },
              { title: "Participation", detail: "Volume rose" },
              { title: "Careful read", detail: "Stronger, not certain" },
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Breakout quality read",
      mechanicSummary: "Use the breakout and the volume clue together before choosing the stronger read.",
      prompt: "Which breakout seems stronger?",
      question: "Which breakout seems stronger?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "Breakout", detail: "Price moved through the level" },
          { title: "Volume", detail: "Participation increased" },
          { title: "Conclusion", detail: "Stronger but not guaranteed" },
        ],
      },
      supportActivities: ["Find the event.", "Judge the participation.", "Stay careful."],
      options: [
        choice("a", "The breakout with stronger volume support", true, ""),
        choice("b", "Any breakout is identical", false, "breakout-volume-combo", "This lesson is about quality differences."),
        choice("c", "The breakout automatically succeeds", false, "breakout-volume-combo", "A stronger read is still not a guarantee."),
      ],
      explanation: "Correct. The breakout with stronger volume support looks stronger.",
    },
    {
      question: "Which breakout seems stronger?",
      type: "multiple",
      options: [
        choice("a", "The breakout with stronger volume support", true, ""),
        choice("b", "Any breakout is identical", false, "breakout-volume-combo", "Some breakouts clearly stack better evidence."),
        choice("c", "The breakout automatically succeeds", false, "breakout-volume-combo", "That is too certain."),
        choice("d", "The quiet move with weak participation", false, "breakout-volume-combo", "That is the weaker setup."),
      ],
      explanation: "The stronger breakout is the one with stronger participation behind it.",
      reviewPrompt: "breakout-volume-combo",
    },
  ),
  "putting-it-together-5": lesson(
    "Teach how to compare company size and revenue growth without mixing them up.",
    "You now separate size from growth while comparing two companies.",
    ["size-plus-growth", "comparison-read"],
    [
      panel(
        "hook",
        "One company can be bigger while another is growing faster",
        "Size and growth answer different questions, so a good comparison keeps both visible.",
        {
          eyebrow: "Hook",
          activityKind: "market-cap-board",
          activityData: {
            variant: "company-compare",
            companies: [
              { id: "a", name: "Atlas Co", price: "$34", shares: "3B", cap: "$102B", growth: "12%" },
              { id: "b", name: "Nova Co", price: "$62", shares: "700M", cap: "$43B", growth: "28%" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "Market cap answers size. Revenue growth answers pace.",
        "The strongest beginner comparison says both clearly instead of letting one crowd out the other.",
        {
          eyebrow: "Learn",
          activityKind: "market-cap-board",
          activityData: {
            variant: "growth-bars",
            companies: [
              { id: "atlas", name: "Atlas Co", revenue: [26, 30, 34, 38], note: "Steady growth" },
              { id: "nova", name: "Nova Co", revenue: [18, 24, 32, 42], note: "Faster growth" },
            ],
          },
          noteLabel: "Common mistake",
          note: "Beginners often let the higher share price or larger company size dominate the whole comparison.",
        },
      ),
      panel(
        "micro-example",
        "A good company comparison holds two truths at once",
        "Bigger does not mean faster-growing, and faster-growing does not automatically mean better.",
        {
          eyebrow: "Micro example",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Size clue", "Growth clue"],
            cards: [
              { id: "cap", label: "Market cap", target: "Size clue" },
              { id: "revenue-growth", label: "Revenue growth", target: "Growth clue" },
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Company comparison board",
      mechanicSummary: "Compare size and growth together before choosing the best summary.",
      prompt: "Which paired summary is best?",
      question: "Which paired summary is best?",
      activityKind: "market-cap-board",
      activityData: {
        variant: "company-compare",
        companies: [
          { id: "atlas", name: "Atlas Co", price: "$34", shares: "3B", cap: "$102B", growth: "12%" },
          { id: "nova", name: "Nova Co", price: "$62", shares: "700M", cap: "$43B", growth: "28%" },
        ],
      },
      supportActivities: ["Name the bigger company.", "Name the faster grower.", "Do not collapse them into one claim."],
      options: [
        choice("a", "Atlas is bigger, while Nova is growing faster", true, ""),
        choice("b", "Nova is bigger and growing faster", false, "size-plus-growth", "That mixes up size and growth."),
        choice("c", "Atlas is smaller because its share price is lower", false, "size-plus-growth", "Share price alone does not tell you size."),
      ],
      explanation: "Correct. Atlas is bigger by market cap, while Nova is growing faster.",
    },
    {
      question: "Which paired summary is best?",
      type: "multiple",
      options: [
        choice("a", "Atlas is bigger, while Nova is growing faster", true, ""),
        choice("b", "Nova is bigger and growing faster", false, "size-plus-growth", "That ignores the market cap comparison."),
        choice("c", "Atlas is smaller because its share price is lower", false, "size-plus-growth", "Share price alone is a trap."),
        choice("d", "Growth and size mean the same thing", false, "size-plus-growth", "They answer different questions."),
      ],
      explanation: "The strongest summary keeps size and growth separate in the same sentence.",
      reviewPrompt: "size-plus-growth",
    },
  ),
  "putting-it-together-6": lesson(
    "Teach how to combine valuation ratios with the expectations behind them.",
    "You now ask a better next question when a ratio looks high or low.",
    ["pe-plus-expectations", "next-question"],
    [
      panel(
        "hook",
        "A ratio gets better when you ask what explains it",
        "P/E is not the ending. It is the start of the next better question.",
        {
          eyebrow: "Hook",
          activityKind: "ratio-builder",
          activityData: { variant: "pe-builder", price: 60, eps: 3 },
        },
      ),
      panel(
        "learn",
        "Expectations sit behind the ratio",
        "A higher ratio can reflect stronger expectations. A lower ratio can reflect weaker expectations or risk.",
        {
          eyebrow: "Learn",
          activityKind: "signal-stack",
          activityData: {
            clues: [
              { title: "P/E", detail: "The ratio itself" },
              { title: "Growth expectations", detail: "Why the market may pay more" },
              { title: "Risk context", detail: "Why the market may pay less" },
            ],
          },
          noteLabel: "Common mistake",
          note: "The mistake is treating the ratio like a verdict instead of a clue that leads to another question.",
        },
      ),
      panel(
        "micro-example",
        "The next question is more useful than a snap verdict",
        "When you see the ratio, ask what growth, sector, or risk context is missing.",
        {
          eyebrow: "Micro example",
          activityKind: "checklist",
          activityData: {
            items: [
              "What growth is expected?",
              "What risks are present?",
              "What sector context matters?",
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Valuation follow-up",
      mechanicSummary: "Use the ratio, then choose the best next question instead of stopping too early.",
      prompt: "What should you ask next?",
      question: "What should you ask next?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "High P/E", detail: "Something is priced optimistically" },
          { title: "Low P/E", detail: "Something may be priced cautiously" },
          { title: "Next step", detail: "Ask what explains it" },
        ],
      },
      supportActivities: ["Read the ratio.", "Look for the missing context.", "Ask the next question."],
      options: [
        choice("a", "What growth or risk context explains this ratio?", true, ""),
        choice("b", "Is the ratio automatically good or bad?", false, "pe-plus-expectations", "That is the shortcut this lesson is trying to remove."),
        choice("c", "Does the ratio make every other clue irrelevant?", false, "pe-plus-expectations", "No single ratio replaces the rest of the read."),
      ],
      explanation: "Correct. The better next question is what growth, sector, or risk context explains the ratio.",
    },
    {
      question: "What should you ask next?",
      type: "multiple",
      options: [
        choice("a", "What growth or risk context explains this ratio?", true, ""),
        choice("b", "Is the ratio automatically good or bad?", false, "pe-plus-expectations", "That is too rigid."),
        choice("c", "Does the ratio make every other clue irrelevant?", false, "pe-plus-expectations", "It does not."),
        choice("d", "Can I ignore expectations now?", false, "pe-plus-expectations", "Expectations are the point."),
      ],
      explanation: "The better next question is what expectations or risks explain the ratio.",
      reviewPrompt: "pe-plus-expectations",
    },
  ),
  "putting-it-together-7": lesson(
    "Teach a repeatable beginner checklist order.",
    "You now have a cleaner checklist for a full beginner stock read.",
    ["beginner-checklist", "workflow-order"],
    [
      panel(
        "hook",
        "A calm checklist keeps the read organized",
        "The checklist is not about sounding advanced. It is about not skipping important steps.",
        {
          eyebrow: "Hook",
          activityKind: "sequence-lab",
          activityData: {
            steps: [
              { id: "chart", label: "Read the chart", description: "Direction and structure first." },
              { id: "business", label: "Read the business", description: "Size, growth, and quality." },
              { id: "valuation", label: "Read the valuation", description: "Price relative to the business." },
              { id: "uncertainty", label: "Name what is still unclear", description: "Keep the final read honest." },
            ],
            orderedSteps: [
              { id: "step-1", label: "Step 1" },
              { id: "step-2", label: "Step 2" },
              { id: "step-3", label: "Step 3" },
              { id: "step-4", label: "Step 4" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "The order matters because each step sharpens the next",
        "When you skip straight to valuation, you lose the chart and business context that make the number meaningful.",
        {
          eyebrow: "Learn",
          activityKind: "checklist",
          activityData: {
            items: [
              "Chart first",
              "Business second",
              "Valuation third",
              "Uncertainty last",
            ],
          },
          noteLabel: "Common mistake",
          note: "Beginners often let one favorite metric jump ahead of the full workflow.",
        },
      ),
      panel(
        "micro-example",
        "A good checklist gives you a cleaner final summary",
        "The final read gets calmer when you build it in order.",
        {
          eyebrow: "Micro example",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Earlier in the checklist", "Later in the checklist"],
            cards: [
              { id: "trend", label: "Trend and structure", target: "Earlier in the checklist" },
              { id: "valuation", label: "P/E and expectations", target: "Later in the checklist" },
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Checklist order",
      mechanicSummary: "Put the beginner checklist in order before answering the final question.",
      prompt: "Which step comes before valuation?",
      question: "Which step comes before valuation?",
      activityKind: "sequence-lab",
      activityData: {
        steps: [
          { id: "chart", label: "Chart read", description: "Direction and structure" },
          { id: "business", label: "Business read", description: "Growth and quality" },
          { id: "valuation", label: "Valuation read", description: "Price versus the business" },
        ],
        orderedSteps: [
          { id: "slot-1", label: "First" },
          { id: "slot-2", label: "Before valuation" },
          { id: "slot-3", label: "Then valuation" },
        ],
      },
      supportActivities: ["Follow the order.", "Do not skip context.", "Put valuation in the right place."],
      options: [
        choice("a", "The business read", true, ""),
        choice("b", "A target price", false, "beginner-checklist", "That is not the step that should come before valuation."),
        choice("c", "Certainty", false, "beginner-checklist", "The checklist ends with humility, not certainty."),
      ],
      explanation: "Correct. The business read belongs before valuation.",
    },
    {
      question: "Which step comes before valuation?",
      type: "multiple",
      options: [
        choice("a", "The business read", true, ""),
        choice("b", "A target price", false, "beginner-checklist", "That skips the checklist."),
        choice("c", "Certainty", false, "beginner-checklist", "That is not a step in the checklist."),
        choice("d", "Nothing", false, "beginner-checklist", "Valuation should not be the first thing you do."),
      ],
      explanation: "Business context should come before valuation in the checklist.",
      reviewPrompt: "beginner-checklist",
    },
  ),
  "putting-it-together-8": lesson(
    "Teach how to spot an overconfident stock explanation.",
    "You now catch weak explanations before they become your own.",
    ["weak-explanation", "overconfidence"],
    [
      panel(
        "hook",
        "Weak explanations sound too certain",
        "The quickest red flag is language that acts as if one clue explains everything.",
        {
          eyebrow: "Hook",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Careful", "Overconfident"],
            cards: [
              { id: "careful", label: "The setup looks stronger, but more context still matters", target: "Careful" },
              { id: "weak", label: "This one clue proves the whole stock case", target: "Overconfident" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "A careful explanation keeps evidence and confidence separate",
        "A weak explanation often uses one clue, makes a giant leap, and acts as if uncertainty disappeared.",
        {
          eyebrow: "Learn",
          activityKind: "signal-stack",
          activityData: {
            clues: [
              { title: "One clue", detail: "Too little evidence" },
              { title: "Big claim", detail: "Too much confidence" },
              { title: "Missing uncertainty", detail: "The key flaw" },
            ],
          },
          noteLabel: "What to notice",
          note: "Weak reasoning often sounds clean and confident. That does not make it careful.",
        },
      ),
      panel(
        "micro-example",
        "Strong reasoning sounds balanced, not dramatic",
        "The better explanation sounds more cautious because it actually respects the limits of the evidence.",
        {
          eyebrow: "Micro example",
          activityKind: "checklist",
          activityData: {
            items: [
              "Use more than one clue",
              "State the limits",
              "Avoid all-in language",
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Explanation filter",
      mechanicSummary: "Sort careful and weak explanations, then choose what makes the weak one weak.",
      prompt: "What makes the weak explanation weak?",
      question: "What makes the weak explanation weak?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Careful", "Weak"],
        cards: [
          { id: "balanced", label: "Uses multiple clues and leaves uncertainty", target: "Careful" },
          { id: "absolute", label: "Uses one clue and acts certain", target: "Weak" },
        ],
      },
      supportActivities: ["Sort by reasoning quality.", "Look for overconfidence.", "Find the real flaw."],
      options: [
        choice("a", "It acts too certain from too little evidence", true, ""),
        choice("b", "It mentions a chart at all", false, "weak-explanation", "Using chart evidence is not the flaw."),
        choice("c", "It is short", false, "weak-explanation", "Short can still be strong if it is careful."),
      ],
      explanation: "Correct. The explanation is weak because it becomes too certain from too little evidence.",
    },
    {
      question: "What makes the weak explanation weak?",
      type: "multiple",
      options: [
        choice("a", "It acts too certain from too little evidence", true, ""),
        choice("b", "It mentions a chart at all", false, "weak-explanation", "That is not the real problem."),
        choice("c", "It is short", false, "weak-explanation", "Short is not the issue."),
        choice("d", "It uses business context", false, "weak-explanation", "Business context is good when used carefully."),
      ],
      explanation: "The weak explanation becomes too certain from too little evidence.",
      reviewPrompt: "weak-explanation",
    },
  ),
  "putting-it-together-9": lesson(
    "Teach how to build a one-page stock snapshot from chart and business clues together.",
    "You can now build a guided stock snapshot without pretending it is the whole story.",
    ["guided-stock-snapshot", "uncertainty-awareness"],
    [
      panel(
        "hook",
        "A clean stock snapshot combines only the most useful clues",
        "You want chart behavior, business size or growth, and one valuation clue in one compact view.",
        {
          eyebrow: "Hook",
          activityKind: "business-builder",
          activityData: {
            variant: "snapshot-board",
            sections: [
              { label: "Chart", value: "Uptrend above support" },
              { label: "Business", value: "Mid-size, still growing" },
              { label: "Valuation", value: "P/E needs context" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "The snapshot should still leave room for uncertainty",
        "A good snapshot tells you what you know so far and what still needs checking.",
        {
          eyebrow: "Learn",
          activityKind: "signal-stack",
          activityData: {
            clues: [
              { title: "Chart clue", detail: "Trend plus structure" },
              { title: "Business clue", detail: "Size or growth" },
              { title: "Open question", detail: "What is still missing?" },
            ],
          },
          noteLabel: "Common mistake",
          note: "Many snapshots sound complete when they are really just the first pass.",
        },
      ),
      panel(
        "micro-example",
        "The strongest stock snapshot is compact and honest",
        "The goal is not to say everything. The goal is to say the most important things clearly.",
        {
          eyebrow: "Micro example",
          activityKind: "checklist",
          activityData: {
            items: [
              "Chart behavior",
              "Business clue",
              "Valuation clue",
              "Open question",
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Snapshot builder",
      mechanicSummary: "Fill the key pieces of the stock snapshot, then decide what still remains uncertain.",
      prompt: "What remains uncertain?",
      question: "What remains uncertain?",
      activityKind: "business-builder",
      activityData: {
        variant: "snapshot-board",
        sections: [
          { label: "Chart", value: "Mostly rising above support" },
          { label: "Business", value: "Growing revenue" },
          { label: "Valuation", value: "Higher P/E" },
        ],
      },
      supportActivities: ["Use the compact snapshot.", "Notice what you know.", "Notice what still needs checking."],
      options: [
        choice("a", "Whether the valuation is justified by the full context", true, ""),
        choice("b", "Nothing remains uncertain", false, "guided-stock-snapshot", "That is exactly the mindset this lesson is trying to fix."),
        choice("c", "Whether the chart exists", false, "guided-stock-snapshot", "The chart is already visible in the snapshot."),
      ],
      explanation: "Correct. A good snapshot still leaves an open question, such as whether the valuation is justified.",
    },
    {
      question: "What remains uncertain?",
      type: "multiple",
      options: [
        choice("a", "Whether the valuation is justified by the full context", true, ""),
        choice("b", "Nothing remains uncertain", false, "guided-stock-snapshot", "A first-pass snapshot should still leave an open question."),
        choice("c", "Whether the chart exists", false, "guided-stock-snapshot", "That is not the missing piece."),
        choice("d", "Whether any clue matters", false, "guided-stock-snapshot", "The clues matter, but they are not the whole story yet."),
      ],
      explanation: "A good stock snapshot still ends with an honest open question.",
      reviewPrompt: "guided-stock-snapshot",
    },
  ),
  "putting-it-together-10": lesson(
    "Combine chart behavior, structure, business size and growth, valuation context, and careful interpretation in one guided stock read.",
    "Putting It Together complete.",
    ["guided-stock-read-boss", "analysis-order", "careful-summary"],
    [
      panel(
        "hook",
        "Run the full guided stock read",
        "This checkpoint combines the chart, the business, the valuation clue, and the final careful summary.",
        {
          eyebrow: "Boss setup",
          activityKind: "chart-lab",
          activityData: {
            variant: "trend-clinic",
            chartPoints: [18, 24, 30, 28, 40, 48, 60],
            clues: [
              { title: "Trend", detail: "Mostly rising" },
              { title: "Structure", detail: "Support still matters" },
              { title: "Role", detail: "This is your first lens" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "Add the business and valuation clues next",
        "A complete beginner read adds size, growth, and valuation context after the chart gives you the first orientation.",
        {
          eyebrow: "Learn",
          activityKind: "signal-stack",
          activityData: {
            clues: [
              { title: "Business size", detail: "Mid-cap" },
              { title: "Growth", detail: "Revenue still rising" },
              { title: "Valuation", detail: "P/E needs context" },
            ],
          },
          noteLabel: "Boss lesson reminder",
          note: "The best boss answers combine several clues and still leave room for uncertainty.",
        },
      ),
      panel(
        "careful",
        "Finish with the careful takeaway",
        "A strong summary sounds like a guided read, not a prediction.",
        {
          eyebrow: "Careful interpretation",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Careful final takeaway", "Weak final takeaway"],
            cards: [
              { id: "careful", label: "The chart looks constructive, the business still has growth, and valuation still needs context", target: "Careful final takeaway" },
              { id: "weak", label: "One good clue proves the stock is a perfect buy", target: "Weak final takeaway" },
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Full guided stock read",
      mechanicSummary: "Use the chart, business, and valuation clues together before choosing the strongest final takeaway.",
      prompt: "Which final takeaway is strongest?",
      question: "Which final takeaway is strongest?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "Chart", detail: "Mostly rising above structure" },
          { title: "Business", detail: "Mid-size and still growing" },
          { title: "Valuation", detail: "Needs context, not certainty" },
        ],
      },
      supportActivities: ["Use more than one clue.", "Keep the order clean.", "Choose the careful final takeaway."],
      options: [
        choice("a", "The chart looks constructive, the business still has growth, and valuation still needs context", true, ""),
        choice("b", "One clue proves the stock is a perfect buy", false, "guided-stock-read-boss", "The boss lesson is meant to reject one-clue certainty."),
        choice("c", "The chart replaces all business context", false, "guided-stock-read-boss", "A full stock read needs more than the chart."),
      ],
      explanation: "Correct. The strongest boss answer combines the clues and still sounds careful.",
    },
    {
      question: "Which final takeaway is strongest?",
      type: "multiple",
      options: [
        choice("a", "The chart looks constructive, the business still has growth, and valuation still needs context", true, ""),
        choice("b", "One clue proves the stock is a perfect buy", false, "guided-stock-read-boss", "That is too absolute."),
        choice("c", "The chart replaces all business context", false, "guided-stock-read-boss", "That throws away key context."),
        choice("d", "Valuation alone is enough", false, "guided-stock-read-boss", "The boss read is multi-layered on purpose."),
      ],
      explanation: "The strongest final takeaway combines the chart, the business, and the valuation clue without pretending certainty.",
      reviewPrompt: "guided-stock-read-boss",
    },
  ),
};

const finalMasteryLessons: Record<string, AuthoredLessonExperience> = {
  "final-mastery-1": lesson(
    "Teach a guided applied interpretation of a simple stock setup.",
    "You can now read a simple stock setup without rushing into certainty.",
    ["simple-stock-setup", "applied-reading"],
    [
      panel(
        "hook",
        "Start with the strongest visible clues",
        "A simple stock setup still gives you several clues at once. The goal is to choose the important ones first.",
        {
          eyebrow: "Hook",
          activityKind: "signal-stack",
          activityData: {
            clues: [
              { title: "Trend", detail: "Mostly rising" },
              { title: "Support", detail: "Still holding" },
              { title: "Growth", detail: "Still positive" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "A good read sounds guided, not dramatic",
        "The better summary names what the chart is doing, adds one business clue, and leaves room for what is still unknown.",
        {
          eyebrow: "Learn",
          activityKind: "checklist",
          activityData: {
            items: [
              "Name the chart clue",
              "Add one business clue",
              "Leave room for uncertainty",
            ],
          },
          noteLabel: "Common mistake",
          note: "The weak version jumps from one strong clue straight into a confident verdict.",
        },
      ),
      panel(
        "micro-example",
        "A simple setup still needs a balanced summary",
        "You are practicing applied interpretation, not prediction.",
        {
          eyebrow: "Micro example",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Stronger summary", "Weaker summary"],
            cards: [
              { id: "strong", label: "Constructive setup, but more context still matters", target: "Stronger summary" },
              { id: "weak", label: "This setup guarantees the outcome", target: "Weaker summary" },
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Setup read",
      mechanicSummary: "Review the setup clues and choose the best summary.",
      prompt: "Which summary is strongest?",
      question: "Which summary is strongest?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "Chart", detail: "Uptrend above support" },
          { title: "Business", detail: "Growth still positive" },
          { title: "Discipline", detail: "No certainty yet" },
        ],
      },
      supportActivities: ["Use the chart clue.", "Use one business clue.", "Keep the summary careful."],
      options: [
        choice("a", "The setup looks constructive, but more context still matters", true, ""),
        choice("b", "The setup guarantees success", false, "simple-stock-setup", "That is the mistake this lesson is correcting."),
        choice("c", "No clue matters here", false, "simple-stock-setup", "The clues still matter, even if they are not complete."),
      ],
      explanation: "Correct. The stronger summary sounds constructive but still careful.",
    },
    {
      question: "Which summary is strongest?",
      type: "multiple",
      options: [
        choice("a", "The setup looks constructive, but more context still matters", true, ""),
        choice("b", "The setup guarantees success", false, "simple-stock-setup", "That is too certain."),
        choice("c", "No clue matters here", false, "simple-stock-setup", "That is too dismissive."),
        choice("d", "One clue explains everything", false, "simple-stock-setup", "That is the weak shortcut."),
      ],
      explanation: "The strongest summary uses the setup clues without pretending certainty.",
      reviewPrompt: "simple-stock-setup",
    },
  ),
  "final-mastery-2": lesson(
    "Teach the difference between what the learner knows, does not know, and still needs more context to answer.",
    "You now separate evidence from uncertainty more honestly.",
    ["known-vs-unknown", "uncertainty-sorting"],
    [
      panel(
        "hook",
        "A careful read labels what is known and what is still open",
        "Strong learners do not blur facts, guesses, and missing context together.",
        {
          eyebrow: "Hook",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Known", "Unknown", "Need more context"],
            cards: [
              { id: "trend", label: "The chart is mostly rising", target: "Known" },
              { id: "next-earnings", label: "The next earnings reaction", target: "Unknown" },
              { id: "valuation", label: "Whether the valuation is justified", target: "Need more context" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "Known means supported. Unknown means not visible yet.",
        "The middle bucket matters too: some questions are not unknowable - they just need more context.",
        {
          eyebrow: "Learn",
          activityKind: "checklist",
          activityData: {
            items: [
              "Known: evidence is visible now",
              "Unknown: the answer is not visible yet",
              "Need more context: the question is still open",
            ],
          },
          noteLabel: "Common mistake",
          note: "Beginners often treat open questions like firm answers because they feel pressure to sound certain.",
        },
      ),
      panel(
        "micro-example",
        "This skill protects you from fake confidence",
        "The better stock read is often the one that labels uncertainty more honestly.",
        {
          eyebrow: "Micro example",
          activityKind: "signal-stack",
          activityData: {
            clues: [
              { title: "Known", detail: "Chart trend" },
              { title: "Need context", detail: "Valuation judgment" },
              { title: "Unknown", detail: "Next market reaction" },
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Evidence sorter",
      mechanicSummary: "Sort clues into known, unknown, and need more context before answering.",
      prompt: "What still needs checking?",
      question: "What still needs checking?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Known", "Unknown", "Need more context"],
        cards: [
          { id: "support", label: "Support is visible on the chart", target: "Known" },
          { id: "final-outcome", label: "The final outcome from here", target: "Unknown" },
          { id: "pe", label: "Whether the P/E is justified", target: "Need more context" },
        ],
      },
      supportActivities: ["Mark what is visible.", "Label what is still open.", "Respect the difference."],
      options: [
        choice("a", "Whether the valuation is justified", true, ""),
        choice("b", "That the chart exists", false, "known-vs-unknown", "That is already visible."),
        choice("c", "That uncertainty matters at all", false, "known-vs-unknown", "The whole lesson is about respecting uncertainty."),
      ],
      explanation: "Correct. Whether the valuation is justified still needs more context.",
    },
    {
      question: "What still needs checking?",
      type: "multiple",
      options: [
        choice("a", "Whether the valuation is justified", true, ""),
        choice("b", "That the chart exists", false, "known-vs-unknown", "That is already known."),
        choice("c", "That uncertainty matters at all", false, "known-vs-unknown", "That misses the lesson."),
        choice("d", "Whether price moved yesterday", false, "known-vs-unknown", "That may already be visible."),
      ],
      explanation: "The valuation judgment still needs more context.",
      reviewPrompt: "known-vs-unknown",
    },
  ),
  "final-mastery-3": lesson(
    "Teach how to choose the next best question instead of jumping to a conclusion.",
    "You now move to the next useful question more deliberately.",
    ["next-best-question", "analysis-prioritization"],
    [
      panel(
        "hook",
        "A careful learner asks the next best question",
        "When the first read is incomplete, the next best question matters more than a fast conclusion.",
        {
          eyebrow: "Hook",
          activityKind: "checklist",
          activityData: {
            items: [
              "What does the chart say?",
              "What business clue is missing?",
              "What valuation context still needs checking?",
            ],
          },
        },
      ),
      panel(
        "learn",
        "The right next question depends on what is still unclear",
        "If the chart is clear but the valuation is not, the next best question probably lives in the valuation layer.",
        {
          eyebrow: "Learn",
          activityKind: "signal-stack",
          activityData: {
            clues: [
              { title: "Chart", detail: "Reasonably clear" },
              { title: "Business", detail: "Partly clear" },
              { title: "Gap", detail: "Valuation context still missing" },
            ],
          },
          noteLabel: "Common mistake",
          note: "The weak habit is asking the most dramatic question instead of the most useful one.",
        },
      ),
      panel(
        "micro-example",
        "The best next question usually reduces uncertainty",
        "It should clarify the open part of the read, not feed the hype part.",
        {
          eyebrow: "Micro example",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Useful next question", "Weak next question"],
            cards: [
              { id: "useful", label: "What growth expectations justify this valuation?", target: "Useful next question" },
              { id: "weak", label: "How fast can this double?", target: "Weak next question" },
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Next question filter",
      mechanicSummary: "Use the open gap in the read to choose the next best question.",
      prompt: "What would a careful beginner ask next?",
      question: "What would a careful beginner ask next?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "Chart", detail: "Constructive" },
          { title: "Business", detail: "Growth visible" },
          { title: "Gap", detail: "Valuation context still missing" },
        ],
      },
      supportActivities: ["Find the open gap.", "Ask the clarifying question.", "Avoid the hype question."],
      options: [
        choice("a", "What growth or risk context explains this valuation?", true, ""),
        choice("b", "How fast can the stock double?", false, "next-best-question", "That chases excitement instead of clarity."),
        choice("c", "Can I ignore uncertainty now?", false, "next-best-question", "That is the opposite of the right move."),
      ],
      explanation: "Correct. The next best question is the one that clarifies the missing valuation context.",
    },
    {
      question: "What would a careful beginner ask next?",
      type: "multiple",
      options: [
        choice("a", "What growth or risk context explains this valuation?", true, ""),
        choice("b", "How fast can the stock double?", false, "next-best-question", "That is a hype question, not a clarifying one."),
        choice("c", "Can I ignore uncertainty now?", false, "next-best-question", "No."),
        choice("d", "What is the most dramatic prediction?", false, "next-best-question", "That is not the job."),
      ],
      explanation: "The next best question is the one that reduces the biggest remaining uncertainty.",
      reviewPrompt: "next-best-question",
    },
  ),
  "final-mastery-4": lesson(
    "Teach how to diagnose a common beginner reasoning mistake.",
    "You now catch the reasoning mistake, not just the wrong conclusion.",
    ["mistake-diagnosis", "reasoning-quality"],
    [
      panel(
        "hook",
        "A weak explanation often breaks in the middle, not at the end",
        "The conclusion sounds wrong because the reasoning chain became weak first.",
        {
          eyebrow: "Hook",
          activityKind: "signal-stack",
          activityData: {
            clues: [
              { title: "Student claim", detail: "The chart broke out, so nothing can go wrong." },
              { title: "Missing step", detail: "No discussion of volume, hold, or uncertainty." },
              { title: "Mistake", detail: "The reasoning jumped too far." },
            ],
          },
        },
      ),
      panel(
        "learn",
        "The mistake is usually overconfidence from partial evidence",
        "This kind of learner sees one strong clue and treats it as a final verdict.",
        {
          eyebrow: "Learn",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Good reasoning", "Weak reasoning"],
            cards: [
              { id: "good", label: "Use several clues and leave uncertainty", target: "Good reasoning" },
              { id: "weak", label: "Use one clue and speak as if certain", target: "Weak reasoning" },
            ],
          },
          noteLabel: "Common mistake",
          note: "The reasoning problem is not that the student noticed the clue. It is that the student overused it.",
        },
      ),
      panel(
        "micro-example",
        "You are diagnosing the thinking pattern",
        "The goal is not to punish the wrong answer. It is to see the broken logic behind it.",
        {
          eyebrow: "Micro example",
          activityKind: "checklist",
          activityData: {
            items: [
              "Find the useful clue",
              "Find the missing clue",
              "Name the reasoning error",
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Reasoning diagnosis",
      mechanicSummary: "Read the flawed explanation and identify the mistake in the reasoning.",
      prompt: "What was the mistake?",
      question: "What was the mistake?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Reasoning flaw", "Not the main flaw"],
        cards: [
          { id: "flaw", label: "Too much certainty from one clue", target: "Reasoning flaw" },
          { id: "not-flaw", label: "Mentioning the chart at all", target: "Not the main flaw" },
        ],
      },
      supportActivities: ["Find the useful clue.", "Find the leap.", "Name the mistake."],
      options: [
        choice("a", "The explanation became too certain from partial evidence", true, ""),
        choice("b", "The learner mentioned a chart", false, "mistake-diagnosis", "Mentioning the chart is not the problem."),
        choice("c", "The learner used short sentences", false, "mistake-diagnosis", "Writing style is not the core issue."),
      ],
      explanation: "Correct. The reasoning failed because it became too certain from too little evidence.",
    },
    {
      question: "What was the mistake?",
      type: "multiple",
      options: [
        choice("a", "The explanation became too certain from partial evidence", true, ""),
        choice("b", "The learner mentioned a chart", false, "mistake-diagnosis", "That is not the mistake."),
        choice("c", "The learner used short sentences", false, "mistake-diagnosis", "That is irrelevant."),
        choice("d", "The learner cared about evidence", false, "mistake-diagnosis", "Caring about evidence is good."),
      ],
      explanation: "The mistake was too much certainty from too little evidence.",
      reviewPrompt: "mistake-diagnosis",
    },
  ),
  "final-mastery-5": lesson(
    "Teach how to respond when the chart and business clues point in different directions.",
    "You now read mixed signals more carefully instead of forcing an easy answer.",
    ["mixed-signals", "conflict-reading"],
    [
      panel(
        "hook",
        "Sometimes the chart and business do not agree cleanly",
        "A mixed-signal setup is not a broken lesson. It is a real test of judgment.",
        {
          eyebrow: "Hook",
          activityKind: "signal-stack",
          activityData: {
            clues: [
              { title: "Chart", detail: "Trend weakened" },
              { title: "Business", detail: "Revenue still growing" },
              { title: "Problem", detail: "The clues are pulling in different directions" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "Mixed signals call for caution, not force",
        "When the chart and business disagree, the careful read usually becomes more tentative.",
        {
          eyebrow: "Learn",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Careful response", "Weak response"],
            cards: [
              { id: "careful", label: "Acknowledge the conflict and reduce confidence", target: "Careful response" },
              { id: "weak", label: "Force one clue to erase the other", target: "Weak response" },
            ],
          },
          noteLabel: "Common mistake",
          note: "The mistake is trying to make the setup feel simpler than it really is.",
        },
      ),
      panel(
        "micro-example",
        "The stronger clue may matter more right now, but it should not erase the other clue",
        "This is where timing and uncertainty matter most.",
        {
          eyebrow: "Micro example",
          activityKind: "checklist",
          activityData: {
            items: [
              "Name the conflict",
              "Decide which clue matters more right now",
              "Lower your confidence",
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Mixed-signal read",
      mechanicSummary: "Use the conflicting clues and choose the cautious interpretation.",
      prompt: "Which clue is stronger right now?",
      question: "Which clue is stronger right now?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "Chart weakness", detail: "Immediate pressure is softer" },
          { title: "Business strength", detail: "Longer-term business still looks healthy" },
          { title: "Read", detail: "Keep the summary cautious" },
        ],
      },
      supportActivities: ["Name the conflict.", "Decide which clue matters more now.", "Keep the summary modest."],
      options: [
        choice("a", "The chart clue is stronger right now, but the business clue still matters", true, ""),
        choice("b", "The business clue erases the chart entirely", false, "mixed-signals", "That is too simplistic."),
        choice("c", "The conflict means no clue matters", false, "mixed-signals", "The clues still matter; they just conflict."),
      ],
      explanation: "Correct. The stronger right-now clue may be the chart, but the business clue still remains part of the picture.",
    },
    {
      question: "Which clue is stronger right now?",
      type: "multiple",
      options: [
        choice("a", "The chart clue is stronger right now, but the business clue still matters", true, ""),
        choice("b", "The business clue erases the chart entirely", false, "mixed-signals", "That forces the conflict into a fake clean answer."),
        choice("c", "The conflict means no clue matters", false, "mixed-signals", "That is too dismissive."),
        choice("d", "You should pretend there is no conflict", false, "mixed-signals", "The whole lesson is about acknowledging the conflict."),
      ],
      explanation: "The careful read names the stronger near-term clue while keeping the other clue in view.",
      reviewPrompt: "mixed-signals",
    },
  ),
  "final-mastery-6": lesson(
    "Teach confidence calibration after reviewing multiple clues.",
    "You now set confidence with more discipline instead of using an emotional guess.",
    ["confidence-calibration", "evidence-weighting"],
    [
      panel(
        "hook",
        "Confidence should match the evidence quality",
        "A premium read does not just answer the question. It also sets the right confidence around that answer.",
        {
          eyebrow: "Hook",
          activityKind: "confidence-meter",
        },
      ),
      panel(
        "learn",
        "Higher confidence needs stronger, cleaner evidence",
        "When clues are mixed or incomplete, your confidence should usually come down.",
        {
          eyebrow: "Learn",
          activityKind: "signal-stack",
          activityData: {
            clues: [
              { title: "Chart", detail: "Constructive, but not perfect" },
              { title: "Business", detail: "Growth visible" },
              { title: "Valuation", detail: "Still needs context" },
            ],
          },
          noteLabel: "Common mistake",
          note: "Beginners often let excitement set confidence instead of letting evidence set confidence.",
        },
      ),
      panel(
        "micro-example",
        "Moderate confidence is often the honest answer",
        "You do not get bonus points for sounding more certain than the evidence allows.",
        {
          eyebrow: "Micro example",
          activityKind: "checklist",
          activityData: {
            items: [
              "Strong evidence pushes confidence up",
              "Mixed evidence pulls confidence down",
              "Uncertainty is part of the score",
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Confidence meter",
      mechanicSummary: "Review the evidence and set a confidence level that matches it.",
      prompt: "Is this a high-confidence or lower-confidence read?",
      question: "Is this a high-confidence or lower-confidence read?",
      activityKind: "confidence-meter",
      supportActivities: ["Review the evidence stack.", "Notice the open questions.", "Set the meter honestly."],
      options: [
        choice("a", "Lower to moderate confidence", true, ""),
        choice("b", "Maximum confidence because one clue looks good", false, "confidence-calibration", "That ignores the mixed evidence."),
        choice("c", "Zero confidence no matter what", false, "confidence-calibration", "The evidence is not useless."),
      ],
      explanation: "Correct. The read deserves lower to moderate confidence because useful clues are still mixed with open questions.",
    },
    {
      question: "Is this a high-confidence or lower-confidence read?",
      type: "multiple",
      options: [
        choice("a", "Lower to moderate confidence", true, ""),
        choice("b", "Maximum confidence because one clue looks good", false, "confidence-calibration", "That overweights one clue."),
        choice("c", "Zero confidence no matter what", false, "confidence-calibration", "That is too extreme the other way."),
        choice("d", "Confidence does not matter", false, "confidence-calibration", "Confidence calibration is the point of the lesson."),
      ],
      explanation: "The honest read is lower to moderate confidence because uncertainty still matters.",
      reviewPrompt: "confidence-calibration",
    },
  ),
  "final-mastery-7": lesson(
    "Teach how to write a short beginner stock summary with chart, business, and caution.",
    "You can now write a tighter two-to-four sentence stock summary.",
    ["typed-stock-summary", "written-reasoning"],
    [
      panel(
        "hook",
        "A short summary still needs structure",
        "Your short read should include one chart clue, one business clue, and one sentence of caution.",
        {
          eyebrow: "Hook",
          activityKind: "signal-stack",
          activityData: {
            clues: [
              { title: "Chart clue", detail: "What is price doing?" },
              { title: "Business clue", detail: "What is the company doing?" },
              { title: "Caution", detail: "What remains uncertain?" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "The summary should sound clean, not crowded",
        "You are writing a calm beginner read, not a long essay.",
        {
          eyebrow: "Learn",
          activityKind: "checklist",
          activityData: {
            items: [
              "Sentence 1: chart read",
              "Sentence 2: business or valuation clue",
              "Sentence 3: uncertainty or next question",
            ],
          },
          noteLabel: "Common mistake",
          note: "The weak version either becomes too vague or sounds far too certain.",
        },
      ),
      panel(
        "micro-example",
        "A strong short summary is balanced",
        "It should sound like a thoughtful beginner read, not a trade alert.",
        {
          eyebrow: "Micro example",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Useful sentence", "Weak sentence"],
            cards: [
              { id: "useful", label: "The chart looks constructive, but valuation still needs context", target: "Useful sentence" },
              { id: "weak", label: "This is obviously going much higher", target: "Weak sentence" },
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Summary prep",
      mechanicSummary: "Gather the chart, business, and caution clues before writing.",
      prompt: "Build the pieces of the summary before the final writing check.",
      question: "Which ingredient belongs in the short summary?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "Chart", detail: "Trend or structure clue" },
          { title: "Business", detail: "Growth, size, or valuation clue" },
          { title: "Caution", detail: "One uncertainty" },
        ],
      },
      supportActivities: ["Collect the key pieces.", "Keep it short.", "Write after the structure is clear."],
      options: [
        choice("a", "A chart clue, a business clue, and a caution point", true, ""),
        choice("b", "A prediction only", false, "typed-stock-summary", "A good summary needs more than a prediction."),
        choice("c", "A chart clue with no uncertainty", false, "typed-stock-summary", "The caution piece matters."),
      ],
      explanation: "Correct. The short summary should combine a chart clue, a business clue, and a caution point.",
    },
    {
      question: "Write a short stock summary.",
      type: "typed",
      explanation: "A strong short summary names the chart setup, adds one business or valuation clue, and leaves room for uncertainty.",
      reviewPrompt: "typed-stock-summary",
      expectedKeywords: ["chart", "growth", "valuation", "uncertain"],
      discouragedKeywords: ["guaranteed", "certain"],
      placeholder:
        "Write 2-4 sentences. Mention the chart, one business or valuation clue, and one uncertainty.",
      coachTip:
        "If your draft feels thin, add one concrete chart clue, one business or valuation clue, and one honest uncertainty.",
    },
  ),
  "final-mastery-8": lesson(
    "Teach a voice-ready reasoning flow with a typed fallback.",
    "You now have a simple spoken reasoning structure with a typed fallback.",
    ["voice-ready-reasoning", "spoken-structure"],
    [
      panel(
        "hook",
        "A spoken stock read still needs structure",
        "The best spoken version is just the written logic delivered out loud: chart, business, caution, next question.",
        {
          eyebrow: "Hook",
          activityKind: "voice-ready",
        },
      ),
      panel(
        "learn",
        "Spoken clarity comes from a simple sequence",
        "If you can say the chart clue, the business clue, and the caution in order, your spoken answer becomes much cleaner.",
        {
          eyebrow: "Learn",
          activityKind: "checklist",
          activityData: {
            items: [
              "Start with the chart",
              "Add the business or valuation clue",
              "End with caution and the next question",
            ],
          },
          noteLabel: "Common mistake",
          note: "Without structure, spoken answers drift into hype or vague filler.",
        },
      ),
      panel(
        "micro-example",
        "The typed fallback should mirror the spoken flow",
        "You are building one reasoning structure that works in both forms.",
        {
          eyebrow: "Micro example",
          activityKind: "signal-stack",
          activityData: {
            clues: [
              { title: "Chart", detail: "What price is doing" },
              { title: "Business", detail: "What the company is doing" },
              { title: "Caution", detail: "What still needs checking" },
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Voice-ready scaffold",
      mechanicSummary: "Use the same structure you would speak into the typed fallback.",
      prompt: "Prepare the spoken structure before the final typed fallback.",
      question: "What makes the spoken answer clearer?",
      activityKind: "voice-ready",
      supportActivities: ["Keep the order simple.", "Use chart, business, and caution.", "Avoid hype language."],
      options: [
        choice("a", "A clear sequence: chart, business clue, caution", true, ""),
        choice("b", "Talking faster", false, "voice-ready-reasoning", "Speed is not the structure."),
        choice("c", "Removing uncertainty entirely", false, "voice-ready-reasoning", "That weakens the answer."),
      ],
      explanation: "Correct. A clear sequence makes the spoken answer much easier to follow.",
    },
    {
      question: "Write the voice-ready fallback.",
      type: "typed",
      explanation: "A strong voice-ready answer still names the chart read, the business clue, and the caution clearly.",
      reviewPrompt: "voice-ready-reasoning",
      expectedKeywords: ["chart", "business", "context", "question"],
      discouragedKeywords: ["guaranteed", "certain"],
      placeholder:
        "Write the short spoken version as text. Keep it calm and structured.",
      coachTip:
        "If it sounds vague, tighten the order: chart first, business or valuation second, caution and next question last.",
      voiceReady: true,
    },
  ),
  "final-mastery-9": lesson(
    "Rehearse the final certification structure before the last boss lesson.",
    "You now know the final answer structure before the certification task.",
    ["pre-final-rehearsal", "final-structure"],
    [
      panel(
        "hook",
        "The final answer has a shape",
        "Before the certification, rehearse the answer blocks in the right order.",
        {
          eyebrow: "Hook",
          activityKind: "sequence-lab",
          activityData: {
            steps: [
              { id: "chart", label: "Chart read", description: "Trend and structure" },
              { id: "business", label: "Business read", description: "Size, growth, or quality" },
              { id: "valuation", label: "Valuation context", description: "P/E or related clue" },
              { id: "caution", label: "Open question", description: "What still needs checking" },
            ],
            orderedSteps: [
              { id: "slot-1", label: "First" },
              { id: "slot-2", label: "Then" },
              { id: "slot-3", label: "Then" },
              { id: "slot-4", label: "Finish" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "The last two blocks are where many learners get sloppy",
        "They either skip valuation context or forget to end with the open question.",
        {
          eyebrow: "Learn",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Must still be in the final read", "Easy to skip by mistake"],
            cards: [
              { id: "valuation", label: "Valuation context", target: "Must still be in the final read" },
              { id: "open-question", label: "One open question", target: "Must still be in the final read" },
              { id: "certainty", label: "Absolute certainty", target: "Easy to skip by mistake" },
            ],
          },
          noteLabel: "Common mistake",
          note: "The final read often sounds incomplete because the learner stops after the chart and business clues.",
        },
      ),
      panel(
        "micro-example",
        "The best rehearsal still leaves one open thread",
        "That open thread is a sign of discipline, not weakness.",
        {
          eyebrow: "Micro example",
          activityKind: "checklist",
          activityData: {
            items: [
              "Chart read",
              "Business clue",
              "Valuation clue",
              "Open question",
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Final answer rehearsal",
      mechanicSummary: "Arrange the final answer blocks and check which ingredients still must be included.",
      prompt: "Which pieces still need to be in the final read?",
      question: "Which pieces still need to be in the final read?",
      activityKind: "sequence-lab",
      activityData: {
        steps: [
          { id: "chart", label: "Chart read", description: "Trend and structure" },
          { id: "business", label: "Business clue", description: "Size, growth, or quality" },
          { id: "valuation", label: "Valuation clue", description: "Context, not verdict" },
          { id: "question", label: "Open question", description: "What still needs checking" },
        ],
      },
      supportActivities: ["Rehearse the order.", "Keep valuation in the answer.", "End with the open question."],
      options: [
        choice("a", "Chart, business, valuation, and one open question", true, ""),
        choice("b", "Chart and certainty only", false, "pre-final-rehearsal", "That leaves key parts out."),
        choice("c", "A dramatic prediction only", false, "pre-final-rehearsal", "That is not the final structure."),
      ],
      explanation: "Correct. The final read still needs chart, business, valuation, and one open question.",
    },
    {
      question: "Which pieces still need to be in the final read?",
      type: "multiselect",
      options: [
        choice("a", "A chart read", true, ""),
        choice("b", "A business clue", true, ""),
        choice("c", "A valuation clue", true, ""),
        choice("d", "One open question", true, ""),
        choice("e", "Absolute certainty", false, "pre-final-rehearsal", "That does not belong in the final read."),
      ],
      explanation: "The final read should include the chart, a business clue, a valuation clue, and one open question.",
      reviewPrompt: "pre-final-rehearsal",
      minimumSelections: 4,
    },
  ),
  "final-mastery-10": lesson(
    "Run the final certification-style beginner stock walkthrough with chart, structure, size, growth, valuation context, and a careful concluding explanation.",
    "Final Mastery complete.",
    ["final-certification", "typed-stock-summary", "confidence-calibration"],
    [
      panel(
        "hook",
        "This is the final beginner stock walkthrough",
        "You will review the chart, the business, the valuation context, and then deliver one calm final explanation.",
        {
          eyebrow: "Final boss",
          activityKind: "chart-lab",
          activityData: {
            variant: "trend-clinic",
            chartPoints: [20, 26, 34, 30, 42, 50, 58],
            clues: [
              { title: "Trend", detail: "Mostly rising" },
              { title: "Structure", detail: "Support still matters" },
              { title: "Role", detail: "Start here first" },
            ],
          },
        },
      ),
      panel(
        "business",
        "Now add the business and valuation picture",
        "This stock walkthrough is only complete when you add company size, growth, and valuation context to the chart read.",
        {
          eyebrow: "Second lens",
          activityKind: "signal-stack",
          activityData: {
            clues: [
              { title: "Size", detail: "Mid-cap profile" },
              { title: "Growth", detail: "Revenue still rising" },
              { title: "Valuation", detail: "P/E requires context" },
            ],
          },
          noteLabel: "Certification standard",
          note: "The final answer should show a complete beginner framework, not one isolated observation.",
        },
      ),
      panel(
        "voice-ready",
        "Use the same final structure whether typed or spoken",
        "Your final explanation should name the chart clue, the structural clue, the business read, the valuation context, and one next question.",
        {
          eyebrow: "Voice-ready architecture",
          activityKind: "voice-ready",
        },
      ),
    ],
    {
      mechanicTitle: "Certification prep",
      mechanicSummary: "Gather the final answer ingredients before the certification response.",
      prompt: "Prepare the final answer structure.",
      question: "Which final structure is strongest?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "Chart plus structure", detail: "Trend and support" },
          { title: "Business context", detail: "Size and growth" },
          { title: "Valuation context", detail: "P/E as one clue" },
          { title: "Open question", detail: "What still needs checking" },
        ],
      },
      supportActivities: ["Use all major lenses.", "Keep the summary calm.", "End with one next question."],
      options: [
        choice("a", "One that combines the chart, business, valuation, and one open question", true, ""),
        choice("b", "One that uses only the chart and a confident prediction", false, "final-certification", "That is too thin for the final certification."),
        choice("c", "One that ignores valuation and uncertainty", false, "final-certification", "The final answer should be more complete than that."),
      ],
      explanation: "Correct. The strongest final structure uses the chart, the business, the valuation context, and one open question.",
    },
    {
      question: "Write or speak your final beginner stock walkthrough.",
      type: "typed",
      explanation:
        "Strengths to aim for: include the chart trend and structure, one business clue, one valuation clue, and one honest uncertainty. Missed points usually come from skipping valuation or the open question. Oversimplifications usually sound too certain from too few clues.",
      reviewPrompt: "final-certification",
      expectedKeywords: ["trend", "support", "growth", "valuation", "question"],
      discouragedKeywords: ["guaranteed", "certain"],
      placeholder:
        "Write the final certification response. Include chart trend, structure, business context, valuation context, and one next question.",
      coachTip:
        "What to improve: tighten the chart read, add one business clue, keep valuation in context, and end with the next question you would still ask.",
      voiceReady: true,
    },
  ),
};

function activityOnlyPracticePatch(
  readinessLabel: string,
  actionLabel = "Continue to check",
): Partial<PracticeContent> {
  return {
    useActivityAsPractice: true,
    actionLabel,
    readinessLabel,
    question: "",
    options: [],
  };
}

const normalizedPuttingPracticePatches: Record<string, Partial<PracticeContent>> = {
  "putting-it-together-1": activityOnlyPracticePatch("Finish the read order first"),
  "putting-it-together-2": activityOnlyPracticePatch("Sort every clue first"),
  "putting-it-together-3": {
    ...activityOnlyPracticePatch("Review both chart clues first"),
    mechanicTitle: "Trend + support board",
    mechanicSummary: "Read direction and structure together before the check.",
    prompt: "Use the chart board to combine the trend and the support reaction.",
    activityKind: "chart-lab",
    activityData: {
      variant: "boss-walkthrough",
      chartPoints: [20, 28, 36, 32, 46, 42, 58, 66],
      checklist: [
        "Name the trend first",
        "Check whether support still holds",
        "Use both clues in one read",
      ],
    },
  },
  "putting-it-together-4": {
    ...activityOnlyPracticePatch("Review the breakout event first"),
    mechanicTitle: "Breakout quality board",
    mechanicSummary: "Use event plus participation before the check.",
    prompt: "Read the break, the volume, and the hold quality together.",
    activityKind: "chart-lab",
    activityData: {
      variant: "breakout-volume",
      pricePoints: [18, 24, 30, 34, 38, 58, 74],
      volumeBars: [14, 16, 18, 20, 22, 46, 52],
      breakoutIndex: 5,
      level: 48,
      levelLabel: "Breakout level",
      markerLabel: "Confirmation point",
      caption: "A stronger read clears the level and brings broader participation with it.",
    },
  },
  "putting-it-together-5": activityOnlyPracticePatch("Compare both companies first"),
  "putting-it-together-6": {
    ...activityOnlyPracticePatch("Compare both valuation cases first"),
    mechanicTitle: "Valuation context board",
    mechanicSummary: "Compare two ratio cases, then decide what question comes next.",
    prompt: "Read the ratio, then compare the context instead of jumping to a verdict.",
    activityKind: "ratio-builder",
    activityData: {
      variant: "valuation-compare",
      companies: [
        {
          id: "northpeak",
          name: "NorthPeak",
          price: "$96",
          eps: "$4",
          pe: "24x",
          sector: "Software",
          context: "Higher expectations",
          note: "Higher P/E can make sense only if growth or quality expectations stay strong.",
        },
        {
          id: "riversteel",
          name: "RiverSteel",
          price: "$36",
          eps: "$6",
          pe: "6x",
          sector: "Industrial",
          context: "Cautious pricing",
          note: "Lower P/E can reflect slower growth, more risk, or weaker expectations.",
        },
      ],
    },
  },
  "putting-it-together-7": activityOnlyPracticePatch("Finish the checklist order first"),
  "putting-it-together-8": activityOnlyPracticePatch("Sort both explanations first"),
  "putting-it-together-9": activityOnlyPracticePatch("Build the snapshot first"),
};

const normalizedPuttingCheckPatches: Record<string, CheckContent> = {
  "putting-it-together-1": {
    question: "Lock the analysis order.",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "first-lens",
        prompt: "You open a fresh stock. What should you read first?",
        reviewPrompt: "analysis-order",
        explanation: "Start with the chart so the first move is observation.",
        options: [
          choice("chart", "The chart", true, ""),
          choice("target", "A target price", false, "analysis-order", "That jumps ahead of the first observation."),
          choice("ratio", "One ratio only", false, "analysis-order", "That is too narrow for the first read."),
          choice("prediction", "A confident prediction", false, "analysis-order", "Prediction belongs after evidence."),
        ],
      },
      {
        id: "second-lens",
        prompt: "After the chart, what usually clarifies the read next?",
        reviewPrompt: "analysis-order",
        explanation: "Business context usually helps explain what the chart may be reacting to.",
        options: [
          choice("business", "Business context", true, ""),
          choice("certainty", "Certainty", false, "analysis-order", "Confidence is earned later."),
          choice("headline", "One dramatic headline", false, "analysis-order", "That is not a full second lens."),
          choice("target", "A target price", false, "analysis-order", "That still jumps ahead."),
        ],
      },
      {
        id: "final-discipline",
        prompt: "What keeps the workflow honest at the end?",
        reviewPrompt: "analysis-order",
        explanation: "The clean read still ends with one open question.",
        options: [
          choice("question", "Leave one open question", true, ""),
          choice("prediction", "Make a prediction", false, "analysis-order", "That is not the discipline step."),
          choice("ignore", "Ignore valuation", false, "analysis-order", "The full workflow still checks valuation."),
          choice("certainty", "Act certain", false, "analysis-order", "That breaks the workflow tone."),
        ],
      },
    ],
    explanation: "The order is chart first, then context, then a careful final read.",
    reviewPrompt: "analysis-order",
  },
  "putting-it-together-2": {
    question: "Keep the two lenses in the right lanes.",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "revenue-lens",
        prompt: "Revenue growth belongs to which lens first?",
        reviewPrompt: "two-lens-analysis",
        explanation: "Revenue growth is a business clue, not a chart clue.",
        options: [
          choice("business", "Business lens", true, ""),
          choice("chart", "Chart lens", false, "two-lens-analysis", "That is the wrong lane."),
          choice("neither", "Neither lens", false, "two-lens-analysis", "It clearly belongs to the business side."),
        ],
      },
      {
        id: "support-lens",
        prompt: "A support zone belongs to which lens first?",
        reviewPrompt: "two-lens-analysis",
        explanation: "Support is a chart-structure clue.",
        options: [
          choice("chart", "Chart lens", true, ""),
          choice("business", "Business lens", false, "two-lens-analysis", "That mixes business with chart structure."),
          choice("news", "News lens", false, "two-lens-analysis", "News may matter, but support is still chart structure."),
        ],
      },
      {
        id: "combined-read",
        prompt: "Which combined read is strongest?",
        reviewPrompt: "two-lens-analysis",
        explanation: "Chart first, business second, then combine the two.",
        options: [
          choice("combine", "Read the chart first, then add business context", true, ""),
          choice("replace", "Let one lens replace the other", false, "two-lens-analysis", "That is the shortcut to avoid."),
          choice("business-first", "Skip the chart and start with one metric", false, "two-lens-analysis", "That loses the first clean lens."),
        ],
      },
    ],
    explanation: "The two-lens read works best when the chart and business stay in separate lanes first.",
    reviewPrompt: "two-lens-analysis",
  },
  "putting-it-together-3": {
    question: "Read trend and support together.",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "holds",
        prompt: "Price is still rising and support still holds. What is the stronger read?",
        reviewPrompt: "trend-plus-support",
        explanation: "The stronger read combines a still-healthy trend with a still-respected support area.",
        options: [
          choice("stronger", "A stronger combined chart read", true, ""),
          choice("guarantee", "A guaranteed bounce", false, "trend-plus-support", "Support still never guarantees the next move."),
          choice("weaker", "A weaker read than before", false, "trend-plus-support", "That ignores the still-holding structure."),
        ],
      },
      {
        id: "fails",
        prompt: "Price is still rising, but support breaks. What changed?",
        reviewPrompt: "trend-plus-support",
        explanation: "The structure weakened even if the bigger trend had looked healthy before.",
        options: [
          choice("structure", "The structure weakened", true, ""),
          choice("nothing", "Nothing important changed", false, "trend-plus-support", "Breaking support matters."),
          choice("stronger", "The trend got stronger", false, "trend-plus-support", "That reads the break backward."),
        ],
      },
      {
        id: "overreach",
        prompt: "Which statement overreaches?",
        reviewPrompt: "trend-plus-support",
        explanation: "Support can strengthen a read, but it never turns into certainty.",
        options: [
          choice("guarantee", "Support guarantees the next bounce", true, ""),
          choice("paired", "Trend and support should be read together", false, "trend-plus-support", "That part is correct."),
          choice("structure", "Losing support weakens the read", false, "trend-plus-support", "That is the careful version."),
        ],
      },
    ],
    explanation: "Trend and support work best when they are read together without turning into certainty.",
    reviewPrompt: "trend-plus-support",
  },
  "putting-it-together-4": {
    question: "Judge breakout quality without overreaching.",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "strong-break",
        prompt: "Which move looks stronger?",
        reviewPrompt: "breakout-volume-combo",
        explanation: "The stronger move clears the level and brings more participation with it.",
        options: [
          choice("supported", "The breakout with stronger volume support", true, ""),
          choice("identical", "Any breakout is identical", false, "breakout-volume-combo", "This lesson is about quality differences."),
          choice("quiet", "The quiet poke through the level", false, "breakout-volume-combo", "That is usually the weaker event."),
        ],
      },
      {
        id: "fakeout",
        prompt: "What makes a fakeout feel weaker?",
        reviewPrompt: "breakout-volume-combo",
        explanation: "The move pokes through the level without strong follow-through or confirmation.",
        options: [
          choice("weak", "It clears the level weakly and lacks confirmation", true, ""),
          choice("guarantee", "It guarantees failure", false, "breakout-volume-combo", "Even the weaker read is not a guarantee."),
          choice("same", "It looks the same as a confirmed break", false, "breakout-volume-combo", "The difference should matter."),
        ],
      },
      {
        id: "overreach",
        prompt: "Which summary overreaches?",
        reviewPrompt: "breakout-volume-combo",
        explanation: "Stronger breakout evidence still does not remove uncertainty.",
        options: [
          choice("certain", "Strong volume makes the breakout risk-free", true, ""),
          choice("better", "Strong volume makes the breakout look stronger", false, "breakout-volume-combo", "That is the careful version."),
          choice("compare", "Event quality depends on both the break and the participation", false, "breakout-volume-combo", "That is the point."),
        ],
      },
    ],
    explanation: "Breakout quality comes from the event plus the participation behind it, not from certainty language.",
    reviewPrompt: "breakout-volume-combo",
  },
  "putting-it-together-5": {
    question: "Keep size and growth separate.",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "bigger-company",
        prompt: "Atlas trades at $34 with 3B shares. Nova trades at $62 with 700M shares. Which company is bigger by market cap?",
        reviewPrompt: "size-plus-growth",
        explanation: "Atlas is bigger because the whole-company share base makes its market cap much larger.",
        options: [
          choice("atlas", "Atlas", true, ""),
          choice("nova", "Nova", false, "size-plus-growth", "Higher share price alone does not make Nova bigger."),
        ],
      },
      {
        id: "faster-grower",
        prompt: "Which metric tells you sales speed?",
        reviewPrompt: "size-plus-growth",
        explanation: "Revenue growth is the growth-speed clue, not market cap.",
        options: [
          choice("growth", "Revenue growth", true, ""),
          choice("cap", "Market cap", false, "size-plus-growth", "Market cap answers size, not sales speed."),
          choice("price", "Share price alone", false, "size-plus-growth", "That is the wrong metric."),
        ],
      },
      {
        id: "paired-summary",
        prompt: "Which paired summary is strongest?",
        reviewPrompt: "size-plus-growth",
        explanation: "The best summary holds both truths at once.",
        options: [
          choice("paired", "Atlas is bigger, while Nova is growing faster", true, ""),
          choice("nova-both", "Nova is bigger and growing faster", false, "size-plus-growth", "That collapses size and growth into one claim."),
          choice("same", "Size and growth answer the same question", false, "size-plus-growth", "They do not."),
        ],
      },
    ],
    explanation: "A strong company comparison keeps size and growth in separate lanes.",
    reviewPrompt: "size-plus-growth",
  },
  "putting-it-together-6": {
    question: "Use the ratio, then ask the better question.",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "high-pe",
        prompt: "A higher P/E automatically means what?",
        reviewPrompt: "pe-plus-expectations",
        explanation: "A higher ratio does not become good or bad by itself. It needs context.",
        options: [
          choice("context", "It needs growth or risk context", true, ""),
          choice("quality", "Automatic quality", false, "pe-plus-expectations", "That is the shortcut to avoid."),
          choice("bad", "Automatic overpricing", false, "pe-plus-expectations", "That is too rigid."),
        ],
      },
      {
        id: "low-pe",
        prompt: "A lower P/E automatically means what?",
        reviewPrompt: "pe-plus-expectations",
        explanation: "A lower ratio is still just a clue. It may reflect slower growth, risk, or caution.",
        options: [
          choice("context", "It still needs context", true, ""),
          choice("cheap", "A guaranteed bargain", false, "pe-plus-expectations", "Low is not automatically cheap."),
          choice("quality", "A stronger business", false, "pe-plus-expectations", "That conclusion needs more evidence."),
        ],
      },
      {
        id: "next-question",
        prompt: "What is the next better question?",
        reviewPrompt: "pe-plus-expectations",
        explanation: "The right next question asks what explains the ratio.",
        options: [
          choice("why", "What growth or risk context explains this ratio?", true, ""),
          choice("verdict", "Is this ratio automatically good or bad?", false, "pe-plus-expectations", "That stops too early."),
          choice("ignore", "Can I ignore the rest of the evidence now?", false, "pe-plus-expectations", "No single ratio ends the read."),
        ],
      },
    ],
    explanation: "Ratios point you toward the next better question. They do not finish the read by themselves.",
    reviewPrompt: "pe-plus-expectations",
  },
  "putting-it-together-7": {
    question: "Which pieces belong in the beginner checklist?",
    type: "multiselect",
    options: [
      choice("chart", "Chart read", true, ""),
      choice("business", "Business context", true, ""),
      choice("valuation", "Valuation context", true, ""),
      choice("question", "One open question", true, ""),
      choice("certainty", "Absolute certainty", false, "beginner-checklist", "The checklist should end with honesty, not certainty."),
      choice("target", "A target price first", false, "beginner-checklist", "That is not the disciplined checklist order."),
    ],
    explanation: "A clean checklist keeps chart, business, valuation, and one open question in the final read.",
    reviewPrompt: "beginner-checklist",
    minimumSelections: 4,
  },
  "putting-it-together-8": {
    question: "Catch the weak explanation.",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "overreach-line",
        prompt: "Which line overreaches?",
        reviewPrompt: "weak-explanation",
        explanation: "The weak explanation acts certain from too little evidence.",
        options: [
          choice("overreach", "One clue proves the whole stock case", true, ""),
          choice("careful", "The setup looks stronger, but more context still matters", false, "weak-explanation", "That is the careful version."),
          choice("balanced", "This clue helps, but uncertainty remains", false, "weak-explanation", "That is not the weak line."),
        ],
      },
      {
        id: "strong-explanation",
        prompt: "What makes the stronger explanation stronger?",
        reviewPrompt: "weak-explanation",
        explanation: "Strong reasoning uses several clues and leaves room for uncertainty.",
        options: [
          choice("balanced", "It uses multiple clues and leaves uncertainty", true, ""),
          choice("short", "It is shorter", false, "weak-explanation", "Length is not the main issue."),
          choice("louder", "It sounds more certain", false, "weak-explanation", "That is often the danger sign."),
        ],
      },
      {
        id: "red-flag",
        prompt: "Which phrase is a reasoning red flag?",
        reviewPrompt: "weak-explanation",
        explanation: "Absolute language is the red flag here.",
        options: [
          choice("guarantees", "This guarantees the outcome", true, ""),
          choice("constructive", "This looks constructive so far", false, "weak-explanation", "That is still careful."),
          choice("mixed", "The clues are still mixed", false, "weak-explanation", "That is disciplined language."),
        ],
      },
    ],
    explanation: "Weak explanations usually sound too certain for the amount of evidence behind them.",
    reviewPrompt: "weak-explanation",
  },
  "putting-it-together-9": {
    question: "Which ingredients belong in a clean stock snapshot?",
    type: "multiselect",
    options: [
      choice("chart", "Chart behavior", true, ""),
      choice("business", "One business clue", true, ""),
      choice("valuation", "One valuation clue", true, ""),
      choice("question", "One open question", true, ""),
      choice("certainty", "A certainty claim", false, "guided-stock-snapshot", "The snapshot should not sound complete."),
      choice("target", "A target price", false, "guided-stock-snapshot", "That is not the core snapshot job."),
    ],
    explanation: "A clean stock snapshot keeps the chart, business, valuation, and one open question in view.",
    reviewPrompt: "guided-stock-snapshot",
    minimumSelections: 4,
  },
};

const normalizedFinalPracticePatches: Record<string, Partial<PracticeContent>> = {
  "final-mastery-1": {
    ...activityOnlyPracticePatch("Build the setup view first"),
    mechanicTitle: "Setup evidence board",
    mechanicSummary: "Review the full setup before the mastery check.",
    prompt: "Use the board to hold the chart clue, the business clue, and the caution together.",
    activityKind: "business-builder",
    activityData: {
      variant: "snapshot-board",
      sections: [
        { label: "Chart", value: "Uptrend above support" },
        { label: "Business", value: "Growth still positive" },
        { label: "Caution", value: "Valuation still needs context" },
      ],
    },
  },
  "final-mastery-2": activityOnlyPracticePatch("Sort every clue first"),
  "final-mastery-3": activityOnlyPracticePatch("Sort the next-question clues first"),
  "final-mastery-4": activityOnlyPracticePatch("Diagnose both reasoning clues first"),
  "final-mastery-5": {
    ...activityOnlyPracticePatch("Review the mixed signals first"),
    mechanicTitle: "Mixed-signal board",
    mechanicSummary: "Hold the chart and business conflict together before choosing the read.",
    prompt: "Review the conflicting clues before the mastery check.",
    activityKind: "business-builder",
    activityData: {
      variant: "snapshot-board",
      sections: [
        { label: "Chart", value: "Trend weakened" },
        { label: "Business", value: "Revenue still growing" },
        { label: "Conflict", value: "Near-term and longer-term clues disagree" },
      ],
    },
  },
  "final-mastery-6": {
    activityData: {
      clues: [
        { title: "Chart", detail: "Useful, but not perfect" },
        { title: "Business", detail: "Still supportive" },
        { title: "Valuation", detail: "An open question remains" },
      ],
      bands: [
        { label: "Low", detail: "Too many gaps remain for a strong read" },
        { label: "Lower to moderate", detail: "Helpful clues, but still mixed enough to stay measured" },
        { label: "High", detail: "Clean evidence stack with few open gaps" },
      ],
    },
  },
  "final-mastery-7": {
    ...activityOnlyPracticePatch("Assemble the summary pieces first"),
    mechanicTitle: "Summary structure board",
    mechanicSummary: "Collect the chart, business, valuation, and caution pieces before writing.",
    prompt: "Build the summary ingredients before the writing check.",
    activityKind: "business-builder",
    activityData: {
      variant: "snapshot-board",
      sections: [
        { label: "Chart", value: "Trend still constructive" },
        { label: "Business", value: "Revenue still growing" },
        { label: "Valuation", value: "P/E needs context" },
        { label: "Open question", value: "Does the valuation still fit the setup?" },
      ],
    },
  },
  "final-mastery-8": activityOnlyPracticePatch("Arm the spoken structure first"),
  "final-mastery-9": activityOnlyPracticePatch("Finish the final order first"),
};

const normalizedFinalCheckPatches: Record<string, CheckContent> = {
  "final-mastery-1": {
    question: "Choose the strongest setup read.",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "best-summary",
        prompt: "Which setup summary is strongest?",
        reviewPrompt: "simple-stock-setup",
        explanation: "The stronger read sounds constructive but still careful.",
        options: [
          choice("careful", "The setup looks constructive, but more context still matters", true, ""),
          choice("certain", "The setup guarantees success", false, "simple-stock-setup", "That is too certain."),
          choice("dismissive", "No clue matters here", false, "simple-stock-setup", "That throws away the evidence."),
        ],
      },
      {
        id: "missing-piece",
        prompt: "What cannot be skipped in a strong setup read?",
        reviewPrompt: "simple-stock-setup",
        explanation: "The strong read still leaves room for what is not known yet.",
        options: [
          choice("caution", "One caution point", true, ""),
          choice("prediction", "A price prediction", false, "simple-stock-setup", "That is not the required ingredient."),
          choice("certainty", "Absolute certainty", false, "simple-stock-setup", "That weakens the read."),
        ],
      },
      {
        id: "weak-line",
        prompt: "Which line weakens the setup read?",
        reviewPrompt: "simple-stock-setup",
        explanation: "One clue cannot justify certainty by itself.",
        options: [
          choice("overreach", "One clue explains everything", true, ""),
          choice("balanced", "The setup looks decent, but more context still matters", false, "simple-stock-setup", "That is the careful line."),
          choice("mixed", "There is still some uncertainty in the read", false, "simple-stock-setup", "That is not the weak line."),
        ],
      },
    ],
    explanation: "A strong setup read stays balanced and leaves room for uncertainty.",
    reviewPrompt: "simple-stock-setup",
  },
  "final-mastery-2": {
    question: "Separate what is known from what is still open.",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "known",
        prompt: "“The chart is mostly rising” belongs in which bucket?",
        reviewPrompt: "known-vs-unknown",
        explanation: "That is visible evidence now, so it belongs in Known.",
        options: [
          choice("known", "Known now", true, ""),
          choice("context", "Need more context", false, "known-vs-unknown", "The evidence is already visible."),
          choice("unknown", "Unknown yet", false, "known-vs-unknown", "This is not missing."),
        ],
      },
      {
        id: "context",
        prompt: "“Whether the valuation is justified” belongs in which bucket?",
        reviewPrompt: "known-vs-unknown",
        explanation: "That is the open judgment that still needs more context.",
        options: [
          choice("context", "Need more context", true, ""),
          choice("known", "Known now", false, "known-vs-unknown", "Not yet."),
          choice("unknown", "Unknown yet", false, "known-vs-unknown", "It is not unknowable. It just needs more context."),
        ],
      },
      {
        id: "unknown",
        prompt: "“The next earnings reaction” belongs in which bucket?",
        reviewPrompt: "known-vs-unknown",
        explanation: "That reaction has not happened yet, so it belongs in Unknown.",
        options: [
          choice("unknown", "Unknown yet", true, ""),
          choice("known", "Known now", false, "known-vs-unknown", "No."),
          choice("context", "Need more context", false, "known-vs-unknown", "This is future, not just incomplete."),
        ],
      },
    ],
    explanation: "Strong reasoning keeps visible facts, open questions, and future unknowns separate.",
    reviewPrompt: "known-vs-unknown",
  },
  "final-mastery-3": {
    question: "Choose the next best question.",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "valuation-gap",
        prompt: "The chart is clear, but valuation context is missing. What is the next best question?",
        reviewPrompt: "next-best-question",
        explanation: "The next best question reduces the biggest remaining gap.",
        options: [
          choice("valuation", "What growth or risk context explains this valuation?", true, ""),
          choice("hype", "How fast can it double?", false, "next-best-question", "That chases excitement instead of clarity."),
          choice("certainty", "Can I ignore uncertainty now?", false, "next-best-question", "No."),
        ],
      },
      {
        id: "business-gap",
        prompt: "The chart is readable, but the business quality is unclear. What is the next best question?",
        reviewPrompt: "next-best-question",
        explanation: "A good next question moves into the missing business layer.",
        options: [
          choice("business", "What business clue is still missing here?", true, ""),
          choice("price", "What price target should I use?", false, "next-best-question", "That is not the next clarifying question."),
          choice("hype", "What is the most dramatic outcome?", false, "next-best-question", "That is the weak move."),
        ],
      },
      {
        id: "weak-question",
        prompt: "Which next question is weakest?",
        reviewPrompt: "next-best-question",
        explanation: "The weakest question feeds hype instead of closing the real gap.",
        options: [
          choice("hype", "How fast can this double?", true, ""),
          choice("valuation", "What explains this valuation?", false, "next-best-question", "That can be useful."),
          choice("business", "What business clue is still missing?", false, "next-best-question", "That can be useful too."),
        ],
      },
    ],
    explanation: "The next best question is the one that closes the biggest gap in the read.",
    reviewPrompt: "next-best-question",
  },
  "final-mastery-4": {
    question: "Diagnose the reasoning mistake.",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "breakout-flaw",
        prompt: "“The breakout happened, so nothing can go wrong.” What is the flaw?",
        reviewPrompt: "mistake-diagnosis",
        explanation: "The reasoning became too certain from partial evidence.",
        options: [
          choice("certainty", "Too much certainty from too little evidence", true, ""),
          choice("chart", "Mentioning the chart at all", false, "mistake-diagnosis", "That is not the flaw."),
          choice("short", "Using short sentences", false, "mistake-diagnosis", "Writing style is not the issue."),
        ],
      },
      {
        id: "careful-version",
        prompt: "Which line sounds more careful?",
        reviewPrompt: "mistake-diagnosis",
        explanation: "The careful line uses the clue without turning it into certainty.",
        options: [
          choice("careful", "The breakout helps the read, but more context still matters", true, ""),
          choice("overreach", "The breakout proves the entire case", false, "mistake-diagnosis", "That is the weak line."),
          choice("dismiss", "The chart clue does not matter", false, "mistake-diagnosis", "That is too dismissive."),
        ],
      },
      {
        id: "diagnosis-skill",
        prompt: "What is the best diagnosis move?",
        reviewPrompt: "mistake-diagnosis",
        explanation: "You want to find the useful clue, the missing clue, and the leap in between.",
        options: [
          choice("diagnose", "Find the useful clue, the missing clue, and the leap", true, ""),
          choice("punish", "Punish the wrong answer only", false, "mistake-diagnosis", "That misses the logic problem."),
          choice("ignore", "Ignore the reasoning chain", false, "mistake-diagnosis", "That gives away the real lesson."),
        ],
      },
    ],
    explanation: "The strongest diagnosis names the broken logic, not just the wrong conclusion.",
    reviewPrompt: "mistake-diagnosis",
  },
  "final-mastery-5": {
    question: "Read the mixed signals carefully.",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "weak-chart-strong-business",
        prompt: "The chart weakened, but the business still looks healthy. Which read is strongest?",
        reviewPrompt: "mixed-signals",
        explanation: "The careful read names the near-term chart weakness without erasing the business clue.",
        options: [
          choice("balanced", "The chart looks weaker right now, but the business clue still matters", true, ""),
          choice("erase-chart", "The business clue erases the chart", false, "mixed-signals", "That is too simplistic."),
          choice("erase-business", "The chart erases the business forever", false, "mixed-signals", "That is also too rigid."),
        ],
      },
      {
        id: "strong-chart-weak-business",
        prompt: "The chart looks stronger, but the business picture is weaker. What should happen to confidence?",
        reviewPrompt: "mixed-signals",
        explanation: "Mixed signals call for more caution, not false clarity.",
        options: [
          choice("caution", "Confidence should come down", true, ""),
          choice("max", "Confidence should jump to maximum", false, "mixed-signals", "The conflict should reduce confidence."),
          choice("ignore", "Ignore the business clue", false, "mixed-signals", "That is too clean."),
        ],
      },
      {
        id: "overreach",
        prompt: "Which summary overreaches?",
        reviewPrompt: "mixed-signals",
        explanation: "The weak summary forces one clue to erase the other.",
        options: [
          choice("erase", "One clue erases the conflict completely", true, ""),
          choice("balanced", "The setup has mixed signals, so the read should stay more careful", false, "mixed-signals", "That is the careful version."),
          choice("timing", "The near-term clue may matter more right now, but the other clue still matters", false, "mixed-signals", "That is still disciplined."),
        ],
      },
    ],
    explanation: "Mixed signals require caution, timing awareness, and less confidence.",
    reviewPrompt: "mixed-signals",
  },
  "final-mastery-6": {
    question: "Calibrate confidence to the evidence.",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "mixed-case",
        prompt: "The chart is useful, the business helps, but valuation still needs context. Where should confidence land?",
        reviewPrompt: "confidence-calibration",
        explanation: "Useful clues plus open questions usually means lower to moderate confidence.",
        options: [
          choice("moderate", "Lower to moderate confidence", true, ""),
          choice("max", "Maximum confidence", false, "confidence-calibration", "That overweights the positive clues."),
          choice("zero", "Zero confidence", false, "confidence-calibration", "The evidence still matters."),
        ],
      },
      {
        id: "clean-case",
        prompt: "Chart, business, and valuation all line up cleanly. Which confidence band fits best?",
        reviewPrompt: "confidence-calibration",
        explanation: "Cleaner evidence can justify a higher confidence band.",
        options: [
          choice("high", "Higher confidence", true, ""),
          choice("zero", "Zero confidence", false, "confidence-calibration", "That ignores the quality of the evidence."),
          choice("low", "Low confidence by default", false, "confidence-calibration", "Not if the evidence stack is actually clean."),
        ],
      },
      {
        id: "one-clue",
        prompt: "One clue looks good, but the rest of the read is incomplete. What is the discipline move?",
        reviewPrompt: "confidence-calibration",
        explanation: "Do not let one exciting clue set the whole confidence score.",
        options: [
          choice("measured", "Keep confidence measured", true, ""),
          choice("max", "Jump to maximum confidence", false, "confidence-calibration", "That is the beginner mistake."),
          choice("irrelevant", "Ignore the evidence completely", false, "confidence-calibration", "That goes too far the other way."),
        ],
      },
    ],
    explanation: "Confidence should follow evidence quality, not emotion.",
    reviewPrompt: "confidence-calibration",
  },
  "final-mastery-7": {
    question: "Write the cleanest short stock read.",
    type: "typed",
    explanation: "A strong short read names the chart setup, adds one business or valuation clue, and ends with one honest open question.",
    reviewPrompt: "typed-stock-summary",
    expectedKeywords: ["chart", "growth", "valuation", "question"],
    discouragedKeywords: ["guaranteed", "certain"],
    placeholder:
      "Write 2-4 sentences. Include the chart read, one business or valuation clue, and one open question.",
    coachTip:
      "Tighten it by naming the chart first, then adding one business or valuation clue, then ending with what still needs checking.",
  },
  "final-mastery-8": {
    question: "Write the spoken version as text.",
    type: "typed",
    explanation: "A voice-ready answer still moves in order: chart clue, business or valuation clue, then one caution or next question.",
    reviewPrompt: "voice-ready-reasoning",
    expectedKeywords: ["chart", "business", "caution", "question"],
    discouragedKeywords: ["guaranteed", "certain"],
    placeholder: "Write the spoken version as text. Keep the order calm and clear.",
    coachTip:
      "If it drifts, reset the order: chart first, business or valuation second, caution and next question last.",
    voiceReady: true,
  },
  "final-mastery-9": {
    question: "Which pieces still belong in the final read?",
    type: "multiselect",
    options: [
      choice("chart", "Chart read", true, ""),
      choice("business", "Business clue", true, ""),
      choice("valuation", "Valuation clue", true, ""),
      choice("question", "One open question", true, ""),
      choice("certainty", "Absolute certainty", false, "pre-final-rehearsal", "That should stay out."),
      choice("prediction", "A dramatic prediction", false, "pre-final-rehearsal", "That is not part of the final structure."),
    ],
    explanation: "The final read still needs chart, business, valuation, and one open question.",
    reviewPrompt: "pre-final-rehearsal",
    minimumSelections: 4,
  },
};

for (const [lessonId, patch] of Object.entries(normalizedPuttingPracticePatches)) {
  const lesson = puttingItTogetherLessons[lessonId];

  if (lesson) {
    Object.assign(lesson.practice, patch);
  }
}

for (const [lessonId, check] of Object.entries(normalizedPuttingCheckPatches)) {
  const lesson = puttingItTogetherLessons[lessonId];

  if (lesson) {
    lesson.check = check;
  }
}

for (const [lessonId, patch] of Object.entries(normalizedFinalPracticePatches)) {
  const lesson = finalMasteryLessons[lessonId];

  if (lesson) {
    Object.assign(lesson.practice, patch);
  }
}

for (const [lessonId, check] of Object.entries(normalizedFinalCheckPatches)) {
  const lesson = finalMasteryLessons[lessonId];

  if (lesson) {
    lesson.check = check;
  }
}

export const synthesisAuthoredLessonExperiences: Record<
  string,
  AuthoredLessonExperience
> = {
  ...puttingItTogetherLessons,
  ...finalMasteryLessons,
};
