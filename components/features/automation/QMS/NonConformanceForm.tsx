"use client";

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
  category: z.string().min(1),
  description: z.string().min(1),
  severity: z.enum(["Minor", "Major", "Critical"]),
  origin: z.string().min(1),
  owner: z.string().min(1),
  status: z.enum(["Open", "Investigation", "Action", "Closed", "Rejected"]),
  rootCause: z.string().optional(),
  correctiveAction: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface NonConformanceFormProps {
  ncfId?: string;
  onSuccess?: () => void;
}

export function NonConformanceForm({ ncfId, onSuccess }: NonConformanceFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.qms.nonConformance.getById.useQuery(
    { id: ncfId! },
    { enabled: !!ncfId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      severity: "Minor",
      origin: "",
      owner: "",
      status: "Open",
      rootCause: "",
      correctiveAction: "",
    },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        title: existing.title,
        category: existing.category,
        description: existing.description,
        severity: existing.severity,
        origin: existing.origin,
        owner: existing.owner,
        status: existing.status,
        rootCause: existing.rootCause || "",
        correctiveAction: existing.correctiveAction || "",
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.qms.nonConformance.save.useMutation({
    onSuccess: () => {
      toast({ title: "Non-conformance saved" });
      utils.qms.nonConformance.getAll.invalidate();
      onSuccess?.();
    },
    onError: (error: { message: string }) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({
      id: ncfId,
      title: values.title,
      type: values.severity === "Critical" ? "Critical" : values.severity === "Major" ? "Major" : "Minor",
      source: values.origin,
      description: values.description,
      detectedBy: values.owner,
      detectedDate: new Date().toISOString(),
      area: values.category,
      status: values.status === "Investigation" ? "Under Review" : values.status === "Action" ? "Open" : values.status === "Rejected" ? "Closed" : values.status,
      severity: values.severity === "Minor" ? "Low" : values.severity === "Major" ? "High" : "Critical",
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Product, Process, Service" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origin</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Inspection, Customer" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Minor">Minor</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner</FormLabel>
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
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Investigation">Investigation</SelectItem>
                    <SelectItem value="Action">Action</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="rootCause"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Root Cause</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="correctiveAction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Corrective Action</FormLabel>
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
