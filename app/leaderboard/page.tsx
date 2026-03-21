import type { Metadata } from "next";
import { LeaderboardScreen } from "../screens/leaderboard-screen";

export const metadata: Metadata = {
  title: "Leaderboard | Stock Academy",
  description: "See how your course XP stacks up against other signed-in learners.",
};

export default function LeaderboardPage() {
  return <LeaderboardScreen />;
}
