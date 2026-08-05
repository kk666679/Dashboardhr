"use client";

import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  Settings,
  Shield,
  Bell,
  Clock,
  Battery,
  MapPin,
  Save,
  RefreshCw,
} from "lucide-react";

export default function SettingsPage() {
  const { useSettings, updateSettingsMutation } = useGeolocation();
  const { toast } = useToast();
  const { data: settings, isLoading } = useSettings();
  const [form, setForm] = useState({
    trackingEnabled: false,
    consentGiven: false,
    updateFrequency: 5,
    privacyLevel: "standard" as "maximum" | "standard" | "high",
    emergencyContactsEnabled: false,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        trackingEnabled: settings.trackingEnabled,
        consentGiven: settings.consentGiven,
        updateFrequency: settings.updateFrequency,
        privacyLevel: settings.privacyLevel,
        emergencyContactsEnabled: settings.emergencyContactsEnabled,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettingsMutation.mutateAsync(form);
      toast({ title: "Settings saved", description: "Location settings have been updated." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <PageShell>
        <PageHeader title="Geolocation Settings" description="Loading..." />
        <Skeleton className="h-96 w-full rounded-xl" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Geolocation Settings"
        description="Configure location tracking, privacy, and alert preferences"
        actions={
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tracking Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              Tracking Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enable Location Tracking</Label>
                <p className="text-xs text-muted-foreground">Allow the system to track your device location</p>
              </div>
              <Switch
                checked={form.trackingEnabled}
                onCheckedChange={(v) => setForm((prev) => ({ ...prev, trackingEnabled: v }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Tracking Consent</Label>
                <p className="text-xs text-muted-foreground">I consent to location tracking for work purposes</p>
              </div>
              <Switch
                checked={form.consentGiven}
                onCheckedChange={(v) => setForm((prev) => ({ ...prev, consentGiven: v }))}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Update Frequency (minutes)</Label>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={form.updateFrequency}
                  onChange={(e) => setForm((prev) => ({ ...prev, updateFrequency: parseInt(e.target.value) || 5 }))}
                  className="w-24"
                />
                <span className="text-xs text-muted-foreground">min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Privacy Level</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                value={form.privacyLevel}
                onChange={(e) => setForm((prev) => ({ ...prev, privacyLevel: e.target.value as "maximum" | "standard" | "high" }))}
              >
                <option value="standard">Standard – Share location with HR</option>
                <option value="high">High – Share only during work hours</option>
                <option value="maximum">Maximum – Share only on emergency</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Controls how your location data is shared within the organization
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Emergency Contacts</Label>
                <p className="text-xs text-muted-foreground">Notify emergency contacts on SOS alert</p>
              </div>
              <Switch
                checked={form.emergencyContactsEnabled}
                onCheckedChange={(v) => setForm((prev) => ({ ...prev, emergencyContactsEnabled: v }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Alert Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="h-4 w-4 text-orange-600" />
              Alert Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-sm">
              <p className="font-medium text-orange-800">Alert Configuration</p>
              <p className="text-xs text-orange-600 mt-1">
                Alert settings are managed by your HR administrator. Contact your HR department to adjust
                geofence alert thresholds, notification channels, and escalation policies.
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Geofence Exit Alerts</span>
                <span className="font-medium">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Geofence Entry Alerts</span>
                <span className="font-medium">Configurable per zone</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Offline Detection</span>
                <span className="font-medium">5 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alert Cooldown</span>
                <span className="font-medium">2 minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-green-600" />
              Data Retention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm">
              <p className="font-medium text-blue-800">Retention Policy</p>
              <p className="text-xs text-blue-600 mt-1">
                Location data is retained according to organizational policy and local regulations (PDPA/GDPR).
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location History</span>
                <span className="font-medium">90 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alert Records</span>
                <span className="font-medium">365 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Emergency Alerts</span>
                <span className="font-medium">2 years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Geofence Config</span>
                <span className="font-medium">Indefinite</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

