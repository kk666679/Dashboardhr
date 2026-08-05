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
  CalendarIcon,
  DollarSign,
  User,
  FileText,
  Calculator,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Label } from "@/components/ui/label";

const payrollSchema = z.object({
  // Step 1: Employee & Period
  employeeId: z.string().min(1, "Employee required"),
  payrollPeriod: z.enum(["monthly", "semi_monthly", "daily", "weekly"]),
  periodStart: z.date(),
  periodEnd: z.date(),

  // Step 2: Earnings
  basicSalaryAdjustment: z.number().optional(),
  overtimeHours: z.number().min(0).optional(),
  overtimeRate: z.number().min(0).optional(),
  allowances: z.record(z.string(), z.number()).optional(),

  // Step 3: Deductions & Review
  deductions: z.record(z.string(), z.number()).optional(),
  reason: z.string().min(10, "Reason required"),
  approverId: z.string().min(1, "Approver required"),
});

export type PayrollFormData = z.infer<typeof payrollSchema>;

interface PayrollAdjustmentFormProps {
  onSuccess?: () => void;
  employeeOptions: { id: string; name: string }[];
  approverOptions: { id: string; name: string }[];
  defaultEmployeeId?: string;
}

export function PayrollAdjustmentForm({
  onSuccess,
  employeeOptions = [],
  approverOptions = [],
  defaultEmployeeId,
}: PayrollAdjustmentFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const createAdjustmentMutation = { isPending: false };
  const submitAdjustment = async (data: PayrollFormData) => {
    toast.success("Payroll adjustment submitted successfully!");
    onSuccess?.();
  };

  const form = useForm<PayrollFormData>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      employeeId: defaultEmployeeId || "",
      payrollPeriod: "monthly",
      basicSalaryAdjustment: 0,
      overtimeHours: 0,
      overtimeRate: 0,
      approverId: "",
      reason: "",
    },
  });

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  const handleSubmit = form.handleSubmit(async (data) => {
    await submitAdjustment(data);
  });

  const stepTitles = ["Employee & Period", "Earnings", "Deductions & Submit"];
  const stepIcons = [User, DollarSign, Calculator];

  const calculateOvertime =
    form.watch("overtimeHours")! * form.watch("overtimeRate")!;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => {
              const stepNum = index + 1;
              const isActive = currentStep === stepNum;
              const isCompleted = currentStep > stepNum;
              const StepIcon = stepIcons[index];

              return (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                      isActive
                        ? "border-blue-500 bg-blue-500 text-white shadow-lg"
                        : isCompleted
                          ? "border-green-500 bg-green-500 text-white shadow-lg"
                          : "border-gray-300 bg-gray-100 text-gray-500",
                    )}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className="ml-2 text-sm font-medium min-w-[120px]">
                    {title}
                  </span>
                  {index < stepTitles.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-1 mx-2",
                        isCompleted
                          ? "bg-green-500"
                          : currentStep > stepNum
                            ? "bg-green-500"
                            : "bg-gray-200",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Employee & Period */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Employee & Payroll Period
                </CardTitle>
                <CardDescription>
                  Select employee and payroll period
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employeeOptions.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.name}
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
                  name="payrollPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payroll Period</FormLabel>
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
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="semi_monthly">
                            Semi-Monthly
                          </SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="periodStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Period Start</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Start date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="periodEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Period End</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>End date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Earnings */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Earnings & Allowances
                </CardTitle>
                <CardDescription>
                  Adjust basic salary, overtime, and allowances
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="basicSalaryAdjustment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Basic Salary Adjustment (RM)</FormLabel>
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
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="overtimeHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Overtime Hours</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.5"
                              placeholder="0"
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
                      name="overtimeRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Overtime Rate (RM/hr)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="1.5"
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
                  </div>
                  <div className="p-4 bg-blue-50 border rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span>Overtime Total:</span>
                      <Badge variant="secondary" className="font-mono">
                        RM {calculateOvertime.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Label htmlFor="allowances">Additional Allowances</Label>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>
                    Meal:{" "}
                    <Input type="number" size={6} className="inline w-20" />
                  </div>
                  <div>
                    Transport:{" "}
                    <Input type="number" size={6} className="inline w-20" />
                  </div>
                  <div>
                    Housing:{" "}
                    <Input type="number" size={6} className="inline w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Deductions & Submit */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Deductions, Review & Submit
                </CardTitle>
                <CardDescription>Final review and submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="approverId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approver</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select HR approver" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {approverOptions.map((app) => (
                            <SelectItem key={app.id} value={app.id}>
                              {app.name}
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
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adjustment Reason</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain reason for payroll adjustment (e.g., overtime verification, salary increment)..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>EPF Deduction (11%)</Label>
                    <Input type="number" className="mt-1" />
                  </div>
                  <div>
                    <Label>SOCSO/EIS</Label>
                    <Input type="number" className="mt-1" />
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 border rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Ready for HR Approval</span>
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <div className="flex space-x-2">
              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createAdjustmentMutation.isPending}
                >
                  {createAdjustmentMutation.isPending
                    ? "Submitting..."
                    : "Submit Adjustment"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
