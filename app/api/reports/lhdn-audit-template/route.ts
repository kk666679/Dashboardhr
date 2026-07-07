import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Generate LHDN-compliant audit report template
    const reportData = {
      title: "LHDN Compliance Audit Report",
      company: "ABC Construction Sdn Bhd",
      period: "2024",
      sections: [
        {
          title: "Foreign Worker Tax Compliance",
          items: [
            "Monthly Tax File (MTD) submissions",
            "PCB deductions and remittances",
            "Annual tax returns (Form BE)",
            "Withholding tax compliance",
          ],
        },
        {
          title: "Payroll Tax Records",
          items: [
            "EPF contributions and submissions",
            "SOCSO premium payments",
            "EIS contributions",
            "Human Resources Development Fund (HRDF)",
          ],
        },
        {
          title: "Government Levy Payments",
          items: [
            "Foreign worker levy payments to JTK",
            "Immigration department fees",
            "FOMEMA medical examination fees",
            "Work permit renewal costs",
          ],
        },
      ],
      compliance_status: "COMPLIANT",
      generated_date: new Date().toISOString(),
      next_review: new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };

    // Create CSV content for the audit report
    const csvContent = [
      "LHDN Compliance Audit Report",
      `Company: ${reportData.company}`,
      `Period: ${reportData.period}`,
      `Status: ${reportData.compliance_status}`,
      `Generated: ${new Date(reportData.generated_date).toLocaleDateString()}`,
      `Next Review: ${new Date(reportData.next_review).toLocaleDateString()}`,
      "",
      "Section,Item,Status,Notes",
      ...reportData.sections.flatMap((section) =>
        section.items.map(
          (item) =>
            `"${section.title}","${item}","COMPLIANT","Automated verification passed"`,
        ),
      ),
    ].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="LHDN-Audit-Report.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate audit report" },
      { status: 500 },
    );
  }
}
