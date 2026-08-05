"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

const lineItemSchema = z.object({
  description: z.string().min(1),
  amount: z.number().min(0),
  category: z.string().min(1),
});

const schema = z.object({
  finalSalary: z.number().min(0),
  pendingLeave: z.number().min(0),
  additionalPayments: z.number().min(0),
  totalAmount: z.number().min(0),
  status: z.enum(["DRAFT", "REVIEW", "APPROVED", "PAID"]),
  notes: z.string().optional(),
  lineItems: z.array(lineItemSchema),
});

type SchemaType = z.infer<typeof schema>;

interface SettlementFormProps {
  terminationId: string;
  onSuccess?: () => void;
}

interface ExistingData {
  finalSalary: number;
  pendingLeave: number;
  additionalPayments: number;
  totalAmount: number;
  status: string;
  notes?: string;
  lineItems: Array<{ description: string; amount: number; category: string }>;
}

export function SettlementForm({ terminationId, onSuccess }: SettlementFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.settlement.getByTermination.useQuery(
    { terminationId },
    { enabled: !!terminationId }
  );

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      finalSalary: 0,
      pendingLeave: 0,
      additionalPayments: 0,
      totalAmount: 0,
      status: "DRAFT",
      notes: "",
      lineItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "lineItems" });

  useEffect(() => {
    if (existing) {
      const data = existing as unknown as ExistingData;
      const items = (data.lineItems || []).map((li: { description?: string; amount?: number; category?: string }) => ({
        description: li.description ?? "",
        amount: li.amount ?? 0,
        category: li.category ?? "",
      }));
      form.reset({
        finalSalary: data.finalSalary ?? 0,
        pendingLeave: data.pendingLeave ?? 0,
        additionalPayments: data.additionalPayments ?? 0,
        totalAmount: data.totalAmount ?? 0,
        status: (data.status ?? "DRAFT") as SchemaType["status"],
        notes: data.notes || "",
        lineItems: items,
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.settlement.save.useMutation({
    onSuccess: () => {
      toast({ title: "Settlement saved" });
      utils.settlement.getByTermination.invalidate({ terminationId });
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: SchemaType) => {
    const total = values.lineItems.reduce((sum, li) => sum + li.amount, 0);
    save({ ...values, totalAmount: total, terminationId } as any);
  };

  const isLocked = form.watch("status") === "APPROVED" || form.watch("status") === "PAID";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="finalSalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Final Salary</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} disabled={isLocked} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pendingLeave"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pending Leave (days)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} disabled={isLocked} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="additionalPayments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Payments</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} disabled={isLocked} />
                </FormControl>
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
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLocked}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="REVIEW">Review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Line Items</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-2 items-end border p-2 rounded">
              <FormField
                control={form.control}
                name={`lineItems.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Description" {...field} disabled={isLocked} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`lineItems.${index}.amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} disabled={isLocked} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`lineItems.${index}.category`}
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLocked}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="salary">Salary</SelectItem>
                        <SelectItem value="leave">Leave</SelectItem>
                        <SelectItem value="bonus">Bonus</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {!isLocked && (
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
          {!isLocked && (
            <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", amount: 0, category: "other" })}>
              Add Line Item
            </Button>
          )}
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLocked} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total: {form.watch("totalAmount")}</span>
          {!isLocked && (
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : existing ? "Update" : "Create"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

