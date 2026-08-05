"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount must be ≥ 0"),
  metricId: z.string().optional(),
});

const formSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  totalAmount: z.number().min(0),
  notes: z.string().optional(),
  lineItems: z.array(lineItemSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface PayoutFormProps {
  payoutId?: string;
  cycleId: string;
  onSuccess?: () => void;
}

export function PayoutForm({ payoutId, cycleId, onSuccess }: PayoutFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { data: existing, isLoading } = trpc.variablePay.getById.useQuery(
    { id: payoutId! },
    { enabled: !!payoutId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      employeeId: "",
      totalAmount: 0,
      notes: "",
      lineItems: [],
    },
  });

  const { control, handleSubmit, reset, setValue, formState: { isSubmitting } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "lineItems" });
  const lineItems = useWatch({ control, name: "lineItems", defaultValue: [] });

  useEffect(() => {
    const total = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    setValue("totalAmount", total, { shouldValidate: true });
  }, [lineItems, setValue]);

  useEffect(() => {
    if (existing) {
      const items = (existing.lineItems as any[])?.map((li: any) => ({
        description: li.description,
        amount: li.amount,
        metricId: li.metricId ?? undefined,
      })) || [];
      reset({
        employeeId: existing.employeeId,
        totalAmount: existing.totalAmount,
        notes: existing.notes ?? "",
        lineItems: items,
      });
    }
  }, [existing, reset]);

  const { mutate: save, isPending } = trpc.variablePay.save.useMutation({
    onSuccess: () => {
      toast({ title: "Payout saved successfully" });
      utils.variablePay.getByEmployee.invalidate();
      onSuccess?.();
    },
    onError: (err) => {
      toast({ title: "Error saving payout", description: err.message, variant: "destructive" });
    },
  });

  const onSubmit = (values: FormValues) => {
    save({
      employeeId: values.employeeId,
      amount: values.totalAmount,
      notes: values.notes,
      id: payoutId,
      cycleId,
    });
  };

  if (isLoading) {
    return <div className="py-8 text-center text-gray-500">Loading payout data...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
        <FormField
          control={control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., EMP-12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Any additional remarks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <FormLabel>Line Items</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-3 items-end border p-3 rounded-md bg-gray-50">
              <FormField
                control={control}
                name={`lineItems.${index}.description`}
                render={({ field: f }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Description" {...f} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`lineItems.${index}.amount`}
                render={({ field: f }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...f}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          f.onChange(isNaN(val) ? 0 : val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} className="self-end">
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", amount: 0 })}>
            + Add Line Item
          </Button>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-lg font-semibold">
            Total: ${(form.watch("totalAmount") ?? 0).toFixed(2)}
          </span>
          <Button type="submit" disabled={isPending || isSubmitting}>
            {isPending ? "Saving..." : existing ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
