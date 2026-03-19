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

const trendAndMomentumLessons: Record<string, AuthoredLessonExperience> = {
  "trend-and-momentum-1": lesson(
    "Teach that trend means the dominant direction over time.",
    "You can now name the dominant trend before reacting to details.",
    ["trend-definition", "direction-reading"],
    [
      panel(
        "hook",
        "Start by naming the direction",
        "Sort the mini charts first. Trend is the broad direction price keeps leaning over time.",
        {
          eyebrow: "Hook",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Up", "Down", "Sideways"],
            cards: [
              { id: "up-a", label: "Climbing path", points: [20, 28, 40, 52, 66], target: "Up" },
              { id: "down-a", label: "Sliding path", points: [76, 64, 54, 42, 30], target: "Down" },
              { id: "side-a", label: "Range path", points: [46, 50, 48, 52, 49], target: "Sideways" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "Trend is about the bigger path",
        "A trend summarizes the overall direction. Small pauses do not automatically change it.",
        {
          eyebrow: "Learn",
          activityKind: "chart-lab",
          activityData: {
            variant: "trace-path",
            chartPoints: [18, 24, 34, 30, 44, 54, 66],
            summaryChoices: ["Mostly rising", "Every wiggle matters more", "Guaranteed move"],
          },
          noteLabel: "Why it matters",
          note: "Trend gives you the first clean read. It helps you avoid reacting to the noisiest moment.",
        },
      ),
      panel(
        "mistake",
        "Do not let one wiggle erase the trend",
        "A pullback inside an uptrend is still different from a full downtrend. The job is to read the dominant direction first.",
        {
          eyebrow: "Watch for",
          highlights: [
            "Uptrend = overall higher path.",
            "Downtrend = overall lower path.",
            "Sideways = little net direction.",
          ],
          noteLabel: "Common mistake",
          note: "Beginners often relabel the whole chart from one short pullback or one sharp candle.",
        },
      ),
    ],
    {
      mechanicTitle: "Trend classifier",
      mechanicSummary: "Classify the chart by its dominant direction, not by its noisiest wiggle.",
      prompt: "Which chart shows the clearest dominant trend?",
      question: "Which chart has the clearest dominant uptrend?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Uptrend", "Not uptrend"],
        cards: [
          { id: "trend-up", label: "Higher path", description: "Price keeps lifting overall.", points: [18, 26, 34, 46, 58, 70], target: "Uptrend" },
          { id: "trend-side", label: "Chop", description: "Little net movement.", points: [44, 48, 46, 50, 47, 49], target: "Not uptrend" },
          { id: "trend-down", label: "Lower path", description: "Price keeps slipping overall.", points: [74, 68, 58, 50, 40, 32], target: "Not uptrend" },
        ],
      },
      supportActivities: ["Look at the net path.", "Ignore one noisy swing.", "Name the dominant direction."],
      options: [
        choice("a", "The chart with the higher path over time", true, ""),
        choice("b", "The chart with one dramatic candle", false, "trend-definition", "One dramatic candle is not enough to define the full trend."),
        choice("c", "The chart with no clear net move", false, "trend-definition", "A sideways chart does not give you a dominant uptrend."),
      ],
      explanation: "Correct. Trend is about the overall direction price keeps leaning over time.",
    },
    {
      question: "What does trend mean most directly?",
      type: "multiple",
      options: [
        choice("a", "The dominant direction over time", true, ""),
        choice("b", "A guaranteed next move", false, "trend-definition", "Trend describes direction. It does not guarantee the next move."),
        choice("c", "Only the last candle", false, "trend-definition", "Trend is broader than one candle."),
        choice("d", "The company’s revenue line", false, "trend-definition", "This lesson is about price direction, not revenue."),
      ],
      explanation: "Trend means the dominant direction over time.",
      reviewPrompt: "trend-definition",
    },
  ),
  "trend-and-momentum-2": lesson(
    "Teach the intuition behind higher highs and higher lows.",
    "You can now spot the shape of an uptrend.",
    ["uptrend-basics", "higher-highs"],
    [
      panel(
        "hook",
        "An uptrend usually steps upward in layers",
        "Look at the peaks and pullbacks together. Uptrends often keep making higher highs and higher lows.",
        {
          eyebrow: "Hook",
          activityKind: "chart-lab",
          activityData: {
            variant: "trace-path",
            chartPoints: [20, 34, 28, 46, 38, 58, 48, 70],
            summaryChoices: ["Higher highs and higher lows", "Flat range", "Lower highs"],
          },
        },
      ),
      panel(
        "compare",
        "Compare a healthy climb with a fake one",
        "Sort the charts into real uptrend structure and everything else. The key is the sequence of peaks and pullbacks.",
        {
          eyebrow: "Learn",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Looks like an uptrend", "Does not"],
            cards: [
              { id: "up-good", label: "Higher highs, higher lows", points: [18, 30, 26, 42, 36, 56, 48, 68], target: "Looks like an uptrend" },
              { id: "up-fake", label: "One jump, then drift", points: [24, 50, 30, 32, 34, 36, 38, 40], target: "Does not" },
              { id: "up-down", label: "Lower path", points: [72, 64, 60, 52, 46, 38, 34, 28], target: "Does not" },
            ],
          },
          noteLabel: "Why it matters",
          note: "The shape tells you whether buyers are consistently lifting the chart after pullbacks.",
        },
      ),
      panel(
        "mistake",
        "One jump is not the same as a trend",
        "A chart can spike once without building a durable uptrend structure. The repeated pattern matters.",
        {
          eyebrow: "Watch for",
          highlights: [
            "Higher highs matter.",
            "Higher lows matter too.",
            "Both together build the pattern.",
          ],
          noteLabel: "Common mistake",
          note: "Beginners often confuse one exciting push with a full uptrend.",
        },
      ),
    ],
    {
      mechanicTitle: "Uptrend structure",
      mechanicSummary: "Compare the pattern of peaks and pullbacks, not just one upward burst.",
      prompt: "Which chart looks most like an uptrend?",
      question: "Which chart looks most like an uptrend?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Uptrend", "Not uptrend"],
        cards: [
          { id: "chart-up", label: "Stepping higher", points: [18, 28, 24, 40, 36, 52, 48, 66], target: "Uptrend" },
          { id: "chart-side", label: "Sideways chop", points: [44, 48, 42, 50, 46, 49, 45, 48], target: "Not uptrend" },
          { id: "chart-drop", label: "Rolling lower", points: [70, 62, 58, 50, 44, 38, 34, 30], target: "Not uptrend" },
        ],
      },
      supportActivities: ["Look at the peaks.", "Look at the pullbacks.", "Decide whether the whole structure steps higher."],
      options: [
        choice("a", "The chart with higher highs and higher lows", true, ""),
        choice("b", "The chart with one big spike only", false, "uptrend-basics", "One spike alone is not the same as a clean uptrend structure."),
        choice("c", "The chart that keeps stepping lower", false, "uptrend-basics", "That is the opposite pattern."),
      ],
      explanation: "Right. An uptrend usually looks like higher highs and higher lows.",
    },
    {
      question: "Which pattern best fits an uptrend?",
      type: "multiple",
      options: [
        choice("a", "Higher highs and higher lows", true, ""),
        choice("b", "Lower highs and lower lows", false, "uptrend-basics", "That is downtrend structure."),
        choice("c", "No net movement", false, "uptrend-basics", "That is closer to sideways action."),
        choice("d", "One spike and no follow-through", false, "uptrend-basics", "A single jump is not enough."),
      ],
      explanation: "Higher highs and higher lows is the classic uptrend shape.",
      reviewPrompt: "uptrend-basics",
    },
  ),
  "trend-and-momentum-3": lesson(
    "Teach the intuition behind lower highs and lower lows.",
    "You can now spot the shape of a downtrend.",
    ["downtrend-basics", "lower-highs"],
    [
      panel(
        "hook",
        "A downtrend keeps failing lower",
        "Watch how each rally stalls beneath the last one and each drop stretches lower.",
        {
          eyebrow: "Hook",
          activityKind: "chart-lab",
          activityData: {
            variant: "trace-path",
            chartPoints: [72, 64, 68, 56, 60, 46, 50, 36],
            summaryChoices: ["Lower highs and lower lows", "Higher highs", "Mostly flat"],
          },
        },
      ),
      panel(
        "compare",
        "Compare real weakness with noisy sideways action",
        "Sort the charts into real downtrend structure and everything else.",
        {
          eyebrow: "Learn",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Looks like a downtrend", "Does not"],
            cards: [
              { id: "down-good", label: "Failing lower", points: [78, 66, 70, 58, 60, 44, 46, 34], target: "Looks like a downtrend" },
              { id: "down-flat", label: "Back-and-forth range", points: [52, 48, 54, 50, 53, 49, 51, 48], target: "Does not" },
              { id: "down-up", label: "Climbing path", points: [18, 24, 32, 40, 46, 58, 66, 76], target: "Does not" },
            ],
          },
          noteLabel: "Why it matters",
          note: "A downtrend is a repeated failure pattern, not just one red move.",
        },
      ),
      panel(
        "mistake",
        "A bounce inside weakness does not erase the trend",
        "Short rallies happen inside downtrends. The bigger pattern still matters most.",
        {
          eyebrow: "Watch for",
          highlights: [
            "Lower highs show weaker rallies.",
            "Lower lows show deeper selling.",
            "Both together confirm the path.",
          ],
          noteLabel: "Common mistake",
          note: "Beginners often mistake a bounce for a full reversal before the structure actually changes.",
        },
      ),
    ],
    {
      mechanicTitle: "Downtrend structure",
      mechanicSummary: "Judge the sequence of failed rallies and lower pushes, not just one down day.",
      prompt: "Which chart looks most like a downtrend?",
      question: "Which chart looks most like a downtrend?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Downtrend", "Not downtrend"],
        cards: [
          { id: "down-1", label: "Repeated failures", points: [76, 64, 70, 56, 60, 42, 46, 30], target: "Downtrend" },
          { id: "down-2", label: "Range", points: [48, 50, 46, 52, 47, 51, 48, 49], target: "Not downtrend" },
          { id: "down-3", label: "Stepping higher", points: [22, 28, 26, 40, 36, 54, 48, 66], target: "Not downtrend" },
        ],
      },
      supportActivities: ["Check the rallies.", "Check the lows.", "Decide whether the whole path keeps failing lower."],
      options: [
        choice("a", "The chart with lower highs and lower lows", true, ""),
        choice("b", "The chart with one red candle only", false, "downtrend-basics", "One red candle alone does not define the whole trend."),
        choice("c", "The chart that keeps stepping higher", false, "downtrend-basics", "That is the opposite structure."),
      ],
      explanation: "Correct. A downtrend usually shows lower highs and lower lows.",
    },
    {
      question: "Which pattern best fits a downtrend?",
      type: "multiple",
      options: [
        choice("a", "Lower highs and lower lows", true, ""),
        choice("b", "Higher highs and higher lows", false, "downtrend-basics", "That describes an uptrend."),
        choice("c", "No net movement", false, "downtrend-basics", "That is closer to sideways action."),
        choice("d", "One bounce after a drop", false, "downtrend-basics", "A bounce alone is not enough."),
      ],
      explanation: "Lower highs and lower lows is the classic downtrend shape.",
      reviewPrompt: "downtrend-basics",
    },
  ),
  "trend-and-momentum-4": lesson(
    "Teach how to identify sideways movement.",
    "You can now recognize when a chart has little directional conviction.",
    ["sideways-movement", "trend-absence"],
    [
      panel(
        "hook",
        "Sometimes the best trend label is: there is no clean trend",
        "Sort the mini charts and notice which one keeps moving around without going anywhere important.",
        {
          eyebrow: "Hook",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Sideways", "Trending"],
            cards: [
              { id: "sideways", label: "Range", points: [48, 52, 47, 51, 49, 50, 48], target: "Sideways" },
              { id: "trend-up", label: "Rise", points: [20, 28, 36, 44, 56, 68, 78], target: "Trending" },
              { id: "trend-down", label: "Slide", points: [76, 68, 62, 54, 46, 38, 32], target: "Trending" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "Sideways means little net progress",
        "The chart can still wiggle, but it finishes near the same general area instead of building a stronger directional path.",
        {
          eyebrow: "Learn",
          activityKind: "chart-lab",
          activityData: {
            variant: "trace-path",
            chartPoints: [48, 52, 46, 54, 49, 51, 47, 50],
            summaryChoices: ["Little net movement", "Strong trend", "Guaranteed breakout"],
          },
          noteLabel: "Why it matters",
          note: "Naming sideways movement correctly keeps you from inventing a trend that is not really there.",
        },
      ),
      panel(
        "mistake",
        "Noise is not conviction",
        "A chart can be busy without being directional. Activity alone does not make a real trend.",
        {
          eyebrow: "Watch for",
          highlights: [
            "Sideways charts still move.",
            "They just do not make strong directional progress.",
            "That matters before any bigger interpretation.",
          ],
          noteLabel: "Common mistake",
          note: "Beginners often treat a busy sideways chart as if it must secretly be trending.",
        },
      ),
    ],
    {
      mechanicTitle: "Sideways detector",
      mechanicSummary: "Look for little net movement rather than the busiest-looking chart.",
      prompt: "Which chart shows the least directional conviction?",
      question: "What best describes a chart with little overall directional progress?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Sideways", "Trending"],
        cards: [
          { id: "s-1", label: "Busy range", points: [50, 54, 48, 52, 46, 51, 49, 50], target: "Sideways" },
          { id: "s-2", label: "Steady rise", points: [18, 26, 34, 42, 52, 62, 74, 84], target: "Trending" },
          { id: "s-3", label: "Rolling lower", points: [80, 70, 64, 56, 48, 40, 34, 28], target: "Trending" },
        ],
      },
      supportActivities: ["Ignore how busy it feels.", "Look for net progress.", "Name the lack of trend honestly."],
      options: [
        choice("a", "Sideways movement", true, ""),
        choice("b", "Guaranteed reversal", false, "sideways-movement", "Sideways action does not guarantee a reversal."),
        choice("c", "Strong uptrend", false, "sideways-movement", "Little net movement is not a strong uptrend."),
        choice("d", "Strong downtrend", false, "sideways-movement", "Little net movement is not a strong downtrend."),
      ],
      explanation: "Right. Little net movement is best described as sideways.",
    },
    {
      question: "What best describes this chart?",
      type: "multiple",
      options: [
        choice("a", "Sideways movement", true, ""),
        choice("b", "Strong trend", false, "sideways-movement", "There is not enough directional progress for that label."),
        choice("c", "Guaranteed breakout", false, "sideways-movement", "A sideways chart does not guarantee the next event."),
        choice("d", "Certain reversal", false, "sideways-movement", "That would overclaim what you know."),
      ],
      explanation: "The cleaner read is sideways movement.",
      reviewPrompt: "sideways-movement",
    },
  ),
  "trend-and-momentum-5": lesson(
    "Teach the difference between noise and the bigger directional path.",
    "You can now separate the wiggles from the broader trend.",
    ["noise-vs-trend", "context-first"],
    [
      panel(
        "hook",
        "Toggle the same move between noisy and clean",
        "The noisy view has more wiggles, but the broader trend can stay the same.",
        {
          eyebrow: "Hook",
          activityKind: "chart-lab",
          activityData: {
            variant: "noise-toggle",
            noisyPoints: [26, 40, 32, 48, 38, 58, 50, 70],
            smoothPoints: [30, 36, 42, 48, 54, 60, 66, 72],
          },
        },
      ),
      panel(
        "learn",
        "The bigger direction should survive the noise",
        "A good summary still works after the wiggles are simplified. That is how you know you are reading the larger move.",
        {
          eyebrow: "Learn",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Trend summary", "Noise detail"],
            cards: [
              { id: "summary", label: "Mostly rising over time", target: "Trend summary" },
              { id: "wiggle", label: "One small pullback in the middle", target: "Noise detail" },
              { id: "summary2", label: "Broad path keeps lifting", target: "Trend summary" },
            ],
          },
          noteLabel: "Why it matters",
          note: "The larger summary is usually more useful to a beginner than the smallest fluctuation.",
        },
      ),
      panel(
        "mistake",
        "Do not let one wiggle rewrite the chart",
        "Small fluctuations matter later. The first job is to see the broad move clearly.",
        {
          eyebrow: "Watch for",
          highlights: [
            "Noise can look dramatic.",
            "Trend is the broader direction.",
            "Summary should survive the wiggles.",
          ],
          noteLabel: "Common mistake",
          note: "If every wiggle changes your label, you are probably reading noise instead of trend.",
        },
      ),
    ],
    {
      mechanicTitle: "Noise filter",
      mechanicSummary: "Toggle the chart and keep the broader summary stable while the wiggles change.",
      prompt: "Which summary survives after the noise is simplified?",
      question: "Which is the better trend summary?",
      activityKind: "chart-lab",
      activityData: {
        variant: "noise-toggle",
        noisyPoints: [24, 42, 30, 46, 38, 60, 48, 72],
        smoothPoints: [28, 34, 40, 46, 52, 58, 64, 70],
      },
      supportActivities: ["View the noisy path.", "Switch to the cleaner path.", "Keep the same broad label if it still fits."],
      options: [
        choice("a", "Mostly rising over time", true, ""),
        choice("b", "Every wiggle changes the whole trend", false, "noise-vs-trend", "That gives too much weight to small moves."),
        choice("c", "The chart cannot be summarized at all", false, "noise-vs-trend", "It still has a readable bigger direction."),
      ],
      explanation: "Correct. The better trend summary focuses on the broader direction, not every wiggle.",
    },
    {
      question: "Which is the better trend summary?",
      type: "multiple",
      options: [
        choice("a", "Mostly rising over time", true, ""),
        choice("b", "Every wiggle must be equally important", false, "noise-vs-trend", "That makes the chart harder to read than it needs to be."),
        choice("c", "The chart has no readable direction", false, "noise-vs-trend", "The broader move is still visible."),
        choice("d", "Noise matters more than context", false, "noise-vs-trend", "Beginners should usually start with context first."),
      ],
      explanation: "A broad summary is better than reacting to each small fluctuation.",
      reviewPrompt: "noise-vs-trend",
    },
  ),
  "trend-and-momentum-6": lesson(
    "Teach how to compare stronger and weaker trend quality.",
    "You can now compare trend quality instead of just naming direction.",
    ["trend-quality", "stronger-vs-weaker"],
    [
      panel(
        "hook",
        "Not all uptrends feel equally healthy",
        "Rank the charts by quality. Some trends continue more cleanly than others.",
        {
          eyebrow: "Hook",
          activityKind: "sequence-lab",
          activityData: {
            steps: [
              { id: "weak", label: "Weak trend", description: "Choppy lift with loose pullbacks.", points: [20, 30, 24, 36, 28, 40, 34, 44] },
              { id: "medium", label: "Steadier trend", description: "Pullbacks happen, but the chart keeps stepping higher.", points: [18, 28, 24, 38, 34, 48, 44, 58] },
              { id: "strong", label: "Strong trend", description: "Clear follow-through with controlled pullbacks.", points: [16, 28, 24, 40, 36, 56, 50, 70] },
            ],
            orderedSteps: [
              { id: "1", label: "Weakest" },
              { id: "2", label: "Middle" },
              { id: "3", label: "Strongest" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "Trend quality is about continuation",
        "A stronger trend tends to keep following through instead of stalling or falling apart quickly.",
        {
          eyebrow: "Learn",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Stronger continuation", "Weaker continuation"],
            cards: [
              { id: "clean", label: "Controlled pullbacks, fresh highs", points: [18, 30, 26, 42, 38, 56, 50, 68], target: "Stronger continuation" },
              { id: "messy", label: "Choppy path, weak follow-through", points: [24, 34, 26, 36, 28, 38, 30, 40], target: "Weaker continuation" },
            ],
          },
          noteLabel: "Why it matters",
          note: "Trend direction is step one. Trend quality helps you judge how convincing that direction looks.",
        },
      ),
      panel(
        "mistake",
        "Direction alone is not enough",
        "Two charts can both rise, but one can do it with much weaker follow-through.",
        {
          eyebrow: "Watch for",
          highlights: [
            "Cleaner continuation often looks stronger.",
            "Messier follow-through often looks weaker.",
            "Both can still point the same direction.",
          ],
          noteLabel: "Common mistake",
          note: "Beginners sometimes stop after naming the direction and miss the quality of the move.",
        },
      ),
    ],
    {
      mechanicTitle: "Trend quality rank",
      mechanicSummary: "Compare three trend paths and rank them by continuation quality.",
      prompt: "Which move shows stronger continuation?",
      question: "Which move shows stronger continuation?",
      activityKind: "sequence-lab",
      activityData: {
        steps: [
          { id: "weaker", label: "Choppy rise", description: "The path rises, but it struggles often.", points: [20, 32, 26, 38, 30, 42, 34, 46] },
          { id: "stronger", label: "Clean rise", description: "The path keeps following through after pullbacks.", points: [18, 30, 26, 42, 38, 58, 52, 72] },
          { id: "middle", label: "Moderate rise", description: "Some continuation, but not the cleanest.", points: [18, 28, 24, 38, 34, 50, 46, 60] },
        ],
      },
      supportActivities: ["Compare continuation.", "Notice how each pullback behaves.", "Rank the quality, not just the direction."],
      options: [
        choice("a", "The cleaner rise with better follow-through", true, ""),
        choice("b", "The messiest rise with weak follow-through", false, "trend-quality", "A weaker continuation path is not the stronger trend."),
        choice("c", "The chart with the most noise only", false, "trend-quality", "Noise alone does not make a stronger trend."),
      ],
      explanation: "Correct. Stronger continuation usually looks cleaner and more consistent.",
    },
    {
      question: "Which move shows stronger continuation?",
      type: "multiple",
      options: [
        choice("a", "The cleaner rise with better follow-through", true, ""),
        choice("b", "The messiest rise with weak follow-through", false, "trend-quality", "That reflects weaker trend quality."),
        choice("c", "The noisiest move by itself", false, "trend-quality", "Noise is not the same as quality."),
        choice("d", "Any rise is equally strong", false, "trend-quality", "Direction and quality are different ideas."),
      ],
      explanation: "A stronger trend is usually the one with cleaner follow-through.",
      reviewPrompt: "trend-quality",
    },
  ),
  "trend-and-momentum-7": lesson(
    "Teach momentum as the pace of a move.",
    "You can now compare how forcefully two moves are rising.",
    ["momentum-pace", "slope-comparison"],
    [
      panel(
        "hook",
        "Momentum is about pace, not just direction",
        "Rank the rises by speed. Steeper moves usually cover more price distance in the same span.",
        {
          eyebrow: "Hook",
          activityKind: "sequence-lab",
          activityData: {
            steps: [
              { id: "slow", label: "Slow pace", description: "Climbing with a gentle slope.", points: [34, 38, 42, 46, 51, 56] },
              { id: "medium", label: "Medium pace", description: "Still controlled, but quicker.", points: [24, 34, 44, 54, 64, 74] },
              { id: "fast", label: "Fast pace", description: "The move accelerates sharply upward.", points: [14, 28, 46, 64, 82, 92] },
            ],
            orderedSteps: [
              { id: "1", label: "Slowest" },
              { id: "2", label: "Middle" },
              { id: "3", label: "Fastest" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "Steeper often means faster",
        "Two charts can both trend upward, but one can still show much more urgency.",
        {
          eyebrow: "Learn",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Stronger pace", "Softer pace"],
            cards: [
              { id: "steep", label: "Steep climb", points: [18, 32, 50, 70, 88], target: "Stronger pace" },
              { id: "gentle", label: "Gentle climb", points: [36, 40, 44, 48, 52], target: "Softer pace" },
            ],
          },
          noteLabel: "Why it matters",
          note: "Momentum helps you read how forceful the move feels, not just where it points.",
        },
      ),
      panel(
        "mistake",
        "Upward is not the same as powerful",
        "Direction tells you where the chart is going. Momentum tells you how fast it seems to be getting there.",
        {
          eyebrow: "Watch for",
          highlights: [
            "Both charts can rise.",
            "One can still be clearly faster.",
            "Pace is part of the read.",
          ],
          noteLabel: "Common mistake",
          note: "Beginners often stop at “up” and miss whether the move looks forceful or gentle.",
        },
      ),
    ],
    {
      mechanicTitle: "Momentum compare",
      mechanicSummary: "Compare the slope of the rises and decide which one has stronger pace.",
      prompt: "Which trend has stronger momentum?",
      question: "Which trend has stronger momentum?",
      activityKind: "sequence-lab",
      activityData: {
        steps: [
          { id: "gentle", label: "Gentle rise", description: "Upward but slower.", points: [34, 38, 42, 46, 50, 54] },
          { id: "steep", label: "Steeper rise", description: "Covering more ground quickly.", points: [16, 28, 44, 60, 76, 92] },
          { id: "middle", label: "Moderate rise", description: "In between the two.", points: [24, 34, 42, 52, 62, 72] },
        ],
      },
      supportActivities: ["Look at steepness.", "Compare the same direction at different speeds.", "Choose the stronger pace."],
      options: [
        choice("a", "The steeper rise", true, ""),
        choice("b", "The flattest line", false, "momentum-pace", "The flatter line suggests slower pace, not stronger momentum."),
        choice("c", "Any rise is equally forceful", false, "momentum-pace", "Direction and pace are different."),
      ],
      explanation: "Right. The steeper rise usually shows stronger momentum.",
    },
    {
      question: "Which trend has stronger momentum?",
      type: "multiple",
      options: [
        choice("a", "The steeper rise", true, ""),
        choice("b", "The flattest line", false, "momentum-pace", "That is the softer pace."),
        choice("c", "Any rise is equal", false, "momentum-pace", "Some rises clearly move faster than others."),
        choice("d", "The oldest data point", false, "momentum-pace", "Age does not tell you pace."),
      ],
      explanation: "Steeper upward movement is the cleaner momentum clue.",
      reviewPrompt: "momentum-pace",
    },
  ),
  "trend-and-momentum-8": lesson(
    "Teach that momentum can fade even while direction remains similar.",
    "You can now spot when a move is still rising but losing force.",
    ["momentum-fading", "pace-change"],
    [
      panel(
        "hook",
        "The move can keep going while its pace cools",
        "Scrub through the move and watch the pace meter change. Direction can stay up even as force fades.",
        {
          eyebrow: "Hook",
          activityKind: "chart-lab",
          activityData: {
            variant: "momentum-fade",
            frames: [
              { label: "Fast start", points: [16, 34, 56, 74, 90], meter: "Strong pace" },
              { label: "Cooling", points: [16, 34, 56, 68, 78], meter: "Cooling pace" },
              { label: "Fading", points: [16, 34, 56, 62, 68], meter: "Fading pace" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "Momentum fading does not always mean reversal",
        "A chart can still rise while doing so with less urgency. That is why pace and direction should be separated.",
        {
          eyebrow: "Learn",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Direction clue", "Pace clue"],
            cards: [
              { id: "rise", label: "Still making higher points", target: "Direction clue" },
              { id: "slow", label: "Slope becoming less steep", target: "Pace clue" },
              { id: "force", label: "Move feels less urgent", target: "Pace clue" },
            ],
          },
          noteLabel: "Why it matters",
          note: "This keeps you from confusing slower pace with immediate reversal.",
        },
      ),
      panel(
        "mistake",
        "Do not treat every slowdown like the trend is over",
        "Momentum fading changes the quality of the move, but it does not automatically erase the direction.",
        {
          eyebrow: "Watch for",
          highlights: [
            "Direction can continue.",
            "Momentum can still cool.",
            "Those are different readings.",
          ],
          noteLabel: "Common mistake",
          note: "Beginners often overreact to the first sign of slowdown.",
        },
      ),
    ],
    {
      mechanicTitle: "Momentum fade replay",
      mechanicSummary: "Replay the move and identify what changed: the direction, the pace, or both.",
      prompt: "What changed here?",
      question: "What changed most clearly here?",
      activityKind: "chart-lab",
      activityData: {
        variant: "momentum-fade",
        frames: [
          { label: "Fast start", points: [18, 36, 58, 76, 90], meter: "Strong pace" },
          { label: "Cooling", points: [18, 36, 58, 70, 80], meter: "Cooling pace" },
          { label: "Fading", points: [18, 36, 58, 64, 70], meter: "Fading pace" },
        ],
      },
      supportActivities: ["Replay the move.", "Watch the pace meter.", "Separate direction from urgency."],
      options: [
        choice("a", "Momentum faded", true, ""),
        choice("b", "The chart instantly reversed", false, "momentum-fading", "The chart can still be rising even while momentum fades."),
        choice("c", "The company disappeared", false, "momentum-fading", "This lesson is about chart behavior, not that kind of event."),
      ],
      explanation: "Correct. The clearest change is that momentum faded even though the move did not fully reverse.",
    },
    {
      question: "What changed most clearly here?",
      type: "multiple",
      options: [
        choice("a", "Momentum faded", true, ""),
        choice("b", "The move reversed instantly", false, "momentum-fading", "The pace cooled, but the path did not fully reverse."),
        choice("c", "The chart stopped existing", false, "momentum-fading", "That is not what the chart is showing."),
        choice("d", "Nothing changed", false, "momentum-fading", "The pace shift is the important clue."),
      ],
      explanation: "Momentum fading is the better reading here.",
      reviewPrompt: "momentum-fading",
    },
  ),
  "trend-and-momentum-9": lesson(
    "Teach that a beginner should identify trend before getting lost in details.",
    "You now know the right order: trend first, details second.",
    ["analysis-order", "trend-first"],
    [
      panel(
        "hook",
        "Build the beginner analysis order",
        "Start with the broad chart context before drilling into specific details or predictions.",
        {
          eyebrow: "Hook",
          activityKind: "sequence-lab",
          activityData: {
            steps: [
              { id: "trend", label: "Identify the trend", description: "Get the broad direction first." },
              { id: "detail", label: "Inspect the details", description: "Look at structure after context is clear." },
              { id: "predict", label: "Jump to a conclusion", description: "This should come last, if at all." },
            ],
            orderedSteps: [
              { id: "1", label: "First" },
              { id: "2", label: "Then" },
              { id: "3", label: "Last" },
            ],
          },
        },
      ),
      panel(
        "learn",
        "Trend gives you the map",
        "Without the bigger map, details can feel more important than they really are.",
        {
          eyebrow: "Learn",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Good first step", "Too early"],
            cards: [
              { id: "trend-first", label: "Name the trend", target: "Good first step" },
              { id: "predict-first", label: "Predict the next move immediately", target: "Too early" },
              { id: "context-first", label: "Get broad context", target: "Good first step" },
            ],
          },
          noteLabel: "Why it matters",
          note: "The better your first read, the less likely you are to overreact to a small detail.",
        },
      ),
      panel(
        "mistake",
        "Do not let one detail become the whole story",
        "A chart detail can matter, but only after the broader structure is understood.",
        {
          eyebrow: "Watch for",
          highlights: [
            "Context first.",
            "Details second.",
            "Prediction last and careful.",
          ],
          noteLabel: "Common mistake",
          note: "Beginners often jump to a prediction before they have even named the broader trend.",
        },
      ),
    ],
    {
      mechanicTitle: "Trend-first order",
      mechanicSummary: "Sequence the analysis steps so the broad trend comes before detail and prediction.",
      prompt: "What should a beginner look for first?",
      question: "What should a beginner look for first?",
      activityKind: "sequence-lab",
      activityData: {
        steps: [
          { id: "trend-first", label: "Identify the trend", description: "Get the broad path first." },
          { id: "detail-second", label: "Inspect details", description: "Only after context is clear." },
          { id: "conclusion-last", label: "Form a careful conclusion", description: "After reading the evidence." },
        ],
      },
      supportActivities: ["Put trend first.", "Leave detail second.", "Save the conclusion for last."],
      options: [
        choice("a", "Identify the trend first", true, ""),
        choice("b", "Jump straight to a prediction", false, "analysis-order", "Prediction should not come before context."),
        choice("c", "Ignore the broad chart", false, "analysis-order", "The broad chart is the first map."),
      ],
      explanation: "Correct. A beginner should identify the trend first.",
    },
    {
      question: "What should a beginner look for first?",
      type: "multiple",
      options: [
        choice("a", "The broad trend", true, ""),
        choice("b", "One tiny detail", false, "analysis-order", "A tiny detail is not the best first step."),
        choice("c", "A certain prediction", false, "analysis-order", "Certainty should not come first."),
        choice("d", "Ignore the chart entirely", false, "analysis-order", "The chart still gives you the first context."),
      ],
      explanation: "The broad trend should come first.",
      reviewPrompt: "analysis-order",
    },
  ),
  "trend-and-momentum-10": lesson(
    "Combine trend direction, strength, pace, noise, and careful interpretation.",
    "Trend & Momentum complete.",
    ["trend-definition", "trend-quality", "momentum-pace", "noise-vs-trend"],
    [
      panel(
        "hook",
        "Run a full trend clinic",
        "Use the chart and clue cards together. This checkpoint is about reading direction, pace, noise, and caution in one flow.",
        {
          eyebrow: "Boss setup",
          activityKind: "chart-lab",
          activityData: {
            variant: "trend-clinic",
            chartPoints: [22, 30, 40, 36, 50, 60, 56, 70],
            clues: [
              { title: "Direction", detail: "Mostly rising" },
              { title: "Pace", detail: "Moderate to strong" },
              { title: "Noise", detail: "Pullbacks do not break the trend" },
            ],
          },
        },
      ),
      panel(
        "compare",
        "Check whether the broad read survives the noise",
        "Toggle between noisy and cleaner views. If the broad summary stays intact, you are reading the right thing.",
        {
          eyebrow: "Learn",
          activityKind: "chart-lab",
          activityData: {
            variant: "noise-toggle",
            noisyPoints: [22, 36, 28, 44, 38, 56, 50, 70],
            smoothPoints: [26, 32, 38, 44, 50, 56, 62, 68],
          },
          noteLabel: "Why it matters",
          note: "Boss lessons should feel like synthesis, not isolated definitions.",
        },
      ),
      panel(
        "apply",
        "Finish with the careful takeaway",
        "The final read should name direction, pace, and noise without pretending the future is guaranteed.",
        {
          eyebrow: "Careful interpretation",
          activityKind: "bucket-sort",
          activityData: {
            buckets: ["Careful takeaway", "Overreach"],
            cards: [
              { id: "careful", label: "Mostly rising, decent pace, but still noisy and uncertain.", target: "Careful takeaway" },
              { id: "overreach", label: "Strong trend means it must keep running.", target: "Overreach" },
              { id: "careful2", label: "Trend first, then pace, then caution.", target: "Careful takeaway" },
            ],
          },
        },
      ),
    ],
    {
      mechanicTitle: "Trend clinic",
      mechanicSummary: "Combine direction, pace, and noise into one cleaner diagnosis.",
      prompt: "Work through the chart before you choose the best final interpretation.",
      question: "What is the strongest diagnosis of this chart?",
      activityKind: "chart-lab",
      activityData: {
        variant: "trend-clinic",
        chartPoints: [20, 28, 38, 34, 48, 58, 54, 68],
        clues: [
          { title: "Direction", detail: "Upward bias" },
          { title: "Pace", detail: "Decent follow-through" },
          { title: "Noise", detail: "Minor pullbacks only" },
        ],
      },
      supportActivities: ["Read direction.", "Judge pace.", "Keep noise in the right place."],
      options: [
        choice("a", "Mostly rising with decent pace, but still not certainty", true, ""),
        choice("b", "Guaranteed continuation", false, "trend-boss", "A strong read still should not turn into certainty."),
        choice("c", "No direction at all", false, "trend-boss", "The chart still shows a clearer upward bias than that."),
      ],
      explanation: "Correct. The best read keeps the direction and pace while staying careful about uncertainty.",
    },
    {
      question: "Which final takeaway is most careful?",
      type: "multiple",
      options: [
        choice("a", "Mostly rising with decent pace, but still uncertain", true, ""),
        choice("b", "Strong trend means guaranteed gains", false, "trend-boss", "That drops the caution the lesson is trying to build."),
        choice("c", "The chart tells you nothing at all", false, "trend-boss", "It does tell you useful things about direction and pace."),
        choice("d", "Noise matters more than trend", false, "trend-boss", "The boss lesson is about keeping the larger read first."),
      ],
      explanation: "The strongest final takeaway keeps both the chart read and the uncertainty.",
      reviewPrompt: "trend-boss",
    },
  ),
};

const supportAndResistanceLessons: Record<string, AuthoredLessonExperience> = {
  "support-and-resistance-1": lesson(
    "Teach that support is an area where price has often stopped falling and reacted upward.",
    "You can now spot a basic support area.",
    ["support-basics", "reaction-zones"],
    [
      panel("hook", "Look for the lower reaction area", "Support is an area where price often stops falling and reacts upward.", {
        eyebrow: "Hook",
        activityKind: "zone-map",
        activityData: {
          variant: "chart-zones",
          chartPoints: [68, 56, 44, 30, 36, 48, 42, 58],
          candidates: [
            { id: "upper", label: "Upper band", top: 24, height: 24 },
            { id: "middle", label: "Middle band", top: 56, height: 24 },
            { id: "support", label: "Support area", top: 92, height: 24 },
          ],
        },
      }),
      panel("learn", "Support is a zone, not a promise", "The area matters because price reacted there before. It does not guarantee the next bounce.", {
        eyebrow: "Learn",
        activityKind: "chart-lab",
        activityData: {
          variant: "reaction-replay",
          zone: { top: 94, height: 22, label: "Support zone" },
          stages: [
            { label: "Approach", points: [68, 56, 44, 34, 30], note: "Price moves down into the zone." },
            { label: "Touch", points: [68, 56, 44, 34, 30, 32], note: "Price meets the support area." },
            { label: "Bounce", points: [68, 56, 44, 34, 30, 38, 48], note: "Buyers react and price bounces." },
          ],
        },
        noteLabel: "Why it matters",
        note: "Support is useful because it organizes the chart around prior reactions.",
      }),
      panel("mistake", "Do not treat support like a magic floor", "A support area is worth attention, not certainty.", {
        eyebrow: "Watch for",
        highlights: ["Support is an area.", "The reaction matters.", "It can still fail."],
        noteLabel: "Common mistake",
        note: "Beginners often draw one perfect line and expect the chart to obey it exactly.",
      }),
    ],
    {
      mechanicTitle: "Support zone picker",
      mechanicSummary: "Mark the area where price repeatedly stopped falling and reacted upward.",
      prompt: "Which zone looks most like support?",
      question: "Which area looks most like support?",
      activityKind: "zone-map",
      activityData: {
        variant: "chart-zones",
        chartPoints: [70, 58, 42, 30, 34, 50, 44, 60],
        candidates: [
          { id: "top", label: "Upper band", top: 22, height: 24 },
          { id: "middle", label: "Middle band", top: 58, height: 24 },
          { id: "support", label: "Lower support", top: 94, height: 24 },
        ],
      },
      supportActivities: ["Look where price stopped falling.", "Choose the reaction area.", "Think in zones, not razor-thin lines."],
      options: [
        choice("a", "The lower area where price bounced", true, ""),
        choice("b", "The middle area with no reaction", false, "support-basics", "Support is about repeated reaction, not any random band."),
        choice("c", "The very top of the chart", false, "support-basics", "That would not describe support in this example."),
      ],
      explanation: "Correct. Support is the lower reaction area where price repeatedly stopped falling.",
    },
    {
      question: "What is support?",
      type: "multiple",
      options: [
        choice("a", "An area where price often stops falling and reacts", true, ""),
        choice("b", "A guarantee price can never drop lower", false, "support-basics", "Support is an area of interest, not a guarantee."),
        choice("c", "A company revenue number", false, "support-basics", "Support is a chart concept, not a business metric."),
        choice("d", "The exact future low", false, "support-basics", "Support does not predict the exact future low."),
      ],
      explanation: "Support is an area where price often stops falling and reacts.",
      reviewPrompt: "support-basics",
    },
  ),
  "support-and-resistance-2": lesson(
    "Teach that resistance is an area where price often struggles upward.",
    "You can now spot a basic resistance area.",
    ["resistance-basics", "reaction-zones"],
    [
      panel("hook", "Look for the upper reaction area", "Resistance is where price often struggles upward and turns back down.", {
        eyebrow: "Hook",
        activityKind: "zone-map",
        activityData: {
          variant: "chart-zones",
          chartPoints: [28, 40, 52, 66, 60, 68, 58, 48],
          candidates: [
            { id: "support", label: "Lower band", top: 98, height: 22 },
            { id: "middle", label: "Middle band", top: 60, height: 24 },
            { id: "resistance", label: "Resistance area", top: 22, height: 24 },
          ],
        },
      }),
      panel("learn", "Resistance is where buyers have struggled to push through", "That repeated hesitation matters because it shows where supply has been stronger.", {
        eyebrow: "Learn",
        activityKind: "chart-lab",
        activityData: {
          variant: "reaction-replay",
          zone: { top: 26, height: 22, label: "Resistance zone" },
          stages: [
            { label: "Approach", points: [26, 38, 50, 60, 66], note: "Price rises into the resistance area." },
            { label: "Test", points: [26, 38, 50, 60, 66, 64], note: "Price tests the zone." },
            { label: "Rejection", points: [26, 38, 50, 60, 66, 58, 46], note: "Price turns back lower from resistance." },
          ],
        },
        noteLabel: "Why it matters",
        note: "Resistance helps you identify where upward progress has repeatedly stalled.",
      }),
      panel("mistake", "Do not treat resistance like an exact ceiling line", "It is an area of repeated friction, not a magic wall.", {
        eyebrow: "Watch for",
        highlights: ["Resistance is an area.", "Repeated hesitation matters.", "It can still break later."],
        noteLabel: "Common mistake",
        note: "Beginners often draw an exact line and expect every reaction to happen at the same pixel.",
      }),
    ],
    {
      mechanicTitle: "Resistance zone picker",
      mechanicSummary: "Mark the area where price repeatedly struggled upward.",
      prompt: "Which area looks most like resistance?",
      question: "Which area looks most like resistance?",
      activityKind: "zone-map",
      activityData: {
        variant: "chart-zones",
        chartPoints: [24, 36, 48, 62, 68, 64, 58, 44],
        candidates: [
          { id: "resistance", label: "Upper resistance", top: 20, height: 24 },
          { id: "middle", label: "Middle band", top: 58, height: 24 },
          { id: "lower", label: "Lower band", top: 96, height: 22 },
        ],
      },
      supportActivities: ["Look where price struggled upward.", "Choose the upper reaction area.", "Think of repeated rejection."],
      options: [
        choice("a", "The upper area where price kept stalling", true, ""),
        choice("b", "The lower area with no repeated rejection", false, "resistance-basics", "Resistance needs repeated hesitation from below."),
        choice("c", "Any random middle line", false, "resistance-basics", "Resistance is about real reaction, not a random line."),
      ],
      explanation: "Correct. Resistance is the upper area where price repeatedly stalled.",
    },
    {
      question: "What is resistance?",
      type: "multiple",
      options: [
        choice("a", "An area where price often struggles upward", true, ""),
        choice("b", "A guarantee price can never rise higher", false, "resistance-basics", "Resistance is not a guarantee."),
        choice("c", "A company profit metric", false, "resistance-basics", "Resistance is a chart concept."),
        choice("d", "The exact future top", false, "resistance-basics", "Resistance does not give an exact future top."),
      ],
      explanation: "Resistance is an area where price often struggles upward.",
      reviewPrompt: "resistance-basics",
    },
  ),
  "support-and-resistance-3": lesson(
    "Teach that support and resistance are zones, not precise lines.",
    "You now know the careful way to mark a zone.",
    ["zones-not-lines", "careful-marking"],
    [
      panel("hook", "A realistic zone has some width", "Compare the narrow line with the wider area. One is more careful for real charts.", {
        eyebrow: "Hook",
        activityKind: "zone-map",
        activityData: {
          variant: "chart-zones",
          chartPoints: [24, 36, 52, 44, 30, 34, 46, 38],
          candidates: [
            { id: "thin", label: "Thin line", top: 90, height: 10 },
            { id: "zone", label: "Wider zone", top: 84, height: 26 },
            { id: "wrong", label: "Wrong area", top: 28, height: 20 },
          ],
        },
      }),
      panel("learn", "Price often reacts across an area, not one exact pixel", "Real reactions can happen with a little slippage around the level. That is why zones are safer than razor-thin lines.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Careful marking", "Over-precise marking"],
          cards: [
            { id: "zone", label: "Wider reaction area", target: "Careful marking" },
            { id: "line", label: "Single exact line only", target: "Over-precise marking" },
          ],
        },
        noteLabel: "Why it matters",
        note: "Thinking in areas helps beginners avoid false certainty about perfect levels.",
      }),
      panel("mistake", "A line can be useful, but the area matters more", "The chart rarely respects one perfectly exact number over and over.", {
        eyebrow: "Watch for",
        highlights: ["Use a zone.", "Expect some wiggle.", "Avoid fake precision."],
        noteLabel: "Common mistake",
        note: "The wrong beginner habit is to mark one exact line and call any small miss a failure.",
      }),
    ],
    {
      mechanicTitle: "Zone width compare",
      mechanicSummary: "Pick the marking that matches how chart reactions usually behave in practice.",
      prompt: "Which marking is more careful?",
      question: "Which marking is more careful?",
      activityKind: "zone-map",
      activityData: {
        variant: "chart-zones",
        chartPoints: [26, 40, 54, 48, 34, 38, 50, 44],
        candidates: [
          { id: "thin", label: "Thin line", top: 88, height: 10 },
          { id: "zone", label: "Reaction zone", top: 82, height: 28 },
          { id: "wrong", label: "Wrong region", top: 26, height: 18 },
        ],
      },
      supportActivities: ["Compare the markings.", "Prefer the reaction area.", "Avoid false precision."],
      options: [
        choice("a", "The wider reaction zone", true, ""),
        choice("b", "The thinnest possible line", false, "zones-not-lines", "That is usually too precise for real chart reactions."),
        choice("c", "Any unrelated area", false, "zones-not-lines", "The zone still has to match the reaction area."),
      ],
      explanation: "Correct. A wider reaction zone is usually the more careful marking.",
    },
    {
      question: "Which marking is more careful?",
      type: "multiple",
      options: [
        choice("a", "The wider reaction zone", true, ""),
        choice("b", "The thinnest possible line", false, "zones-not-lines", "That is usually too exact."),
        choice("c", "A random band elsewhere", false, "zones-not-lines", "It still has to match the real reaction area."),
        choice("d", "No marking at all", false, "zones-not-lines", "The lesson is about better marking, not avoiding it."),
      ],
      explanation: "A wider reaction zone is the more careful approach.",
      reviewPrompt: "zones-not-lines",
    },
  ),
  "support-and-resistance-4": lesson(
    "Teach how price can bounce from support.",
    "You can now recognize a bounce from support.",
    ["support-bounce", "reaction-replay"],
    [
      panel("hook", "Watch the chart touch support and bounce", "Replay the move. The key clue is the reaction after price reaches the lower zone.", {
        eyebrow: "Hook",
        activityKind: "chart-lab",
        activityData: {
          variant: "reaction-replay",
          zone: { top: 94, height: 22, label: "Support zone" },
          stages: [
            { label: "Drop", points: [70, 60, 48, 36, 30], note: "Price approaches the support area." },
            { label: "Touch", points: [70, 60, 48, 36, 30, 32], note: "Price touches the zone." },
            { label: "Bounce", points: [70, 60, 48, 36, 30, 38, 50], note: "Price reacts higher from support." },
          ],
        },
      }),
      panel("learn", "The bounce is the reaction after the touch", "Support matters because buyers show up there and price lifts away.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Bounce clue", "Not the bounce clue"],
          cards: [
            { id: "reaction", label: "Price lifts after touching the lower area", target: "Bounce clue" },
            { id: "break", label: "Price slices straight through and stays below", target: "Not the bounce clue" },
          ],
        },
      }),
      panel("mistake", "Touching support is not enough by itself", "The reaction after the touch is what tells you whether it behaved like support.", {
        eyebrow: "Watch for",
        highlights: ["Touch the zone.", "Watch the reaction.", "Then decide if it bounced."],
        noteLabel: "Common mistake",
        note: "Beginners sometimes label support the moment price touches the area, before any reaction happens.",
      }),
    ],
    {
      mechanicTitle: "Support bounce replay",
      mechanicSummary: "Replay the touch and identify the moment price behaves like support.",
      prompt: "What happened near the support area?",
      question: "What happened near support?",
      activityKind: "chart-lab",
      activityData: {
        variant: "reaction-replay",
        zone: { top: 94, height: 22, label: "Support zone" },
        stages: [
          { label: "Approach", points: [68, 56, 44, 34, 30], note: "Price moves into support." },
          { label: "Touch", points: [68, 56, 44, 34, 30, 31], note: "Price reaches the zone." },
          { label: "Bounce", points: [68, 56, 44, 34, 30, 38, 48], note: "Price bounces away from the zone." },
        ],
      },
      supportActivities: ["Watch the touch.", "Watch the reaction.", "Name the bounce only after it happens."],
      options: [
        choice("a", "Price touched support and bounced", true, ""),
        choice("b", "Price broke support and stayed below", false, "support-bounce", "That would be a failure, not a bounce."),
        choice("c", "Nothing happened", false, "support-bounce", "The chart clearly reacted after the touch."),
      ],
      explanation: "Correct. Price touched support and then bounced away from it.",
    },
    {
      question: "What happened near support?",
      type: "multiple",
      options: [
        choice("a", "Price touched support and bounced", true, ""),
        choice("b", "Price broke support and stayed below", false, "support-bounce", "That is a different behavior."),
        choice("c", "Support guaranteed the future", false, "support-bounce", "Support can help organize the chart, but it never guarantees the future."),
        choice("d", "The support area did not matter at all", false, "support-bounce", "The reaction shows it mattered in this example."),
      ],
      explanation: "The visible behavior is a bounce from support.",
      reviewPrompt: "support-bounce",
    },
  ),
  "support-and-resistance-5": lesson(
    "Teach how price can reject from resistance.",
    "You can now recognize rejection near resistance.",
    ["resistance-rejection", "reaction-replay"],
    [
      panel("hook", "Watch the chart push into resistance and fail", "Replay the approach, test, and rejection sequence.", {
        eyebrow: "Hook",
        activityKind: "chart-lab",
        activityData: {
          variant: "reaction-replay",
          zone: { top: 24, height: 22, label: "Resistance zone" },
          stages: [
            { label: "Rise", points: [24, 36, 48, 60, 66], note: "Price rises into resistance." },
            { label: "Test", points: [24, 36, 48, 60, 66, 64], note: "Price tests the zone." },
            { label: "Rejection", points: [24, 36, 48, 60, 66, 58, 46], note: "Price is rejected from resistance." },
          ],
        },
      }),
      panel("learn", "Rejection means price struggled to get through", "The clue is the turn lower after price reaches the upper zone.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Rejection clue", "Not rejection"],
          cards: [
            { id: "turn-lower", label: "Price turns back down after the zone", target: "Rejection clue" },
            { id: "break-higher", label: "Price breaks through and keeps going", target: "Not rejection" },
          ],
        },
      }),
      panel("mistake", "The touch is not the whole story", "The reaction after the touch tells you whether it rejected or broke.", {
        eyebrow: "Watch for",
        highlights: ["Approach.", "Test.", "Then read the reaction."],
        noteLabel: "Common mistake",
        note: "Beginners often call something resistance before seeing whether price actually rejects there.",
      }),
    ],
    {
      mechanicTitle: "Resistance rejection replay",
      mechanicSummary: "Replay the move and identify the rejection from the upper zone.",
      prompt: "What does this upper area represent?",
      question: "What does this region represent?",
      activityKind: "chart-lab",
      activityData: {
        variant: "reaction-replay",
        zone: { top: 22, height: 22, label: "Resistance zone" },
        stages: [
          { label: "Approach", points: [26, 38, 50, 62, 68], note: "Price pushes up to the zone." },
          { label: "Test", points: [26, 38, 50, 62, 68, 66], note: "Price touches resistance." },
          { label: "Reject", points: [26, 38, 50, 62, 68, 58, 46], note: "Price turns lower from resistance." },
        ],
      },
      supportActivities: ["Watch the approach.", "Watch the reaction.", "Name the behavior carefully."],
      options: [
        choice("a", "Resistance with rejection", true, ""),
        choice("b", "Support with bounce", false, "resistance-rejection", "This is an upper zone with rejection, not a lower bounce."),
        choice("c", "Guaranteed ceiling forever", false, "resistance-rejection", "Resistance is not a forever guarantee."),
      ],
      explanation: "Correct. This region acts like resistance because price is rejected there.",
    },
    {
      question: "What does this region represent?",
      type: "multiple",
      options: [
        choice("a", "Resistance with rejection", true, ""),
        choice("b", "Support with bounce", false, "resistance-rejection", "That is the wrong type of reaction area."),
        choice("c", "A guaranteed permanent ceiling", false, "resistance-rejection", "Resistance can break later."),
        choice("d", "A business metric", false, "resistance-rejection", "This is still chart behavior."),
      ],
      explanation: "The region represents resistance with rejection.",
      reviewPrompt: "resistance-rejection",
    },
  ),
  "support-and-resistance-6": lesson(
    "Teach how to compare stronger and weaker zones.",
    "You can now compare the quality of reaction zones.",
    ["zone-strength", "repeated-reactions"],
    [
      panel("hook", "Some zones deserve more respect than others", "Rank the zones by how consistently price reacted there.", {
        eyebrow: "Hook",
        activityKind: "sequence-lab",
        activityData: {
          steps: [
            { id: "weak-zone", label: "Weak zone", description: "Only one messy reaction.", points: [58, 52, 48, 42, 46, 40] },
            { id: "mid-zone", label: "Medium zone", description: "Several touches with mixed follow-through.", points: [62, 54, 46, 40, 44, 48, 42] },
            { id: "strong-zone", label: "Strong zone", description: "Repeated clean reactions at the same area.", points: [66, 54, 42, 34, 40, 34, 42, 36] },
          ],
          orderedSteps: [
            { id: "1", label: "Weakest" },
            { id: "2", label: "Middle" },
            { id: "3", label: "Strongest" },
          ],
        },
      }),
      panel("learn", "Repeated reactions usually make a zone feel stronger", "A cleaner pattern of touches and reactions gives the area more importance.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Stronger zone", "Weaker zone"],
          cards: [
            { id: "repeated", label: "Repeated clean reactions", target: "Stronger zone" },
            { id: "single", label: "One messy touch only", target: "Weaker zone" },
            { id: "context", label: "Several meaningful tests", target: "Stronger zone" },
          ],
        },
      }),
      panel("mistake", "A zone is not stronger just because you drew it confidently", "The chart evidence has to support the area.", {
        eyebrow: "Watch for",
        highlights: ["Repeated tests matter.", "Reaction quality matters.", "Confidence alone does not."],
        noteLabel: "Common mistake",
        note: "The chart decides the quality of the zone, not the confidence of the person drawing it.",
      }),
    ],
    {
      mechanicTitle: "Zone strength rank",
      mechanicSummary: "Compare the number and quality of reactions to decide which area looks stronger.",
      prompt: "Which zone seems stronger?",
      question: "Which zone seems stronger?",
      activityKind: "sequence-lab",
      activityData: {
        steps: [
          { id: "weak", label: "Single reaction", description: "Only one loose touch.", points: [58, 50, 44, 40, 42, 38] },
          { id: "strong", label: "Repeated clean reactions", description: "Multiple touches with clear responses.", points: [66, 54, 42, 34, 40, 34, 42, 36] },
          { id: "mixed", label: "Mixed response", description: "More than one test, but less convincing.", points: [62, 52, 44, 36, 42, 38, 44] },
        ],
      },
      supportActivities: ["Count the reactions.", "Judge how clean they are.", "Choose the stronger area."],
      options: [
        choice("a", "The area with repeated clean reactions", true, ""),
        choice("b", "The area with one weak touch", false, "zone-strength", "One weak touch usually does not make the strongest zone."),
        choice("c", "Any area you marked first", false, "zone-strength", "Order alone does not determine strength."),
      ],
      explanation: "Correct. Repeated clean reactions usually make a zone feel stronger.",
    },
    {
      question: "Which zone seems stronger?",
      type: "multiple",
      options: [
        choice("a", "The area with repeated clean reactions", true, ""),
        choice("b", "The area with one weak touch", false, "zone-strength", "That is usually a weaker zone."),
        choice("c", "Any line drawn confidently", false, "zone-strength", "Confidence does not make the zone stronger."),
        choice("d", "A random unlabeled area", false, "zone-strength", "The chart evidence should guide you."),
      ],
      explanation: "Repeated clean reactions are the strongest clue here.",
      reviewPrompt: "zone-strength",
    },
  ),
  "support-and-resistance-7": lesson(
    "Teach that support can fail.",
    "You can now recognize a support breakdown.",
    ["support-failure", "breakdown"],
    [
      panel("hook", "Support can break", "Replay the move and look for the moment price stops bouncing and starts breaking through.", {
        eyebrow: "Hook",
        activityKind: "chart-lab",
        activityData: {
          variant: "reaction-replay",
          zone: { top: 96, height: 22, label: "Former support" },
          stages: [
            { label: "Touch", points: [70, 58, 46, 34, 30], note: "Price reaches support." },
            { label: "Wobble", points: [70, 58, 46, 34, 30, 32], note: "Price hesitates at support." },
            { label: "Breakdown", points: [70, 58, 46, 34, 30, 24, 18], note: "Price falls through and stays below." },
          ],
        },
      }),
      panel("learn", "The clue is staying below the zone", "A failed support does not just touch the area. It breaks and cannot recover it quickly.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Support held", "Support failed"],
          cards: [
            { id: "held", label: "Touch, then bounce back up", target: "Support held" },
            { id: "failed", label: "Break below and stay below", target: "Support failed" },
          ],
        },
      }),
      panel("mistake", "Support is not a guarantee", "The whole point of this lesson is to remove the “support always holds” mindset.", {
        eyebrow: "Watch for",
        highlights: ["Support can help.", "Support can fail.", "Reaction matters more than the label."],
        noteLabel: "Common mistake",
        note: "Many beginners treat support like a law instead of an area that still depends on selling pressure.",
      }),
    ],
    {
      mechanicTitle: "Support failure replay",
      mechanicSummary: "Replay the move and identify the breakdown below support.",
      prompt: "What changed after the breakdown?",
      question: "What changed after the breakdown?",
      activityKind: "chart-lab",
      activityData: {
        variant: "reaction-replay",
        zone: { top: 96, height: 22, label: "Former support" },
        stages: [
          { label: "Test", points: [68, 56, 44, 34, 30], note: "Price tests support." },
          { label: "Break", points: [68, 56, 44, 34, 30, 24], note: "Price breaks below support." },
          { label: "Stay below", points: [68, 56, 44, 34, 30, 24, 18], note: "Price remains below the zone." },
        ],
      },
      supportActivities: ["Watch the touch.", "Watch the break.", "Look for the failure to recover."],
      options: [
        choice("a", "Support failed and price broke below", true, ""),
        choice("b", "Support held perfectly", false, "support-failure", "This chart breaks below the support area instead."),
        choice("c", "The zone guaranteed a bounce", false, "support-failure", "This is the opposite of a guaranteed bounce."),
      ],
      explanation: "Correct. The support zone failed because price broke below and stayed there.",
    },
    {
      question: "What changed after the breakdown?",
      type: "multiple",
      options: [
        choice("a", "Support failed and price broke below", true, ""),
        choice("b", "Support held perfectly", false, "support-failure", "That is not what the chart shows."),
        choice("c", "Nothing changed", false, "support-failure", "The break below support is the key change."),
        choice("d", "The company revenue doubled", false, "support-failure", "This chart lesson is about price structure."),
      ],
      explanation: "The key change is that support failed and price broke below.",
      reviewPrompt: "support-failure",
    },
  ),
  "support-and-resistance-8": lesson(
    "Teach that resistance can break.",
    "You can now recognize a break through resistance.",
    ["resistance-break", "breakout-structure"],
    [
      panel("hook", "Resistance can stop being resistance", "Replay the move and look for the moment price pushes through the upper zone and holds above it.", {
        eyebrow: "Hook",
        activityKind: "chart-lab",
        activityData: {
          variant: "reaction-replay",
          zone: { top: 22, height: 22, label: "Former resistance" },
          stages: [
            { label: "Approach", points: [24, 38, 48, 60, 66], note: "Price approaches resistance." },
            { label: "Break", points: [24, 38, 48, 60, 66, 72], note: "Price breaks through resistance." },
            { label: "Hold", points: [24, 38, 48, 60, 66, 72, 78], note: "Price stays above the old ceiling." },
          ],
        },
      }),
      panel("learn", "The clue is staying above the old ceiling", "A real break does more than poke through. It shows follow-through above the old area.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Resistance held", "Resistance broke"],
          cards: [
            { id: "reject", label: "Price turns lower from the zone", target: "Resistance held" },
            { id: "break", label: "Price breaks above and holds there", target: "Resistance broke" },
          ],
        },
      }),
      panel("mistake", "Resistance does not stay permanent forever", "A watched level can still give way when buying pressure takes over.", {
        eyebrow: "Watch for",
        highlights: ["Resistance can hold.", "Resistance can break.", "The reaction tells you which happened."],
        noteLabel: "Common mistake",
        note: "Beginners often assume resistance must hold because it held before.",
      }),
    ],
    {
      mechanicTitle: "Resistance break replay",
      mechanicSummary: "Replay the move and identify the break through resistance.",
      prompt: "What happened here?",
      question: "What happened here?",
      activityKind: "chart-lab",
      activityData: {
        variant: "reaction-replay",
        zone: { top: 20, height: 22, label: "Former resistance" },
        stages: [
          { label: "Test", points: [24, 36, 48, 60, 66], note: "Price tests resistance." },
          { label: "Break", points: [24, 36, 48, 60, 66, 72], note: "Price breaks through." },
          { label: "Above", points: [24, 36, 48, 60, 66, 72, 80], note: "Price remains above the old ceiling." },
        ],
      },
      supportActivities: ["Watch the test.", "Watch the break.", "Check for follow-through above the zone."],
      options: [
        choice("a", "Resistance broke and price moved through it", true, ""),
        choice("b", "Resistance rejected price lower", false, "resistance-break", "This chart shows price moving through the zone instead."),
        choice("c", "Resistance guaranteed failure", false, "resistance-break", "The lesson is about how resistance can fail."),
      ],
      explanation: "Correct. Resistance broke and price pushed through the old level.",
    },
    {
      question: "What happened here?",
      type: "multiple",
      options: [
        choice("a", "Resistance broke and price moved through it", true, ""),
        choice("b", "Resistance rejected price lower", false, "resistance-break", "That would be a different reaction."),
        choice("c", "Nothing meaningful happened", false, "resistance-break", "The break through the zone is the key event."),
        choice("d", "The chart became certain", false, "resistance-break", "A breakout still does not remove uncertainty."),
      ],
      explanation: "The key event is the break through resistance.",
      reviewPrompt: "resistance-break",
    },
  ),
  "support-and-resistance-9": lesson(
    "Teach the beginner mindset of thinking in areas rather than exact lines.",
    "You now think about support and resistance more carefully.",
    ["areas-not-certainty", "careful-zones"],
    [
      panel("hook", "Choose the more careful statement", "One interpretation thinks in areas. The other pretends the chart is exact and guaranteed.", {
        eyebrow: "Hook",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Careful", "Overconfident"],
          cards: [
            { id: "careful", label: "This area matters, but it can still fail.", target: "Careful" },
            { id: "overconfident", label: "This exact line must hold forever.", target: "Overconfident" },
          ],
        },
      }),
      panel("learn", "Areas help you stay realistic", "Support and resistance are useful because they guide attention. They do not remove uncertainty.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Good mindset", "Weak mindset"],
          cards: [
            { id: "areas", label: "Think in areas", target: "Good mindset" },
            { id: "certainty", label: "Demand exact certainty", target: "Weak mindset" },
            { id: "watch", label: "Watch for reaction", target: "Good mindset" },
          ],
        },
      }),
      panel("mistake", "Over-precision creates fake confidence", "It is better to be approximately right about the zone than exactly wrong about one line.", {
        eyebrow: "Watch for",
        highlights: ["Area first.", "Reaction second.", "Certainty never."],
        noteLabel: "Common mistake",
        note: "The wrong habit is to use precision as a substitute for understanding.",
      }),
    ],
    {
      mechanicTitle: "Careful mindset sorter",
      mechanicSummary: "Pick the interpretation that thinks in areas and stays realistic about uncertainty.",
      prompt: "Which statement is more careful?",
      question: "Which statement is more careful?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Careful", "Overconfident"],
        cards: [
          { id: "careful", label: "This is a reaction area, not a guarantee.", target: "Careful" },
          { id: "over", label: "This exact line must work every time.", target: "Overconfident" },
        ],
      },
      supportActivities: ["Prefer area language.", "Leave room for failure.", "Avoid fake certainty."],
      options: [
        choice("a", "This is an area worth watching, not a guarantee", true, ""),
        choice("b", "This exact line must work forever", false, "areas-not-certainty", "That turns a helpful concept into false certainty."),
        choice("c", "Zones mean certainty", false, "areas-not-certainty", "Zones help with context, not certainty."),
      ],
      explanation: "Correct. The careful statement thinks in areas and leaves room for uncertainty.",
    },
    {
      question: "Which statement is more careful?",
      type: "multiple",
      options: [
        choice("a", "This is an area worth watching, not a guarantee", true, ""),
        choice("b", "This exact line must work forever", false, "areas-not-certainty", "That is overconfident."),
        choice("c", "Zones mean certainty", false, "areas-not-certainty", "Zones help, but they do not guarantee outcomes."),
        choice("d", "No area matters at all", false, "areas-not-certainty", "That is too dismissive in the other direction."),
      ],
      explanation: "Thinking in areas is the more careful beginner mindset.",
      reviewPrompt: "areas-not-certainty",
    },
  ),
  "support-and-resistance-10": lesson(
    "Combine support, resistance, bounce, break, and careful interpretation.",
    "Support & Resistance complete.",
    ["support-basics", "resistance-basics", "zones-not-lines", "areas-not-certainty"],
    [
      panel("hook", "Map the chart from the structure first", "Mark where support and resistance seem to matter before you interpret what happened there.", {
        eyebrow: "Boss setup",
        activityKind: "zone-map",
        activityData: {
          variant: "chart-zones",
          chartPoints: [26, 40, 54, 66, 60, 68, 58, 46, 34, 40, 52],
          candidates: [
            { id: "resistance", label: "Upper resistance", top: 18, height: 24 },
            { id: "middle", label: "Middle noise", top: 58, height: 20 },
            { id: "support", label: "Lower support", top: 96, height: 22 },
          ],
        },
      }),
      panel("learn", "Then replay the reactions", "Use the reaction sequence to decide whether the zone bounced, rejected, broke, or failed.", {
        eyebrow: "Learn",
        activityKind: "chart-lab",
        activityData: {
          variant: "reaction-replay",
          zone: { top: 18, height: 24, label: "Upper reaction area" },
          stages: [
            { label: "Approach", points: [26, 40, 54, 66], note: "Price reaches the upper area." },
            { label: "Test", points: [26, 40, 54, 66, 64], note: "Price tests the zone." },
            { label: "Reject", points: [26, 40, 54, 66, 64, 52, 40], note: "Price turns lower from the zone." },
          ],
        },
      }),
      panel("careful", "Finish with the careful summary", "The best summary names the zones and the reaction without pretending the next move is guaranteed.", {
        eyebrow: "Careful interpretation",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Careful summary", "Overreach"],
          cards: [
            { id: "careful", label: "Support and resistance are useful areas, but reactions can still fail or break.", target: "Careful summary" },
            { id: "over", label: "These levels guarantee the future.", target: "Overreach" },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "Chart mapping checkpoint",
      mechanicSummary: "Map the important areas first, then read the reaction and finish with a careful takeaway.",
      prompt: "Which careful summary best fits this chart?",
      question: "Which careful summary best fits this chart?",
      activityKind: "zone-map",
      activityData: {
        variant: "chart-zones",
        chartPoints: [24, 38, 52, 66, 60, 68, 56, 44, 34, 38, 50],
        candidates: [
          { id: "resistance", label: "Upper resistance", top: 18, height: 24 },
          { id: "support", label: "Lower support", top: 96, height: 22 },
          { id: "noise", label: "Middle noise", top: 58, height: 20 },
        ],
      },
      supportActivities: ["Mark the real areas.", "Read the reaction.", "Keep the takeaway careful."],
      options: [
        choice("a", "These are useful reaction areas, but they are not guarantees", true, ""),
        choice("b", "Support and resistance guarantee the next move", false, "support-resistance-boss", "The boss lesson is supposed to remove that kind of certainty."),
        choice("c", "The zones mean nothing at all", false, "support-resistance-boss", "They still matter as context."),
      ],
      explanation: "Correct. The strongest summary keeps the zones useful without pretending they are certain.",
    },
    {
      question: "Which careful summary best fits this chart?",
      type: "multiple",
      options: [
        choice("a", "These are useful reaction areas, but they are not guarantees", true, ""),
        choice("b", "Support and resistance guarantee the next move", false, "support-resistance-boss", "That is the exact overconfidence this module should remove."),
        choice("c", "The zones mean nothing at all", false, "support-resistance-boss", "The zones still organize the chart meaningfully."),
        choice("d", "One line can explain everything", false, "support-resistance-boss", "That is too precise and too simple."),
      ],
      explanation: "The careful summary treats the zones as useful context, not guarantees.",
      reviewPrompt: "support-resistance-boss",
    },
  ),
};

const breakoutAndVolumeLessons: Record<string, AuthoredLessonExperience> = {
  "breakouts-and-volume-1": lesson(
    "Teach that a breakout is a move beyond a watched level.",
    "You can now spot the breakout moment.",
    ["breakout-basics", "level-break"],
    [
      panel("hook", "Tap the moment price pushes through the level", "A breakout is the event where price moves beyond a watched level.", {
        eyebrow: "Hook",
        activityKind: "chart-lab",
        activityData: {
          variant: "breakout-volume",
          pricePoints: [24, 30, 36, 40, 42, 60, 74],
          volumeBars: [18, 20, 22, 24, 26, 46, 52],
          breakoutIndex: 5,
          level: 52,
        },
      }),
      panel("learn", "The important shift is moving beyond the barrier", "The breakout matters because price is no longer staying trapped under the same level.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Breakout", "Not breakout"],
          cards: [
            { id: "through", label: "Price pushes above the watched level", target: "Breakout" },
            { id: "below", label: "Price remains under the level", target: "Not breakout" },
          ],
        },
      }),
      panel("mistake", "A breakout is a move, not a promise", "The event matters. The future still needs context.", {
        eyebrow: "Watch for",
        highlights: ["Break through the level.", "Notice the change in behavior.", "Do not turn it into certainty."],
        noteLabel: "Common mistake",
        note: "Beginners often treat any breakout as guaranteed upside instead of one important clue.",
      }),
    ],
    {
      mechanicTitle: "Breakout finder",
      mechanicSummary: "Identify the exact point where price moves beyond the watched level.",
      prompt: "Which event is the breakout?",
      question: "Which event is the breakout?",
      activityKind: "chart-lab",
      activityData: {
        variant: "breakout-volume",
        pricePoints: [26, 32, 38, 42, 44, 62, 76],
        volumeBars: [16, 18, 20, 22, 24, 48, 54],
        breakoutIndex: 5,
        level: 54,
      },
      supportActivities: ["Find the watched level.", "Tap the push through it.", "Separate the event from the outcome."],
      options: [
        choice("a", "The move through the watched level", true, ""),
        choice("b", "Any move below the level", false, "breakout-basics", "That is not the breakout event."),
        choice("c", "The first candle on the chart", false, "breakout-basics", "The breakout is specifically about the move beyond the level."),
      ],
      explanation: "Correct. The breakout is the move where price pushes through the watched level.",
    },
    {
      question: "Which event is the breakout?",
      type: "multiple",
      options: [
        choice("a", "The move through the watched level", true, ""),
        choice("b", "Any move below the level", false, "breakout-basics", "That is not the breakout event."),
        choice("c", "A guarantee of success", false, "breakout-basics", "A breakout is an event, not a guarantee."),
        choice("d", "The company’s revenue report", false, "breakout-basics", "This lesson is about chart structure."),
      ],
      explanation: "A breakout is the move beyond the watched level.",
      reviewPrompt: "breakout-basics",
    },
  ),
  "breakouts-and-volume-2": lesson(
    "Teach why breakouts matter: they can signal a shift in behavior.",
    "You can now explain why traders watch breakouts.",
    ["breakout-meaning", "behavior-shift"],
    [
      panel("hook", "Compare before the level break and after it", "The interest in a breakout comes from behavior changing around a watched level.", {
        eyebrow: "Hook",
        activityKind: "chart-lab",
        activityData: {
          variant: "breakout-volume",
          pricePoints: [22, 28, 34, 38, 40, 58, 70],
          volumeBars: [18, 18, 20, 22, 24, 42, 48],
          breakoutIndex: 5,
          level: 50,
        },
      }),
      panel("learn", "A watched ceiling stops mattering in the same way", "The level used to contain price. After the break, the behavior can look different.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Behavior changed", "Behavior stayed trapped"],
          cards: [
            { id: "changed", label: "Price moved through the old ceiling", target: "Behavior changed" },
            { id: "trapped", label: "Price kept failing under the same level", target: "Behavior stayed trapped" },
          ],
        },
      }),
      panel("mistake", "Breakout interest is about change, not certainty", "The level break matters because something changed, not because the chart suddenly became risk-free.", {
        eyebrow: "Watch for",
        highlights: ["Old behavior mattered.", "The break changes the setup.", "Uncertainty still stays."],
      }),
    ],
    {
      mechanicTitle: "Before vs after breakout",
      mechanicSummary: "Compare the chart before the break and after the break to read the behavior shift.",
      prompt: "Why do traders watch this kind of move?",
      question: "Why do traders watch a breakout?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "The level was watched", detail: "Price reacted there before." },
          { title: "Price moved through it", detail: "Behavior changed." },
          { title: "That can matter", detail: "The setup is different now." },
        ],
      },
      supportActivities: ["Notice the old barrier.", "Notice the break.", "Explain the behavior shift."],
      options: [
        choice("a", "Because the move may show a change in behavior", true, ""),
        choice("b", "Because breakouts guarantee gains", false, "breakout-meaning", "Breakouts matter because they may signal change, not certainty."),
        choice("c", "Because levels stop mattering forever", false, "breakout-meaning", "The change is more nuanced than that."),
      ],
      explanation: "Correct. Traders watch breakouts because the move may show a change in behavior around an important level.",
    },
    {
      question: "Why do traders watch a breakout?",
      type: "multiple",
      options: [
        choice("a", "Because it can show a change in behavior around a watched level", true, ""),
        choice("b", "Because it guarantees the stock will keep rising", false, "breakout-meaning", "That overstates what a breakout can do."),
        choice("c", "Because levels never matter again", false, "breakout-meaning", "A level break does not erase the need for context."),
        choice("d", "Because it replaces all other analysis", false, "breakout-meaning", "Breakouts are one clue, not the whole story."),
      ],
      explanation: "A breakout matters because it can show a change in behavior around the watched level.",
      reviewPrompt: "breakout-meaning",
    },
  ),
  "breakouts-and-volume-3": lesson(
    "Teach that volume measures activity or participation.",
    "You can now read a basic volume spike.",
    ["volume-basics", "participation"],
    [
      panel("hook", "Look below the chart too", "Volume bars show how much trading activity happened in that period.", {
        eyebrow: "Hook",
        activityKind: "chart-lab",
        activityData: {
          variant: "breakout-volume",
          pricePoints: [26, 28, 32, 34, 38, 42, 46],
          volumeBars: [12, 16, 18, 20, 24, 52, 26],
          breakoutIndex: 5,
          level: 44,
        },
      }),
      panel("learn", "A volume spike means more activity than usual", "It tells you participation changed. It does not tell you bullish or bearish by itself.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Volume clue", "Not enough alone"],
          cards: [
            { id: "more-activity", label: "More people were active", target: "Volume clue" },
            { id: "guarantee", label: "It guarantees the move succeeds", target: "Not enough alone" },
          ],
        },
      }),
      panel("mistake", "High volume alone is not a verdict", "Volume is useful because it shows participation. Context still matters.", {
        eyebrow: "Watch for",
        highlights: ["High volume = more activity.", "It can happen on rallies.", "It can happen on selloffs too."],
      }),
    ],
    {
      mechanicTitle: "Volume spike reader",
      mechanicSummary: "Inspect the volume bars and identify what the spike really tells you.",
      prompt: "What does a volume spike mean?",
      question: "What does a volume spike mean?",
      activityKind: "chart-lab",
      activityData: {
        variant: "breakout-volume",
        pricePoints: [24, 26, 30, 32, 34, 38, 40],
        volumeBars: [12, 14, 18, 20, 22, 50, 24],
        breakoutIndex: 5,
        level: 42,
      },
      supportActivities: ["Look at the tall bar.", "Think participation.", "Do not overstate it."],
      options: [
        choice("a", "Participation increased", true, ""),
        choice("b", "The move is guaranteed to work", false, "volume-basics", "Volume can help confirm activity, but it does not guarantee success."),
        choice("c", "The chart stopped mattering", false, "volume-basics", "Volume supports the chart read instead of replacing it."),
      ],
      explanation: "Correct. A volume spike means participation increased.",
    },
    {
      question: "What does a volume spike mean?",
      type: "multiple",
      options: [
        choice("a", "Participation increased", true, ""),
        choice("b", "The move is guaranteed to work", false, "volume-basics", "That is too certain."),
        choice("c", "Volume only matters on rallies", false, "volume-basics", "Volume can matter on down moves too."),
        choice("d", "Nothing useful at all", false, "volume-basics", "It still tells you about participation."),
      ],
      explanation: "A volume spike mainly tells you participation increased.",
      reviewPrompt: "volume-basics",
    },
  ),
  "breakouts-and-volume-4": lesson(
    "Teach why a breakout with strong volume can feel more meaningful.",
    "You can now compare stronger and weaker breakout participation.",
    ["strong-volume-breakout", "participation-quality"],
    [
      panel("hook", "Match the breakout to the louder volume profile", "A stronger breakout often attracts more participation at the moment it moves through the level.", {
        eyebrow: "Hook",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Strong participation", "Weaker participation"],
          cards: [
            { id: "strong", label: "Breakout with tall volume spike", points: [22, 28, 34, 38, 40, 60, 72], volumeBars: [14, 16, 18, 20, 24, 48, 50], target: "Strong participation" },
            { id: "weak", label: "Breakout with quiet volume", points: [22, 28, 34, 38, 40, 60, 64], volumeBars: [14, 16, 18, 20, 22, 24, 22], target: "Weaker participation" },
          ],
        },
      }),
      panel("learn", "Stronger volume can make the move feel more convincing", "The market is showing more attention at the breakout moment. That can matter, even though it is not certainty.", {
        eyebrow: "Learn",
        activityKind: "chart-lab",
        activityData: {
          variant: "breakout-volume",
          pricePoints: [20, 28, 32, 36, 40, 62, 76],
          volumeBars: [12, 14, 18, 20, 22, 50, 54],
          breakoutIndex: 5,
          level: 50,
        },
      }),
      panel("mistake", "Strong volume is a clue, not a guarantee", "The lesson is about quality, not certainty.", {
        eyebrow: "Watch for",
        highlights: ["Breakout matters.", "Volume adds context.", "Context still wins over certainty."],
      }),
    ],
    {
      mechanicTitle: "Breakout participation compare",
      mechanicSummary: "Compare the same kind of price move with louder versus quieter participation.",
      prompt: "Which breakout drew more participation?",
      question: "Which breakout drew more participation?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["More participation", "Less participation"],
        cards: [
          { id: "loud", label: "Loud breakout", points: [18, 24, 30, 36, 40, 60, 74], volumeBars: [14, 16, 18, 22, 24, 54, 52], target: "More participation" },
          { id: "quiet", label: "Quiet breakout", points: [18, 24, 30, 36, 40, 58, 64], volumeBars: [14, 16, 18, 18, 20, 22, 24], target: "Less participation" },
        ],
      },
      supportActivities: ["Compare the volume bars.", "Notice which breakout drew more activity.", "Keep the conclusion careful."],
      options: [
        choice("a", "The breakout with the larger volume spike", true, ""),
        choice("b", "The breakout with quieter volume", false, "strong-volume-breakout", "That one shows less participation."),
        choice("c", "They are identical no matter the bars", false, "strong-volume-breakout", "The bars are the participation clue."),
      ],
      explanation: "Correct. The larger volume spike signals stronger participation.",
    },
    {
      question: "Which breakout drew more participation?",
      type: "multiple",
      options: [
        choice("a", "The breakout with the larger volume spike", true, ""),
        choice("b", "The breakout with quieter volume", false, "strong-volume-breakout", "Quieter bars mean weaker participation."),
        choice("c", "They are identical no matter the bars", false, "strong-volume-breakout", "The volume difference matters."),
        choice("d", "Participation guarantees success", false, "strong-volume-breakout", "The module keeps warning against that certainty."),
      ],
      explanation: "The louder volume spike shows stronger participation.",
      reviewPrompt: "strong-volume-breakout",
    },
  ),
  "breakouts-and-volume-5": lesson(
    "Teach why a quiet breakout deserves more caution.",
    "You can now treat quieter breakouts more carefully.",
    ["quiet-breakout", "caution"],
    [
      panel("hook", "Not every breakout arrives with strong participation", "Compare the louder move and the quieter move. The quieter one deserves more caution.", {
        eyebrow: "Hook",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["More caution", "Less caution"],
          cards: [
            { id: "quiet", label: "Quiet breakout", points: [20, 26, 32, 36, 40, 56, 60], volumeBars: [14, 16, 18, 18, 20, 22, 24], target: "More caution" },
            { id: "loud", label: "Loud breakout", points: [20, 26, 32, 36, 40, 60, 74], volumeBars: [14, 16, 18, 20, 22, 48, 52], target: "Less caution" },
          ],
        },
      }),
      panel("learn", "Quiet participation can make the move feel less convincing", "The chart may still break out, but there is less evidence of broad participation behind it.", {
        eyebrow: "Learn",
        activityKind: "chart-lab",
        activityData: {
          variant: "breakout-volume",
          pricePoints: [20, 26, 32, 36, 40, 56, 60],
          volumeBars: [14, 16, 18, 18, 20, 22, 24],
          breakoutIndex: 5,
          level: 48,
        },
      }),
      panel("mistake", "Caution is not the same as instant rejection", "A quiet breakout can still work. The lesson is simply that it deserves more caution.", {
        eyebrow: "Watch for",
        highlights: ["Quiet volume weakens conviction.", "It does not decide the future.", "Stay careful."],
      }),
    ],
    {
      mechanicTitle: "Quiet breakout caution",
      mechanicSummary: "Compare the breakout quality and decide which one deserves more caution.",
      prompt: "Which deserves more caution?",
      question: "Which breakout deserves more caution?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["More caution", "Less caution"],
        cards: [
          { id: "quiet", label: "Quiet breakout", points: [18, 24, 30, 34, 38, 54, 58], volumeBars: [12, 14, 16, 16, 18, 20, 22], target: "More caution" },
          { id: "loud", label: "Loud breakout", points: [18, 24, 30, 34, 38, 58, 70], volumeBars: [12, 14, 18, 20, 22, 48, 50], target: "Less caution" },
        ],
      },
      supportActivities: ["Compare the bars.", "Compare the move quality.", "Choose the setup that deserves more caution."],
      options: [
        choice("a", "The quiet breakout", true, ""),
        choice("b", "The loud breakout", false, "quiet-breakout", "The louder participation usually makes the move feel more convincing."),
        choice("c", "Neither setup ever needs caution", false, "quiet-breakout", "Every setup still deserves caution."),
      ],
      explanation: "Correct. The quiet breakout deserves more caution because participation looks weaker.",
    },
    {
      question: "Which breakout deserves more caution?",
      type: "multiple",
      options: [
        choice("a", "The quiet breakout", true, ""),
        choice("b", "The loud breakout", false, "quiet-breakout", "The quieter move is the more cautious read."),
        choice("c", "Neither setup ever needs caution", false, "quiet-breakout", "That is too confident."),
        choice("d", "All volume profiles mean the same thing", false, "quiet-breakout", "The volume profile changes the read."),
      ],
      explanation: "The quiet breakout is the setup that deserves more caution.",
      reviewPrompt: "quiet-breakout",
    },
  ),
  "breakouts-and-volume-6": lesson(
    "Teach what a fake breakout looks like.",
    "You can now spot a fake breakout.",
    ["fake-breakout", "failed-move"],
    [
      panel("hook", "Watch the breakout fail", "A fake breakout moves beyond the level and then loses the move instead of holding it.", {
        eyebrow: "Hook",
        activityKind: "chart-lab",
        activityData: {
          variant: "reaction-replay",
          zone: { top: 44, height: 2, label: "Breakout level" },
          stages: [
            { label: "Break", points: [20, 26, 30, 34, 38, 56], note: "Price breaks above the level." },
            { label: "Slip back", points: [20, 26, 30, 34, 38, 56, 46], note: "Price loses follow-through." },
            { label: "Fail", points: [20, 26, 30, 34, 38, 56, 44, 36], note: "Price drops back below the old level." },
          ],
        },
      }),
      panel("learn", "The clue is failure to hold the move", "A breakout that cannot stay above the old level becomes a fake breakout.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Held breakout", "Fake breakout"],
          cards: [
            { id: "held", label: "Breaks above and stays above", target: "Held breakout" },
            { id: "fake", label: "Breaks above and falls back below", target: "Fake breakout" },
          ],
        },
      }),
      panel("mistake", "The first push is not the whole story", "You need to watch whether the move holds, not just whether it first broke.", {
        eyebrow: "Watch for",
        highlights: ["Initial break matters.", "Follow-through matters too.", "Failure to hold changes the read."],
      }),
    ],
    {
      mechanicTitle: "Fakeout replay",
      mechanicSummary: "Replay the move and spot where the breakout failed to hold.",
      prompt: "Which chart is the fake breakout?",
      question: "Which chart is the fake breakout?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Held breakout", "Fake breakout"],
        cards: [
          { id: "held", label: "Break and hold", points: [18, 24, 30, 34, 38, 58, 68], volumeBars: [14, 16, 18, 20, 22, 44, 46], target: "Held breakout" },
          { id: "fake", label: "Break and fail", points: [18, 24, 30, 34, 38, 58, 44, 34], volumeBars: [14, 16, 18, 20, 22, 40, 30, 26], target: "Fake breakout" },
        ],
      },
      supportActivities: ["Watch the first break.", "Then check whether it held.", "Choose the failing version."],
      options: [
        choice("a", "The chart that broke the level and fell back below it", true, ""),
        choice("b", "The chart that broke and held above it", false, "fake-breakout", "That one is not the fake breakout."),
        choice("c", "The chart with any volume bar", false, "fake-breakout", "You still have to read the price behavior."),
      ],
      explanation: "Correct. A fake breakout breaks through and then fails to hold the move.",
    },
    {
      question: "Which chart is the fake breakout?",
      type: "multiple",
      options: [
        choice("a", "The chart that broke the level and fell back below it", true, ""),
        choice("b", "The chart that broke and held above it", false, "fake-breakout", "That is the opposite behavior."),
        choice("c", "The chart with the highest first candle", false, "fake-breakout", "The hold-versus-fail behavior matters more."),
        choice("d", "The chart that guaranteed success", false, "fake-breakout", "There is no such thing here."),
      ],
      explanation: "A fake breakout is the one that fails to hold the move.",
      reviewPrompt: "fake-breakout",
    },
  ),
  "breakouts-and-volume-7": lesson(
    "Teach that high volume can show up on selloffs too.",
    "You now know volume is not automatically bullish.",
    ["volume-context", "selloff-volume"],
    [
      panel("hook", "Volume can be loud on the way down too", "Sort the examples. High volume tells you participation increased. Direction still depends on the price move.", {
        eyebrow: "Hook",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Bullish", "Bearish", "Depends"],
          cards: [
            { id: "up-loud", label: "Strong breakout with high volume", points: [20, 26, 32, 36, 40, 58, 70], volumeBars: [12, 14, 18, 20, 24, 50, 54], target: "Bullish" },
            { id: "down-loud", label: "Sharp selloff with high volume", points: [70, 64, 58, 52, 46, 34, 24], volumeBars: [14, 18, 20, 24, 28, 50, 56], target: "Bearish" },
            { id: "spike-alone", label: "High volume alone", target: "Depends" },
          ],
        },
      }),
      panel("learn", "Volume tells you activity, not direction by itself", "You still need to combine the bars with the price move.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Activity clue", "Direction verdict"],
          cards: [
            { id: "activity", label: "More participation", target: "Activity clue" },
            { id: "verdict", label: "Automatically bullish", target: "Direction verdict" },
          ],
        },
      }),
      panel("mistake", "Do not turn one clue into the whole story", "Volume supports the chart read. It does not replace it.", {
        eyebrow: "Watch for",
        highlights: ["Volume can support rallies.", "Volume can support selloffs.", "Price direction still matters."],
      }),
    ],
    {
      mechanicTitle: "Volume context sort",
      mechanicSummary: "Sort high-volume examples into bullish, bearish, or depends based on the price move around them.",
      prompt: "What does high volume alone tell you?",
      question: "What does high volume alone tell you?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Bullish", "Bearish", "Depends"],
        cards: [
          { id: "rally", label: "High volume on a rally", target: "Bullish" },
          { id: "selloff", label: "High volume on a selloff", target: "Bearish" },
          { id: "alone", label: "High volume by itself", target: "Depends" },
        ],
      },
      supportActivities: ["Look at the price move too.", "Use volume as context.", "Avoid one-clue certainty."],
      options: [
        choice("a", "Participation increased, but direction still needs context", true, ""),
        choice("b", "The stock is automatically bullish", false, "volume-context", "High volume alone does not prove that."),
        choice("c", "Volume never matters", false, "volume-context", "It does matter as a participation clue."),
      ],
      explanation: "Correct. High volume alone tells you participation increased, but direction still needs context.",
    },
    {
      question: "What does high volume alone tell you?",
      type: "multiple",
      options: [
        choice("a", "Participation increased, but direction still needs context", true, ""),
        choice("b", "The stock is automatically bullish", false, "volume-context", "That is too simplistic."),
        choice("c", "The stock is automatically bearish", false, "volume-context", "That is also too simplistic."),
        choice("d", "Volume never matters", false, "volume-context", "Volume still matters as context."),
      ],
      explanation: "High volume alone mainly tells you participation increased.",
      reviewPrompt: "volume-context",
    },
  ),
  "breakouts-and-volume-8": lesson(
    "Teach that breakout quality depends on context, not one clue.",
    "You can now stack evidence more carefully.",
    ["breakout-context", "evidence-stacking"],
    [
      panel("hook", "Build the evidence stack", "Breakout quality improves when the price event, volume, and prior structure work together.", {
        eyebrow: "Hook",
        activityKind: "signal-stack",
        activityData: {
          clues: [
            { title: "Break through level", detail: "The event itself happened." },
            { title: "Participation rose", detail: "Volume confirmed more attention." },
            { title: "The structure mattered", detail: "The level had been watched before." },
          ],
        },
      }),
      panel("learn", "No single clue should carry the whole verdict", "Breakout + volume + context is a better read than any single piece alone.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Helpful clue", "Not enough alone"],
          cards: [
            { id: "break", label: "Price breaks the level", target: "Helpful clue" },
            { id: "volume", label: "Volume rises", target: "Helpful clue" },
            { id: "guarantee", label: "One clue proves the whole setup", target: "Not enough alone" },
          ],
        },
      }),
      panel("mistake", "Strong context is not the same as certainty", "You are building a better explanation, not a guaranteed trade outcome.", {
        eyebrow: "Watch for",
        highlights: ["Stack clues.", "Keep them in context.", "Avoid guaranteed language."],
      }),
    ],
    {
      mechanicTitle: "Breakout evidence stack",
      mechanicSummary: "Stack the right clues before choosing the better conclusion.",
      prompt: "Which conclusion is more careful?",
      question: "Which conclusion is more careful?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "Breakout", detail: "Price moved through the level." },
          { title: "Volume", detail: "Participation increased." },
          { title: "Structure", detail: "The level mattered before." },
        ],
      },
      supportActivities: ["Stack the clues.", "Use them together.", "Choose the careful conclusion."],
      options: [
        choice("a", "This setup looks stronger, but it still is not guaranteed", true, ""),
        choice("b", "One clue proves success", false, "breakout-context", "The lesson is about stacking evidence, not overclaiming."),
        choice("c", "Context does not matter", false, "breakout-context", "Context is the point of the lesson."),
      ],
      explanation: "Correct. The careful conclusion uses stacked evidence without pretending certainty.",
    },
    {
      question: "Which conclusion is more careful?",
      type: "multiple",
      options: [
        choice("a", "This setup looks stronger, but it still is not guaranteed", true, ""),
        choice("b", "One clue proves success", false, "breakout-context", "That is not careful reasoning."),
        choice("c", "Context does not matter", false, "breakout-context", "Context matters a lot here."),
        choice("d", "Volume replaces structure", false, "breakout-context", "The clues work together."),
      ],
      explanation: "The careful conclusion is the one that stacks clues without becoming certain.",
      reviewPrompt: "breakout-context",
    },
  ),
  "breakouts-and-volume-9": lesson(
    "Teach how to compare stronger and weaker breakout setups.",
    "You can now rank breakout setup quality more carefully.",
    ["setup-quality", "breakout-ranking"],
    [
      panel("hook", "Rank the setups by quality", "Compare price action, level break, and participation together.", {
        eyebrow: "Hook",
        activityKind: "sequence-lab",
        activityData: {
          steps: [
            { id: "weak", label: "Weak setup", description: "Quiet move with little follow-through.", points: [18, 24, 30, 34, 38, 52, 56], volumeBars: [12, 14, 16, 18, 18, 20, 20] },
            { id: "mid", label: "Middle setup", description: "Some participation and some follow-through.", points: [18, 24, 30, 34, 38, 56, 64], volumeBars: [12, 14, 16, 18, 20, 30, 34] },
            { id: "strong", label: "Strong setup", description: "Clear break with stronger participation.", points: [18, 24, 30, 34, 38, 60, 74], volumeBars: [12, 14, 18, 20, 22, 48, 52] },
          ],
          orderedSteps: [
            { id: "1", label: "Weakest" },
            { id: "2", label: "Middle" },
            { id: "3", label: "Strongest" },
          ],
        },
      }),
      panel("learn", "The strongest setup stacks more positive evidence", "You are comparing relative quality, not searching for perfection.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Stronger setup", "Weaker setup"],
          cards: [
            { id: "strong", label: "Clear level break with loud participation", target: "Stronger setup" },
            { id: "weak", label: "Quiet break with weak follow-through", target: "Weaker setup" },
          ],
        },
      }),
      panel("mistake", "Strongest does not mean certain", "This is a ranking exercise, not a guarantee exercise.", {
        eyebrow: "Watch for",
        highlights: ["Compare relative quality.", "Use multiple clues.", "Keep the read cautious."],
      }),
    ],
    {
      mechanicTitle: "Breakout setup rank",
      mechanicSummary: "Rank the breakout setups by how much evidence they stack in their favor.",
      prompt: "Which setup looks strongest and why?",
      question: "Which setup looks strongest?",
      activityKind: "sequence-lab",
      activityData: {
        steps: [
          { id: "weak", label: "Weak", description: "Quiet participation.", points: [18, 24, 30, 34, 38, 52, 56], volumeBars: [12, 14, 16, 18, 18, 20, 20] },
          { id: "strong", label: "Strong", description: "Loud participation and clear follow-through.", points: [18, 24, 30, 34, 38, 60, 74], volumeBars: [12, 14, 18, 20, 22, 48, 52] },
          { id: "middle", label: "Middle", description: "Better than weak, not as strong as the best.", points: [18, 24, 30, 34, 38, 56, 64], volumeBars: [12, 14, 16, 18, 20, 30, 34] },
        ],
      },
      supportActivities: ["Compare price and volume together.", "Think in relative quality.", "Choose the strongest setup."],
      options: [
        choice("a", "The setup with clearer follow-through and stronger volume", true, ""),
        choice("b", "The quiet setup with weak participation", false, "setup-quality", "That setup stacks less evidence in its favor."),
        choice("c", "Any breakout is equally strong", false, "setup-quality", "This lesson is about quality differences."),
      ],
      explanation: "Correct. The strongest setup is the one with cleaner follow-through and louder participation.",
    },
    {
      question: "Which setup looks strongest?",
      type: "multiple",
      options: [
        choice("a", "The setup with clearer follow-through and stronger volume", true, ""),
        choice("b", "The quiet setup with weak participation", false, "setup-quality", "That is the weaker setup."),
        choice("c", "Any breakout is equally strong", false, "setup-quality", "Some setups clearly stack better evidence."),
        choice("d", "The one with the longest label", false, "setup-quality", "The label is not the clue."),
      ],
      explanation: "The stronger setup is the one with cleaner follow-through and louder participation.",
      reviewPrompt: "setup-quality",
    },
  ),
  "breakouts-and-volume-10": lesson(
    "Combine breakouts, fakeouts, volume, and careful interpretation.",
    "Breakouts & Volume complete.",
    ["breakout-basics", "volume-basics", "fake-breakout", "setup-quality"],
    [
      panel("hook", "Run the breakout lab", "This checkpoint combines the event, the participation, and the quality of the move.", {
        eyebrow: "Boss setup",
        activityKind: "chart-lab",
        activityData: {
          variant: "breakout-volume",
          pricePoints: [18, 24, 30, 34, 38, 60, 74],
          volumeBars: [12, 14, 18, 20, 22, 50, 54],
          breakoutIndex: 5,
          level: 50,
        },
      }),
      panel("learn", "Compare the real move and the fake move", "One breaks and holds. The other breaks and fails. That difference matters more than the first push alone.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Held breakout", "Fake breakout"],
          cards: [
            { id: "held", label: "Break and hold", points: [18, 24, 30, 34, 38, 60, 72], volumeBars: [12, 14, 18, 20, 22, 48, 50], target: "Held breakout" },
            { id: "fake", label: "Break and fail", points: [18, 24, 30, 34, 38, 58, 44, 34], volumeBars: [12, 14, 16, 20, 22, 40, 28, 22], target: "Fake breakout" },
          ],
        },
      }),
      panel("careful", "Finish with the careful setup summary", "The better takeaway ranks the move without pretending the outcome is guaranteed.", {
        eyebrow: "Careful interpretation",
        activityKind: "signal-stack",
        activityData: {
          clues: [
            { title: "Breakout event", detail: "The level was cleared." },
            { title: "Participation", detail: "Volume confirmed extra attention." },
            { title: "Quality", detail: "The move still must hold." },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "Breakout lab",
      mechanicSummary: "Work through the event, the participation, and the hold-versus-fail distinction before your final judgment.",
      prompt: "Which final explanation is strongest?",
      question: "Which final explanation is strongest?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "Level break", detail: "Price moved through the barrier." },
          { title: "Volume", detail: "Participation increased." },
          { title: "Quality", detail: "You still need to judge whether it holds." },
        ],
      },
      supportActivities: ["Identify the event.", "Inspect the participation.", "Keep the final read careful."],
      options: [
        choice("a", "The move looks stronger, but hold and context still matter", true, ""),
        choice("b", "The breakout guarantees success", false, "breakout-volume-boss", "The boss lesson is supposed to remove that certainty."),
        choice("c", "Volume means nothing at all", false, "breakout-volume-boss", "Volume still matters as context."),
      ],
      explanation: "Correct. The strongest explanation ranks the move more highly while keeping room for uncertainty.",
    },
    {
      question: "Which final explanation is strongest?",
      type: "multiple",
      options: [
        choice("a", "The move looks stronger, but hold and context still matter", true, ""),
        choice("b", "The breakout guarantees success", false, "breakout-volume-boss", "That overstates what the setup can tell you."),
        choice("c", "Volume means nothing at all", false, "breakout-volume-boss", "That throws away a useful clue."),
        choice("d", "Every breakout is fake", false, "breakout-volume-boss", "That is too absolute in the opposite direction."),
      ],
      explanation: "The strongest explanation is the careful one that still weighs quality and uncertainty.",
      reviewPrompt: "breakout-volume-boss",
    },
  ),
};

const businessFundamentalsLessons: Record<string, AuthoredLessonExperience> = {
  "business-fundamentals-1": lesson(
    "Teach the difference between technical and fundamental clues.",
    "You can now separate chart behavior from business facts.",
    ["technical-vs-fundamental", "lens-separation"],
    [
      panel("hook", "Sort the clues by lens", "Some clues belong to chart behavior. Others belong to the business itself.", {
        eyebrow: "Hook",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Chart behavior", "Business metrics"],
          cards: [
            { id: "trend", label: "Trend", target: "Chart behavior" },
            { id: "support", label: "Support zone", target: "Chart behavior" },
            { id: "revenue", label: "Revenue growth", target: "Business metrics" },
            { id: "margin", label: "Profit margin", target: "Business metrics" },
          ],
        },
      }),
      panel("learn", "These lenses answer different questions", "Technical clues describe how price is behaving. Fundamental clues describe how the business is performing.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Technical lens", "Fundamental lens"],
          cards: [
            { id: "price", label: "What is price doing?", target: "Technical lens" },
            { id: "business", label: "How is the company performing?", target: "Fundamental lens" },
          ],
        },
      }),
      panel("mistake", "Do not mix chart behavior with business numbers", "The cleanest analysis starts by keeping the two lenses separate.", {
        eyebrow: "Watch for",
        highlights: ["Chart lens = price behavior.", "Business lens = company facts.", "Both matter for different reasons."],
      }),
    ],
    {
      mechanicTitle: "Lens sorter",
      mechanicSummary: "Sort chart clues and business clues into the right lens before making any judgment.",
      prompt: "Where does revenue growth belong?",
      question: "Where does revenue growth belong?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Chart behavior", "Business metrics"],
        cards: [
          { id: "volume", label: "Volume spike", target: "Chart behavior" },
          { id: "eps", label: "EPS", target: "Business metrics" },
          { id: "trend", label: "Trend direction", target: "Chart behavior" },
          { id: "revenue", label: "Revenue growth", target: "Business metrics" },
        ],
      },
      supportActivities: ["Separate price behavior.", "Separate business facts.", "Keep the lenses clean."],
      options: [
        choice("a", "Business metrics", true, ""),
        choice("b", "Chart behavior", false, "technical-vs-fundamental", "Revenue growth describes the business, not the chart pattern."),
        choice("c", "Neither lens", false, "technical-vs-fundamental", "It clearly belongs to the business lens."),
      ],
      explanation: "Correct. Revenue growth belongs to the business metrics lens.",
    },
    {
      question: "Where does revenue growth belong?",
      type: "multiple",
      options: [
        choice("a", "Business metrics", true, ""),
        choice("b", "Chart behavior", false, "technical-vs-fundamental", "That is the wrong lens."),
        choice("c", "Neither lens", false, "technical-vs-fundamental", "It clearly belongs to the business side."),
        choice("d", "Only the news feed", false, "technical-vs-fundamental", "This is still a business metric."),
      ],
      explanation: "Revenue growth belongs to the business metrics side.",
      reviewPrompt: "technical-vs-fundamental",
    },
  ),
  "business-fundamentals-2": lesson(
    "Teach what fundamentals are trying to explain about a business.",
    "You can now match common investor questions to the right metric family.",
    ["fundamentals-purpose", "business-questions"],
    [
      panel("hook", "Start with the question the metric is trying to answer", "Fundamentals make more sense when you connect each metric to a simple business question.", {
        eyebrow: "Hook",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Size question", "Growth question", "Profit question"],
          cards: [
            { id: "market-cap", label: "How big is the company?", target: "Size question" },
            { id: "growth", label: "How fast are sales growing?", target: "Growth question" },
            { id: "profit", label: "How much is left after costs?", target: "Profit question" },
          ],
        },
      }),
      panel("learn", "Metrics are tools for answering specific questions", "When you know the question, the metric stops feeling like random jargon.", {
        eyebrow: "Learn",
        activityKind: "checklist",
        activityData: {
          items: [
            "How big is the business?",
            "Is it growing?",
            "Is it profitable?",
          ],
        },
      }),
      panel("mistake", "Do not ask one metric to answer every question", "Each metric helps with a different part of the business picture.", {
        eyebrow: "Watch for",
        highlights: ["Use the right metric for the right question.", "Do not force one metric to do everything.", "Build the business picture piece by piece."],
      }),
    ],
    {
      mechanicTitle: "Metric-to-question match",
      mechanicSummary: "Match simple investor questions to the type of metric that answers them.",
      prompt: "Which metric family answers “how big is the company?”",
      question: "Which metric family answers “how big is the company?”",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Size", "Growth", "Profit"],
        cards: [
          { id: "size", label: "Market cap", target: "Size" },
          { id: "growth", label: "Revenue growth", target: "Growth" },
          { id: "profit", label: "Margin / EPS", target: "Profit" },
        ],
      },
      supportActivities: ["Read the question first.", "Match it to the metric family.", "Keep the business picture organized."],
      options: [
        choice("a", "A size metric such as market cap", true, ""),
        choice("b", "A chart pattern only", false, "fundamentals-purpose", "The question is about business size, not chart behavior."),
        choice("c", "Any metric at random", false, "fundamentals-purpose", "The point is that different metrics answer different questions."),
      ],
      explanation: "Correct. A size metric such as market cap answers the “how big is the company?” question.",
    },
    {
      question: "Which metric family answers “how big is the company?”",
      type: "multiple",
      options: [
        choice("a", "A size metric such as market cap", true, ""),
        choice("b", "A chart pattern only", false, "fundamentals-purpose", "That is the wrong lens."),
        choice("c", "Any metric at random", false, "fundamentals-purpose", "Different metrics answer different questions."),
        choice("d", "A dividend label", false, "fundamentals-purpose", "That is not the clearest answer to size."),
      ],
      explanation: "A size metric such as market cap is the right family for that question.",
      reviewPrompt: "fundamentals-purpose",
    },
  ),
  "business-fundamentals-3": lesson(
    "Teach that revenue means sales brought in by the business.",
    "You can now explain revenue in plain English.",
    ["revenue-basics", "sales"],
    [
      panel("hook", "More sales means more revenue", "Move the sales slider and watch revenue change before any costs are removed.", {
        eyebrow: "Hook",
        activityKind: "business-builder",
        activityData: { variant: "revenue-counter", units: 40, pricePerUnit: 6 },
      }),
      panel("learn", "Revenue is the money coming in", "Revenue answers the question: how much did the business sell?", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Revenue", "Not revenue"],
          cards: [
            { id: "sales", label: "Money from sales", target: "Revenue" },
            { id: "costs", label: "Money spent on costs", target: "Not revenue" },
          ],
        },
      }),
      panel("mistake", "Revenue comes before profit", "Revenue is not the leftover amount after costs.", {
        eyebrow: "Watch for",
        highlights: ["Revenue = sales in.", "Costs come later.", "Profit is a separate idea."],
      }),
    ],
    {
      mechanicTitle: "Revenue counter",
      mechanicSummary: "Change sales and watch revenue update live.",
      prompt: "What does higher revenue mean?",
      question: "What does higher revenue mean?",
      activityKind: "business-builder",
      activityData: { variant: "revenue-counter", units: 50, pricePerUnit: 5 },
      supportActivities: ["Adjust sales.", "Watch revenue change.", "Keep revenue separate from profit."],
      options: [
        choice("a", "The business brought in more sales", true, ""),
        choice("b", "The business automatically became more profitable", false, "revenue-basics", "Revenue is sales in, not profit by itself."),
        choice("c", "The stock must go up", false, "revenue-basics", "Better sales do not guarantee a stock move."),
      ],
      explanation: "Correct. Higher revenue means the business brought in more sales.",
    },
    {
      question: "What does higher revenue mean?",
      type: "multiple",
      options: [
        choice("a", "The business brought in more sales", true, ""),
        choice("b", "The business automatically became more profitable", false, "revenue-basics", "Profit depends on costs too."),
        choice("c", "The stock must go up", false, "revenue-basics", "That would overclaim what revenue alone can tell you."),
        choice("d", "Share count changed", false, "revenue-basics", "Revenue is about sales."),
      ],
      explanation: "Higher revenue means more sales came in.",
      reviewPrompt: "revenue-basics",
    },
  ),
  "business-fundamentals-4": lesson(
    "Teach that profit is what remains after costs are removed from revenue.",
    "You can now explain profit clearly.",
    ["profit-basics", "costs"],
    [
      panel("hook", "Take costs away from revenue", "Move the costs slider and watch profit change. Profit is what remains after the business pays its costs.", {
        eyebrow: "Hook",
        activityKind: "business-builder",
        activityData: { variant: "profit-builder", revenue: 140, costs: 70 },
      }),
      panel("learn", "Profit is the leftover amount", "Revenue tells you how much came in. Profit tells you what remains after spending to run the business.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Revenue", "Profit"],
          cards: [
            { id: "in", label: "Money brought in from sales", target: "Revenue" },
            { id: "left", label: "Money left after costs", target: "Profit" },
          ],
        },
      }),
      panel("mistake", "More revenue does not guarantee more profit", "Costs can rise too, which changes the leftover amount.", {
        eyebrow: "Watch for",
        highlights: ["Revenue comes in.", "Costs come out.", "Profit is what remains."],
      }),
    ],
    {
      mechanicTitle: "Profit builder",
      mechanicSummary: "Change costs and watch how the leftover amount changes.",
      prompt: "What is profit?",
      question: "What is profit?",
      activityKind: "business-builder",
      activityData: { variant: "profit-builder", revenue: 120, costs: 60 },
      supportActivities: ["Start with revenue.", "Take away costs.", "Read the leftover amount."],
      options: [
        choice("a", "Money left after costs", true, ""),
        choice("b", "Any money the company takes in", false, "profit-basics", "That describes revenue, not profit."),
        choice("c", "The stock price", false, "profit-basics", "Profit is a business metric, not the stock price."),
      ],
      explanation: "Correct. Profit is what remains after costs are removed from revenue.",
    },
    {
      question: "What is profit?",
      type: "multiple",
      options: [
        choice("a", "Money left after costs", true, ""),
        choice("b", "Any money the company takes in", false, "profit-basics", "That is revenue."),
        choice("c", "The stock price", false, "profit-basics", "That is not the business metric here."),
        choice("d", "The number of shares", false, "profit-basics", "That is unrelated."),
      ],
      explanation: "Profit is the money left after costs are removed.",
      reviewPrompt: "profit-basics",
    },
  ),
  "business-fundamentals-5": lesson(
    "Teach margin as the share of revenue that remains as profit.",
    "You can now compare margin more intuitively.",
    ["margin-basics", "efficiency"],
    [
      panel("hook", "Two businesses can sell the same amount and keep different amounts", "Compare the company cards. Margin is about how much of the revenue survives as profit.", {
        eyebrow: "Hook",
        activityKind: "business-builder",
        activityData: {
          variant: "margin-compare",
          companies: [
            { id: "a", name: "Company A", revenue: "$100", profit: "$30", margin: "30%", note: "Keeps more of each sales dollar." },
            { id: "b", name: "Company B", revenue: "$100", profit: "$10", margin: "10%", note: "Keeps less after costs." },
          ],
        },
      }),
      panel("learn", "Margin is an efficiency clue", "If two companies sell the same amount, the one keeping more profit has the better margin.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Better margin", "Weaker margin"],
          cards: [
            { id: "better", label: "Keeps $30 from $100", target: "Better margin" },
            { id: "weaker", label: "Keeps $10 from $100", target: "Weaker margin" },
          ],
        },
      }),
      panel("mistake", "Revenue alone does not tell you efficiency", "That is why margin matters.", {
        eyebrow: "Watch for",
        highlights: ["Same revenue can hide different quality.", "Margin shows what is left.", "Efficiency matters."],
      }),
    ],
    {
      mechanicTitle: "Margin compare",
      mechanicSummary: "Compare businesses with the same revenue but different profit retention.",
      prompt: "Which company has the better margin?",
      question: "Which company has the better margin?",
      activityKind: "business-builder",
      activityData: {
        variant: "margin-compare",
        companies: [
          { id: "a", name: "Company A", revenue: "$120", profit: "$36", margin: "30%" },
          { id: "b", name: "Company B", revenue: "$120", profit: "$12", margin: "10%" },
        ],
      },
      supportActivities: ["Compare the revenue.", "Compare the profit left over.", "Choose the more efficient business."],
      options: [
        choice("a", "The company keeping more profit from the same revenue", true, ""),
        choice("b", "The company with lower leftover profit", false, "margin-basics", "Lower leftover profit means weaker margin."),
        choice("c", "Any company with the same revenue", false, "margin-basics", "Revenue alone is not enough."),
      ],
      explanation: "Correct. Better margin means keeping more profit from the same revenue.",
    },
    {
      question: "Which company has the better margin?",
      type: "multiple",
      options: [
        choice("a", "The company keeping more profit from the same revenue", true, ""),
        choice("b", "The company with lower leftover profit", false, "margin-basics", "That is the weaker margin."),
        choice("c", "Any company with the same revenue", false, "margin-basics", "Revenue alone is not the full story."),
        choice("d", "Whichever stock chart looks better", false, "margin-basics", "This lesson is about business efficiency."),
      ],
      explanation: "The better margin belongs to the company keeping more profit from the same revenue.",
      reviewPrompt: "margin-basics",
    },
  ),
  "business-fundamentals-6": lesson(
    "Teach that growth and quality are different business dimensions.",
    "You can now compare growth and profitability more carefully.",
    ["growth-vs-quality", "business-profile"],
    [
      panel("hook", "One company can grow faster while another runs more efficiently", "Compare the profiles. Growth and quality do not always point to the same company.", {
        eyebrow: "Hook",
        activityKind: "business-builder",
        activityData: {
          variant: "margin-compare",
          companies: [
            { id: "a", name: "FastGrow", revenue: "Growth 28%", profit: "Margin 8%", margin: "Low margin" },
            { id: "b", name: "SteadyCore", revenue: "Growth 12%", profit: "Margin 22%", margin: "Higher margin" },
          ],
        },
      }),
      panel("learn", "Growth asks how fast sales are expanding", "Quality asks whether the business is keeping enough of what it earns.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Growth clue", "Quality clue"],
          cards: [
            { id: "sales-up", label: "Revenue rising fast", target: "Growth clue" },
            { id: "margin", label: "Strong margin", target: "Quality clue" },
          ],
        },
      }),
      panel("mistake", "Fast growth is not the whole story", "Better business understanding comes from holding both lenses together.", {
        eyebrow: "Watch for",
        highlights: ["Growth matters.", "Quality matters too.", "They are not interchangeable."],
      }),
    ],
    {
      mechanicTitle: "Growth vs quality compare",
      mechanicSummary: "Compare which company is growing faster and which one seems more profitable.",
      prompt: "Which company grew faster, and which seems more profitable?",
      question: "Which company grew faster but had weaker profitability?",
      activityKind: "business-builder",
      activityData: {
        variant: "margin-compare",
        companies: [
          { id: "a", name: "FastGrow", revenue: "Growth 30%", profit: "Margin 7%", margin: "Lower margin" },
          { id: "b", name: "SteadyCore", revenue: "Growth 12%", profit: "Margin 24%", margin: "Higher margin" },
        ],
      },
      supportActivities: ["Read the growth clue.", "Read the profitability clue.", "Hold both in view."],
      options: [
        choice("a", "FastGrow", true, ""),
        choice("b", "SteadyCore", false, "growth-vs-quality", "SteadyCore looks more profitable, but it is not the faster grower here."),
        choice("c", "Both mean the same thing", false, "growth-vs-quality", "Growth and quality are different dimensions."),
      ],
      explanation: "Correct. FastGrow grew faster, but it also looks less profitable.",
    },
    {
      question: "Which company grew faster but had weaker profitability?",
      type: "multiple",
      options: [
        choice("a", "FastGrow", true, ""),
        choice("b", "SteadyCore", false, "growth-vs-quality", "That company looks more profitable, not faster-growing."),
        choice("c", "Both", false, "growth-vs-quality", "The profiles are different on purpose."),
        choice("d", "Neither", false, "growth-vs-quality", "One company clearly fits the description."),
      ],
      explanation: "FastGrow is the faster grower with weaker profitability in this comparison.",
      reviewPrompt: "growth-vs-quality",
    },
  ),
  "business-fundamentals-7": lesson(
    "Teach that different metrics answer different business questions.",
    "You can now match the right metric to the right question.",
    ["metric-purpose", "fundamental-questions"],
    [
      panel("hook", "Match the metric to the question", "A cleaner beginner read starts with the question you are trying to answer.", {
        eyebrow: "Hook",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Sales question", "Profit question", "Size question"],
          cards: [
            { id: "revenue", label: "How much is the business selling?", target: "Sales question" },
            { id: "margin", label: "How much is left after costs?", target: "Profit question" },
            { id: "cap", label: "How big is the company?", target: "Size question" },
          ],
        },
      }),
      panel("learn", "Metrics become simpler when the question is simple", "You do not need jargon first. You need the business question first.", {
        eyebrow: "Learn",
        activityKind: "checklist",
        activityData: {
          items: ["How much is it selling?", "How much is it keeping?", "How big is it?"],
        },
      }),
      panel("mistake", "Do not ask one metric to answer every business question", "Each metric gives you one part of the picture.", {
        eyebrow: "Watch for",
        highlights: ["Revenue answers sales.", "Profit / margin answers what is left.", "Market cap answers size."],
      }),
    ],
    {
      mechanicTitle: "Metric question match",
      mechanicSummary: "Connect the question to the right metric instead of guessing from jargon.",
      prompt: "Which metric tells you profitability?",
      question: "Which metric tells you profitability?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Profitability", "Not profitability"],
        cards: [
          { id: "margin", label: "Margin", target: "Profitability" },
          { id: "eps", label: "EPS", target: "Profitability" },
          { id: "market-cap", label: "Market cap", target: "Not profitability" },
        ],
      },
      supportActivities: ["Start with the question.", "Match the metric.", "Keep the picture organized."],
      options: [
        choice("a", "A profitability metric such as margin", true, ""),
        choice("b", "Market cap", false, "metric-purpose", "Market cap answers size, not profitability."),
        choice("c", "A trend line only", false, "metric-purpose", "That is the wrong lens."),
      ],
      explanation: "Correct. Margin is a profitability metric.",
    },
    {
      question: "Which metric tells you profitability?",
      type: "multiple",
      options: [
        choice("a", "A profitability metric such as margin", true, ""),
        choice("b", "Market cap", false, "metric-purpose", "Market cap answers size."),
        choice("c", "A trend line only", false, "metric-purpose", "This question is about business metrics."),
        choice("d", "A random metric", false, "metric-purpose", "The point is to use the right one."),
      ],
      explanation: "A profitability metric such as margin is the right answer.",
      reviewPrompt: "metric-purpose",
    },
  ),
  "business-fundamentals-8": lesson(
    "Teach that price can move faster than business fundamentals change.",
    "You can now separate market reaction speed from business change speed.",
    ["price-vs-business-timing", "timeline-thinking"],
    [
      panel("hook", "Put the events in order", "News, price moves, and business reports do not always update at the same speed.", {
        eyebrow: "Hook",
        activityKind: "sequence-lab",
        activityData: {
          steps: [
            { id: "news", label: "News changes expectations", description: "The market reacts quickly." },
            { id: "price", label: "Price jumps", description: "The market can move immediately." },
            { id: "report", label: "Revenue report confirms later", description: "Business proof may arrive later." },
          ],
        },
      }),
      panel("learn", "Markets can react before the slower business proof arrives", "Price is fast. Business results can take longer to show up in the numbers.", {
        eyebrow: "Learn",
        activityKind: "checklist",
        activityData: {
          items: ["Expectation shift", "Price reaction", "Business report later"],
        },
      }),
      panel("mistake", "Do not assume price waits for every report", "Sometimes the market reacts to new expectations before the full numbers arrive.", {
        eyebrow: "Watch for",
        highlights: ["Price can move fast.", "Business reports can lag.", "Timing matters."],
      }),
    ],
    {
      mechanicTitle: "Timing order",
      mechanicSummary: "Put the market reaction and business events in the right sequence.",
      prompt: "Which changed first?",
      question: "Which often changes first?",
      activityKind: "sequence-lab",
      activityData: {
        steps: [
          { id: "expectations", label: "Expectations shift", description: "New information changes the outlook." },
          { id: "price", label: "Price reacts", description: "The market moves quickly." },
          { id: "business", label: "Revenue report arrives", description: "Business proof can come later." },
        ],
      },
      supportActivities: ["Start with the expectation shift.", "Place the price reaction next.", "Let the slower report come later."],
      options: [
        choice("a", "Price or expectations can shift before the full report", true, ""),
        choice("b", "The report must always come first", false, "price-vs-business-timing", "The market often reacts faster than the report cycle."),
        choice("c", "Nothing can move until all numbers are final", false, "price-vs-business-timing", "Markets rarely work that slowly."),
      ],
      explanation: "Correct. Price or expectations can shift before the full business report arrives.",
    },
    {
      question: "Which often changes first?",
      type: "multiple",
      options: [
        choice("a", "Price or expectations can shift before the full report", true, ""),
        choice("b", "The report must always come first", false, "price-vs-business-timing", "That is too rigid."),
        choice("c", "Nothing can move until all numbers are final", false, "price-vs-business-timing", "That ignores how quickly markets react."),
        choice("d", "Share count changes first", false, "price-vs-business-timing", "That is not the key timing lesson here."),
      ],
      explanation: "Price or expectations can shift before the full report arrives.",
      reviewPrompt: "price-vs-business-timing",
    },
  ),
  "business-fundamentals-9": lesson(
    "Teach a simple beginner company snapshot framework.",
    "You can now build a basic company snapshot.",
    ["company-snapshot", "beginner-framework"],
    [
      panel("hook", "Build the first-look business board", "A beginner snapshot should answer a few core questions, not every question at once.", {
        eyebrow: "Hook",
        activityKind: "business-builder",
        activityData: {
          variant: "snapshot-board",
          sections: [
            { label: "Sales", value: "Revenue trend" },
            { label: "Profit", value: "Margin / EPS" },
            { label: "Size", value: "Market cap" },
          ],
        },
      }),
      panel("learn", "The snapshot is meant to simplify the business", "You want a compact first read: size, sales, and what is left after costs.", {
        eyebrow: "Learn",
        activityKind: "checklist",
        activityData: {
          items: ["How big is it?", "Is it growing?", "Is it profitable?"],
        },
      }),
      panel("mistake", "Do not start with twenty metrics", "A strong beginner snapshot is compact and focused.", {
        eyebrow: "Watch for",
        highlights: ["Keep it short.", "Use the big categories.", "Add detail later."],
      }),
    ],
    {
      mechanicTitle: "Company snapshot board",
      mechanicSummary: "Fill the first-look company snapshot with the right metric categories.",
      prompt: "What three things would you want to know first?",
      question: "What three things would you want to know first?",
      activityKind: "business-builder",
      activityData: {
        variant: "snapshot-board",
        sections: [
          { label: "Size", value: "How big is the company?" },
          { label: "Growth", value: "Are sales growing?" },
          { label: "Profit", value: "What is left after costs?" },
        ],
      },
      supportActivities: ["Keep the snapshot compact.", "Use size, growth, and profit.", "Avoid unnecessary clutter."],
      options: [
        choice("a", "Size, growth, and profitability", true, ""),
        choice("b", "Logo color, office size, and chart color", false, "company-snapshot", "Those are not the core business questions."),
        choice("c", "One metric only", false, "company-snapshot", "A snapshot should have at least a few core dimensions."),
      ],
      explanation: "Correct. A strong beginner snapshot starts with size, growth, and profitability.",
    },
    {
      question: "What three things would you want to know first?",
      type: "multiple",
      options: [
        choice("a", "Size, growth, and profitability", true, ""),
        choice("b", "Logo color, office size, and chart color", false, "company-snapshot", "Those are not the core business questions."),
        choice("c", "One metric only", false, "company-snapshot", "A snapshot should cover more than one dimension."),
        choice("d", "Every metric ever reported", false, "company-snapshot", "That is not a beginner snapshot."),
      ],
      explanation: "Size, growth, and profitability are the right core questions.",
      reviewPrompt: "company-snapshot",
    },
  ),
  "business-fundamentals-10": lesson(
    "Combine revenue, profit, margin, growth, and business snapshot logic.",
    "Business Fundamentals complete.",
    ["revenue-basics", "profit-basics", "margin-basics", "company-snapshot"],
    [
      panel("hook", "Build the business snapshot from multiple clues", "This checkpoint combines sales, what is left after costs, growth, and the simplified company picture.", {
        eyebrow: "Boss setup",
        activityKind: "business-builder",
        activityData: {
          variant: "snapshot-board",
          sections: [
            { label: "Revenue", value: "Growing steadily" },
            { label: "Profit", value: "Positive" },
            { label: "Margin", value: "Moderate" },
            { label: "Profile", value: "Still improving quality" },
          ],
        },
      }),
      panel("learn", "The stronger summary uses multiple business clues", "A good company snapshot does not stop at one metric.", {
        eyebrow: "Learn",
        activityKind: "signal-stack",
        activityData: {
          clues: [
            { title: "Revenue", detail: "Sales are rising." },
            { title: "Profit", detail: "Money is still left after costs." },
            { title: "Margin", detail: "Efficiency matters too." },
          ],
        },
      }),
      panel("careful", "Finish with the compact business read", "The final takeaway should sound like a beginner company profile, not a random list of numbers.", {
        eyebrow: "Careful interpretation",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Good snapshot thinking", "Weak snapshot thinking"],
          cards: [
            { id: "good", label: "Use growth, profit, and margin together", target: "Good snapshot thinking" },
            { id: "weak", label: "One metric tells the whole story", target: "Weak snapshot thinking" },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "Business snapshot checkpoint",
      mechanicSummary: "Use the business clues together and choose the strongest summary.",
      prompt: "Which company profile sounds strongest?",
      question: "Which company profile sounds strongest?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "Revenue", detail: "Growing" },
          { title: "Profit", detail: "Positive" },
          { title: "Margin", detail: "Still matters" },
        ],
      },
      supportActivities: ["Use more than one clue.", "Build a compact profile.", "Avoid one-metric thinking."],
      options: [
        choice("a", "Growing sales with profit and margin context", true, ""),
        choice("b", "One metric explains everything", false, "business-fundamentals-boss", "The boss lesson is about combining business clues."),
        choice("c", "Charts replace all business context", false, "business-fundamentals-boss", "This module is specifically about the business side."),
      ],
      explanation: "Correct. The stronger company profile uses growth, profit, and margin together.",
    },
    {
      question: "Which company profile sounds strongest?",
      type: "multiple",
      options: [
        choice("a", "Growing sales with profit and margin context", true, ""),
        choice("b", "One metric explains everything", false, "business-fundamentals-boss", "That is the wrong boss-level mindset."),
        choice("c", "Charts replace all business context", false, "business-fundamentals-boss", "The business snapshot still matters."),
        choice("d", "No company clues are needed", false, "business-fundamentals-boss", "That defeats the purpose of the module."),
      ],
      explanation: "The strongest profile uses multiple business clues together.",
      reviewPrompt: "business-fundamentals-boss",
    },
  ),
};

const marketCapAndRevenueLessons: Record<string, AuthoredLessonExperience> = {
  "market-cap-and-revenue-1": lesson(
    "Teach that market cap means the total market value of all shares together.",
    "You can now explain market cap clearly.",
    ["market-cap-basics", "size"],
    [
      panel("hook", "Build the market cap from the pieces", "Market cap comes from share price multiplied by share count.", {
        eyebrow: "Hook",
        activityKind: "market-cap-board",
        activityData: { variant: "market-cap-builder", sharePrice: 24, shareCount: 40 },
      }),
      panel("learn", "Market cap answers the size question", "It tells you how large the company is in market value terms, not just what one share costs.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Size clue", "Not size clue"],
          cards: [
            { id: "cap", label: "Total value of all shares", target: "Size clue" },
            { id: "price-only", label: "Only the price of one share", target: "Not size clue" },
          ],
        },
      }),
      panel("mistake", "Share price alone does not tell you company size", "You need the share count too.", {
        eyebrow: "Watch for",
        highlights: ["Share price matters.", "Share count matters too.", "Together they create market cap."],
      }),
    ],
    {
      mechanicTitle: "Market cap builder",
      mechanicSummary: "Change share price and share count, then read the total market value.",
      prompt: "What does market cap describe?",
      question: "What does market cap describe?",
      activityKind: "market-cap-board",
      activityData: { variant: "market-cap-builder", sharePrice: 25, shareCount: 40 },
      supportActivities: ["Use both inputs.", "Read the total value.", "Keep size separate from price alone."],
      options: [
        choice("a", "The total market value of all shares together", true, ""),
        choice("b", "Only the price of one share", false, "market-cap-basics", "That is not enough to describe market cap."),
        choice("c", "Guaranteed company quality", false, "market-cap-basics", "Market cap describes size, not guaranteed quality."),
      ],
      explanation: "Correct. Market cap describes the total market value of all shares together.",
    },
    {
      question: "What does market cap describe?",
      type: "multiple",
      options: [
        choice("a", "The total market value of all shares together", true, ""),
        choice("b", "Only the price of one share", false, "market-cap-basics", "That misses the share count."),
        choice("c", "Guaranteed company quality", false, "market-cap-basics", "That is not what market cap tells you."),
        choice("d", "Only revenue growth", false, "market-cap-basics", "That is a different metric."),
      ],
      explanation: "Market cap describes the total market value of all shares together.",
      reviewPrompt: "market-cap-basics",
    },
  ),
  "market-cap-and-revenue-2": lesson(
    "Teach that share price alone can be misleading about company size.",
    "You can now avoid the share-price trap.",
    ["share-price-misleading", "size-vs-price"],
    [
      panel("hook", "Compare price and share count together", "A $20 stock can still be a bigger company than a $200 stock if it has far more shares.", {
        eyebrow: "Hook",
        activityKind: "market-cap-board",
        activityData: {
          variant: "company-compare",
          companies: [
            { id: "a", name: "LowPrice Co", price: "$20", shares: "4B", cap: "$80B" },
            { id: "b", name: "HighPrice Co", price: "$200", shares: "100M", cap: "$20B" },
          ],
        },
      }),
      panel("learn", "Price per share is not the same thing as company size", "Share price is just one part of the size equation.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Helps with size", "Not enough for size"],
          cards: [
            { id: "price+shares", label: "Price plus share count", target: "Helps with size" },
            { id: "price-only", label: "Share price alone", target: "Not enough for size" },
          ],
        },
      }),
      panel("mistake", "Cheap-looking is not the same as small", "The sticker price of one share can fool you if you ignore share count.", {
        eyebrow: "Watch for",
        highlights: ["Share price alone can mislead.", "Company size needs more context.", "Use market cap instead."],
      }),
    ],
    {
      mechanicTitle: "Size compare",
      mechanicSummary: "Compare companies with different prices and share counts without getting fooled by the sticker price.",
      prompt: "Which company is larger?",
      question: "Which company is larger?",
      activityKind: "market-cap-board",
      activityData: {
        variant: "company-compare",
        companies: [
          { id: "a", name: "LowPrice Co", price: "$18", shares: "5B", cap: "$90B" },
          { id: "b", name: "HighPrice Co", price: "$120", shares: "200M", cap: "$24B" },
        ],
      },
      supportActivities: ["Read both share price and share count.", "Compare the market caps.", "Ignore the sticker-price trap."],
      options: [
        choice("a", "The lower-priced stock with the larger market cap", true, ""),
        choice("b", "The stock with the higher share price automatically", false, "share-price-misleading", "Higher share price alone is not enough."),
        choice("c", "They must be the same size", false, "share-price-misleading", "The market caps show otherwise."),
      ],
      explanation: "Correct. The lower-priced stock can still represent the larger company.",
    },
    {
      question: "Which company is larger?",
      type: "multiple",
      options: [
        choice("a", "The lower-priced stock with the larger market cap", true, ""),
        choice("b", "The stock with the higher share price automatically", false, "share-price-misleading", "That is the exact trap to avoid."),
        choice("c", "They must be the same size", false, "share-price-misleading", "The market cap says otherwise."),
        choice("d", "You cannot know at all", false, "share-price-misleading", "You can know once you compare price and share count."),
      ],
      explanation: "The larger company is the one with the larger market cap, even if its share price is lower.",
      reviewPrompt: "share-price-misleading",
    },
  ),
  "market-cap-and-revenue-3": lesson(
    "Teach that revenue growth means sales are increasing over time.",
    "You can now read revenue growth more clearly.",
    ["revenue-growth", "sales-trend"],
    [
      panel("hook", "Compare revenue bars over time", "Revenue growth is about sales increasing from one period to the next.", {
        eyebrow: "Hook",
        activityKind: "market-cap-board",
        activityData: {
          variant: "growth-bars",
          companies: [
            { id: "grow", name: "GrowCo", revenue: [20, 34, 48, 62], note: "Sales keep increasing." },
            { id: "flat", name: "FlatCo", revenue: [40, 42, 40, 41], note: "Sales are barely changing." },
          ],
        },
      }),
      panel("learn", "Revenue growth is a business activity clue", "It helps you see whether the business is selling more over time.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Growth clue", "Not growth clue"],
          cards: [
            { id: "sales-up", label: "Sales rising over time", target: "Growth clue" },
            { id: "price-only", label: "Share price changed today", target: "Not growth clue" },
          ],
        },
      }),
      panel("mistake", "Growth is not the same as stock performance", "Revenue growth is a business measure, not a guaranteed stock outcome.", {
        eyebrow: "Watch for",
        highlights: ["Growth = sales rising.", "It is about the business.", "It does not guarantee the stock move."],
      }),
    ],
    {
      mechanicTitle: "Revenue growth compare",
      mechanicSummary: "Compare company revenue paths and identify the faster grower.",
      prompt: "Which company is growing faster?",
      question: "Which company is growing faster?",
      activityKind: "market-cap-board",
      activityData: {
        variant: "growth-bars",
        companies: [
          { id: "grow", name: "GrowCo", revenue: [18, 30, 46, 64], note: "Revenue keeps rising." },
          { id: "slow", name: "SlowCo", revenue: [28, 34, 38, 42], note: "Revenue is still rising, but more slowly." },
        ],
      },
      supportActivities: ["Compare bar growth over time.", "Look for the faster climb.", "Stay on the business lens."],
      options: [
        choice("a", "The company whose revenue rises faster over time", true, ""),
        choice("b", "The company with the loudest stock move today", false, "revenue-growth", "That is not a revenue growth answer."),
        choice("c", "Whichever stock price is higher", false, "revenue-growth", "That does not answer the growth question."),
      ],
      explanation: "Correct. Revenue growth is about the company whose sales are rising faster over time.",
    },
    {
      question: "Which company is growing faster?",
      type: "multiple",
      options: [
        choice("a", "The company whose revenue rises faster over time", true, ""),
        choice("b", "The company with the loudest stock move today", false, "revenue-growth", "That is the wrong lens."),
        choice("c", "Whichever stock price is higher", false, "revenue-growth", "That does not answer the growth question."),
        choice("d", "Neither company can be compared", false, "revenue-growth", "The revenue path allows a comparison."),
      ],
      explanation: "The faster grower is the company whose revenue rises faster over time.",
      reviewPrompt: "revenue-growth",
    },
  ),
  "market-cap-and-revenue-4": lesson(
    "Teach the difference between size and growth.",
    "You can now separate company size from company growth.",
    ["size-vs-growth", "two-dimensions"],
    [
      panel("hook", "Big and fast-growing are different labels", "Sort the examples into size, growth, or both.", {
        eyebrow: "Hook",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Size", "Growth", "Both"],
          cards: [
            { id: "market-cap", label: "Market cap", target: "Size" },
            { id: "revenue-growth", label: "Revenue growth", target: "Growth" },
            { id: "profile", label: "A big company growing sales", target: "Both" },
          ],
        },
      }),
      panel("learn", "Size asks how large the company is", "Growth asks how fast the business is expanding. The questions are related, but not the same.", {
        eyebrow: "Learn",
        activityKind: "checklist",
        activityData: { items: ["How big is it?", "How fast is it growing?"] },
      }),
      panel("mistake", "Do not assume big means fast-growing", "Those dimensions need separate evidence.", {
        eyebrow: "Watch for",
        highlights: ["Size and growth are different.", "You can compare both.", "Do not merge them into one idea."],
      }),
    ],
    {
      mechanicTitle: "Size vs growth sort",
      mechanicSummary: "Separate size clues from growth clues before you compare companies.",
      prompt: "Which metric answers which question?",
      question: "Which metric answers the growth question?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Size", "Growth"],
        cards: [
          { id: "cap", label: "Market cap", target: "Size" },
          { id: "growth", label: "Revenue growth", target: "Growth" },
        ],
      },
      supportActivities: ["Ask the question first.", "Then match the metric.", "Keep size and growth separate."],
      options: [
        choice("a", "Revenue growth", true, ""),
        choice("b", "Market cap", false, "size-vs-growth", "Market cap answers the size question."),
        choice("c", "Share price alone", false, "size-vs-growth", "That is not a clean growth metric."),
      ],
      explanation: "Correct. Revenue growth answers the growth question.",
    },
    {
      question: "Which metric answers the growth question?",
      type: "multiple",
      options: [
        choice("a", "Revenue growth", true, ""),
        choice("b", "Market cap", false, "size-vs-growth", "That answers size."),
        choice("c", "Share price alone", false, "size-vs-growth", "That is not the clean growth metric."),
        choice("d", "Any metric equally", false, "size-vs-growth", "Different metrics answer different questions."),
      ],
      explanation: "Revenue growth is the growth metric here.",
      reviewPrompt: "size-vs-growth",
    },
  ),
  "market-cap-and-revenue-5": lesson(
    "Teach the difference between mature and expanding business profiles.",
    "You can now compare mature and expanding businesses more clearly.",
    ["mature-vs-expanding", "business-profile"],
    [
      panel("hook", "Compare the business profiles", "A mature company often grows more slowly. An expanding company often grows faster but can look less settled.", {
        eyebrow: "Hook",
        activityKind: "market-cap-board",
        activityData: {
          variant: "company-compare",
          companies: [
            { id: "mature", name: "SteadyCorp", price: "$85", shares: "900M", cap: "$76.5B", growth: "Growth 8%" },
            { id: "expand", name: "ExpandCo", price: "$46", shares: "400M", cap: "$18.4B", growth: "Growth 28%" },
          ],
        },
      }),
      panel("learn", "Mature and expanding profiles answer different questions", "One can be bigger and steadier. The other can be smaller and growing faster.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Mature profile", "Expanding profile"],
          cards: [
            { id: "mature", label: "Slower growth, steadier scale", target: "Mature profile" },
            { id: "expand", label: "Faster growth, earlier stage", target: "Expanding profile" },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "Profile compare",
      mechanicSummary: "Compare mature and expanding businesses without assuming one profile is automatically better.",
      prompt: "Which profile looks more mature?",
      question: "Which profile looks more mature?",
      activityKind: "market-cap-board",
      activityData: {
        variant: "company-compare",
        companies: [
          { id: "mature", name: "SteadyCorp", price: "$92", shares: "1B", cap: "$92B", growth: "Growth 9%" },
          { id: "expand", name: "ExpandCo", price: "$40", shares: "350M", cap: "$14B", growth: "Growth 30%" },
        ],
      },
      supportActivities: ["Read the size clues.", "Read the growth clues.", "Match the right profile."],
      options: [
        choice("a", "The bigger, slower-growing business", true, ""),
        choice("b", "The smaller, faster-growing business", false, "mature-vs-expanding", "That sounds more like the expanding profile."),
        choice("c", "They must be identical", false, "mature-vs-expanding", "The lesson is about how the profiles differ."),
      ],
      explanation: "Correct. The bigger, slower-growing business looks more mature here.",
    },
    {
      question: "Which profile looks more mature?",
      type: "multiple",
      options: [
        choice("a", "The bigger, slower-growing business", true, ""),
        choice("b", "The smaller, faster-growing business", false, "mature-vs-expanding", "That is the expanding profile."),
        choice("c", "They must be identical", false, "mature-vs-expanding", "The profiles are intentionally different."),
        choice("d", "Whichever stock price is lower", false, "mature-vs-expanding", "The profile comes from more than one clue."),
      ],
      explanation: "The bigger, slower-growing business is the more mature profile here.",
      reviewPrompt: "mature-vs-expanding",
    },
  ),
  "market-cap-and-revenue-6": lesson(
    "Teach that revenue growth itself can speed up or slow down.",
    "You can now spot slowing revenue growth.",
    ["growth-rate-change", "deceleration"],
    [
      panel("hook", "Growth can still be positive while slowing", "Compare the revenue bars. The business can still be growing even if each new step is smaller.", {
        eyebrow: "Hook",
        activityKind: "market-cap-board",
        activityData: {
          variant: "growth-bars",
          companies: [
            { id: "slow", name: "SlowCo", revenue: [24, 38, 48, 54], note: "Still growing, but each step is smaller." },
            { id: "fast", name: "FastCo", revenue: [24, 36, 52, 72], note: "Growth keeps accelerating." },
          ],
        },
      }),
      panel("learn", "Growth rate change matters too", "A company can have positive revenue growth while its growth rate is cooling.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Growth slowing", "Growth accelerating"],
          cards: [
            { id: "slow", label: "Still up, but each step is smaller", target: "Growth slowing" },
            { id: "fast", label: "Each step gets bigger", target: "Growth accelerating" },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "Growth-rate compare",
      mechanicSummary: "Compare revenue paths to see whether growth is accelerating or decelerating.",
      prompt: "Which company’s growth is slowing?",
      question: "Which company’s growth is slowing?",
      activityKind: "market-cap-board",
      activityData: {
        variant: "growth-bars",
        companies: [
          { id: "slow", name: "SlowCo", revenue: [24, 38, 48, 54], note: "Positive, but cooling." },
          { id: "fast", name: "FastCo", revenue: [24, 36, 52, 72], note: "Speeding up." },
        ],
      },
      supportActivities: ["Look at each jump between bars.", "Compare whether the jumps grow or shrink.", "Choose the slowing path."],
      options: [
        choice("a", "SlowCo", true, ""),
        choice("b", "FastCo", false, "growth-rate-change", "FastCo is the accelerating path here."),
        choice("c", "Neither can be compared", false, "growth-rate-change", "The revenue bars are enough for a first comparison."),
      ],
      explanation: "Correct. SlowCo is still growing, but its growth rate is slowing.",
    },
    {
      question: "Which company’s growth is slowing?",
      type: "multiple",
      options: [
        choice("a", "SlowCo", true, ""),
        choice("b", "FastCo", false, "growth-rate-change", "That company is accelerating here."),
        choice("c", "Neither can be compared", false, "growth-rate-change", "The chart gives enough to compare the growth pattern."),
        choice("d", "The larger company automatically", false, "growth-rate-change", "Size is not the same as growth rate."),
      ],
      explanation: "SlowCo is the company whose growth is slowing.",
      reviewPrompt: "growth-rate-change",
    },
  ),
  "market-cap-and-revenue-7": lesson(
    "Teach that bigger is not automatically safer.",
    "You can now use size more carefully.",
    ["size-not-safety", "careful-interpretation"],
    [
      panel("hook", "Choose the more careful statement", "Company size can matter, but it does not automatically make the stock safer.", {
        eyebrow: "Hook",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Careful", "Careless"],
          cards: [
            { id: "careful", label: "Bigger can help, but it is not automatic safety.", target: "Careful" },
            { id: "careless", label: "Big companies are always safe.", target: "Careless" },
          ],
        },
      }),
      panel("learn", "Size is one clue, not a verdict", "The learner should ask what risks still matter even for a large company.", {
        eyebrow: "Learn",
        activityKind: "signal-stack",
        activityData: {
          clues: [
            { title: "Size", detail: "Large market cap" },
            { title: "Growth", detail: "Could still slow" },
            { title: "Quality", detail: "Still needs context" },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "Careful size read",
      mechanicSummary: "Use company size as context without turning it into a blanket safety claim.",
      prompt: "Which statement is more careful?",
      question: "Which statement is more careful?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Careful", "Careless"],
        cards: [
          { id: "careful", label: "Bigger is not automatically safer", target: "Careful" },
          { id: "careless", label: "Big market cap means no risk", target: "Careless" },
        ],
      },
      supportActivities: ["Keep size in context.", "Avoid absolute safety claims.", "Choose the careful statement."],
      options: [
        choice("a", "Bigger is not automatically safer", true, ""),
        choice("b", "Big market cap means no risk", false, "size-not-safety", "That is too absolute."),
        choice("c", "Size never matters at all", false, "size-not-safety", "That throws away a useful clue."),
      ],
      explanation: "Correct. Bigger is not automatically safer.",
    },
    {
      question: "Which statement is more careful?",
      type: "multiple",
      options: [
        choice("a", "Bigger is not automatically safer", true, ""),
        choice("b", "Big market cap means no risk", false, "size-not-safety", "That is overconfident."),
        choice("c", "Size never matters at all", false, "size-not-safety", "Size can still matter as context."),
        choice("d", "Price alone answers safety", false, "size-not-safety", "That is not the right measure."),
      ],
      explanation: "The careful statement is that bigger is not automatically safer.",
      reviewPrompt: "size-not-safety",
    },
  ),
  "market-cap-and-revenue-8": lesson(
    "Teach that faster growth is not automatically better.",
    "You can now read fast growth more carefully.",
    ["growth-not-automatically-better", "missing-context"],
    [
      panel("hook", "Fast growth still needs context", "A company can grow quickly and still deserve deeper questions about quality, margins, or durability.", {
        eyebrow: "Hook",
        activityKind: "signal-stack",
        activityData: {
          clues: [
            { title: "Fast growth", detail: "Revenue is rising quickly." },
            { title: "Low margin", detail: "Profitability may still be thin." },
            { title: "More questions", detail: "You still need context." },
          ],
        },
      }),
      panel("learn", "Growth speed is not the whole investment story", "The careful learner asks what supports that growth and what tradeoffs come with it.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Careful", "Careless"],
          cards: [
            { id: "careful", label: "Fast growth needs more context", target: "Careful" },
            { id: "careless", label: "Faster growth is automatically better", target: "Careless" },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "Growth context",
      mechanicSummary: "Treat fast growth as important context, not an automatic verdict.",
      prompt: "What more context would you want?",
      question: "What more context would you want?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "Margins", detail: "Is the growth profitable?" },
          { title: "Durability", detail: "Can it keep going?" },
          { title: "Valuation", detail: "What is already priced in?" },
        ],
      },
      supportActivities: ["Start with growth.", "Ask what supports it.", "Look for the missing context."],
      options: [
        choice("a", "Profitability and quality context", true, ""),
        choice("b", "No more context is needed", false, "growth-not-automatically-better", "That is exactly the mistake this lesson is fixing."),
        choice("c", "Only the share price sticker", false, "growth-not-automatically-better", "That is not enough."),
      ],
      explanation: "Correct. Fast growth still needs profitability and quality context.",
    },
    {
      question: "What more context would you want?",
      type: "multiple",
      options: [
        choice("a", "Profitability and quality context", true, ""),
        choice("b", "No more context is needed", false, "growth-not-automatically-better", "That is too simple."),
        choice("c", "Only the share price sticker", false, "growth-not-automatically-better", "That does not answer the deeper question."),
        choice("d", "Nothing but hype", false, "growth-not-automatically-better", "That is not useful context."),
      ],
      explanation: "Profitability and quality context are the stronger next questions.",
      reviewPrompt: "growth-not-automatically-better",
    },
  ),
  "market-cap-and-revenue-9": lesson(
    "Teach a simple company comparison using size and growth together.",
    "You can now compare two companies using size and growth.",
    ["company-comparison", "size-growth-compare"],
    [
      panel("hook", "Compare the two companies on two dimensions", "Use one clue for size and one clue for growth. That already gives you a cleaner beginner comparison.", {
        eyebrow: "Hook",
        activityKind: "market-cap-board",
        activityData: {
          variant: "company-compare",
          companies: [
            { id: "alpha", name: "Alpha", price: "$80", shares: "1B", cap: "$80B", growth: "Growth 10%" },
            { id: "beta", name: "Beta", price: "$42", shares: "300M", cap: "$12.6B", growth: "Growth 24%" },
          ],
        },
      }),
      panel("learn", "You do not need every metric to make a first comparison", "A beginner can compare size and growth first, then ask better follow-up questions.", {
        eyebrow: "Learn",
        activityKind: "checklist",
        activityData: {
          items: ["Who is bigger?", "Who is growing faster?", "What still needs context?"],
        },
      }),
    ],
    {
      mechanicTitle: "Two-company compare",
      mechanicSummary: "Use market cap and revenue growth to compare the companies cleanly.",
      prompt: "What is one clear difference between these companies?",
      question: "What is one clear difference between these companies?",
      activityKind: "market-cap-board",
      activityData: {
        variant: "company-compare",
        companies: [
          { id: "alpha", name: "Alpha", price: "$76", shares: "1.2B", cap: "$91.2B", growth: "Growth 9%" },
          { id: "beta", name: "Beta", price: "$44", shares: "280M", cap: "$12.3B", growth: "Growth 26%" },
        ],
      },
      supportActivities: ["Compare size.", "Compare growth.", "Name one difference clearly."],
      options: [
        choice("a", "Alpha is larger, while Beta is growing faster", true, ""),
        choice("b", "Beta is larger and growing slower", false, "company-comparison", "That reverses the comparison."),
        choice("c", "They are identical", false, "company-comparison", "The lesson gives you two different profiles."),
      ],
      explanation: "Correct. Alpha is larger, while Beta is growing faster.",
    },
    {
      question: "What is one clear difference between these companies?",
      type: "multiple",
      options: [
        choice("a", "Alpha is larger, while Beta is growing faster", true, ""),
        choice("b", "Beta is larger and growing slower", false, "company-comparison", "That flips the actual comparison."),
        choice("c", "They are identical", false, "company-comparison", "They are intentionally different."),
        choice("d", "No difference can be seen", false, "company-comparison", "There is enough to make a first comparison."),
      ],
      explanation: "Alpha is larger, while Beta is growing faster.",
      reviewPrompt: "company-comparison",
    },
  ),
  "market-cap-and-revenue-10": lesson(
    "Combine size and growth across multiple companies with a careful summary.",
    "Market Cap & Revenue complete.",
    ["market-cap-basics", "revenue-growth", "size-vs-growth"],
    [
      panel("hook", "Compare multiple companies at once", "The boss lesson asks you to classify both size and growth without mixing them up.", {
        eyebrow: "Boss setup",
        activityKind: "market-cap-board",
        activityData: {
          variant: "company-compare",
          companies: [
            { id: "alpha", name: "Alpha", price: "$88", shares: "1.1B", cap: "$96.8B", growth: "Growth 9%" },
            { id: "beta", name: "Beta", price: "$42", shares: "280M", cap: "$11.8B", growth: "Growth 26%" },
            { id: "gamma", name: "Gamma", price: "$58", shares: "700M", cap: "$40.6B", growth: "Growth 15%" },
          ],
        },
      }),
      panel("learn", "The careful summary keeps size and growth separate", "One company can be biggest. Another can be fastest-growing. A third can sit in the middle.", {
        eyebrow: "Careful interpretation",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Careful summary", "Weak summary"],
          cards: [
            { id: "careful", label: "Size and growth are different questions", target: "Careful summary" },
            { id: "weak", label: "The highest share price answers everything", target: "Weak summary" },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "Size vs growth showdown",
      mechanicSummary: "Compare the profiles and choose the strongest summary.",
      prompt: "Which summary is most careful?",
      question: "Which summary is most careful?",
      activityKind: "market-cap-board",
      activityData: {
        variant: "company-compare",
        companies: [
          { id: "alpha", name: "Alpha", price: "$90", shares: "1B", cap: "$90B", growth: "Growth 8%" },
          { id: "beta", name: "Beta", price: "$40", shares: "300M", cap: "$12B", growth: "Growth 28%" },
          { id: "gamma", name: "Gamma", price: "$60", shares: "700M", cap: "$42B", growth: "Growth 14%" },
        ],
      },
      supportActivities: ["Compare size.", "Compare growth.", "Choose the careful summary."],
      options: [
        choice("a", "One company can be bigger while another grows faster", true, ""),
        choice("b", "The highest share price tells you everything important", false, "size-growth-boss", "That is exactly the trap this module is trying to remove."),
        choice("c", "Growth and size are the same question", false, "size-growth-boss", "They are not the same question."),
      ],
      explanation: "Correct. A careful summary separates size from growth instead of blending them together.",
    },
    {
      question: "Which summary is most careful?",
      type: "multiple",
      options: [
        choice("a", "One company can be bigger while another grows faster", true, ""),
        choice("b", "The highest share price tells you everything important", false, "size-growth-boss", "That is the wrong shortcut."),
        choice("c", "Growth and size are the same question", false, "size-growth-boss", "They are different questions."),
        choice("d", "No comparison is possible", false, "size-growth-boss", "You can make a beginner comparison with the information shown."),
      ],
      explanation: "The careful summary keeps company size and growth separate.",
      reviewPrompt: "size-growth-boss",
    },
  ),
};

const epsAndPeLessons: Record<string, AuthoredLessonExperience> = {
  "eps-and-pe-ratios-1": lesson(
    "Teach that EPS means earnings per share.",
    "You can now explain EPS clearly.",
    ["eps-basics", "per-share-thinking"],
    [
      panel("hook", "Spread the earnings across the shares", "EPS answers a per-share question: how much profit is attached to each share?", {
        eyebrow: "Hook",
        activityKind: "ratio-builder",
        activityData: { variant: "eps-builder", earnings: 120, shares: 20 },
      }),
      panel("learn", "Per-share logic changes the question", "Total earnings and per-share earnings are related, but not identical.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Per-share clue", "Total-company clue"],
          cards: [
            { id: "eps", label: "Earnings per share", target: "Per-share clue" },
            { id: "earnings", label: "Total earnings", target: "Total-company clue" },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "EPS builder",
      mechanicSummary: "Adjust the share count and watch the per-share earnings update.",
      prompt: "What does EPS tell you?",
      question: "What does EPS tell you?",
      activityKind: "ratio-builder",
      activityData: { variant: "eps-builder", earnings: 120, shares: 20 },
      supportActivities: ["Start with total earnings.", "Divide by shares.", "Read the per-share result."],
      options: [
        choice("a", "How much earnings are attributed to each share", true, ""),
        choice("b", "The total value of the company", false, "eps-basics", "That is closer to market cap, not EPS."),
        choice("c", "Guaranteed stock returns", false, "eps-basics", "EPS is not a guarantee of returns."),
      ],
      explanation: "Correct. EPS tells you how much earnings are attributed to each share.",
    },
    {
      question: "What does EPS tell you?",
      type: "multiple",
      options: [
        choice("a", "How much earnings are attributed to each share", true, ""),
        choice("b", "The total value of the company", false, "eps-basics", "That is not EPS."),
        choice("c", "Guaranteed stock returns", false, "eps-basics", "EPS does not guarantee returns."),
        choice("d", "Only revenue growth", false, "eps-basics", "That is a different metric."),
      ],
      explanation: "EPS is earnings per share.",
      reviewPrompt: "eps-basics",
    },
  ),
  "eps-and-pe-ratios-2": lesson(
    "Teach that changing share count changes earnings per share.",
    "You can now see why the denominator matters.",
    ["share-count-matters", "eps-denominator"],
    [
      panel("hook", "More shares can dilute the per-share figure", "Keep earnings constant and move the share count. EPS changes because the denominator changes.", {
        eyebrow: "Hook",
        activityKind: "ratio-builder",
        activityData: { variant: "eps-builder", earnings: 120, shares: 20 },
      }),
      panel("learn", "Same earnings spread across more shares means less per share", "The total pie did not change, but each slice got smaller.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["EPS up", "EPS down"],
          cards: [
            { id: "more-shares", label: "More shares, same earnings", target: "EPS down" },
            { id: "fewer-shares", label: "Fewer shares, same earnings", target: "EPS up" },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "EPS denominator",
      mechanicSummary: "Hold earnings steady and watch EPS change as the share count changes.",
      prompt: "What happens to EPS if shares increase?",
      question: "What happens to EPS if shares increase?",
      activityKind: "ratio-builder",
      activityData: { variant: "eps-builder", earnings: 120, shares: 20 },
      supportActivities: ["Keep earnings fixed.", "Change the shares.", "Read the new EPS."],
      options: [
        choice("a", "EPS usually falls", true, ""),
        choice("b", "EPS automatically rises", false, "share-count-matters", "More shares usually spread the same earnings more thinly."),
        choice("c", "Nothing changes", false, "share-count-matters", "The denominator change matters."),
      ],
      explanation: "Correct. If shares increase while earnings stay fixed, EPS usually falls.",
    },
    {
      question: "What happens to EPS if shares increase?",
      type: "multiple",
      options: [
        choice("a", "EPS usually falls", true, ""),
        choice("b", "EPS automatically rises", false, "share-count-matters", "That is backward."),
        choice("c", "Nothing changes", false, "share-count-matters", "The denominator matters."),
        choice("d", "Revenue doubles", false, "share-count-matters", "That is unrelated."),
      ],
      explanation: "More shares usually lower EPS when earnings are unchanged.",
      reviewPrompt: "share-count-matters",
    },
  ),
  "eps-and-pe-ratios-3": lesson(
    "Teach that P/E compares price to earnings.",
    "You can now explain what P/E compares.",
    ["pe-basics", "valuation-ratio"],
    [
      panel("hook", "Move price and earnings together", "P/E asks how much price you are paying relative to the earnings figure.", {
        eyebrow: "Hook",
        activityKind: "ratio-builder",
        activityData: { variant: "pe-builder", price: 40, eps: 4 },
      }),
      panel("learn", "It is a ratio, not a verdict", "P/E compares price with earnings per share. The ratio needs context later.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Part of P/E", "Not part of P/E"],
          cards: [
            { id: "price", label: "Price", target: "Part of P/E" },
            { id: "eps", label: "Earnings per share", target: "Part of P/E" },
            { id: "logo", label: "Logo design", target: "Not part of P/E" },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "P/E builder",
      mechanicSummary: "Adjust price and EPS, then read the ratio.",
      prompt: "Which company has the higher P/E?",
      question: "Which company has the higher P/E?",
      activityKind: "ratio-builder",
      activityData: { variant: "pe-builder", price: 48, eps: 3 },
      supportActivities: ["Use price.", "Use EPS.", "Read the ratio carefully."],
      options: [
        choice("a", "The company with more price relative to earnings", true, ""),
        choice("b", "The company with a lower ratio automatically", false, "pe-basics", "The question asks which one has the higher P/E."),
        choice("c", "Any company with higher revenue", false, "pe-basics", "Revenue is not the ratio being compared here."),
      ],
      explanation: "Correct. Higher P/E means more price relative to each unit of earnings.",
    },
    {
      question: "What does P/E compare?",
      type: "multiple",
      options: [
        choice("a", "Price relative to earnings", true, ""),
        choice("b", "Revenue relative to market cap", false, "pe-basics", "That is not the P/E ratio."),
        choice("c", "Chart slope relative to volume", false, "pe-basics", "That is the wrong lens."),
        choice("d", "Only share count", false, "pe-basics", "That is not enough."),
      ],
      explanation: "P/E compares price relative to earnings.",
      reviewPrompt: "pe-basics",
    },
  ),
  "eps-and-pe-ratios-4": lesson(
    "Teach that a higher P/E is not automatically bad.",
    "You can now interpret high P/E more carefully.",
    ["high-pe-context", "expectations"],
    [
      panel("hook", "A high P/E can reflect stronger expectations", "Compare the profiles. Faster growth expectations can help explain a higher ratio.", {
        eyebrow: "Hook",
        activityKind: "signal-stack",
        activityData: {
          clues: [
            { title: "Higher P/E", detail: "The price is richer relative to earnings." },
            { title: "Faster growth", detail: "Expectations may be higher." },
            { title: "Context matters", detail: "The ratio alone is not enough." },
          ],
        },
      }),
      panel("learn", "High does not automatically mean bad", "A higher ratio can reflect optimism about future growth or quality, not automatically a mistake.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Careful", "Over-simplified"],
          cards: [
            { id: "careful", label: "A high P/E may reflect stronger expectations", target: "Careful" },
            { id: "simple", label: "A high P/E is always bad", target: "Over-simplified" },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "High P/E context",
      mechanicSummary: "Use growth context before turning a higher P/E into a verdict.",
      prompt: "Which explanation is more careful?",
      question: "Which explanation is more careful?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "Higher P/E", detail: "Richer price relative to earnings." },
          { title: "Growth story", detail: "Future expectations may be stronger." },
        ],
      },
      supportActivities: ["Read the ratio.", "Add the growth clue.", "Choose the careful explanation."],
      options: [
        choice("a", "A higher P/E can reflect stronger expectations", true, ""),
        choice("b", "A higher P/E is always bad", false, "high-pe-context", "That is the rigid rule this lesson is pushing against."),
        choice("c", "Context never matters", false, "high-pe-context", "Context is the whole point."),
      ],
      explanation: "Correct. A higher P/E can reflect stronger expectations, so context matters.",
    },
    {
      question: "Which explanation is more careful?",
      type: "multiple",
      options: [
        choice("a", "A higher P/E can reflect stronger expectations", true, ""),
        choice("b", "A higher P/E is always bad", false, "high-pe-context", "That is too rigid."),
        choice("c", "Context never matters", false, "high-pe-context", "That misses the lesson."),
        choice("d", "P/E replaces all other analysis", false, "high-pe-context", "It is one clue, not the whole picture."),
      ],
      explanation: "The careful explanation leaves room for growth and expectation context.",
      reviewPrompt: "high-pe-context",
    },
  ),
  "eps-and-pe-ratios-5": lesson(
    "Teach that a lower P/E is not automatically good.",
    "You can now interpret low P/E more carefully.",
    ["low-pe-context", "missing-context"],
    [
      panel("hook", "A low P/E can reflect weak expectations too", "The ratio may look cheap, but the market may be worried about slower growth or weaker quality.", {
        eyebrow: "Hook",
        activityKind: "signal-stack",
        activityData: {
          clues: [
            { title: "Lower P/E", detail: "Cheaper relative to earnings." },
            { title: "Weak expectations", detail: "The market may be cautious." },
            { title: "Need more context", detail: "Low is not automatically good." },
          ],
        },
      }),
      panel("learn", "Cheap-looking can still hide problems", "That is why valuation needs context, not rigid rules.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Careful", "Over-simplified"],
          cards: [
            { id: "careful", label: "A lower P/E may reflect weak expectations", target: "Careful" },
            { id: "simple", label: "A lower P/E is always good", target: "Over-simplified" },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "Low P/E context",
      mechanicSummary: "Use context before calling a lower P/E automatically good.",
      prompt: "What else would you want to know?",
      question: "What else would you want to know?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "Growth", detail: "Is the business slowing?" },
          { title: "Quality", detail: "Are margins weak?" },
          { title: "Risk", detail: "What is the market worried about?" },
        ],
      },
      supportActivities: ["Start with the low ratio.", "Ask what it may reflect.", "Look for the missing context."],
      options: [
        choice("a", "Why the market is assigning the lower ratio", true, ""),
        choice("b", "Nothing else at all", false, "low-pe-context", "That is exactly the shallow read the lesson is correcting."),
        choice("c", "Only the logo design", false, "low-pe-context", "That is not useful valuation context."),
      ],
      explanation: "Correct. You want to know why the market is assigning the lower ratio.",
    },
    {
      question: "What else would you want to know?",
      type: "multiple",
      options: [
        choice("a", "Why the market is assigning the lower ratio", true, ""),
        choice("b", "Nothing else at all", false, "low-pe-context", "That is too shallow."),
        choice("c", "Only the logo design", false, "low-pe-context", "That is not helpful."),
        choice("d", "Only today’s candle", false, "low-pe-context", "That is not enough valuation context."),
      ],
      explanation: "The stronger next question is why the market is assigning the lower ratio.",
      reviewPrompt: "low-pe-context",
    },
  ),
  "eps-and-pe-ratios-6": lesson(
    "Teach that sector context matters when comparing P/E ratios.",
    "You can now compare P/E more carefully within context.",
    ["sector-context", "valid-comparison"],
    [
      panel("hook", "Some comparisons are cleaner than others", "Comparing companies within a similar industry is usually more useful than comparing unrelated sectors.", {
        eyebrow: "Hook",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["More valid", "Less valid"],
          cards: [
            { id: "same-sector", label: "Two software companies", target: "More valid" },
            { id: "cross-sector", label: "A software company vs a utility", target: "Less valid" },
          ],
        },
      }),
      panel("learn", "Sector context changes how ratios behave", "Different industries often trade on different expectations and economics.", {
        eyebrow: "Learn",
        activityKind: "checklist",
        activityData: { items: ["Same industry?", "Similar economics?", "Comparable expectations?"] },
      }),
    ],
    {
      mechanicTitle: "P/E comparison validity",
      mechanicSummary: "Compare ratios more carefully by checking whether the businesses belong in the same context.",
      prompt: "Which comparison is more valid?",
      question: "Which comparison is more valid?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["More valid", "Less valid"],
        cards: [
          { id: "same", label: "Compare two chipmakers", target: "More valid" },
          { id: "cross", label: "Compare a chipmaker with a soda company", target: "Less valid" },
        ],
      },
      supportActivities: ["Check the industry context.", "Prefer more like-for-like comparisons.", "Avoid lazy cross-sector verdicts."],
      options: [
        choice("a", "Comparing similar companies in the same sector", true, ""),
        choice("b", "Comparing unrelated sectors with no context", false, "sector-context", "That is less valid."),
        choice("c", "Ignoring industry entirely", false, "sector-context", "Industry context matters."),
      ],
      explanation: "Correct. Comparing similar companies in the same sector is usually more valid.",
    },
    {
      question: "Which comparison is more valid?",
      type: "multiple",
      options: [
        choice("a", "Comparing similar companies in the same sector", true, ""),
        choice("b", "Comparing unrelated sectors with no context", false, "sector-context", "That is weaker context."),
        choice("c", "Ignoring industry entirely", false, "sector-context", "That skips an important part of the interpretation."),
        choice("d", "No comparison is ever useful", false, "sector-context", "Comparisons can still be useful when context fits."),
      ],
      explanation: "The cleaner comparison is usually within the same sector.",
      reviewPrompt: "sector-context",
    },
  ),
  "eps-and-pe-ratios-7": lesson(
    "Teach that changing earnings changes the P/E ratio.",
    "You can now see why the ratio is dynamic.",
    ["dynamic-pe", "earnings-change"],
    [
      panel("hook", "Move earnings and watch the ratio shift", "P/E changes when price changes, but it also changes when earnings change.", {
        eyebrow: "Hook",
        activityKind: "ratio-builder",
        activityData: { variant: "pe-builder", price: 40, eps: 4 },
      }),
      panel("learn", "The ratio is not frozen", "If earnings rise and price stays steady, the P/E can fall. If earnings drop, the ratio can rise.", {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["P/E can change", "P/E is fixed"],
          cards: [
            { id: "change", label: "Earnings move and the ratio updates", target: "P/E can change" },
            { id: "fixed", label: "The ratio never changes", target: "P/E is fixed" },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "Dynamic P/E builder",
      mechanicSummary: "Change price and earnings to see how the ratio moves.",
      prompt: "What changed here?",
      question: "What changed here?",
      activityKind: "ratio-builder",
      activityData: { variant: "pe-builder", price: 48, eps: 4 },
      supportActivities: ["Move price or EPS.", "Watch the ratio recalculate.", "Notice that it is dynamic."],
      options: [
        choice("a", "The price-to-earnings relationship changed", true, ""),
        choice("b", "The ratio stayed fixed forever", false, "dynamic-pe", "The lesson is specifically about the ratio changing."),
        choice("c", "Only the chart color changed", false, "dynamic-pe", "That is not the lesson."),
      ],
      explanation: "Correct. The relationship between price and earnings changed, so the ratio changed too.",
    },
    {
      question: "What changed here?",
      type: "multiple",
      options: [
        choice("a", "The price-to-earnings relationship changed", true, ""),
        choice("b", "The ratio stayed fixed forever", false, "dynamic-pe", "That is incorrect."),
        choice("c", "Only the chart color changed", false, "dynamic-pe", "That is not the key change."),
        choice("d", "Nothing meaningful changed", false, "dynamic-pe", "The ratio update is the whole point."),
      ],
      explanation: "The price-to-earnings relationship changed, so the ratio changed.",
      reviewPrompt: "dynamic-pe",
    },
  ),
  "eps-and-pe-ratios-8": lesson(
    "Teach the difference between EPS, revenue, and price.",
    "You can now separate these metrics cleanly.",
    ["metric-separation", "eps-vs-revenue-vs-price"],
    [
      panel("hook", "Sort the metrics into the right buckets", "Price, revenue, and EPS each answer a different question.", {
        eyebrow: "Hook",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Price", "Revenue", "EPS"],
          cards: [
            { id: "stock-price", label: "What one share trades for", target: "Price" },
            { id: "sales", label: "Business sales", target: "Revenue" },
            { id: "per-share", label: "Profit per share", target: "EPS" },
          ],
        },
      }),
      panel("learn", "These are different kinds of information", "One tells you about the stock price, one about business sales, and one about profit per share.", {
        eyebrow: "Learn",
        activityKind: "checklist",
        activityData: { items: ["Price", "Revenue", "EPS"] },
      }),
    ],
    {
      mechanicTitle: "Metric sorting board",
      mechanicSummary: "Sort price, revenue, and EPS into the right meaning bucket.",
      prompt: "Which metric reflects profit per share?",
      question: "Which metric reflects profit per share?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Profit per share", "Not profit per share"],
        cards: [
          { id: "eps", label: "EPS", target: "Profit per share" },
          { id: "revenue", label: "Revenue", target: "Not profit per share" },
          { id: "price", label: "Price", target: "Not profit per share" },
        ],
      },
      supportActivities: ["Keep the metrics separate.", "Use the right meaning bucket.", "Pick the per-share profit metric."],
      options: [
        choice("a", "EPS", true, ""),
        choice("b", "Revenue", false, "metric-separation", "Revenue is sales, not profit per share."),
        choice("c", "Price", false, "metric-separation", "Price is what one share trades for."),
      ],
      explanation: "Correct. EPS is the metric that reflects profit per share.",
    },
    {
      question: "Which metric reflects profit per share?",
      type: "multiple",
      options: [
        choice("a", "EPS", true, ""),
        choice("b", "Revenue", false, "metric-separation", "That is sales."),
        choice("c", "Price", false, "metric-separation", "That is the stock price."),
        choice("d", "Market cap", false, "metric-separation", "That is total size."),
      ],
      explanation: "EPS is profit per share.",
      reviewPrompt: "metric-separation",
    },
  ),
  "eps-and-pe-ratios-9": lesson(
    "Teach that P/E should be used as context, not as a final verdict.",
    "You can now use P/E with a healthier beginner mindset.",
    ["pe-context-not-verdict", "careful-valuation"],
    [
      panel("hook", "Choose the more careful P/E interpretation", "A ratio is most useful when it raises better questions, not when it ends the analysis.", {
        eyebrow: "Hook",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Careful", "Overconfident"],
          cards: [
            { id: "careful", label: "Use P/E as context, then ask what explains it", target: "Careful" },
            { id: "over", label: "P/E alone gives the final verdict", target: "Overconfident" },
          ],
        },
      }),
      panel("learn", "The ratio supports the conversation", "It does not replace growth, quality, sector, or expectation context.", {
        eyebrow: "Learn",
        activityKind: "signal-stack",
        activityData: {
          clues: [
            { title: "P/E", detail: "One valuation clue" },
            { title: "Growth", detail: "Still matters" },
            { title: "Sector", detail: "Still matters" },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "Careful valuation read",
      mechanicSummary: "Use P/E as one clue in context, not as a final verdict.",
      prompt: "Which summary avoids overconfidence?",
      question: "Which summary avoids overconfidence?",
      activityKind: "bucket-sort",
      activityData: {
        buckets: ["Careful", "Overconfident"],
        cards: [
          { id: "careful", label: "Use P/E as context, not a verdict", target: "Careful" },
          { id: "over", label: "The ratio tells you everything", target: "Overconfident" },
        ],
      },
      supportActivities: ["Keep P/E in the clue bucket.", "Add other context.", "Choose the careful summary."],
      options: [
        choice("a", "Use P/E as context, not a verdict", true, ""),
        choice("b", "The ratio tells you everything", false, "pe-context-not-verdict", "That is the exact mistake this lesson is fixing."),
        choice("c", "Ratios never help at all", false, "pe-context-not-verdict", "That throws away a useful clue."),
      ],
      explanation: "Correct. P/E is most useful as context, not as a final verdict.",
    },
    {
      question: "Which summary avoids overconfidence?",
      type: "multiple",
      options: [
        choice("a", "Use P/E as context, not a verdict", true, ""),
        choice("b", "The ratio tells you everything", false, "pe-context-not-verdict", "That is too absolute."),
        choice("c", "Ratios never help at all", false, "pe-context-not-verdict", "That is too dismissive."),
        choice("d", "P/E replaces growth and quality", false, "pe-context-not-verdict", "It does not."),
      ],
      explanation: "The careful summary is to use P/E as context, not a verdict.",
      reviewPrompt: "pe-context-not-verdict",
    },
  ),
  "eps-and-pe-ratios-10": lesson(
    "Combine EPS, P/E, growth context, and missing-context thinking.",
    "EPS & P/E Ratios complete.",
    ["eps-basics", "pe-basics", "high-pe-context", "low-pe-context"],
    [
      panel("hook", "Work the valuation context challenge", "This checkpoint combines per-share thinking, valuation ratio logic, and the missing context question.", {
        eyebrow: "Boss setup",
        activityKind: "ratio-builder",
        activityData: { variant: "pe-builder", price: 52, eps: 4 },
      }),
      panel("learn", "The strongest answer keeps the ratio in context", "You want EPS, P/E, growth expectations, and missing context all in the same conversation.", {
        eyebrow: "Learn",
        activityKind: "signal-stack",
        activityData: {
          clues: [
            { title: "EPS", detail: "Per-share earnings" },
            { title: "P/E", detail: "Price relative to earnings" },
            { title: "Missing context", detail: "Growth and sector still matter" },
          ],
        },
      }),
    ],
    {
      mechanicTitle: "Valuation context challenge",
      mechanicSummary: "Use EPS, P/E, and missing context together before choosing the best interpretation.",
      prompt: "Which final interpretation is strongest?",
      question: "Which final interpretation is strongest?",
      activityKind: "signal-stack",
      activityData: {
        clues: [
          { title: "Per-share logic", detail: "EPS matters" },
          { title: "Valuation ratio", detail: "P/E matters" },
          { title: "Context", detail: "Growth and sector still matter" },
        ],
      },
      supportActivities: ["Use the ratio.", "Use the earnings context.", "Choose the careful explanation."],
      options: [
        choice("a", "The ratio is useful, but growth and context still matter", true, ""),
        choice("b", "A high or low P/E gives the final verdict", false, "valuation-context-boss", "The boss lesson is supposed to reject that shortcut."),
        choice("c", "EPS does not matter", false, "valuation-context-boss", "Per-share logic still matters."),
      ],
      explanation: "Correct. The strongest interpretation uses the ratio as context while still asking what explains it.",
    },
    {
      question: "Which final interpretation is strongest?",
      type: "multiple",
      options: [
        choice("a", "The ratio is useful, but growth and context still matter", true, ""),
        choice("b", "A high or low P/E gives the final verdict", false, "valuation-context-boss", "That is too rigid."),
        choice("c", "EPS does not matter", false, "valuation-context-boss", "EPS is part of the picture."),
        choice("d", "Context never matters", false, "valuation-context-boss", "Context is the whole point."),
      ],
      explanation: "The strongest interpretation keeps P/E in context instead of using it as a verdict.",
      reviewPrompt: "valuation-context-boss",
    },
  ),
};

const normalizedTrendPanelsByLesson: Record<string, LearnPanel[]> = {
  "trend-and-momentum-1": [
    panel(
      "trend-hook",
      "Trend is the broad direction",
      "Start by tracing the bigger path. Trend is about where price keeps leaning over time.",
      {
        eyebrow: "Hook",
        activityKind: "chart-lab",
        activityData: {
          variant: "trace-path",
          chartPoints: [18, 24, 34, 30, 44, 54, 66],
          summaryChoices: ["Mostly rising", "Every wiggle matters more", "Guaranteed move"],
        },
      },
    ),
    panel(
      "trend-noise",
      "The broad label should survive the wiggles",
      "Toggle the noisy and cleaner versions. If the direction stays the same, you are reading the trend correctly.",
      {
        eyebrow: "Learn",
        activityKind: "chart-lab",
        activityData: {
          variant: "noise-toggle",
          noisyPoints: [20, 34, 28, 44, 36, 56, 48, 68],
          smoothPoints: [24, 30, 36, 42, 48, 54, 60, 66],
        },
        noteLabel: "What this means",
        note: "Trend is the larger path, not the loudest wiggle.",
      },
    ),
    panel(
      "trend-lock",
      "Do not turn one candle into the whole story",
      "A short pullback can sit inside a real trend. The first job is to name the dominant direction.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "A chart wiggles inside a bigger move.",
          actionLabel: "What matters first?",
          revealTitle: "Best first read",
          revealCopy: "Name the dominant direction before reacting to the smaller wiggles.",
          highlightText: "dominant direction",
        },
      },
    ),
  ],
  "trend-and-momentum-2": [
    panel(
      "uptrend-hook",
      "An uptrend climbs in layers",
      "Watch how the peaks and pullbacks both step higher.",
      {
        eyebrow: "Hook",
        activityKind: "chart-lab",
        activityData: {
          variant: "trace-path",
          chartPoints: [20, 34, 28, 46, 38, 58, 48, 70],
          summaryChoices: ["Higher highs and higher lows", "Flat range", "Lower highs"],
        },
      },
    ),
    panel(
      "uptrend-compare",
      "One jump is not the same as structure",
      "Compare a real uptrend shape with charts that only jump once or drift.",
      {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Looks like an uptrend", "Does not"],
          cards: [
            { id: "up-good", label: "Higher highs, higher lows", points: [18, 30, 26, 42, 36, 56, 48, 68], target: "Looks like an uptrend" },
            { id: "up-fake", label: "One jump, then drift", points: [24, 50, 30, 32, 34, 36, 38, 40], target: "Does not" },
            { id: "up-down", label: "Lower path", points: [72, 64, 60, 52, 46, 38, 34, 28], target: "Does not" },
          ],
        },
        noteLabel: "What this means",
        note: "Uptrend structure needs repeated higher highs and higher lows.",
      },
    ),
    panel(
      "uptrend-lock",
      "Both parts of the pattern matter",
      "Higher highs without higher lows are not enough. The pair is what makes the shape.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "The chart made one strong jump.",
          actionLabel: "Uptrend already?",
          revealTitle: "Not yet",
          revealCopy: "A clean uptrend usually repeats higher highs and higher lows.",
          highlightText: "higher highs and higher lows",
        },
      },
    ),
  ],
  "trend-and-momentum-3": [
    panel(
      "downtrend-hook",
      "A downtrend keeps failing lower",
      "Watch how the rallies stall lower and the drops push deeper.",
      {
        eyebrow: "Hook",
        activityKind: "chart-lab",
        activityData: {
          variant: "trace-path",
          chartPoints: [72, 64, 68, 56, 60, 46, 50, 36],
          summaryChoices: ["Lower highs and lower lows", "Higher highs", "Mostly flat"],
        },
      },
    ),
    panel(
      "downtrend-compare",
      "One red move is not enough",
      "Compare repeated weakness with sideways noise and upward structure.",
      {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Looks like a downtrend", "Does not"],
          cards: [
            { id: "down-good", label: "Failing lower", points: [78, 66, 70, 58, 60, 44, 46, 34], target: "Looks like a downtrend" },
            { id: "down-flat", label: "Back-and-forth range", points: [52, 48, 54, 50, 53, 49, 51, 48], target: "Does not" },
            { id: "down-up", label: "Climbing path", points: [18, 24, 32, 40, 46, 58, 66, 76], target: "Does not" },
          ],
        },
        noteLabel: "What this means",
        note: "A downtrend is a repeated failure pattern, not one red candle.",
      },
    ),
    panel(
      "downtrend-lock",
      "A bounce does not automatically erase weakness",
      "Short rallies happen inside downtrends too.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "The chart bounced after dropping.",
          actionLabel: "Trend over?",
          revealTitle: "Not by itself",
          revealCopy: "A bounce can happen inside weakness. Check whether the bigger structure still fails lower.",
          highlightText: "fails lower",
        },
      },
    ),
  ],
  "trend-and-momentum-4": [
    panel(
      "sideways-hook",
      "Busy does not always mean trending",
      "Trace the path and watch what happens when price keeps circling the same area.",
      {
        eyebrow: "Hook",
        activityKind: "chart-lab",
        activityData: {
          variant: "trace-path",
          chartPoints: [48, 52, 46, 54, 49, 51, 47, 50],
          summaryChoices: ["Little net movement", "Strong trend", "Guaranteed breakout"],
        },
      },
    ),
    panel(
      "sideways-compare",
      "Sideways means little net progress",
      "Sort the range chart away from the clearly trending charts.",
      {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Sideways", "Trending"],
          cards: [
            { id: "sideways", label: "Range", points: [48, 52, 47, 51, 49, 50, 48], target: "Sideways" },
            { id: "trend-up", label: "Rise", points: [20, 28, 36, 44, 56, 68, 78], target: "Trending" },
            { id: "trend-down", label: "Slide", points: [76, 68, 62, 54, 46, 38, 32], target: "Trending" },
          ],
        },
        noteLabel: "What this means",
        note: "A chart can move around a lot and still have little directional conviction.",
      },
    ),
    panel(
      "sideways-lock",
      "Noise is not the same as conviction",
      "A sideways chart can be busy without building a real trend.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "The chart keeps wiggling.",
          actionLabel: "So it must be trending?",
          revealTitle: "Better read",
          revealCopy: "Not always. Busy price can still be mostly sideways.",
          highlightText: "mostly sideways",
        },
      },
    ),
  ],
  "trend-and-momentum-5": [
    panel(
      "noise-hook",
      "The same move can look noisy or clean",
      "Toggle the two views. The broader trend should survive the extra wiggles.",
      {
        eyebrow: "Hook",
        activityKind: "chart-lab",
        activityData: {
          variant: "noise-toggle",
          noisyPoints: [26, 40, 32, 48, 38, 58, 50, 70],
          smoothPoints: [30, 36, 42, 48, 54, 60, 66, 72],
        },
      },
    ),
    panel(
      "noise-compare",
      "Trend summary and noise detail are not the same job",
      "Sort the big-picture read away from the smaller wiggles.",
      {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Trend summary", "Noise detail"],
          cards: [
            { id: "summary", label: "Mostly rising over time", target: "Trend summary" },
            { id: "wiggle", label: "One small pullback in the middle", target: "Noise detail" },
            { id: "summary2", label: "Broad path keeps lifting", target: "Trend summary" },
          ],
        },
        noteLabel: "What this means",
        note: "The larger summary is usually more useful than every small fluctuation.",
      },
    ),
    panel(
      "noise-lock",
      "Do not let one wiggle rewrite the chart",
      "Small fluctuations matter later. The first job is to keep the broad move intact.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "The chart has one sharp wiggle.",
          actionLabel: "Whole trend changed?",
          revealTitle: "Not necessarily",
          revealCopy: "The broad trend can stay the same even when the chart gets noisy.",
          highlightText: "broad trend",
        },
      },
    ),
  ],
  "trend-and-momentum-6": [
    panel(
      "quality-hook",
      "Two rises can have very different quality",
      "Direction is only the first label. Continuation quality is the second read.",
      {
        eyebrow: "Hook",
        activityKind: "reveal-card",
        activityData: {
          statement: "Both charts are rising.",
          actionLabel: "Same quality too?",
          revealTitle: "Second question",
          revealCopy: "No. One rise can continue much more cleanly than another.",
          highlightText: "continue",
        },
      },
    ),
    panel(
      "quality-rank",
      "Rank the trends by continuation",
      "Use the path quality, not just the direction word, to order them.",
      {
        eyebrow: "Learn",
        activityKind: "sequence-lab",
        activityData: {
          steps: [
            { id: "weak", label: "Weak trend", description: "Choppy lift with loose pullbacks.", points: [20, 30, 24, 36, 28, 40, 34, 44] },
            { id: "medium", label: "Steadier trend", description: "Pullbacks happen, but the chart keeps stepping higher.", points: [18, 28, 24, 38, 34, 48, 44, 58] },
            { id: "strong", label: "Strong trend", description: "Clear follow-through with controlled pullbacks.", points: [16, 28, 24, 40, 36, 56, 50, 70] },
          ],
          orderedSteps: [
            { id: "1", label: "Weakest" },
            { id: "2", label: "Middle" },
            { id: "3", label: "Strongest" },
          ],
        },
      },
    ),
    panel(
      "quality-lock",
      "Direction alone is not enough",
      "A chart can still rise with messy follow-through. Quality tells you how convincing the move looks.",
      {
        eyebrow: "Lock-in",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Stronger continuation", "Weaker continuation"],
          cards: [
            { id: "clean", label: "Controlled pullbacks, fresh highs", points: [18, 30, 26, 42, 38, 56, 50, 68], target: "Stronger continuation" },
            { id: "messy", label: "Choppy path, weak follow-through", points: [24, 34, 26, 36, 28, 38, 30, 40], target: "Weaker continuation" },
          ],
        },
        noteLabel: "Common mistake",
        note: "Beginners often stop after naming direction and miss the quality of the move.",
      },
    ),
  ],
  "trend-and-momentum-7": [
    panel(
      "momentum-hook",
      "Momentum is pace, not just direction",
      "Two moves can both rise while one still feels much more forceful.",
      {
        eyebrow: "Hook",
        activityKind: "reveal-card",
        activityData: {
          statement: "Both charts are going up.",
          actionLabel: "So they have equal momentum?",
          revealTitle: "Not always",
          revealCopy: "Momentum is about pace. One rise can move much faster than the other.",
          highlightText: "pace",
        },
      },
    ),
    panel(
      "momentum-rank",
      "Rank the rises by speed",
      "Use the slope to order them from slowest to fastest.",
      {
        eyebrow: "Learn",
        activityKind: "sequence-lab",
        activityData: {
          steps: [
            { id: "slow", label: "Slow pace", description: "Climbing with a gentle slope.", points: [34, 38, 42, 46, 51, 56] },
            { id: "medium", label: "Medium pace", description: "Still controlled, but quicker.", points: [24, 34, 44, 54, 64, 74] },
            { id: "fast", label: "Fast pace", description: "The move accelerates sharply upward.", points: [14, 28, 46, 64, 82, 92] },
          ],
          orderedSteps: [
            { id: "1", label: "Slowest" },
            { id: "2", label: "Middle" },
            { id: "3", label: "Fastest" },
          ],
        },
      },
    ),
    panel(
      "momentum-lock",
      "Upward is not the same as powerful",
      "Direction tells you where the chart is going. Momentum tells you how quickly it is getting there.",
      {
        eyebrow: "Lock-in",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Stronger pace", "Softer pace"],
          cards: [
            { id: "steep", label: "Steep climb", points: [18, 32, 50, 70, 88], target: "Stronger pace" },
            { id: "gentle", label: "Gentle climb", points: [36, 40, 44, 48, 52], target: "Softer pace" },
          ],
        },
        noteLabel: "Common mistake",
        note: "Beginners often stop at “up” and miss how forceful the move feels.",
      },
    ),
  ],
  "trend-and-momentum-8": [
    panel(
      "fade-hook",
      "A move can keep rising while its pace cools",
      "Scrub the frames and watch the pace meter change before the direction fully breaks.",
      {
        eyebrow: "Hook",
        activityKind: "chart-lab",
        activityData: {
          variant: "momentum-fade",
          frames: [
            { label: "Fast start", points: [16, 34, 56, 74, 90], meter: "Strong pace" },
            { label: "Cooling", points: [16, 34, 56, 68, 78], meter: "Cooling pace" },
            { label: "Fading", points: [16, 34, 56, 62, 68], meter: "Fading pace" },
          ],
        },
      },
    ),
    panel(
      "fade-compare",
      "Direction clue and pace clue are different",
      "Sort the evidence into the right lane so slowdown does not automatically become reversal.",
      {
        eyebrow: "Learn",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Direction clue", "Pace clue"],
          cards: [
            { id: "rise", label: "Still making higher points", target: "Direction clue" },
            { id: "slow", label: "Slope becoming less steep", target: "Pace clue" },
            { id: "force", label: "Move feels less urgent", target: "Pace clue" },
          ],
        },
        noteLabel: "What this means",
        note: "A chart can still rise even while the pace weakens.",
      },
    ),
    panel(
      "fade-lock",
      "Do not treat every slowdown like the trend is over",
      "Momentum fading changes the quality of the move. It does not automatically erase the direction.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "The chart is still rising, but more slowly.",
          actionLabel: "Trend over?",
          revealTitle: "Not by itself",
          revealCopy: "The pace can fade before the direction fully changes.",
          highlightText: "pace can fade",
        },
      },
    ),
  ],
  "trend-and-momentum-9": [
    panel(
      "order-hook",
      "Trend comes before detail",
      "A beginner’s first job is to map the broad path before zooming into smaller clues.",
      {
        eyebrow: "Hook",
        activityKind: "reveal-card",
        activityData: {
          statement: "You open a new chart.",
          actionLabel: "What comes first?",
          revealTitle: "Best first step",
          revealCopy: "Start by naming the broad trend before chasing details.",
          highlightText: "broad trend",
        },
      },
    ),
    panel(
      "order-sequence",
      "Build the analysis order",
      "Put context first, detail second, and prediction last.",
      {
        eyebrow: "Learn",
        activityKind: "sequence-lab",
        activityData: {
          steps: [
            { id: "trend", label: "Identify the trend", description: "Get the broad direction first." },
            { id: "detail", label: "Inspect the details", description: "Look closer after context is clear." },
            { id: "predict", label: "Jump to a conclusion", description: "This should come last, if at all." },
          ],
          orderedSteps: [
            { id: "1", label: "First" },
            { id: "2", label: "Then" },
            { id: "3", label: "Last" },
          ],
        },
      },
    ),
    panel(
      "order-lock",
      "One small detail should not become the whole story",
      "Sort the first-step habits away from the too-early reactions.",
      {
        eyebrow: "Lock-in",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Good first step", "Too early"],
          cards: [
            { id: "trend-first", label: "Name the trend", target: "Good first step" },
            { id: "context-first", label: "Get broad context", target: "Good first step" },
            { id: "predict-first", label: "Predict the next move immediately", target: "Too early" },
          ],
        },
        noteLabel: "Common mistake",
        note: "A lot of weak chart reads start by skipping the broad map.",
      },
    ),
  ],
};

const normalizedTrendPracticePatches: Record<string, Partial<PracticeContent>> = {
  "trend-and-momentum-1": {
    useActivityAsPractice: true,
    actionLabel: "Continue to check",
    readinessLabel: "Sort every chart first",
    question: "",
    options: [],
  },
  "trend-and-momentum-2": {
    useActivityAsPractice: true,
    actionLabel: "Continue to check",
    readinessLabel: "Sort every chart first",
    question: "",
    options: [],
  },
  "trend-and-momentum-3": {
    useActivityAsPractice: true,
    actionLabel: "Continue to check",
    readinessLabel: "Sort every chart first",
    question: "",
    options: [],
  },
  "trend-and-momentum-4": {
    useActivityAsPractice: true,
    actionLabel: "Continue to check",
    readinessLabel: "Sort every chart first",
    question: "",
    options: [],
  },
};

for (const [lessonId, panels] of Object.entries(normalizedTrendPanelsByLesson)) {
  const lesson = trendAndMomentumLessons[lessonId];

  if (lesson) {
    lesson.learn.panels = panels;
  }
}

for (const [lessonId, patch] of Object.entries(normalizedTrendPracticePatches)) {
  const lesson = trendAndMomentumLessons[lessonId];

  if (lesson) {
    Object.assign(lesson.practice, patch);
  }
}

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

const normalizedSupportPanelsByLesson: Record<string, LearnPanel[]> = {
  "support-and-resistance-1": [
    panel(
      "define",
      "Support is a lower reaction area",
      "Price reaches a lower area, slows down, and lifts away. That area is support.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "Price keeps reaching the same lower area, then lifting away.",
          revealTitle: "What that means",
          revealCopy: "That lower reaction area acts like support.",
          actionLabel: "Show me",
          highlightText: "support",
        },
      },
    ),
    panel(
      "demo",
      "Watch support react",
      "The clue is the reaction after price reaches the zone. It stops falling there and turns higher.",
      {
        eyebrow: "See it",
        activityKind: "chart-lab",
        activityData: {
          variant: "reaction-replay",
          zone: { top: 94, height: 22, label: "Support zone" },
          stages: [
            { label: "Approach", points: [82, 72, 60, 48, 38, 32], note: "Price moves down into the area." },
            { label: "Touch", points: [82, 72, 60, 48, 38, 32, 30, 31], note: "Price meets the support zone." },
            { label: "Bounce", points: [82, 72, 60, 48, 38, 32, 29, 42, 56], note: "Price reacts higher from support." },
          ],
        },
      },
    ),
    panel(
      "lock",
      "Think zone, not promise",
      "Support is an area worth watching. It does not guarantee the next bounce.",
      {
        eyebrow: "Lock-in",
        activityKind: "zone-map",
        activityData: {
          variant: "chart-zones",
          chartPoints: [82, 72, 60, 46, 32, 42, 56, 50, 62],
          candidates: [
            { id: "upper", label: "Upper band", top: 24, height: 24 },
            { id: "middle", label: "Middle band", top: 56, height: 24 },
            { id: "support", label: "Support area", top: 92, height: 24 },
          ],
        },
        noteLabel: "Common mistake",
        note: "A support area helps organize the chart. It never becomes a guarantee.",
      },
    ),
  ],
  "support-and-resistance-2": [
    panel(
      "define",
      "Resistance is an upper reaction area",
      "Price reaches an upper area, struggles there, and turns lower. That area is resistance.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "Price keeps reaching the same upper area, then turning lower.",
          revealTitle: "What that means",
          revealCopy: "That upper reaction area acts like resistance.",
          actionLabel: "Show me",
          highlightText: "resistance",
        },
      },
    ),
    panel(
      "demo",
      "Watch resistance reject",
      "The clue is the turn lower after price reaches the upper zone.",
      {
        eyebrow: "See it",
        activityKind: "chart-lab",
        activityData: {
          variant: "reaction-replay",
          zone: { top: 26, height: 22, label: "Resistance zone" },
          stages: [
            { label: "Approach", points: [20, 30, 42, 54, 64, 70], note: "Price rises into resistance." },
            { label: "Test", points: [20, 30, 42, 54, 64, 70, 72, 70], note: "Price reaches the zone." },
            { label: "Rejection", points: [20, 30, 42, 54, 64, 70, 72, 60, 46], note: "Price turns lower from resistance." },
          ],
        },
      },
    ),
    panel(
      "lock",
      "Think area, not ceiling",
      "Resistance is friction in an area. It can still break later.",
      {
        eyebrow: "Lock-in",
        activityKind: "zone-map",
        activityData: {
          variant: "chart-zones",
          chartPoints: [22, 32, 44, 58, 70, 64, 50, 40],
          candidates: [
            { id: "support", label: "Lower band", top: 98, height: 22 },
            { id: "middle", label: "Middle band", top: 60, height: 24 },
            { id: "resistance", label: "Resistance area", top: 22, height: 24 },
          ],
        },
        noteLabel: "Common mistake",
        note: "A watched ceiling can matter without becoming a permanent wall.",
      },
    ),
  ],
  "support-and-resistance-3": [
    panel(
      "compare",
      "A zone is safer than a pixel",
      "Real reactions usually happen across a band, not on one perfect number.",
      {
        eyebrow: "Learn",
        activityKind: "zone-map",
        activityData: {
          variant: "chart-zones",
          chartPoints: [24, 36, 52, 44, 30, 34, 46, 38],
          candidates: [
            { id: "thin", label: "Thin line", top: 90, height: 10 },
            { id: "zone", label: "Wider zone", top: 84, height: 26 },
            { id: "wrong", label: "Wrong area", top: 28, height: 20 },
          ],
        },
      },
    ),
    panel(
      "cluster",
      "Small misses can still fit one area",
      "Touches at 29, 30, and 31 still describe one reaction zone.",
      {
        eyebrow: "See it",
        activityKind: "reveal-card",
        activityData: {
          statement: "Price reacted near 29, 30, and 31 instead of one exact number.",
          revealTitle: "Clean read",
          revealCopy: "That still points to one reaction zone, not three different levels.",
          actionLabel: "Show me",
          highlightText: "reaction zone",
        },
      },
    ),
    panel(
      "lock",
      "Use width for realism",
      "Zones leave room for normal chart wiggle. Razor-thin lines create fake precision.",
      {
        eyebrow: "Lock-in",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Careful marking", "Over-precise marking"],
          cards: [
            { id: "zone", label: "Wider reaction area", target: "Careful marking" },
            { id: "line", label: "Single exact line only", target: "Over-precise marking" },
            { id: "cluster", label: "Reactions spread across one band", target: "Careful marking" },
          ],
        },
      },
    ),
  ],
  "support-and-resistance-4": [
    panel(
      "define",
      "A bounce needs a reaction",
      "Touching support is not enough. Price has to lift away from the zone.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "Price reaches a lower zone and then lifts away from it.",
          revealTitle: "What happened",
          revealCopy: "That reaction is a bounce from support.",
          actionLabel: "Show me",
          highlightText: "bounce",
        },
      },
    ),
    panel(
      "order",
      "Read the sequence in order",
      "Support bounce means touch first, reaction second.",
      {
        eyebrow: "Flow",
        activityKind: "sequence-lab",
        activityData: {
          steps: [
            { id: "touch", label: "Price reaches support", description: "The chart arrives at the lower zone." },
            { id: "lift", label: "Price lifts away", description: "The reaction turns higher." },
            { id: "label", label: "Call it a bounce", description: "You can name the behavior after the reaction." },
          ],
          orderedSteps: [
            { id: "1", label: "First" },
            { id: "2", label: "Then" },
            { id: "3", label: "Last" },
          ],
        },
      },
    ),
    panel(
      "lock",
      "Touch alone is too early",
      "Wait for the lift away. That is what confirms the bounce.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "A touch by itself can still turn into a failure.",
          revealTitle: "Why patience matters",
          revealCopy: "The move away from the zone is what confirms support held.",
          actionLabel: "Show me",
          highlightText: "confirms",
        },
      },
    ),
  ],
  "support-and-resistance-5": [
    panel(
      "define",
      "Rejection needs the turn lower",
      "Touching resistance is not enough. Price has to turn lower from the zone.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "Price reaches an upper zone and then turns lower.",
          revealTitle: "What happened",
          revealCopy: "That reaction is a rejection from resistance.",
          actionLabel: "Show me",
          highlightText: "rejection",
        },
      },
    ),
    panel(
      "order",
      "Read the upper-zone sequence",
      "Approach the zone, watch the test, then look for the turn lower.",
      {
        eyebrow: "Flow",
        activityKind: "sequence-lab",
        activityData: {
          steps: [
            { id: "approach", label: "Price reaches resistance", description: "The chart pushes up to the upper area." },
            { id: "stall", label: "Price stalls there", description: "The move hesitates at the zone." },
            { id: "turn", label: "Price turns lower", description: "Now the rejection is visible." },
          ],
          orderedSteps: [
            { id: "1", label: "First" },
            { id: "2", label: "Then" },
            { id: "3", label: "Last" },
          ],
        },
      },
    ),
    panel(
      "lock",
      "The touch is not the verdict",
      "The turn lower after the test is what makes the rejection readable.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "An upper-zone touch can still turn into a break instead.",
          revealTitle: "Why the reaction matters",
          revealCopy: "The move lower after the touch is what confirms resistance held.",
          actionLabel: "Show me",
          highlightText: "confirms",
        },
      },
    ),
  ],
  "support-and-resistance-6": [
    panel(
      "compare",
      "Some zones earn more respect",
      "Repeated clean reactions usually make a zone feel stronger.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "One area has three clean reactions. Another has one messy touch.",
          revealTitle: "Clean read",
          revealCopy: "The repeated reaction zone usually deserves more respect.",
          actionLabel: "Show me",
          highlightText: "more respect",
        },
      },
    ),
    panel(
      "rank",
      "Compare reaction quality",
      "Count the tests and judge how clean the reactions look.",
      {
        eyebrow: "See it",
        activityKind: "sequence-lab",
        activityData: {
          steps: [
            { id: "weak-zone", label: "Weak zone", description: "One loose reaction.", points: [58, 52, 48, 42, 46, 40] },
            { id: "mid-zone", label: "Medium zone", description: "Several touches with mixed follow-through.", points: [62, 54, 46, 40, 44, 48, 42] },
            { id: "strong-zone", label: "Strong zone", description: "Repeated clean reactions.", points: [66, 54, 42, 34, 40, 34, 42, 36] },
          ],
          orderedSteps: [
            { id: "1", label: "Weakest" },
            { id: "2", label: "Middle" },
            { id: "3", label: "Strongest" },
          ],
        },
      },
    ),
    panel(
      "lock",
      "Confidence does not make a zone strong",
      "The chart evidence does. Repeated clean reactions matter more than your drawing confidence.",
      {
        eyebrow: "Lock-in",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Stronger zone clue", "Weaker zone clue"],
          cards: [
            { id: "repeated", label: "Repeated clean reactions", target: "Stronger zone clue" },
            { id: "single", label: "One messy touch", target: "Weaker zone clue" },
            { id: "follow", label: "Meaningful follow-through after tests", target: "Stronger zone clue" },
          ],
        },
      },
    ),
  ],
  "support-and-resistance-7": [
    panel(
      "define",
      "Support can fail",
      "A support area fails when price breaks below it and cannot recover the zone.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "Price reaches support, breaks below it, and stays below.",
          revealTitle: "What happened",
          revealCopy: "That support area failed.",
          actionLabel: "Show me",
          highlightText: "failed",
        },
      },
    ),
    panel(
      "order",
      "Read failure in sequence",
      "Touch first, break second, failed recovery last.",
      {
        eyebrow: "Flow",
        activityKind: "sequence-lab",
        activityData: {
          steps: [
            { id: "touch", label: "Price reaches support", description: "The chart tests the lower zone." },
            { id: "break", label: "Price breaks below", description: "The old support gives way." },
            { id: "stay", label: "Price stays below", description: "The failure is now clear." },
          ],
          orderedSteps: [
            { id: "1", label: "First" },
            { id: "2", label: "Then" },
            { id: "3", label: "Last" },
          ],
        },
      },
    ),
    panel(
      "lock",
      "Support is useful, not guaranteed",
      "A watched area can still lose the fight if selling pressure takes over.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "A support label does not force price to bounce.",
          revealTitle: "Careful takeaway",
          revealCopy: "The reaction after the test matters more than the label itself.",
          actionLabel: "Show me",
          highlightText: "reaction",
        },
      },
    ),
  ],
  "support-and-resistance-8": [
    panel(
      "define",
      "Resistance can break",
      "A resistance area breaks when price pushes above it and stays above the old ceiling.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "Price pushes through resistance and stays above it.",
          revealTitle: "What happened",
          revealCopy: "That resistance area broke.",
          actionLabel: "Show me",
          highlightText: "broke",
        },
      },
    ),
    panel(
      "order",
      "Read the break in sequence",
      "Test the zone, move through it, then check whether price keeps holding above it.",
      {
        eyebrow: "Flow",
        activityKind: "sequence-lab",
        activityData: {
          steps: [
            { id: "test", label: "Price tests resistance", description: "The chart reaches the upper area." },
            { id: "break", label: "Price breaks above", description: "The old ceiling gives way." },
            { id: "hold", label: "Price holds above", description: "Follow-through confirms the break." },
          ],
          orderedSteps: [
            { id: "1", label: "First" },
            { id: "2", label: "Then" },
            { id: "3", label: "Last" },
          ],
        },
      },
    ),
    panel(
      "lock",
      "Old ceilings can stop working",
      "Resistance can matter for a long time and still fail when buying pressure wins.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "A level that held before can still stop containing price later.",
          revealTitle: "Careful takeaway",
          revealCopy: "The follow-through above the old ceiling is what changes the read.",
          actionLabel: "Show me",
          highlightText: "changes the read",
        },
      },
    ),
  ],
  "support-and-resistance-9": [
    panel(
      "mindset",
      "Areas beat fake precision",
      "The careful read thinks in areas and reactions, not exact promises.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "This exact line must work every time.",
          revealTitle: "Careful replacement",
          revealCopy: "A watched reaction area is useful, but it can still fail.",
          actionLabel: "Show me",
          highlightText: "reaction area",
        },
      },
    ),
    panel(
      "compare",
      "The zone should match the chart",
      "A wider band is usually the cleaner way to mark repeated reactions.",
      {
        eyebrow: "See it",
        activityKind: "zone-map",
        activityData: {
          variant: "chart-zones",
          chartPoints: [24, 36, 50, 46, 34, 38, 48, 44, 52],
          candidates: [
            { id: "thin", label: "Thin line", top: 88, height: 10 },
            { id: "zone", label: "Reaction zone", top: 82, height: 28 },
            { id: "wrong", label: "Wrong region", top: 26, height: 18 },
          ],
        },
      },
    ),
    panel(
      "lock",
      "Area first, certainty never",
      "A strong chart read marks the area, watches the reaction, and leaves room for failure.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "A zone helps you organize the chart.",
          revealTitle: "Best mindset",
          revealCopy: "Use areas to guide attention. Do not turn them into guarantees.",
          actionLabel: "Show me",
          highlightText: "guide attention",
        },
      },
    ),
  ],
  "support-and-resistance-10": [
    panel(
      "boss-setup",
      "Map the chart before you judge it",
      "This checkpoint makes you earn support, resistance, reaction, and caution in order.",
      {
        eyebrow: "Boss setup",
        activityKind: "zone-map",
        activityData: {
          variant: "chart-zones",
          chartPoints: [22, 34, 48, 62, 58, 68, 60, 44, 30, 38, 54],
          candidates: [
            { id: "resistance", label: "Upper resistance", top: 18, height: 24 },
            { id: "middle", label: "Middle noise", top: 58, height: 20 },
            { id: "support", label: "Lower support", top: 96, height: 22 },
          ],
        },
      },
    ),
    panel(
      "boss-rule",
      "Wrong reads send the sequence back",
      "Boss steps only turn green after a correct solve. One weak read can knock the checkpoint back a step.",
      {
        eyebrow: "Pressure rule",
        activityKind: "reveal-card",
        activityData: {
          statement: "Boss progress is earned, not clicked.",
          revealTitle: "What changes here",
          revealCopy: "A wrong read sends you back one step until the chart logic is locked in again.",
          actionLabel: "Show the rule",
          highlightText: "back one step",
        },
      },
    ),
  ],
};

const normalizedSupportPracticePatches: Record<string, Partial<PracticeContent>> = {
  "support-and-resistance-1": activityOnlyPracticePatch("Pick the support zone first"),
  "support-and-resistance-2": activityOnlyPracticePatch("Pick the resistance zone first"),
  "support-and-resistance-3": activityOnlyPracticePatch("Compare both markings first"),
  "support-and-resistance-4": activityOnlyPracticePatch("Replay the support reaction first"),
  "support-and-resistance-5": activityOnlyPracticePatch("Replay the resistance reaction first"),
  "support-and-resistance-6": activityOnlyPracticePatch("Rank every zone first"),
  "support-and-resistance-7": activityOnlyPracticePatch("Replay the breakdown first"),
  "support-and-resistance-8": activityOnlyPracticePatch("Replay the break first"),
  "support-and-resistance-9": activityOnlyPracticePatch("Sort both statements first"),
};

const normalizedSupportCheckPatches: Record<string, CheckContent> = {
  "support-and-resistance-4": {
    question: "Quick bounce check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "bounce-case",
        prompt: "Price reaches a lower zone and lifts away from it.",
        options: [
          choice("a", "Support bounce", true, ""),
          choice("b", "Support failed", false, "support-bounce", "A failure breaks below and stays below the zone."),
          choice("c", "Resistance rejection", false, "support-bounce", "This is a lower-zone reaction, not an upper-zone one."),
        ],
        explanation: "That is a support bounce because price touched the area and reacted higher.",
        reviewPrompt: "support-bounce",
      },
      {
        id: "touch-only",
        prompt: "What confirms the bounce?",
        options: [
          choice("a", "The move higher after the touch", true, ""),
          choice("b", "Touching the zone once", false, "support-bounce", "The touch alone is too early."),
          choice("c", "Calling it support before any reaction", false, "support-bounce", "The reaction is the confirmation."),
        ],
        explanation: "The lift away from the zone is what confirms the bounce.",
        reviewPrompt: "support-bounce",
      },
    ],
    options: [],
    explanation: "Read the reaction after the support touch.",
    reviewPrompt: "support-bounce",
  },
  "support-and-resistance-5": {
    question: "Quick rejection check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "reject-case",
        prompt: "Price reaches an upper zone and then turns lower.",
        options: [
          choice("a", "Resistance rejection", true, ""),
          choice("b", "Resistance break", false, "resistance-rejection", "A break would hold above the zone instead."),
          choice("c", "Support bounce", false, "resistance-rejection", "This is an upper-zone reaction."),
        ],
        explanation: "That turn lower is the rejection from resistance.",
        reviewPrompt: "resistance-rejection",
      },
      {
        id: "touch-only",
        prompt: "What confirms the rejection?",
        options: [
          choice("a", "The turn lower after the test", true, ""),
          choice("b", "Touching the zone once", false, "resistance-rejection", "The touch alone is not enough."),
          choice("c", "Drawing a line there", false, "resistance-rejection", "The reaction is the real clue."),
        ],
        explanation: "The move lower after the touch is what confirms the rejection.",
        reviewPrompt: "resistance-rejection",
      },
    ],
    options: [],
    explanation: "Read the reaction after price reaches resistance.",
    reviewPrompt: "resistance-rejection",
  },
  "support-and-resistance-6": {
    question: "Quick zone-strength check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "stronger-zone",
        prompt: "Three clean reactions happened at the same area.",
        options: [
          choice("a", "Stronger zone", true, ""),
          choice("b", "Weaker zone", false, "zone-strength", "Repeated clean reactions usually make the zone stronger."),
          choice("c", "No zone at all", false, "zone-strength", "Those repeated reactions are exactly the clue."),
        ],
        explanation: "Repeated clean reactions usually make a zone feel stronger.",
        reviewPrompt: "zone-strength",
      },
      {
        id: "weaker-zone",
        prompt: "Only one messy touch happened with no clean follow-through.",
        options: [
          choice("a", "Weaker zone", true, ""),
          choice("b", "Stronger zone", false, "zone-strength", "That is not enough evidence for the stronger read."),
          choice("c", "Guaranteed support", false, "zone-strength", "Messy single touches do not guarantee anything."),
        ],
        explanation: "One messy touch usually describes the weaker zone.",
        reviewPrompt: "zone-strength",
      },
      {
        id: "weight-clue",
        prompt: "What gives a zone more weight?",
        options: [
          choice("a", "Repeated clean reactions", true, ""),
          choice("b", "Drawing it confidently", false, "zone-strength", "The chart evidence matters more than your confidence."),
          choice("c", "Calling it exact", false, "zone-strength", "Fake precision does not make a zone stronger."),
        ],
        explanation: "Zone strength comes from repeated chart evidence.",
        reviewPrompt: "zone-strength",
      },
    ],
    options: [],
    explanation: "Compare reaction count and reaction quality together.",
    reviewPrompt: "zone-strength",
  },
  "support-and-resistance-7": {
    question: "Quick failure check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "failure-case",
        prompt: "Price reaches support, breaks below it, and stays below.",
        options: [
          choice("a", "Support failed", true, ""),
          choice("b", "Support held", false, "support-failure", "Holding support would bounce away from the zone."),
          choice("c", "Resistance rejected", false, "support-failure", "This is still a lower-zone read."),
        ],
        explanation: "That is a support failure because price broke below and stayed below.",
        reviewPrompt: "support-failure",
      },
      {
        id: "recovery-clue",
        prompt: "What matters most after the touch?",
        options: [
          choice("a", "Whether price recovers the zone or stays below it", true, ""),
          choice("b", "Whether you named the line early", false, "support-failure", "The reaction decides the read."),
          choice("c", "Whether support held before", false, "support-failure", "Past behavior does not force the next result."),
        ],
        explanation: "The reaction after the test is what tells you whether support held or failed.",
        reviewPrompt: "support-failure",
      },
    ],
    options: [],
    explanation: "Support failure is about the break and the failed recovery.",
    reviewPrompt: "support-failure",
  },
  "support-and-resistance-8": {
    question: "Quick resistance-break check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "break-case",
        prompt: "Price pushes through resistance and keeps holding above it.",
        options: [
          choice("a", "Resistance broke", true, ""),
          choice("b", "Resistance rejected", false, "resistance-break", "A rejection would turn lower from the zone."),
          choice("c", "Nothing changed", false, "resistance-break", "Holding above the zone is the key change."),
        ],
        explanation: "That is a resistance break because price moved through the old ceiling and held there.",
        reviewPrompt: "resistance-break",
      },
      {
        id: "follow-through",
        prompt: "What confirms the break?",
        options: [
          choice("a", "Follow-through above the old ceiling", true, ""),
          choice("b", "Touching the zone once", false, "resistance-break", "The touch alone is not enough."),
          choice("c", "Calling the level important", false, "resistance-break", "The follow-through is the clue."),
        ],
        explanation: "The hold above the old ceiling is what confirms the break.",
        reviewPrompt: "resistance-break",
      },
    ],
    options: [],
    explanation: "Read the move through the zone and the hold above it together.",
    reviewPrompt: "resistance-break",
  },
};

const normalizedBreakoutPanelsByLesson: Record<string, LearnPanel[]> = {
  "breakouts-and-volume-1": [
    panel(
      "define",
      "A breakout is the move through",
      "Price kept failing under a watched level. Then it pushed through it.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "Price kept stalling under the same watched level.",
          revealTitle: "What changes",
          revealCopy: "A breakout is the move where price pushes through that level.",
          actionLabel: "Show me",
          highlightText: "pushes through",
        },
      },
    ),
    panel(
      "demo",
      "See the breakout moment",
      "The breakout is the event where price stops staying trapped under the level.",
      {
        eyebrow: "See it",
        activityKind: "chart-lab",
        activityData: {
          variant: "breakout-volume",
          pricePoints: [18, 24, 30, 36, 42, 64, 80],
          volumeBars: [12, 14, 16, 18, 20, 54, 60],
          breakoutIndex: 5,
          level: 52,
        },
      },
    ),
    panel(
      "lock",
      "Breakout is an event, not certainty",
      "The move through the level matters. The future still needs context.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "A breakout tells you the level stopped containing price in the same way.",
          revealTitle: "Careful takeaway",
          revealCopy: "The breakout event matters without guaranteeing the outcome.",
          actionLabel: "Show me",
          highlightText: "without guaranteeing",
        },
      },
    ),
  ],
  "breakouts-and-volume-2": [
    panel(
      "define",
      "Breakouts matter because behavior changed",
      "A watched level used to contain price. After the break, that setup can behave differently.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "The old ceiling kept stopping price in the same place.",
          revealTitle: "Why the break matters",
          revealCopy: "Once price moves through it, the behavior around that level can change.",
          actionLabel: "Show me",
          highlightText: "can change",
        },
      },
    ),
    panel(
      "demo",
      "Read before and after",
      "The watched level mattered before the break. That is why the break can matter too.",
      {
        eyebrow: "See it",
        activityKind: "chart-lab",
        activityData: {
          variant: "breakout-volume",
          pricePoints: [20, 26, 32, 36, 40, 60, 76],
          volumeBars: [12, 14, 16, 18, 20, 46, 52],
          breakoutIndex: 5,
          level: 50,
        },
      },
    ),
    panel(
      "flow",
      "Keep the logic in order",
      "Watched level first, break second, changed behavior third.",
      {
        eyebrow: "Flow",
        activityKind: "sequence-lab",
        activityData: {
          steps: [
            { id: "level", label: "Level mattered", description: "Price kept reacting there before." },
            { id: "break", label: "Price moved through it", description: "The old barrier gave way." },
            { id: "shift", label: "Behavior changed", description: "The setup is no longer trapped the same way." },
          ],
          orderedSteps: [
            { id: "1", label: "First" },
            { id: "2", label: "Then" },
            { id: "3", label: "Last" },
          ],
        },
      },
    ),
  ],
  "breakouts-and-volume-3": [
    panel(
      "define",
      "Volume is activity",
      "A tall volume bar means more trading activity happened in that period.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "One volume bar towers over the rest.",
          revealTitle: "What that tells you",
          revealCopy: "More participation showed up in that period.",
          actionLabel: "Show me",
          highlightText: "More participation",
        },
      },
    ),
    panel(
      "demo",
      "Read the bar before the story",
      "Volume tells you how active trading was. It does not tell you bullish or bearish by itself.",
      {
        eyebrow: "See it",
        activityKind: "chart-lab",
        activityData: {
          variant: "breakout-volume",
          pricePoints: [24, 26, 30, 32, 34, 38, 42],
          volumeBars: [10, 14, 16, 18, 22, 54, 24],
          breakoutIndex: 5,
          level: 44,
          levelLabel: "Reference line",
          markerLabel: "Volume spike",
          markerTarget: "volume",
          showLevel: false,
          caption: "The tallest bar marks the busiest trading period. Volume shows activity, not direction by itself.",
        },
      },
    ),
    panel(
      "lock",
      "Activity first, direction second",
      "Use the bars to read participation, then combine them with the price move.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "High volume can support a rally or a selloff.",
          revealTitle: "Careful takeaway",
          revealCopy: "Volume tells you activity. Price still tells you direction.",
          actionLabel: "Show me",
          highlightText: "activity",
        },
      },
    ),
  ],
  "breakouts-and-volume-4": [
    panel(
      "demo",
      "Stronger volume adds weight",
      "A breakout with louder volume often feels more convincing because more participation joined the move.",
      {
        eyebrow: "Learn",
        activityKind: "chart-lab",
        activityData: {
          variant: "breakout-volume",
          pricePoints: [18, 22, 26, 30, 34, 64, 82],
          volumeBars: [10, 12, 14, 16, 18, 58, 62],
          breakoutIndex: 5,
          level: 50,
        },
      },
    ),
    panel(
      "compare",
      "Same break, different participation",
      "If the price move looks similar, the louder volume profile usually deserves more respect.",
      {
        eyebrow: "Compare",
        activityKind: "reveal-card",
        activityData: {
          statement: "Two breakouts clear the same level, but one arrives with a much taller volume spike.",
          revealTitle: "Clean read",
          revealCopy: "The louder breakout shows stronger participation at the break.",
          actionLabel: "Show me",
          highlightText: "stronger participation",
        },
      },
    ),
    panel(
      "lock",
      "Participation helps, not guarantees",
      "Strong volume can improve the read without turning it into certainty.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "More participation is helpful context.",
          revealTitle: "Careful takeaway",
          revealCopy: "It can make the breakout feel stronger without guaranteeing success.",
          actionLabel: "Show me",
          highlightText: "without guaranteeing",
        },
      },
    ),
  ],
  "breakouts-and-volume-5": [
    panel(
      "demo",
      "Quiet participation deserves caution",
      "The break happened, but fewer traders joined the move.",
      {
        eyebrow: "Learn",
        activityKind: "chart-lab",
        activityData: {
          variant: "breakout-volume",
          pricePoints: [20, 24, 28, 32, 36, 52, 56],
          volumeBars: [14, 15, 16, 17, 18, 19, 20],
          breakoutIndex: 5,
          level: 48,
        },
      },
    ),
    panel(
      "compare",
      "Quiet is weaker, not impossible",
      "A quieter breakout can still work. It just deserves more caution than a louder one.",
      {
        eyebrow: "Compare",
        activityKind: "reveal-card",
        activityData: {
          statement: "The level broke, but the volume bars stayed quiet.",
          revealTitle: "Careful read",
          revealCopy: "That breakout deserves more caution because participation looks weaker.",
          actionLabel: "Show me",
          highlightText: "more caution",
        },
      },
    ),
    panel(
      "lock",
      "Caution is not rejection",
      "Quiet volume weakens conviction. It does not decide the future by itself.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "A quiet breakout is not automatically fake.",
          revealTitle: "Best takeaway",
          revealCopy: "Treat it more carefully instead of turning it into a guaranteed failure.",
          actionLabel: "Show me",
          highlightText: "more carefully",
        },
      },
    ),
  ],
  "breakouts-and-volume-6": [
    panel(
      "define",
      "A fake breakout fails to hold",
      "The chart breaks the level first, then gives the move back.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "Price broke above the level, then slipped back under it.",
          revealTitle: "What happened",
          revealCopy: "That is a fake breakout because the move failed to hold.",
          actionLabel: "Show me",
          highlightText: "failed to hold",
        },
      },
    ),
    panel(
      "order",
      "Read hold versus fail in sequence",
      "Break first, then check whether price holds the move or loses it.",
      {
        eyebrow: "Flow",
        activityKind: "sequence-lab",
        activityData: {
          steps: [
            { id: "break", label: "Price breaks above", description: "The level is cleared." },
            { id: "slip", label: "Price loses follow-through", description: "Momentum fades." },
            { id: "fail", label: "Price falls back below", description: "Now it looks fake." },
          ],
          orderedSteps: [
            { id: "1", label: "First" },
            { id: "2", label: "Then" },
            { id: "3", label: "Last" },
          ],
        },
      },
    ),
    panel(
      "lock",
      "The first push is not enough",
      "A breakout only earns more trust if the move keeps holding above the level.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "The breakout event matters, but the hold matters too.",
          revealTitle: "Careful takeaway",
          revealCopy: "Failure to hold turns the setup into a fake breakout.",
          actionLabel: "Show me",
          highlightText: "Failure to hold",
        },
      },
    ),
  ],
  "breakouts-and-volume-7": [
    panel(
      "define",
      "High volume is not automatically bullish",
      "Loud participation can show up on the way down too.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "A sharp selloff can print very tall volume bars.",
          revealTitle: "What that means",
          revealCopy: "High volume can support bearish moves too. It is an activity clue, not a bullish label.",
          actionLabel: "Show me",
          highlightText: "activity clue",
        },
      },
    ),
    panel(
      "compare",
      "Pair the bars with price",
      "The bars tell you participation. The price move tells you direction.",
      {
        eyebrow: "Compare",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Bullish", "Bearish", "Depends"],
          cards: [
            { id: "up-loud", label: "Strong breakout with high volume", target: "Bullish" },
            { id: "down-loud", label: "Sharp selloff with high volume", target: "Bearish" },
            { id: "spike-alone", label: "High volume alone", target: "Depends" },
          ],
        },
      },
    ),
    panel(
      "lock",
      "One clue should not do all the work",
      "Volume supports the price read. It does not replace it.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "A volume spike does not tell the whole story by itself.",
          revealTitle: "Best takeaway",
          revealCopy: "Use volume to read activity, then use price to read direction.",
          actionLabel: "Show me",
          highlightText: "read activity",
        },
      },
    ),
  ],
  "breakouts-and-volume-8": [
    panel(
      "define",
      "One clue is not enough",
      "Breakout quality improves when the level, the break, and the participation all support each other.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "Breakout, volume, and prior structure can point the same way.",
          revealTitle: "Why context matters",
          revealCopy: "Stacked evidence is stronger than one clue alone.",
          actionLabel: "Show me",
          highlightText: "Stacked evidence",
        },
      },
    ),
    panel(
      "compare",
      "Helpful clues still need each other",
      "A level break helps. A volume spike helps. Context gets stronger when the clues work together.",
      {
        eyebrow: "Compare",
        activityKind: "bucket-sort",
        activityData: {
          buckets: ["Helpful clue", "Overreach"],
          cards: [
            { id: "break", label: "Price breaks the watched level", target: "Helpful clue" },
            { id: "volume", label: "Volume rises at the break", target: "Helpful clue" },
            { id: "guarantee", label: "One clue proves the setup", target: "Overreach" },
          ],
        },
      },
    ),
    panel(
      "lock",
      "Context is stronger, not certain",
      "Evidence stacking improves the explanation without guaranteeing the outcome.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "The setup looks better when multiple clues agree.",
          revealTitle: "Careful takeaway",
          revealCopy: "Use the stack to rank quality, not to pretend certainty.",
          actionLabel: "Show me",
          highlightText: "rank quality",
        },
      },
    ),
  ],
  "breakouts-and-volume-9": [
    panel(
      "define",
      "Stronger setups stack more evidence",
      "Cleaner follow-through and louder participation usually move a setup up the ranking.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "Three breakouts clear the level, but they do not all look equally convincing.",
          revealTitle: "What changes the rank",
          revealCopy: "The strongest setup stacks cleaner follow-through and stronger participation.",
          actionLabel: "Show me",
          highlightText: "strongest setup",
        },
      },
    ),
    panel(
      "rank",
      "Compare the full setup",
      "Use the break, the follow-through, and the volume profile together.",
      {
        eyebrow: "Compare",
        activityKind: "sequence-lab",
        activityData: {
          steps: [
            { id: "weak", label: "Weak setup", description: "Quiet move with little follow-through.", points: [18, 24, 30, 34, 38, 52, 56], volumeBars: [12, 14, 16, 18, 18, 20, 20] },
            { id: "mid", label: "Middle setup", description: "Some participation and some follow-through.", points: [18, 24, 30, 34, 38, 56, 64], volumeBars: [12, 14, 16, 18, 20, 30, 34] },
            { id: "strong", label: "Strong setup", description: "Clear break with louder participation.", points: [18, 24, 30, 34, 38, 60, 74], volumeBars: [12, 14, 18, 20, 22, 48, 52] },
          ],
          orderedSteps: [
            { id: "1", label: "Weakest" },
            { id: "2", label: "Middle" },
            { id: "3", label: "Strongest" },
          ],
        },
      },
    ),
    panel(
      "lock",
      "Strongest still is not certain",
      "This is a ranking exercise. It is not a guarantee exercise.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "The best-looking setup still carries risk.",
          revealTitle: "Careful takeaway",
          revealCopy: "Use the ranking to compare quality, not to remove uncertainty.",
          actionLabel: "Show me",
          highlightText: "compare quality",
        },
      },
    ),
  ],
  "breakouts-and-volume-10": [
    panel(
      "boss-setup",
      "This checkpoint mixes event, volume, and hold",
      "You will need to separate real breaks from fake ones and keep every conclusion careful.",
      {
        eyebrow: "Boss setup",
        activityKind: "chart-lab",
        activityData: {
          variant: "breakout-volume",
          pricePoints: [18, 24, 30, 34, 38, 62, 80],
          volumeBars: [12, 14, 18, 20, 22, 54, 58],
          breakoutIndex: 5,
          level: 50,
        },
      },
    ),
    panel(
      "boss-rule",
      "Wrong reads send the lab back one step",
      "Boss progress only turns green after the logic is earned.",
      {
        eyebrow: "Pressure rule",
        activityKind: "reveal-card",
        activityData: {
          statement: "A strong breakout read needs the event, the volume, and the hold.",
          revealTitle: "What changes here",
          revealCopy: "Miss one step and the checkpoint sends you back one stage until the logic is re-locked.",
          actionLabel: "Show the rule",
          highlightText: "sends you back",
        },
      },
    ),
  ],
};

const normalizedBreakoutPracticePatches: Record<string, Partial<PracticeContent>> = {
  "breakouts-and-volume-1": {
    mechanicTitle: "Breakout sorter",
    mechanicSummary: "Sort the examples by whether price really moved through the watched level.",
    prompt: "Place each clue into breakout or not breakout.",
    question: "",
    options: [],
    explanation: "Right. A breakout is the move through the watched level.",
    activityKind: "bucket-sort",
    supportActivities: ["Look for the watched level.", "Look for the move through it.", "Keep the event separate from the outcome."],
    useActivityAsPractice: true,
    actionLabel: "Continue to check",
    readinessLabel: "Sort every clue first",
    activityData: {
      buckets: ["Breakout", "Not breakout"],
      cards: [
        { id: "through", label: "Price pushes through the watched level", target: "Breakout" },
        { id: "below", label: "Price keeps failing under the same level", target: "Not breakout" },
        { id: "event", label: "The move changed from trapped to through", target: "Breakout" },
      ],
    },
  },
  "breakouts-and-volume-2": {
    mechanicTitle: "Behavior shift sorter",
    mechanicSummary: "Sort the clues by whether the watched level stopped containing price in the same way.",
    prompt: "Place each clue into behavior changed or still trapped.",
    question: "",
    options: [],
    explanation: "Right. Traders watch breakouts because behavior can change around a watched level.",
    activityKind: "bucket-sort",
    supportActivities: ["Start with the old level.", "Then look for the break.", "Decide whether behavior changed."],
    useActivityAsPractice: true,
    actionLabel: "Continue to check",
    readinessLabel: "Sort every clue first",
    activityData: {
      buckets: ["Behavior changed", "Still trapped"],
      cards: [
        { id: "changed", label: "Price moved through the old ceiling", target: "Behavior changed" },
        { id: "trapped", label: "Price kept failing below the same level", target: "Still trapped" },
        { id: "new-path", label: "The setup no longer looks contained the same way", target: "Behavior changed" },
      ],
    },
  },
  "breakouts-and-volume-3": {
    mechanicTitle: "Volume clue sorter",
    mechanicSummary: "Separate what volume really tells you from what it cannot guarantee.",
    prompt: "Place each clue where it belongs.",
    question: "",
    options: [],
    explanation: "Right. Volume mainly tells you participation changed.",
    activityKind: "bucket-sort",
    supportActivities: ["Read the volume clue first.", "Keep it separate from certainty.", "Let price handle direction."],
    useActivityAsPractice: true,
    actionLabel: "Continue to check",
    readinessLabel: "Sort every clue first",
    activityData: {
      buckets: ["Participation clue", "Overreach"],
      cards: [
        { id: "activity", label: "More traders were active", target: "Participation clue" },
        { id: "guarantee", label: "The move must work now", target: "Overreach" },
        { id: "context", label: "Direction still needs the price move", target: "Participation clue" },
      ],
    },
  },
  "breakouts-and-volume-4": activityOnlyPracticePatch("Sort both breakout cards first"),
  "breakouts-and-volume-5": activityOnlyPracticePatch("Sort both breakout cards first"),
  "breakouts-and-volume-6": activityOnlyPracticePatch("Sort both breakout charts first"),
  "breakouts-and-volume-7": activityOnlyPracticePatch("Sort every volume example first"),
  "breakouts-and-volume-8": {
    mechanicTitle: "Evidence stack sorter",
    mechanicSummary: "Sort the clues that strengthen context away from the overclaims that pretend one clue is enough.",
    prompt: "Place each clue into helpful stack or overreach.",
    question: "",
    options: [],
    explanation: "Right. Breakout context gets stronger when helpful clues stack instead of overclaiming.",
    activityKind: "bucket-sort",
    supportActivities: ["Use more than one clue.", "Keep helpful evidence together.", "Push certainty claims out."],
    useActivityAsPractice: true,
    actionLabel: "Continue to check",
    readinessLabel: "Sort every clue first",
    activityData: {
      buckets: ["Helpful stack", "Overreach"],
      cards: [
        { id: "break", label: "The watched level broke", target: "Helpful stack" },
        { id: "volume", label: "Participation rose at the break", target: "Helpful stack" },
        { id: "structure", label: "The level mattered before", target: "Helpful stack" },
        { id: "guarantee", label: "One clue proves success", target: "Overreach" },
      ],
    },
  },
  "breakouts-and-volume-9": activityOnlyPracticePatch("Rank every setup first"),
};

const normalizedBreakoutCheckPatches: Record<string, CheckContent> = {
  "breakouts-and-volume-4": {
    question: "Quick breakout-quality check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "loud-breakout",
        prompt: "A breakout clears the level with a tall volume spike.",
        options: [
          choice("a", "Stronger participation", true, ""),
          choice("b", "Weaker participation", false, "strong-volume-breakout", "The tall spike is the clue that participation was stronger."),
          choice("c", "Guaranteed success", false, "strong-volume-breakout", "Strong participation still does not guarantee the outcome."),
        ],
        explanation: "The tall spike signals stronger participation at the break.",
        reviewPrompt: "strong-volume-breakout",
      },
      {
        id: "quiet-breakout",
        prompt: "A similar breakout happens with much quieter volume.",
        options: [
          choice("a", "It deserves a weaker read than the louder one", true, ""),
          choice("b", "It is identical no matter the bars", false, "strong-volume-breakout", "Volume changes the participation read."),
          choice("c", "It guarantees failure", false, "strong-volume-breakout", "Quiet volume weakens conviction. It does not guarantee failure."),
        ],
        explanation: "Quieter participation usually deserves the weaker read.",
        reviewPrompt: "strong-volume-breakout",
      },
    ],
    options: [],
    explanation: "Use volume to compare participation quality, not to invent certainty.",
    reviewPrompt: "strong-volume-breakout",
  },
  "breakouts-and-volume-5": {
    question: "Quick caution check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "quiet-caution",
        prompt: "The level broke, but the volume stayed quiet.",
        options: [
          choice("a", "More caution", true, ""),
          choice("b", "Guaranteed failure", false, "quiet-breakout", "Quiet volume deserves caution, not instant rejection."),
          choice("c", "No caution at all", false, "quiet-breakout", "The quieter profile is exactly why caution rises."),
        ],
        explanation: "Quiet participation deserves more caution.",
        reviewPrompt: "quiet-breakout",
      },
      {
        id: "loud-vs-quiet",
        prompt: "Which breakout usually deserves less caution?",
        options: [
          choice("a", "The louder breakout", true, ""),
          choice("b", "The quieter breakout", false, "quiet-breakout", "The quieter move deserves more caution."),
          choice("c", "Both deserve identical confidence", false, "quiet-breakout", "The participation profile changes the read."),
        ],
        explanation: "The louder breakout usually deserves the less-cautious read.",
        reviewPrompt: "quiet-breakout",
      },
    ],
    options: [],
    explanation: "Quiet volume weakens conviction without deciding the future.",
    reviewPrompt: "quiet-breakout",
  },
  "breakouts-and-volume-6": {
    question: "Quick fakeout check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "fakeout-case",
        prompt: "Price breaks the level and then falls back below it.",
        options: [
          choice("a", "Fake breakout", true, ""),
          choice("b", "Held breakout", false, "fake-breakout", "A held breakout stays above the level instead."),
          choice("c", "Guaranteed strength", false, "fake-breakout", "This is the opposite of guaranteed strength."),
        ],
        explanation: "That is a fake breakout because the move failed to hold.",
        reviewPrompt: "fake-breakout",
      },
      {
        id: "hold-clue",
        prompt: "What tells you the breakout was real instead of fake?",
        options: [
          choice("a", "Price kept holding above the old level", true, ""),
          choice("b", "The first push happened", false, "fake-breakout", "The first push alone is not enough."),
          choice("c", "A big label on the chart", false, "fake-breakout", "The hold-versus-fail behavior is the clue."),
        ],
        explanation: "The hold above the old level is what separates a real break from a fake one.",
        reviewPrompt: "fake-breakout",
      },
    ],
    options: [],
    explanation: "Read the break and the hold together.",
    reviewPrompt: "fake-breakout",
  },
  "breakouts-and-volume-7": {
    question: "Quick volume-context check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "rally-volume",
        prompt: "High volume shows up on a strong rally.",
        options: [
          choice("a", "Bullish context", true, ""),
          choice("b", "Bearish context", false, "volume-context", "The price move is rallying, not selling off."),
          choice("c", "No clue at all", false, "volume-context", "Volume still tells you participation rose."),
        ],
        explanation: "High volume on a rally supports a bullish context read.",
        reviewPrompt: "volume-context",
      },
      {
        id: "selloff-volume",
        prompt: "High volume shows up on a sharp selloff.",
        options: [
          choice("a", "Bearish context", true, ""),
          choice("b", "Automatically bullish", false, "volume-context", "High volume is not automatically bullish."),
          choice("c", "Guaranteed reversal", false, "volume-context", "The volume spike itself does not guarantee that."),
        ],
        explanation: "High volume on a selloff supports a bearish context read.",
        reviewPrompt: "volume-context",
      },
      {
        id: "volume-alone",
        prompt: "What does high volume alone tell you?",
        options: [
          choice("a", "Participation increased, but direction still needs price context", true, ""),
          choice("b", "The move is automatically bullish", false, "volume-context", "Direction still depends on the price move."),
          choice("c", "Volume means nothing useful", false, "volume-context", "It still tells you about participation."),
        ],
        explanation: "High volume alone mainly tells you activity increased.",
        reviewPrompt: "volume-context",
      },
    ],
    options: [],
    explanation: "Use volume with the price move instead of by itself.",
    reviewPrompt: "volume-context",
  },
  "breakouts-and-volume-8": {
    question: "Quick context stack check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "stacked-evidence",
        prompt: "A watched level breaks, volume rises, and the move holds.",
        options: [
          choice("a", "Stronger context", true, ""),
          choice("b", "One clue only", false, "breakout-context", "That is a stack, not one clue."),
          choice("c", "Guaranteed success", false, "breakout-context", "Even stacked evidence does not guarantee success."),
        ],
        explanation: "That combination gives the stronger context read.",
        reviewPrompt: "breakout-context",
      },
      {
        id: "single-clue",
        prompt: "Only one clue looks good and the rest are weak or missing.",
        options: [
          choice("a", "Not enough alone", true, ""),
          choice("b", "That one clue proves the setup", false, "breakout-context", "The whole lesson is about not overclaiming from one clue."),
          choice("c", "Context stopped mattering", false, "breakout-context", "Context matters more, not less."),
        ],
        explanation: "One clue alone is not enough to carry the whole verdict.",
        reviewPrompt: "breakout-context",
      },
    ],
    options: [],
    explanation: "Breakout context gets stronger when multiple clues agree.",
    reviewPrompt: "breakout-context",
  },
  "breakouts-and-volume-9": {
    question: "Quick setup-ranking check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "strongest-setup",
        prompt: "Which setup belongs at the top of the rank?",
        options: [
          choice("a", "Clear break, louder volume, better follow-through", true, ""),
          choice("b", "Quiet break with weak follow-through", false, "setup-quality", "That belongs lower in the ranking."),
          choice("c", "Any breakout no matter the quality", false, "setup-quality", "This lesson is about quality differences."),
        ],
        explanation: "The strongest setup stacks cleaner price action and stronger participation.",
        reviewPrompt: "setup-quality",
      },
      {
        id: "weakest-setup",
        prompt: "Which setup belongs near the bottom?",
        options: [
          choice("a", "Quiet break with weak follow-through", true, ""),
          choice("b", "Clear break with louder participation", false, "setup-quality", "That is closer to the strong end."),
          choice("c", "All setups rank the same", false, "setup-quality", "The whole lesson is about ranking differences."),
        ],
        explanation: "The quieter break with weak follow-through is the weaker setup.",
        reviewPrompt: "setup-quality",
      },
    ],
    options: [],
    explanation: "Rank breakout quality with price action and participation together.",
    reviewPrompt: "setup-quality",
  },
};

const normalizedBusinessPanelsByLesson: Record<string, LearnPanel[]> = {
  "business-fundamentals-1": [
    panel(
      "define",
      "Charts and businesses answer different questions",
      "Technical clues describe price behavior. Fundamental clues describe the business itself.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "Trend tells you what price is doing. Revenue tells you what the business is doing.",
          revealTitle: "Two lenses",
          revealCopy: "Technical and fundamental clues answer different questions.",
          actionLabel: "Show me",
          highlightText: "different questions",
        },
      },
    ),
    panel(
      "compare",
      "Keep the lenses separate first",
      "Cleaner analysis starts by separating chart behavior from company facts.",
      {
        eyebrow: "Compare",
        activityKind: "business-builder",
        activityData: {
          variant: "snapshot-board",
          sections: [
            { label: "Chart lens", value: "Trend, support, price move" },
            { label: "Business lens", value: "Revenue, profit, margin" },
          ],
        },
      },
    ),
    panel(
      "lock",
      "Do not mix the first read",
      "You can combine the lenses later. First, know which clue belongs to which side.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "Revenue is not a chart pattern, and support is not a business metric.",
          revealTitle: "Best habit",
          revealCopy: "Sort the clue by lens before you judge what it means.",
          actionLabel: "Show me",
          highlightText: "Sort the clue",
        },
      },
    ),
  ],
  "business-fundamentals-2": [
    panel(
      "define",
      "Fundamentals start with business questions",
      "Size, growth, and profitability are simple questions first. The metrics come after.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "Good business analysis starts with: how big, how fast, and how profitable?",
          revealTitle: "Why this matters",
          revealCopy: "Fundamental metrics feel simpler when each one answers a business question.",
          actionLabel: "Show me",
          highlightText: "business question",
        },
      },
    ),
    panel(
      "questions",
      "Use the core question list",
      "You do not need jargon first. You need the right question first.",
      {
        eyebrow: "See it",
        activityKind: "checklist",
        activityData: {
          items: ["How big is the company?", "Are sales growing?", "Is anything left after costs?"],
        },
      },
    ),
    panel(
      "lock",
      "One metric should not answer everything",
      "Each metric helps with one part of the company picture.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "Market cap, revenue growth, and margin are not interchangeable.",
          revealTitle: "Best takeaway",
          revealCopy: "Use the right metric for the right business question.",
          actionLabel: "Show me",
          highlightText: "right metric",
        },
      },
    ),
  ],
  "business-fundamentals-3": [
    panel(
      "demo",
      "Revenue is sales coming in",
      "Watch sales change before any costs are removed.",
      {
        eyebrow: "Learn",
        activityKind: "business-builder",
        activityData: { variant: "revenue-counter", units: 40, pricePerUnit: 6 },
      },
    ),
    panel(
      "define",
      "Revenue comes before profit",
      "Revenue answers one simple question: how much did the business sell?",
      {
        eyebrow: "Define",
        activityKind: "reveal-card",
        activityData: {
          statement: "Revenue is the money coming in from sales.",
          revealTitle: "Keep it simple",
          revealCopy: "Revenue is sales in before costs come out.",
          actionLabel: "Show me",
          highlightText: "sales in",
        },
      },
    ),
    panel(
      "lock",
      "More sales is not automatic profit",
      "Costs still decide what is left after those sales.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "Higher revenue can still arrive with rising costs.",
          revealTitle: "Careful takeaway",
          revealCopy: "Revenue tells you sales came in. It does not guarantee more profit by itself.",
          actionLabel: "Show me",
          highlightText: "does not guarantee",
        },
      },
    ),
  ],
  "business-fundamentals-4": [
    panel(
      "demo",
      "Profit is what remains",
      "Watch costs come out of revenue and see the leftover change.",
      {
        eyebrow: "Learn",
        activityKind: "business-builder",
        activityData: { variant: "profit-builder", revenue: 140, costs: 70 },
      },
    ),
    panel(
      "define",
      "Profit is the leftover amount",
      "Revenue tells you what came in. Profit tells you what remains after costs.",
      {
        eyebrow: "Define",
        activityKind: "reveal-card",
        activityData: {
          statement: "Start with revenue, then take away costs.",
          revealTitle: "What stays",
          revealCopy: "Profit is the money left after costs are removed.",
          actionLabel: "Show me",
          highlightText: "left after costs",
        },
      },
    ),
    panel(
      "lock",
      "More revenue can still leave weak profit",
      "The leftover depends on costs, not just on sales coming in.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "Revenue and profit are connected, but they are not the same thing.",
          revealTitle: "Careful takeaway",
          revealCopy: "Costs decide how much of the revenue survives as profit.",
          actionLabel: "Show me",
          highlightText: "Costs decide",
        },
      },
    ),
  ],
  "business-fundamentals-5": [
    panel(
      "demo",
      "Margin compares what survives",
      "Two companies can sell the same amount and keep very different profits.",
      {
        eyebrow: "Learn",
        activityKind: "business-builder",
        activityData: {
          variant: "margin-compare",
          companies: [
            { id: "a", name: "Company A", revenue: "$100", profit: "$30", margin: "30%", note: "Keeps more of each sales dollar." },
            { id: "b", name: "Company B", revenue: "$100", profit: "$10", margin: "10%", note: "Keeps less after costs." },
          ],
        },
      },
    ),
    panel(
      "compare",
      "Same revenue can hide different quality",
      "Margin is an efficiency clue. It asks how much of the sales survived as profit.",
      {
        eyebrow: "Compare",
        activityKind: "reveal-card",
        activityData: {
          statement: "Both companies sold $100, but one kept much more profit.",
          revealTitle: "What margin adds",
          revealCopy: "Margin shows how efficiently the business keeps what it sells.",
          actionLabel: "Show me",
          highlightText: "efficiently",
        },
      },
    ),
    panel(
      "lock",
      "Revenue alone cannot show efficiency",
      "That is why margin matters when two businesses sell similar amounts.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "Top-line sales and business quality are not the same question.",
          revealTitle: "Best takeaway",
          revealCopy: "Use margin to compare what each company keeps from similar sales.",
          actionLabel: "Show me",
          highlightText: "what each company keeps",
        },
      },
    ),
  ],
  "business-fundamentals-6": [
    panel(
      "demo",
      "Growth and quality can point to different companies",
      "One business can grow faster while another keeps more profit.",
      {
        eyebrow: "Learn",
        activityKind: "business-builder",
        activityData: {
          variant: "margin-compare",
          companies: [
            { id: "a", name: "FastGrow", revenue: "Growth 28%", profit: "Margin 8%", margin: "Low margin" },
            { id: "b", name: "SteadyCore", revenue: "Growth 12%", profit: "Margin 22%", margin: "Higher margin" },
          ],
        },
      },
    ),
    panel(
      "split",
      "Growth and quality are different lenses",
      "Growth asks how fast sales are expanding. Quality asks how much of those sales survive.",
      {
        eyebrow: "Compare",
        activityKind: "reveal-card",
        activityData: {
          statement: "Fast growth is not the same thing as strong profitability.",
          revealTitle: "Two different reads",
          revealCopy: "Growth tells you speed. Quality tells you what survives after costs.",
          actionLabel: "Show me",
          highlightText: "what survives",
        },
      },
    ),
    panel(
      "lock",
      "Hold both lenses at once",
      "A better business read compares growth and quality together instead of forcing them into one answer.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "The faster grower does not have to be the healthier business.",
          revealTitle: "Best takeaway",
          revealCopy: "Compare sales speed and profitability side by side.",
          actionLabel: "Show me",
          highlightText: "side by side",
        },
      },
    ),
  ],
  "business-fundamentals-7": [
    panel(
      "define",
      "Metric names matter less than the question",
      "Start with the business question you want answered.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "How big is it? How much is it selling? How much is left after costs?",
          revealTitle: "Question-first reading",
          revealCopy: "Metrics feel simpler when each one answers a clear business question.",
          actionLabel: "Show me",
          highlightText: "clear business question",
        },
      },
    ),
    panel(
      "board",
      "Use the core categories first",
      "Size, sales, and profitability keep the first business read organized.",
      {
        eyebrow: "See it",
        activityKind: "business-builder",
        activityData: {
          variant: "snapshot-board",
          sections: [
            { label: "Size", value: "Market cap" },
            { label: "Sales", value: "Revenue / growth" },
            { label: "Profit", value: "Margin / EPS" },
          ],
        },
      },
    ),
    panel(
      "lock",
      "One metric should not do every job",
      "Use the right metric for the right question instead of forcing one answer everywhere.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "Market cap, revenue, and margin are solving different problems.",
          revealTitle: "Best takeaway",
          revealCopy: "Keep the metric matched to the question it actually answers.",
          actionLabel: "Show me",
          highlightText: "matched to the question",
        },
      },
    ),
  ],
  "business-fundamentals-8": [
    panel(
      "define",
      "Markets can react before the proof arrives",
      "Price is fast. Business reports can take longer to catch up.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "News can change expectations today even if the revenue report comes later.",
          revealTitle: "Timing difference",
          revealCopy: "Price and expectations can move before the slower business proof arrives.",
          actionLabel: "Show me",
          highlightText: "before the slower business proof",
        },
      },
    ),
    panel(
      "order",
      "Read the timing in sequence",
      "Expectation shift first, market reaction next, full business proof later.",
      {
        eyebrow: "Flow",
        activityKind: "sequence-lab",
        activityData: {
          steps: [
            { id: "expectations", label: "Expectations shift", description: "New information changes the outlook." },
            { id: "price", label: "Price reacts", description: "The market moves quickly." },
            { id: "business", label: "Revenue report arrives", description: "Business proof can come later." },
          ],
          orderedSteps: [
            { id: "1", label: "First" },
            { id: "2", label: "Then" },
            { id: "3", label: "Last" },
          ],
        },
      },
    ),
    panel(
      "lock",
      "Do not force price to wait",
      "Markets often move before the slower business numbers fully show the change.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "Price does not always wait for the official report cycle.",
          revealTitle: "Best takeaway",
          revealCopy: "Use timing to explain why markets can move before the business proof lands.",
          actionLabel: "Show me",
          highlightText: "before the business proof",
        },
      },
    ),
  ],
  "business-fundamentals-9": [
    panel(
      "demo",
      "Start with a compact snapshot",
      "A good first look answers a few business questions, not twenty.",
      {
        eyebrow: "Learn",
        activityKind: "business-builder",
        activityData: {
          variant: "snapshot-board",
          sections: [
            { label: "Size", value: "Market cap" },
            { label: "Growth", value: "Revenue trend" },
            { label: "Profit", value: "Margin / EPS" },
          ],
        },
      },
    ),
    panel(
      "focus",
      "Use the three core questions first",
      "How big is it? Is it growing? Is it profitable? That is enough for the first pass.",
      {
        eyebrow: "Focus",
        activityKind: "checklist",
        activityData: {
          items: ["How big is it?", "Is it growing?", "Is it profitable?"],
        },
      },
    ),
    panel(
      "lock",
      "Do not start with metric overload",
      "A strong first snapshot stays compact and adds detail later.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "A beginner snapshot is supposed to simplify the business.",
          revealTitle: "Best takeaway",
          revealCopy: "Start with size, growth, and profit before you chase extra detail.",
          actionLabel: "Show me",
          highlightText: "size, growth, and profit",
        },
      },
    ),
  ],
  "business-fundamentals-10": [
    panel(
      "boss-setup",
      "This checkpoint combines the business picture",
      "You will need to separate lenses, read revenue and profit, compare quality, and build a clean snapshot under pressure.",
      {
        eyebrow: "Boss setup",
        activityKind: "business-builder",
        activityData: {
          variant: "snapshot-board",
          sections: [
            { label: "Revenue", value: "Growing steadily" },
            { label: "Profit", value: "Positive" },
            { label: "Margin", value: "Moderate" },
            { label: "Profile", value: "Still improving quality" },
          ],
        },
      },
    ),
    panel(
      "boss-rule",
      "Wrong reads send the snapshot back one step",
      "Boss progress only turns green after each business clue is solved correctly.",
      {
        eyebrow: "Pressure rule",
        activityKind: "reveal-card",
        activityData: {
          statement: "This boss rewards clean business logic, not one-metric guessing.",
          revealTitle: "What changes here",
          revealCopy: "Miss a step and the checkpoint sends you back one stage until the business logic is re-locked.",
          actionLabel: "Show the rule",
          highlightText: "sends you back",
        },
      },
    ),
  ],
};

const normalizedBusinessPracticePatches: Record<string, Partial<PracticeContent>> = {
  "business-fundamentals-1": activityOnlyPracticePatch("Sort every clue first"),
  "business-fundamentals-2": activityOnlyPracticePatch("Sort every question first"),
  "business-fundamentals-3": {
    mechanicTitle: "Revenue sorter",
    mechanicSummary: "Sort sales-in clues away from costs and leftovers.",
    prompt: "Place each clue into revenue or not revenue.",
    question: "",
    options: [],
    explanation: "Right. Revenue is the money coming in from sales.",
    activityKind: "bucket-sort",
    supportActivities: ["Keep sales in separate from costs.", "Revenue comes before profit.", "Use plain business language."],
    useActivityAsPractice: true,
    actionLabel: "Continue to check",
    readinessLabel: "Sort every clue first",
    activityData: {
      buckets: ["Revenue", "Not revenue"],
      cards: [
        { id: "sales", label: "Money from selling products", target: "Revenue" },
        { id: "costs", label: "Money spent to run the business", target: "Not revenue" },
        { id: "leftover", label: "Money left after costs", target: "Not revenue" },
      ],
    },
  },
  "business-fundamentals-4": {
    mechanicTitle: "Profit sorter",
    mechanicSummary: "Separate the leftover amount from revenue and costs.",
    prompt: "Place each clue into profit or not profit.",
    question: "",
    options: [],
    explanation: "Right. Profit is the money left after costs.",
    activityKind: "bucket-sort",
    supportActivities: ["Start with revenue.", "Subtract costs.", "Read the leftover clearly."],
    useActivityAsPractice: true,
    actionLabel: "Continue to check",
    readinessLabel: "Sort every clue first",
    activityData: {
      buckets: ["Profit", "Not profit"],
      cards: [
        { id: "leftover", label: "Money left after costs", target: "Profit" },
        { id: "sales", label: "Money from sales", target: "Not profit" },
        { id: "costs", label: "Money spent on costs", target: "Not profit" },
      ],
    },
  },
  "business-fundamentals-5": {
    mechanicTitle: "Margin sorter",
    mechanicSummary: "Sort the companies by whether they keep more or less profit from similar sales.",
    prompt: "Place each clue into better margin or weaker margin.",
    question: "",
    options: [],
    explanation: "Right. Better margin means keeping more profit from similar revenue.",
    activityKind: "bucket-sort",
    supportActivities: ["Compare revenue first.", "Then compare what is left.", "Read efficiency from the gap."],
    useActivityAsPractice: true,
    actionLabel: "Continue to check",
    readinessLabel: "Sort every clue first",
    activityData: {
      buckets: ["Better margin", "Weaker margin"],
      cards: [
        { id: "keep30", label: "Keeps $30 from $100", target: "Better margin" },
        { id: "keep10", label: "Keeps $10 from $100", target: "Weaker margin" },
        { id: "same-revenue", label: "Same sales, stronger leftover profit", target: "Better margin" },
      ],
    },
  },
  "business-fundamentals-6": {
    mechanicTitle: "Growth vs quality sort",
    mechanicSummary: "Separate faster-sales clues from stronger-profitability clues.",
    prompt: "Place each clue into growth or quality.",
    question: "",
    options: [],
    explanation: "Right. Growth and quality are different business dimensions.",
    activityKind: "bucket-sort",
    supportActivities: ["Use growth for sales speed.", "Use quality for what survives.", "Keep both lenses visible."],
    useActivityAsPractice: true,
    actionLabel: "Continue to check",
    readinessLabel: "Sort every clue first",
    activityData: {
      buckets: ["Growth clue", "Quality clue"],
      cards: [
        { id: "sales-up", label: "Revenue rising 30%", target: "Growth clue" },
        { id: "margin-strong", label: "Margin holding at 24%", target: "Quality clue" },
        { id: "faster", label: "Sales expanding quickly", target: "Growth clue" },
        { id: "keeps-more", label: "Keeps more profit from each sale", target: "Quality clue" },
      ],
    },
  },
  "business-fundamentals-7": activityOnlyPracticePatch("Sort every metric clue first"),
  "business-fundamentals-8": activityOnlyPracticePatch("Finish the order first"),
  "business-fundamentals-9": {
    mechanicTitle: "Snapshot or later detail?",
    mechanicSummary: "Sort the first-look business categories away from the details that can wait.",
    prompt: "Place each item into snapshot first or later detail.",
    question: "",
    options: [],
    explanation: "Right. A first snapshot should stay compact.",
    activityKind: "bucket-sort",
    supportActivities: ["Keep the first pass simple.", "Use size, growth, and profit.", "Push extra detail later."],
    useActivityAsPractice: true,
    actionLabel: "Continue to check",
    readinessLabel: "Sort every item first",
    activityData: {
      buckets: ["Snapshot first", "Later detail"],
      cards: [
        { id: "size", label: "Company size", target: "Snapshot first" },
        { id: "growth", label: "Sales growth", target: "Snapshot first" },
        { id: "profit", label: "Profitability", target: "Snapshot first" },
        { id: "office", label: "Office paint color", target: "Later detail" },
      ],
    },
  },
};

const normalizedBusinessCheckPatches: Record<string, CheckContent> = {
  "business-fundamentals-5": {
    question: "Quick margin check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "same-revenue",
        prompt: "Two companies both sell $100. One keeps $30 profit. The other keeps $10.",
        options: [
          choice("a", "The $30 company has the better margin", true, ""),
          choice("b", "The $10 company has the better margin", false, "margin-basics", "Keeping less profit from the same sales is the weaker margin."),
          choice("c", "They are equal because revenue matches", false, "margin-basics", "Margin is about what is left after costs."),
        ],
        explanation: "The company keeping $30 has the better margin because it keeps more from the same sales.",
        reviewPrompt: "margin-basics",
      },
      {
        id: "efficiency",
        prompt: "What is margin mainly helping you compare?",
        options: [
          choice("a", "Efficiency in keeping profit from revenue", true, ""),
          choice("b", "Only the stock chart", false, "margin-basics", "Margin is a business metric, not a chart pattern."),
          choice("c", "Company size only", false, "margin-basics", "Margin is about efficiency, not size."),
        ],
        explanation: "Margin is an efficiency clue about how much profit survives from sales.",
        reviewPrompt: "margin-basics",
      },
    ],
    options: [],
    explanation: "Compare what survives from similar sales.",
    reviewPrompt: "margin-basics",
  },
  "business-fundamentals-6": {
    question: "Quick growth-vs-quality check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "faster-grower",
        prompt: "FastGrow shows revenue growth of 30%. SteadyCore shows 12%. Which grew faster?",
        options: [
          choice("a", "FastGrow", true, ""),
          choice("b", "SteadyCore", false, "growth-vs-quality", "SteadyCore is the stronger quality read here, not the faster growth read."),
          choice("c", "Both equally", false, "growth-vs-quality", "The growth numbers are different on purpose."),
        ],
        explanation: "FastGrow is the faster grower because its sales are expanding more quickly.",
        reviewPrompt: "growth-vs-quality",
      },
      {
        id: "better-quality",
        prompt: "SteadyCore keeps a 24% margin while FastGrow keeps 7%. Which looks stronger on quality?",
        options: [
          choice("a", "SteadyCore", true, ""),
          choice("b", "FastGrow", false, "growth-vs-quality", "FastGrow is the faster growth profile, not the stronger quality profile."),
          choice("c", "Both equally", false, "growth-vs-quality", "The margins are clearly different."),
        ],
        explanation: "SteadyCore looks stronger on quality because it keeps more profit from sales.",
        reviewPrompt: "growth-vs-quality",
      },
      {
        id: "same-company",
        prompt: "Do growth and quality always point to the same company?",
        options: [
          choice("a", "No — they can point to different strengths", true, ""),
          choice("b", "Yes — fast growth always means best quality", false, "growth-vs-quality", "That is exactly the mix-up this lesson is trying to stop."),
          choice("c", "Yes — quality always means fastest growth", false, "growth-vs-quality", "These are different business dimensions."),
        ],
        explanation: "Growth and quality can point to different strengths, so you have to hold both in view.",
        reviewPrompt: "growth-vs-quality",
      },
    ],
    options: [],
    explanation: "Growth and quality are useful because they are different, not interchangeable.",
    reviewPrompt: "growth-vs-quality",
  },
  "business-fundamentals-7": {
    question: "Quick metric-purpose check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "size-question",
        prompt: "Which question does market cap answer most directly?",
        options: [
          choice("a", "How big is the company?", true, ""),
          choice("b", "How much is left after costs?", false, "metric-purpose", "That belongs to profit and margin."),
          choice("c", "How fast is revenue growing?", false, "metric-purpose", "That is the growth question."),
        ],
        explanation: "Market cap is the cleanest size question.",
        reviewPrompt: "metric-purpose",
      },
      {
        id: "profit-question",
        prompt: "Which question does margin answer most directly?",
        options: [
          choice("a", "How much is left after costs?", true, ""),
          choice("b", "How big is the company?", false, "metric-purpose", "That is the size question."),
          choice("c", "What is price doing today?", false, "metric-purpose", "That is the chart lens, not the business lens."),
        ],
        explanation: "Margin is the profitability question about what survives after costs.",
        reviewPrompt: "metric-purpose",
      },
      {
        id: "growth-question",
        prompt: "Which metric family answers the sales-speed question?",
        options: [
          choice("a", "Growth metrics such as revenue growth", true, ""),
          choice("b", "Only chart patterns", false, "metric-purpose", "This question belongs to fundamentals, not only charts."),
          choice("c", "Any metric at random", false, "metric-purpose", "The whole point is to use the right metric for the right question."),
        ],
        explanation: "Revenue growth belongs to the growth question family.",
        reviewPrompt: "metric-purpose",
      },
    ],
    options: [],
    explanation: "Metric names matter less when the business question is clear first.",
    reviewPrompt: "metric-purpose",
  },
  "business-fundamentals-8": {
    question: "Quick timing check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "timing-order",
        prompt: "News changes expectations today. The revenue report comes next month. What can happen first?",
        options: [
          choice("a", "Price or expectations can move before the full report", true, ""),
          choice("b", "Nothing can move until the report arrives", false, "price-vs-business-timing", "Markets often react faster than that."),
          choice("c", "The report must always come first", false, "price-vs-business-timing", "That is too rigid for how markets work."),
        ],
        explanation: "Price and expectations can move before the full business proof arrives.",
        reviewPrompt: "price-vs-business-timing",
      },
      {
        id: "slow-part",
        prompt: "Which part often moves more slowly?",
        options: [
          choice("a", "The full business proof in later reports", true, ""),
          choice("b", "The first market reaction", false, "price-vs-business-timing", "Markets can react very quickly."),
          choice("c", "Expectations themselves", false, "price-vs-business-timing", "Expectations can shift quickly too."),
        ],
        explanation: "The slower part is often the business proof arriving in later numbers.",
        reviewPrompt: "price-vs-business-timing",
      },
    ],
    options: [],
    explanation: "Timing helps explain why price and business proof can move on different clocks.",
    reviewPrompt: "price-vs-business-timing",
  },
};

for (const [lessonId, panels] of Object.entries(normalizedSupportPanelsByLesson)) {
  const lesson = supportAndResistanceLessons[lessonId];

  if (lesson) {
    lesson.learn.panels = panels;
  }
}

for (const [lessonId, patch] of Object.entries(normalizedSupportPracticePatches)) {
  const lesson = supportAndResistanceLessons[lessonId];

  if (lesson) {
    Object.assign(lesson.practice, patch);
  }
}

for (const [lessonId, check] of Object.entries(normalizedSupportCheckPatches)) {
  const lesson = supportAndResistanceLessons[lessonId];

  if (lesson) {
    lesson.check = check;
  }
}

for (const [lessonId, panels] of Object.entries(normalizedBreakoutPanelsByLesson)) {
  const lesson = breakoutAndVolumeLessons[lessonId];

  if (lesson) {
    lesson.learn.panels = panels;
  }
}

for (const [lessonId, patch] of Object.entries(normalizedBreakoutPracticePatches)) {
  const lesson = breakoutAndVolumeLessons[lessonId];

  if (lesson) {
    Object.assign(lesson.practice, patch);
  }
}

for (const [lessonId, check] of Object.entries(normalizedBreakoutCheckPatches)) {
  const lesson = breakoutAndVolumeLessons[lessonId];

  if (lesson) {
    lesson.check = check;
  }
}

for (const [lessonId, panels] of Object.entries(normalizedBusinessPanelsByLesson)) {
  const lesson = businessFundamentalsLessons[lessonId];

  if (lesson) {
    lesson.learn.panels = panels;
  }
}

for (const [lessonId, patch] of Object.entries(normalizedBusinessPracticePatches)) {
  const lesson = businessFundamentalsLessons[lessonId];

  if (lesson) {
    Object.assign(lesson.practice, patch);
  }
}

for (const [lessonId, check] of Object.entries(normalizedBusinessCheckPatches)) {
  const lesson = businessFundamentalsLessons[lessonId];

  if (lesson) {
    lesson.check = check;
  }
}

const normalizedMarketCapPanelsByLesson: Record<string, LearnPanel[]> = {
  "market-cap-and-revenue-1": [
    panel(
      "define",
      "Market cap is the whole-company value",
      "Market cap is the value of all shares together, not the sticker on one share.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "A company trades at $24 and has 40M shares.",
          revealTitle: "What that builds",
          revealCopy: "Together that creates a $960M market cap for the whole company.",
          actionLabel: "Show me",
          highlightText: "market cap",
        },
      },
    ),
    panel(
      "builder",
      "Build the size from both inputs",
      "Move price or share count. Market cap changes when either piece changes.",
      {
        eyebrow: "See it",
        activityKind: "market-cap-board",
        activityData: { variant: "market-cap-builder", sharePrice: 24, shareCount: 40 },
        activityStartValue: 0,
      },
    ),
    panel(
      "lock",
      "One share price is not the full story",
      "A stock can look cheap or expensive per share while the whole company tells a different size story.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "A $40 share tells me the whole company size.",
          revealTitle: "Careful replacement",
          revealCopy: "The share price is only one piece. Market cap is the whole-company value.",
          actionLabel: "Show me",
          highlightText: "whole-company value",
        },
      },
    ),
  ],
  "market-cap-and-revenue-2": [
    panel(
      "compare",
      "A lower-priced stock can still be larger",
      "Compare price with share count together. Sticker price alone can fool you.",
      {
        eyebrow: "Learn",
        activityKind: "market-cap-board",
        activityData: {
          variant: "company-compare",
          companies: [
            {
              id: "low",
              name: "LowPrice Co",
              price: "$20",
              shares: "4B",
              cap: "$80B",
              note: "Low share price, but many more shares outstanding.",
            },
            {
              id: "high",
              name: "HighPrice Co",
              price: "$200",
              shares: "100M",
              cap: "$20B",
              note: "Higher share price, but a much smaller share count.",
            },
          ],
        },
        activityStartValue: 0,
      },
    ),
    panel(
      "trap",
      "Share price alone is a trap",
      "A high stock price does not automatically mean a bigger company. Share count changes the math.",
      {
        eyebrow: "Watch for",
        activityKind: "reveal-card",
        activityData: {
          statement: "The higher-priced stock must be the larger company.",
          revealTitle: "Why that fails",
          revealCopy: "Share price alone can mislead. Company size comes from the full market cap.",
          actionLabel: "Show me",
          highlightText: "can mislead",
        },
      },
    ),
  ],
  "market-cap-and-revenue-3": [
    panel(
      "define",
      "Revenue is money coming in",
      "Revenue is the sales money a business brings in before costs come out.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "A company sells more products each quarter.",
          revealTitle: "What that changes",
          revealCopy: "More sales means more revenue coming in. That is not the same thing as profit.",
          actionLabel: "Show me",
          highlightText: "revenue",
        },
      },
    ),
    panel(
      "counter",
      "More sales means more revenue",
      "Move units sold and watch the money-in number rise.",
      {
        eyebrow: "See it",
        activityKind: "business-builder",
        activityData: { variant: "revenue-counter", units: 60, pricePerUnit: 5 },
        activityStartValue: 0,
      },
    ),
    panel(
      "growth",
      "Revenue growth is sales rising over time",
      "Compare the revenue paths. One business keeps adding more sales while the other barely changes.",
      {
        eyebrow: "Compare",
        activityKind: "market-cap-board",
        activityData: {
          variant: "growth-bars",
          companies: [
            { id: "grow", name: "GrowCo", revenue: [20, 34, 48, 62], note: "Sales keep rising." },
            { id: "flat", name: "FlatCo", revenue: [40, 42, 40, 41], note: "Sales barely move." },
          ],
        },
        activityStartValue: 0,
      },
    ),
  ],
  "market-cap-and-revenue-4": [
    panel(
      "compare",
      "Size and growth are different questions",
      "A company can be bigger while another is growing faster. You need one clue for each question.",
      {
        eyebrow: "Learn",
        activityKind: "market-cap-board",
        activityData: {
          variant: "company-compare",
          companies: [
            {
              id: "alpha",
              name: "Alpha",
              price: "$82",
              shares: "1B",
              cap: "$82B",
              growth: "Growth 10%",
              note: "Larger market cap, slower sales growth.",
            },
            {
              id: "beta",
              name: "Beta",
              price: "$42",
              shares: "300M",
              cap: "$12.6B",
              growth: "Growth 24%",
              note: "Smaller market cap, faster sales growth.",
            },
          ],
        },
        activityStartValue: 0,
      },
    ),
    panel(
      "lock",
      "Do not force one metric to do both jobs",
      "Market cap answers the size question. Revenue growth answers the speed question.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "One number should tell me both size and growth.",
          revealTitle: "Cleaner read",
          revealCopy: "Size and growth are different questions, so they need different metrics.",
          actionLabel: "Show me",
          highlightText: "different questions",
        },
      },
    ),
  ],
  "market-cap-and-revenue-5": [
    panel(
      "profiles",
      "Mature and expanding look different",
      "A mature business is often bigger and steadier. An expanding business is often smaller and growing faster.",
      {
        eyebrow: "Learn",
        activityKind: "market-cap-board",
        activityData: {
          variant: "company-compare",
          companies: [
            {
              id: "mature",
              name: "SteadyCorp",
              price: "$92",
              shares: "1B",
              cap: "$92B",
              growth: "Growth 9%",
              note: "Larger scale, slower sales growth.",
              context: "Mature profile",
            },
            {
              id: "expanding",
              name: "ExpandCo",
              price: "$40",
              shares: "350M",
              cap: "$14B",
              growth: "Growth 30%",
              note: "Smaller scale, faster sales growth.",
              context: "Expanding profile",
            },
          ],
        },
        activityStartValue: 0,
      },
    ),
    panel(
      "careful",
      "Different profile does not mean automatic winner",
      "The lesson is to read the profile cleanly first, not to force one profile to win every time.",
      {
        eyebrow: "Watch for",
        activityKind: "reveal-card",
        activityData: {
          statement: "Mature is always better than expanding.",
          revealTitle: "Careful replacement",
          revealCopy: "Mature and expanding are different profiles. Read the tradeoffs before making a verdict.",
          actionLabel: "Show me",
          highlightText: "different profiles",
        },
      },
    ),
  ],
  "market-cap-and-revenue-6": [
    panel(
      "compare",
      "Positive growth can still be slowing",
      "Look at the size of each step, not just whether sales are still rising.",
      {
        eyebrow: "Learn",
        activityKind: "market-cap-board",
        activityData: {
          variant: "growth-bars",
          companies: [
            { id: "slow", name: "SlowCo", revenue: [24, 38, 48, 54], note: "Still up, but each step is smaller." },
            { id: "fast", name: "FastCo", revenue: [24, 36, 52, 72], note: "Each step is larger than the last." },
          ],
        },
        activityStartValue: 0,
      },
    ),
    panel(
      "lock",
      "Up does not always mean speeding up",
      "A company can keep growing while the growth rate cools down.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "Sales are still rising, so growth must be accelerating.",
          revealTitle: "Careful replacement",
          revealCopy: "Look at each jump. If the jumps get smaller, growth is slowing even while sales still rise.",
          actionLabel: "Show me",
          highlightText: "growth is slowing",
        },
      },
    ),
  ],
  "market-cap-and-revenue-7": [
    panel(
      "mindset",
      "Bigger is not automatic safety",
      "Large company size can help, but it never removes every risk.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "Big market cap means the stock is safe.",
          revealTitle: "Careful replacement",
          revealCopy: "Large size is one clue. It does not erase growth risk, quality risk, or valuation risk.",
          actionLabel: "Show me",
          highlightText: "one clue",
        },
      },
    ),
    panel(
      "checklist",
      "Use size as context, not as a verdict",
      "A careful read keeps size in the picture without turning it into a guarantee.",
      {
        eyebrow: "See it",
        activityKind: "checklist",
        activityData: {
          items: ["Size can help", "Risk can still stay", "Avoid always-safe language"],
        },
      },
    ),
  ],
  "market-cap-and-revenue-8": [
    panel(
      "compare",
      "Fast growth still needs quality context",
      "A business can grow quickly while still keeping very little profit from those sales.",
      {
        eyebrow: "Learn",
        activityKind: "business-builder",
        activityData: {
          variant: "margin-compare",
          companies: [
            {
              id: "fast",
              name: "FastGrow",
              revenue: "Growth 32%",
              profit: "Margin 7%",
              margin: "7% kept",
              note: "Fast sales growth, but thin profits.",
            },
            {
              id: "steady",
              name: "SteadyCore",
              revenue: "Growth 12%",
              profit: "Margin 24%",
              margin: "24% kept",
              note: "Slower sales growth, but stronger quality.",
            },
          ],
        },
        activityStartValue: 0,
      },
    ),
    panel(
      "lock",
      "Fast growth is not the whole story",
      "The careful read asks what supports that growth and what the tradeoffs look like.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "Faster growth is automatically better.",
          revealTitle: "Careful replacement",
          revealCopy: "Fast growth still needs margin, durability, and quality context before it deserves a verdict.",
          actionLabel: "Show me",
          highlightText: "needs margin",
        },
      },
    ),
  ],
  "market-cap-and-revenue-9": [
    panel(
      "compare",
      "Start with one size clue and one growth clue",
      "You do not need every metric for a first comparison. Start with who is bigger and who is growing faster.",
      {
        eyebrow: "Learn",
        activityKind: "market-cap-board",
        activityData: {
          variant: "company-compare",
          companies: [
            {
              id: "alpha",
              name: "Alpha",
              price: "$76",
              shares: "1.2B",
              cap: "$91.2B",
              growth: "Growth 9%",
              note: "Larger market cap profile.",
            },
            {
              id: "beta",
              name: "Beta",
              price: "$44",
              shares: "280M",
              cap: "$12.3B",
              growth: "Growth 26%",
              note: "Faster sales growth profile.",
            },
          ],
        },
        activityStartValue: 0,
      },
    ),
    panel(
      "sequence",
      "Use a simple comparison order",
      "Read size first, growth next, then ask what still needs context.",
      {
        eyebrow: "Method",
        activityKind: "sequence-lab",
        activityData: {
          orderedSteps: [
            { id: "size", label: "Check who is bigger", description: "Use market cap for company size." },
            { id: "growth", label: "Check who is growing faster", description: "Use revenue growth for business speed." },
            { id: "context", label: "Ask what still needs context", description: "Do not stop at the first two clues." },
          ],
          steps: [
            "Check who is bigger",
            "Check who is growing faster",
            "Ask what still needs context",
          ],
          distractors: ["Use share price alone"],
        },
      },
    ),
  ],
  "market-cap-and-revenue-10": [
    panel(
      "boss-setup",
      "Separate size, price, and growth under pressure",
      "This checkpoint makes you keep market cap, share price, and revenue growth in their own lanes.",
      {
        eyebrow: "Boss setup",
        activityKind: "market-cap-board",
        activityData: {
          variant: "company-compare",
          companies: [
            { id: "alpha", name: "Alpha", price: "$88", shares: "1.1B", cap: "$96.8B", growth: "Growth 9%", note: "Large and steadier." },
            { id: "beta", name: "Beta", price: "$42", shares: "280M", cap: "$11.8B", growth: "Growth 26%", note: "Smaller and faster-growing." },
            { id: "gamma", name: "Gamma", price: "$58", shares: "700M", cap: "$40.6B", growth: "Growth 15%", note: "Middle profile." },
          ],
        },
        activityStartValue: 0,
      },
    ),
    panel(
      "boss-rule",
      "Wrong reads send the checkpoint back",
      "Boss steps only turn green after a correct solve. A weak read sends the sequence back one step.",
      {
        eyebrow: "Pressure rule",
        activityKind: "reveal-card",
        activityData: {
          statement: "Boss progress is earned, not clicked.",
          revealTitle: "What changes here",
          revealCopy: "A wrong read sends you back one step until the size-and-growth logic is locked in again.",
          actionLabel: "Show the rule",
          highlightText: "back one step",
        },
      },
    ),
  ],
};

const normalizedMarketCapPracticePatches: Record<string, Partial<PracticeContent>> = {
  "market-cap-and-revenue-1": {
    ...activityOnlyPracticePatch("Sort every clue first"),
    mechanicTitle: "Size clue sort",
    mechanicSummary: "Separate whole-company size clues from one-piece clues.",
    prompt: "Place each clue into the right bucket.",
    explanation: "Right. Market cap is the total value of all shares together.",
    activityKind: "bucket-sort",
    supportActivities: ["Look for the whole-company lens.", "Reject one-piece shortcuts.", "Keep size separate from quality."],
    activityData: {
      buckets: ["Size clue", "Not enough alone"],
      cards: [
        { id: "cap", label: "Total market value of all shares", target: "Size clue" },
        { id: "price", label: "One share price", target: "Not enough alone" },
        { id: "shares", label: "Share count by itself", target: "Not enough alone" },
      ],
    },
  },
  "market-cap-and-revenue-2": {
    ...activityOnlyPracticePatch("Sort every clue first"),
    mechanicTitle: "Price trap filter",
    mechanicSummary: "Separate clean size logic from sticker-price traps.",
    prompt: "Place each clue into the right bucket.",
    explanation: "Right. Share price alone is the trap. Market cap is the cleaner size read.",
    activityKind: "bucket-sort",
    supportActivities: ["Treat share price carefully.", "Use share count too.", "Read market cap for size."],
    activityData: {
      buckets: ["Helps with size", "Price trap"],
      cards: [
        { id: "cap", label: "Market cap", target: "Helps with size" },
        { id: "price-only", label: "Share price alone", target: "Price trap" },
        { id: "price-plus-shares", label: "Price plus share count", target: "Helps with size" },
        { id: "cheap-small", label: "Cheap-looking means small", target: "Price trap" },
      ],
    },
  },
  "market-cap-and-revenue-3": {
    ...activityOnlyPracticePatch("Sort every clue first"),
    mechanicTitle: "Revenue-growth sorter",
    mechanicSummary: "Separate sales growth clues from unrelated stock or profit clues.",
    prompt: "Place each card into revenue growth or not.",
    explanation: "Right. Revenue growth is about sales rising over time.",
    activityKind: "bucket-sort",
    supportActivities: ["Stay on the business lens.", "Use sales, not stock price.", "Keep revenue separate from profit."],
    activityData: {
      buckets: ["Revenue growth", "Not revenue growth"],
      cards: [
        { id: "sales-up", label: "Sales rise from 20 to 30 to 42", target: "Revenue growth" },
        { id: "units-up", label: "More units sold each quarter", target: "Revenue growth" },
        { id: "profit", label: "Profit improves while sales stay flat", target: "Not revenue growth" },
        { id: "stock", label: "Share price jumps today", target: "Not revenue growth" },
      ],
    },
  },
  "market-cap-and-revenue-4": {
    ...activityOnlyPracticePatch("Sort every clue first"),
    mechanicTitle: "Size vs growth sorter",
    mechanicSummary: "Keep company size and company growth in separate buckets.",
    prompt: "Place each clue into the right bucket.",
    explanation: "Right. Size and growth are related, but they are not the same question.",
    activityKind: "bucket-sort",
    supportActivities: ["Name the question first.", "Then match the metric.", "Keep size and growth separate."],
    activityData: {
      buckets: ["Size", "Growth", "Both"],
      cards: [
        { id: "cap", label: "Market cap", target: "Size" },
        { id: "rev-growth", label: "Revenue growth", target: "Growth" },
        { id: "both", label: "A big company growing sales quickly", target: "Both" },
      ],
    },
  },
  "market-cap-and-revenue-5": {
    ...activityOnlyPracticePatch("Sort every profile first"),
    mechanicTitle: "Profile sorting board",
    mechanicSummary: "Separate mature business clues from expanding business clues.",
    prompt: "Place each clue into the matching profile.",
    explanation: "Right. Mature and expanding are different profiles, not automatic winners.",
    activityKind: "bucket-sort",
    supportActivities: ["Read scale clues.", "Read growth clues.", "Match the profile without overclaiming."],
    activityData: {
      buckets: ["Mature profile", "Expanding profile"],
      cards: [
        { id: "large-slow", label: "Large market cap, slower sales growth", target: "Mature profile" },
        { id: "small-fast", label: "Smaller market cap, faster sales growth", target: "Expanding profile" },
        { id: "steady", label: "Steadier business profile", target: "Mature profile" },
        { id: "earlier", label: "Earlier-stage growth profile", target: "Expanding profile" },
      ],
    },
  },
  "market-cap-and-revenue-6": {
    ...activityOnlyPracticePatch("Sort every growth path first"),
    mechanicTitle: "Growth-speed sorter",
    mechanicSummary: "Separate slowing growth from accelerating growth.",
    prompt: "Place each clue into the right growth bucket.",
    explanation: "Right. Still rising and speeding up are not the same thing.",
    activityKind: "bucket-sort",
    supportActivities: ["Look at each jump.", "Compare whether jumps shrink or grow.", "Do not stop at 'still rising'."],
    activityData: {
      buckets: ["Growth slowing", "Growth accelerating"],
      cards: [
        { id: "slow-steps", label: "20 -> 30 -> 38 -> 42", target: "Growth slowing" },
        { id: "small-jumps", label: "Still up, but each jump is smaller", target: "Growth slowing" },
        { id: "fast-steps", label: "20 -> 30 -> 46 -> 68", target: "Growth accelerating" },
        { id: "bigger-jumps", label: "Each jump gets larger than the last", target: "Growth accelerating" },
      ],
    },
  },
  "market-cap-and-revenue-7": {
    ...activityOnlyPracticePatch("Sort every statement first"),
    mechanicTitle: "Careful size language",
    mechanicSummary: "Separate careful size interpretation from absolute safety claims.",
    prompt: "Place each statement into the right bucket.",
    explanation: "Right. Company size can help, but it never removes every risk.",
    activityKind: "bucket-sort",
    supportActivities: ["Avoid always-safe language.", "Keep size as context.", "Reject blanket safety claims."],
    activityData: {
      buckets: ["Careful", "Careless"],
      cards: [
        { id: "careful-1", label: "Large size can help, but it is not automatic safety.", target: "Careful" },
        { id: "careless-1", label: "Big market cap means no risk.", target: "Careless" },
        { id: "careful-2", label: "Size is one clue, not the whole verdict.", target: "Careful" },
        { id: "careless-2", label: "Large companies are always safe.", target: "Careless" },
      ],
    },
  },
  "market-cap-and-revenue-8": {
    ...activityOnlyPracticePatch("Sort every statement first"),
    mechanicTitle: "Growth-context sorter",
    mechanicSummary: "Separate careful growth reads from overconfident growth claims.",
    prompt: "Place each statement into the right bucket.",
    explanation: "Right. Fast growth can matter without automatically settling the verdict.",
    activityKind: "bucket-sort",
    supportActivities: ["Start with growth.", "Add margin and quality context.", "Reject automatic verdict language."],
    activityData: {
      buckets: ["Needs more context", "Overreach"],
      cards: [
        { id: "context-1", label: "Fast growth with thin margins", target: "Needs more context" },
        { id: "context-2", label: "Ask what supports the growth", target: "Needs more context" },
        { id: "over-1", label: "Faster growth is automatically better", target: "Overreach" },
        { id: "over-2", label: "Growth alone settles the decision", target: "Overreach" },
      ],
    },
  },
  "market-cap-and-revenue-9": {
    ...activityOnlyPracticePatch("Finish the order first"),
    mechanicTitle: "Comparison sequence",
    mechanicSummary: "Use a clean order when comparing two companies for the first time.",
    prompt: "Build the simplest useful comparison sequence.",
    explanation: "Right. Start with size, then growth, then ask what is still missing.",
    activityKind: "sequence-lab",
    supportActivities: ["Check size first.", "Check growth next.", "Leave room for follow-up questions."],
    activityData: {
      orderedSteps: [
        { id: "size", label: "Read company size", description: "Use market cap first." },
        { id: "growth", label: "Read business growth", description: "Use revenue growth second." },
        { id: "context", label: "Ask what still needs context", description: "Do not stop too early." },
      ],
      steps: ["Read company size", "Read business growth", "Ask what still needs context"],
      distractors: ["Use share price alone"],
    },
  },
};

const normalizedMarketCapCheckPatches: Record<string, CheckContent> = {
  "market-cap-and-revenue-1": {
    question: "Quick market-cap check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "definition",
        prompt: "What does market cap describe most directly?",
        options: [
          choice("a", "The total market value of all shares together", true, ""),
          choice("b", "Only the price of one share", false, "market-cap-basics", "That misses the rest of the company."),
          choice("c", "Guaranteed company quality", false, "market-cap-basics", "Market cap is a size metric, not a quality guarantee."),
        ],
        explanation: "Market cap is the whole-company market value of all shares together.",
        reviewPrompt: "market-cap-basics",
      },
      {
        id: "inputs",
        prompt: "Which two pieces build market cap?",
        options: [
          choice("a", "Share price and share count", true, ""),
          choice("b", "Share price and logo quality", false, "market-cap-basics", "Logo quality is not part of the math."),
          choice("c", "Revenue and dividends", false, "market-cap-basics", "Those are different business concepts."),
        ],
        explanation: "Market cap comes from share price multiplied by share count.",
        reviewPrompt: "market-cap-basics",
      },
    ],
    options: [],
    explanation: "Use the whole-company lens, not just one share.",
    reviewPrompt: "market-cap-basics",
  },
  "market-cap-and-revenue-2": {
    question: "Quick price-trap check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "larger-company",
        prompt: "A $20 stock has a much larger market cap than a $200 stock. Which company is larger?",
        options: [
          choice("a", "The $20 stock with the larger market cap", true, ""),
          choice("b", "The $200 stock automatically", false, "share-price-misleading", "Share price alone is the trap here."),
          choice("c", "You cannot know at all", false, "share-price-misleading", "You can know once market cap is shown."),
        ],
        explanation: "The larger company is the one with the larger market cap, even if its share price is lower.",
        reviewPrompt: "share-price-misleading",
      },
      {
        id: "missing-piece",
        prompt: "What makes share price alone weak for size comparisons?",
        options: [
          choice("a", "It ignores the share count", true, ""),
          choice("b", "It ignores the logo color", false, "share-price-misleading", "That does not answer the size question."),
          choice("c", "It automatically includes market cap", false, "share-price-misleading", "Share price does not include the whole-company math by itself."),
        ],
        explanation: "Share count is the missing piece that keeps sticker price from telling the whole size story.",
        reviewPrompt: "share-price-misleading",
      },
    ],
    options: [],
    explanation: "Keep share price and company size in different buckets.",
    reviewPrompt: "share-price-misleading",
  },
  "market-cap-and-revenue-3": {
    question: "Quick revenue-growth check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "definition",
        prompt: "What does revenue growth mean most directly?",
        options: [
          choice("a", "Sales are rising over time", true, ""),
          choice("b", "Profit is automatically higher", false, "revenue-growth", "Revenue is money in, not automatic profit."),
          choice("c", "The stock price rose today", false, "revenue-growth", "That is the market lens, not the sales lens."),
        ],
        explanation: "Revenue growth means the business is bringing in more sales over time.",
        reviewPrompt: "revenue-growth",
      },
      {
        id: "revenue-vs-profit",
        prompt: "Revenue is best described as what?",
        options: [
          choice("a", "Money from sales before costs come out", true, ""),
          choice("b", "What is left after costs", false, "revenue-growth", "That is closer to profit."),
          choice("c", "Guaranteed stock performance", false, "revenue-growth", "Revenue is a business metric, not a stock guarantee."),
        ],
        explanation: "Revenue is money coming in from sales before costs are removed.",
        reviewPrompt: "revenue-growth",
      },
    ],
    options: [],
    explanation: "Stay on the business-sales lens.",
    reviewPrompt: "revenue-growth",
  },
  "market-cap-and-revenue-4": {
    question: "Quick size-vs-growth check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "size-question",
        prompt: "Which metric answers the company-size question?",
        options: [
          choice("a", "Market cap", true, ""),
          choice("b", "Revenue growth", false, "size-vs-growth", "That is the growth question."),
          choice("c", "Share price alone", false, "size-vs-growth", "That is not the clean size metric."),
        ],
        explanation: "Market cap is the size question.",
        reviewPrompt: "size-vs-growth",
      },
      {
        id: "growth-question",
        prompt: "Which metric answers the business-growth question?",
        options: [
          choice("a", "Revenue growth", true, ""),
          choice("b", "Market cap", false, "size-vs-growth", "That answers size instead."),
          choice("c", "Any metric equally", false, "size-vs-growth", "Different metrics answer different questions."),
        ],
        explanation: "Revenue growth is the business-speed question.",
        reviewPrompt: "size-vs-growth",
      },
      {
        id: "same-company",
        prompt: "Can the bigger company and the faster grower be different companies?",
        options: [
          choice("a", "Yes — those are different questions", true, ""),
          choice("b", "No — the bigger company must also grow faster", false, "size-vs-growth", "That merges two different dimensions."),
          choice("c", "No — growth makes size irrelevant", false, "size-vs-growth", "Both dimensions can matter at once."),
        ],
        explanation: "The bigger company and the faster grower can absolutely be different companies.",
        reviewPrompt: "size-vs-growth",
      },
    ],
    options: [],
    explanation: "Keep company size and company growth in separate lanes.",
    reviewPrompt: "size-vs-growth",
  },
  "market-cap-and-revenue-5": {
    question: "Quick profile check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "mature-profile",
        prompt: "Which profile sounds more mature?",
        options: [
          choice("a", "Bigger scale with slower sales growth", true, ""),
          choice("b", "Smaller scale with very fast sales growth", false, "mature-vs-expanding", "That sounds more like the expanding profile."),
          choice("c", "Any lower share price", false, "mature-vs-expanding", "Share price alone does not define the profile."),
        ],
        explanation: "The mature profile is usually bigger and steadier here.",
        reviewPrompt: "mature-vs-expanding",
      },
      {
        id: "expanding-profile",
        prompt: "Which clue fits the expanding profile better?",
        options: [
          choice("a", "Smaller scale with faster sales growth", true, ""),
          choice("b", "Large cap with slow growth", false, "mature-vs-expanding", "That leans mature instead."),
          choice("c", "Guaranteed winner", false, "mature-vs-expanding", "The lesson is about describing the profile, not crowning an automatic winner."),
        ],
        explanation: "The expanding profile is smaller and growing faster in this lesson.",
        reviewPrompt: "mature-vs-expanding",
      },
    ],
    options: [],
    explanation: "Read the profile cleanly before you decide what to do with it.",
    reviewPrompt: "mature-vs-expanding",
  },
  "market-cap-and-revenue-6": {
    question: "Quick growth-speed check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "slowing",
        prompt: "Sales are still rising, but each jump gets smaller. What happened?",
        options: [
          choice("a", "Growth is slowing", true, ""),
          choice("b", "Growth is accelerating", false, "growth-rate-change", "Smaller jumps mean the speed is cooling."),
          choice("c", "Growth stopped completely", false, "growth-rate-change", "Sales are still rising in this case."),
        ],
        explanation: "Growth can stay positive while the growth rate slows down.",
        reviewPrompt: "growth-rate-change",
      },
      {
        id: "accelerating",
        prompt: "Each revenue jump gets bigger than the one before. What does that suggest?",
        options: [
          choice("a", "Growth is accelerating", true, ""),
          choice("b", "Growth is slowing", false, "growth-rate-change", "Bigger jumps mean the speed is increasing."),
          choice("c", "Size got larger automatically", false, "growth-rate-change", "Size and growth rate are different reads."),
        ],
        explanation: "Bigger jumps suggest the growth rate is accelerating.",
        reviewPrompt: "growth-rate-change",
      },
    ],
    options: [],
    explanation: "Read the speed of the jumps, not just the direction.",
    reviewPrompt: "growth-rate-change",
  },
  "market-cap-and-revenue-7": {
    question: "Quick safety-language check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "careful",
        prompt: "Which statement is more careful?",
        options: [
          choice("a", "Large size can help, but it is not automatic safety", true, ""),
          choice("b", "Big market cap means no risk", false, "size-not-safety", "That is too absolute."),
          choice("c", "Size never matters at all", false, "size-not-safety", "That throws away a useful clue."),
        ],
        explanation: "The careful statement leaves room for remaining risk.",
        reviewPrompt: "size-not-safety",
      },
      {
        id: "what-size-does",
        prompt: "What is the healthier role for company size?",
        options: [
          choice("a", "One clue in the broader read", true, ""),
          choice("b", "A final safety verdict", false, "size-not-safety", "That is the exact shortcut to avoid."),
          choice("c", "A reason to ignore all other risk", false, "size-not-safety", "Other risk can still matter."),
        ],
        explanation: "Company size works better as context than as a blanket verdict.",
        reviewPrompt: "size-not-safety",
      },
    ],
    options: [],
    explanation: "Keep size in the clue bucket, not the guarantee bucket.",
    reviewPrompt: "size-not-safety",
  },
  "market-cap-and-revenue-8": {
    question: "Quick growth-context check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "careful-growth",
        prompt: "Which statement is more careful?",
        options: [
          choice("a", "Fast growth still needs margin and quality context", true, ""),
          choice("b", "Fast growth is automatically better", false, "growth-not-automatically-better", "That skips the context this lesson is building."),
          choice("c", "Growth never matters", false, "growth-not-automatically-better", "Growth still matters. It just is not the whole story."),
        ],
        explanation: "Fast growth is useful, but it still needs business context around it.",
        reviewPrompt: "growth-not-automatically-better",
      },
      {
        id: "missing-context",
        prompt: "What extra question helps the most after seeing fast growth?",
        options: [
          choice("a", "What quality or margin supports it?", true, ""),
          choice("b", "What is the logo color?", false, "growth-not-automatically-better", "That is not useful business context."),
          choice("c", "No more questions are needed", false, "growth-not-automatically-better", "That is the shallow read to avoid."),
        ],
        explanation: "Quality and margin help explain whether fast growth is actually strong.",
        reviewPrompt: "growth-not-automatically-better",
      },
    ],
    options: [],
    explanation: "Treat fast growth as a clue that opens questions, not ends them.",
    reviewPrompt: "growth-not-automatically-better",
  },
  "market-cap-and-revenue-9": {
    question: "Quick company-compare check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "bigger",
        prompt: "Which clue answers who is bigger?",
        options: [
          choice("a", "Market cap", true, ""),
          choice("b", "Revenue growth", false, "company-comparison", "That answers who is growing faster instead."),
          choice("c", "Share price alone", false, "company-comparison", "That is not the clean size answer."),
        ],
        explanation: "Market cap is the size comparison.",
        reviewPrompt: "company-comparison",
      },
      {
        id: "faster-grower",
        prompt: "Which clue answers who is growing faster?",
        options: [
          choice("a", "Revenue growth", true, ""),
          choice("b", "Market cap", false, "company-comparison", "That answers size instead."),
          choice("c", "Price alone", false, "company-comparison", "That is not a growth metric."),
        ],
        explanation: "Revenue growth is the cleaner growth comparison.",
        reviewPrompt: "company-comparison",
      },
      {
        id: "first-comparison",
        prompt: "What is a clean beginner comparison sentence?",
        options: [
          choice("a", "One company can be larger while the other grows faster", true, ""),
          choice("b", "The higher share price tells you everything", false, "company-comparison", "That repeats the size shortcut the module is fixing."),
          choice("c", "You cannot compare anything at all", false, "company-comparison", "You can still make a clean first comparison."),
        ],
        explanation: "A beginner comparison can be useful when it keeps size and growth in the right roles.",
        reviewPrompt: "company-comparison",
      },
    ],
    options: [],
    explanation: "Start simple: size, growth, then missing context.",
    reviewPrompt: "company-comparison",
  },
};

for (const [lessonId, panels] of Object.entries(normalizedMarketCapPanelsByLesson)) {
  const lesson = marketCapAndRevenueLessons[lessonId];

  if (lesson) {
    lesson.learn.panels = panels;
  }
}

for (const [lessonId, patch] of Object.entries(normalizedMarketCapPracticePatches)) {
  const lesson = marketCapAndRevenueLessons[lessonId];

  if (lesson) {
    Object.assign(lesson.practice, patch);
  }
}

for (const [lessonId, check] of Object.entries(normalizedMarketCapCheckPatches)) {
  const lesson = marketCapAndRevenueLessons[lessonId];

  if (lesson) {
    lesson.check = check;
  }
}

const normalizedEpsPanelsByLesson: Record<string, LearnPanel[]> = {
  "eps-and-pe-ratios-1": [
    panel(
      "define",
      "EPS means earnings per share",
      "EPS asks how much profit belongs to each share after the earnings are spread across all shares.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "A company earns profit, then spreads it across its shares.",
          revealTitle: "What that creates",
          revealCopy: "That creates earnings per share, or EPS.",
          actionLabel: "Show me",
          highlightText: "EPS",
        },
      },
    ),
    panel(
      "builder",
      "Spread one earnings pile across the shares",
      "Keep total earnings fixed and watch the per-share figure update.",
      {
        eyebrow: "See it",
        activityKind: "ratio-builder",
        activityData: { variant: "eps-builder", earnings: 120, shares: 20 },
        activityStartValue: 0,
      },
    ),
  ],
  "eps-and-pe-ratios-2": [
    panel(
      "builder",
      "More shares changes the per-share slice",
      "Hold earnings steady and change the share count. EPS moves because the denominator moves.",
      {
        eyebrow: "Learn",
        activityKind: "ratio-builder",
        activityData: { variant: "eps-builder", earnings: 120, shares: 20 },
        activityStartValue: 0,
      },
    ),
    panel(
      "lock",
      "More shares can dilute EPS",
      "If the same earnings are spread across more shares, each share gets a smaller slice.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "Same earnings, more shares, same EPS.",
          revealTitle: "Careful replacement",
          revealCopy: "Same earnings spread across more shares usually means lower EPS.",
          actionLabel: "Show me",
          highlightText: "lower EPS",
        },
      },
    ),
  ],
  "eps-and-pe-ratios-3": [
    panel(
      "define",
      "P/E compares price to earnings",
      "P/E asks how much price you are paying relative to each dollar of earnings.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "A stock has a price and an EPS number.",
          revealTitle: "What the ratio asks",
          revealCopy: "P/E compares the stock price to earnings per share.",
          actionLabel: "Show me",
          highlightText: "P/E",
        },
      },
    ),
    panel(
      "builder",
      "Move price or EPS and watch the ratio change",
      "The ratio updates when price changes, and it also updates when earnings change.",
      {
        eyebrow: "See it",
        activityKind: "ratio-builder",
        activityData: { variant: "pe-builder", price: 40, eps: 4 },
        activityStartValue: 0,
      },
    ),
    panel(
      "lock",
      "The ratio is a tool, not a verdict",
      "P/E is useful because it compares two numbers cleanly. The interpretation comes later.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "The ratio alone tells me the full story.",
          revealTitle: "Careful replacement",
          revealCopy: "P/E is a ratio first. The verdict still needs business and expectation context.",
          actionLabel: "Show me",
          highlightText: "ratio first",
        },
      },
    ),
  ],
  "eps-and-pe-ratios-4": [
    panel(
      "compare",
      "A higher P/E can come with stronger expectations",
      "Compare the valuation cases. The richer ratio can reflect a bigger growth or quality story.",
      {
        eyebrow: "Learn",
        activityKind: "ratio-builder",
        activityData: {
          variant: "valuation-compare",
          companies: [
            {
              id: "rich",
              name: "FastGrow",
              price: "$60",
              eps: "$2",
              pe: "30x",
              sector: "Software",
              context: "Higher expectations",
              note: "The market is paying more because it expects stronger future growth.",
            },
            {
              id: "steady",
              name: "SteadySoft",
              price: "$40",
              eps: "$4",
              pe: "10x",
              sector: "Software",
              context: "Lower expectations",
              note: "The cheaper ratio may reflect a steadier but slower growth story.",
            },
          ],
        },
        activityStartValue: 0,
      },
    ),
    panel(
      "lock",
      "Higher is not automatically bad",
      "A higher P/E can be expensive, but it can also reflect stronger expectations. The ratio needs context.",
      {
        eyebrow: "Watch for",
        activityKind: "reveal-card",
        activityData: {
          statement: "A higher P/E is always bad.",
          revealTitle: "Careful replacement",
          revealCopy: "A higher P/E can reflect stronger expectations, so you still need context before judging it.",
          actionLabel: "Show me",
          highlightText: "stronger expectations",
        },
      },
    ),
  ],
  "eps-and-pe-ratios-5": [
    panel(
      "compare",
      "A lower P/E can come with weaker expectations",
      "Compare the valuation cases. The cheaper-looking ratio may still reflect caution about the business.",
      {
        eyebrow: "Learn",
        activityKind: "ratio-builder",
        activityData: {
          variant: "valuation-compare",
          companies: [
            {
              id: "cheap",
              name: "SlowLine",
              price: "$24",
              eps: "$4",
              pe: "6x",
              sector: "Retail",
              context: "Lower expectations",
              note: "The ratio looks cheap, but the market may be worried about slower growth.",
            },
            {
              id: "balanced",
              name: "CoreRetail",
              price: "$40",
              eps: "$4",
              pe: "10x",
              sector: "Retail",
              context: "Cleaner context",
              note: "The higher ratio can reflect steadier expectations or better business quality.",
            },
          ],
        },
        activityStartValue: 0,
      },
    ),
    panel(
      "lock",
      "Lower is not automatically good",
      "A lower P/E may be an opportunity, but it may also be a warning about weaker expectations or lower quality.",
      {
        eyebrow: "Watch for",
        activityKind: "reveal-card",
        activityData: {
          statement: "A lower P/E is always good.",
          revealTitle: "Careful replacement",
          revealCopy: "A lower P/E may reflect weak expectations, so you still need to ask why it is lower.",
          actionLabel: "Show me",
          highlightText: "ask why",
        },
      },
    ),
  ],
  "eps-and-pe-ratios-6": [
    panel(
      "define",
      "Sector context makes some P/E comparisons cleaner",
      "A ratio comparison works better when the companies come from a similar business context.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "Compare any two P/E ratios and the answer is equally useful.",
          revealTitle: "Cleaner comparison",
          revealCopy: "A P/E comparison is usually cleaner inside a similar sector with similar economics.",
          actionLabel: "Show me",
          highlightText: "similar sector",
        },
      },
    ),
    panel(
      "checklist",
      "Use a cleaner comparison checklist",
      "The comparison gets better when the businesses share industry context, similar economics, and similar expectations.",
      {
        eyebrow: "See it",
        activityKind: "checklist",
        activityData: {
          items: ["Same industry?", "Similar economics?", "Comparable expectations?"],
        },
      },
    ),
  ],
  "eps-and-pe-ratios-7": [
    panel(
      "builder",
      "P/E moves when earnings move",
      "Keep price steady and change earnings. The ratio is dynamic because both sides can move.",
      {
        eyebrow: "Learn",
        activityKind: "ratio-builder",
        activityData: { variant: "pe-builder", price: 40, eps: 4 },
        activityStartValue: 0,
      },
    ),
    panel(
      "lock",
      "Stronger earnings can lower the ratio",
      "If price stays steady while earnings improve, the price-to-earnings ratio can fall.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "P/E only changes when price changes.",
          revealTitle: "Careful replacement",
          revealCopy: "P/E changes when price changes, and it also changes when EPS changes.",
          actionLabel: "Show me",
          highlightText: "EPS changes",
        },
      },
    ),
  ],
  "eps-and-pe-ratios-8": [
    panel(
      "separate",
      "Price, revenue, and EPS answer different questions",
      "These numbers live in different buckets. One is the stock price, one is business sales, and one is profit per share.",
      {
        eyebrow: "Learn",
        activityKind: "business-builder",
        activityData: {
          sections: [
            { label: "Price", value: "What one share trades for" },
            { label: "Revenue", value: "Business sales coming in" },
            { label: "EPS", value: "Profit per share" },
          ],
        },
        activityStartValue: 0,
      },
    ),
    panel(
      "lock",
      "Keep the metrics in separate lanes",
      "Price is not revenue. Revenue is not EPS. Cleaner thinking starts by separating the questions.",
      {
        eyebrow: "Lock-in",
        activityKind: "reveal-card",
        activityData: {
          statement: "Price, revenue, and EPS all tell me the same thing.",
          revealTitle: "Careful replacement",
          revealCopy: "Price, revenue, and EPS each answer a different question, so they should stay in different buckets.",
          actionLabel: "Show me",
          highlightText: "different question",
        },
      },
    ),
  ],
  "eps-and-pe-ratios-9": [
    panel(
      "mindset",
      "Use P/E as context, not as a final verdict",
      "The ratio is strongest when it helps you ask better questions about growth, quality, and expectations.",
      {
        eyebrow: "Learn",
        activityKind: "reveal-card",
        activityData: {
          statement: "P/E alone gives the final answer.",
          revealTitle: "Careful replacement",
          revealCopy: "P/E is one valuation clue. The final read still needs business and expectation context.",
          actionLabel: "Show me",
          highlightText: "one valuation clue",
        },
      },
    ),
    panel(
      "compare",
      "The same ratio can still need different context",
      "Tap the cases and notice how the same valuation number can sit beside different growth or sector stories.",
      {
        eyebrow: "See it",
        activityKind: "ratio-builder",
        activityData: {
          variant: "valuation-compare",
          companies: [
            {
              id: "growth",
              name: "FastCloud",
              price: "$60",
              eps: "$3",
              pe: "20x",
              sector: "Software",
              context: "Growth story",
              note: "The same 20x ratio can sit beside stronger growth expectations.",
            },
            {
              id: "slow",
              name: "OldPower",
              price: "$40",
              eps: "$2",
              pe: "20x",
              sector: "Utilities",
              context: "Different sector",
              note: "The same 20x ratio can still mean something different in a different business context.",
            },
          ],
        },
        activityStartValue: 0,
      },
    ),
  ],
  "eps-and-pe-ratios-10": [
    panel(
      "boss-setup",
      "Keep per-share logic and valuation logic separate",
      "This checkpoint makes you hold EPS, P/E, expectations, and missing context in one clean read.",
      {
        eyebrow: "Boss setup",
        activityKind: "ratio-builder",
        activityData: {
          variant: "valuation-compare",
          companies: [
            { id: "alpha", name: "Alpha", price: "$52", eps: "$4", pe: "13x", sector: "Software", context: "Balanced", note: "Mid-range ratio with steadier context." },
            { id: "beta", name: "Beta", price: "$60", eps: "$2", pe: "30x", sector: "Software", context: "Higher expectations", note: "Richer valuation with stronger growth hopes." },
            { id: "gamma", name: "Gamma", price: "$24", eps: "$4", pe: "6x", sector: "Retail", context: "Lower expectations", note: "Cheaper ratio that may still need explanation." },
          ],
        },
        activityStartValue: 0,
      },
    ),
    panel(
      "boss-rule",
      "Wrong reads send the checkpoint back",
      "Boss steps only turn green after a correct solve. One weak read sends the sequence back one step.",
      {
        eyebrow: "Pressure rule",
        activityKind: "reveal-card",
        activityData: {
          statement: "Boss progress is earned, not clicked.",
          revealTitle: "What changes here",
          revealCopy: "A wrong read sends you back one step until the EPS and valuation logic is locked in again.",
          actionLabel: "Show the rule",
          highlightText: "back one step",
        },
      },
    ),
  ],
};

const normalizedEpsPracticePatches: Record<string, Partial<PracticeContent>> = {
  "eps-and-pe-ratios-1": {
    ...activityOnlyPracticePatch("Sort every clue first"),
    mechanicTitle: "Per-share clue sort",
    mechanicSummary: "Separate EPS thinking from total-company thinking.",
    prompt: "Place each clue into the right bucket.",
    explanation: "Right. EPS is the per-share earnings read.",
    activityKind: "bucket-sort",
    supportActivities: ["Stay on the per-share lens.", "Keep total-company numbers separate.", "Use EPS for the slice, not the whole pie."],
    activityData: {
      buckets: ["Per-share clue", "Total-company clue"],
      cards: [
        { id: "eps", label: "Earnings per share", target: "Per-share clue" },
        { id: "earnings", label: "Total earnings", target: "Total-company clue" },
        { id: "profit-share", label: "Profit attached to each share", target: "Per-share clue" },
      ],
    },
  },
  "eps-and-pe-ratios-2": {
    ...activityOnlyPracticePatch("Sort every denominator case first"),
    mechanicTitle: "EPS denominator sorter",
    mechanicSummary: "Sort each scenario by what it does to EPS when earnings stay fixed.",
    prompt: "Place each case into the right bucket.",
    explanation: "Right. More shares usually spread the same earnings more thinly.",
    activityKind: "bucket-sort",
    supportActivities: ["Keep earnings fixed.", "Change the denominator.", "Read the new per-share slice."],
    activityData: {
      buckets: ["EPS up", "EPS down"],
      cards: [
        { id: "more-shares", label: "More shares, same earnings", target: "EPS down" },
        { id: "fewer-shares", label: "Fewer shares, same earnings", target: "EPS up" },
        { id: "smaller-slice", label: "Same pie, more slices", target: "EPS down" },
      ],
    },
  },
  "eps-and-pe-ratios-3": {
    ...activityOnlyPracticePatch("Sort every ratio part first"),
    mechanicTitle: "P/E parts board",
    mechanicSummary: "Separate real P/E ingredients from random extras.",
    prompt: "Place each item into the right bucket.",
    explanation: "Right. P/E is built from price and earnings per share.",
    activityKind: "bucket-sort",
    supportActivities: ["Use price.", "Use EPS.", "Keep unrelated details out of the ratio."],
    activityData: {
      buckets: ["Part of P/E", "Not part of P/E"],
      cards: [
        { id: "price", label: "Price", target: "Part of P/E" },
        { id: "eps", label: "EPS", target: "Part of P/E" },
        { id: "logo", label: "Logo design", target: "Not part of P/E" },
      ],
    },
  },
  "eps-and-pe-ratios-4": {
    ...activityOnlyPracticePatch("Sort every interpretation first"),
    mechanicTitle: "High P/E interpretation",
    mechanicSummary: "Separate careful high-P/E language from rigid shortcuts.",
    prompt: "Place each statement into the right bucket.",
    explanation: "Right. A higher P/E can reflect stronger expectations, not automatic failure.",
    activityKind: "bucket-sort",
    supportActivities: ["Read the ratio.", "Add the expectation clue.", "Reject automatic verdicts."],
    activityData: {
      buckets: ["Careful", "Over-simplified"],
      cards: [
        { id: "careful", label: "A higher P/E can reflect stronger expectations", target: "Careful" },
        { id: "bad", label: "A higher P/E is always bad", target: "Over-simplified" },
        { id: "context", label: "The ratio still needs context", target: "Careful" },
      ],
    },
  },
  "eps-and-pe-ratios-5": {
    ...activityOnlyPracticePatch("Sort every interpretation first"),
    mechanicTitle: "Low P/E interpretation",
    mechanicSummary: "Separate careful low-P/E language from automatic bargain claims.",
    prompt: "Place each statement into the right bucket.",
    explanation: "Right. A lower P/E may be attractive, but it may also reflect weaker expectations.",
    activityKind: "bucket-sort",
    supportActivities: ["Start with the lower ratio.", "Ask why it is lower.", "Reject automatic bargain language."],
    activityData: {
      buckets: ["Careful", "Over-simplified"],
      cards: [
        { id: "careful", label: "A lower P/E may reflect weak expectations", target: "Careful" },
        { id: "always-good", label: "A lower P/E is always good", target: "Over-simplified" },
        { id: "why", label: "Ask why the market assigned it", target: "Careful" },
      ],
    },
  },
  "eps-and-pe-ratios-6": {
    ...activityOnlyPracticePatch("Sort every comparison first"),
    mechanicTitle: "Valid comparison sorter",
    mechanicSummary: "Separate cleaner sector comparisons from weaker cross-sector shortcuts.",
    prompt: "Place each comparison into the right bucket.",
    explanation: "Right. Ratio comparisons are usually cleaner inside a similar sector.",
    activityKind: "bucket-sort",
    supportActivities: ["Check the industry first.", "Prefer like-for-like comparisons.", "Avoid lazy cross-sector verdicts."],
    activityData: {
      buckets: ["More valid", "Less valid"],
      cards: [
        { id: "same-sector", label: "Two software companies", target: "More valid" },
        { id: "cross-sector", label: "A software company vs a utility", target: "Less valid" },
        { id: "same-economics", label: "Two chipmakers", target: "More valid" },
      ],
    },
  },
  "eps-and-pe-ratios-7": {
    ...activityOnlyPracticePatch("Sort every ratio case first"),
    mechanicTitle: "Dynamic ratio sorter",
    mechanicSummary: "Sort each case by whether the P/E ratio would rise or fall.",
    prompt: "Place each case into the right bucket.",
    explanation: "Right. The ratio changes when price changes, and it also changes when EPS changes.",
    activityKind: "bucket-sort",
    supportActivities: ["Watch the price side.", "Watch the EPS side.", "Read what happens to the ratio."],
    activityData: {
      buckets: ["P/E falls", "P/E rises"],
      cards: [
        { id: "eps-up", label: "Price steady, EPS rises", target: "P/E falls" },
        { id: "eps-down", label: "Price steady, EPS falls", target: "P/E rises" },
        { id: "price-up", label: "Price rises, EPS steady", target: "P/E rises" },
      ],
    },
  },
  "eps-and-pe-ratios-8": {
    ...activityOnlyPracticePatch("Sort every metric first"),
    mechanicTitle: "Metric separation board",
    mechanicSummary: "Keep price, revenue, and EPS in the correct bucket.",
    prompt: "Place each item into the right metric bucket.",
    explanation: "Right. Price, revenue, and EPS answer different questions.",
    activityKind: "bucket-sort",
    supportActivities: ["Keep stock price separate.", "Keep business sales separate.", "Keep per-share profit separate."],
    activityData: {
      buckets: ["Price", "Revenue", "EPS"],
      cards: [
        { id: "stock-price", label: "What one share trades for", target: "Price" },
        { id: "sales", label: "Business sales coming in", target: "Revenue" },
        { id: "per-share", label: "Profit per share", target: "EPS" },
      ],
    },
  },
  "eps-and-pe-ratios-9": {
    ...activityOnlyPracticePatch("Sort every statement first"),
    mechanicTitle: "Careful valuation language",
    mechanicSummary: "Separate careful P/E language from overconfident shortcut language.",
    prompt: "Place each statement into the right bucket.",
    explanation: "Right. P/E is strongest as context, not as a final verdict.",
    activityKind: "bucket-sort",
    supportActivities: ["Keep P/E in the clue bucket.", "Add business and expectation context.", "Reject final-answer language."],
    activityData: {
      buckets: ["Careful", "Overconfident"],
      cards: [
        { id: "careful", label: "Use P/E as context, not a verdict", target: "Careful" },
        { id: "over", label: "P/E alone gives the final answer", target: "Overconfident" },
        { id: "ask-why", label: "Ask what explains the ratio", target: "Careful" },
      ],
    },
  },
};

const normalizedEpsCheckPatches: Record<string, CheckContent> = {
  "eps-and-pe-ratios-1": {
    question: "Quick EPS check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "definition",
        prompt: "What does EPS tell you most directly?",
        options: [
          choice("a", "How much earnings are attached to each share", true, ""),
          choice("b", "The total value of the company", false, "eps-basics", "That is closer to market cap."),
          choice("c", "Guaranteed stock returns", false, "eps-basics", "EPS is not a return guarantee."),
        ],
        explanation: "EPS is the per-share earnings read.",
        reviewPrompt: "eps-basics",
      },
      {
        id: "lens",
        prompt: "EPS is best described as which kind of number?",
        options: [
          choice("a", "A per-share profit number", true, ""),
          choice("b", "A sales-only number", false, "eps-basics", "That is closer to revenue."),
          choice("c", "A chart-only number", false, "eps-basics", "EPS is a business metric."),
        ],
        explanation: "EPS is profit attributed to each share.",
        reviewPrompt: "eps-basics",
      },
    ],
    options: [],
    explanation: "Stay on the per-share lens.",
    reviewPrompt: "eps-basics",
  },
  "eps-and-pe-ratios-2": {
    question: "Quick denominator check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "more-shares",
        prompt: "Earnings stay the same, but shares increase. What usually happens to EPS?",
        options: [
          choice("a", "EPS usually falls", true, ""),
          choice("b", "EPS automatically rises", false, "share-count-matters", "More shares usually spread the same earnings more thinly."),
          choice("c", "Nothing changes", false, "share-count-matters", "The denominator changed, so the per-share slice changed."),
        ],
        explanation: "More shares usually lower EPS when earnings stay fixed.",
        reviewPrompt: "share-count-matters",
      },
      {
        id: "fewer-shares",
        prompt: "Earnings stay the same, but shares decrease. What usually happens to EPS?",
        options: [
          choice("a", "EPS usually rises", true, ""),
          choice("b", "EPS always falls", false, "share-count-matters", "Fewer shares usually make each share’s slice larger."),
          choice("c", "Revenue changes instead", false, "share-count-matters", "This lesson is about the per-share earnings denominator."),
        ],
        explanation: "Fewer shares usually lift EPS when total earnings stay fixed.",
        reviewPrompt: "share-count-matters",
      },
    ],
    options: [],
    explanation: "Keep the same earnings pool and watch the denominator.",
    reviewPrompt: "share-count-matters",
  },
  "eps-and-pe-ratios-3": {
    question: "Quick P/E basics check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "definition",
        prompt: "What does P/E compare?",
        options: [
          choice("a", "Price relative to earnings", true, ""),
          choice("b", "Revenue relative to market cap", false, "pe-basics", "That is not the P/E ratio."),
          choice("c", "Only share count", false, "pe-basics", "That misses both parts of the ratio."),
        ],
        explanation: "P/E compares price relative to earnings per share.",
        reviewPrompt: "pe-basics",
      },
      {
        id: "higher-ratio",
        prompt: "What does a higher P/E mean most directly?",
        options: [
          choice("a", "More price for each dollar of earnings", true, ""),
          choice("b", "Guaranteed higher quality", false, "pe-basics", "Quality still needs context."),
          choice("c", "More revenue automatically", false, "pe-basics", "Revenue is not the same thing as P/E."),
        ],
        explanation: "A higher P/E means more price relative to each dollar of earnings.",
        reviewPrompt: "pe-basics",
      },
    ],
    options: [],
    explanation: "First learn the ratio itself. Interpretation comes after that.",
    reviewPrompt: "pe-basics",
  },
  "eps-and-pe-ratios-4": {
    question: "Quick higher-P/E check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "careful",
        prompt: "Which explanation is more careful?",
        options: [
          choice("a", "A higher P/E can reflect stronger expectations", true, ""),
          choice("b", "A higher P/E is always bad", false, "high-pe-context", "That is the rigid shortcut this lesson rejects."),
          choice("c", "Context never matters", false, "high-pe-context", "Context is the whole point."),
        ],
        explanation: "A higher P/E can reflect stronger expectations, so the ratio needs context.",
        reviewPrompt: "high-pe-context",
      },
      {
        id: "next-question",
        prompt: "What is the better next question after seeing a higher P/E?",
        options: [
          choice("a", "What growth or quality expectations might explain it?", true, ""),
          choice("b", "Can I label it bad immediately?", false, "high-pe-context", "That skips the context question."),
          choice("c", "Can I ignore earnings now?", false, "high-pe-context", "Earnings still matter in the ratio."),
        ],
        explanation: "Growth or quality expectations are the cleaner next question.",
        reviewPrompt: "high-pe-context",
      },
    ],
    options: [],
    explanation: "Use the higher ratio as a clue, not a final sentence.",
    reviewPrompt: "high-pe-context",
  },
  "eps-and-pe-ratios-5": {
    question: "Quick lower-P/E check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "careful",
        prompt: "Which explanation is more careful?",
        options: [
          choice("a", "A lower P/E may reflect weak expectations", true, ""),
          choice("b", "A lower P/E is always good", false, "low-pe-context", "That is the shortcut this lesson is correcting."),
          choice("c", "No more context is needed", false, "low-pe-context", "The lower ratio is exactly why more context matters."),
        ],
        explanation: "A lower P/E can reflect market caution, not automatic value.",
        reviewPrompt: "low-pe-context",
      },
      {
        id: "next-question",
        prompt: "What is the better next question after seeing a lower P/E?",
        options: [
          choice("a", "Why is the market assigning the lower ratio?", true, ""),
          choice("b", "Can I call it a bargain immediately?", false, "low-pe-context", "That skips the reason behind the lower ratio."),
          choice("c", "Can I ignore business quality?", false, "low-pe-context", "Quality may be part of the explanation."),
        ],
        explanation: "The stronger move is to ask why the lower ratio exists.",
        reviewPrompt: "low-pe-context",
      },
    ],
    options: [],
    explanation: "A cheaper-looking ratio still needs an explanation.",
    reviewPrompt: "low-pe-context",
  },
  "eps-and-pe-ratios-6": {
    question: "Quick sector-context check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "valid",
        prompt: "Which comparison is usually cleaner?",
        options: [
          choice("a", "Two similar companies in the same sector", true, ""),
          choice("b", "Two unrelated sectors with no context", false, "sector-context", "That comparison is usually weaker."),
          choice("c", "Ignore industry entirely", false, "sector-context", "Industry context matters for valuation."),
        ],
        explanation: "Like-for-like sector comparisons are usually more useful.",
        reviewPrompt: "sector-context",
      },
      {
        id: "why",
        prompt: "Why does sector context matter?",
        options: [
          choice("a", "Different industries can trade on different economics and expectations", true, ""),
          choice("b", "P/E means the same thing in every business automatically", false, "sector-context", "That is the simplification this lesson is fixing."),
          choice("c", "Sector has nothing to do with valuation", false, "sector-context", "Sector context often changes how ratios should be read."),
        ],
        explanation: "Sector context matters because industries often behave differently on economics and expectations.",
        reviewPrompt: "sector-context",
      },
    ],
    options: [],
    explanation: "Cleaner comparisons usually start with cleaner context.",
    reviewPrompt: "sector-context",
  },
  "eps-and-pe-ratios-7": {
    question: "Quick dynamic-ratio check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "earnings-up",
        prompt: "Price stays steady and EPS rises. What can happen to P/E?",
        options: [
          choice("a", "P/E can fall", true, ""),
          choice("b", "P/E must rise", false, "dynamic-pe", "Higher EPS can lower the ratio when price stays steady."),
          choice("c", "Nothing changes", false, "dynamic-pe", "The denominator changed, so the ratio changed."),
        ],
        explanation: "If EPS rises while price stays steady, P/E can fall.",
        reviewPrompt: "dynamic-pe",
      },
      {
        id: "earnings-down",
        prompt: "Price stays steady and EPS falls. What can happen to P/E?",
        options: [
          choice("a", "P/E can rise", true, ""),
          choice("b", "P/E must fall", false, "dynamic-pe", "Lower EPS can lift the ratio when price stays steady."),
          choice("c", "P/E is frozen", false, "dynamic-pe", "The whole lesson is that the ratio is dynamic."),
        ],
        explanation: "If EPS falls while price stays steady, P/E can rise.",
        reviewPrompt: "dynamic-pe",
      },
    ],
    options: [],
    explanation: "P/E moves when either side of the ratio moves.",
    reviewPrompt: "dynamic-pe",
  },
  "eps-and-pe-ratios-8": {
    question: "Quick metric-separation check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "eps",
        prompt: "Which metric reflects profit per share?",
        options: [
          choice("a", "EPS", true, ""),
          choice("b", "Revenue", false, "metric-separation", "Revenue is sales, not profit per share."),
          choice("c", "Price", false, "metric-separation", "Price is what one share trades for."),
        ],
        explanation: "EPS is the profit-per-share metric.",
        reviewPrompt: "metric-separation",
      },
      {
        id: "revenue",
        prompt: "Which metric is business sales coming in?",
        options: [
          choice("a", "Revenue", true, ""),
          choice("b", "EPS", false, "metric-separation", "EPS is profit per share."),
          choice("c", "Price", false, "metric-separation", "Price is the stock lens, not the sales lens."),
        ],
        explanation: "Revenue is the sales number coming into the business.",
        reviewPrompt: "metric-separation",
      },
      {
        id: "price",
        prompt: "Which metric tells you what one share trades for?",
        options: [
          choice("a", "Price", true, ""),
          choice("b", "Revenue", false, "metric-separation", "Revenue is the business-sales lens."),
          choice("c", "EPS", false, "metric-separation", "EPS is the per-share earnings lens."),
        ],
        explanation: "Price is the stock lens for one share.",
        reviewPrompt: "metric-separation",
      },
    ],
    options: [],
    explanation: "Cleaner metric thinking starts by keeping the questions separate.",
    reviewPrompt: "metric-separation",
  },
  "eps-and-pe-ratios-9": {
    question: "Quick careful-valuation check",
    type: "multiple",
    variant: "rapid-fire",
    rapidFireCases: [
      {
        id: "careful",
        prompt: "Which summary avoids overconfidence?",
        options: [
          choice("a", "Use P/E as context, then ask what explains it", true, ""),
          choice("b", "P/E alone gives the final verdict", false, "pe-context-not-verdict", "That is exactly the shortcut to avoid."),
          choice("c", "Ratios never help at all", false, "pe-context-not-verdict", "That throws away a useful clue."),
        ],
        explanation: "P/E is strongest when it opens better questions instead of closing the analysis.",
        reviewPrompt: "pe-context-not-verdict",
      },
      {
        id: "missing-context",
        prompt: "What still matters after reading the ratio?",
        options: [
          choice("a", "Growth, quality, sector, and expectations", true, ""),
          choice("b", "Nothing else at all", false, "pe-context-not-verdict", "That is the overconfident read."),
          choice("c", "Only today’s candle", false, "pe-context-not-verdict", "That is far too narrow for valuation context."),
        ],
        explanation: "P/E works best when it sits beside the rest of the business context.",
        reviewPrompt: "pe-context-not-verdict",
      },
    ],
    options: [],
    explanation: "Treat the ratio as context, not closure.",
    reviewPrompt: "pe-context-not-verdict",
  },
};

for (const [lessonId, panels] of Object.entries(normalizedEpsPanelsByLesson)) {
  const lesson = epsAndPeLessons[lessonId];

  if (lesson) {
    lesson.learn.panels = panels;
  }
}

for (const [lessonId, patch] of Object.entries(normalizedEpsPracticePatches)) {
  const lesson = epsAndPeLessons[lessonId];

  if (lesson) {
    Object.assign(lesson.practice, patch);
  }
}

for (const [lessonId, check] of Object.entries(normalizedEpsCheckPatches)) {
  const lesson = epsAndPeLessons[lessonId];

  if (lesson) {
    lesson.check = check;
  }
}

export const advancedAuthoredLessonExperiences: Record<string, AuthoredLessonExperience> = {
  ...trendAndMomentumLessons,
  ...supportAndResistanceLessons,
  ...breakoutAndVolumeLessons,
  ...businessFundamentalsLessons,
  ...marketCapAndRevenueLessons,
  ...epsAndPeLessons,
};
