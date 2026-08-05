"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  Plus,
  Trash2,
  Package,
  MapPin,
  User,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const deliveryOrderSchema = z.object({
  // Customer Information
  customerId: z.string().min(1, "Customer is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerAddress: z.string().min(1, "Customer address is required"),
  customerPhone: z.string().min(1, "Customer phone is required"),
  customerEmail: z.string().email("Valid email is required"),

  // Delivery Information
  deliveryDate: z.date(),
  deliveryTime: z.string().min(1, "Delivery time is required"),
  deliveryMethod: z.string().min(1, "Delivery method is required"),
  priority: z.string().min(1, "Priority is required"),

  // Recipient Information
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientAddress: z.string().min(1, "Recipient address is required"),
  recipientPhone: z.string().min(1, "Recipient phone is required"),
  recipientEmail: z.string().email("Valid recipient email is required"),

  // Line Items
  items: z
    .array(
      z.object({
        serviceType: z.string().min(1, "Service type is required"),
        description: z.string().min(1, "Description is required"),
        workerId: z.string().optional(),
        workerName: z.string().optional(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unitPrice: z.number().min(0, "Unit price must be positive"),
        amount: z.number().min(0, "Amount must be positive"),
      }),
    )
    .min(1, "At least one item is required"),

  // Additional Information
  specialInstructions: z.string().optional(),
  internalNotes: z.string().optional(),
  terms: z.string().optional(),
});

type DeliveryOrderFormData = z.infer<typeof deliveryOrderSchema>;

const serviceTypes = [
  { value: "permit_processing", label: "Permit Processing" },
  { value: "medical_examination", label: "Medical Examination" },
  { value: "document_collection", label: "Document Collection" },
  { value: "worker_transportation", label: "Worker Transportation" },
  { value: "accommodation_setup", label: "Accommodation Setup" },
  { value: "training_materials", label: "Training Materials" },
  { value: "compliance_consultation", label: "Compliance Consultation" },
  { value: "other", label: "Other Services" },
];

const deliveryMethods = [
  { value: "standard", label: "Standard Delivery" },
  { value: "express", label: "Express Delivery" },
  { value: "same_day", label: "Same Day Delivery" },
  { value: "pickup", label: "Customer Pickup" },
  { value: "courier", label: "Courier Service" },
];

const priorities = [
  { value: "low", label: "Low Priority" },
  { value: "normal", label: "Normal Priority" },
  { value: "high", label: "High Priority" },
  { value: "urgent", label: "Urgent" },
];

interface DeliveryOrderFormProps {
  initialData?: Partial<DeliveryOrderFormData>;
  onSubmit: (data: DeliveryOrderFormData) => void;
  isLoading?: boolean;
}

export function DeliveryOrderForm({
  initialData,
  onSubmit,
  isLoading,
}: DeliveryOrderFormProps) {
  const [subtotal, setSubtotal] = useState(0);
  const [sst, setSst] = useState(0);
  const [total, setTotal] = useState(0);

  const form = useForm<DeliveryOrderFormData>({
    resolver: zodResolver(deliveryOrderSchema),
    defaultValues: {
      customerId: "",
      customerName: "",
      customerAddress: "",
      customerPhone: "",
      customerEmail: "",
      deliveryDate: new Date(),
      deliveryTime: "09:00",
      deliveryMethod: "standard",
      priority: "normal",
      recipientName: "",
      recipientAddress: "",
      recipientPhone: "",
      recipientEmail: "",
      items: [
        {
          serviceType: "",
          description: "",
          workerId: "",
          workerName: "",
          quantity: 1,
          unitPrice: 0,
          amount: 0,
        },
      ],
      specialInstructions: "",
      internalNotes: "",
      terms: "Standard delivery terms and conditions apply.",
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");

  // Calculate totals
  const calculateTotals = () => {
    const itemsSubtotal = watchedItems.reduce(
      (sum, item) => sum + (item.amount || 0),
      0,
    );
    const sstAmount = itemsSubtotal * 0.06; // 6% SST
    const totalAmount = itemsSubtotal + sstAmount;

    setSubtotal(itemsSubtotal);
    setSst(sstAmount);
    setTotal(totalAmount);
  };

  // Update item amount when quantity or unit price changes
  const updateItemAmount = (index: number) => {
    const item = watchedItems[index];
    if (item) {
      const amount = (item.quantity || 0) * (item.unitPrice || 0);
      form.setValue(`items.${index}.amount`, amount);
      calculateTotals();
    }
  };

  const addItem = () => {
    append({
      serviceType: "",
      description: "",
      workerId: "",
      workerName: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    });
  };

  const removeItem = (index: number) => {
    remove(index);
    calculateTotals();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
            <CardDescription>
              Enter customer details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="customerAddress"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Customer Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter customer address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
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
                    <Input placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Delivery Information
            </CardTitle>
            <CardDescription>Set delivery schedule and method</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="deliveryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Delivery Date</FormLabel>
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
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }

                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {deliveryMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
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
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
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

        {/* Recipient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Recipient Information
            </CardTitle>
            <CardDescription>Enter delivery recipient details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="recipientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recipient name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipientPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recipient phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipientAddress"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Recipient Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter recipient address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recipient email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Delivery Items
            </CardTitle>
            <CardDescription>
              Add items to be delivered with service details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.serviceType`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select service" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {serviceTypes.map((service) => (
                                    <SelectItem
                                      key={service.value}
                                      value={service.value}
                                    >
                                      {service.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.workerName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Worker name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(
                                      Number.parseInt(e.target.value) || 0,
                                    );
                                    updateItemAmount(index);
                                  }}
                                  className="w-20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.unitPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(
                                      Number.parseFloat(e.target.value) || 0,
                                    );
                                    updateItemAmount(index);
                                  }}
                                  className="w-24"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          RM {(watchedItems[index]?.amount || 0).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>

              <Button type="button" variant="outline" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>RM {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SST (6%):</span>
                <span>RM {sst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>RM {total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Special instructions and terms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="specialInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any special delivery instructions..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="internalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internal Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Internal notes (not visible to customer)..."
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
                      placeholder="Enter terms and conditions..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Delivery Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
