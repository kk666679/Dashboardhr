"use client";
import type React from "react";
import {
  LayoutDashboard, Users, CreditCard, Calendar, Clock, FileText,
  Settings, Shield, UserPlus, UserMinus, Award, BookOpen, Briefcase,
  Building, MapPin, Layers, Bell, BarChart3, Database, Handshake,
  GraduationCap, Home, Truck, Plane, ShieldCheck, Heart, History,
  HeartPulse, Target, TrendingUp, CalendarDays, LogOut, Globe,
  Workflow, Bot, FolderOpen, FileSignature, Search, Wrench,
  ChevronRight, PieChart, Zap, Key, UserCheck, Network,
  Stethoscope, Warehouse, Bus, Scale, Flag, BookMarked,
  AlertTriangle, FileClock, Building2, Users2, LayoutGrid,
  FileSpreadsheet, Receipt, BanknoteIcon, Fingerprint, Cpu,
} from "lucide-react";
import { ROUTE } from "./route-mapping";

export interface SidebarItem {
  title:    string;
  href?:    string;
  icon?:    React.ComponentType<{ className?: string }>;
  children?: SidebarItem[];
  badge?:   string;
  hidden?:  boolean;
}

export interface NavGroup {
  label: string;
  items: SidebarItem[];
}

export const navGroups: NavGroup[] = [
  // ── Overview ────────────────────────────────────────────────────────────
  {
    label: "Overview",
    items: [
      { title: "Dashboard",  href: ROUTE.dashboard.root,      icon: LayoutDashboard },
      { title: "Analytics",  href: ROUTE.dashboard.analytics, icon: BarChart3 },
      {
        title: "Dashboards", icon: LayoutGrid,
        href:  ROUTE.dashboard.dashboards.root,
        children: [
          { title: "Executive",      href: ROUTE.dashboard.dashboards.executive },
          { title: "HR",             href: ROUTE.dashboard.dashboards.hr },
          { title: "Compliance",     href: ROUTE.dashboard.dashboards.compliance },
          { title: "Immigration",    href: ROUTE.dashboard.dashboards.immigration },
          { title: "Payroll",        href: ROUTE.dashboard.dashboards.payroll },
          { title: "Foreign Worker", href: ROUTE.dashboard.dashboards.foreignWorker },
          { title: "Expatriate",     href: ROUTE.dashboard.dashboards.expatriate },
          { title: "AI Operations",  href: ROUTE.dashboard.dashboards.aiOps },
        ],
      },
    ],
  },

  // ── Human Resources ─────────────────────────────────────────────────────
  {
    label: "Human Resources",
    items: [
      {
        title: "Employees", icon: Users,
        href:  ROUTE.dashboard.employees.root,
        children: [
          { title: "Directory",        href: ROUTE.dashboard.employees.directory },
          { title: "New Employee",     href: ROUTE.dashboard.employees.new },
          { title: "Org Chart",        href: ROUTE.dashboard.employees.orgChart },
          { title: "Skills Inventory", href: ROUTE.dashboard.employees.skillsInventory },
        ],
      },
      {
        title: "Recruitment", icon: Briefcase,
        href:  ROUTE.dashboard.recruitment.root,
        children: [
          { title: "Job Vacancies",  href: ROUTE.dashboard.recruitment.vacancies },
          { title: "Pipeline",       href: ROUTE.dashboard.recruitment.pipeline },
          { title: "Interviews",     href: ROUTE.dashboard.recruitment.interviews },
          { title: "Offers",         href: ROUTE.dashboard.recruitment.offers },
        ],
      },
      { title: "Onboarding",   href: ROUTE.dashboard.onboarding.root,  icon: UserPlus },
      { title: "Offboarding",  href: ROUTE.dashboard.offboarding.root, icon: LogOut },
      {
        title: "Attendance", icon: Clock,
        href:  ROUTE.dashboard.attendance.root,
        children: [
          { title: "Overview",    href: ROUTE.dashboard.attendance.root },
          { title: "Biometric",   href: ROUTE.dashboard.attendance.biometric },
          { title: "Correction",  href: ROUTE.dashboard.attendance.correction },
          { title: "Overtime",    href: ROUTE.dashboard.attendance.overtime },
          { title: "Roster",      href: ROUTE.dashboard.attendance.roster },
          { title: "Shifts",      href: ROUTE.dashboard.attendance.shifts },
        ],
      },
      {
        title: "Leave", icon: Calendar,
        href:  ROUTE.dashboard.leave.root,
        children: [
          { title: "Overview",   href: ROUTE.dashboard.leave.root },
          { title: "Apply",      href: ROUTE.dashboard.leave.apply },
          { title: "Balance",    href: ROUTE.dashboard.leave.balance },
          { title: "Calendar",   href: ROUTE.dashboard.leave.calendar },
          { title: "Approvals",  href: ROUTE.dashboard.leave.approvals },
          { title: "Policy",     href: ROUTE.dashboard.leave.policy },
        ],
      },
      {
        title: "Performance", icon: Award,
        href:  ROUTE.dashboard.performance.root,
        children: [
          { title: "Reviews",  href: ROUTE.dashboard.performance.root },
          { title: "Goals",    href: ROUTE.dashboard.performance.goals },
          { title: "KPIs",     href: ROUTE.dashboard.performance.kpis },
          { title: "New Review", href: ROUTE.dashboard.performance.new },
        ],
      },
      {
        title: "Learning & Dev", icon: GraduationCap,
        href:  ROUTE.dashboard.learningDevelopment.root,
        children: [
          { title: "Courses",          href: ROUTE.dashboard.learningDevelopment.courses },
          { title: "Learning Paths",   href: ROUTE.dashboard.learningDevelopment.paths },
          { title: "Certifications",   href: ROUTE.dashboard.learningDevelopment.certifications },
        ],
      },
      { title: "Succession",   href: ROUTE.dashboard.succession.root,          icon: Target },
      { title: "Organisation", href: ROUTE.dashboard.organisation.root,        icon: Building },
      { title: "Lifecycle",    href: ROUTE.dashboard.lifecycle.root,           icon: CalendarDays },
      { title: "Termination",  href: ROUTE.dashboard.termination.root,        icon: UserMinus },
    ],
  },

  // ── Foreign Worker Management ─────────────────────────────────────────────
  {
    label: "Foreign Workers",
    items: [
      {
        title: "Worker Directory", icon: Users2,
        href:  ROUTE.dashboard.foreignWorkers.root,
        children: [
          { title: "All Workers",     href: ROUTE.dashboard.foreignWorkers.directory },
          { title: "Quota Mgmt",      href: ROUTE.dashboard.foreignWorkers.quota },
          { title: "Levy",            href: ROUTE.dashboard.foreignWorkers.levy },
          { title: "FOMEMA",          href: ROUTE.dashboard.foreignWorkers.fomema },
          { title: "Insurance",       href: ROUTE.dashboard.foreignWorkers.insurance },
          { title: "Agency Mgmt",     href: ROUTE.dashboard.foreignWorkers.agency },
          { title: "Transport",       href: ROUTE.dashboard.foreignWorkers.transport },
          { title: "Expiry Calendar", href: ROUTE.dashboard.foreignWorkers.expiry },
        ],
      },
      {
        title: "Permits & Visas", icon: Truck,
        href:  ROUTE.dashboard.permits.root,
        children: [
          { title: "Overview",       href: ROUTE.dashboard.permits.root },
          { title: "Apply Permit",   href: ROUTE.dashboard.permits.apply },
          { title: "Passport Mgmt",  href: ROUTE.dashboard.permits.passport },
          { title: "PLKS",           href: ROUTE.dashboard.permits.plks },
          { title: "Work Permit",    href: ROUTE.dashboard.permits.workPermit },
          { title: "Special Pass",   href: ROUTE.dashboard.permits.specialPass },
          { title: "Visa Renewal",   href: ROUTE.dashboard.permits.visaRenewal },
          { title: "Bulk Renewal",   href: ROUTE.dashboard.permits.bulkRenewal },
          { title: "Levy Calculator",href: ROUTE.dashboard.permits.levyCalculator },
        ],
      },
      {
        title: "Medical", icon: Stethoscope,
        href:  ROUTE.dashboard.medical.root,
        children: [
          { title: "Dashboard",       href: ROUTE.dashboard.medical.root },
          { title: "FOMEMA",          href: ROUTE.dashboard.medical.fomema },
          { title: "Schedule Exam",   href: ROUTE.dashboard.medical.fomemaSchedule },
          { title: "Insurance",       href: ROUTE.dashboard.medical.insurance },
          { title: "Medical Centers", href: ROUTE.dashboard.medical.centers },
        ],
      },
      {
        title: "Accommodation", icon: Home,
        href:  ROUTE.dashboard.accommodation.root,
        children: [
          { title: "Overview",    href: ROUTE.dashboard.accommodation.root },
          { title: "Hostels",     href: ROUTE.dashboard.accommodation.hostels },
          { title: "Rooms",       href: ROUTE.dashboard.accommodation.rooms },
          { title: "Placement",   href: ROUTE.dashboard.accommodation.placement },
          { title: "Inspection",  href: ROUTE.dashboard.accommodation.inspection },
          { title: "Maintenance", href: ROUTE.dashboard.accommodation.maintenance },
          { title: "Utilities",   href: ROUTE.dashboard.accommodation.utilities },
        ],
      },
    ],
  },

  // ── Expatriates ───────────────────────────────────────────────────────────
  {
    label: "Expatriates",
    items: [
      {
        title: "Assignments", icon: Globe,
        href:  ROUTE.dashboard.expatriates.root,
        children: [
          { title: "Dashboard",        href: ROUTE.dashboard.expatriates.root },
          { title: "Employment Pass",  href: ROUTE.dashboard.expatriates.employmentPass },
          { title: "Dependant Pass",   href: ROUTE.dashboard.expatriates.dependantPass },
          { title: "Tax Equalization", href: ROUTE.dashboard.expatriates.taxEqualization },
          { title: "Relocation",       href: ROUTE.dashboard.expatriates.relocation },
          { title: "Housing",          href: ROUTE.dashboard.expatriates.housing },
          { title: "Schooling",        href: ROUTE.dashboard.expatriates.schooling },
          { title: "Expenses",         href: ROUTE.dashboard.expatriates.expenses },
          { title: "Global Payroll",   href: ROUTE.dashboard.expatriates.globalPayroll },
          { title: "Timeline",         href: ROUTE.dashboard.expatriates.timeline },
          { title: "Mobility Analytics",href: ROUTE.dashboard.expatriates.mobility },
        ],
      },
    ],
  },

  // ── Payroll ───────────────────────────────────────────────────────────────
  {
    label: "Payroll",
    items: [
      {
        title: "Payroll", icon: CreditCard,
        href:  ROUTE.dashboard.payroll.root,
        children: [
          { title: "Processing",   href: ROUTE.dashboard.payroll.run },
          { title: "Calendar",     href: ROUTE.dashboard.payroll.calendar },
          { title: "EPF",          href: ROUTE.dashboard.payroll.epf },
          { title: "SOCSO",        href: ROUTE.dashboard.payroll.socso },
          { title: "EIS",          href: ROUTE.dashboard.payroll.eis },
          { title: "PCB/Tax",      href: ROUTE.dashboard.payroll.pcb },
          { title: "HRD Corp",     href: ROUTE.dashboard.payroll.hrdCorp },
          { title: "Levy",         href: ROUTE.dashboard.payroll.levy },
          { title: "Payslips",     href: ROUTE.dashboard.payroll.payslips },
          { title: "Bank File",    href: ROUTE.dashboard.payroll.bankFile },
          { title: "Reports",      href: ROUTE.dashboard.payroll.reports },
          { title: "Audit",        href: ROUTE.dashboard.payroll.audit },
        ],
      },
      {
        title: "Comp & Benefits", icon: Award,
        href:  ROUTE.dashboard.compensationBenefits.root,
        children: [
          { title: "Overview",      href: ROUTE.dashboard.compensationBenefits.root },
          { title: "Salary Bands",  href: ROUTE.dashboard.compensationBenefits.salaryBands },
          { title: "Bonus Plans",   href: ROUTE.dashboard.compensationBenefits.bonusPlans },
          { title: "Equity",        href: ROUTE.dashboard.compensationBenefits.equity },
          { title: "Benchmarks",    href: ROUTE.dashboard.compensationBenefits.benchmarks },
        ],
      },
    ],
  },

  // ── Compliance ───────────────────────────────────────────────────────────
  {
    label: "Compliance",
    items: [
      {
        title: "Compliance", icon: Shield,
        href:  ROUTE.dashboard.compliance.root,
        children: [
          { title: "Dashboard",        href: ROUTE.dashboard.compliance.root },
          { title: "Audit Dashboard",  href: ROUTE.dashboard.compliance.auditDashboard },
          { title: "Compliance Score", href: ROUTE.dashboard.compliance.score },
          { title: "Requirements",     href: ROUTE.dashboard.compliance.requirements },
          { title: "Policy Library",   href: ROUTE.dashboard.compliance.policyLibrary },
          { title: "Risk Register",    href: ROUTE.dashboard.compliance.riskRegister },
          { title: "Corrective Actions",href: ROUTE.dashboard.compliance.corrective },
          { title: "Calendar",         href: ROUTE.dashboard.compliance.calendar },
          { title: "Regulatory Updates",href: ROUTE.dashboard.compliance.regulatory },
          { title: "New Audit",        href: ROUTE.dashboard.compliance.auditNew },
        ],
      },
      {
        title: "Health & Safety", icon: ShieldCheck,
        href:  ROUTE.dashboard.healthSafety.root,
      },
      {
        title: "Geolocation", icon: MapPin,
        href:  ROUTE.dashboard.geolocation.root,
        children: [
          { title: "Dashboard",     href: ROUTE.dashboard.geolocation.root },
          { title: "Live Tracking", href: ROUTE.dashboard.geolocation.liveTracking },
          { title: "Geofences",     href: ROUTE.dashboard.geolocation.geofences },
          { title: "Alerts",        href: ROUTE.dashboard.geolocation.alerts },
          { title: "History",       href: ROUTE.dashboard.geolocation.history },
          { title: "Analytics",     href: ROUTE.dashboard.geolocation.analytics },
        ],
      },
    ],
  },

  // ── AI Copilot ────────────────────────────────────────────────────────────
  {
    label: "AI Copilot",
    items: [
      {
        title: "AI Hub", icon: Bot,
        href:  ROUTE.dashboard.ai.root,
        children: [
          { title: "Chat",               href: ROUTE.dashboard.ai.chat },
          { title: "Workflow Builder",   href: ROUTE.dashboard.ai.workflowBuilder },
          { title: "Recommendations",    href: ROUTE.dashboard.ai.recommendations },
          { title: "Compliance Advisor", href: ROUTE.dashboard.ai.complianceAdvisor },
          { title: "Document Assistant", href: ROUTE.dashboard.ai.documentAssistant },
          { title: "Analytics",          href: ROUTE.dashboard.ai.analytics },
          { title: "Forecasting",        href: ROUTE.dashboard.ai.forecasting },
          { title: "HR Orchestrator",    href: ROUTE.dashboard.ai.hrOrchestrator },
          { title: "Agents",             href: ROUTE.dashboard.ai.agents },
        ],
      },
    ],
  },

  // ── Documents ─────────────────────────────────────────────────────────────
  {
    label: "Documents",
    items: [
      {
        title: "Documents", icon: FolderOpen,
        href:  ROUTE.dashboard.documents.root,
        children: [
          { title: "Repository",    href: ROUTE.dashboard.documents.repository },
          { title: "OCR Processing",href: ROUTE.dashboard.documents.ocr },
          { title: "AI Extraction", href: ROUTE.dashboard.documents.aiExtraction },
          { title: "Version History",href: ROUTE.dashboard.documents.versions },
          { title: "Digital Signature",href: ROUTE.dashboard.documents.signatures },
          { title: "Templates",     href: ROUTE.dashboard.documents.templates },
          { title: "Contracts",     href: ROUTE.dashboard.documents.contracts },
        ],
      },
    ],
  },

  // ── Reports ───────────────────────────────────────────────────────────────
  {
    label: "Reports",
    items: [
      {
        title: "Reports", icon: FileSpreadsheet,
        href:  ROUTE.dashboard.reports.root,
        children: [
          { title: "Workforce",   href: ROUTE.dashboard.reports.workforce },
          { title: "Payroll",     href: ROUTE.dashboard.reports.payroll },
          { title: "Compliance",  href: ROUTE.dashboard.reports.compliance },
          { title: "Immigration", href: ROUTE.dashboard.reports.immigration },
          { title: "Financial",   href: ROUTE.dashboard.reports.financial },
          { title: "ESG",         href: ROUTE.dashboard.reports.esg },
          { title: "Executive",   href: ROUTE.dashboard.reports.executive },
        ],
      },
    ],
  },

  // ── Workflows ─────────────────────────────────────────────────────────────
  {
    label: "Workflows",
    items: [
      {
        title: "Workflows", icon: Workflow,
        href:  ROUTE.dashboard.workflows.root,
        children: [
          { title: "Approvals",  href: ROUTE.dashboard.workflows.approvals },
          { title: "Builder",    href: ROUTE.dashboard.workflows.builder },
          { title: "Monitor",    href: ROUTE.dashboard.workflows.monitor },
          { title: "Templates",  href: ROUTE.dashboard.workflows.templates },
          { title: "Triggers",   href: ROUTE.dashboard.workflows.triggers },
        ],
      },
      { title: "SOPs",           href: ROUTE.dashboard.sops.root,              icon: FileText },
      { title: "Workforce Plan", href: ROUTE.dashboard.workforcePlanning.root, icon: Layers },
      { title: "Scheduling",     href: ROUTE.dashboard.scheduling.root,        icon: CalendarDays },
    ],
  },

  // ── Relations ─────────────────────────────────────────────────────────────
  {
    label: "Relations",
    items: [
      { title: "Employee Relations",   href: ROUTE.dashboard.employeeRelations.root,   icon: Handshake },
      { title: "Industrial Relations", href: ROUTE.dashboard.industrialRelations.root, icon: Scale },
      { title: "Travel",               href: ROUTE.dashboard.travel.root,              icon: Plane },
    ],
  },

  // ── Administration ─────────────────────────────────────────────────────────
  {
    label: "Administration",
    items: [
      {
        title: "Admin", icon: Settings,
        href:  ROUTE.dashboard.admin.root,
        children: [
          { title: "Users",            href: ROUTE.dashboard.admin.users },
          { title: "Roles",            href: ROUTE.dashboard.admin.roles },
          { title: "Permissions",      href: ROUTE.dashboard.admin.permissions },
          { title: "Departments",      href: ROUTE.dashboard.admin.departments },
          { title: "Locations",        href: ROUTE.dashboard.admin.locations },
          { title: "Companies",        href: ROUTE.dashboard.admin.companies },
          { title: "Business Units",   href: ROUTE.dashboard.admin.businessUnits },
          { title: "Workflow Config",  href: ROUTE.dashboard.admin.workflowConfig },
          { title: "AI Settings",      href: ROUTE.dashboard.admin.aiSettings },
          { title: "API Integrations", href: ROUTE.dashboard.admin.apiIntegrations },
          { title: "Notifications",    href: ROUTE.dashboard.admin.notifications },
          { title: "Audit Logs",       href: ROUTE.dashboard.admin.auditLogs },
          { title: "System Health",    href: ROUTE.dashboard.admin.systemHealth },
        ],
      },
      {
        title: "Integrations", icon: Network,
        href:  ROUTE.dashboard.integrations.root,
        children: [
          { title: "Government",  href: ROUTE.dashboard.integrations.government },
          { title: "Biometric",   href: ROUTE.dashboard.integrations.biometric },
          { title: "Accounting",  href: ROUTE.dashboard.integrations.accounting },
          { title: "Banking",     href: ROUTE.dashboard.integrations.banking },
          { title: "Webhooks",    href: ROUTE.dashboard.integrations.webhooks },
          { title: "Sync Jobs",   href: ROUTE.dashboard.integrations.syncJobs },
        ],
      },
      { title: "Notifications", href: ROUTE.dashboard.notifications.root, icon: Bell, badge: "3" },
      { title: "Audit Trail",   href: ROUTE.dashboard.auditTrail.root,   icon: History },
      { title: "Security",      href: ROUTE.dashboard.security.root,     icon: ShieldCheck },
      { title: "Data Governance",href: ROUTE.dashboard.dataGovernance.root, icon: Database },
      {
        title: "Settings", icon: Settings,
        href:  ROUTE.dashboard.settings.root,
        children: [
          { title: "General",      href: ROUTE.dashboard.settings.root },
          { title: "Avatar",       href: ROUTE.dashboard.settings.avatar },
          { title: "MFA",          href: ROUTE.dashboard.settings.mfa },
          { title: "API Keys",     href: ROUTE.dashboard.settings.apiKeys },
          { title: "Subscription", href: ROUTE.dashboard.settings.subscription },
          { title: "Pricing",      href: ROUTE.dashboard.settings.pricing },
        ],
      },
    ],
  },
];

// Legacy flat export for backwards compatibility
export const sidebarItems = navGroups.flatMap((g) => g.items);
