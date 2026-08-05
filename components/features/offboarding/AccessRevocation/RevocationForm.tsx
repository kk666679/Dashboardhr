"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";

const schema = z.object({
  system: z.string().min(1),
  role: z.string().optional(),
  notes: z.string().optional(),
  accessType: z.string().min(1),
});

interface RevocationFormProps {
  terminationId: string;
  onSuccess?: () => void;
}

export function RevocationForm({ terminationId, onSuccess }: RevocationFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
defaultValues: { system: "", role: "", notes: "", accessType: "" },
  });

  const { mutate: create, isPending } = trpc.revocation.create.useMutation({
    onSuccess: () => {
      toast({ title: "Revocation requested" });
      utils.revocation.getByTermination.invalidate({ terminationId });
      onSuccess?.();
      form.reset();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
create({ ...values, terminationId, accessType: values.accessType });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="system"
          render={({ field }) => (
            <FormItem>
              <FormLabel>System</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select system" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="VPN">VPN</SelectItem>
                  <SelectItem value="CRM">CRM</SelectItem>
                  <SelectItem value="HRIS">HRIS</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Requesting..." : "Request Revocation"}
        </Button>
      </form>
    </Form>
  );
}
