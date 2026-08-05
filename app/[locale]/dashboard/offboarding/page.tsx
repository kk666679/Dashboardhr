import { redirect } from "next/navigation";

export default async function DashboardOffboardingRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/dashboard/termination`);
}

