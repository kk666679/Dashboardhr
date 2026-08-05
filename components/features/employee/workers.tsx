"use client";

import {
  containerVariants,
  itemVariants,
  cardHoverVariants,
  pulseVariants,
  floatingVariants,
  scanVariants,
  radarVariants,
  slideUpVariants,
} from "@/lib/motion-variants";

import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2 as Building,
  Heart,
  Shield,
  Smartphone,
  Globe,
  Star,
  TrendingUp,
  Activity,
  Target,
  Award,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ROUTE } from "@/components/dashboard-sidebar/route-mapping";
import { useTranslation } from "@/hooks/useTranslation";

export function EnhancedAnimatedWorkers() {
  const { currentLanguage } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const statsRef = useRef(null);
  const workersRef = useRef(null);
  const actionsRef = useRef(null);

  const isStatsInView = useInView(statsRef, { once: true });
  const isWorkersInView = useInView(workersRef, { once: true });
  const isActionsInView = useInView(actionsRef, { once: true });

  const statsQuery = trpc.dashboard.getData.useQuery();
  const workersQuery = trpc.employee.list.useQuery();

  const statsLoading = statsQuery.isLoading;
  const workersLoading = workersQuery.isLoading;

  // Remove duplicate declarations - using mocks + query data below

  const handleRefresh = () => {
    setRefreshing(true);
    statsQuery.refetch();
    workersQuery.refetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const isLoading = workersLoading || statsLoading;
  const error = workersQuery.error;

  if (error) {
    return (
      <Alert>
        <AlertDescription>
          Failed to load workers: {error.message}.{" "}
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        {/* Workers Skeletons */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  interface Worker {
    id: string;
    name: string;
    nationality: string;
    position?: string;
    department?: string;
    status?: string;
    permitExpiry?: string;
    medicalStatus?: string;
    location?: string;
    phone?: string;
    email?: string;
    joinDate?: string;
    avatar?: string;
    rating?: number;
    completedTasks?: number;
    attendance?: number;
  }

  interface Stat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'warning' | 'live' | 'down';
  bgColor: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  count: number | null;
}

const mockWorkers: Worker[] = [
  {
    id: "W-2024-001",
    name: "Ahmad Rahman",
    nationality: "Bangladesh",
    position: "Construction Worker",
    department: "Site A",
    status: "active",
    permitExpiry: "2025-06-15",
    medicalStatus: "valid",
    location: "Construction Site A",
    phone: "+60123456789",
    email: "ahmad.rahman@company.com",
    joinDate: "2023-01-15",
    avatar: "/placeholder-user.jpg",
    rating: 4.8,
    completedTasks: 245,
    attendance: 96,
  },
  {
    id: "W-2024-002",
    name: "Kumar Patel",
    nationality: "India",
    position: "Machine Operator",
    department: "Manufacturing",
    status: "active",
    permitExpiry: "2025-08-20",
    medicalStatus: "valid",
    location: "Factory B",
    phone: "+60123456790",
    email: "kumar.patel@company.com",
    joinDate: "2023-03-10",
    avatar: "/placeholder-user.jpg",
    rating: 4.6,
    completedTasks: 189,
    attendance: 94,
  },
  {
    id: "W-2024-003",
    name: "Nguyen Van Duc",
    nationality: "Vietnam",
    position: "Quality Inspector",
    department: "QC Department",
    status: "on_leave",
    permitExpiry: "2025-12-01",
    medicalStatus: "pending",
    location: "On Leave",
    phone: "+60123456791",
    email: "nguyen.duc@company.com",
    joinDate: "2023-05-22",
    avatar: "/placeholder-user.jpg",
    rating: 4.9,
    completedTasks: 156,
    attendance: 98,
  },
  {
    id: "W-2024-004",
    name: "Rahman Ali",
    nationality: "Bangladesh",
    position: "Supervisor",
    department: "Site B",
    status: "alert",
    permitExpiry: "2025-02-28",
    medicalStatus: "expired",
    location: "Site B Office",
    phone: "+60123456792",
    email: "rahman.ali@company.com",
    joinDate: "2022-11-08",
    avatar: "/placeholder-user.jpg",
    rating: 4.7,
    completedTasks: 312,
    attendance: 92,
  },
];

const mockStats: Stat[] = [
  {
    title: 'Total Workers',
    value: '284',
    change: '+12 this month',
    trend: 'up',
    bgColor: 'bg-blue-100',
    color: 'text-blue-600',
    icon: Users,
  },
  {
    title: 'Active Permits',
    value: '267',
    change: '98%',
    trend: 'live',
    bgColor: 'bg-green-100',
    color: 'text-green-600',
    icon: Shield,
  },
  {
    title: 'Compliance Score',
    value: '97.4%',
    change: '+0.8%',
    trend: 'up',
    bgColor: 'bg-purple-100',
    color: 'text-purple-600',
    icon: TrendingUp,
  },
  {
    title: 'On Alerts',
    value: '8',
    change: '-2',
    trend: 'warning',
    bgColor: 'bg-orange-100',
    color: 'text-orange-600',
    icon: AlertTriangle,
  },
];

const workersData = (workersQuery.data as any)?.employees ?? mockWorkers;
const dashboardData = statsQuery.data;
const stats: Stat[] = dashboardData
  ? [
      {
        title: 'Total Workers',
        value: `${dashboardData.stats.total}`,
        change: `${dashboardData.stats.total ?? 0} total`,
        trend: 'live',
        bgColor: 'bg-blue-100',
        color: 'text-blue-600',
        icon: Users,
      },
      {
        title: 'Active Workers',
        value: `${dashboardData.stats.active}`,
        change: 'Currently active',
        trend: 'up',
        bgColor: 'bg-green-100',
        color: 'text-green-600',
        icon: Shield,
      },
      {
        title: 'Foreign Workers',
        value: `${dashboardData.stats.foreign}`,
        change: 'Requires permits',
        trend: 'warning',
        bgColor: 'bg-orange-100',
        color: 'text-orange-600',
        icon: AlertTriangle,
      },
      {
        title: 'Compliance',
        value: `${Math.round((dashboardData.stats.active / Math.max(dashboardData.stats.total, 1)) * 100)}%`,
        change: 'Active rate',
        trend: 'up',
        bgColor: 'bg-purple-100',
        color: 'text-purple-600',
        icon: TrendingUp,
      },
    ]
  : mockStats;

const filteredWorkers = workersData.filter((worker: Record<string, unknown>) =>
  (String(worker.name || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
  (String(worker.id || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
  (String(worker.department || '')).toLowerCase().includes(searchTerm.toLowerCase())
);

const getWorkerStatus = (worker: Record<string, unknown>): string => {
  if (worker.status && typeof worker.status === 'string') {
    return worker.status;
  }
  // For Employee type from Prisma
  const contracts = worker.contracts as Array<Record<string, unknown>> | undefined;
  if (contracts && contracts.length > 0) {
    const mainContract = contracts[0];
    if (mainContract.status === 'ACTIVE') {
      return 'active';
    } else {
      return 'inactive';
    }
  }
  // No contracts = terminated/inactive
  return 'inactive';
};

const quickActions: QuickAction[] = [
    {
      title: "Add New Worker",
      description: "Register a new foreign worker",
      icon: Plus,
      href: "/dashboard/workers/add",
      color: "from-blue-500 to-blue-600",
      count: null,
    },
    {
      title: "Bulk Import",
      description: "Import workers from Excel/CSV",
      icon: Download,
      href: "/dashboard/workers/import",
      color: "from-green-500 to-green-600",
      count: null,
    },
    {
      title: "Permit Renewals",
      description: "Process expiring permits",
      icon: RefreshCw,
      href: "/dashboard/permits/bulk-renewal",
      color: "from-orange-500 to-orange-600",
      count: 47,
    },
    {
      title: "Medical Checkups",
      description: "Schedule FOMEMA exams",
      icon: Heart,
      href: "/dashboard/medical",
      color: "from-red-500 to-red-600",
      count: 23,
    },
  ];

  // Filtering handled server-side via query params

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.h1
              className="text-4xl font-bold text-foreground mb-2 flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Users className="w-8 h-8 text-blue-600" />
              <span>Worker Management</span>
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Comprehensive foreign worker management and compliance tracking
            </motion.p>
          </div>

          <motion.div
            className="flex items-center space-x-3 mt-4 md:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <motion.div
                  animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                  transition={{
                    duration: 1,
                    repeat: refreshing ? Infinity : 0,
                    ease: "linear" as const,
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                <span>Refresh</span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="flex items-center space-x-2" asChild>
                <Link href={ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.workers.add)}>
                  <Plus className="w-4 h-4" />
                  <span>Add Worker</span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
        >
          {stats.map((stat: Stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover="hover"
            >
              <Card className="relative overflow-hidden border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-50 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring" as const, stiffness: 300 }}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </motion.div>
                    {stat.trend === "live" && (
                      <motion.div
                        className="flex items-center space-x-1"
                        animate={{ scale: [1, 1.1, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs text-green-600 font-medium">
                          LIVE
                        </span>
                      </motion.div>
                    )}
                  </div>
                  <motion.div
                    className="text-3xl font-bold text-foreground mb-1"
                    initial={{ scale: 0 }}
                    animate={isStatsInView ? { scale: 1 } : { scale: 0 }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring" as const,
                      stiffness: 200,
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {stat.title}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "warning"
                          ? "text-orange-600"
                          : stat.trend === "live"
                            ? "text-green-600"
                            : "text-blue-600"
                    }`}
                  >
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              placeholder="Search workers by name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card shadow-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="alert">Alert</option>
            </select>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          ref={actionsRef}
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={
            isActionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Quick Actions
          </h2>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate={isActionsInView ? "visible" : "hidden"}
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={action.href}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10`}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{
                            type: "spring" as const,
                            stiffness: 300,
                          }}
                        >
                          <action.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        {action.count && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.5,
                            }}
                          >
                            <Badge className="bg-red-500 text-white">
                              {action.count}
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Workers Grid */}
        <motion.div
          ref={workersRef}
          initial={{ opacity: 0, y: 20 }}
          animate={
            isWorkersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
Workers ({filteredWorkers.filter((w: Record<string, unknown>) => getWorkerStatus(w) === 'active').length})
            </h2>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                {stats.find(s => s.title === 'Total Workers')?.value ?? '0'} Active
              </Badge>
              <Badge className="bg-orange-100 text-orange-800">
                {stats.find(s => s.title === 'On Alerts')?.value ?? '0'} Alerts
              </Badge>
            </div>
          </div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate={isWorkersInView ? "visible" : "hidden"}
          >
            <AnimatePresence>
              {filteredWorkers.map((worker: Worker, index: number) => (
                <motion.div
                  key={worker.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover="hover"
                  layout
                >
                  <Card
                    className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${
                      worker.status === "alert" ? "ring-2 ring-red-200" : ""
                    }`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-50 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <CardContent className="p-6 relative z-10">
                      {/* Worker Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{
                              type: "spring" as const,
                              stiffness: 300,
                            }}
                          >
                            <Avatar className="w-12 h-12 border-2 border-white shadow-lg">
                              <AvatarImage src={worker.avatar} />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {worker.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {worker.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {worker.id}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {worker.nationality}
                              </span>
                              <span className="text-xs text-muted-foreground/70">
                                •
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {worker.position}
                              </span>
                            </div>
                          </div>
                        </div>

                        <motion.div
                          animate={
                            worker.status === "alert"
                              ? { scale: [1, 1.1, 1] }
                              : {}
                          }
                          transition={{
                            duration: 1,
                            repeat: worker.status === "alert" ? Infinity : 0,
                          }}
                        >
                          <Badge
                            className={`${
                              worker.status === "active"
                                ? "bg-green-100 text-green-800"
                                : worker.status === "on_leave"
                                  ? "bg-blue-100 text-blue-800"
                                  : worker.status === "alert"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
{getWorkerStatus(worker as unknown as Record<string, unknown>).replace("_", " ").toUpperCase()}
                          </Badge>
                        </motion.div>
                      </div>

                      {/* Worker Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-semibold">
                              {worker.rating}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Rating
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold">
                            {worker.completedTasks}
                          </div>
                          <p className="text-xs text-muted-foreground">Tasks</p>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold">
                            {worker.attendance}%
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Attendance
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            Overall Performance
                          </span>
                          <span className="text-xs font-medium">
                            {Math.round(((worker.rating ?? 0) / 5) * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={((worker.rating ?? 0) / 5) * 100}
                          className="h-2"
                        />
                      </div>

                      {/* Worker Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Building className="w-4 h-4 text-muted-foreground/70" />
                          <span className="text-muted-foreground">
                            {worker.department}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground/70" />
                          <span className="text-muted-foreground">
                            {worker.location}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground/70" />
                          <span className="text-muted-foreground">
                            Permit expires: {worker.permitExpiry}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1"
                        >
                          <Button size="sm" className="w-full">
                            View Details
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4" />
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button size="sm" variant="outline">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </div>

                      {/* Alert Banner */}
                      {worker.status === "alert" && (
                        <motion.div
                          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-800">
                              {worker.medicalStatus === "expired"
                                ? "Medical certificate expired"
                                : "Attention required"}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
