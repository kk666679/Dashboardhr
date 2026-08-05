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
  FileText,
  User,
  CheckCircle,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
const visaSchema = z.object({
  // Step 1: Worker Selection
  workerId: z.string().min(1, "Worker required"),
  visaId: z.string().min(1, "Visa required"),
  permitType: z.enum([
    "plks",
    "eval",
    "visa_with_reference",
    "work_permit_renewal",
    "special_pass",
  ]),
  currentPermitExpiry: z.date(),

  // Step 2: Application Details
  renewalReason: z.string().min(10, "Reason required"),
  newExpiryRequested: z.date(),
  levyAmount: z.number().min(0),
  supportingDocuments: z.array(z.string()).optional(),

  // Step 3: Submission
  approverId: z.string().min(1, "Approver required"),
  notes: z.string().optional(),
});

export type VisaRenewalFormData = z.infer<typeof visaSchema>;

interface VisaRenewalFormProps {
  onSuccess?: () => void;
  workerOptions: {
    id: string;
    name: string;
    passportNo: string;
    visaId?: string;
  }[];
  approverOptions: { id: string; name: string }[];
}

export function VisaRenewalForm({
  onSuccess,
  workerOptions = [],
  approverOptions = [],
}: VisaRenewalFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const renewMutation = trpc.visa.renew.useMutation({
    onSuccess: () => {
      toast.success("Visa renewal application submitted!");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toast.error("Submission failed: " + (error as { message?: string })?.message);
    },
  });

  const form = useForm<VisaRenewalFormData>({
    resolver: zodResolver(visaSchema),
    defaultValues: {
      workerId: "",
      visaId: "",
      permitType: "plks",
      levyAmount: 1850,
      renewalReason: "",
      approverId: "",
    },
  });

  const stepFields: Record<number, (keyof VisaRenewalFormData)[]> = {
    1: ["workerId", "visaId", "permitType", "currentPermitExpiry"],
    2: ["renewalReason", "newExpiryRequested", "levyAmount"],
  };

  const nextStep = async () => {
    const isValid = await form.trigger(stepFields[currentStep]);
    if (isValid) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  const handleSubmit = form.handleSubmit(async (data) => {
    await renewMutation.mutateAsync({
      visaId: data.visaId,
      newExpiryDate: data.newExpiryRequested,
    });
  });

  const stepTitles = [
    "Worker & Permit",
    "Renewal Details",
    "Submit Application",
  ];
  const stepIcons = [User, FileText, CheckCircle];

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
          {/* Step 1: Worker Selection */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Select Worker for Renewal
                </CardTitle>
                <CardDescription>
                  Choose worker whose permit needs renewal
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <FormField
                  control={form.control}
                  name="workerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Worker</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          const worker = workerOptions.find(
                            (w) => w.id === val,
                          );
                          if (worker?.visaId)
                            form.setValue("visaId", worker.visaId);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Search worker by name/passport" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {workerOptions.map((worker) => (
                            <SelectItem key={worker.id} value={worker.id}>
                              <div className="flex flex-col">
                                <span>{worker.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {worker.passportNo}
                                </span>
                              </div>
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
                  name="permitType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permit Type</FormLabel>
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
                          <SelectItem value="plks">
                            PL(KS) - Foreign Worker
                          </SelectItem>
                          <SelectItem value="eval">
                            EVAL - Employment Pass
                          </SelectItem>
                          <SelectItem value="visa_with_reference">
                            Visa with Reference (VVIP)
                          </SelectItem>
                          <SelectItem value="work_permit_renewal">
                            Work Permit Renewal
                          </SelectItem>
                          <SelectItem value="special_pass">
                            Special Pass
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentPermitExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Permit Expiry</FormLabel>
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
                                <span>Select expiry date</span>
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
              </CardContent>
            </Card>
          )}

          {/* Step 2: Renewal Details */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Renewal Application
                </CardTitle>
                <CardDescription>
                  Complete renewal details and levy payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="renewalReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Renewal</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Contract extension, good performance, employer request..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newExpiryRequested"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Expiry Date Requested</FormLabel>
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
                                <span>Select new expiry</span>
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
                    name="levyAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Levy Amount (RM)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1850"
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
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Documents Required
                    </p>
                    <div className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        Passport copy, current permit, employer letter
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Submit */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Review & Submit
                </CardTitle>
                <CardDescription>
                  Final approval and submission to Immigration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special instructions for Immigration..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        Compliance Check
                      </h4>
                      <p className="text-sm text-yellow-700">
                        Application will be auto-checked against Immigration
                        blacklist and levy payment status
                      </p>
                    </div>
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
                <Button type="submit" disabled={renewMutation.isPending}>
                  {renewMutation.isPending
                    ? "Submitting..."
                    : "Submit Renewal Application"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
