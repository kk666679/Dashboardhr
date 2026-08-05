import { LandingPage } from "@/components/landing";

export default function LocaleHomePage() {
  // Render directly on /[locale] to avoid client-side ping-pong redirects
  // between / and /[locale].
  return <LandingPage />;
}

