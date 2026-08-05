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
  Shield,
  CalendarIcon,
  AlertTriangle,
  CheckCircle,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Label } from "@/components/ui/label";

const auditSchema = z.object({
  // Step 1: Audit Details
  auditType: z.enum([
    "socso",
    "epf",
    "immigration",
    "labour",
    "tax",
    "internal",
  ]),
  auditPeriodStart: z.date(),
  auditPeriodEnd: z.date(),
  auditorName: z.string().min(1),

  // Step 2: Findings
  totalEmployeesAudited: z.number().min(1),
  complianceRate: z.number().min(0).max(100),
  violationsFound: z.number().min(0),
  majorViolations: z.array(z.string()),
  minorViolations: z.array(z.string()),

  // Step 3: Action Plan
  correctiveActions: z.string().min(50),
  timeline: z.date(),
  responsiblePerson: z.string().min(1),
  approverId: z.string().min(1),
});

export type AuditFormData = z.infer<typeof auditSchema>;

interface ComplianceAuditFormProps {
  onSuccess?: () => void;
  approverOptions: { id: string; name: string }[];
}

export function ComplianceAuditForm({
  onSuccess,
  approverOptions = [],
}: ComplianceAuditFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const createAuditMutation = { isPending: false };
  const submitAudit = async (data: AuditFormData) => {
    toast.success("Compliance audit submitted!");
    onSuccess?.();
  };

  const form = useForm<AuditFormData>({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      auditType: "socso",
      totalEmployeesAudited: 0,
      complianceRate: 0,
      violationsFound: 0,
      majorViolations: [],
      minorViolations: [],
    },
  });

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  const handleSubmit = form.handleSubmit(async (data) => {
    await submitAudit(data);
  });

  const stepTitles = ["Audit Details", "Findings", "Action Plan"];
  const stepIcons = [Shield, AlertTriangle, CheckCircle];

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
          {/* Step 1: Audit Details */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Audit Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <FormField
                  control={form.control}
                  name="auditType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audit Type</FormLabel>
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
                          <SelectItem value="socso">SOCSO</SelectItem>
                          <SelectItem value="epf">EPF</SelectItem>
                          <SelectItem value="immigration">
                            Immigration
                          </SelectItem>
                          <SelectItem value="labour">
                            Labour Department
                          </SelectItem>
                          <SelectItem value="tax">Tax/IRBM</SelectItem>
                          <SelectItem value="internal">
                            Internal Audit
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="auditPeriodStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Audit Period Start</FormLabel>
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
                    name="auditPeriodEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Audit Period End</FormLabel>
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
                <FormField
                  control={form.control}
                  name="auditorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Auditor Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name of auditor/officer"
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

          {/* Step 2: Findings */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Audit Findings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalEmployeesAudited"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employees Audited</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="complianceRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compliance Rate (%)</FormLabel>
                        <FormControl>
                          <Input type="number" max={100} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="violationsFound"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Violations</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4">
                  <Label>Major Violations</Label>
                  <Input placeholder="e.g., Missing SOCSO contributions for 3 months" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    + Add another
                  </Button>
                </div>
                <div className="space-y-4">
                  <Label>Minor Violations</Label>
                  <Input placeholder="e.g., Late filing by 2 days" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    + Add another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Action Plan */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Corrective Action Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="correctiveActions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corrective Actions Required</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[120px]"
                          placeholder="Detailed action plan..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Completion Timeline</FormLabel>
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
                                <span>Pick date</span>
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="responsiblePerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsible Person</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Name of responsible officer"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
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
                <Button type="submit" disabled={createAuditMutation.isPending}>
                  {createAuditMutation.isPending
                    ? "Submitting..."
                    : "Submit Audit Report"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
