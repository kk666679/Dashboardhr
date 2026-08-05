/**
 * config/nav/accounting.ts
 * Navigation sections for the Accounting product.
 */
import {
  FileText,
  Truck,
  Receipt,
  CreditCard,
  Calculator,
  Globe,
  TrendingUp,
  Wallet,
  BarChart3,
} from "lucide-react";
import type { NavSection } from "./types";

export const ACCOUNTING_NAV: NavSection[] = [
  {
    label: "Accounting",
    items: [
      { title: "Overview", href: "/accounting", icon: Wallet },
      {
        title: "Invoices", href: "/accounting/invoices", icon: FileText,
        children: [
          { title: "All Invoices", href: "/accounting/invoices" },
          { title: "Create Invoice", href: "/accounting/invoices/create" },
        ],
      },
      {
        title: "Delivery Orders", href: "/accounting/delivery-orders", icon: Truck,
        children: [
          { title: "All D.O.", href: "/accounting/delivery-orders" },
          { title: "Create D.O.", href: "/accounting/delivery-orders/create" },
        ],
      },
      { title: "Credit Notes", href: "/accounting/credit-notes", icon: Receipt },
      { title: "Debit Notes", href: "/accounting/debit-notes", icon: Receipt },
      { title: "Payroll", href: "/accounting/payroll", icon: CreditCard },
      { title: "Payroll Calculator", href: "/accounting/payroll-calculator", icon: Calculator },
      { title: "E-Invoice", href: "/accounting/e-invoice", icon: FileText },
      { title: "Financial Reports", href: "/accounting/reports", icon: BarChart3 },
      { title: "Tax Calculator", href: "/accounting/tax-calculator", icon: Calculator },
      { title: "Government Submissions", href: "/accounting/government-submissions", icon: Globe },
      { title: "Enhanced Dashboard", href: "/accounting/enhanced", icon: TrendingUp },
    ],
  },
];
