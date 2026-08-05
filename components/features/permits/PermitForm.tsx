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
import { useEffect } from "react";

const schema = z.object({
  employeeId: z.string().min(1),
  type: z.string().min(1),
  number: z.string().min(1),
  issueDate: z.string().min(1),
  expiryDate: z.string().min(1),
  status: z.enum(["Active", "Expired", "Pending", "Revoked"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface PermitFormProps {
  permitId?: string;
  onSuccess?: () => void;
}

export function PermitForm({ permitId, onSuccess }: PermitFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.permits.byEmployee.useQuery(
    { employeeId: "" },
    { enabled: false }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: "",
      type: "",
      number: "",
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      status: "Active",
      notes: "",
    },
  });

  useEffect(() => {
    if (existing && Array.isArray(existing)) {
      const permit = (existing as any[]).find((p: any) => p.id === permitId);
      if (permit) {
        form.reset({
          employeeId: permit.employeeId || "",
          type: permit.type || "",
          number: permit.number || "",
          issueDate: permit.issueDate ? permit.issueDate.split("T")[0] : "",
          expiryDate: permit.expiryDate ? permit.expiryDate.split("T")[0] : "",
          status: permit.status || "Active",
          notes: permit.notes || "",
        });
      }
    }
  }, [existing, form, permitId]);

  const { mutate: save, isPending } = trpc.permits.create.useMutation({
    onSuccess: () => {
      toast({ title: "Permit saved" });
      utils.permits.byEmployee.invalidate({ employeeId: "" });
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

const onSubmit = (values: FormValues) => {
    save(values as any);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permit Type</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Work Permit, PR" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permit Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Revoked">Revoked</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
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
          {isPending ? "Saving..." : existing ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
