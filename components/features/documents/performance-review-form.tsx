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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { User, Star, Target, CheckCircle, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const performanceSchema = z.object({
  // Step 1: Employee & Period
  employeeId: z.string().min(1, "Employee required"),
  reviewPeriod: z.enum(["q1", "q2", "q3", "q4", "annual", "semi_annual"]),
  reviewDate: z.date(),

  // Step 2: Ratings
  overallPerformance: z.number().min(1).max(5),
  teamwork: z.number().min(1).max(5),
  productivity: z.number().min(1).max(5),
  qualityWork: z.number().min(1).max(5),
  initiative: z.number().min(1).max(5),

  // Step 3: Goals & Submit
  strengths: z.string().min(10),
  areasImprovement: z.string().min(10),
  nextQuarterGoals: z.string().min(20),
  approverId: z.string().min(1),
});

export type PerformanceFormData = z.infer<typeof performanceSchema>;

interface PerformanceReviewFormProps {
  onSuccess?: () => void;
  employeeOptions: { id: string; name: string }[];
  approverOptions: { id: string; name: string }[];
}

export function PerformanceReviewForm({
  onSuccess,
  employeeOptions = [],
  approverOptions = [],
}: PerformanceReviewFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const trpcUtils = trpc.useUtils();
  const createReviewMutation = trpc.performance.createReview.useMutation({
    onSuccess: () => {
      toast.success("Performance review submitted!");
      trpcUtils.performance.getReviews.invalidate();
      onSuccess?.();
    },
  });

  const submitReview = async (data: PerformanceFormData) => {
    createReviewMutation.mutate(data);
  };

  const form = useForm<PerformanceFormData>({
    resolver: zodResolver(performanceSchema),
    defaultValues: {
      reviewPeriod: "annual",
      overallPerformance: 3,
      teamwork: 3,
      productivity: 3,
      qualityWork: 3,
      initiative: 3,
    },
  });

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  const handleSubmit = form.handleSubmit(async (data) => {
    await submitReview(data);
  });

  const stepTitles = [
    "Employee & Period",
    "Performance Ratings",
    "Review & Submit",
  ];
  const stepIcons = [User, Star, Target];

  const ratings = [
    { name: "overallPerformance", label: "Overall Performance", icon: Star },
    { name: "teamwork", label: "Teamwork", icon: User },
    { name: "productivity", label: "Productivity", icon: CalendarIcon },
    { name: "qualityWork", label: "Quality of Work", icon: CheckCircle },
    { name: "initiative", label: "Initiative", icon: Target },
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
                  <span className="ml-2 text-sm font-medium min-w-[100px] sm:min-w-[120px]">
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
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Employee & Review Period
                </CardTitle>
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
                  name="reviewPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Period</FormLabel>
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
                          <SelectItem value="q1">Q1</SelectItem>
                          <SelectItem value="q2">Q2</SelectItem>
                          <SelectItem value="q3">Q3</SelectItem>
                          <SelectItem value="q4">Q4</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                          <SelectItem value="semi_annual">
                            Semi-Annual
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

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Performance Ratings (1-5 Scale)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ratings.map(({ name, label, icon: Icon }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof PerformanceFormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {label}
                        </FormLabel>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Button
                              key={star}
                              type="button"
                              variant={
                                field.value === star ? "default" : "ghost"
                              }
                              size="sm"
                              onClick={() => field.onChange(star)}
                              className="w-12 h-10"
                            >
                              {star}
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Summary & Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="strengths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Strengths</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[80px]"
                          placeholder="What does the employee excel at?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="areasImprovement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Areas for Improvement</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[80px]"
                          placeholder="What skills need development?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nextQuarterGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next Quarter Goals</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[100px]"
                          placeholder="SMART goals for next period..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="approverId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager/Approver</FormLabel>
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
                <Button type="submit" disabled={createReviewMutation.isPending}>
                  {createReviewMutation.isPending
                    ? "Submitting..."
                    : "Submit Review"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
