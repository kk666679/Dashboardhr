import { redirect } from "next/navigation";

export default async function DashboardEmployeeRelationsRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/dashboard/organisation`);
}

