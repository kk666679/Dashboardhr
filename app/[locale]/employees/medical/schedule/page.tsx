import { redirect } from "next/navigation";

/**
 * /dashboard/medical/schedule redirects to the FOMEMA schedule page.
 * The canonical medical scheduling URL is /dashboard/medical/fomema/schedule.
 */
export default function MedicalScheduleRedirectPage() {
  redirect("/dashboard/medical/fomema/schedule");
}
