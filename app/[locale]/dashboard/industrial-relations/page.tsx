import { redirect } from "next/navigation";

export default async function DashboardIndustrialRelationsRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/dashboard/organisation`);
}

