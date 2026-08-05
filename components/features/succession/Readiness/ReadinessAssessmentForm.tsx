"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";

const schema = z.object({
  employeeId: z.string().min(1),
  readinessLevel: z.enum(["NOT_READY", "NEEDS_DEVELOPMENT", "READY_NOW", "READY_IN_1YEAR", "READY_IN_2YEAR"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ReadinessAssessmentFormProps {
  positionId: string;
  onSuccess?: () => void;
}

export function ReadinessAssessmentForm({ positionId, onSuccess }: ReadinessAssessmentFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { employeeId: "", readinessLevel: "NOT_READY", notes: "" },
  });

  const { mutate: save, isPending } = trpc.readiness.save.useMutation({
    onSuccess: () => {
      toast({ title: "Assessment saved" });
      form.reset();
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({ ...values, positionId } as any);
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
                <input {...field} className="w-full border rounded p-2" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="readinessLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Readiness Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="NOT_READY">Not Ready</SelectItem>
                  <SelectItem value="NEEDS_DEVELOPMENT">Needs Development</SelectItem>
                  <SelectItem value="READY_NOW">Ready Now</SelectItem>
                  <SelectItem value="READY_IN_1YEAR">Ready in 1 Year</SelectItem>
                  <SelectItem value="READY_IN_2YEAR">Ready in 2 Years</SelectItem>
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
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Assessment"}
        </Button>
      </form>
    </Form>
  );
}
