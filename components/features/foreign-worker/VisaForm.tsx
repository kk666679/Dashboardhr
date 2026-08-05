"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const schema = z.object({
  workerId: z.string().min(1),
  visaType: z.string().min(1),
  issuedDate: z.string().min(1),
  expiryDate: z.string().min(1),
  status: z.enum(["Active", "Expired", "Renewed"]),
});

type FormValues = z.infer<typeof schema>;

interface VisaFormProps {
  visaId?: string;
  onSuccess?: () => void;
}

export function VisaForm({ visaId, onSuccess }: VisaFormProps) {
  const { toast } = useToast();
  // Mock – replace with trpc
  const { mutate: save, isPending } = {} as any;
  const existing = null;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      workerId: "",
      visaType: "",
      issuedDate: "",
      expiryDate: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (existing) {
      form.reset(existing);
    }
  }, [existing, form]);

  const onSubmit = (values: FormValues) => {
    toast({ title: "Visa saved" });
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="workerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Worker ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visaType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visa Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Work Visa">Work Visa</SelectItem>
                  <SelectItem value="Student Visa">Student Visa</SelectItem>
                  <SelectItem value="Tourist Visa">Tourist Visa</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
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
                <FormLabel>Expiry Date</FormLabel>
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
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Renewed">Renewed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{existing ? "Update" : "Create"}</Button>
      </form>
    </Form>
  );
}
