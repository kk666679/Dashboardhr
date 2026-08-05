"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Users,
  UserCheck,
  Briefcase,
  Calendar,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

/* ─── Animated counter hook ───────────────────────────────────────────────── */
function useCountUp(target: number, duration = 900, enabled = true) {
  const [count, setCount] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) { setCount(target); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic
      setCount(Math.round(eased * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current !== null) cancelAnimationFrame(raf.current); };
  }, [target, duration, enabled]);

  return count;
}

/* ─── Sparkline ──────────────────────────────────────────────────────────── */
function Sparkline({
  data,
  color,
  className,
}: {
  data: number[];
  color: string;
  className?: string;
}) {
  const w = 64, h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);

  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <polyline
        points={points}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.7}
      />
      {/* Area fill */}
      <polygon
        points={`0,${h} ${points} ${(data.length - 1) * step},${h}`}
        fill={color}
        opacity={0.08}
      />
      {/* Last point dot */}
      <circle
        cx={(data.length - 1) * step}
        cy={h - ((data[data.length - 1] - min) / range) * (h - 4) - 2}
        r="2.5"
        fill={color}
        opacity={0.9}
      />
    </svg>
  );
}

/* ─── KPI tile ────────────────────────────────────────────────────────────── */
interface StatDef {
  key: string;
  title: string;
  raw: number;
  suffix?: string;
  prefix?: string;
  icon: React.ElementType;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  sparkData: number[];
  sparkColor: string;
}

function KpiTile({
  stat,
  index,
  reduced,
}: {
  stat: StatDef;
  index: number;
  reduced: boolean;
}) {
  const count = useCountUp(stat.raw, 900, !reduced);
  const display = `${stat.prefix ?? ""}${count.toLocaleString()}${stat.suffix ?? ""}`;

  const TrendIcon =
    stat.changeType === "positive"
      ? ArrowUpRight
      : stat.changeType === "negative"
        ? ArrowDownRight
        : Minus;

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 12 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={
        reduced
          ? undefined
          : {
              duration: 0.4,
              delay: index * 0.055,
              type: "spring",
              stiffness: 320,
              damping: 28,
            }
      }
      className={cn(
        "group relative flex flex-col gap-0 overflow-hidden",
        "bg-[var(--surface-1)] border border-[var(--border)]",
        "rounded-[var(--radius-lg)] p-4",
        "shadow-[var(--shadow-xs)]",
        "transition-[box-shadow,border-color,transform] duration-200 ease-out",
        "hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] hover:-translate-y-0.5",
        "cursor-default select-none",
      )}
    >
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-[var(--foreground-muted)] leading-tight">
          {stat.title}
        </p>
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-md)]",
            "transition-colors duration-200",
          )}
          style={{ background: `${stat.sparkColor}14` }}
          aria-hidden="true"
        >
          <stat.icon
            className="size-4"
            style={{ color: stat.sparkColor }}
          />
        </div>
      </div>

      {/* Value */}
      <div className="mt-3 text-[1.625rem] font-bold tracking-[-0.035em] leading-none tabular-nums text-[var(--foreground)]">
        {display}
      </div>

      {/* Change badge + sparkline */}
      <div className="mt-3 flex items-end justify-between gap-2">
        <div
          className={cn(
            "inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-[var(--radius-sm)]",
            stat.changeType === "positive" &&
              "bg-[var(--success-subtle)] text-[var(--success-foreground)]",
            stat.changeType === "negative" &&
              "bg-[var(--destructive-subtle)] text-[var(--destructive-foreground)]",
            stat.changeType === "neutral" &&
              "bg-[var(--surface-2)] text-[var(--foreground-muted)]",
          )}
        >
          <TrendIcon className="size-3" aria-hidden="true" />
          <span>{stat.change}</span>
        </div>

        <Sparkline
          data={stat.sparkData}
          color={stat.sparkColor}
          className="opacity-90 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export function ExecutiveOverview() {
  const { t } = useTranslation();
  const reduced = useReducedMotion() ?? false;

  const stats: StatDef[] = [
    {
      key: "total",
      title: t("dashboard.totalEmployees") as string || "Total Employees",
      raw: 150,
      icon: Users,
      change: "+12% vs last month",
      changeType: "positive",
      sparkData: [110, 118, 122, 128, 133, 140, 145, 150],
      sparkColor: "var(--brand)",
    },
    {
      key: "active",
      title: t("dashboard.activeEmployees") as string || "Active Employees",
      raw: 135,
      icon: UserCheck,
      change: "+8% vs last month",
      changeType: "positive",
      sparkData: [100, 105, 110, 115, 120, 125, 130, 135],
      sparkColor: "#22c55e",
    },
    {
      key: "departments",
      title: t("dashboard.totalDepartments") as string || "Departments",
      raw: 10,
      icon: Briefcase,
      change: "+2 this quarter",
      changeType: "positive",
      sparkData: [6, 7, 7, 8, 8, 9, 9, 10],
      sparkColor: "#a78bfa",
    },
    {
      key: "leave",
      title: t("dashboard.pendingLeave") as string || "Pending Leave",
      raw: 12,
      icon: Calendar,
      change: "-3 since yesterday",
      changeType: "negative",
      sparkData: [18, 16, 15, 17, 14, 15, 12, 12],
      sparkColor: "#f59e0b",
    },
    {
      key: "attendance",
      title: t("dashboard.attendanceRate") as string || "Attendance Rate",
      raw: 94,
      suffix: "%",
      icon: Clock,
      change: "+2% vs last week",
      changeType: "positive",
      sparkData: [88, 89, 90, 91, 91, 92, 93, 94],
      sparkColor: "#06b6d4",
    },
    {
      key: "holidays",
      title: t("dashboard.upcomingHolidays") as string || "Upcoming Holidays",
      raw: 3,
      icon: TrendingUp,
      change: "Next: 15 Mar",
      changeType: "neutral",
      sparkData: [2, 2, 3, 3, 2, 3, 3, 3],
      sparkColor: "#ec4899",
    },
  ];

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6"
      role="region"
      aria-label="Executive KPI overview"
    >
      {stats.map((stat, i) => (
        <KpiTile key={stat.key} stat={stat} index={i} reduced={reduced} />
      ))}
    </div>
  );
}
