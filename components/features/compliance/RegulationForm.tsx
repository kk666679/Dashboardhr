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

// Schema matches server/routers/compliance.ts RegulationSaveSchema
const schema = z.object({
  name: z.string().min(1),
  jurisdiction: z.string().min(1),
  category: z.string().min(1),
  effectiveDate: z.string().min(1),
  status: z.enum(["Active", "Pending", "Superseded", "Repealed"]),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface RegulationFormProps {
  regulationId?: string;
  onSuccess?: () => void;
}

export function RegulationForm({ regulationId, onSuccess }: RegulationFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.compliance.regulation.getById.useQuery(
    { id: regulationId! },
    { enabled: !!regulationId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      jurisdiction: "",
      category: "",
      effectiveDate: "",
      status: "Pending",
      description: "",
    },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        name: existing.name,
        jurisdiction: existing.jurisdiction,
        category: (existing as any).category ?? "",
        effectiveDate: existing.effectiveDate.split("T")[0],
        status: existing.status as FormValues["status"],
        description: existing.description || "",
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.compliance.regulation.save.useMutation({
    onSuccess: () => {
      toast({ title: "Regulation saved" });
      utils.compliance.regulation.getAll.invalidate();
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({ ...values, id: regulationId });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regulation Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jurisdiction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jurisdiction</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Malaysia" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Labor, Safety" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Effective Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Superseded">Superseded</SelectItem>
                  <SelectItem value="Repealed">Repealed</SelectItem>
                </SelectContent>
              </Select>
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
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : existing ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
