'use client'
import { useForm } from "react-hook-form";
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

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["Active", "Archived"]),
  courseIds: z.string().optional(), // comma separated
});

type FormValues = z.infer<typeof schema>;

interface LearningPathFormProps {
  pathId?: string;
  onSuccess?: () => void;
}

export function LearningPathForm({ pathId, onSuccess }: LearningPathFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
const { data: existing } = trpc.learning.learningPath.getById.useQuery(
    { id: pathId! },
    { enabled: !!pathId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      status: "Active",
      courseIds: "",
    },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        name: existing.name,
        description: existing.description || "",
        status: existing.status,
        courseIds: existing.courseIds?.join(", ") || "",
      });
    }
  }, [existing, form]);

const { mutate: save, isPending } = trpc.learning.learningPath.save.useMutation({
    onSuccess: () => {
      toast({ title: "Learning path saved" });
      utils.learning.learningPath.getAll.invalidate();
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    const courseIds = values.courseIds ? values.courseIds.split(",").map(s => s.trim()) : [];
    save({ ...values, id: pathId, courseIds });
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
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="courseIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course IDs (comma separated)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="course-1, course-2" />
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
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
