"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  FileText,
  Briefcase,
  DollarSign,
  CalendarIcon,
  MapPin,
  Shield,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ExpatStatus } from "@/types/expat";

// const ExpatStatusArray = Object.values({ ONBOARDING: "", ACTIVE: "", RELOCATION: "", RENEWAL_PENDING: "", TERMINATING: "", TERMINATED: "" } as Record<ExpatStatus, string>)

const ExpatStatusLabels: Record<ExpatStatus, string> = {
  ONBOARDING: "Onboarding",
  ACTIVE: "Active",
  RELOCATION: "Relocation",
  RENEWAL_PENDING: "Renewal Pending",
  TERMINATING: "Terminating",
  TERMINATED: "Terminated",
};

const AllowanceTypes = [
  "Housing",
  "Food",
  "Transport",
  "Medical",
  "Education",
  "Others",
] as const;
type AllowanceType = (typeof AllowanceTypes)[number];

const expatriateSchema = z.object({
  // Employee Details
  employee: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    position: z.string().min(1, "Position required"),
    nationality: z.string().min(1, "Nationality required"),
    visas: z
      .array(
        z.object({
          number: z.string().min(1, "Visa number required"),
          expiryDate: z.string().nullable(),
        }),
      )
      .min(1, "At least one visa required"),
  }),

  // Expatriate Details
  status: z.nativeEnum(ExpatStatus),
  notes: z.string().optional(),

  // Optional Sections
  relocationInfo: z
    .object({
      originCountry: z.string().optional(),
      arrivalDate: z.string().nullable(),
      orientationCompleted: z.boolean().default(false),
    })
    .optional(),

  taxInfo: z
    .object({
      taxResidency: z.enum(["Malaysia", "HomeCountry", "None"]),
      pcbBracket: z.string().optional(),
      epfEligible: z.boolean().default(false),
    })
    .optional(),

  allowances: z
    .array(
      z.object({
        type: z.enum(AllowanceTypes),
        amount: z.number().min(0, "Amount must be positive"),
        currency: z.enum(["MYR"]),
        description: z.string().optional(),
      }),
    )
    .default([]),
});

type ExpatriateFormData = z.infer<typeof expatriateSchema>;

interface ExpatriateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  onSubmit: (data: ExpatriateFormData) => Promise<void>;
  title?: string;
  isLoading?: boolean;
}

