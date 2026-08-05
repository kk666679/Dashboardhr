"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

const schema = z.object({
  interviewDate: z.string().min(1),
  interviewerId: z.string().min(1),
  exitReason: z.string().min(1),
  reasonTags: z.array(z.string()).default([]),
  ratings: z.record(z.string(), z.number()).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ExitInterviewFormProps {
  terminationId: string;
  onSuccess?: () => void;
}

interface ExistingData {
  id: string;
  scheduledAt?: string;
  interviewerId?: string;
  feedback?: string;
  rating?: number;
  [key: string]: unknown;
}

export function ExitInterviewForm({ terminationId, onSuccess }: ExitInterviewFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.exitInterview.getByTermination.useQuery(
    { terminationId },
    { enabled: !!terminationId }
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      interviewDate: new Date().toISOString().split("T")[0],
      interviewerId: "",
      exitReason: "",
      reasonTags: [] as string[],
      ratings: {} as Record<string, number>,
      notes: "",
    },
  });

  useEffect(() => {
    if (existing) {
      const d = existing as unknown as { scheduledAt?: string; interviewerId?: string; feedback?: string; rating?: number };
      form.reset({
        interviewDate: d.scheduledAt ? new Date(d.scheduledAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        interviewerId: d.interviewerId ?? "",
        exitReason: d.feedback ?? "",
        reasonTags: [],
        ratings: d.rating != null ? { overall: d.rating } : {},
        notes: "",
      });
    }
  }, [existing, form]);

  const { mutate: create, isPending: isCreating } = trpc.exitInterview.create.useMutation({
    onSuccess: () => {
      toast({ title: "Exit interview saved" });
      utils.exitInterview.getByTermination.invalidate({ terminationId });
      onSuccess?.();
    },
    onError: (err: { message: string }) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const { mutate: update, isPending: isUpdating } = trpc.exitInterview.update.useMutation({
    onSuccess: () => {
      toast({ title: "Exit interview updated" });
      utils.exitInterview.getByTermination.invalidate({ terminationId });
      onSuccess?.();
    },
    onError: (err: { message: string }) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: Record<string, unknown>) => {
    const existingData = existing as unknown as ExistingData;
    const payload = {
      scheduledAt: values.interviewDate as string,
      interviewerId: values.interviewerId as string,
      feedback: values.exitReason as string,
      rating: values.ratings ? Object.values(values.ratings as Record<string, number>)[0] ?? undefined : undefined,
    };
    if (existingData?.id) {
      update({ id: existingData.id, ...payload, terminationId } as any);
    } else {
      create({ ...payload, terminationId } as any);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="interviewDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interview Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interviewerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interviewer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interviewer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user1">HR Manager</SelectItem>
                  <SelectItem value="user2">Team Lead</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exitReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exit Reason</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reasonTags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="Comma separated tags"
                  value={(field.value as string[]).join(", ")}
                  onChange={(e) => field.onChange(e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ratings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (1–5)</FormLabel>
              <div className="grid grid-cols-1 gap-4 max-w-xs">
                <div>
                  <span className="text-sm">Overall</span>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[Object.values((field.value as Record<string, number>) ?? {})[0] ?? 3]}
                    onValueChange={([val]) => field.onChange({ overall: val })}
                  />
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? "Saving..." : existing ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}

