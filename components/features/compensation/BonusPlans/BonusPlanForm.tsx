"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

const tierSchema = z.object({
  level: z.string().min(1),
  threshold: z.number().min(0),
  payout: z.number().min(0),
});

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  eligibility: z.string().optional(),
  tiers: z.array(tierSchema).default([]),
});

type FormValues = z.infer<typeof schema>;

interface BonusPlanFormProps {
  planId?: string;
  cycleId: string;
  onSuccess?: () => void;
}

export function BonusPlanForm({ planId, cycleId, onSuccess }: BonusPlanFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.bonusPlan.getById.useQuery(
    { id: planId! },
    { enabled: !!planId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { name: "", description: "", eligibility: "", tiers: [] },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "tiers" });

  useEffect(() => {
    if (existing) {
      form.reset({
        name: existing.name,
        description: existing.description || "",
        eligibility: existing.eligibility || "",
        tiers: existing.tiers ? JSON.parse(existing.tiers) : [],
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.bonusPlan.save.useMutation({
    onSuccess: () => {
      toast({ title: "Bonus plan saved" });
      utils.bonusPlan.getByCycle.invalidate({ cycleId });
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({ ...values, id: planId, cycleId, tiers: JSON.stringify(values.tiers) });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eligibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eligibility Criteria</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., tenure > 1 year" />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Tiers</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-2 items-end border p-2 rounded">
              <FormField
                control={form.control}
                name={`tiers.${index}.level`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Level" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`tiers.${index}.threshold`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`tiers.${index}.payout`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => append({ level: "", threshold: 0, payout: 0 })}>
            Add Tier
          </Button>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : existing ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
