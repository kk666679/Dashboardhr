"use client";

import { EnterpriseHeader } from "../landing/EnterpriseHeader";
import { WorkforceModule } from "../landing/WorkforceModule";
import { AiFWMSWorkflow as AutomationModule } from "../landing/AutomationModule";
import { SecurityModule } from "../landing/SecurityModule";
import { FAQModule } from "../landing/FAQModule";
import { PersonaRoutingSection } from "../landing/PersonaRoutingSection";
import { OutcomesBar } from "../landing/OutcomesBar";
import { ConnectedWorkflowSection } from "../landing/ConnectedWorkflowSection";
import CosmicLanding from "@/components/landing/cosmic-landing";
import { GovernmentIntegration } from "@/components/modules/landing/GovernmentIntegration";
import { CtaSection } from "@/components/modules/landing/CtaSection";
import type { CtaAction } from "@/components/modules/landing/CtaSection";
import { FooterSection } from "@/components/modules/landing/FooterSection";
import { AIChatbot } from "@/components/features/ai/ai-chatbot";

/* ------------------------------------------------------------------ */
/*  Translations data                                                 */
/* ------------------------------------------------------------------ */

const translations = {
  en: {
    subtitle: "Unify workforce operations to improve employee experience, control cost, and move work faster.",
    cta: {
      title: "Ready to see it in action?",
      subtitle: "See how a unified workforce platform can make your HR and compliance operations clearer, faster, and easier to manage.",
      demo: "Request a tailored demo",
      contact: "Calculate your ROI",
    },
  },
  ms: {
    subtitle: "Satukan operasi tenaga kerja untuk meningkatkan pengalaman pekerja, mengawal kos, dan mempercepatkan kerja.",
    cta: {
      title: "Bersedia untuk melihatnya?",
      subtitle: "Sertai 2,500+ perniagaan Malaysia yang menjalankan tenaga kerja yang lebih produktif dan patuh.",
      demo: "Minta demo yang disesuaikan",
      contact: "Kira ROI anda",
    },
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Landing Layout – integrates ALL landing components                */
/* ------------------------------------------------------------------ */

export function LandingLayout() {
  const t = translations["en"];

  const governmentApis = [
    { name: "JTK / JTKSM", status: "Active", icon: "⚖️", color: "bg-green-500" },
    { name: "Immigration (JIM)", status: "Active", icon: "🛂", color: "bg-green-500" },
    { name: "LHDN", status: "Active", icon: "📊", color: "bg-green-500" },
    { name: "EPF (KWSP)", status: "Active", icon: "🏛️", color: "bg-green-500" },
    { name: "SOCSO (PERKESO)", status: "Active", icon: "🛡️", color: "bg-green-500" },
    { name: "FOMEMA", status: "Active", icon: "🏥", color: "bg-green-500" },
  ];

  const ctaActions: CtaAction[] = [
    {
      label: t.cta.demo,
      href: "/dashboard",
      icon: "zap",
      variant: "primary",
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
      {/* 1. Persistent outcome-first navbar with "Request a demo" primary CTA */}
      <EnterpriseHeader />

      {/* 2. Hero — outcome promise + dual CTA over cosmic canvas */}
      <section className="relative">
        <CosmicLanding />
      </section>

      {/* 3. Six executive outcomes — immediately below the hero */}
      <OutcomesBar />

      {/* 4. Five role-based paths — executives see outcomes, technical evaluators reach depth */}
      <PersonaRoutingSection />

      {/* 5. Connected workflow visual — one hire flowing across HR, Finance, IT, Facilities, Employee */}
      <ConnectedWorkflowSection />

      {/* 6. Platform capability modules */}
      <main>
        <WorkforceModule />

        {/* 7. Government integration trust section */}
        <GovernmentIntegration
          title="Connected to Malaysian statutory authorities"
          subtitle="Bring statutory documents, deadlines, and submission workflows into one place"
          apis={governmentApis}
        />

        <AutomationModule />
        <SecurityModule />
        <FAQModule />
      </main>

      {/* 8. Progressive conversion CTA — demo + ROI calculator */}
      <CtaSection
        title={t.cta.title}
        subtitle={t.cta.subtitle}
        actions={ctaActions}
      />

      {/* 9. Footer — outcome language, not acronyms */}
      <FooterSection
        brand={{
          name: "AiFWMS",
          version: "v2.1",
          subtitle: t.subtitle,
          tagline: "Malaysian Compliant · Real-Time · AI-Powered",
          copyright:
            "© 2026 AiFWMS. All rights reserved. CHEMMARA ENTERPRISE 003149776-P",
        }}
        columns={[
          {
            title: "Solutions",
            links: [
              { href: "/ess", label: "Improve employee experience" },
              { href: "/accounting/payroll", label: "Reduce workforce cost and risk" },
              { href: "/employees", label: "Streamline HR operations" },
              { href: "/dashboard/geolocation", label: "Run efficient workplace operations" },
              { href: "/employees/foreign-workers", label: "Foreign worker compliance" },
            ],
          },
          {
            title: "Platform",
            links: [
              { href: "/automation", label: "Workflow automation" },
              { href: "/dashboard/analytics", label: "Analytics and intelligence" },
              { href: "/integrations", label: "Integrations" },
              { href: "/dashboard/security", label: "Security and governance" },
              { href: "/api/openapi", label: "Developer platform" },
            ],
          },
        ]}
        aiAssistant={{
          title: "AI Assistant",
          description: "Get instant answers about Malaysian labor laws and regulations",
          buttonLabel: "Start Chat",
        }}
      />

      <AIChatbot />
    </div>
  );
}

export default LandingLayout;

