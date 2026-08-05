"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

const schema = z.object({
  jobTitle: z.string().min(1),
  department: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface PositionFormProps {
  positionId?: string;
  onSuccess?: () => void;
}

export function PositionForm({ positionId, onSuccess }: PositionFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.criticalPosition.getById.useQuery(
    { id: positionId! },
    { enabled: !!positionId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { jobTitle: "", department: "", description: "" },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        jobTitle: existing.jobTitle,
        department: existing.department || "",
        description: existing.description || "",
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.criticalPosition.save.useMutation({
    onSuccess: () => {
      toast({ title: "Position saved" });
      utils.criticalPosition.getAll.invalidate();
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({ ...values, id: positionId });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : existing ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
