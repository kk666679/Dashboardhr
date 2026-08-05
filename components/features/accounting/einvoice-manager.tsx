"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  FileText,
  Send,
  CheckCircle,
  AlertTriangle,
  X,
  Eye,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EInvoice {
  id: string;
  invoiceId: string;
  uuid: string;
  submissionUid?: string;
  status: "draft" | "submitted" | "validated" | "cancelled";
  submittedAt?: string;
  validatedAt?: string;
}

interface EInvoiceResponse {
  einvoices: EInvoice[];
  total: number;
}

// ─── API helpers ──────────────────────────────────────────────────────────────

const BASE_URL = "/api/accounting-enhanced/einvoice";

async function fetchEInvoices(): Promise<EInvoiceResponse> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch e-invoices");
  return res.json();
}

async function submitEInvoice(invoiceId: string): Promise<void> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "submit", invoiceId }),
  });
  if (!res.ok) throw new Error("Failed to submit e-invoice");
}

async function validateEInvoice(id: string): Promise<void> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "validate", id }),
  });
  if (!res.ok) throw new Error("Failed to validate e-invoice");
}

async function cancelEInvoice(id: string, reason: string): Promise<void> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "cancel", id, reason }),
  });
  if (!res.ok) throw new Error("Failed to cancel e-invoice");
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EInvoiceManager() {
  const {
    data: einvoicesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["einvoices"],
    queryFn: fetchEInvoices,
  });

  const submitMutation = useMutation({
    mutationFn: submitEInvoice,
    onSuccess: () => refetch(),
  });

  const validateMutation = useMutation({
    mutationFn: validateEInvoice,
    onSuccess: () => refetch(),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      cancelEInvoice(id, reason),
    onSuccess: () => refetch(),
  });

  const einvoices = einvoicesResponse?.einvoices ?? [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validated":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "submitted":
        return <Send className="h-4 w-4 text-blue-600" />;
      case "cancelled":
        return <X className="h-4 w-4 text-red-600" />;
      case "draft":
        return <FileText className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleSubmit = async (invoiceId: string) => {
    try {
      await submitMutation.mutateAsync(invoiceId);
    } catch (error) {
      console.error("Failed to submit e-invoice:", error);
    }
  };

  const handleValidate = async (id: string) => {
    try {
      await validateMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to validate e-invoice:", error);
    }
  };

  const handleCancel = async (id: string, reason: string) => {
    try {
      await cancelMutation.mutateAsync({ id, reason });
    } catch (error) {
      console.error("Failed to cancel e-invoice:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">E-Invoice Manager</h2>
          <p className="text-gray-600">
            Manage MyInvois submissions and validation
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Create E-Invoice
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Submission</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="validated">Validated</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        {/* PENDING TAB */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending E-Invoice Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading e-invoices...</div>
              ) : (
                <div className="space-y-3">
                  {einvoices
                    .filter((e) => e.status === "draft")
                    .map((einvoice) => (
                      <div
                        key={einvoice.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(einvoice.status)}
                          <div>
                            <p className="font-medium">
                              Invoice #{einvoice.invoiceId}
                            </p>
                            <p className="text-sm text-gray-600">
                              UUID: {einvoice.uuid}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(einvoice.status)}>
                            {einvoice.status}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => handleSubmit(einvoice.invoiceId)}
                            disabled={submitMutation.isPending}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Submit
                          </Button>
                        </div>
                      </div>
                    ))}
                  {einvoices.filter((e) => e.status === "draft").length ===
                    0 && (
                    <div className="text-center py-8 text-gray-500">
                      No pending e-invoices
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUBMITTED TAB */}
        <TabsContent value="submitted" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submitted E-Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {einvoices
                  .filter((e) => e.status === "submitted")
                  .map((einvoice) => (
                    <div
                      key={einvoice.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(einvoice.status)}
                        <div>
                          <p className="font-medium">
                            Invoice #{einvoice.invoiceId}
                          </p>
                          <p className="text-sm text-gray-600">
                            Submitted:{" "}
                            {einvoice.submittedAt
                              ? new Date(
                                  einvoice.submittedAt,
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                          {einvoice.submissionUid && (
                            <p className="text-xs text-blue-600">
                              Submission UID: {einvoice.submissionUid}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(einvoice.status)}>
                          {einvoice.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleValidate(einvoice.id)}
                          disabled={validateMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Check Status
                        </Button>
                      </div>
                    </div>
                  ))}
                {einvoices.filter((e) => e.status === "submitted").length ===
                  0 && (
                  <div className="text-center py-8 text-gray-500">
                    No submitted e-invoices
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VALIDATED TAB */}
        <TabsContent value="validated" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validated E-Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {einvoices
                  .filter((e) => e.status === "validated")
                  .map((einvoice) => (
                    <div
                      key={einvoice.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-green-50"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(einvoice.status)}
                        <div>
                          <p className="font-medium">
                            Invoice #{einvoice.invoiceId}
                          </p>
                          <p className="text-sm text-gray-600">
                            Validated:{" "}
                            {einvoice.validatedAt
                              ? new Date(
                                  einvoice.validatedAt,
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                          {einvoice.submissionUid && (
                            <p className="text-xs text-green-600">
                              Submission UID: {einvoice.submissionUid}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(einvoice.status)}>
                          {einvoice.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={cancelMutation.isPending}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancel E-Invoice
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this e-invoice?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-2">
                              <Label htmlFor="cancelReason">
                                Cancellation Reason
                              </Label>
                              <Input
                                id="cancelReason"
                                placeholder="Enter reason for cancellation"
                              />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleCancel(
                                    einvoice.id,
                                    "User requested cancellation",
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Confirm Cancellation
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                {einvoices.filter((e) => e.status === "validated").length ===
                  0 && (
                  <div className="text-center py-8 text-gray-500">
                    No validated e-invoices
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CANCELLED TAB */}
        <TabsContent value="cancelled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cancelled E-Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {einvoices
                  .filter((e) => e.status === "cancelled")
                  .map((einvoice) => (
                    <div
                      key={einvoice.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-red-50"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(einvoice.status)}
                        <div>
                          <p className="font-medium">
                            Invoice #{einvoice.invoiceId}
                          </p>
                          <p className="text-sm text-gray-600">
                            UUID: {einvoice.uuid}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(einvoice.status)}>
                        {einvoice.status}
                      </Badge>
                    </div>
                  ))}
                {einvoices.filter((e) => e.status === "cancelled").length ===
                  0 && (
                  <div className="text-center py-8 text-gray-500">
                    No cancelled e-invoices
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* INFO CARD */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">MyInvois Integration</p>
              <p>
                All e-invoices are automatically submitted to LHDNs MyInvois
                system. Ensure your business registration and tax details are up
                to date for successful validation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
