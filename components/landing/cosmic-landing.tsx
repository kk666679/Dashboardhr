"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileCheck2, LayoutDashboard, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const outcomes = [
  { label: "Centralized workforce data", icon: UsersRound },
  { label: "Compliance visibility", icon: FileCheck2 },
  { label: "Faster approvals", icon: ArrowRight },
];

const workforceRows = [
  { label: "Workforce overview", value: "1,248", detail: "Employees" },
  { label: "Documents expiring", value: "18", detail: "Needs attention" },
  { label: "Pending approvals", value: "07", detail: "Across 4 teams" },
];

export default function CosmicLanding() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 pt-28 text-white sm:pt-36">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_18%,rgba(37,99,235,0.24),transparent_32%),radial-gradient(circle_at_12%_80%,rgba(14,165,233,0.12),transparent_30%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-slate-950 to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-28">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1.5 text-xs font-medium tracking-wide text-sky-100">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Workforce operations for Malaysian enterprises
          </div>

          <h1 className="max-w-xl text-pretty text-4xl font-semibold tracking-tight sm:text-6xl sm:leading-[1.05]">
            Unify work. Empower people. <span className="text-sky-300">Move faster.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-slate-300 sm:text-lg">
            AiFWMS brings HR, foreign-worker administration, expatriate processes, compliance, and workforce operations into one clear platform.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-sky-400 px-6 text-slate-950 hover:bg-sky-300">
              <Link href="/dashboard">
                Request a demo
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white">
              <Link href="/employees/onboarding">Explore the platform</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
            {outcomes.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-start gap-2 text-sm leading-5 text-slate-300">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <div className="absolute -inset-8 rounded-[2rem] bg-sky-400/10 blur-3xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/90 shadow-2xl shadow-sky-950/40 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Image src="/logo.svg" alt="" width={24} height={24} aria-hidden="true" />
                Workforce overview
              </div>
              <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300">Live view</span>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Total workforce</p>
                    <p className="mt-1 text-3xl font-semibold tracking-tight">1,248</p>
                  </div>
                  <div className="rounded-lg bg-sky-400/10 p-2.5 text-sky-300"><LayoutDashboard className="size-5" /></div>
                </div>
                <div className="mt-6 flex h-24 items-end gap-2" aria-label="Illustrative workforce activity chart">
                  {[34, 52, 44, 68, 58, 78, 70, 88, 82, 96].map((height, index) => (
                    <div key={index} className="flex-1 rounded-t bg-sky-400/70" style={{ height: `${height}%` }} />
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-400">Activity across connected teams</p>
              </div>
              <div className="flex flex-col gap-3">
                {workforceRows.map((row) => (
                  <div key={row.label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs text-slate-400">{row.label}</p>
                    <div className="mt-1 flex items-end justify-between gap-2">
                      <span className="text-2xl font-semibold">{row.value}</span>
                      <span className="text-right text-xs text-slate-400">{row.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-white/10 bg-white/[0.03] px-5 py-3 text-xs text-slate-400">
              Illustrative product view — tailored workflows are configured during implementation.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
