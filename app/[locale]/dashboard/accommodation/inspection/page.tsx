"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Camera,
  FileText,
  MapPin,
  Users,
  Calendar,
  Upload,
} from "lucide-react";

export default function InspectionPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [checklist, setChecklist] = useState<
    Record<string, Record<string, boolean>>
  >({
    safety: {},
    hygiene: {},
    capacity: {},
    facilities: {},
  });

  const inspectionSections = [
    {
      id: "safety",
      title: "Safety & Security",
      icon: Shield,
      items: [
        {
          id: "fire_extinguisher",
          text: "Fire extinguishers present and functional",
          required: true,
        },
        {
          id: "emergency_exits",
          text: "Emergency exits clearly marked and accessible",
          required: true,
        },
        {
          id: "first_aid",
          text: "First aid kit available and stocked",
          required: true,
        },
        {
          id: "security_locks",
          text: "Proper locks on doors and windows",
          required: false,
        },
        {
          id: "lighting",
          text: "Adequate lighting in all areas",
          required: true,
        },
      ],
    },
    {
      id: "hygiene",
      title: "Hygiene & Sanitation",
      icon: CheckCircle,
      items: [
        {
          id: "clean_toilets",
          text: "Clean and functional toilet facilities",
          required: true,
        },
        {
          id: "water_supply",
          text: "Clean water supply available",
          required: true,
        },
        {
          id: "waste_disposal",
          text: "Proper waste disposal system",
          required: true,
        },
        {
          id: "pest_control",
          text: "No signs of pest infestation",
          required: true,
        },
        {
          id: "ventilation",
          text: "Adequate ventilation in sleeping areas",
          required: true,
        },
      ],
    },
    {
      id: "capacity",
      title: "Capacity & Space",
      icon: Users,
      items: [
        {
          id: "occupancy_limit",
          text: "Within legal occupancy limits",
          required: true,
        },
        {
          id: "bed_space",
          text: "Minimum 3x6 feet per bed space",
          required: true,
        },
        {
          id: "storage_space",
          text: "Adequate personal storage for each worker",
          required: false,
        },
        {
          id: "common_area",
          text: "Common area available for workers",
          required: false,
        },
      ],
    },
    {
      id: "facilities",
      title: "Facilities & Amenities",
      icon: MapPin,
      items: [
        {
          id: "cooking_area",
          text: "Designated cooking/dining area",
          required: true,
        },
        {
          id: "laundry",
          text: "Laundry facilities available",
          required: false,
        },
        {
          id: "recreation",
          text: "Recreation area or TV available",
          required: false,
        },
        {
          id: "internet",
          text: "Internet/WiFi access provided",
          required: false,
        },
      ],
    },
  ];

  const handleChecklistChange = (
    sectionId: string,
    itemId: string,
    checked: boolean,
  ) => {
    setChecklist((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        [itemId]: checked,
      },
    }));
  };

  const getCompletionPercentage = () => {
    const totalItems = inspectionSections.reduce(
      (sum, section) => sum + section.items.length,
      0,
    );
    const completedItems = Object.values(checklist).reduce(
      (sum, section) => sum + Object.values(section).filter(Boolean).length,
      0,
    );
    return Math.round((completedItems / totalItems) * 100);
  };

  const getComplianceScore = () => {
    const requiredItems = inspectionSections.reduce(
      (sum, section) =>
        sum + section.items.filter((item) => item.required).length,
      0,
    );
    const completedRequired = inspectionSections.reduce(
      (sum, section) =>
        sum +
        section.items.filter(
          (item) => item.required && checklist[section.id]?.[item.id],
        ).length,
      0,
    );
    return Math.round((completedRequired / requiredItems) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Accommodation Inspection
          </h1>
          <p className="text-muted-foreground">
            JTK/Hostel compliance audit checklist
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">Hostel Block A</Badge>
          <Badge variant="outline">15 Workers</Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getCompletionPercentage()}%
            </div>
            <Progress value={getCompletionPercentage()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getComplianceScore()}%
            </div>
            <p className="text-xs text-muted-foreground">Required items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inspector</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">HR Admin</div>
            <p className="text-xs text-muted-foreground">Current user</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {new Date().toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">Inspection date</p>
          </CardContent>
        </Card>
      </div>

      {/* Section Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {inspectionSections.map((section, index) => (
              <div key={section.id} className="flex items-center">
                <Button
                  variant={currentSection === index ? "default" : "outline"}
                  onClick={() => setCurrentSection(index)}
                  className="flex items-center space-x-2"
                >
                  <section.icon className="h-4 w-4" />
                  <span>{section.title}</span>
                </Button>
                {index < inspectionSections.length - 1 && (
                  <div className="w-8 h-1 mx-2 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Section Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {React.createElement(inspectionSections[currentSection].icon, {
              className: "h-5 w-5",
            })}
            <span>{inspectionSections[currentSection].title}</span>
          </CardTitle>
          <CardDescription>
            Complete the inspection checklist for this section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {inspectionSections[currentSection].items.map((item) => (
            <div
              key={item.id}
              className="flex items-start space-x-3 p-3 border rounded-lg"
            >
              <Checkbox
                checked={
                  checklist[inspectionSections[currentSection].id]?.[item.id] ||
                  false
                }
                onCheckedChange={(checked) =>
                  handleChecklistChange(
                    inspectionSections[currentSection].id,
                    item.id,
                    !!checked,
                  )
                }
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{item.text}</span>
                  {item.required && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-1" />
                Photo
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notes and Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Inspection Notes</CardTitle>
          <CardDescription>
            Add observations, issues, or recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes">General Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any observations, issues found, or recommendations..."
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <div className="mt-2">
                <Button variant="outline">
                  <Camera className="mr-2 h-4 w-4" />
                  Upload Photos
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Evidence photos
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="mx-auto h-8 w-8 text-gray-400" />
              <div className="mt-2">
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Documents
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Certificates, permits
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
        >
          Previous Section
        </Button>

        <div className="flex space-x-2">
          <Button variant="outline">Save Draft</Button>

          {currentSection < inspectionSections.length - 1 ? (
            <Button onClick={() => setCurrentSection(currentSection + 1)}>
              Next Section
            </Button>
          ) : (
            <Button>
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Inspection
            </Button>
          )}
        </div>
      </div>

      {/* Compliance Summary */}
      {getCompletionPercentage() > 80 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getComplianceScore() >= 90 ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              )}
              <span>Compliance Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`p-4 rounded-lg ${
                getComplianceScore() >= 90
                  ? "bg-green-50 border-green-200"
                  : "bg-orange-50 border-orange-200"
              } border`}
            >
              <div className="font-medium">
                {getComplianceScore() >= 90 ? "Compliant" : "Action Required"}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {getComplianceScore() >= 90
                  ? "Accommodation meets all required standards"
                  : "Some required items need attention before approval"}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
