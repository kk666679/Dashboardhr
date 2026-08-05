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
  title: z.string().min(1),
  type: z.enum(["Grievance", "Discipline", "Dispute", "Compliance", "Others"]),
  status: z.enum(["Open", "Pending", "Resolved", "Closed"]),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  employeeId: z.string().min(1),
  description: z.string().optional(),
  filedDate: z.string().min(1),
  closedDate: z.string().optional(),
  resolution: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CaseFormProps {
  caseId?: string;
  onSuccess?: () => void;
}

export function CaseForm({ caseId, onSuccess }: CaseFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.industrialRelations.getCase.useQuery(
    { id: caseId! },
    { enabled: !!caseId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema as any) as any,
    defaultValues: {
      title: "",
      type: "Grievance",
      status: "Open",
      priority: "Medium",
      employeeId: "",
      description: "",
      filedDate: new Date().toISOString().split("T")[0],
      closedDate: "",
      resolution: "",
    },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        title: existing.title,
        type: existing.type,
        status: existing.status,
        priority: existing.priority,
        employeeId: existing.employeeId,
        description: existing.description || "",
        filedDate: existing.filedDate.split("T")[0],
        closedDate: existing.closedDate ? existing.closedDate.split("T")[0] : "",
        resolution: existing.resolution || "",
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.industrialRelations.createCase.useMutation({
    onSuccess: () => {
      toast({ title: "Case saved" });
      utils.industrialRelations.listCases.invalidate();
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({
      type: values.type,
      description: values.description || "",
      subjectId: values.employeeId,
      referenceNo: undefined,
      filedDate: values.filedDate,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Grievance">Grievance</SelectItem>
                    <SelectItem value="Discipline">Discipline</SelectItem>
                    <SelectItem value="Dispute">Dispute</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="filedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Filed Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
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
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="closedDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Closed Date (if resolved)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
        <FormField
          control={form.control}
          name="resolution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resolution Notes</FormLabel>
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
