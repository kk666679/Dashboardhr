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
  User,
  Clock,
  FileText,
  CheckCircle,
  Upload,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";

const leaveSchema = z.object({
  // Step 1: Leave Details
  leaveType: z.enum([
    "annual",
    "sick",
    "hospitalization",
    "maternity",
    "paternity",
    "emergency",
    "unpaid",
  ]),
  startDate: z.date(),
  endDate: z.date(),
  daysRequested: z.number().min(1, "At least 1 day required"),

  // Step 2: Employee & Reason
  employeeId: z.string().min(1, "Employee required"),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
  supportingDocuments: z.array(z.string()).optional(),

  // Step 3: Approver & Additional
  approverId: z.string().min(1, "Approver required"),
  coverArrangements: z.string().optional(),
  contactDuringLeave: z.string().optional(),
});

export type LeaveFormData = z.infer<typeof leaveSchema>;

interface LeaveRequestFormProps {
  onSuccess?: () => void;
  employeeOptions: { id: string; name: string }[];
  approverOptions: { id: string; name: string }[];
  defaultEmployeeId?: string;
}

export function LeaveRequestForm({
  onSuccess,
  employeeOptions = [],
  approverOptions = [],
  defaultEmployeeId,
}: LeaveRequestFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const createLeaveMutation = trpc.leave.request.useMutation({
    onSuccess: () => {
      toast.success("Leave request submitted successfully!");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toast.error("Failed to submit leave request: " + (error as { message?: string })?.message);
    },
  });

  const form = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      leaveType: "annual",
      daysRequested: 1,
      employeeId: defaultEmployeeId || "",
      reason: "",
      approverId: "",
      coverArrangements: "",
      contactDuringLeave: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const calculateDays = (start: Date | undefined, end: Date | undefined) => {
    if (!start || !end) return 0;
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    form.setValue("daysRequested", Math.max(1, diffDays));
  };

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  const leaveTypeMap: Record<
    LeaveFormData["leaveType"],
    "ANNUAL" | "SICK" | "PERSONAL" | "EMERGENCY" | "UNPAID"
  > = {
    annual: "PERSONAL",
    sick: "SICK",
    hospitalization: "SICK",
    maternity: "PERSONAL",
    paternity: "PERSONAL",
    emergency: "EMERGENCY",
    unpaid: "UNPAID",
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    await createLeaveMutation.mutateAsync({
      employeeId: data.employeeId,
      leaveType: leaveTypeMap[data.leaveType],
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
    });
  });

  const stepTitles = [
    "Leave Details",
    "Reason & Employee",
    "Approver & Submit",
  ];
  const stepIcons = [Clock, User, CheckCircle];

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
          {/* Step 1: Leave Details */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Leave Details
                </CardTitle>
                <CardDescription>Select leave type and dates</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <FormField
                  control={form.control}
                  name="leaveType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Type</FormLabel>
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
                          <SelectItem value="annual">Annual Leave</SelectItem>
                          <SelectItem value="sick">Sick Leave (MC)</SelectItem>
                          <SelectItem value="hospitalization">
                            Hospitalization
                          </SelectItem>
                          <SelectItem value="maternity">Maternity</SelectItem>
                          <SelectItem value="paternity">Paternity</SelectItem>
                          <SelectItem value="emergency">
                            Emergency Leave
                          </SelectItem>
                          <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
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
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick start date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                calculateDays(date, form.watch("endDate"));
                              }}

                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
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
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick end date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                calculateDays(form.watch("startDate"), date);
                              }}

                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="daysRequested"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days Requested</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          readOnly
                          className="bg-muted"
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

          {/* Step 2: Reason & Employee */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Employee & Reason
                </CardTitle>
                <CardDescription>
                  Provide reason and select employee
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
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Leave</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide detailed reason for leave request..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Supporting Documents (Optional)</Label>
                    <div className="flex items-center gap-2 mt-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-muted-foreground">
                      <Upload className="h-5 w-5" />
                      <span>Click to upload MC/supporting docs</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Approver & Submit */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Approver & Submit
                </CardTitle>
                <CardDescription>Assign approver and review</CardDescription>
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
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="coverArrangements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Arrangements</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="How will work be covered during absence..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactDuringLeave"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact During Leave</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Emergency contact number during leave"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                <Button type="submit" disabled={createLeaveMutation.isPending}>
                  {createLeaveMutation.isPending
                    ? "Submitting..."
                    : "Submit Leave Request"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
