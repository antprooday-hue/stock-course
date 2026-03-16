import type { Metadata } from "next";
import { FinalAnalysisScreen } from "../screens/final-analysis-screen";

export const metadata: Metadata = {
  title: "Analysis | Stock Academy",
  description: "Review your learning performance across the course.",
};

export default function AnalysisPage() {
  return <FinalAnalysisScreen />;
}

