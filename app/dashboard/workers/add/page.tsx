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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  User,
  FileText,
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Scan,
  AlertTriangle,
} from "lucide-react";

export default function AddWorkerPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: "Personal Information", icon: User },
    { id: 2, title: "Document Upload", icon: FileText },
    { id: 3, title: "Employment Details", icon: MapPin },
    { id: 4, title: "Review & Submit", icon: CheckCircle },
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    alert("Worker registration submitted successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Worker</h1>
          <p className="text-muted-foreground">
            Register a new foreign worker with complete documentation
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">{step.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-4 ${
                      currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / 4) * 100} className="w-full" />
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Enter worker's personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bangladesh">Bangladesh</SelectItem>
                    <SelectItem value="indonesia">Indonesia</SelectItem>
                    <SelectItem value="nepal">Nepal</SelectItem>
                    <SelectItem value="myanmar">Myanmar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="passportNumber">Passport Number</Label>
                <Input
                  id="passportNumber"
                  placeholder="Enter passport number"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+60123456789" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="worker@email.com" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <CardDescription>
              Upload required documents with OCR processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Button variant="outline">
                    <Scan className="mr-2 h-4 w-4" />
                    Upload Passport
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    OCR will extract data automatically
                  </p>
                </div>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Button variant="outline">
                    <Scan className="mr-2 h-4 w-4" />
                    Upload IC/ID Card
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Auto-verification enabled
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">
                  Immigration Blacklist Check
                </span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                System will automatically verify against Immigration blacklist
                database
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
            <CardDescription>
              Configure work assignment and accommodation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employer">Employer</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abc-construction">
                      ABC Construction Sdn Bhd
                    </SelectItem>
                    <SelectItem value="xyz-services">
                      XYZ Services Sdn Bhd
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" placeholder="e.g., Construction Worker" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contractStart">Contract Start Date</Label>
                <Input id="contractStart" type="date" />
              </div>
              <div>
                <Label htmlFor="contractEnd">Contract End Date</Label>
                <Input id="contractEnd" type="date" />
              </div>
            </div>
            <div>
              <Label htmlFor="accommodation">Accommodation</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Assign accommodation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hostel-a">Hostel Block A</SelectItem>
                  <SelectItem value="hostel-b">Hostel Block B</SelectItem>
                  <SelectItem value="apartment">Apartment Unit 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Submit</CardTitle>
            <CardDescription>
              Verify all information before submission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">
                  Ready for Submission
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                All required information has been collected
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline">Personal Info: Complete</Badge>
              <Badge variant="outline">Documents: Uploaded</Badge>
              <Badge variant="outline">Employment: Configured</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {currentStep < 4 ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Submit Registration
          </Button>
        )}
      </div>
    </div>
  );
}
