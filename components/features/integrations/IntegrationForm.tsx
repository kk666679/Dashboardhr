import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { getAvailablePlatforms } from "./integrationData";

const schema = z.object({
  name: z.string().min(1),
  platform: z.string().min(1),
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
  const [availablePlatforms] = useState(getAvailablePlatforms());

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: integration || {
      name: "",
      platform: "",
      apiKey: "",
      apiSecret: "",
      endpoint: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    toast({ title: integration ? "Integration updated" : "Integration created" });
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Integration Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availablePlatforms.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <div className="flex items-center gap-2">
                        <img src={`/platform-logo-svg/${p.logo}`} alt={p.label} className="h-5 w-5" />
                        {p.label}
                      </div>
                    </SelectItem>
                  ))}
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
                <Input {...field} type="password" />
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
                <Input {...field} type="password" />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">{integration ? "Update" : "Create"}</Button>
      </form>
    </Form>
  );
}
