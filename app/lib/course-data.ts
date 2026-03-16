export type LessonId = 1 | 2;
export type StepType = "learn" | "practice" | "check";

export type LessonStep = {
  id: string;
  type: StepType;
};

export type LessonMeta = {
  id: number;
  title: string;
  description: string;
  duration: string;
  locked: boolean;
};

export type LearnContent = {
  title: string;
  visual: "ownership" | "price" | "chart" | "change";
  explanation: string;
  whatThisMeans: string;
  commonMistake: string;
};

export type PracticeOption = {
  id: string;
  text: string;
  correct: boolean;
  reviewPrompt: string;
};

export type PracticeContent = {
  question: string;
  chart?: boolean;
  options: PracticeOption[];
  explanation: string;
};

export type CheckContent =
  | {
      question: string;
      type: "truefalse";
      correctAnswer: boolean;
      explanation: string;
      reviewPrompt: string;
    }
  | {
      question: string;
      type: "multiple";
      options: PracticeOption[];
      explanation: string;
      reviewPrompt: string;
    };

export const lessonCatalog: LessonMeta[] = [
  {
    id: 1,
    title: "What is a Stock?",
    description: "Understand ownership and value",
    duration: "5 min",
    locked: false,
  },
  {
    id: 2,
    title: "Reading Stock Prices",
    description: "Learn how to read charts",
    duration: "8 min",
    locked: false,
  },
  {
    id: 3,
    title: "Market Cap Basics",
    description: "Company size and value",
    duration: "6 min",
    locked: true,
  },
  {
    id: 4,
    title: "Understanding Trends",
    description: "Identify patterns over time",
    duration: "7 min",
    locked: true,
  },
  {
    id: 5,
    title: "Final Assessment",
    description: "Test your knowledge",
    duration: "10 min",
    locked: true,
  },
];

export const lessonSteps: Record<LessonId, LessonStep[]> = {
  1: [
    { type: "learn", id: "1-1" },
    { type: "practice", id: "1-2" },
    { type: "check", id: "1-3" },
    { type: "learn", id: "1-4" },
    { type: "practice", id: "1-5" },
    { type: "check", id: "1-6" },
  ],
  2: [
    { type: "learn", id: "2-1" },
    { type: "practice", id: "2-2" },
    { type: "check", id: "2-3" },
    { type: "learn", id: "2-4" },
    { type: "practice", id: "2-5" },
    { type: "check", id: "2-6" },
  ],
};

export const learnContent: Record<string, LearnContent> = {
  "1-1": {
    title: "Stocks represent ownership",
    visual: "ownership",
    explanation:
      "When you buy a stock, you're buying a small piece of a company. This makes you a shareholder, literally someone who shares in the company's ownership.",
    whatThisMeans:
      "If NVIDIA has 2.5 billion shares total, and you own 100 shares, you own a tiny fraction of the entire company.",
    commonMistake:
      "Stocks aren't loans to a company. You're not lending money, you're becoming a part-owner.",
  },
  "1-4": {
    title: "Share price shows market value",
    visual: "price",
    explanation:
      "The price of one share tells you what the market thinks that tiny piece of ownership is worth right now.",
    whatThisMeans:
      "If NVIDIA stock is trading at $500, it costs $500 to buy one share. Prices change constantly based on supply and demand.",
    commonMistake:
      "A high price doesn't always mean a company is expensive. It depends on how many shares exist total.",
  },
  "2-1": {
    title: "Stock charts show price over time",
    visual: "chart",
    explanation:
      "Charts display how a stock's price has changed. The vertical axis shows price, and the horizontal axis shows time.",
    whatThisMeans:
      "A line going up means the stock price increased. A line going down means it decreased. This helps you see trends.",
    commonMistake:
      "Past performance doesn't predict future results. Charts show history, not guarantees.",
  },
  "2-4": {
    title: "Green and red indicate change",
    visual: "change",
    explanation:
      "Stock displays use green for positive change and red for negative change, helping you quickly read whether price moved up or down.",
    whatThisMeans:
      "If a stock is green and shows +$5.00 (+2.5%), it's $5 higher than the previous close, which is a 2.5% increase.",
    commonMistake:
      "Red doesn't mean bad forever. It only means price dropped from a reference point, so context still matters.",
  },
};

