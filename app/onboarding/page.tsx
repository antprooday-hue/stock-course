import type { Metadata } from "next";
import { OnboardingScreen } from "../screens/onboarding-screen";

export const metadata: Metadata = {
  title: "Onboarding | Stock Academy",
  description: "Complete onboarding and begin the stock learning course.",
};

export default function OnboardingPage() {
  return <OnboardingScreen />;
}
