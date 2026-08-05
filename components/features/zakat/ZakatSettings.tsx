import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const schema = z.object({
  nisabThreshold: z.number().min(1),
  defaultRate: z.number().min(0).max(1),
  autoCalculate: z.boolean(),
  allowDeductions: z.boolean(),
  defaultMethod: z.string().min(1),
});

export function ZakatSettings() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nisabThreshold: 45000,
      defaultRate: 0.025,
      autoCalculate: true,
      allowDeductions: true,
      defaultMethod: "Bank Transfer",
    },
  });

  const onSubmit = () => {
    toast({ title: "Zakat settings saved" });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nisabThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nisab Threshold (RM)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Zakat Rate</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.001"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Payment Method</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="autoCalculate"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Auto-calculate Zakat</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="allowDeductions"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Allow Deductions</FormLabel>
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
