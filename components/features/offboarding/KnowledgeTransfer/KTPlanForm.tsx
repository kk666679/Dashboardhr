"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

const schema = z.object({
  plan: z.string().optional(),
  summary: z.string().optional(),
  owners: z.array(z.string()).default([]),
  attachments: z.array(z.string()).default([]),
  documentLinks: z.array(z.string()).default([]),
});

interface KTPlanFormProps {
  terminationId: string;
  onSuccess?: () => void;
}

export function KTPlanForm({ terminationId, onSuccess }: KTPlanFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.knowledgeTransfer.getByTermination.useQuery(
    { terminationId },
    { enabled: !!terminationId }
  );

  const form = useForm<z.infer<typeof schema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: { plan: "", summary: "", owners: [], attachments: [], documentLinks: [] },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        plan: existing.plan || "",
        summary: existing.summary || "",
        owners: existing.owners || [],
        attachments: existing.attachments || [],
        documentLinks: existing.documentLinks || [],
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.knowledgeTransfer.save.useMutation({
    onSuccess: () => {
      toast({ title: "Knowledge transfer saved" });
      utils.knowledgeTransfer.getByTermination.invalidate({ terminationId });
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    save({ ...values, terminationId });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>KT Plan</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="owners"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owners (comma separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="user ids"
                  value={field.value.join(", ")}
                  onChange={(e) => field.onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="attachments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attachments (URLs)</FormLabel>
              <FormControl>
                <Input
                  placeholder="comma separated URLs"
                  value={field.value.join(", ")}
                  onChange={(e) => field.onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="documentLinks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Links</FormLabel>
              <FormControl>
                <Input
                  placeholder="comma separated URLs"
                  value={field.value.join(", ")}
                  onChange={(e) => field.onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                />
              </FormControl>
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
