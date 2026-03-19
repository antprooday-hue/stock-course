import type { Metadata } from "next";
import { FinalAnalysisScreen } from "../screens/final-analysis-screen";

export const metadata: Metadata = {
  title: "Final Practice | Stock Academy",
  description: "Apply what you learned in a final beginner stock walkthrough.",
};

export default function FinalPracticePage() {
  return <FinalAnalysisScreen />;
}
