"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutomationNavigation } from "@/components/features/automation/navigation";
import { QMSDashboard } from "@/components/features/automation/QMS/QMSDashboard";
import { AuditList } from "@/components/features/automation/QMS/AuditList";
import { AuditForm } from "@/components/features/automation/QMS/AuditForm";
import { CAPAList } from "@/components/features/automation/QMS/CAPAList";
import { NonConformanceList } from "@/components/features/automation/QMS/NonConformanceList";
import { DocumentList } from "@/components/features/automation/QMS/DocumentList";
import { RiskAssessmentTool } from "@/components/features/automation/QMS/RiskAssessmentTool";
import { TrainingRecordList } from "@/components/features/automation/QMS/TrainingRecordList";
import { ISOComplianceChecker } from "@/components/features/automation/QMS/ISOComplianceChecker";
import { ProcessFlowDesigner } from "@/components/features/automation/QMS/ProcessFlowDesigner";
import { QMSGenerator } from "@/components/features/automation/QMS/QMSGenerator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function QMSInner() {
  const [newAuditOpen, setNewAuditOpen] = useState(false);
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") ?? "dashboard";

  return (
    <div className="space-y-6">
      <AutomationNavigation />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Management System</h1>
          <p className="text-muted-foreground">ISO-aligned quality controls, audits, and corrective actions</p>
        </div>
        <Button onClick={() => setNewAuditOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Audit
        </Button>
      </div>

      <Tabs defaultValue={initialTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
          <TabsTrigger value="capa">CAPA</TabsTrigger>
          <TabsTrigger value="nonconformance">Non-Conformance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="training">Training Records</TabsTrigger>
          <TabsTrigger value="compliance">ISO Compliance</TabsTrigger>
          <TabsTrigger value="process">Process Designer</TabsTrigger>
          <TabsTrigger value="generator">Document Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-4">
          <QMSDashboard />
        </TabsContent>
        <TabsContent value="audits" className="mt-4">
          <AuditList audits={[]} />
        </TabsContent>
        <TabsContent value="capa" className="mt-4">
          <CAPAList capas={[]} />
        </TabsContent>
        <TabsContent value="nonconformance" className="mt-4">
          <NonConformanceList items={[]} />
        </TabsContent>
        <TabsContent value="documents" className="mt-4">
          <DocumentList documents={[]} />
        </TabsContent>
        <TabsContent value="risk" className="mt-4">
          <RiskAssessmentTool />
        </TabsContent>
        <TabsContent value="training" className="mt-4">
          <TrainingRecordList records={[]} />
        </TabsContent>
        <TabsContent value="compliance" className="mt-4">
          <ISOComplianceChecker items={[]} />
        </TabsContent>
        <TabsContent value="process" className="mt-4">
          <ProcessFlowDesigner />
        </TabsContent>
        <TabsContent value="generator" className="mt-4">
          <QMSGenerator />
        </TabsContent>
      </Tabs>

      <Dialog open={newAuditOpen} onOpenChange={setNewAuditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Audit</DialogTitle>
          </DialogHeader>
          <AuditForm onSuccess={() => setNewAuditOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function QMSPage() {
  return (
    <Suspense fallback={<div className="flex h-40 items-center justify-center text-muted-foreground text-sm">Loading…</div>}>
      <QMSInner />
    </Suspense>
  );
}
