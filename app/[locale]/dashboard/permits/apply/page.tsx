import { redirect } from "next/navigation";

export default async function DashboardPermitsApplyRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/dashboard/permits`);
}

