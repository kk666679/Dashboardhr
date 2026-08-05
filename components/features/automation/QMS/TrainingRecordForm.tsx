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
  employee: z.string().min(1),
  course: z.string().min(1),
  provider: z.string().min(1),
  date: z.string().min(1),
  expiry: z.string().optional(),
  score: z.number().min(0).max(100),
  status: z.enum(["Completed", "In Progress", "Overdue", "Expired"]),
});

type FormValues = z.infer<typeof schema>;

interface TrainingRecordFormProps {
  recordId?: string;
  onSuccess?: () => void;
}

export function TrainingRecordForm({ recordId, onSuccess }: TrainingRecordFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.qms.trainingRecord.getById.useQuery(
    { id: recordId! },
    { enabled: !!recordId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      employee: "",
      course: "",
      provider: "",
      date: new Date().toISOString().split("T")[0],
      expiry: "",
      score: 0,
      status: "In Progress",
    },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        employee: existing.employee,
        course: existing.course,
        provider: existing.provider,
        date: existing.date.split("T")[0],
        expiry: existing.expiry ? existing.expiry.split("T")[0] : "",
        score: existing.score,
        status: existing.status,
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.qms.trainingRecord.save.useMutation({
    onSuccess: () => {
      toast({ title: "Training record saved" });
      utils.qms.trainingRecord.getAll.invalidate();
      onSuccess?.();
    },
    onError: (error: { message: string }) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({
      id: recordId,
      title: values.course,
      type: "Internal",
      trainer: values.provider,
      trainees: [values.employee],
      scheduledDate: values.date,
      duration: 60,
      status: values.status === "Completed" ? "Completed" : values.status === "In Progress" ? "In Progress" : values.status === "Overdue" ? "Planned" : "Cancelled",
      description: values.course,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="employee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="course"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry (optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Score (%)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="100" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
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
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
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
