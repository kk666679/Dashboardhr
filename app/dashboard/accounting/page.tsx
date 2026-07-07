"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  FileText,
  Truck,
  CreditCard,
  Receipt,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Download,
  Eye,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AccountingDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("current_month");

  // Mock data loading states
  const invoicesLoading = false;
  const reportsLoading = false;

  // Mock data for demonstration
  const accountingSummary = {
    totalRevenue: 125000,
    totalExpenses: 89000,
    netProfit: 36000,
    outstandingInvoices: 45000,
    overdueInvoices: 12000,
    cashFlow: 78000,
  };

  const documentStats = {
    invoices: { total: 156, pending: 23, overdue: 8 },
    deliveryOrders: { total: 89, pending: 12, completed: 77 },
    creditNotes: { total: 15, processed: 12, pending: 3 },
    debitNotes: { total: 8, processed: 6, pending: 2 },
  };

  const recentTransactions = [
    {
      id: "INV-2024-001",
      type: "invoice",
      customer: "ABC Construction Sdn Bhd",
      amount: 15000,
      status: "paid",
      date: "2024-01-15",
      description: "Work permit processing - 25 workers",
    },
    {
      id: "DO-2024-045",
      type: "delivery_order",
      customer: "XYZ Manufacturing",
      amount: 8500,
      status: "delivered",
      date: "2024-01-14",
      description: "Accommodation supplies delivery",
    },
    {
      id: "CN-2024-003",
      type: "credit_note",
      customer: "DEF Services",
      amount: -2500,
      status: "processed",
      date: "2024-01-13",
      description: "Service cancellation refund",
    },
  ];

  const getStatusBadge = (status: string, type: string) => {
    const statusConfig = {
      paid: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      overdue: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
      delivered: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      processed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(amount);
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Accounting Dashboard
          </h1>
          <p className="text-muted-foreground">
            Financial management and Malaysian regulatory compliance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/accounting/reports">
              <Download className="mr-2 h-4 w-4" />
              Export Reports
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/accounting/invoices/create">
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Link>
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(accountingSummary.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(accountingSummary.netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Outstanding Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(accountingSummary.outstandingInvoices)}
            </div>
            <p className="text-xs text-muted-foreground">
              {documentStats.invoices.pending} pending invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overdue Amount
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(accountingSummary.overdueInvoices)}
            </div>
            <p className="text-xs text-muted-foreground">
              {documentStats.invoices.overdue} overdue invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Document Statistics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Document Overview</CardTitle>
            <CardDescription>
              Summary of all accounting documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Invoices</p>
                    <p className="text-sm text-muted-foreground">
                      {documentStats.invoices.pending} pending,{" "}
                      {documentStats.invoices.overdue} overdue
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {documentStats.invoices.total}
                  </p>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/accounting/invoices">
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Truck className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Delivery Orders</p>
                    <p className="text-sm text-muted-foreground">
                      {documentStats.deliveryOrders.pending} pending,{" "}
                      {documentStats.deliveryOrders.completed} completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {documentStats.deliveryOrders.total}
                  </p>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/accounting/delivery-orders">
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <CreditCard className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Credit Notes</p>
                    <p className="text-sm text-muted-foreground">
                      {documentStats.creditNotes.pending} pending processing
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {documentStats.creditNotes.total}
                  </p>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/accounting/credit-notes">
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Receipt className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Debit Notes</p>
                    <p className="text-sm text-muted-foreground">
                      {documentStats.debitNotes.pending} pending processing
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {documentStats.debitNotes.total}
                  </p>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/accounting/debit-notes">
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {transaction.type === "invoice" && (
                        <FileText className="h-4 w-4" />
                      )}
                      {transaction.type === "delivery_order" && (
                        <Truck className="h-4 w-4" />
                      )}
                      {transaction.type === "credit_note" && (
                        <CreditCard className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{transaction.id}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {transaction.customer}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    {getStatusBadge(transaction.status, transaction.type)}
                    <p className="text-xs text-muted-foreground mt-1">
                      {transaction.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                asChild
              >
                <Link href="/dashboard/accounting/reports">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Transactions
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Malaysian Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle>Malaysian Regulatory Compliance</CardTitle>
          <CardDescription>
            SST compliance and e-Invoice readiness status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <h4 className="font-medium">SST Compliance</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Month SST</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(7500)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Filing Status</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Up to Date
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next Filing Due</span>
                  <span className="text-sm font-medium">Feb 28, 2024</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">e-Invoice Readiness</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">System Integration</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Digital Certificates</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Installed
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">LHDN Registration</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Compliance Score</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Score</span>
                  <span className="text-lg font-bold text-green-600">96%</span>
                </div>
                <Progress value={96} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Excellent compliance with Malaysian regulations
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common accounting tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex-col space-y-2" asChild>
              <Link href="/dashboard/accounting/invoices/create">
                <FileText className="h-6 w-6" />
                <span>Create Invoice</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              asChild
            >
              <Link href="/dashboard/accounting/delivery-orders/create">
                <Truck className="h-6 w-6" />
                <span>New Delivery Order</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              asChild
            >
              <Link href="/dashboard/accounting/tax-calculator">
                <Calculator className="h-6 w-6" />
                <span>Tax Calculator</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              asChild
            >
              <Link href="/dashboard/accounting/reports">
                <TrendingUp className="h-6 w-6" />
                <span>Financial Reports</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
