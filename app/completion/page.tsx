import type { Metadata } from "next";
import { CompletionScreen } from "../screens/completion-screen";

export const metadata: Metadata = {
  title: "Completion | Stock Academy",
  description: "Celebrate course completion and unlock the certificate.",
};

export default function CompletionPage() {
  return <CompletionScreen />;
}

