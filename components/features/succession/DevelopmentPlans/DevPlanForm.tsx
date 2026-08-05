"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

interface DevPlanTask {
  description: string;
  dueDate: string;
  assignedTo?: string | number;
  progress: number;
  completed: boolean;
}

const taskSchema = z.object({
  description: z.string().min(1),
  dueDate: z.string().min(1),
  assignedTo: z.string().optional(),
  progress: z.number().min(0).max(100).default(0),
  completed: z.boolean().default(false),
});

const schema = z.object({
  employeeId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).default("ACTIVE"),
  tasks: z.array(
    taskSchema.extend({
      // Keep consistent with UI: store assignedTo as string | undefined.
      assignedTo: z.string().optional(),
    })
  ).default([]),
});

type FormValues = z.infer<typeof schema>;

type TaskValues = FormValues["tasks"][number];

interface DevPlanFormProps {
  planId?: string;
  onSuccess?: () => void;
}

export function DevPlanForm({ planId, onSuccess }: DevPlanFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.devPlan.getById.useQuery(
    { id: planId! },
    { enabled: !!planId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      employeeId: "",
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "ACTIVE",
      tasks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "tasks" });

  useEffect(() => {
    if (existing) {
      form.reset({
        employeeId: existing.employeeId,
        title: existing.title,
        description: existing.description || "",
        startDate: existing.startDate.split("T")[0],
        endDate: existing.endDate ? existing.endDate.split("T")[0] : "",
        status: existing.status,
        tasks: (existing.tasks as DevPlanTask[]).map((t): TaskValues => ({
          description: t.description,
          dueDate: t.dueDate.split("T")[0],
          // Keep optional: map empty string -> undefined.
          assignedTo: t.assignedTo ? String(t.assignedTo) : undefined,
          progress: t.progress || 0,
          completed: t.completed || false,
        })),
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.devPlan.save.useMutation({
    onSuccess: () => {
      toast({ title: "Development plan saved" });
      utils.devPlan.getAll.invalidate();
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({ ...values, id: planId });
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Tasks</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="border p-3 rounded space-y-2">
              <FormField
                control={form.control}
                name={`tasks.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Task description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name={`tasks.${index}.dueDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`tasks.${index}.progress`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`tasks.${index}.completed`}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                    </FormControl>
                    <span className="text-sm">Completed</span>
                  </FormItem>
                )}
              />
              <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ description: "", dueDate: "", progress: 0, completed: false, assignedTo: undefined })
            }
          >
            Add Task
          </Button>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : existing ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
