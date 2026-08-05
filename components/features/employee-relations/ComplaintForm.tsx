import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

const schema = z.object({
  employeeId: z.string().optional(),
  category: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(["New", "Under Review", "Resolved", "Dismissed"]),
  isAnonymous: z.boolean().default(false),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ComplaintFormProps {
  complaintId?: string;
  onSuccess?: () => void;
}

export function ComplaintForm({ complaintId, onSuccess }: ComplaintFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.er.getCase.useQuery(
    { id: complaintId! },
    { enabled: !!complaintId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema as any) as any,
    defaultValues: {
      employeeId: "",
      category: "",
      description: "",
      status: "New",
      isAnonymous: false,
      notes: "",
    },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        employeeId: existing.employeeId || "",
        category: existing.category,
        description: existing.description,
        status: existing.status,
        isAnonymous: existing.isAnonymous,
        notes: existing.notes || "",
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.er.createComplaint.useMutation({
    onSuccess: () => {
      toast({ title: "Complaint saved" });
      utils.er.listCases.invalidate();
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({
      subjectId: values.employeeId || "anonymous",
      description: values.description,
      severity: "LOW",
      anonymous: values.isAnonymous,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee ID (optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Leave blank for anonymous" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Workplace, HR, Manager" />
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
        <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isAnonymous"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 pt-6">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <span className="text-sm">Submit anonymously</span>
              </FormItem>
            )}
          />
        </div>
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
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : existing ? "Update" : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