export const practiceContent: Record<string, PracticeContent> = {
  "1-2": {
    question:
      "If NVIDIA has 2.5 billion total shares, and you own 250 shares, what do you own?",
    options: [
      {
        id: "a",
        text: "A loan to NVIDIA worth $250",
        correct: false,
        reviewPrompt: "Review the difference between ownership and lending.",
      },
      {
        id: "b",
        text: "A tiny fraction of NVIDIA as a company",
        correct: true,
        reviewPrompt: "",
      },
      {
        id: "c",
        text: "250 computers made by NVIDIA",
        correct: false,
        reviewPrompt: "Revisit what a share represents inside a company.",
      },
      {
        id: "d",
        text: "The right to work at NVIDIA",
        correct: false,
        reviewPrompt: "Review what shareholder ownership does and does not mean.",
      },
    ],
    explanation:
      "Correct! You own a small piece of the company itself. You're a shareholder.",
  },
  "1-5": {
    question:
      "NVIDIA stock is trading at $480 per share. How much does it cost to buy 10 shares?",
    options: [
      {
        id: "a",
        text: "$480",
        correct: false,
        reviewPrompt: "Review how to multiply share price by number of shares.",
      },
      {
        id: "b",
        text: "$490",
        correct: false,
        reviewPrompt: "Double-check how total share cost is calculated.",
      },
      {
        id: "c",
        text: "$4,800",
        correct: true,
        reviewPrompt: "",
      },
      {
        id: "d",
        text: "$48,000",
        correct: false,
        reviewPrompt: "Review how many shares are being purchased in the example.",
      },
    ],
    explanation: "Yes! $480 times 10 shares equals a total cost of $4,800.",
  },
  "2-2": {
    question:
      "Look at this chart. What does the upward trend from March to June indicate?",
    chart: true,
    options: [
      {
        id: "a",
        text: "The stock price increased during that period",
        correct: true,
        reviewPrompt: "",
      },
      {
        id: "b",
        text: "More people bought computers",
        correct: false,
        reviewPrompt: "Review what a chart can show directly versus what it cannot confirm.",
      },
      {
        id: "c",
        text: "The company got bigger",
        correct: false,
        reviewPrompt: "Go back to how line charts represent price over time.",
      },
      {
        id: "d",
        text: "It will keep going up forever",
        correct: false,
        reviewPrompt: "Revisit why charts show history, not guarantees.",
      },
    ],
    explanation: "Exactly! An upward line shows the stock price rose over time.",
  },
  "2-5": {
    question: "A stock shows: -$8.50 (-3.2%) in red. What does this mean?",
    options: [
      {
        id: "a",
        text: "The company is failing",
        correct: false,
        reviewPrompt: "Review what price change does and does not prove about a company.",
      },
      {
        id: "b",
        text: "The price dropped $8.50 from the previous close",
        correct: true,
        reviewPrompt: "",
      },
      {
        id: "c",
        text: "You lost all your money",
        correct: false,
        reviewPrompt: "Revisit what percentage and dollar changes actually describe.",
      },
      {
        id: "d",
        text: "You should sell immediately",
        correct: false,
        reviewPrompt: "Review why the course explains concepts rather than giving trading advice.",
      },
    ],
    explanation:
      "Right! Red just means the price is down from a reference point, in this case down $8.50 or 3.2%.",
  },
};

export const checkContent: Record<string, CheckContent> = {
  "1-3": {
    question:
      "True or False: Buying stock means you're lending money to a company.",
    type: "truefalse",
    correctAnswer: false,
    explanation:
      "False! You're not lending. You're buying ownership. Bonds are loans, while stocks are ownership.",
    reviewPrompt: "Review the difference between a stock and a bond.",
  },
  "1-6": {
    question: "Which statement is TRUE about stock prices?",
    type: "multiple",
    options: [
      {
        id: "a",
        text: "Higher price always means a better company",
        correct: false,
        reviewPrompt: "Review what a share price represents at a single moment.",
      },
      {
        id: "b",
        text: "Price shows what one share costs right now",
        correct: true,
        reviewPrompt: "",
      },
      {
        id: "c",
        text: "All stocks cost the same amount",
        correct: false,
        reviewPrompt: "Revisit why different companies can have very different share prices.",
      },
    ],
    explanation:
      "Exactly! Price is simply what one share costs at this moment. It doesn't tell the whole story about value.",
    reviewPrompt: "Review how share price differs from total company value.",
  },
  "2-3": {
    question:
      "True or False: If a stock chart goes up, it's guaranteed to keep going up.",
    type: "truefalse",
    correctAnswer: false,
    explanation:
      "False! Past performance doesn't predict future results. Charts show history, not guarantees about what happens next.",
    reviewPrompt: "Revisit why charts describe past price movement only.",
  },
  "2-6": {
    question: "A stock is green and shows +$10 (+5%). What happened?",
    type: "multiple",
    options: [
      {
        id: "a",
        text: "It lost $10 in value",
        correct: false,
        reviewPrompt: "Review what green price movement means.",
      },
      {
        id: "b",
        text: "It's now worth $10 total",
        correct: false,
        reviewPrompt: "Revisit what price change indicates versus total stock price.",
      },
      {
        id: "c",
        text: "It increased $10 from the previous close",
        correct: true,
        reviewPrompt: "",
      },
    ],
    explanation:
      "Correct! Green with a plus sign means the price went up. Here it rose $10, which is a 5% increase.",
    reviewPrompt: "Review how dollar and percentage gains are displayed.",
  },
};

export const performanceData = [
  { concept: "Stock Ownership", score: 100, detail: "Perfect understanding" },
  { concept: "Share Pricing", score: 100, detail: "Mastered" },
  { concept: "Chart Reading", score: 90, detail: "Strong grasp" },
  { concept: "Price Changes", score: 100, detail: "Excellent" },
];

