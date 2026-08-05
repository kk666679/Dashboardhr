"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Sparkles } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface RoleFormProps {
  role?: any;
  onSuccess?: () => void;
}

export function RoleForm({ role, onSuccess }: RoleFormProps) {
  const { toast } = useToast();
  const { roles: rolesApi, invalidate } = useAdmin();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: role || { name: "", description: "", status: true },
  });

  const onSubmit = (values: FormValues) => {
    if (role) {
      rolesApi.update.mutate(
        { id: role.id, ...values },
        {
          onSuccess: () => {
            toast({ title: "Role updated" });
            invalidate.roles();
            onSuccess?.();
          },
          onError: (err) => {
            toast({ title: "Save failed", description: err.message, variant: "destructive" });
          },
        },
      );
    } else {
      rolesApi.create.mutate(values, {
        onSuccess: () => {
          toast({ title: "Role created" });
          invalidate.roles();
          onSuccess?.();
        },
        onError: (err) => {
          toast({ title: "Save failed", description: err.message, variant: "destructive" });
        },
      });
    }
  };

  const getAIRecommendation = () => {
    toast({
      title: "AI Suggestion",
      description: "For this role, we recommend: view-only access to financial data, edit access to employee records.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Define role permissions</p>
        <Button variant="outline" size="sm" onClick={getAIRecommendation} className="gap-2">
          <Sparkles className="h-4 w-4" />
          AI Suggest Permissions
        </Button>
      </div>
      <Suggestions>
        <Suggestion suggestion="🔑 Assign least-privilege permissions" variant="outline" />
        <Suggestion suggestion="📊 Roles should be aligned with job functions" variant="outline" />
      </Suggestions>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., HR Manager" />
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
                  <Textarea {...field} placeholder="Describe the role..." />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Active</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={rolesApi.create.isPending || rolesApi.update.isPending}>
            {role ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
}