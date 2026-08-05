"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Target, Award, ArrowRight, GraduationCap } from "lucide-react";
import { PageShell, PageHeader } from "@/components/layout";
import {
  KpiCardGrid,
  ActionButtonGroup,
  PageContainer,
} from "@/components/modules/common";
import { LearningDevelopmentModule } from "@/components/modules/hr/LearningDevelopmentModule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const OVERVIEW_CARDS = [
  {
    title: "Courses",
    description: "Browse and manage the full training course catalogue.",
    href: "/dashboard/learning-development/courses",
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Learning Paths",
    description: "Structured learning journeys to develop employee competencies.",
    href: "/dashboard/learning-development/paths",
    icon: Target,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    title: "Certifications",
    description: "Track professional certifications and credentials.",
    href: "/dashboard/learning-development/certifications",
    icon: Award,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
];

export default function LearningDevelopmentOverviewPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const withLocale = (path: string) => `/${locale}${path}`;

  const kpiItems = [
    {
      label: "Active Courses",
      value: 4,
      sub: "2 upcoming",
      icon: <GraduationCap className="h-4 w-4" />,
      color: "text-blue-600",
      trend: "up" as const,
    },
    {
      label: "Total Enrollments",
      value: 70,
      sub: "across all courses",
      icon: <GraduationCap className="h-4 w-4" />,
      color: "text-purple-600",
      trend: "up" as const,
    },
    {
      label: "Completion Rate",
      value: "92%",
      sub: "course completion",
      icon: <Award className="h-4 w-4" />,
      color: "text-green-600",
      trend: "up" as const,
    },
    {
      label: "Active Certifications",
      value: 2,
      sub: "1 expiring soon",
      icon: <Award className="h-4 w-4" />,
      color: "text-amber-600",
    },
  ];

  return (
    <PageShell>
      <PageHeader
        title="Learning & Development"
        description="Empower your workforce with continuous learning programs, courses, and certifications"
        actions={
          <ActionButtonGroup
            align="right"
            actions={[
              {
                label: "New Course",
                href: withLocale("/dashboard/learning-development/courses"),
                icon: <BookOpen className="h-4 w-4" />,
              },
            ]}
          />
        }
      />

      {/* Quick navigation cards */}
      <PageContainer>
        <div className="grid gap-4 md:grid-cols-3">
          {OVERVIEW_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={withLocale(card.href)}
                className="group"
              >
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-0.5">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <div className={`flex size-10 items-center justify-center rounded-lg ${card.bg} ${card.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{card.description}</CardDescription>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                      Open {card.title} <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </PageContainer>

      {/* Full module */}
      <LearningDevelopmentModule />
    </PageShell>
  );
}
