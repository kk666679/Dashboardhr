import { redirect } from "next/navigation";

export default async function DashboardOnboardingRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
redirect(`/${locale}/employees`);
}

