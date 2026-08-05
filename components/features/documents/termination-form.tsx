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
  User,
  CalendarIcon,
  DollarSign,
  FileText,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const terminationSchema = z.object({
  // Step 1: Employee & Type
  employeeId: z.string().min(1, "Employee required"),
  terminationType: z.enum([
    "RESIGNATION",
    "VOLUNTARY",
    "REDUNDANCY",
    "DISCIPLINARY",
    "RETIREMENT",
    "CONTRACT_END",
  ]),
  lastWorkingDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  // Step 2: Reason & Final Pay
  reason: z.string().min(10, "Reason required"),
  noticePeriodServed: z.boolean(),
  finalSalaryAmount: z.number().min(0),
  pendingLeave: z.number().min(0).optional(),
  otherPayments: z.number().min(0).optional(),

  // Step 3: Documents & Submit
  exitInterviewNotes: z.string().optional(),
  handoverStatus: z.enum(["COMPLETE", "IN_PROGRESS", "PENDING"]),
  approverId: z.string().min(1, "Approver required"),
});

export type TerminationFormData = z.infer<typeof terminationSchema>;

interface TerminationFormProps {
  onSuccess?: () => void;
  employeeOptions: { id: string; name: string }[];
  approverOptions: { id: string; name: string }[];
}

export function TerminationForm({
  onSuccess,
  employeeOptions = [],
  approverOptions = [],
}: TerminationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const trpcUtils = trpc.useUtils();
  const createTerminationMutation =
    trpc.termination.createTermination.useMutation({
      onSuccess: () => {
        toast.success("Termination processed successfully!");
        trpcUtils.termination.getTerminations.invalidate();
        trpcUtils.employee.list.invalidate();
        onSuccess?.();
      },
    });
  const submitTermination = async (data: TerminationFormData) => {
    createTerminationMutation.mutate(data);
  };

  const form = useForm<TerminationFormData>({
    resolver: zodResolver(terminationSchema),
    defaultValues: {
      terminationType: "RESIGNATION",
      noticePeriodServed: false,
      finalSalaryAmount: 0,
      handoverStatus: "PENDING",
    },
  });

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  const handleSubmit = form.handleSubmit(async (data) => {
    await submitTermination(data);
  });

  const stepTitles = [
    "Employee & Type",
    "Final Settlement",
    "Handover & Submit",
  ];
  const stepIcons = [User, DollarSign, FileText];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
          {/* Step 1: Employee & Type */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Termination Details
                </CardTitle>
                <CardDescription>
                  Select employee and termination type
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
                  name="terminationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termination Type</FormLabel>
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
                          <SelectItem value="resignation">
                            Resignation
                          </SelectItem>
                          <SelectItem value="voluntary">
                            Voluntary Separation
                          </SelectItem>
                          <SelectItem value="redundancy">Redundancy</SelectItem>
                          <SelectItem value="disciplinary">
                            Disciplinary
                          </SelectItem>
                          <SelectItem value="retirement">Retirement</SelectItem>
                          <SelectItem value="contract_end">
                            Contract End
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastWorkingDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Working Day</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) =>
                              field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Reason & Final Pay */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Reason & Final Settlement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termination Reason</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed reason for termination..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="noticePeriodServed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Notice Period Served?
                          </FormLabel>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="finalSalaryAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Final Salary Amount (RM)</FormLabel>
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pendingLeave"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pending Leave Payout (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="otherPayments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Payments (RM)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Handover & Submit */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Handover & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="exitInterviewNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exit Interview Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notes from exit interview..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="handoverStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Handover Status</FormLabel>
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
                          <SelectItem value="complete">Complete</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="approverId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HR Approver</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select approver" />
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
                <div className="p-4 bg-yellow-50 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span>
                      Ensure all company assets returned and no-dues clearance
                      obtained
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                  disabled={createTerminationMutation.isPending}
                >
                  {createTerminationMutation.isPending
                    ? "Processing..."
                    : "Process Termination"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
