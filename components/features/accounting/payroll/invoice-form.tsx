"use client";

import React from "react";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Plus,
  Trash2,
  Calculator,
  Send,
  Save,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { MalaysianTaxCalculator } from "@/utils/malaysian-tax/tax-calculator";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unitPrice: z.number().min(0, "Unit price must be non-negative"),
  taxable: z.boolean().optional(),
  category: z.string().optional(),
});

const invoiceSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email address"),
  customerAddress: z.string().min(1, "Customer address is required"),
  issueDate: z.date(),
  dueDate: z.date(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  discount: z.number().min(0, "Discount must be non-negative"),
  notes: z.string().optional(),
  terms: z.string().optional(),
  currency: z.enum(["MYR", "USD", "SGD"]),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  initialData?: Partial<InvoiceFormData>;
  onSubmit: (
    data: InvoiceFormData & {
      subtotal: number;
      taxAmount: number;
      total: number;
      status: "draft" | "sent";
    },
  ) => void;
  onPreview?: (data: InvoiceFormData) => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export function InvoiceForm({
  initialData,
  onSubmit,
  onPreview,
  isLoading,
  mode = "create",
}: InvoiceFormProps) {
  const [taxCalculation, setTaxCalculation] = useState<any>(null);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerName: initialData?.customerName || "",
      customerEmail: initialData?.customerEmail || "",
      customerAddress: initialData?.customerAddress || "",
      issueDate: initialData?.issueDate || new Date(),
      dueDate:
        initialData?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      items: initialData?.items || [
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
          taxable: true,
          category: "",
        },
      ],
      discount: initialData?.discount || 0,
      notes: initialData?.notes || "",
      terms: initialData?.terms || "Payment due within 30 days",
      currency: initialData?.currency || "MYR",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  const watchedDiscount = form.watch("discount");

  // Calculate totals whenever items or discount change
  const calculateTotals = () => {
    const items = watchedItems.map((item) => ({
      description: item.description,
      amount: item.quantity * item.unitPrice,
      category: item.category || "general_service",
      isService: true,
      isTaxable: item.taxable ?? true,
    }));

    const taxResult = MalaysianTaxCalculator.calculateTotalTax(items);
    const subtotalAfterDiscount = Math.max(
      0,
      taxResult.subtotal - (watchedDiscount || 0),
    );
    const taxAmount =
      (subtotalAfterDiscount / taxResult.subtotal) * taxResult.totalTaxAmount;
    const total = subtotalAfterDiscount + taxAmount;

    setTaxCalculation({
      subtotal: taxResult.subtotal,
      subtotalAfterDiscount,
      discount: watchedDiscount || 0,
      taxAmount,
      total,
      breakdown: taxResult.breakdown,
    });

    return {
      subtotal: subtotalAfterDiscount,
      taxAmount,
      total,
    };
  };

  // Recalculate when items or discount change
  React.useEffect(() => {
    calculateTotals();
  }, [watchedItems, watchedDiscount]);

  const handleSubmit = (
    data: InvoiceFormData,
    status: "draft" | "sent" = "draft",
  ) => {
    const totals = calculateTotals();
    onSubmit({
      ...data,
      ...totals,
      status,
    });
    toast.success(
      `Invoice ${status === "draft" ? "saved as draft" : "created and sent"}!`,
    );
  };

  const handlePreview = () => {
    const data = form.getValues();
    if (onPreview) {
      onPreview(data);
    }
  };

  const addItem = () => {
    append({
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxable: true,
      category: "",
    });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Form {...form}>
        <form className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>
                Enter customer details for the invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="customer@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerAddress"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Customer Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter customer address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>Set invoice dates and currency</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Issue Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
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
                          disabled={(date) => date < new Date("1900-01-01")}

                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
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
                          disabled={(date) => date < new Date()}

                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MYR">
                          Malaysian Ringgit (MYR)
                        </SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="SGD">
                          Singapore Dollar (SGD)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invoice Items</CardTitle>
                  <CardDescription>
                    Add services and products to the invoice
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid gap-4 md:grid-cols-12 items-end p-4 border rounded-lg"
                  >
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-4">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Service description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Unit Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.category`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="recruitment_service">
                                Recruitment
                              </SelectItem>
                              <SelectItem value="documentation_service">
                                Documentation
                              </SelectItem>
                              <SelectItem value="medical_examination">
                                Medical
                              </SelectItem>
                              <SelectItem value="accommodation_service">
                                Accommodation
                              </SelectItem>
                              <SelectItem value="transportation_service">
                                Transportation
                              </SelectItem>
                              <SelectItem value="training_certification">
                                Training
                              </SelectItem>
                              <SelectItem value="consultation_service">
                                Consultation
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="md:col-span-1 flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.taxable`}
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="rounded"
                              />
                            </FormControl>
                            <FormLabel className="text-xs">Tax</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="md:col-span-12 text-right text-sm text-muted-foreground">
                      Total: {form.watch("currency") || "MYR"}{" "}
                      {(
                        (form.watch(`items.${index}.quantity`) || 0) *
                        (form.watch(`items.${index}.unitPrice`) || 0)
                      ).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Discount and Totals */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
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
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms & Conditions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Payment terms and conditions..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Invoice Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Invoice Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {taxCalculation && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>
                        {form.watch("currency")}{" "}
                        {taxCalculation.subtotal.toFixed(2)}
                      </span>
                    </div>
                    {taxCalculation.discount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Discount:</span>
                        <span>
                          -{form.watch("currency")}{" "}
                          {taxCalculation.discount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Subtotal (after discount):</span>
                      <span>
                        {form.watch("currency")}{" "}
                        {taxCalculation.subtotalAfterDiscount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (SST):</span>
                      <span>
                        {form.watch("currency")}{" "}
                        {taxCalculation.taxAmount.toFixed(2)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>
                        {form.watch("currency")}{" "}
                        {taxCalculation.total.toFixed(2)}
                      </span>
                    </div>

                    {taxCalculation.breakdown &&
                      taxCalculation.breakdown.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium">
                            Tax Breakdown:
                          </h4>
                          {taxCalculation.breakdown.map(
                            (item: { category: string; taxType: string; taxRate: number; taxAmount: number }, index: number) => (
                              <div
                                key={index}
                                className="flex justify-between text-sm"
                              >
                                <span>{item.category}:</span>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {item.taxType === "exempt"
                                      ? "Exempt"
                                      : `${(item.taxRate * 100).toFixed(0)}%`}
                                  </Badge>
                                  <span>
                                    {form.watch("currency")}{" "}
                                    {item.taxAmount.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmit(form.getValues(), "draft")}
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button
                type="button"
                onClick={() => handleSubmit(form.getValues(), "sent")}
                disabled={isLoading}
              >
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? "Creating..." : "Create & Send"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
