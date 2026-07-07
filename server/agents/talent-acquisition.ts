import { prisma } from "@/lib/prisma";

const SOURCING_CHANNELS = [
  "JobStreet",
  "LinkedIn",
  "Indeed",
  "Hiredly",
  "Referral Program",
  "Internal Posting",
];

const INTERVIEW_QUESTIONS: Record<string, string[]> = {
  general: [
    "Walk me through your most relevant experience for this role.",
    "Describe a challenge you faced at work and how you resolved it. (STAR)",
    "Why are you interested in this position and our company?",
    "Where do you see yourself in 3 years?",
    "What is your expected salary and notice period?",
  ],
  technical: [
    "What tools or systems have you used in a similar role?",
    "Describe a process you improved or automated in a previous job.",
    "How do you prioritize when handling multiple deadlines?",
  ],
  leadership: [
    "Tell me about a time you led a team through a difficult situation.",
    "How do you handle underperformance in your team?",
    "Describe your approach to developing team members.",
  ],
};

const SALARY_BENCHMARKS: Record<string, { min: number; max: number }> = {
  "Non-Executive": { min: 2000, max: 3500 },
  Executive: { min: 3500, max: 6000 },
  Senior: { min: 6000, max: 10000 },
  Manager: { min: 8000, max: 15000 },
  "Senior Manager": { min: 15000, max: 25000 },
};

export async function talentAcquisitionAgent(input: string, tenantId?: string) {
  try {
    const where = tenantId ? { tenantId } : {};

    // Derive open roles from department headcount gaps
    const [departments, totalActive] = await Promise.all([
      prisma.employee.groupBy({
        by: ["department"],
        where,
        _count: { department: true },
      }),
      prisma.employee.count({ where: { ...where, isForeign: false } }),
    ]);

    const openRoles = departments
      .filter((d) => d.department && d._count.department < 3)
      .slice(0, 5)
      .map((d) => ({
        title: `${d.department} Specialist`,
        department: d.department!,
        level: "Executive",
        headcount: 1,
        status: "Open",
      }));

    // Fallback roles when no DB data is available
    if (!openRoles.length) {
      openRoles.push(
        {
          title: "HR Executive",
          department: "Human Resources",
          level: "Executive",
          headcount: 1,
          status: "Open",
        },
        {
          title: "Production Operator",
          department: "Manufacturing",
          level: "Non-Executive",
          headcount: 5,
          status: "Open",
        },
        {
          title: "Safety Officer",
          department: "HSE",
          level: "Executive",
          headcount: 1,
          status: "Open",
        },
      );
    }

    // Determine interview question set from input intent
    const inputLower = input.toLowerCase();
    const questionSet =
      inputLower.includes("leader") || inputLower.includes("manager")
        ? [...INTERVIEW_QUESTIONS.general, ...INTERVIEW_QUESTIONS.leadership]
        : [...INTERVIEW_QUESTIONS.general, ...INTERVIEW_QUESTIONS.technical];

    // Derive salary benchmark from first open role level
    const firstLevel = openRoles[0]?.level ?? "Executive";
    const benchmark =
      SALARY_BENCHMARKS[firstLevel] ?? SALARY_BENCHMARKS["Executive"];

    return {
      type: "TALENT_ACQUISITION",
      data: JSON.stringify({
        openRoles,
        hiringContext: {
          market: "Malaysia",
          probationMonths: 3,
          noticePeriod: "1 month (probation) / 2 months (confirmed)",
          contractTypes: ["Permanent", "Fixed-Term Contract", "Part-Time"],
          totalWorkforce: totalActive,
        },
        sourcingStrategy: {
          channels: SOURCING_CHANNELS,
          timeToFill: "3–6 weeks (executive) / 1–2 weeks (non-executive)",
          keyMessages: [
            "Highlight career growth and HRDC-funded training",
            "Emphasize statutory benefits: EPF, SOCSO, EIS, medical",
            "Promote inclusive and safe workplace culture",
          ],
        },
        salaryBenchmark: {
          level: firstLevel,
          min: benchmark.min,
          max: benchmark.max,
          currency: "MYR",
          note: "Benchmarked to Malaysian market. Adjust for internal equity and candidate experience.",
        },
        interviewQuestions: questionSet,
        scoringModel: {
          thresholds: { proceed: 80, hold: 60, reject: 0 },
          deductions: {
            missingCriticalSkill: -20,
            missingPreferredSkill: -10,
            experienceYearGap: -5,
          },
          boosts: {
            relevantIndustry: +10,
            recentRoleAlignment: +5,
            softSkillIndicators: +5,
          },
        },
        complianceChecklist: [
          "Verify foreign worker quota before opening headcount",
          "Ensure JD language is non-discriminatory (age, gender, race, religion)",
          "Confirm probation period is 3 months per Employment Act 1955",
          "Validate notice period aligns with S.12 Employment Act 1955",
          "Check salary offer against approved internal band before issuing",
        ],
      }),
    };
  } catch (error) {
    console.error("Talent acquisition agent error:", error);
    return {
      type: "TALENT_ACQUISITION",
      data: JSON.stringify({
        openRoles: [
          {
            title: "HR Executive",
            department: "Human Resources",
            level: "Executive",
            headcount: 1,
            status: "Open",
          },
          {
            title: "Production Operator",
            department: "Manufacturing",
            level: "Non-Executive",
            headcount: 5,
            status: "Open",
          },
          {
            title: "Safety Officer",
            department: "HSE",
            level: "Executive",
            headcount: 1,
            status: "Open",
          },
        ],
        hiringContext: {
          market: "Malaysia",
          probationMonths: 3,
          noticePeriod: "1 month (probation) / 2 months (confirmed)",
          contractTypes: ["Permanent", "Fixed-Term Contract", "Part-Time"],
          totalWorkforce: "N/A",
        },
        sourcingStrategy: {
          channels: SOURCING_CHANNELS,
          timeToFill: "3–6 weeks (executive) / 1–2 weeks (non-executive)",
          keyMessages: [
            "Highlight career growth and HRDC-funded training.",
            "Promote statutory benefits and a safe workplace culture.",
            "Use referrals and JobStreet/LinkedIn for faster shortlisting.",
          ],
        },
        complianceChecklist: [
          "Verify foreign worker quota before opening headcount.",
          "Ensure JD language is non-discriminatory.",
          "Validate salary offers against approved internal bands.",
        ],
      }),
    };
  }
}
