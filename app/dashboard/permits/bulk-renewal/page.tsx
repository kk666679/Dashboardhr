"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  RefreshCw,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  FileText,
  Calendar,
} from "lucide-react";

export default function BulkRenewalPage() {
  const [selectedPermits, setSelectedPermits] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const expiringPermits = [
    {
      id: "P001",
      permitNumber: "PLKS-2024-001234",
      workerName: "Ahmad Rahman",
      employer: "ABC Construction Sdn Bhd",
      expiryDate: "2024-03-29",
      daysToExpiry: 15,
      levyAmount: 1850,
      status: "expiring_soon",
    },
    {
      id: "P003",
      permitNumber: "PLKS-2024-009876",
      workerName: "Ram Bahadur",
      employer: "Security Plus Sdn Bhd",
      expiryDate: "2024-04-15",
      daysToExpiry: 32,
      levyAmount: 1850,
      status: "expiring_soon",
    },
  ];

  const handleSelectAll = () => {
    if (selectedPermits.length === expiringPermits.length) {
      setSelectedPermits([]);
    } else {
      setSelectedPermits(expiringPermits.map((p) => p.id));
    }
  };

  const handleSelectPermit = (permitId: string) => {
    setSelectedPermits((prev) =>
      prev.includes(permitId)
        ? prev.filter((id) => id !== permitId)
        : [...prev, permitId],
    );
  };

  const handleBulkRenewal = async () => {
    setProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setProcessing(false);
    alert(
      `Successfully initiated renewal for ${selectedPermits.length} permits`,
    );
  };

  const totalLevyAmount = expiringPermits
    .filter((p) => selectedPermits.includes(p.id))
    .reduce((sum, p) => sum + p.levyAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bulk Permit Renewal
          </h1>
          <p className="text-muted-foreground">
            Renew multiple expiring permits with automated levy calculation
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expiring Permits
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {expiringPermits.length}
            </div>
            <p className="text-xs text-muted-foreground">Next 60 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {selectedPermits.length}
            </div>
            <p className="text-xs text-muted-foreground">For renewal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Levy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              RM {totalLevyAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Government fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <RefreshCw
              className={`h-4 w-4 ${processing ? "animate-spin text-blue-600" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {processing ? "Active" : "Ready"}
            </div>
            <p className="text-xs text-muted-foreground">Status</p>
          </CardContent>
        </Card>
      </div>

      {/* Permit Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Permits for Renewal</CardTitle>
          <CardDescription>
            Choose permits to include in bulk renewal process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              checked={selectedPermits.length === expiringPermits.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium">
              Select All ({expiringPermits.length} permits)
            </span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead>Permit Details</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Levy Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiringPermits.map((permit) => (
                <TableRow key={permit.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPermits.includes(permit.id)}
                      onCheckedChange={() => handleSelectPermit(permit.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{permit.permitNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {permit.employer}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{permit.workerName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{permit.expiryDate}</div>
                      <Badge
                        variant={
                          permit.daysToExpiry <= 30
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {permit.daysToExpiry} days
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      RM {permit.levyAmount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-orange-100 text-orange-800">
                      Expiring Soon
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Renewal Process */}
      {selectedPermits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Renewal Process</CardTitle>
            <CardDescription>
              Automated renewal with MYEG/IMigresen integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="font-medium">Auto-fill Applications</div>
                  <div className="text-sm text-muted-foreground">
                    Generate renewal forms
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <CreditCard className="h-8 w-8 text-green-600" />
                <div>
                  <div className="font-medium">FPX Payment</div>
                  <div className="text-sm text-muted-foreground">
                    Secure government levy payment
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="font-medium">Status Tracking</div>
                  <div className="text-sm text-muted-foreground">
                    Real-time updates
                  </div>
                </div>
              </div>
            </div>

            {processing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing renewals...</span>
                  <span>2 of {selectedPermits.length} completed</span>
                </div>
                <Progress value={40} />
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <div className="text-lg font-semibold">
                  Total: RM {totalLevyAmount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedPermits.length} permits selected
                </div>
              </div>
              <Button
                onClick={handleBulkRenewal}
                disabled={selectedPermits.length === 0 || processing}
                size="lg"
              >
                {processing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Process Renewal & Payment
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
