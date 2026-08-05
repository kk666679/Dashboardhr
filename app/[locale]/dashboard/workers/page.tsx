import { redirect } from "next/navigation";

export default async function DashboardWorkersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/employees`);
}
