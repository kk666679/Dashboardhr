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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calculator, FileText, Download, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LevyCalculatorPage() {
  const [formData, setFormData] = useState({
    nationality: "",
    sector: "",
    numberOfWorkers: "",
    contractDuration: "",
    skillLevel: "",
  });

  const [calculation, setCalculation] = useState<{
    levyPerWorker: number;
    totalLevy: number;
    processingFee: number;
    totalAmount: number;
    breakdown: Array<{ item: string; amount: number; description: string }>;
  } | null>(null);

  // Malaysian government levy rates (mock data)
  const levyRates = {
    manufacturing: {
      skilled: 1850,
      semiskilled: 2500,
      unskilled: 2500,
    },
    construction: {
      skilled: 1850,
      semiskilled: 2500,
      unskilled: 2500,
    },
    plantation: {
      skilled: 1500,
      semiskilled: 1500,
      unskilled: 1500,
    },
    services: {
      skilled: 1850,
      semiskilled: 2500,
      unskilled: 2500,
    },
  };

  const processingFees = {
    newApplication: 500,
    renewal: 300,
    replacement: 200,
  };

  const calculateLevy = () => {
    if (
      !formData.nationality ||
      !formData.sector ||
      !formData.numberOfWorkers ||
      !formData.skillLevel
    ) {
      return;
    }

    const workers = Number.parseInt(formData.numberOfWorkers);
    const sectorRates = levyRates[formData.sector as keyof typeof levyRates];
    const levyPerWorker =
      sectorRates[formData.skillLevel as keyof typeof sectorRates];
    const totalLevy = levyPerWorker * workers;
    const processingFee = processingFees.newApplication * workers;
    const totalAmount = totalLevy + processingFee;

    const breakdown = [
      {
        item: "Government Levy",
        amount: totalLevy,
        description: `RM ${levyPerWorker} per worker × ${workers} workers`,
      },
      {
        item: "Processing Fee",
        amount: processingFee,
        description: `RM ${processingFees.newApplication} per worker × ${workers} workers`,
      },
    ];

    setCalculation({
      levyPerWorker,
      totalLevy,
      processingFee,
      totalAmount,
      breakdown,
    });
  };

  const resetCalculation = () => {
    setFormData({
      nationality: "",
      sector: "",
      numberOfWorkers: "",
      contractDuration: "",
      skillLevel: "",
    });
    setCalculation(null);
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Levy Calculator</h1>
          <p className="text-muted-foreground">
            Calculate Malaysian government levy for foreign workers
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            View Rates
          </Button>
          {calculation && (
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Calculation
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Levy Calculation
            </CardTitle>
            <CardDescription>
              Enter worker details to calculate government levy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Select
                value={formData.nationality}
                onValueChange={(value) =>
                  setFormData({ ...formData, nationality: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangladesh">Bangladesh</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="indonesia">Indonesia</SelectItem>
                  <SelectItem value="vietnam">Vietnam</SelectItem>
                  <SelectItem value="myanmar">Myanmar</SelectItem>
                  <SelectItem value="nepal">Nepal</SelectItem>
                  <SelectItem value="pakistan">Pakistan</SelectItem>
                  <SelectItem value="sri_lanka">Sri Lanka</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Select
                value={formData.sector}
                onValueChange={(value) =>
                  setFormData({ ...formData, sector: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="plantation">Plantation</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skillLevel">Skill Level</Label>
              <Select
                value={formData.skillLevel}
                onValueChange={(value) =>
                  setFormData({ ...formData, skillLevel: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skilled">Skilled</SelectItem>
                  <SelectItem value="semiskilled">Semi-skilled</SelectItem>
                  <SelectItem value="unskilled">Unskilled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfWorkers">Number of Workers</Label>
              <Input
                id="numberOfWorkers"
                type="number"
                min="1"
                placeholder="Enter number of workers"
                value={formData.numberOfWorkers}
                onChange={(e) =>
                  setFormData({ ...formData, numberOfWorkers: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractDuration">Contract Duration</Label>
              <Select
                value={formData.contractDuration}
                onValueChange={(value) =>
                  setFormData({ ...formData, contractDuration: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1_year">1 Year</SelectItem>
                  <SelectItem value="2_years">2 Years</SelectItem>
                  <SelectItem value="3_years">3 Years</SelectItem>
                  <SelectItem value="5_years">5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button onClick={calculateLevy} className="flex-1">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Levy
              </Button>
              <Button variant="outline" onClick={resetCalculation}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calculation Results */}
        <div className="space-y-6">
          {calculation ? (
            <Card>
              <CardHeader>
                <CardTitle>Calculation Results</CardTitle>
                <CardDescription>
                  Government levy breakdown for {formData.numberOfWorkers}{" "}
                  workers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {calculation.breakdown.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{item.item}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          RM {item.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div>
                    <div className="text-lg font-bold">Total Amount</div>
                    <div className="text-sm text-muted-foreground">
                      Including all fees and levies
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      RM {calculation.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Per Worker
                    </div>
                    <div className="text-lg font-bold">
                      RM{" "}
                      {(
                        calculation.totalAmount /
                        Number.parseInt(formData.numberOfWorkers)
                      ).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Levy Only
                    </div>
                    <div className="text-lg font-bold">
                      RM {calculation.totalLevy.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Ready to Calculate</h3>
                <p className="text-muted-foreground text-center">
                  Fill in the form to calculate government levy for your foreign
                  workers
                </p>
              </CardContent>
            </Card>
          )}

          {/* Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Levy rates are subject to change based on Malaysian government
                  policies. Please verify current rates with official sources.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h4 className="font-medium">Current Levy Rates (2024)</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Manufacturing (Skilled):</span>
                    <Badge variant="outline">RM 1,850</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Manufacturing (Semi/Unskilled):</span>
                    <Badge variant="outline">RM 2,500</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Plantation (All levels):</span>
                    <Badge variant="outline">RM 1,500</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Additional Fees</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <Badge variant="outline">RM 500</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Renewal Fee:</span>
                    <Badge variant="outline">RM 300</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
