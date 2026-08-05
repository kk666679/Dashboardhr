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
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Label } from "@/components/ui/label";

const applicationSchema = z.object({
  // Step 1: Worker Details
  workerName: z.string().min(2),
  passportNo: z.string().min(5),
  nationality: z.string().min(2),
  employerName: z.string().min(2),
  jobPosition: z.string().min(2),
  sector: z.enum([
    "construction",
    "manufacturing",
    "plantation",
    "services",
    "agriculture",
  ]),

  // Step 2: Permit Details
  permitType: z.enum(["new", "renewal", "replacement"]),
  expectedStartDate: z.date(),
  durationMonths: z.number().min(1).max(36),

  // Step 3: Fees & Submit
  levyCalculation: z.number().min(0),
  totalFees: z.number().min(0),
  paymentMethod: z.enum(["online", "bank_transfer", "cash"]),
  documentsChecklist: z.record(z.string(), z.boolean()),
});

export type PermitApplicationFormData = z.infer<typeof applicationSchema>;

interface PermitApplicationFormProps {
  onSuccess?: () => void;
}

export function PermitApplicationForm({
  onSuccess,
}: PermitApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const submitApplicationMutation = trpc.visa.create.useMutation({
    onSuccess: () => {
      toast.success("Permit application submitted successfully!");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toast.error("Application failed: " + (error as { message?: string })?.message);
    },
  });

  const form = useForm<PermitApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      workerName: "",
      passportNo: "",
      nationality: "",
      employerName: "",
      jobPosition: "",
      sector: "construction",
      permitType: "new",
      durationMonths: 24,
      levyCalculation: 0,
      totalFees: 0,
      paymentMethod: "online",
      documentsChecklist: {},
    },
  });

  const calculateLevy = () => {
    const duration = form.watch("durationMonths") || 0;
    const sectorMultiplier = form.watch("sector") === "plantation" ? 1.2 : 1.0;
    const levy = Math.round(((1850 * duration) / 24) * sectorMultiplier);
    form.setValue("levyCalculation", levy);
    form.setValue("totalFees", levy + 200); // + processing fee
  };

  const nextStep = async () => {
    await form.trigger();
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  const handleSubmit = form.handleSubmit(async (data) => {
    await submitApplicationMutation.mutateAsync({
      employeeId: "",
      type: data.permitType,
      number: data.passportNo,
      issueDate: data.expectedStartDate,
      expiryDate: new Date(
        data.expectedStartDate.getFullYear(),
        data.expectedStartDate.getMonth() + data.durationMonths,
        data.expectedStartDate.getDate(),
      ),
    });
  });

  const stepTitles = ["Worker Details", "Permit Details", "Fees & Submit"];
  const stepIcons = [User, FileText, DollarSign];

  const documentsChecklist = [
    { id: "passport_copy", label: "Passport Copy" },
    { id: "photo_4x6", label: "4x6 Photo" },
    { id: "form_im8a", label: "Form IM.8A" },
    { id: "employer_letter", label: "Employer Letter" },
    { id: "medical_report", label: "Medical Report (FOMEMA)" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => {
              const stepNum = index + 1;
              const isActive = currentStep === stepNum;
              const StepIcon = stepIcons[index];
              return (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center",
                      isActive
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300 bg-gray-100",
                    )}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className="ml-2 text-sm font-medium">{title}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Worker Details */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>New Permit Application</CardTitle>
                <CardDescription>
                  Complete worker details for new permit
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="workerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Worker Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter full name as per passport"
                          {...field}
                        />
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
                        <Input placeholder="e.g., AB1234567" {...field} />
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
                        <Input placeholder="e.g., Bangladesh" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Employer Sdn Bhd" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobPosition"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Job Position</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Construction Worker"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sector</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          calculateLevy();
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="construction">
                            Construction
                          </SelectItem>
                          <SelectItem value="manufacturing">
                            Manufacturing
                          </SelectItem>
                          <SelectItem value="plantation">Plantation</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="agriculture">
                            Agriculture
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Permit Details */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Permit Specifications</CardTitle>
                <CardDescription>
                  Specify permit duration and type
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="permitType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Type</FormLabel>
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
                          <SelectItem value="new">New Application</SelectItem>
                          <SelectItem value="renewal">Renewal</SelectItem>
                          <SelectItem value="replacement">
                            Replacement
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expectedStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Start Date</FormLabel>
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
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick date"}
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
                  name="durationMonths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (months)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="36"
                          {...field}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value) || 0);
                            calculateLevy();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 3: Fees & Submit */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Fees & Documents</CardTitle>
                <CardDescription>Review fees and checklist</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="levyCalculation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Levy Calculation (RM)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            readOnly
                            className="bg-muted"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalFees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Fees (RM)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            readOnly
                            className="bg-muted font-semibold text-lg"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
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
                          <SelectItem value="online">
                            Online Banking/MyEG
                          </SelectItem>
                          <SelectItem value="bank_transfer">
                            Bank Transfer
                          </SelectItem>
                          <SelectItem value="cash">Cash at Counter</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Label>Documents Checklist</Label>
                  <div className="mt-3 space-y-2">
                    {documentsChecklist.map((doc) => (
                      <label
                        key={doc.id}
                        className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded"
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const checklist =
                              form.getValues("documentsChecklist");
                            form.setValue("documentsChecklist", {
                              ...checklist,
                              [doc.id]: checked,
                            });
                          }}
                        />
                        <span>{doc.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">
                      Application Ready
                    </span>
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={submitApplicationMutation.isPending}
              >
                {submitApplicationMutation.isPending
                  ? "Submitting..."
                  : "Submit Application"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
