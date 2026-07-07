import { prisma } from "@/lib/prisma";

const CHANNELS = [
  "LinkedIn",
  "JobStreet",
  "Indeed",
  "Instagram",
  "Internal Comms",
  "Referral Program",
];

const CONTENT_CALENDAR: Record<string, string[]> = {
  Monday: [
    "Job opening posts on LinkedIn & JobStreet",
    "Employee spotlight feature",
  ],
  Tuesday: ["Culture & values content", "Behind-the-scenes workplace photos"],
  Wednesday: [
    "Industry insights & thought leadership",
    "Learning & development highlights",
  ],
  Thursday: [
    "Employee testimonials & success stories",
    "Benefits & perks showcase",
  ],
  Friday: ["Week-in-review post", "Weekend engagement content"],
};

const EVP_PILLARS = [
  {
    pillar: "Career Growth",
    message: "Clear career paths, HRDC-funded training, mentorship programs",
  },
  {
    pillar: "Compensation",
    message: "Competitive salary, statutory benefits + company perks",
  },
  {
    pillar: "Work Environment",
    message: "Inclusive, safe, and respectful workplace",
  },
  {
    pillar: "Purpose & Impact",
    message: "Meaningful work contributing to Malaysian workforce development",
  },
  {
    pillar: "Work-Life Balance",
    message: "Flexible arrangements, generous leave policy",
  },
];

export async function employerBrandingAgent(input: string, tenantId?: string) {
  try {
    const where = tenantId ? { tenantId } : {};

    const [totalEmployees, departments] = await Promise.all([
      prisma.employee.count({ where }),
      prisma.employee.groupBy({
        by: ["department"],
        where,
        _count: { department: true },
      }),
    ]);

    const deptBreakdown = departments
      .filter((d) => d.department)
      .map((d) => ({
        department: d.department!,
        headcount: d._count.department,
      }))
      .sort((a, b) => b.headcount - a.headcount);

    return {
      type: "EMPLOYER_BRANDING",
      data: JSON.stringify({
        companyProfile: {
          totalEmployees,
          departments: deptBreakdown,
        },
        evpPillars: EVP_PILLARS,
        channels: CHANNELS,
        contentCalendar: CONTENT_CALENDAR,
        campaignKPIs: [
          { metric: "Job Ad Click-Through Rate", target: "≥ 3%" },
          { metric: "Application Conversion Rate", target: "≥ 15%" },
          { metric: "LinkedIn Follower Growth", target: "+10%/quarter" },
          { metric: "Employee Referral Rate", target: "≥ 20% of hires" },
          { metric: "Glassdoor / JobStreet Rating", target: "≥ 4.0 / 5.0" },
          { metric: "Offer Acceptance Rate", target: "≥ 85%" },
        ],
        engagementInitiatives: [
          "Monthly town halls with leadership",
          "Employee recognition program (monthly awards)",
          "Annual team-building events",
          "Quarterly pulse surveys",
          "Onboarding buddy program",
          "Internal job posting priority for existing employees",
        ],
      }),
    };
  } catch (error) {
    console.error("Employer branding agent error:", error);
    return {
      type: "EMPLOYER_BRANDING",
      data: JSON.stringify({
        companyProfile: {
          totalEmployees: "N/A",
          departments: [],
        },
        evpPillars: EVP_PILLARS,
        channels: CHANNELS,
        contentCalendar: CONTENT_CALENDAR,
        campaignKPIs: [
          { metric: "Job Ad Click-Through Rate", target: "≥ 3%" },
          { metric: "Application Conversion Rate", target: "≥ 15%" },
          { metric: "Offer Acceptance Rate", target: "≥ 85%" },
        ],
        engagementInitiatives: [
          "Run employee spotlight content monthly.",
          "Collect testimonials from new hires after onboarding.",
          "Refresh EVP messaging quarterly across LinkedIn and JobStreet.",
        ],
      }),
    };
  }
}
