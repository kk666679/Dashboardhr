"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeliveryOrderForm } from "@/components/features/accounting/payroll/delivery-order-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateDeliveryOrderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // removed console.log

      toast.success("Delivery order created successfully!");
      router.push("/dashboard/accounting/delivery-orders");
    } catch (error) {
      toast.error("Failed to create delivery order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/accounting/delivery-orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Delivery Orders
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Delivery Order
          </h1>
          <p className="text-muted-foreground">
            Create a new delivery order for customer services
          </p>
        </div>
      </div>

      {/* Form */}
      <DeliveryOrderForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
