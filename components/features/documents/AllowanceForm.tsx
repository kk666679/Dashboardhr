"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
const allowanceTypes = [
  "Housing",
  "Food",
  "Transport",
  "Medical",
  "Education",
  "Others",
] as const;
type AllowanceType = (typeof allowanceTypes)[number];

const allowanceSchema = z.object({
  type: z.enum(allowanceTypes),
  amount: z.number().min(0, "Amount must be positive"),
  currency: z.enum(["MYR"]),
  description: z.string().optional(),
});

type AllowanceFormData = z.infer<typeof allowanceSchema>;

interface AllowanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<AllowanceFormData>;
  onSubmit: (data: AllowanceFormData) => Promise<void>;
}

export default function AllowanceForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: AllowanceFormProps) {
  const form = useForm<AllowanceFormData>({
    resolver: zodResolver(allowanceSchema),
    defaultValues: {
      type: (initialData?.type as AllowanceType) || "Housing",
      amount: initialData?.amount || 0,
      currency: "MYR",
      description: initialData?.description || "",
    },
  });

  const handleSubmit = async (data: AllowanceFormData) => {
    try {
      await onSubmit(data);
      toast.success("Allowance updated successfully!");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update allowance");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Allowance Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allowanceTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (RM)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
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
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Company provided housing"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Save Allowance
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
