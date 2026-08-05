import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const schema = z.object({
  smtpHost: z.string().min(1),
  smtpPort: z.number().min(1),
  smtpUser: z.string().min(1),
  smtpPass: z.string().min(1),
  fromEmail: z.string().email(),
  fromName: z.string().min(1),
  useSSL: z.boolean(),
});

export function EmailSettings() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUser: "admin@hrms.com",
      smtpPass: "",
      fromEmail: "noreply@hrms.com",
      fromName: "HRMS",
      useSSL: false,
    },
  });

  const onSubmit = () => {
    toast({ title: "Email settings saved" });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="smtpHost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SMTP Host</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="smtpPort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SMTP Port</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="smtpUser"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SMTP Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="smtpPass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SMTP Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fromEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fromName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="useSSL"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Use SSL</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Save Email Settings</Button>
      </form>
    </Form>
  );
}
