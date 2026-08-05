"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";

const schema = z.object({
  employeeId: z.string().min(1),
  performanceScore: z.number().min(1).max(5),
  potentialScore: z.number().min(1).max(5),
  readinessScore: z.number().min(1).max(5),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface NineBoxAssessmentFormProps {
  onSuccess?: () => void;
}

export function NineBoxAssessmentForm({ onSuccess }: NineBoxAssessmentFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: "",
      performanceScore: 3,
      potentialScore: 3,
      readinessScore: 3,
      notes: "",
    },
  });

  const { mutate: save, isPending } = trpc.nineBox.save.useMutation({
    onSuccess: () => {
      toast({ title: "Assessment saved" });
      utils.nineBox.getAll.invalidate();
      onSuccess?.();
      form.reset();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save(values as any);
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
          name="performanceScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Performance: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[field.value]}
                  onValueChange={([val]) => field.onChange(val)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="potentialScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potential: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[field.value]}
                  onValueChange={([val]) => field.onChange(val)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="readinessScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Readiness: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[field.value]}
                  onValueChange={([val]) => field.onChange(val)}
                />
              </FormControl>
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
