"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const workerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  passportNo: z.string().min(1, "Passport number is required"),
  nationality: z.string().min(1, "Nationality is required"),
  position: z.string().min(1, "Position is required"),
  visaExpiry: z.string().min(1, "Visa expiry date is required"),
  permitExpiry: z.string().min(1, "Permit expiry date is required"),
  salary: z.string().min(1, "Salary is required"),
  company: z.string().min(1, "Company is required"),
});

type ForeignWorkerFormData = z.infer<typeof workerSchema>;

interface ForeignWorkerFormProps {
  onSubmit: (data: ForeignWorkerFormData) => void | Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<ForeignWorkerFormData>;
}

export function ForeignWorkerForm({
  onSubmit,
  isLoading = false,
  defaultValues,
}: ForeignWorkerFormProps) {
  const form = useForm<ForeignWorkerFormData>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      passportNo: defaultValues?.passportNo || "",
      nationality: defaultValues?.nationality || "",
      position: defaultValues?.position || "",
      visaExpiry: defaultValues?.visaExpiry || "",
      permitExpiry: defaultValues?.permitExpiry || "",
      salary: defaultValues?.salary || "",
      company: defaultValues?.company || "",
    },
  });

  const handleSubmit = async (data: ForeignWorkerFormData) => {
    try {
      await onSubmit(data);
      toast.success("Worker information saved successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to save worker information");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Foreign Worker Information</CardTitle>
        <CardDescription>
          Add or update foreign worker details and permit information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Worker name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passportNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passport Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Passport number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="Country of origin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Job position" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Employment Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Salary (MYR)</FormLabel>
                      <FormControl>
                        <Input placeholder="Amount" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Permit Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Permit & Visa Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="visaExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visa Expiry Date</FormLabel>
                      <FormControl>
                        <Input placeholder="YYYY-MM-DD" type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permitExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permit Expiry Date</FormLabel>
                      <FormControl>
                        <Input placeholder="YYYY-MM-DD" type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Saving..." : "Save Worker"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="w-full sm:w-auto"
              >
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
