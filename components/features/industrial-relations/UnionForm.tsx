import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(1),
  registration: z.string().min(1),
  representative: z.string().min(1),
  status: z.enum(["Active", "Inactive"]),
});

type FormValues = z.infer<typeof schema>;

interface UnionFormProps {
  unionId?: string;
  onSuccess?: () => void;
}

export function UnionForm({ unionId, onSuccess }: UnionFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.industrialRelations.getCase.useQuery(
    { id: unionId! },
    { enabled: !!unionId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema as any) as any,
    defaultValues: { name: "", registration: "", representative: "", status: "Active" },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        name: existing.name,
        registration: existing.registration,
        representative: existing.representative,
        status: existing.status,
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.industrialRelations.createCase.useMutation({
    onSuccess: () => {
      toast({ title: "Union saved" });
      utils.industrialRelations.listCases.invalidate();
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({
      type: "Others",
      description: `Union: ${values.name} (${values.registration})`,
      subjectId: values.registration,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Union Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="registration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="representative"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Representative</FormLabel>
              <FormControl>
                <Input {...field} />
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
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
