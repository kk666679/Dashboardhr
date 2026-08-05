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

const timeSlotSchema = z.object({
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  breakMinutes: z.number().int().min(0).default(0),
});

const daySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  timeSlots: z.array(timeSlotSchema).default([]),
});

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  days: z.array(daySchema),
});

type FormValues = z.infer<typeof schema>;

interface PatternFormProps {
  patternId?: string;
  onSuccess?: () => void;
}

export function PatternForm({ patternId, onSuccess }: PatternFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.shiftPattern.getById.useQuery(
    { id: patternId! },
    { enabled: !!patternId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: "",
      description: "",
      days: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "days" });

  useEffect(() => {
    if (existing) {
      const data = existing as any;
      form.reset({
        name: data.name || "",
        description: data.description || "",
        days: (data.days || data.timeSlots || []).map((day: any) => ({
          dayOfWeek: day.dayOfWeek ?? day.dayOfWeek ?? 0,
          timeSlots: (day.timeSlots || []).map((slot: any) => ({
            startTime: slot.startTime || "",
            endTime: slot.endTime || "",
            breakMinutes: slot.breakMinutes ?? slot.breakMins ?? 0,
          })),
        })),
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.shiftPattern.create.useMutation({
    onSuccess: () => {
      toast({ title: "Pattern saved" });
      utils.shiftPattern.getAll.invalidate();
      onSuccess?.();
    },
    onError: (err: any) => toast({ title: "Error", description: err?.message || "Unknown error", variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    const { days, ...rest } = values;
    const timeSlots = days.flatMap((day) =>
      day.timeSlots.map((slot) => ({
        dayOfWeek: day.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        breakMins: slot.breakMinutes,
      }))
    );
    save({ ...rest, timeSlots });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Days</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="border p-3 rounded space-y-2">
              <FormField
                control={form.control}
                name={`days.${index}.dayOfWeek`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of Week</FormLabel>
                    <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((d, i) => (
                          <SelectItem key={i} value={String(i)}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Time slots nested field array would be here; simplified for brevity */}
              <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                Remove Day
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => append({ dayOfWeek: 0, timeSlots: [] })}>
            Add Day
          </Button>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : existing ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
