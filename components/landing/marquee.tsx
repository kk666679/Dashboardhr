"use client";

import Image from "next/image";
import Marquee from "@/components/ui/marquee";

const logos = [
  "Apache Kafka_dark.svg",
  "Apache Kafka_light.svg",
  "Framer_dark.svg",
  "Framer_light.svg",
  "GitHub_dark.svg",
  "GitHub_light.svg",
  "Google Play_wordmark_dark.svg",
  "Google Play_wordmark_light.svg",
  "Manus_wordmark_dark.svg",
  "Manus_wordmark_light.svg",
  "Mermaid_dark.svg",
  "Mermaid_light.svg",
  "React_dark.svg",
  "React_light.svg",
  "Vercel_dark.svg",
  "Vercel_light.svg",
  "adobe-sign.svg",
  "aliexpress-icon.svg",
  "alipay-svgrepo-com.svg",
  "amazonpay-svgrepo-com.svg",
  "appstore.svg",
  "authjs.svg",
  "aws.svg",
  "azurefunctions-ar21~bgwhite.svg",
  "azurefunctions-icon.svg",
  "binance.svg",
  "bing.svg",
  "blackbox.svg",
  "bnb.svg",
  "bootstrap.svg",
  "btc.svg",
  "bullmq-dark.svg",
  "bullmq-default.svg",
  "chrome.svg",
  "chromium.svg",
  "cloudflare.svg",
  "coinbase.svg",
  "coinmerce-svgrepo-com.svg",
  "csharp.svg",
  "discord.svg",
  "docker.svg",
  "doge.svg",
  "dotenvx.svg",
  "dotnet.svg",
  "dribbble.svg",
  "dynamics365-svgrepo-com.svg",
  "edge.svg",
  "eth.svg",
  "eve_dark.svg",
  "eve_light.svg",
  "facebook-icon.svg",
  "fastapi.svg",
  "firefox.svg",
  "google.svg",
  "logo.svg",
  "materialui.svg",
  "matic.svg",
  "messenger.svg",
  "meta.svg",
  "metamask.svg",
  "microsoft-ar21.svg",
  "microsoft-ar21~bgwhite.svg",
  "microsoft-copilot.svg",
  "microsoft-excel.svg",
  "microsoft-icon.svg",
  "microsoft-office.svg",
  "microsoft.svg",
  "microsoft_azure-ar21.svg",
  "microsoft_azure-ar21~bgwhite.svg",
  "microsoft_azure-icon.svg",
  "neon.svg",
  "nestjs.svg",
  "nextjs_icon_dark.svg",
  "nginx.svg",
  "opensea.svg",
  "opera.svg",
  "oracle-ar21.svg",
  "oracle-ar21~bgwhite.svg",
  "oracle-icon.svg",
  "oracle-otm.svg",
  "paytm-for-business-svgrepo-com.svg",
  "pinterest.svg",
  "playwright.svg",
  "pnpm_wordmark_dark.svg",
  "pnpm_wordmark_light.svg",
  "postgresql.svg",
  "postman.svg",
  "prisma.svg",
  "safari.svg",
  "salesforce-2.svg",
  "sample-logo.svg",
  "sap-ar21.svg",
  "sap-ar21~bgwhite.svg",
  "sap-icon.svg",
  "skype.svg",
  "slack.svg",
  "tailwindcss.svg",
  "tanstack.svg",
  "trpc.svg",
  "typescript.svg",
  "whatsapp-icon.svg",
  "woocommerce-svgrepo-com.svg",
];

export function LogosMarquee() {
  return (
    <Marquee duration={45} className="py-4">
      <div className="mx-6 flex h-16 w-32 shrink-0 items-center justify-center rounded-lg border border-border bg-background px-4">
        <Image
          src="/platform-logo-svg/"
          alt="Platform logo"
          width={120}
          height={48}
          unoptimized
          className="max-h-10 w-auto object-contain grayscale transition duration-300 hover:grayscale-0 hover:scale-110"
        />
      </div>
      {logos.map((logo) => (
        <div
          key={logo}
          className="mx-6 flex h-16 w-32 shrink-0 items-center justify-center rounded-lg border border-border bg-background px-4"
        >
          <Image
            src={`/platform-logo-svg/${logo}`}
            alt={logo.replace(".svg", "")}
            width={120}
            height={48}
            unoptimized
            className="max-h-10 w-auto object-contain grayscale transition duration-300 hover:grayscale-0 hover:scale-110"
          />
        </div>
      ))}
    </Marquee>
  );
}

export default Marquee;

