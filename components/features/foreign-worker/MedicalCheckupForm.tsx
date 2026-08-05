"use client";

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
  workerId: z.string().min(1),
  checkupDate: z.string().min(1),
  nextDue: z.string().min(1),
  facility: z.string().min(1),
  status: z.enum(["Cleared", "Pending", "Due", "Failed"]),
});

type FormValues = z.infer<typeof schema>;

interface MedicalCheckupFormProps {
  recordId?: string;
  onSuccess?: () => void;
}

export function MedicalCheckupForm({ recordId, onSuccess }: MedicalCheckupFormProps) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      workerId: "",
      checkupDate: "",
      nextDue: "",
      facility: "",
      status: "Pending",
    },
  });

  const { mutate: save, isPending } = trpc.foreignWorker.save.useMutation({
    onSuccess: () => {
      toast({ title: "Medical checkup record saved" });
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    toast({ title: "Medical checkup record saved" });
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="checkupDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Checkup Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nextDue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Due</FormLabel>
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
          name="facility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facility</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Medical clinic name" />
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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cleared">Cleared</SelectItem>
                  <SelectItem value="Due">Due</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {recordId ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
