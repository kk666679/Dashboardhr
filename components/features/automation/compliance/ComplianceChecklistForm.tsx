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

type ChecklistItem = {
  requirement: string;
  evidence?: string;
  notes?: string;
};

const itemSchema = z.object({
  requirement: z.string().min(1),
  evidence: z.string().optional(),
  notes: z.string().optional(),
});

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  items: z.array(itemSchema),
});

type FormValues = z.infer<typeof schema>;

interface ComplianceChecklistFormProps {
  checklistId?: string;
  regulationId?: string;
  onSuccess?: () => void;
}

export function ComplianceChecklistForm({ checklistId, regulationId, onSuccess }: ComplianceChecklistFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.compliance.checklist.getById.useQuery(
    { id: checklistId! },
    { enabled: !!checklistId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", items: [] },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  useEffect(() => {
    if (existing) {
      form.reset({
        name: existing.name,
        description: existing.description || "",
        items: (existing.items as ChecklistItem[] | undefined)?.map((item) => ({
          requirement: item.requirement,
          evidence: item.evidence || "",
          notes: item.notes || "",
        })) ?? [],
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.compliance.checklist.save.useMutation({
    onSuccess: () => {
      toast({ title: "Checklist saved" });
      utils.compliance.checklist.getAll.invalidate();
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({
      ...values,
      id: checklistId,
      regulationId,
      items: values.items.map((item) => ({
        requirement: item.requirement,
        evidence: item.evidence || undefined,
        notes: item.notes || undefined,
      })),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Checklist Name</FormLabel>
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
        <div className="space-y-2">
          <FormLabel>Checklist Items</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-2 items-end border p-2 rounded">
              <FormField
                control={form.control}
                name={`items.${index}.requirement`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Requirement" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`items.${index}.evidence`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Evidence" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-2 items-center">
                <FormField
                  control={form.control}
                  name={`items.${index}.notes`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Notes" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                  ×
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => append({ requirement: "", evidence: "", notes: "" })}>
            Add Item
          </Button>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : existing ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}