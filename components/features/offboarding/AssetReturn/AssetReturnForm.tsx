"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

const itemSchema = z.object({
  name: z.string().min(1),
  serialNumber: z.string().optional(),
  expected: z.boolean().default(true),
  returned: z.boolean().default(false),
  condition: z.string().optional(),
  notes: z.string().optional(),
});

const schema = z.object({
  expectedReturnDate: z.string().min(1),
  items: z.array(itemSchema).min(1),
});

type FormValues = z.infer<typeof schema>;

interface ExistingItem {
  name: string;
  serialNumber?: string | null;
  expected: boolean;
  returned: boolean;
  condition?: string | null;
  notes?: string | null;
  [key: string]: unknown;
}

interface ExistingData {
  expectedReturnDate: string;
  items: ExistingItem[];
  [key: string]: unknown;
}

interface AssetReturnFormProps {
  terminationId: string;
  onSuccess?: () => void;
}

export function AssetReturnForm({ terminationId, onSuccess }: AssetReturnFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.assetReturn.getByTermination.useQuery(
    { terminationId },
    { enabled: !!terminationId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { expectedReturnDate: "", items: [{ name: "", serialNumber: "", expected: true, returned: false }] },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  useEffect(() => {
    if (existing) {
      const data = existing as unknown as ExistingData;
      form.reset({
        expectedReturnDate: data.expectedReturnDate.split("T")[0],
        items: data.items.map((item: ExistingItem) => ({
          name: item.name,
          serialNumber: item.serialNumber || "",
          expected: item.expected,
          returned: item.returned,
          condition: item.condition || "",
          notes: item.notes || "",
        })),
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.assetReturn.save.useMutation({
    onSuccess: () => {
      toast({ title: "Asset return saved" });
      utils.assetReturn.getByTermination.invalidate({ terminationId });
      onSuccess?.();
    },
    onError: (err: { message: string }) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({ ...values, terminationId } as any);
  };

  return (
    <Form {...form as any}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="expectedReturnDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Return Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Assets</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-2 items-end border p-2 rounded">
              <FormField
                control={form.control}
                name={`items.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Asset name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`items.${index}.serialNumber`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Serial #" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`items.${index}.returned`}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <span className="text-sm">Returned</span>
                  </FormItem>
                )}
              />
              <div className="col-span-3 flex gap-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.condition`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="damaged">Damaged</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
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
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", serialNumber: "", expected: true, returned: false })}>
            Add Asset
          </Button>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : existing ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}

