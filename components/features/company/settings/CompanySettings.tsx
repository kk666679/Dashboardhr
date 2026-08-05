import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const schema = z.object({
  taxNumber: z.string().optional(),
  businessLicense: z.string().optional(),
  defaultCurrency: z.string().min(1),
  fiscalYearStart: z.string().min(1),
  enableMultiBranch: z.boolean(),
  enableDepartmentApproval: z.boolean(),
  timezone: z.string().min(1),
});

export function CompanySettings() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      taxNumber: "",
      businessLicense: "",
      defaultCurrency: "MYR",
      fiscalYearStart: new Date().toISOString().split("T")[0],
      enableMultiBranch: true,
      enableDepartmentApproval: false,
      timezone: "Asia/Kuala_Lumpur",
    },
  });

  const onSubmit = () => {
    toast({ title: "Company settings saved" });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="taxNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessLicense"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business License</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="defaultCurrency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Currency</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fiscalYearStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fiscal Year Start</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="enableMultiBranch"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Enable Multi-Branch</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="enableDepartmentApproval"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Enable Department Approval</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Save Settings</Button>
      </form>
    </Form>
  );
}
