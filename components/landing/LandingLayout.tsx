"use client";

// Landing section components
import { EnterpriseHeader } from "../landing/EnterpriseHeader";
import { WorkforceModule } from "../landing/WorkforceModule";
import { AutomationModule } from "../landing/AutomationModule";
import { SecurityModule } from "../landing/SecurityModule";
import { FAQModule } from "../landing/FAQModule";

// Shared / decorative components
import CosmicLanding from "@/components/landing/cosmic-landing";
import TechStackMarquee from "@/components/landing/TechStackMarquee";

// Module-landing sub-components
import { GovernmentIntegration } from "@/components/modules/landing/GovernmentIntegration";
import { CtaSection } from "@/components/modules/landing/CtaSection";
import type { CtaAction } from "@/components/modules/landing/CtaSection";
import { FooterSection } from "@/components/modules/landing/FooterSection";

// AI
import { AIChatbot } from "@/components/features/ai/ai-chatbot";

/* ------------------------------------------------------------------ */
/*  Translations data                                                 */
/* ------------------------------------------------------------------ */

const translations = {
  en: {
    subtitle: "Complete compliance solution for Malaysian businesses",
    cta: {
      title: "Ready to Get Started?",
      subtitle:
        "Join 2,500+ Malaysian businesses using our enhanced FWMS",
      demo: "Try Live Demo",
      contact: "Contact Sales",
    },
  },
  ms: {
    subtitle: "Penyelesaian pematuhan lengkap untuk perniagaan Malaysia",
    cta: {
      title: "Bersedia untuk Memulakan?",
      subtitle:
        "Sertai 2,500+ perniagaan Malaysia menggunakan FWMS kami",
      demo: "Cuba Demo Langsung",
      contact: "Hubungi Jualan",
    },
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Landing Layout – integrates ALL landing components                */
/* ------------------------------------------------------------------ */

export function LandingLayout() {
  const t = translations["en"];

  const handleWindowExeDownload = () => {
    const link = document.createElement("a");
    link.href = "/api/window-exe";
    link.download = "Window.exe";
    link.click();
  };

  /* ---- Government integrations ---- */
  const governmentApis = [
    { name: "JTK", status: "Active", icon: "⚖️", color: "bg-green-500" },
    { name: "Immigration", status: "Active", icon: "🛂", color: "bg-green-500" },
    { name: "LHDN", status: "Active", icon: "📊", color: "bg-green-500" },
    { name: "EPF", status: "Active", icon: "🏛️", color: "bg-green-500" },
    { name: "SOCSO", status: "Active", icon: "🛡️", color: "bg-green-500" },
    { name: "FOMEMA", status: "Active", icon: "🏥", color: "bg-green-500" },
  ];

  /* ---- CTA actions ---- */
  const ctaActions: CtaAction[] = [
    {
      label: t.cta.demo,
      href: "/dashboard",
      icon: "zap",
      variant: "primary",
    },
    {
      label: "WindowDownloader.exe Download",
      onClick: handleWindowExeDownload,
      icon: "download",
      variant: "outline",
    },
    {
      label: t.cta.contact,
      href: "/dashboard/help",
      icon: "phone",
      variant: "outline",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ---- Enterprise Navbar ---- */}
      <EnterpriseHeader />

{/* ---- Hero: full-screen Cosmic canvas ---- */}
      <section className="relative">
        <CosmicLanding />
      </section>

      {/* ---- Tech Stack Marquee hero section ---- */}
      <TechStackMarquee />

      {/* ---- Main content: all LandingLayout section modules ---- */}
      <main>
        <WorkforceModule />

        {/* ---- Government Integration ---- */}
        <GovernmentIntegration
          title="Government API Status"
          subtitle="Real-time integration with Malaysian authorities"
          apis={governmentApis}
        />

        <AutomationModule />
        <SecurityModule />
        <FAQModule />
      </main>

      {/* ---- CTA Section ---- */}
      <CtaSection
        title={t.cta.title}
        subtitle={t.cta.subtitle}
        actions={ctaActions}
      />

      {/* ---- Footer ---- */}
      <FooterSection
        brand={{
          name: "AiFWMS",
          version: "v2.1",
          subtitle: t.subtitle,
          tagline: "Malaysian Compliant Real-Time Enabled",
          copyright:
            "© 2026 AiFWMS. All rights reserved. CHEMMARA ENTERPRISE 003149776-P",
        }}
        columns={[
          {
            title: "Enterprise Products",
            links: [
              { href: "/dashboard", label: "HR Administration" },
              { href: "/accounting", label: "Accounting" },
              { href: "/automation", label: "Automation" },
              { href: "/ai", label: "AI Hub" },
              { href: "/employees", label: "Employees" },
              { href: "/capex", label: "CAPEX" },
            ],
          },
          {
            title: "Portals & Integrations",
            links: [
              { href: "/ess", label: "Employee Portal (ESS)" },
              { href: "/mss", label: "Manager Portal (MSS)" },
              { href: "/integrations", label: "Integrations Hub" },
              { href: "/dashboard/geolocation", label: "Live Tracking" },
              { href: "/dashboard/compliance", label: "Compliance" },
            ],
          },
        ]}
        aiAssistant={{
          title: "AI Assistant",
          description:
            "Get instant answers about Malaysian labor laws and regulations",
          buttonLabel: "Start Chat",
        }}
      />

      {/* ---- Floating AI Chatbot ---- */}
      <AIChatbot />
    </div>
  );
}

export default LandingLayout;

