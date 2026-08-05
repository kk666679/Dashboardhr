import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

const schema = z.object({
  employeeId: z.string().min(1),
  reviewerId: z.string().min(1),
  date: z.string().min(1),
  rating: z.number().min(0).max(5),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  goals: z.string().optional(),
  status: z.enum(["Draft", "In Progress", "Completed"]),
});

type FormValues = z.infer<typeof schema>;

interface PerformanceReviewFormProps {
  reviewId?: string;
  onSuccess?: () => void;
}

export function PerformanceReviewForm({ reviewId, onSuccess }: PerformanceReviewFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.performance.getReviews.useQuery(undefined, {
    enabled: !!reviewId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: "",
      reviewerId: "",
      date: new Date().toISOString().split("T")[0],
      rating: 3,
      strengths: "",
      weaknesses: "",
      goals: "",
      status: "Draft",
    },
  });

  useEffect(() => {
    if (existing && Array.isArray(existing)) {
      const review = (existing as any[]).find((r: any) => r.id === reviewId);
      if (review) {
        form.reset({
          employeeId: review.employeeId || "",
          reviewerId: review.reviewerId || "",
          date: review.date ? review.date.split("T")[0] : new Date().toISOString().split("T")[0],
          rating: review.rating ?? 3,
          strengths: review.strengths || "",
          weaknesses: review.weaknesses || "",
          goals: review.goals || "",
          status: review.status || "Draft",
        });
      }
    }
  }, [existing, form, reviewId]);

  const { mutate: save, isPending } = trpc.performance.createReview.useMutation({
    onSuccess: () => {
      toast({ title: "Review saved" });
      utils.performance.getReviews.invalidate();
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save(values as any);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Employee ID" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reviewerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reviewer</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Reviewer ID" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Overall Rating: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={5}
                  step={0.1}
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
          name="strengths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strengths</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weaknesses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Areas for Improvement</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goals</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
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
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
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
