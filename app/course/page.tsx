import type { Metadata } from "next";
import { CourseOverviewScreen } from "../screens/course-overview-screen";

export const metadata: Metadata = {
  title: "Course Overview | Stock Academy",
  description: "Continue the interactive stock learning journey.",
};

export default function CoursePage() {
  return <CourseOverviewScreen />;
}
