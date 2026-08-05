import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const schema = z.object({
  sessionTimeout: z.number().min(1),
  maxLoginAttempts: z.number().min(1),
  passwordMinLength: z.number().min(8),
  require2FA: z.boolean(),
  enableIPRestriction: z.boolean(),
  allowedIPs: z.string().optional(),
});

export function SecuritySettings() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      require2FA: false,
      enableIPRestriction: false,
      allowedIPs: "",
    },
  });

  const onSubmit = () => {
    toast({ title: "Security settings saved" });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sessionTimeout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Timeout (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxLoginAttempts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Login Attempts</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="passwordMinLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Password Length</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="require2FA"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Require 2FA</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="enableIPRestriction"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Enable IP Restriction</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        {form.watch("enableIPRestriction") && (
          <FormField
            control={form.control}
            name="allowedIPs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allowed IPs (comma separated)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="192.168.1.1, 10.0.0.1" />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <Button type="submit">Save Security Settings</Button>
      </form>
    </Form>
  );
}
