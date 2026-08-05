"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Agent, AgentHeader, AgentStatusDot, AgentContent } from "@/components/ai-elements/agent";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Sparkles, RefreshCw } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

const schema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  systemAlerts: z.boolean(),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
  complianceUpdates: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function NotificationSettings() {
  const { toast } = useToast();
  const { systemStatus, invalidate } = useAdmin();
  const [agentStatus, setAgentStatus] = useState<"idle" | "thinking" | "done">("idle");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch system status (contains notification settings)
  const { data: statusData, isLoading, error, refetch } = systemStatus.get(undefined, {
    staleTime: 60_000,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      systemAlerts: true,
      marketingEmails: false,
      securityAlerts: true,
      complianceUpdates: true,
    },
  });

  // Load settings from server
  useEffect(() => {
    if (statusData && 'notificationSettings' in statusData) {
      form.reset((statusData as any).notificationSettings);
    }
  }, [statusData, form]);

  useEffect(() => {
    if (error) {
      toast({ title: "Error loading settings", description: error.message, variant: "destructive" });
    }
  }, [error, toast]);

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);
    try {
      // Simulate API call – in production, this would call a settings update mutation
      await new Promise(resolve => setTimeout(resolve, 800));
      toast({ title: "Notification settings saved" });
      invalidate.systemStatus();
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const runAIRecommendation = () => {
    setAgentStatus("thinking");
    setTimeout(() => {
      setAgentStatus("done");
      toast({
        title: "AI Recommendations",
        description: "Enable security alerts for all admin users and disable marketing emails for non-executives.",
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <Agent>
        <AgentHeader
          name="Notification Advisor"
          model="notification-v1"
          status={agentStatus}
          actions={
            <span className="flex items-center gap-1 text-xs">
              <AgentStatusDot status={agentStatus} />
              {agentStatus === "idle" && "Ready"}
              {agentStatus === "thinking" && "Analyzing..."}
              {agentStatus === "done" && "Done"}
            </span>
          }
        />
        <AgentContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Get personalized notification recommendations</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={runAIRecommendation} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Get AI Recommendations
              </Button>
              <Button size="sm" variant="ghost" onClick={() => refetch()} className="gap-1">
                <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
              </Button>
            </div>
          </div>
          {agentStatus === "done" && (
            <Suggestions>
              <Suggestion suggestion="🔐 Enable security alerts for all admins" variant="outline" />
              <Suggestion suggestion="📧 Disable marketing emails for non-executive roles" variant="outline" />
              <Suggestion suggestion="📱 Push notifications for system alerts are recommended" variant="outline" />
            </Suggestions>
          )}
        </AgentContent>
      </Agent>

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
          Loading settings...
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Email Notifications</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="smsNotifications"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>SMS Notifications</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pushNotifications"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Push Notifications</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="systemAlerts"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>System Alerts</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="securityAlerts"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Security Alerts</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="complianceUpdates"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Compliance Updates</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketingEmails"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Marketing Emails</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}