export default function ExpatriateForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  title = "Expatriate Details",
  isLoading = false,
}: ExpatriateFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const form = useForm({
    resolver: zodResolver(expatriateSchema),
    defaultValues: {
      employee: {
        name: initialData?.employee?.name || "",
        email: initialData?.employee?.email || "",
        position: initialData?.employee?.position || "",
        nationality: initialData?.employee?.nationality || "",
        visas: initialData?.employee?.visas || [
          { number: "", expiryDate: null },
        ],
      },
      status: (initialData?.status as ExpatStatus) || "ONBOARDING",
      notes: initialData?.notes || "",
      relocationInfo: initialData?.relocationInfo,
      taxInfo: initialData?.taxInfo,
      allowances: initialData?.allowances || [],
    },
  });

  const watchAllowances = form.watch("allowances") ?? [];
  const hasAllowances = watchAllowances.length > 0;

  const stepTitles = ["Employee Info", "Visa & Status", "Allowances", "Review"];
  const stepIcons = [Users, FileText, DollarSign, Shield];

  const addVisa = () => {
    const currentVisas = form.getValues("employee.visas");
    form.setValue("employee.visas", [
      ...currentVisas,
      { number: "", expiryDate: null },
    ]);
  };

  const removeVisa = (index: number) => {
    const currentVisas = form.getValues("employee.visas");
    form.setValue(
      "employee.visas",
      currentVisas.filter((_, i) => i !== index),
    );
  };

  const addAllowance = () => {
    form.setValue("allowances", [
      ...watchAllowances,
      {
        type: "Housing" as AllowanceType,
        amount: 0,
        currency: "MYR",
        description: "",
      },
    ]);
  };

  const updateAllowance = (index: number, field: string, value: unknown) => {
    const current = [...watchAllowances];
    current[index] = {
      ...current[index],
      [field]: value,
    } as (typeof current)[number];
    form.setValue("allowances", current);
  };

  const removeAllowance = (index: number) => {
    form.setValue(
      "allowances",
      watchAllowances.filter((_, i) => i !== index),
    );
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (data: ExpatriateFormData) => {
    try {
      await onSubmit(data);
      toast.success("Expatriate saved successfully!");
      form.reset();
      onOpenChange(false);
      setCurrentStep(1);
    } catch (error) {
      toast.error("Failed to save expatriate");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = currentStep > stepNumber;
              const StepIcon = stepIcons[index];

              return (
                <div key={stepNumber} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 font-medium",
                        isActive
                          ? "border-blue-500 bg-blue-500 text-white"
                          : isCompleted
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-gray-300 bg-gray-100 text-gray-500",
                      )}
                    >
                      {isCompleted ? "✓" : <StepIcon className="h-5 w-5" />}
                    </div>
                    <span className="mt-1 text-xs text-center">{title}</span>
                  </div>
                  {index < stepTitles.length - 1 && (
                    <div
                      className={cn(
                        "mx-2 h-0.5 flex-1",
                        isCompleted ? "bg-green-500" : "bg-gray-300",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 p-6"
          >
            {/* Step 1: Employee Info */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Employee Information
                  </CardTitle>
                  <CardDescription>Basic employee details</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="employee.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="employee.nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select nationality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Bangladesh">
                              Bangladesh
                            </SelectItem>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="Indonesia">Indonesia</SelectItem>
                            <SelectItem value="Nepal">Nepal</SelectItem>
                            <SelectItem value="Pakistan">Pakistan</SelectItem>
                            <SelectItem value="Vietnam">Vietnam</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="employee.position"
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
                  <FormField
                    control={form.control}
                    name="employee.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="employee@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 2: Visa & Status */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Status & Visa Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
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
                              {Object.values(ExpatStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                  <Badge
                                    className="mr-2"
                                    variant={
                                      status === "ACTIVE"
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {ExpatStatusLabels[status as ExpatStatus]}
                                  </Badge>
                                  {status}
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
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Additional notes..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Visa Information
                    </CardTitle>
                    <CardDescription>
                      Add all relevant visas/permits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {form.watch("employee.visas").map((visa, index) => (
                      <div
                        key={index}
                        className="flex gap-2 p-3 border rounded-lg mb-3"
                      >
                        <div className="flex-1 space-y-2">
                          <FormField
                            control={form.control}
                            name={`employee.visas.${index}.number`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Visa #{index + 1}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Visa/Passport number"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`employee.visas.${index}.expiryDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                      >
                                        {field.value
                                          ? format(new Date(field.value), "PPP")
                                          : "Pick expiry date"}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={
                                        field.value
                                          ? new Date(field.value)
                                          : undefined
                                      }
                                      onSelect={(date) =>
                                        field.onChange(date?.toISOString())
                                      }

                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 mt-8"
                          onClick={() => removeVisa(index)}
                          disabled={form.watch("employee.visas").length === 1}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addVisa}
                      className="w-full"
                    >
                      Add Another Visa
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Allowances */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Monthly Allowances
                  </CardTitle>
                  <CardDescription>
                    Add housing, food, transport etc.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hasAllowances ? (
                    watchAllowances.map((allowance, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-4 border rounded-lg mb-4"
                      >
                        <div className="flex-1 space-y-2">
                          <FormField
                            control={form.control}
                            name={`allowances.${index}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select
                                  onValueChange={(val) =>
                                    updateAllowance(index, "type", val)
                                  }
                                  value={allowance.type}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {AllowanceTypes.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <FormField
                              control={form.control}
                              name={`allowances.${index}.amount`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Amount</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      value={allowance.amount}
                                      onChange={(e) =>
                                        updateAllowance(
                                          index,
                                          "amount",
                                          Number(e.target.value),
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex items-end">
                              <span className="px-3 py-2 bg-muted rounded-l-md border">
                                RM
                              </span>
                            </div>
                          </div>
                          <FormField
                            control={form.control}
                            name={`allowances.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Company housing subsidy"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="self-start h-10 w-10 p-0"
                          onClick={() => removeAllowance(index)}
                        >
                          ✕
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No allowances added yet
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAllowance}
                    className="w-full"
                  >
                    + Add Allowance
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Review & Relocation/Tax */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Review & Additional Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Summary</h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            Name:{" "}
                            <span className="font-medium">
                              {form.watch("employee.name")}
                            </span>
                          </div>
                          <div>
                            Nationality:{" "}
                            <span className="font-medium">
                              {form.watch("employee.nationality")}
                            </span>
                          </div>
                          <div>
                            Status: <Badge>{form.watch("status")}</Badge>
                          </div>
                          <div>
                            Visas: {form.watch("employee.visas").length}
                          </div>
                          <div>
                            Total Allowances: RM{" "}
                            {watchAllowances
                              .reduce((sum, a) => sum + a.amount, 0)
                              .toFixed(0)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">
                          Relocation (Optional)
                        </h4>
                        <FormField
                          control={form.control}
                          name="relocationInfo.originCountry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Origin Country</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Bangladesh"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <div className="flex gap-2">
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Expatriate"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
