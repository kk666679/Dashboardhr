"use client";

import dynamic from "next/dynamic";

const LearningDevelopmentModule = dynamic(
  () =>
    import("@/components/modules/hr/LearningDevelopmentModule").then(
      (m) => m.LearningDevelopmentModule
    ),
  { ssr: false }
);

export default function LearningDevelopmentPage() {
  return <LearningDevelopmentModule />;
}
