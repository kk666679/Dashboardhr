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

const metricSchema = z.object({
  name: z.string().min(1),
  weight: z.number().min(0).max(1),
  target: z.number().min(0),
  calculationMethod: z.enum(["linear", "step", "custom"]),
});

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  metrics: z.array(metricSchema),
});

type FormValues = z.infer<typeof schema>;

interface IncentiveMetricFormProps {
  planId?: string;
  onSuccess?: () => void;
}

export function IncentiveMetricForm({ planId, onSuccess }: IncentiveMetricFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.incentivePlan.getById.useQuery(
    { id: planId! },
    { enabled: !!planId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { name: "", description: "", metrics: [] },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "metrics" });

  useEffect(() => {
    if (existing) {
      let parsedMetrics: FormValues["metrics"] = [];
      if (existing.metrics) {
        try {
          parsedMetrics = typeof existing.metrics === "string"
            ? JSON.parse(existing.metrics)
            : (existing.metrics as FormValues["metrics"]);
        } catch {
          parsedMetrics = [];
        }
      }
      form.reset({
        name: existing.name,
        description: existing.description || "",
        metrics: parsedMetrics,
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.incentivePlan.save.useMutation({
    onSuccess: () => {
      toast({ title: "Incentive plan saved" });
      utils.incentivePlan.getAll.invalidate();
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    // Router expects metrics as a JSON string
    save({
      id: planId,
      name: values.name,
      description: values.description,
      metrics: JSON.stringify(values.metrics),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Input {...field} /></FormControl>
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Metrics</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-4 gap-2 items-end border p-2 rounded">
              <FormField
                control={form.control}
                name={`metrics.${index}.name`}
                render={({ field: f }) => (
                  <FormItem>
                    <FormControl><Input placeholder="Metric name" {...f} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`metrics.${index}.weight`}
                render={({ field: f }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" step="0.01" {...f} onChange={(e) => f.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`metrics.${index}.target`}
                render={({ field: f }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" {...f} onChange={(e) => f.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`metrics.${index}.calculationMethod`}
                render={({ field: f }) => (
                  <FormItem>
                    <Select onValueChange={f.onChange} defaultValue={f.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Method" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="step">Step</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", weight: 1, target: 0, calculationMethod: "linear" })}>
            Add Metric
          </Button>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : existing ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
