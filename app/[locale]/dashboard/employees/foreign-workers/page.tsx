import { redirect } from "next/navigation";

export default async function DashboardEmployeesForeignWorkersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/employees/foreign-workers`);
}
