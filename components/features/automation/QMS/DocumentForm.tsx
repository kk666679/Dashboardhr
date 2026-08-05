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
  code: z.string().min(1, "Document code is required"),
  title: z.string().min(1, "Title is required"),
  version: z.string().min(1, "Version is required"),
  status: z.enum(["Draft", "Review", "Approved", "Archived", "Obsolete"]),
  category: z.string().min(1, "Category is required"),
  owner: z.string().min(1, "Owner is required"),
  description: z.string().optional(),
  keywords: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface DocumentFormProps {
  documentId?: string;
  onSuccess?: () => void;
}

export function DocumentForm({ documentId, onSuccess }: DocumentFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.qms.document.getById.useQuery(
    { id: documentId! },
    { enabled: !!documentId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      title: "",
      version: "1.0",
      status: "Draft",
      category: "",
      owner: "",
      description: "",
      keywords: "",
    },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        code: existing.code,
        title: existing.title,
        version: existing.version,
        status: existing.status,
        category: existing.category,
        owner: existing.owner,
        description: existing.description || "",
        keywords: existing.keywords || "",
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.qms.document.save.useMutation({
    onSuccess: () => {
      toast({ title: "Document saved" });
      utils.qms.document.getAll.invalidate();
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({ ...values, id: documentId });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., SOP-001" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="1.0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                  <Input {...field} placeholder="e.g., SOP, Policy, Work Instruction" />
                </FormControl>
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
                  <Input {...field} placeholder="Department or person" />
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
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                  <SelectItem value="Obsolete">Obsolete</SelectItem>
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
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords (comma separated)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="quality, process, training" />
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
