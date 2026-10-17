"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  TrendingDown,
  ShieldCheck,
  BarChart3,
  Star,
  Puzzle,
} from "lucide-react";

/* ================================================================== */
/*  1. Outcomes data                                                   */
/* ================================================================== */

const OUTCOMES = [
  {
    icon: Zap,
    metric: "Faster productivity",
    label: "Shorter time-to-productivity, fewer support requests",
    color: "text-blue-400",
  },
  {
    icon: TrendingDown,
    metric: "Lower operating cost",
    label: "Reduce manual work and duplicated systems",
    color: "text-emerald-400",
  },
  {
    icon: ShieldCheck,
    metric: "Stronger compliance",
    label: "Less policy and regulatory exposure",
    color: "text-violet-400",
  },
  {
    icon: BarChart3,
    metric: "Better decisions",
    label: "Confident hiring, capacity, and spend decisions",
    color: "text-amber-400",
  },
  {
    icon: Star,
    metric: "Reliable services",
    label: "Higher satisfaction, less operational disruption",
    color: "text-rose-400",
  },
  {
    icon: Puzzle,
    metric: "Enterprise extensibility",
    label: "Lower integration friction and platform risk",
    color: "text-cyan-400",
  },
];

/* ================================================================== */
/*  2. OutcomesBar                                                     */
/* ================================================================== */

