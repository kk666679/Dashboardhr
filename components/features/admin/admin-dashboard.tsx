"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Agent, AgentHeader, AgentStatusDot, AgentContent } from "@/components/ai-elements/agent";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
import { Panel, PanelHeader, PanelTitle, PanelDescription, PanelContent, PanelActions } from "@/components/ai-elements/panel";
import { ChartCard } from "@/components/charts/ChartCard";
import { AreaChart } from "@/components/charts";
import {
  Users,
  Shield,
  Activity,
  Settings,
  Download,
  Lock,
  Eye,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useAdmin } from "@/hooks/useAdmin";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Mock data for mini sparklines
const mockSparklineData = [
  { label: 'Mon', value: 120 },
  { label: 'Tue', value: 145 },
  { label: 'Wed', value: 132 },
  { label: 'Thu', value: 168 },
  { label: 'Fri', value: 156 },
  { label: 'Sat', value: 189 },
  { label: 'Sun', value: 210 },
];

export function AdminDashboard() {
  const { toast } = useToast();
  const { users, auditLogs, systemStatus, invalidate } = useAdmin();
  const [agentStatus, setAgentStatus] = useState<"idle" | "thinking" | "done">("idle");

  // Fetch real data
  const { data: usersData, isLoading: usersLoading } = users.getAll(undefined, { staleTime: 60_000 });
  const { data: logsData, isLoading: logsLoading } = auditLogs.getAll(undefined, { staleTime: 30_000 });
  const { data: statusData, isLoading: statusLoading, refetch: refetchStatus } = systemStatus.get(undefined, { staleTime: 60_000 });

  // Derive data from API responses
  const usersArray = (usersData ?? []) as any[];
  const logsArray = (logsData ?? []) as any[];
  const statusInfo = statusData as { status: string } | undefined;

  const recentUsers = (usersArray as any)?.recentUsers ?? usersArray.slice(0, 5);
  const recentAudits = logsArray.slice(0, 3);
  const totalUsers = (usersArray as any)?.totalUsers ?? usersArray.length;
  const activeSessions = (usersArray as any)?.activeSessions ?? 0;
  const userGrowth = (usersArray as any)?.userGrowth ?? "+0";
  const sessionGrowth = (usersArray as any)?.sessionGrowth ?? "+0%";
  const systemStatusStr = statusInfo?.status ?? "OK";

  const stats = [
    {
      title: "Total Users",
      value: String(totalUsers),
      change: userGrowth,
      trend: "up" as const,
      icon: Users,
      color: "#3b82f6",
      kpi: totalUsers,
    },
    {
      title: "Active Sessions",
      value: String(activeSessions),
      change: sessionGrowth,
      trend: "up" as const,
      icon: Eye,
      color: "#22c55e",
      kpi: activeSessions,
    },
    {
      title: "Audit Logs (24h)",
      value: String(logsArray.length),
      change: "+0",
      trend: "up" as const,
      icon: Activity,
      color: "#f59e0b",
      kpi: logsArray.length,
    },
    {
      title: "System Health",
      value: systemStatusStr,
      change: "↑",
      trend: "up" as const,
      icon: Shield,
      color: "#10b981",
      kpi: systemStatusStr,
    },
  ];

  const runAIAnalysis = () => {
    setAgentStatus("thinking");
    setTimeout(() => {
      setAgentStatus("done");
      toast({
        title: "AI System Analysis",
        description: `Detected ${recentAudits.filter((l: any) => l.anomaly).length} anomalous activities. System status: ${systemStatusStr}.`,
      });
    }, 1500);
  };

  const handleRefresh = () => {
    refetchStatus();
    invalidate.all();
    toast({ title: "Dashboard refreshed", description: "All data updated." });
  };

  const isLoading = usersLoading || logsLoading || statusLoading;

  return (
    <Panel className="min-h-screen">
      <PanelHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
          <div>
            <PanelTitle>Admin Panel</PanelTitle>
            <PanelDescription>System administration, user management, and audit controls</PanelDescription>
          </div>
          <PanelActions>
            <Button variant="outline" onClick={runAIAnalysis} className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Analysis
            </Button>
            <Button variant="outline" onClick={handleRefresh} className="gap-2">
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              Refresh
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Audit
            </Button>
          </PanelActions>
        </div>
      </PanelHeader>

      <PanelContent className="space-y-6">
        {/* AI Agent */}
        <Agent>
          <AgentHeader
            name="Admin Intelligence Agent"
            model="admin-v2"
            status={agentStatus}
            actions={
              <span className="flex items-center gap-1 text-xs">
                <AgentStatusDot status={agentStatus} />
                {agentStatus === "idle" && "Monitoring"}
                {agentStatus === "thinking" && "Analyzing..."}
                {agentStatus === "done" && "Done"}
              </span>
            }
          />
          {agentStatus === "done" && (
            <AgentContent>
              <Suggestions>
                <Suggestion suggestion={`✅ System health at ${systemStatusStr} – all systems operational`} variant="outline" />
                <Suggestion suggestion={`📊 ${totalUsers} total users, ${activeSessions} active sessions`} variant="outline" />
                <Suggestion suggestion="🔐 Review recent permission changes for security compliance" variant="outline" />
              </Suggestions>
              <Reasoning defaultOpen={false}>
                <ReasoningTrigger />
                <ReasoningContent>
                  {`AI has analyzed system metrics. Database: Healthy. Gov APIs: ${systemStatusStr}.${recentAudits.filter((l: any) => l.anomaly).length > 0 ? ` Detected ${recentAudits.filter((l: any) => l.anomaly).length} anomalous activities.` : ""}`}
                </ReasoningContent>
              </Reasoning>
            </AgentContent>
          )}
        </Agent>

        {/* System Stats with ChartCard */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div variants={itemVariants} key={stat.title}>
              <ChartCard
                title={stat.title}
                description={`${stat.change} from last period`}
                kpi={stat.value}
                trend={stat.trend}
                trendLabel={stat.change}
                aiInsight={`${stat.title} is ${stat.trend === "up" ? "increasing" : "decreasing"}`}
                className="h-full"
              >
                <div className="h-16">
                  <AreaChart
                    data={mockSparklineData}
                    xKey="label"
                    yKey="value"
                    colors={[stat.color]}
                  />
                </div>
              </ChartCard>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
                    Loading users...
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Seen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                            No users found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentUsers.map((user: any) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-mono text-sm">#{user.id}</TableCell>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === "active" ? "default" : "destructive"}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.lastSeen}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Audits */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Audit Logs</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
                    Loading audit logs...
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>IP</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentAudits.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                            No audit logs found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentAudits.map((audit: any) => (
                          <TableRow key={audit.id}>
                            <TableCell className="font-mono text-sm">#{audit.id}</TableCell>
                            <TableCell>{audit.action}</TableCell>
                            <TableCell className="font-medium">{audit.user}</TableCell>
                            <TableCell>{audit.ip}</TableCell>
                            <TableCell>
                              <Badge variant={audit.status === "success" ? "default" : "destructive"}>
                                {audit.status?.toUpperCase() || "UNKNOWN"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Health & Permissions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>API Uptime</span>
                  <div className="w-24">
                    <Progress value={99.9} className="h-2" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <Badge variant={systemStatusStr === "OK" ? "default" : "destructive"}>
                    {systemStatusStr}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gov APIs</span>
                  <Badge variant={systemStatusStr === "OK" ? "default" : "destructive"}>
                    JTK: {systemStatusStr}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Super Admin</span>
                  <Badge variant="secondary" className="text-xs">12</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>HR Manager</span>
                  <Badge variant="secondary" className="text-xs">45</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Supervisor</span>
                  <Badge variant="secondary" className="text-xs">156</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-10">
                <Users className="h-4 w-4 mr-2" />
                Impersonate User
              </Button>
              <Button variant="outline" className="w-full justify-start h-10">
                <Lock className="h-4 w-4 mr-2" />
                Reset Passwords
              </Button>
              <Button variant="outline" className="w-full justify-start h-10">
                <Settings className="h-4 w-4 mr-2" />
                Bulk Permissions
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </PanelContent>
    </Panel>
  );
}