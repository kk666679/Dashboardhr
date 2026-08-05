"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Camera,
  FileText,
  AlertCircle,
} from "lucide-react";

interface DeliveryTrackingProps {
  deliveryOrderId: string;
  status: "pending" | "scheduled" | "in_transit" | "delivered" | "failed";
  trackingData?: {
    estimatedDelivery?: string;
    currentLocation?: string;
    driverName?: string;
    driverPhone?: string;
    deliveryProof?: string[];
    timeline: {
      status: string;
      timestamp: string;
      location?: string;
      notes?: string;
    }[];
  };
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-gray-500",
    icon: Clock,
    progress: 0,
    description: "Order is being prepared for dispatch",
  },
  scheduled: {
    label: "Scheduled",
    color: "bg-blue-500",
    icon: Package,
    progress: 25,
    description: "Delivery has been scheduled and assigned",
  },
  in_transit: {
    label: "In Transit",
    color: "bg-orange-500",
    icon: Truck,
    progress: 75,
    description: "Package is on the way to destination",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-500",
    icon: CheckCircle,
    progress: 100,
    description: "Package has been successfully delivered",
  },
  failed: {
    label: "Failed",
    color: "bg-red-500",
    icon: AlertCircle,
    progress: 0,
    description: "Delivery attempt was unsuccessful",
  },
};

export function DeliveryTracking({
  deliveryOrderId,
  status,
  trackingData,
}: DeliveryTrackingProps) {
  const [showProof, setShowProof] = useState(false);

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  const mockTrackingData = trackingData || {
    estimatedDelivery: undefined,
    currentLocation: undefined,
    driverName: undefined,
    driverPhone: undefined,
    deliveryProof: [],
    timeline: [],
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon className="h-5 w-5" />
            Delivery Status: {currentStatus.label}
          </CardTitle>
          <CardDescription>
            Tracking delivery order {deliveryOrderId}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${currentStatus.color}`} />
            <span className="font-medium">{currentStatus.description}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{currentStatus.progress}%</span>
            </div>
            <Progress value={currentStatus.progress} className="h-2" />
          </div>

          {status === "in_transit" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Current Location:</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {mockTrackingData.currentLocation}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Estimated Delivery:</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {mockTrackingData.estimatedDelivery}
                </p>
              </div>
            </div>
          )}

          {(status === "in_transit" || status === "delivered") && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4" />
                  <span className="font-medium">Driver:</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {mockTrackingData.driverName}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">Contact:</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {mockTrackingData.driverPhone}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Timeline</CardTitle>
          <CardDescription>
            Track the progress of your delivery order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTrackingData.timeline.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index === mockTrackingData.timeline.length - 1
                        ? currentStatus.color
                        : "bg-green-500"
                    }`}
                  />
                  {index < mockTrackingData.timeline.length - 1 && (
                    <div className="w-px h-8 bg-gray-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{event.status}</h4>
                    <span className="text-sm text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {event.location && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </p>
                  )}
                  {event.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Proof */}
      {status === "delivered" &&
        mockTrackingData.deliveryProof &&
        mockTrackingData.deliveryProof.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Delivery Proof
              </CardTitle>
              <CardDescription>
                Photos taken at the time of delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {mockTrackingData.deliveryProof.map((photo, index) => (
                  <div key={index} className="space-y-2">
                    <Image
                      src={photo || "/placeholder.svg"}
                      alt={`Delivery proof ${index + 1}`}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      Delivery confirmation photo {index + 1}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
        <Button variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Email Updates
        </Button>
        {status === "failed" && (
          <Button>
            <Truck className="mr-2 h-4 w-4" />
            Reschedule Delivery
          </Button>
        )}
      </div>
    </div>
  );
}
