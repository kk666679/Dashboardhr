'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle, CheckCircle, Calendar, Stethoscope, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface VisaStatusCardProps {
  expatriateId: string;
  visaType: string;
  expiryDate: string | Date;
  medicalExamDue?: string | Date;
  status: 'active' | 'expiring_soon' | 'expired';
  permitNumber?: string;
  onRenewal?: () => void;
}

function parseDate(value: string | Date) {
  return value instanceof Date ? value : new Date(value);
}

export function VisaStatusCard({
  expatriateId,
  visaType,
  expiryDate,
  medicalExamDue,
  status,
  permitNumber,
  onRenewal,
}: VisaStatusCardProps) {
  const today = new Date();
  const parsedExpiryDate = parseDate(expiryDate);
  const daysUntilExpiry = Math.floor((parsedExpiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const percentageRemaining = Math.max(0, Math.min(100, (daysUntilExpiry / 365) * 100));

  const getStatusColor = () => {
    if (status === 'expired') return 'destructive';
    if (status === 'expiring_soon') return 'destructive';
    return 'success';
  };

  const getStatusIcon = () => {
    if (status === 'expired') return <AlertTriangle className="h-5 w-5" />;
    if (status === 'expiring_soon') return <Clock className="h-5 w-5" />;
    return <CheckCircle className="h-5 w-5" />;
  };

  const getStatusLabel = () => {
    if (status === 'expired') return 'Expired';
    if (status === 'expiring_soon') return 'Expiring Soon';
    return 'Active';
  };

  const parsedMedicalExamDue = medicalExamDue ? parseDate(medicalExamDue) : undefined;
  const medicalExamDaysUntilDue = parsedMedicalExamDue
    ? Math.floor((parsedMedicalExamDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{visaType}</CardTitle>
            {permitNumber && <CardDescription>Permit: {permitNumber}</CardDescription>}
          </div>
          <Badge variant={getStatusColor()}>
            <span className="flex items-center gap-1">
              {getStatusIcon()}
              {getStatusLabel()}
            </span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Expiry Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Days Until Expiry</label>
            <span className="text-sm font-semibold">{daysUntilExpiry} days</span>
          </div>
          <Progress value={percentageRemaining} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Expires on {parsedExpiryDate.toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>

        {/* Medical Exam Status */}
        {medicalExamDue && (
          <div className="flex items-start gap-3 p-3 rounded-md bg-blue-50 dark:bg-blue-950">
            <Stethoscope className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Medical Exam Status</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {medicalExamDaysUntilDue && medicalExamDaysUntilDue > 0
                  ? `Due in ${medicalExamDaysUntilDue} days`
                  : medicalExamDaysUntilDue && medicalExamDaysUntilDue <= 0
                    ? `Overdue by ${Math.abs(medicalExamDaysUntilDue)} days`
                    : 'Schedule required'}
              </p>
            </div>
          </div>
        )}

        {/* Alert Messages */}
        {status === 'expired' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This visa/permit has expired. Immediate renewal action required to maintain compliance.
            </AlertDescription>
          </Alert>
        )}

        {status === 'expiring_soon' && (
          <Alert variant="default">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Visa/permit expires within 30 days. Start renewal process now to avoid gaps in employment authorization.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant={status === 'active' ? 'outline' : 'default'}
            size="sm"
            className="flex-1"
            onClick={onRenewal}
            asChild={!onRenewal}
          >
            {onRenewal ? (
              <>
                <RefreshCw className="h-4 w-4 mr-1" />
                Renew
              </>
            ) : (
              <Link href={`/dashboard/expatriates/${expatriateId}/visa-renewal`}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Renew
              </Link>
            )}
          </Button>
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/dashboard/expatriates/${expatriateId}`}>
              <Calendar className="h-4 w-4 mr-1" />
              Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
