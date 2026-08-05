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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Shield,
  Bell,
  Globe,
  Moon,
  Sun,
  Download,
  Eye,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Settings,
  Smartphone,
  Database,
  Lock,
  Activity,
} from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  ip: string;
  device: string;
  status: "success" | "warning" | "error";
}

const auditLogs: AuditLog[] = [
  {
    id: "1",
    action: "Downloaded LHDN Audit Report",
    timestamp: "2025-01-27 14:30:25",
    ip: "192.168.1.100",
    device: "Chrome/Windows",
    status: "success",
  },
  {
    id: "2",
    action: "Emergency Contact Triggered",
    timestamp: "2025-01-27 13:45:12",
    ip: "192.168.1.100",
    device: "Mobile/Android",
    status: "warning",
  },
  {
    id: "3",
    action: "User Settings Modified",
    timestamp: "2025-01-27 12:15:08",
    ip: "192.168.1.100",
    device: "Chrome/Windows",
    status: "success",
  },
  {
    id: "4",
    action: "Failed Login Attempt",
    timestamp: "2025-01-27 11:30:45",
    ip: "203.122.45.67",
    device: "Firefox/Linux",
    status: "error",
  },
  {
    id: "5",
    action: "Government API Access",
    timestamp: "2025-01-27 10:20:33",
    ip: "192.168.1.100",
    device: "Chrome/Windows",
    status: "success",
  },
];

export function EnhancedUserSettings() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    emergency: true,
  });
  const [privacy, setPrivacy] = useState({
    locationTracking: true,
    dataSharing: false,
    analytics: true,
  });

  const handleAuditDownload = () => {
    const csvContent = [
      "ID,Action,Timestamp,IP Address,Device,Status",
      ...auditLogs.map(
        (log) =>
          `${log.id},"${log.action}",${log.timestamp},${log.ip},"${log.device}",${log.status}`,
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-trail-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Settings</h1>
        <p className="text-gray-600">
          Manage your account preferences and security settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center space-x-2"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Audit Trail</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-lg">HR</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG up to 2MB
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Ahmad" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Rahman" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="ahmad.rahman@company.com.my"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+60 12-345-6789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="ABC Construction Sdn Bhd" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="HR Manager" disabled />
                </div>
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and two-factor authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Session Management</h4>
                  <p className="text-sm text-gray-500">
                    Automatically log out after 30 minutes of inactivity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button>Update Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-500">
                        Receive updates via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-gray-500">
                        Receive critical alerts via SMS
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, sms: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div>
                      <h4 className="font-medium">Emergency Alerts</h4>
                      <p className="text-sm text-gray-500">
                        Critical safety and compliance alerts
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emergency}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emergency: checked })
                    }
                    disabled
                  />
                  <Badge className="ml-2">Required</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>
                Customize your application experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {darkMode ? (
                      <Moon className="w-5 h-5" />
                    ) : (
                      <Sun className="w-5 h-5" />
                    )}
                    <div>
                      <h4 className="font-medium">Dark Mode</h4>
                      <p className="text-sm text-gray-500">
                        Switch between light and dark themes
                      </p>
                    </div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Language</h4>
                      <p className="text-sm text-gray-500">
                        Choose your preferred language
                      </p>
                    </div>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-1 border rounded-md"
                  >
                    <option value="en">🇬🇧 English</option>
                    <option value="ms">🇲🇾 Bahasa Malaysia</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className="font-medium">Location Tracking</h4>
                      <p className="text-sm text-gray-500">
                        Enable GPS tracking for compliance
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={privacy.locationTracking}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, locationTracking: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Analytics</h4>
                      <p className="text-sm text-gray-500">
                        Help improve the system with usage data
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={privacy.analytics}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, analytics: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Audit Trail</CardTitle>
                  <CardDescription>
                    Track all account activities and system access
                  </CardDescription>
                </div>
                <Button onClick={handleAuditDownload} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(log.status)}
                      <div>
                        <h4 className="font-medium">{log.action}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {log.timestamp}
                          </span>
                          <span className="flex items-center">
                            <Globe className="w-3 h-3 mr-1" />
                            {log.ip}
                          </span>
                          <span className="flex items-center">
                            <Smartphone className="w-3 h-3 mr-1" />
                            {log.device}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={
                        log.status === "success"
                          ? "bg-green-100 text-green-800"
                          : log.status === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {log.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">
                    Data Retention Policy
                  </h4>
                </div>
                <p className="text-sm text-blue-800">
                  Audit logs are retained for 7 years as per Malaysian PDPA
                  requirements. Data is encrypted and access is logged for
                  compliance purposes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
