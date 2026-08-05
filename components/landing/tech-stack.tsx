"use client";

import Image from "next/image";
import { cn } from "@/lib/utils"

const LOGO_PATH = "/platform-logo-svg";

const technologies = [
  // Frameworks
  "React_light.svg",
  "React_dark.svg",
  "nextjs_icon_dark.svg",
  "nestjs.svg",
  "fastapi.svg",
  "dotnet.svg",
  "typescript.svg",
  "csharp.svg",
  "tailwindcss.svg",
  "bootstrap.svg",
  "materialui.svg",
  "tanstack.svg",
  "trpc.svg",
  "prisma.svg",

  // Backend & Infrastructure
  "docker.svg",
  "nginx.svg",
  "aws.svg",
  "cloudflare.svg",
  "azurefunctions-icon.svg",
  "azurefunctions-ar21~bgwhite.svg",
  "bullmq-default.svg",
  "bullmq-dark.svg",
  "Apache Kafka_light.svg",
  "Apache Kafka_dark.svg",
  "dotenvx.svg",
  "postgresql.svg",
  "neon.svg",

  // Developer Tools
  "GitHub_light.svg",
  "GitHub_dark.svg",
  "postman.svg",
  "playwright.svg",
  "pnpm_wordmark_light.svg",
  "pnpm_wordmark_dark.svg",
  "Vercel_light.svg",
  "Vercel_dark.svg",
  "authjs.svg",

  // Browsers
  "chrome.svg",
  "chromium.svg",
  "edge.svg",
  "firefox.svg",
  "opera.svg",
  "safari.svg",

  // Microsoft
  "microsoft.svg",
  "microsoft-icon.svg",
  "microsoft-ar21.svg",
  "microsoft-ar21~bgwhite.svg",
  "microsoft-office.svg",
  "microsoft-excel.svg",
  "microsoft-copilot.svg",
  "microsoft_azure-icon.svg",
  "microsoft_azure-ar21.svg",
  "microsoft_azure-ar21~bgwhite.svg",
  "dynamics365-svgrepo-com.svg",

  // Enterprise
  "oracle-icon.svg",
  "oracle-ar21.svg",
  "oracle-ar21~bgwhite.svg",
  "oracle-otm.svg",
  "sap-icon.svg",
  "sap-ar21.svg",
  "sap-ar21~bgwhite.svg",
  "salesforce-2.svg",

  // Design & AI
  "Framer_light.svg",
  "Framer_dark.svg",
  "Mermaid_light.svg",
  "Mermaid_dark.svg",
  "Manus_wordmark_light.svg",
  "Manus_wordmark_dark.svg",

  // Google
  "google.svg",
  "Google Play_wordmark_light.svg",
  "Google Play_wordmark_dark.svg",
  "appstore.svg",

  // Social
  "discord.svg",
  "slack.svg",
  "skype.svg",
  "whatsapp-icon.svg",
  "messenger.svg",
  "facebook-icon.svg",
  "meta.svg",
  "pinterest.svg",
  "dribbble.svg",

  // Crypto
  "btc.svg",
  "eth.svg",
  "bnb.svg",
  "matic.svg",
  "doge.svg",
  "metamask.svg",
  "coinbase.svg",
  "coinmerce-svgrepo-com.svg",
  "binance.svg",
  "opensea.svg",

  // Commerce
  "alipay-svgrepo-com.svg",
  "amazonpay-svgrepo-com.svg",
  "paytm-for-business-svgrepo-com.svg",
  "woocommerce-svgrepo-com.svg",
  "aliexpress-icon.svg",

  // Misc
  "blackbox.svg",
  "bing.svg",
  "adobe-sign.svg",
  "logo.svg",
  "sample-logo.svg",
  "eve_light.svg",
  "eve_dark.svg",
];

export default function TechStack() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            Technology Stack
          </h2>

          <p className="mt-4 text-muted-foreground">
            We build with modern frameworks, cloud platforms, enterprise
            software, developer tools, and industry-leading technologies.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {technologies.map((logo) => (
            <div
              key={logo}
              className="group flex h-28 items-center justify-center rounded-xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <Image
                src={`${LOGO_PATH}/${logo}`}
                alt={logo.replace(".svg", "")}
                width={120}
                height={60}
                unoptimized
                className="max-h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}