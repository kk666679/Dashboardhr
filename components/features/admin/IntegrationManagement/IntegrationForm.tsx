// IntegrationForm.tsx (enhanced with AI suggestions)
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";

const schema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  endpoint: z.string().url().optional(),
});

type FormValues = z.infer<typeof schema>;

interface IntegrationFormProps {
  integration?: any;
  onSuccess?: () => void;
}

export function IntegrationForm({ integration, onSuccess }: IntegrationFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: integration || { name: "", type: "", apiKey: "", apiSecret: "", endpoint: "" },
  });

  const onSubmit = (values: FormValues) => {
    toast({ title: integration ? "Integration updated" : "Integration created" });
    onSuccess?.();
  };

  return (
    <div className="space-y-4">
      <Suggestions>
        <Suggestion suggestion="🔑 Use API keys with minimal permissions" variant="outline" />
        <Suggestion suggestion="🌐 Set up webhooks for real-time events" variant="outline" />
      </Suggestions>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Slack" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Integration Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Slack">Slack</SelectItem>
                    <SelectItem value="Discord">Discord</SelectItem>
                    <SelectItem value="Teams">Teams</SelectItem>
                    <SelectItem value="JTK">JTK API</SelectItem>
                    <SelectItem value="Immigration">Immigration API</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endpoint URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://api.example.com" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter API key" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apiSecret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Secret</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter API secret" />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">{integration ? "Update" : "Create"}</Button>
        </form>
      </Form>
    </div>
  );
}