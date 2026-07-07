"use client";

import React, { useState, useMemo } from 'react';
import {
  Globe,
  Users,
  Briefcase,
  Home,
  DollarSign,
  GraduationCap,
  Heart,
  Plane,
  Car,
  Shield,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Building2,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Plus,
  Download,
  Upload,
  Filter,
  Search,
  Award,
  Wallet,
  Target,
  Activity,
  UserCheck,
  BadgeCheck,
  Receipt,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useExpatriates } from '@/hooks/useExpatriates';
import ExpatriateList from '@/components/features/employee/expatriates/ExpatriateList';
import type { Expatriate } from '@/components/features/employee/types';
import { useRouter } from 'next/navigation';

type ViewMode = 'dashboard' | 'expatriates' | 'relocation' | 'tax';

const deriveEPStatus = (expat: Expatriate): 'Active' | 'Expiring Soon' | 'Renewal Required' => {
  const expiry = expat.employee?.visas?.[0]?.expiryDate;
  if (!expiry) return 'Active';
  const expiryDate = new Date(expiry);
  const monthsToExpiry = (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30);
  if (monthsToExpiry < 1) return 'Renewal Required';
  if (monthsToExpiry < 3) return 'Expiring Soon';
  return 'Active';
};

export default function ExpatriateManagement() {
  const router = useRouter();
  const { expatriates, stats, isLoading } = useExpatriates();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

  // Fallback demo data if no real data
  const displayExpatriates = expatriates.length > 0 ? expatriates : [];

  // Derived data for charts
  const nationalityData = useMemo(() => {
    const counts: Record<string, number> = {};
    displayExpatriates.forEach((expat) => {
      const nat = expat.employee?.nationality || 'Unknown';
      counts[nat] = (counts[nat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [displayExpatriates]);

  const statusData = useMemo(() => {
    const counts = (stats.byStatus || {}) as Record<string, number>;
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [stats]);

  const allowanceData = useMemo(() => {
    const totals: Record<string, number> = {};
    displayExpatriates.forEach((expat) => {
      expat.allowances?.forEach((allow: { type: string; amount: number }) => {
        totals[allow.type] = (totals[allow.type] || 0) + allow.amount;
      });
    });
    return Object.entries(totals).map(([name, amount]) => ({ name, amount }));
  }, [displayExpatriates]);

  const expiringSoon = displayExpatriates.filter(e => deriveEPStatus(e) === 'Expiring Soon').length;

  if (isLoading) {
    return <div className="flex items-center justify-center p-12">Loading expatriates...</div>;
  }

  const renderDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 space-y-6 lg:space-y-0">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center pb-2 space-x-4">
            <CardTitle className="text-lg">Total Expatriates</CardTitle>
            <Users className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center pb-2 space-x-4">
            <CardTitle className="text-lg">Expiring Soon</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">{expiringSoon}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Nationality Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={192}>
            <PieChart>
              <Pie data={nationalityData.slice(0, 5)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {nationalityData.slice(0, 5).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={192}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Allowances Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={192}>
            <PieChart>
              <Pie data={allowanceData.slice(0, 5)} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {allowanceData.slice(0, 5).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderExpatriates = () => (
    <ExpatriateList
      expatriates={displayExpatriates}
      onEdit={(id) => router.push(`/dashboard/expatriates/${id}`)}
      onRenew={(id) => router.push(`/dashboard/expatriates/${id}/visa-renewal`)}
    />
  );

  const renderRelocation = () => (
    <Card>
      <CardHeader>
        <CardTitle>Relocation Packages</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Relocation view (link to /onboarding)</p>
        <Button onClick={() => router.push('/dashboard/expatriates/onboarding/new')}>
          New Relocation
        </Button>
      </CardContent>
    </Card>
  );

  const renderTax = () => (
    <Card>
      <CardHeader>
        <CardTitle>Tax Profiles</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Malaysian Tax for Expats (183+ days = resident rates)</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expatriate Management</h1>
          <p className="text-muted-foreground">Real-time dashboard with TRPC data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Add Expat
          </Button>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="expatriates">Expatriates</TabsTrigger>
          <TabsTrigger value="relocation">Relocation</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
        </TabsList>
        <TabsContent value={viewMode} className="mt-0 space-y-4">
          {viewMode === 'dashboard' && renderDashboard()}
          {viewMode === 'expatriates' && renderExpatriates()}
          {viewMode === 'relocation' && renderRelocation()}
          {viewMode === 'tax' && renderTax()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
