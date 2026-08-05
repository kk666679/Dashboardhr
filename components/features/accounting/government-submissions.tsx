"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Send,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

export function GovernmentSubmissions() {
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const isLoading = false;
  const submissions = {
    submissions: [
      {
        id: 1,
        type: "epf",
        period: "2024-05",
        status: "submitted",
        amount: 12000,
        submissionDate: "2024-06-10",
      },
      {
        id: 2,
        type: "socso",
        period: "2024-05",
        status: "accepted",
        amount: 3500,
        submissionDate: "2024-06-12",
      },
      {
        id: 3,
        type: "pcb",
        period: "2024-05",
        status: "draft",
        amount: 8500,
        submissionDate: null,
      },
    ],
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "draft":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleGenerateForm = async (type: string) => {
    if (!selectedPeriod) return;

    // Mock form generation
    // removed console.log
    alert(`${type.toUpperCase()} form generated successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Government Submissions</h2>
          <p className="text-gray-600">
            Manage EPF, SOCSO, EIS, and PCB submissions
          </p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024-01">January 2024</SelectItem>
            <SelectItem value="2024-02">February 2024</SelectItem>
            <SelectItem value="2024-03">March 2024</SelectItem>
            <SelectItem value="2024-04">April 2024</SelectItem>
            <SelectItem value="2024-05">May 2024</SelectItem>
            <SelectItem value="2024-06">June 2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="forms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forms">Generate Forms</TabsTrigger>
          <TabsTrigger value="submissions">Submission History</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  EPF Form A
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Monthly EPF contribution form for all employees
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Due Date:</span>
                    <span className="font-medium">15th of next month</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Penalty:</span>
                    <span className="text-red-600">6% per annum</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleGenerateForm("epf")}
                  className="w-full"
                  disabled={!selectedPeriod}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Generate EPF Form
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  SOCSO/EIS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  SOCSO and EIS contribution submission
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Due Date:</span>
                    <span className="font-medium">15th of next month</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Penalty:</span>
                    <span className="text-red-600">10% of contribution</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleGenerateForm("socso")}
                  className="w-full"
                  disabled={!selectedPeriod}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Generate SOCSO Form
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  PCB Form CP39
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Monthly tax deduction form (MTD)
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Due Date:</span>
                    <span className="font-medium">15th of next month</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Penalty:</span>
                    <span className="text-red-600">10% of tax amount</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleGenerateForm("pcb")}
                  className="w-full"
                  disabled={!selectedPeriod}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Generate PCB Form
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading submissions...</div>
              ) : (
                <div className="space-y-3">
                  {submissions?.submissions?.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(submission.status)}
                        <div>
                          <p className="font-medium">
                            {submission.type.toUpperCase()} -{" "}
                            {submission.period}
                          </p>
                          <p className="text-sm text-gray-600">
                            {submission.submissionDate
                              ? `Submitted: ${new Date(submission.submissionDate).toLocaleDateString()}`
                              : "Not submitted"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                        <span className="font-medium">
                          RM {submission.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      No submissions found
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>EPF Submissions</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SOCSO Submissions</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>EIS Submissions</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-600">
                  Pending Action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>PCB Form CP39</span>
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <p className="text-sm text-gray-600">Due: 15 Dec 2024</p>
                  <Button size="sm" className="w-full">
                    Submit Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
