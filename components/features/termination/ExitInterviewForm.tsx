"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

const schema = z.object({
  interviewDate: z.string().min(1),
  interviewerId: z.string().min(1),
  exitReason: z.string().min(1),
  reasonTags: z.array(z.string()).optional(), // optional
  ratings: z.record(z.string(), z.number()).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ExitInterviewFormProps {
  terminationId: string;
  onSuccess?: () => void;
}

export function ExitInterviewForm({ terminationId, onSuccess }: ExitInterviewFormProps) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      interviewDate: new Date().toISOString().split("T")[0],
      interviewerId: "",
      exitReason: "",
      reasonTags: [], // default provided here
      ratings: {},    // default provided here
      notes: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    toast({ title: "Exit interview saved" });
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
        </div>
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
              <FormLabel>Tags (comma separated)</FormLabel>
              <FormControl>
                <Input
                  value={field.value?.join(", ") ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                    )
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ratings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ratings</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm">Culture</span>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[field.value?.culture ?? 3]}
                    onValueChange={([val]) =>
                      field.onChange({ ...field.value, culture: val })
                    }
                  />
                </div>
                <div>
                  <span className="text-sm">Management</span>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[field.value?.management ?? 3]}
                    onValueChange={([val]) =>
                      field.onChange({ ...field.value, management: val })
                    }
                  />
                </div>
                <div>
                  <span className="text-sm">Work-life Balance</span>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[field.value?.workLifeBalance ?? 3]}
                    onValueChange={([val]) =>
                      field.onChange({ ...field.value, workLifeBalance: val })
                    }
                  />
                </div>
              </div>
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
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}