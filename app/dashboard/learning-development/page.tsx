"use client";

import dynamic from "next/dynamic";

const LearningDevelopment = dynamic(
  () =>
    import("@/components/features/learning-development/LearningDevelopment").then(
      (m) => m.LearningDevelopment
    ),
  { ssr: false }
);

export default function LearningDevelopmentPage() {
  return <LearningDevelopment />;
}
