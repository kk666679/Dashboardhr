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
  Plane,
  Home,
  CheckCircle,
  Briefcase,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const onboardingSchema = z.object({
  // Step 1: Expat Details
  expatId: z.string().min(1, "Expat required"),
  arrivalDate: z.date(),
  passportNo: z.string().min(1),

  // Step 2: Visa & Accommodation
  visaType: z.enum([
    "employment_pass",
    "professional_visit_pass",
    "dependent_pass",
    "mm2h",
  ]),
  workPermitNo: z.string().optional(),
  accommodationAddress: z.string().min(1),
  accommodationType: z.enum(["company_provided", "leased", "hotel_temporary"]),

  // Step 3: Orientation Checklist
  orientationCompleted: z.boolean(),
  bankAccountOpened: z.boolean(),
  medicalInsurance: z.boolean(),
  transportArranged: z.boolean(),
  hrContactProvided: z.boolean(),
  approverId: z.string().min(1),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface ExpatOnboardingFormProps {
  onSuccess?: () => void;
  expatOptions: { id: string; name: string; passportNo: string }[];
  approverOptions: { id: string; name: string }[];
}

export function ExpatOnboardingForm({
  onSuccess,
  expatOptions = [],
  approverOptions = [],
}: ExpatOnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const createOnboardingMutation = trpc.expatriate.list.useQuery(undefined, {
    enabled: false,
  });
  const isPending = false;
  const submitOnboarding = async (data: OnboardingFormData) => {
    toast.success("Expat onboarding completed!");
    onSuccess?.();
  };

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      visaType: "employment_pass",
      accommodationType: "company_provided",
      orientationCompleted: false,
      bankAccountOpened: false,
      medicalInsurance: false,
      transportArranged: false,
      hrContactProvided: false,
    },
  });

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  const handleSubmit = form.handleSubmit(async (data) => {
    await submitOnboarding(data);
  });

  const stepTitles = [
    "Expat Details",
    "Visa & Accommodation",
    "Checklist & Submit",
  ];
  const stepIcons = [User, Plane, Home];

  const checklistItems = [
    { name: "orientationCompleted", label: "Orientation Session Completed" },
    { name: "bankAccountOpened", label: "Local Bank Account Opened" },
    { name: "medicalInsurance", label: "Medical Insurance Arranged" },
    { name: "transportArranged", label: "Transport/Logistics Arranged" },
    { name: "hrContactProvided", label: "HR Emergency Contact Provided" },
  ];

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
          {/* Step 1: Expat Details */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Expat Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <FormField
                  control={form.control}
                  name="expatId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expatriate</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select expat" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {expatOptions.map((expat) => (
                            <SelectItem key={expat.id} value={expat.id}>
                              <div>
                                <span>{expat.name}</span>
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs"
                                >
                                  {expat.passportNo}
                                </Badge>
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
                  name="arrivalDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrival Date (Malaysia)</FormLabel>
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
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
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
                  name="passportNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passport Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Expat passport number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Visa & Accommodation */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  Visa & Accommodation
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <FormField
                  control={form.control}
                  name="visaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visa Type</FormLabel>
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
                          <SelectItem value="employment_pass">
                            Employment Pass (EP)
                          </SelectItem>
                          <SelectItem value="professional_visit_pass">
                            Professional Visit Pass
                          </SelectItem>
                          <SelectItem value="dependent_pass">
                            Dependent Pass
                          </SelectItem>
                          <SelectItem value="mm2h">MM2H</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workPermitNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Permit Number (if applicable)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accommodationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accommodation Type</FormLabel>
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
                          <SelectItem value="company_provided">
                            Company Provided
                          </SelectItem>
                          <SelectItem value="leased">
                            Leased Apartment
                          </SelectItem>
                          <SelectItem value="hotel_temporary">
                            Hotel (Temporary)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accommodationAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Accommodation Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Complete address in Malaysia..."
                          className="min-h-[80px]"
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

          {/* Step 3: Orientation Checklist */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Onboarding Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {checklistItems.map(({ name, label }) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as keyof OnboardingFormData}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                          <FormControl>
                            <input
                              type="checkbox"
                              className="w-5 h-5 rounded mt-0.5"
                              checked={field.value as boolean}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>{label}</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
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
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Completing..." : "Complete Onboarding"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
