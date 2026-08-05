'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

const schema = z.object({
  employeeId: z.string().min(1),
  courseId: z.string().min(1),
  issuedDate: z.string().min(1),
  expiryDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CertificationFormProps {
  certificationId?: string;
  onSuccess?: () => void;
}

export function CertificationForm({ certificationId, onSuccess }: CertificationFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.learning.certification.getById.useQuery(
    { id: certificationId! },
    { enabled: !!certificationId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: "",
      courseId: "",
      issuedDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
    },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        employeeId: existing.employeeId,
        courseId: existing.courseId,
        issuedDate: existing.issuedDate.split("T")[0],
        expiryDate: existing.expiryDate ? existing.expiryDate.split("T")[0] : "",
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.learning.certification.save.useMutation({
    onSuccess: () => {
      toast({ title: "Certification saved" });
      utils.learning.certification.getAll.invalidate();
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

const onSubmit = (values: FormValues) => {
    save({ ...values, id: certificationId, name: values.courseId });
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
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course ID</FormLabel>
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
            name="issuedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issued Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date (optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : existing ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
