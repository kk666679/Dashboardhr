'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  MapPin,
  Briefcase,
  DollarSign,
  Home,
  Heart,
  Calendar,
  Phone,
  Mail,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import { VisaStatusCard } from './VisaStatusCard';

interface Visa {
  type: string;
  expiryDate: string | Date;
  permitNumber?: string;
  status: 'active' | 'expiring_soon' | 'expired';
}

interface ExpatriateDetailProps {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  nationality: string;
  passportNumber?: string;
  dateOfBirth?: string | Date;
  hireDate?: string | Date;
  visas: Visa[];
  medicalExamDue?: string | Date;
  accommodation?: {
    address: string;
    city: string;
    state: string;
  };
  allowances?: {
    type: string;
    amount: number;
    currency?: string;
    description?: string;
  }[];
  status: 'active' | 'on_leave' | 'terminated';
  manager?: string;
  onEdit?: () => void;
  onRenewal?: (visaIndex: number) => void;
}

function parseDate(value?: string | Date | null) {
  if (!value) return undefined;
  return value instanceof Date ? value : new Date(value);
}

export function ExpatriateDetail({
  id,
  name,
  email,
  phone,
  position,
  department,
  nationality,
  passportNumber,
  dateOfBirth,
  hireDate,
  visas,
  medicalExamDue,
  accommodation,
  allowances = [],
  status,
  manager,
  onEdit,
  onRenewal,
}: ExpatriateDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const statusConfig = {
    active: { label: 'Active', color: 'bg-green-100 text-green-800' },
    on_leave: { label: 'On Leave', color: 'bg-yellow-100 text-yellow-800' },
    terminated: { label: 'Terminated', color: 'bg-red-100 text-red-800' },
  };

  const parsedHireDate = parseDate(hireDate);
  const parsedDob = parseDate(dateOfBirth);

  const calculateTenure = () => {
    if (!parsedHireDate) {
      return 'N/A';
    }

    const now = new Date();
    const months = (now.getFullYear() - parsedHireDate.getFullYear()) * 12 + (now.getMonth() - parsedHireDate.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years}y ${remainingMonths}m`;
  };

  const totalAllowances = allowances.reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{name}</h1>
                <Badge className={statusConfig[status].color}>{statusConfig[status].label}</Badge>
              </div>
              <p className="text-muted-foreground">
                {position} • {department}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/expatriates/${id}/edit`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/dashboard/expatriates/${id}/documents`}>
                  <FileText className="h-4 w-4 mr-1" />
                  Documents
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nationality</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{nationality}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Passport</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold font-mono">{passportNumber}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tenure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{calculateTenure()}</p>
            <p className="text-xs text-muted-foreground">
              {parsedHireDate
                ? `Since ${parsedHireDate.toLocaleDateString('en-MY', { year: 'numeric', month: 'short' })}`
                : 'Hire date not available'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Visa Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1">
              {visas.some((v) => v.status === 'expired') ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="font-semibold text-red-600">Expired</span>
                </>
              ) : visas.some((v) => v.status === 'expiring_soon') ? (
                <>
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold text-yellow-600">Expiring</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-semibold text-green-600">Valid</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visas">Visas & Permits</TabsTrigger>
          <TabsTrigger value="compensation">Compensation</TabsTrigger>
          <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm mt-1">{email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm mt-1">{phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  <p className="text-sm mt-1">
                    {parsedDob
                      ? parsedDob.toLocaleDateString('en-MY', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'TBD'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reporting Manager</label>
                  <p className="text-sm mt-1">{manager || 'TBD'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visas & Permits Tab */}
        <TabsContent value="visas" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {visas.length > 0 ? (
              visas.map((visa, idx) => (
                <VisaStatusCard
                  key={idx}
                  expatriateId={id}
                  visaType={visa.type}
                  expiryDate={visa.expiryDate}
                  medicalExamDue={medicalExamDue}
                  status={visa.status}
                  permitNumber={visa.permitNumber}
                  onRenewal={() => onRenewal?.(idx)}
                />
              ))
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>No visa/permit records found. Please add visa information.</AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        {/* Compensation Tab */}
        <TabsContent value="compensation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Allowances & Benefits</CardTitle>
              <CardDescription>Total Monthly: RM {totalAllowances.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</CardDescription>
            </CardHeader>
            <CardContent>
              {allowances.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allowances.map((allowance, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{allowance.type}</TableCell>
                        <TableCell>
                          {allowance.currency ? `${allowance.currency} ` : 'RM '}
                          {allowance.amount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>{allowance.description ?? '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">No allowances configured.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accommodation Tab */}
        <TabsContent value="accommodation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accommodation Details</CardTitle>
            </CardHeader>
            <CardContent>
              {accommodation ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{accommodation.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {accommodation.city}, {accommodation.state}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No accommodation information available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
              </div>
              {phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{phone}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