export function OutcomesBar({ className = "" }) {
  return (
    <section className={`border-y bg-muted/20 py-14 px-4 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Six outcomes that matter to enterprise buyers
        </p>

        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-3 lg:grid-cols-6">
          {OUTCOMES.map((item, i) => (
            <motion.div
              key={item.metric}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="flex flex-col items-center gap-2"
            >
              <item.icon className={`h-6 w-6 ${item.color}`} />
              <div className="text-sm font-semibold leading-tight text-foreground">
                {item.metric}
              </div>
              <div className="text-xs leading-snug text-muted-foreground">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  3. AiFWMSWorkflow (full SVG canvas)                                */
/* ================================================================== */

export function AiFWMSWorkflow({ className = "", style, ...props }) {
  // Unique ids so multiple instances on one page never clash.
  const uid = React.useId().replace(/:/g, "");
  const id = {
    dots: `dots-${uid}`,
    shadow: `shadow-${uid}`,
    arrow: `arrow-${uid}`,
    arrowBlue: `arrowBlue-${uid}`,
    title: `aifwms-title-${uid}`,
  };

  const svgStyle = {
    width: "100%",
    height: "auto",
    display: "block",
    ...style,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 900"
      fill="none"
      role="img"
      aria-labelledby={id.title}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      {...props}
      style={svgStyle}
    >
      <title id={id.title}>
        AiFWMS workflow — autonomous HR orchestration for the Malaysian foreign
        worker lifecycle
      </title>

      <defs>
        <pattern
          id={id.dots}
          width={24}
          height={24}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={2} cy={2} r={1.2} fill="#DCE4EF" />
        </pattern>

        <filter id={id.shadow} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow
            dx={0}
            dy={5}
            stdDeviation={8}
            floodColor="#24364B"
            floodOpacity={0.09}
          />
        </filter>

        <marker
          id={id.arrow}
          viewBox="0 0 10 10"
          refX={8.5}
          refY={5}
          markerWidth={7}
          markerHeight={7}
          orient="auto-start-reverse"
        >
          <path
            d="M1 1L9 5L1 9"
            stroke="#8A9AAF"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>

        <marker
          id={id.arrowBlue}
          viewBox="0 0 10 10"
          refX={8.5}
          refY={5}
          markerWidth={7}
          markerHeight={7}
          orient="auto"
        >
          <path
            d="M1 1L9 5L1 9"
            stroke="#3979E8"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>

        <style>
          {`
            text {
              font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            }
            .title { font-size: 27px; font-weight: 700; fill: #17283D; letter-spacing: -.5px; }
            .sub { font-size: 13px; fill: #6E7E91; }
            .node-title { font-size: 14px; font-weight: 650; fill: #203247; }
            .node-copy { font-size: 11px; fill: #718197; }
            .tag { font-size: 10px; font-weight: 650; letter-spacing: .45px; }
            .edge { stroke: #A9B6C6; stroke-width: 1.7; fill: none; marker-end: url(#${id.arrow}); }
            .edge-blue { stroke: #4A82E5; stroke-width: 1.8; fill: none; marker-end: url(#${id.arrowBlue}); }
          `}
        </style>
      </defs>

      {/* Background */}
      <rect width={1440} height={900} fill="#F7F9FC" />
      <rect width={1440} height={900} fill={`url(#${id.dots})`} opacity={0.72} />

      {/* ---------- Header ---------- */}
      <rect x={48} y={34} width={42} height={42} rx={13} fill="#3979E8" />
      <path
        d="M59 56.5L67 48.5L75 56.5M62 62L67 57L72 62"
        stroke="white"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={67} cy={44} r={2.5} fill="#BDE8DB" />

      <text x={104} y={54} className="title">
        {"AiFWMS workflow"}
      </text>
      <text x={104} y={76} className="sub">
        {"Autonomous HR orchestration \xB7 Malaysian foreign worker lifecycle"}
      </text>

      <rect
        x={1129}
        y={38}
        width={263}
        height={34}
        rx={17}
        fill="#EEF4FF"
        stroke="#D9E6FC"
      />
      <circle cx={1147} cy={55} r={4} fill="#3E81E8" />
      <text x={1159} y={59} fontSize={11} fontWeight={600} fill="#426B9D">
        {"WORKFLOW CANVAS"}
      </text>
      <text x={1304} y={59} fontSize={11} fill="#8797AA">
        {"xyflow / React Flow"}
      </text>

      {/* ---------- Section: Worker lifecycle ---------- */}
      <text
        x={58}
        y={137}
        fontSize={11}
        fontWeight={700}
        fill="#8090A3"
        letterSpacing={1.4}
      >
        {"WORKER LIFECYCLE"}
      </text>
      <line x1={58} y1={151} x2={1382} y2={151} stroke="#E3E9F0" />

      {/* ---------- Edges ---------- */}
      <path className="edge" d="M239 330H278" />
      <path className="edge" d="M459 330H498" />
      <path className="edge" d="M679 330H718" />
      <path className="edge" d="M899 330H938" />
      <path className="edge" d="M1119 330H1158" />

      <path className="edge-blue" d="M720 248V210H369V248" />
      <path className="edge-blue" d="M720 210H809V248" />
      <path className="edge-blue" d="M720 210H1249V248" />

      <path className="edge-blue" d="M720 412V512H369V548" />
      <path className="edge-blue" d="M809 412V512H809V548" />
      <path className="edge-blue" d="M1249 412V512H1249V548" />

      <path className="edge" d="M459 630H718" />
      <path className="edge" d="M899 630H1158" />

      {/* ---------- Orchestrator node ---------- */}
      <rect
        x={582}
        y={173}
        width={276}
        height={72}
        rx={15}
        fill="#EEF4FF"
        stroke="#AFC9FA"
        filter={`url(#${id.shadow})`}
      />
      <circle cx={614} cy={209} r={16} fill="#3979E8" />
      <path
        d="M614 199V219M604 209H624M607 202L621 216M621 202L607 216"
        stroke="white"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <text x={642} y={203} className="node-title" fill="#2458A8">
        {"Autonomous HR orchestrator"}
      </text>
      <text x={642} y={222} className="node-copy">
        {"Rules, reminders, tasks & lifecycle checks"}
      </text>
      <rect x={779} y={184} width={62} height={19} rx={9.5} fill="#DDEAFF" />
      <text x={810} y={197} textAnchor="middle" className="tag" fill="#3974CC">
        {"AI AGENT"}
      </text>

      {/* ---------- Lifecycle card backgrounds ---------- */}
      <g filter={`url(#${id.shadow})`}>
        <rect x={58} y={248} width={181} height={164} rx={14} fill="white" stroke="#DEE6EF" />
        <rect x={278} y={248} width={181} height={164} rx={14} fill="white" stroke="#DEE6EF" />
        <rect x={498} y={248} width={181} height={164} rx={14} fill="white" stroke="#DEE6EF" />
        <rect x={718} y={248} width={181} height={164} rx={14} fill="white" stroke="#DEE6EF" />
        <rect x={938} y={248} width={181} height={164} rx={14} fill="white" stroke="#DEE6EF" />
        <rect x={1158} y={248} width={181} height={164} rx={14} fill="white" stroke="#DEE6EF" />
      </g>

      {/* 1. Worker intake */}
      <circle cx={84} cy={278} r={14} fill="#EAF2FF" />
      <path
        d="M79 278H89M84 273V283M76.5 288C78.2 284.8 81 283.5 84 283.5C87 283.5 89.8 284.8 91.5 288"
        stroke="#3979E8"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <text x={107} y={276} className="node-title">{"Worker intake"}</text>
      <text x={76} y={316} className="node-copy">{"Create worker profile"}</text>
      <text x={76} y={334} className="node-copy">{"Capture employer & role"}</text>
      <rect x={76} y={367} width={101} height={22} rx={11} fill="#F0F4F8" />
      <text x={126.5} y={382} textAnchor="middle" className="tag" fill="#65778C">
        {"HR ONBOARDING"}
      </text>

      {/* 2. Documents & KYC */}
      <circle cx={304} cy={278} r={14} fill="#EAF7F3" />
      <path
        d="M299 271.5H306L310 275.5V285H299V271.5Z"
        stroke="#2F9B79"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M306 272V276H310M302 280H307M302 283H307"
        stroke="#2F9B79"
        strokeWidth={1.3}
        strokeLinecap="round"
      />
      <text x={327} y={276} className="node-title">{"Documents & KYC"}</text>
      <text x={296} y={316} className="node-copy">{"Collect passport, photos"}</text>
      <text x={296} y={334} className="node-copy">{"Verify records & details"}</text>
      <rect x={296} y={367} width={85} height={22} rx={11} fill="#EAF7F3" />
      <text x={338.5} y={382} textAnchor="middle" className="tag" fill="#288469">
        {"VERIFICATION"}
      </text>

      {/* 3. Permit & visa */}
      <circle cx={524} cy={278} r={14} fill="#FFF4E5" />
      <path
        d="M519 271.5H527L531 275.5V285H519V271.5Z"
        stroke="#D48B2F"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M526.5 272V276H531M522 280H528M522 283H527"
        stroke="#D48B2F"
        strokeWidth={1.3}
        strokeLinecap="round"
      />
      <text x={547} y={276} className="node-title">{"Permit & visa"}</text>
      <text x={516} y={316} className="node-copy">{"Track application stages"}</text>
      <text x={516} y={334} className="node-copy">{"Renewals & expiry alerts"}</text>
      <rect x={516} y={367} width={103} height={22} rx={11} fill="#FFF4E5" />
      <text x={567.5} y={382} textAnchor="middle" className="tag" fill="#B47828">
        {"IMMIGRATION"}
      </text>

      {/* 4. Attendance */}
      <circle cx={744} cy={278} r={14} fill="#F0EBFF" />
      <path
        d="M744 270.5V278L749 281"
        stroke="#7457CA"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={744} cy={278} r={8} stroke="#7457CA" strokeWidth={1.5} />
      <text x={767} y={276} className="node-title">{"Attendance"}</text>
      <text x={736} y={316} className="node-copy">{"GPS check-in & geofence"}</text>
      <text x={736} y={334} className="node-copy">{"Review timesheets"}</text>
      <rect x={736} y={367} width={87} height={22} rx={11} fill="#F0EBFF" />
      <text x={779.5} y={382} textAnchor="middle" className="tag" fill="#6F55BB">
        {"GEOLOCATION"}
      </text>

      {/* 5. Payroll */}
      <circle cx={964} cy={278} r={14} fill="#EAF7F3" />
      <rect
        x={957}
        y={272}
        width={14}
        height={12}
        rx={2}
        stroke="#2F9B79"
        strokeWidth={1.5}
      />
      <path
        d="M960 276H968M960 280H965"
        stroke="#2F9B79"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <text x={987} y={276} className="node-title">{"Payroll"}</text>
      <text x={956} y={316} className="node-copy">{"Calculate wages & OT"}</text>
      <text x={956} y={334} className="node-copy">{"Deductions & payslips"}</text>
      <rect x={956} y={367} width={88} height={22} rx={11} fill="#EAF7F3" />
      <text x={1000} y={382} textAnchor="middle" className="tag" fill="#288469">
        {"PAY RUN"}
      </text>

      {/* 6. Compliance & QMS */}
      <circle cx={1184} cy={278} r={14} fill="#EAF2FF" />
      <path
        d="M1184 270L1192 273V278C1192 283 1188.5 286 1184 288C1179.5 286 1176 283 1176 278V273L1184 270Z"
        stroke="#3979E8"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M1180.5 278L1183 280.5L1187.5 275.5"
        stroke="#3979E8"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x={1207} y={276} className="node-title">{"Compliance & QMS"}</text>
      <text x={1176} y={316} className="node-copy">{"Audit trails & evidence"}</text>
      <text x={1176} y={334} className="node-copy">{"ISO processes & controls"}</text>
      <rect x={1176} y={367} width={94} height={22} rx={11} fill="#EAF2FF" />
      <text x={1223} y={382} textAnchor="middle" className="tag" fill="#3974CC">
        {"ISO / QMS"}
      </text>

      {/* ---------- Section: Automation & governance ---------- */}
      <text
        x={58}
        y={482}
        fontSize={11}
        fontWeight={700}
        fill="#8090A3"
        letterSpacing={1.4}
      >
        {"AUTOMATION & GOVERNANCE"}
      </text>
      <line x1={58} y1={496} x2={1382} y2={496} stroke="#E3E9F0" />

      <g filter={`url(#${id.shadow})`}>
        <rect x={278} y={548} width={181} height={164} rx={14} fill="white" stroke="#DEE6EF" />
        <rect x={718} y={548} width={181} height={164} rx={14} fill="white" stroke="#DEE6EF" />
        <rect x={1158} y={548} width={181} height={164} rx={14} fill="white" stroke="#DEE6EF" />
      </g>

      {/* 7. Exception review */}
      <circle cx={304} cy={578} r={14} fill="#FFF4E5" />
      <path
        d="M304 570.5V579L309 582"
        stroke="#D48B2F"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <circle cx={304} cy={578} r={8} stroke="#D48B2F" strokeWidth={1.5} />
      <text x={327} y={576} className="node-title">{"Exception review"}</text>
      <text x={296} y={616} className="node-copy">{"Flag missing or expired"}</text>
      <text x={296} y={634} className="node-copy">{"Route to HR for action"}</text>
      <rect x={296} y={667} width={96} height={22} rx={11} fill="#FFF4E5" />
      <text x={344} y={682} textAnchor="middle" className="tag" fill="#B47828">
        {"HUMAN REVIEW"}
      </text>

      {/* 8. Approvals & tasks */}
      <circle cx={744} cy={578} r={14} fill="#EAF7F3" />
      <path
        d="M738 573H750M738 578H750M738 583H747"
        stroke="#2F9B79"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <text x={767} y={576} className="node-title">{"Approvals & tasks"}</text>
      <text x={736} y={616} className="node-copy">{"Assign owners & due dates"}</text>
      <text x={736} y={634} className="node-copy">{"Notify teams automatically"}</text>
      <rect x={736} y={667} width={87} height={22} rx={11} fill="#EAF7F3" />
      <text x={779.5} y={682} textAnchor="middle" className="tag" fill="#288469">
        {"ORCHESTRATION"}
      </text>

      {/* 9. Audit & reporting */}
      <circle cx={1184} cy={578} r={14} fill="#F0EBFF" />
      <path
        d="M1179 571.5H1187L1190 574.5V585H1179V571.5Z"
        stroke="#7457CA"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M1182 578H1187M1182 581H1187"
        stroke="#7457CA"
        strokeWidth={1.3}
        strokeLinecap="round"
      />
      <text x={1207} y={576} className="node-title">{"Audit & reporting"}</text>
      <text x={1176} y={616} className="node-copy">{"Keep evidence and history"}</text>
      <text x={1176} y={634} className="node-copy">{"Monitor compliance status"}</text>
      <rect x={1176} y={667} width={91} height={22} rx={11} fill="#F0EBFF" />
      <text x={1221.5} y={682} textAnchor="middle" className="tag" fill="#6F55BB">
        {"AUDIT READY"}
      </text>

      {/* ---------- Connector handles ---------- */}
      <g fill="white" stroke="#A9B6C6" strokeWidth={1.5}>
        <circle cx={239} cy={330} r={4} />
        <circle cx={278} cy={330} r={4} />
        <circle cx={459} cy={330} r={4} />
        <circle cx={498} cy={330} r={4} />
        <circle cx={679} cy={330} r={4} />
        <circle cx={718} cy={330} r={4} />
        <circle cx={899} cy={330} r={4} />
        <circle cx={938} cy={330} r={4} />
        <circle cx={1119} cy={330} r={4} />
        <circle cx={1158} cy={330} r={4} />
        <circle cx={369} cy={248} r={4} />
        <circle cx={809} cy={248} r={4} />
        <circle cx={1249} cy={248} r={4} />
        <circle cx={369} cy={548} r={4} />
        <circle cx={809} cy={548} r={4} />
        <circle cx={1249} cy={548} r={4} />
      </g>

      {/* ---------- Footer ---------- */}
      <rect x={58} y={785} width={1324} height={1} fill="#E3E9F0" />
      <text x={58} y={815} fontSize={11} fill="#8391A3">
        {"A connected operating workflow for HR teams, employers and foreign workers in Malaysia."}
      </text>

      <rect
        x={1225}
        y={800}
        width={157}
        height={27}
        rx={13.5}
        fill="#FFFFFF"
        stroke="#E2E8F0"
      />
      <circle cx={1242} cy={813.5} r={4} fill="#36A27F" />
      <text x={1253} y={817} fontSize={10} fontWeight={600} fill="#68798D">
        {"LIFECYCLE ACTIVE"}
      </text>
    </svg>
  );
}

/* ================================================================== */
/*  4. Combined default export                                         */
/* ================================================================== */

export default function AiFWMSShowcase({ className = "" }) {
  return (
    <section className={`w-full bg-background ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-4 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm"
        >
          {/* Horizontal scroll on small screens keeps the diagram legible */}
          <div className="overflow-x-auto">
            <div className="min-w-[880px]">
              <AiFWMSWorkflow />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-12">
        <OutcomesBar />
      </div>
    </section>
  );
}
}
