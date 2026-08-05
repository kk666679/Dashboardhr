/**
 * config/nav/dashboard.ts
 * Navigation sections for the main Dashboard product.
 */
import {
  LayoutDashboard,
  BarChart3,
  Users,
  UserPlus,
  Truck,
  UserMinus,
  Award,
  FileText,
  Shield,
  Database,
  CreditCard,
  HeartPulse,
  Home,
  Calendar,
  Bell,
  Settings,
  Building,
  MapPin,
  GraduationCap,
  Briefcase,
  Handshake,
  History,
  ShieldCheck,
  Heart,
  Target,
  Plane,
  Clock,
  TrendingUp,
  Layers,
  CalendarDays,
  LogOut,
} from "lucide-react";
import type { NavSection } from "./types";

export const DASHBOARD_NAV: NavSection[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Workforce",
    items: [
      {
        title: "Workers", href: "/dashboard/workers", icon: Users,
        children: [
          { title: "All Workers", href: "/dashboard/workers" },
          { title: "Add Worker", href: "/dashboard/workers/add" },
          { title: "Attendance Alert", href: "/dashboard/workers/attendance-alert" },
          { title: "Leave Request", href: "/dashboard/workers/leave-request" },
          { title: "Payroll Adjustment", href: "/dashboard/workers/payroll-adjustment" },
        ],
      },
      { title: "Onboarding", href: "/dashboard/onboarding", icon: UserPlus },
      { title: "Offboarding", href: "/dashboard/offboarding", icon: LogOut },
      { title: "Termination", href: "/dashboard/termination", icon: UserMinus },
      { title: "Leave Management", href: "/dashboard/leave", icon: Calendar },
    ],
  },
  {
    label: "Payroll & Finance",
    items: [
      {
        title: "Payroll", href: "/dashboard/payroll", icon: CreditCard,
        children: [
          { title: "Payroll Dashboard", href: "/dashboard/payroll" },
          { title: "Statutory", href: "/dashboard/payroll/statutory" },
        ],
      },
      { title: "Compensation & Benefits", href: "/dashboard/compensation-benefits", icon: Award },
      { title: "Benefits", href: "/dashboard/benefits", icon: Heart },
    ],
  },
  {
    label: "Compliance & Permits",
    items: [
      {
        title: "Compliance", href: "/dashboard/compliance", icon: Shield,
        children: [
          { title: "Dashboard", href: "/dashboard/compliance" },
          { title: "New Audit", href: "/dashboard/compliance/audit/new" },
          { title: "Zakat", href: "/dashboard/compliance/zakat" },
        ],
      },
      {
        title: "Permits & Visas", href: "/dashboard/permits", icon: Truck,
        children: [
          { title: "Permit Overview", href: "/dashboard/permits" },
          { title: "Apply Permit", href: "/dashboard/permits/apply" },
          { title: "Bulk Renewal", href: "/dashboard/permits/bulk-renewal" },
          { title: "Levy Calculator", href: "/dashboard/permits/levy-calculator" },
          { title: "Visa Renewal", href: "/dashboard/permits/visa-renewal" },
        ],
      },
      {
        title: "Medical / FOMEMA", href: "/dashboard/medical", icon: HeartPulse,
        children: [
          { title: "Medical Dashboard", href: "/dashboard/medical" },
          { title: "FOMEMA", href: "/dashboard/medical/fomema" },
          { title: "Schedule Exam", href: "/dashboard/medical/fomema/schedule" },
        ],
      },
      {
        title: "Accommodation", href: "/dashboard/accommodation", icon: Home,
        children: [
          { title: "Accommodation List", href: "/dashboard/accommodation" },
          { title: "Inspection", href: "/dashboard/accommodation/inspection" },
        ],
      },
      {
        title: "Geolocation", href: "/dashboard/geolocation", icon: MapPin,
        children: [
          { title: "Dashboard", href: "/dashboard/geolocation" },
          { title: "Live Tracking", href: "/dashboard/geolocation/live-tracking" },
          { title: "Geofences", href: "/dashboard/geolocation/geofences" },
          { title: "Alerts", href: "/dashboard/geolocation/alerts" },
          { title: "History", href: "/dashboard/geolocation/history" },
          { title: "Analytics", href: "/dashboard/geolocation/analytics" },
          { title: "Settings", href: "/dashboard/geolocation/settings" },
        ],
      },
      { title: "Health & Safety", href: "/dashboard/health-safety", icon: ShieldCheck },
    ],
  },
  {
    label: "Talent",
    items: [
      { title: "Recruitment", href: "/dashboard/recruitment", icon: Briefcase },
      { title: "Talent Acquisition", href: "/dashboard/talent-acquisition", icon: Briefcase },
      {
        title: "Performance", href: "/dashboard/performance", icon: Award,
        children: [
          { title: "Performance Reviews", href: "/dashboard/performance" },
          { title: "New Review", href: "/dashboard/performance/new" },
        ],
      },
      { title: "Learning & Development", href: "/dashboard/learning-development", icon: GraduationCap },
      { title: "Succession Planning", href: "/dashboard/succession", icon: Target },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "SOPs", href: "/dashboard/sops", icon: FileText,
        children: [
          { title: "SOP List", href: "/dashboard/sops" },
          { title: "Create SOP", href: "/dashboard/sops/new" },
        ],
      },
      { title: "Organisation", href: "/dashboard/organisation", icon: Building },
      { title: "Workforce Planning", href: "/dashboard/workforce-planning", icon: Layers },
      { title: "Scheduling", href: "/dashboard/scheduling", icon: CalendarDays },
      { title: "Employee Relations", href: "/dashboard/employee-relations", icon: Handshake },
      { title: "Industrial Relations", href: "/dashboard/industrial-relations", icon: Users },
      { title: "Documents", href: "/dashboard/documents", icon: FileText },
      { title: "Travel", href: "/dashboard/travel", icon: Plane },
      { title: "Lifecycle Events", href: "/dashboard/lifecycle", icon: Clock },
    ],
  },
  {
    label: "Admin",
    items: [
      { title: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: "3" },
      {
        title: "Settings", href: "/dashboard/settings", icon: Settings,
        children: [
          { title: "General", href: "/dashboard/settings" },
          { title: "Avatar", href: "/dashboard/settings/avatar" },
          { title: "Pricing", href: "/dashboard/settings/pricing" },
          { title: "Subscription", href: "/dashboard/settings/subscription" },
        ],
      },
      { title: "Subscription", href: "/dashboard/subscription", icon: TrendingUp },
      { title: "Audit Trail", href: "/dashboard/audit-trail", icon: History },
      { title: "Security", href: "/dashboard/security", icon: ShieldCheck },
      { title: "Data Governance", href: "/dashboard/data-governance", icon: Database },
      { title: "Admin", href: "/dashboard/admin", icon: Settings },
      { title: "PDF Generator", href: "/dashboard/pdf-generator", icon: FileText },
    ],
  },
];
