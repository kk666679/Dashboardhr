"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  FileText,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  User,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { LeaveBalance, LeaveRequest } from "./ess-service";

const leaveTypeColors: Record<string, string> = {
  ANNUAL: "bg-blue-100 text-blue-800",
  SICK: "bg-red-100 text-red-800",
  PERSONAL: "bg-purple-100 text-purple-800",
  EMERGENCY: "bg-orange-100 text-orange-800",
  UNPAID: "bg-gray-100 text-gray-800",
};

const leaveStatusConfig = {
  PENDING: {
    icon: Clock,
    color: "text-yellow-600",
    variant: "secondary" as const,
  },
  APPROVED: {
    icon: CheckCircle,
    color: "text-green-600",
    variant: "default" as const,
  },
  REJECTED: {
    icon: XCircle,
    color: "text-red-600",
    variant: "destructive" as const,
  },
  CANCELLED: {
    icon: XCircle,
    color: "text-gray-500",
    variant: "outline" as const,
  },
};

interface LeaveBalanceCardProps {
  balance: LeaveBalance;
}

export function LeaveBalanceCard({ balance }: LeaveBalanceCardProps) {
  const usedPct = Math.round((balance.used / balance.totalAllowed) * 100);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge
            className={
              leaveTypeColors[balance.leaveType] ?? "bg-gray-100 text-gray-800"
            }
          >
            {balance.leaveType}
          </Badge>
          <span className="text-xs text-muted-foreground">{balance.year}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold">{balance.available}</span>
            <span className="text-sm text-muted-foreground">
              {" "}
              / {balance.totalAllowed} days
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {balance.used} used
          </span>
        </div>
        <Progress value={usedPct} className="h-1.5" />
        {balance.pending > 0 && (
          <p className="text-xs text-yellow-600">
            {balance.pending} day(s) pending approval
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface LeaveRequestItemProps {
  request: LeaveRequest;
}

export function LeaveRequestItem({ request }: LeaveRequestItemProps) {
  const cfg = leaveStatusConfig[request.status];
  const Icon = cfg.icon;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border">
      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.color}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <Badge className={`${leaveTypeColors[request.leaveType]} text-xs`}>
            {request.leaveType}
          </Badge>
          <Badge variant={cfg.variant} className="text-xs">
            {request.status}
          </Badge>
        </div>
        <p className="text-sm mt-1">
          {new Date(request.startDate).toLocaleDateString()} —{" "}
          {new Date(request.endDate).toLocaleDateString()}
          <span className="text-muted-foreground ml-1">
            ({request.numberOfDays} days)
          </span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {request.reason}
        </p>
      </div>
    </div>
  );
}

interface ESSPortalProps {
  employeeName?: string;
  leaveBalances?: LeaveBalance[];
  leaveRequests?: LeaveRequest[];
  loading?: boolean;
  onRequestLeave?: () => void;
  onDownloadPayslip?: () => void;
}

export function ESSPortal({
  employeeName = "Employee",
  leaveBalances = [],
  leaveRequests = [],
  loading,
  onRequestLeave,
  onDownloadPayslip,
}: ESSPortalProps) {
  return (
    <div className="space-y-6">
      {/* Profile strip */}
      <div className="flex items-center gap-4 p-4 rounded-xl border bg-muted/30">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {employeeName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{employeeName}</p>
          <p className="text-sm text-muted-foreground">
            Employee Self-Service Portal
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={onDownloadPayslip}
          >
            <Download className="h-3 w-3 mr-1" /> Payslip
          </Button>
          <Button size="sm" className="h-8 text-xs" onClick={onRequestLeave}>
            <Calendar className="h-3 w-3 mr-1" /> Request Leave
          </Button>
        </div>
      </div>

      <Tabs defaultValue="leave">
        <TabsList>
          <TabsTrigger value="leave">
            <Calendar className="h-3.5 w-3.5 mr-1.5" /> Leave
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-3.5 w-3.5 mr-1.5" /> Documents
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="h-3.5 w-3.5 mr-1.5" /> Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leave" className="space-y-4">
          {/* Balances */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Leave Balances</h3>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {leaveBalances.map((b, i) => (
                  <LeaveBalanceCard key={i} balance={b} />
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* History */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Leave History</h3>
            {loading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : leaveRequests.length > 0 ? (
              <ScrollArea className="h-48">
                <div className="space-y-2 pr-2">
                  {leaveRequests.map((r) => (
                    <LeaveRequestItem key={r.id} request={r} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                No leave requests found
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Upload and manage your documents here</p>
              <Button size="sm" variant="outline" className="mt-4">
                Upload Document
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <User className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">
                View and update your profile information
              </p>
              <Button size="sm" variant="outline" className="mt-4">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
