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
  definitionId: z.string().min(1),
  grantDate: z.string().min(1),
  quantity: z.number().min(1),
  status: z.string().default("ACTIVE"),
});

type FormValues = z.infer<typeof schema>;

interface EquityGrantFormProps {
  grantId?: string;
  cycleId?: string;
  onSuccess?: () => void;
}

export function EquityGrantForm({ grantId, cycleId, onSuccess }: EquityGrantFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.equityGrant.getById.useQuery(
    { id: grantId! },
    { enabled: !!grantId }
  );
  const { data: definitions } = trpc.equityDefinition.getAll.useQuery();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { employeeId: "", definitionId: "", grantDate: "", quantity: 0, status: "ACTIVE" },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        employeeId: existing.employeeId,
        definitionId: existing.definitionId,
        grantDate: existing.grantDate.split("T")[0],
        quantity: existing.quantity ?? existing.totalUnits ?? 0,
        status: existing.status ?? "ACTIVE",
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.equityGrant.save.useMutation({
    onSuccess: () => {
      toast({ title: "Equity grant saved" });
      utils.equityGrant.getByEmployee.invalidate();
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({ id: grantId, ...values });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee ID</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="definitionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Award Definition</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select definition" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {definitions?.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="grantDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grant Date</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Units</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="VESTED">Vested</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : existing ? "Update" : "Create Grant"}
        </Button>
      </form>
    </Form>
  );
}
