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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Plus,
  Download,
  Home,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  MapPin,
  Phone,
  FileText,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function AccommodationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock accommodation data
  const accommodations = [
    {
      id: "A001",
      name: "Hostel Block A",
      type: "hostel",
      address: "Jalan Industri 15, Shah Alam",
      capacity: 50,
      currentOccupancy: 45,
      complianceStatus: "compliant",
      lastInspectionDate: "2024-01-15",
      nextInspectionDue: "2024-04-15",
      monthlyRent: 150,
      managerName: "Ahmad Zaki",
      managerPhone: "+60123456789",
      inspectionScore: 95,
      issues: [],
    },
    {
      id: "A002",
      name: "Apartment Unit 12",
      type: "apartment",
      address: "Jalan Bangsar Utama, KL",
      capacity: 8,
      currentOccupancy: 6,
      complianceStatus: "requires_action",
      lastInspectionDate: "2023-12-01",
      nextInspectionDue: "2024-03-01",
      monthlyRent: 300,
      managerName: "Siti Aminah",
      managerPhone: "+60198765432",
      inspectionScore: 78,
      issues: [
        {
          category: "Safety",
          description: "CCTV system needs repair",
          severity: "medium",
        },
        {
          category: "Maintenance",
          description: "Kitchen ventilation requires cleaning",
          severity: "low",
        },
      ],
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
      case "requires_action":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Requires Action
          </Badge>
        );
      case "non_compliant":
        return <Badge className="bg-red-100 text-red-800">Non-Compliant</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: accommodations.length,
    totalCapacity: accommodations.reduce((sum, a) => sum + a.capacity, 0),
    totalOccupancy: accommodations.reduce(
      (sum, a) => sum + a.currentOccupancy,
      0,
    ),
    compliant: accommodations.filter((a) => a.complianceStatus === "compliant")
      .length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Accommodation Management
          </h1>
          <p className="text-muted-foreground">
            Manage worker housing, compliance inspections, and AKJAS
            requirements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Inspection Report
          </Button>
          <Button asChild>
            <Link href="/dashboard/accommodation/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Accommodation
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Occupancy Rate
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats.totalOccupancy / stats.totalCapacity) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.totalOccupancy} / {stats.totalCapacity}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.compliant}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inspections Due
            </CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">2</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {accommodations.map((accommodation) => (
          <Card key={accommodation.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{accommodation.name}</CardTitle>
                <Badge variant="outline">{accommodation.type}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(accommodation.complianceStatus)}
                <Badge variant="outline" className="text-xs">
                  Score: {accommodation.inspectionScore}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{accommodation.address}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>
                  {accommodation.managerName} - {accommodation.managerPhone}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Occupancy</span>
                  <span>
                    {accommodation.currentOccupancy} / {accommodation.capacity}
                  </span>
                </div>
                <Progress
                  value={
                    (accommodation.currentOccupancy / accommodation.capacity) *
                    100
                  }
                />
              </div>

              {accommodation.issues.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-red-600">
                    Issues ({accommodation.issues.length})
                  </div>
                  <div className="space-y-1">
                    {accommodation.issues.slice(0, 2).map((issue, index) => (
                      <div
                        key={index}
                        className="text-xs text-muted-foreground"
                      >
                        • {issue.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    Next Inspection:
                  </span>
                  <br />
                  <span>{accommodation.nextInspectionDue}</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/accommodation/${accommodation.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href={`/dashboard/accommodation/${accommodation.id}/edit`}
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
