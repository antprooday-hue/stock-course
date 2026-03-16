import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPlayerScreen } from "../../screens/lesson-player-screen";

type LessonPageProps = {
  params: Promise<{
    lessonId: string;
  }>;
};

export const metadata: Metadata = {
  title: "Lesson | Stock Academy",
  description: "Interactive stock lesson player.",
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;

  if (lessonId !== "1" && lessonId !== "2") {
    notFound();
  }

  return <LessonPlayerScreen lessonId={Number(lessonId) as 1 | 2} />;
}

