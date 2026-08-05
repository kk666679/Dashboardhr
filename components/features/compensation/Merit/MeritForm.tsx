"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";

const schema = z.object({
  employeeId: z.string().min(1),
  currentSalary: z.number().min(0),
  proposedSalary: z.number().min(0),
  increasePercent: z.number().min(0).max(100).optional(),
  justification: z.string().optional(),
  status: z.string().default("DRAFT"),
});

type FormValues = z.infer<typeof schema>;

interface MeritFormProps {
  cycleId: string;
  onSuccess?: () => void;
}

export function MeritForm({ cycleId, onSuccess }: MeritFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      employeeId: "",
      currentSalary: 0,
      proposedSalary: 0,
      increasePercent: undefined,
      justification: "",
      status: "DRAFT",
    },
  });

  const { mutate: save, isPending } = trpc.merit.save.useMutation({
    onSuccess: () => {
      toast({ title: "Merit review created" });
      utils.merit.getByCycle.invalidate({ cycleId });
      onSuccess?.();
      form.reset();
    },
    onError: (err) =>
      toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({ ...values, cycleId });
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
              <FormControl>
                <Input placeholder="Enter employee ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="currentSalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Salary ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="proposedSalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proposed Salary ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="increasePercent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Increase %</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="justification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Justification</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Create Merit Review"}
        </Button>
      </form>
    </Form>
  );
}
