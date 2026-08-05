import { redirect } from "next/navigation";

export default async function DashboardEmployeesExpatriatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/employees/expatriates`);
}
