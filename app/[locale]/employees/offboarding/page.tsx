"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UserMinus,
  CheckSquare,
  Package,
  MessageSquare,
  CreditCard,
  BookOpen,
  KeyRound,
  Users2,
  Plus,
} from "lucide-react";
import { ClearanceChecklist } from "@/components/features/offboarding/Clearance/ClearanceChecklist";
import { ClearanceTaskList } from "@/components/features/offboarding/Clearance/ClearanceTaskList";
import { AssetReturnForm } from "@/components/features/offboarding/AssetReturn/AssetReturnForm";
import { AssetList } from "@/components/features/offboarding/AssetReturn/AssetList";
import { ExitInterviewForm } from "@/components/features/offboarding/ExitInterview/ExitInterviewForm";
import { ExitInterviewView } from "@/components/features/offboarding/ExitInterview/ExitInterviewView";
import { SettlementForm } from "@/components/features/offboarding/FinalSettlement/SettlementForm";
import { SettlementLineItems } from "@/components/features/offboarding/FinalSettlement/SettlementLineItems";
import { KTPlanForm } from "@/components/features/offboarding/KnowledgeTransfer/KTPlanForm";
import { KTDocumentList } from "@/components/features/offboarding/KnowledgeTransfer/KTDocumentList";
import { RevocationList } from "@/components/features/offboarding/AccessRevocation/RevocationList";
import { RevocationForm } from "@/components/features/offboarding/AccessRevocation/RevocationForm";
import { AlumniProfile } from "@/components/features/offboarding/Alumni/AlumniProfile";

const KPI_CARDS = [
  { label: "Active Off-boardings", value: "7", color: "text-blue-600" },
  { label: "Pending Clearance", value: "3", color: "text-yellow-600" },
  { label: "Assets to Return", value: "12", color: "text-orange-600" },
  { label: "Interviews Due", value: "2", color: "text-red-600" },
];

// Demo termination ID — in production this comes from route params / a selector
const DEMO_TERMINATION_ID = "demo-termination-001";

export default function OffboardingPage() {
  const [revocationOpen, setRevocationOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offboarding</h1>
          <p className="text-muted-foreground">
            Employee exit management — clearance, assets, interviews, and final settlement
          </p>
        </div>
        <Button variant="outline" onClick={() => setRevocationOpen(true)}>
          <KeyRound className="h-4 w-4 mr-2" />
          New Revocation
        </Button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{kpi.label}</div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="clearance">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="clearance">
            <CheckSquare className="h-3.5 w-3.5 mr-1.5" /> Clearance
          </TabsTrigger>
          <TabsTrigger value="assets">
            <Package className="h-3.5 w-3.5 mr-1.5" /> Asset Return
          </TabsTrigger>
          <TabsTrigger value="interview">
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Exit Interview
          </TabsTrigger>
          <TabsTrigger value="settlement">
            <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Final Settlement
          </TabsTrigger>
          <TabsTrigger value="kt">
            <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Knowledge Transfer
          </TabsTrigger>
          <TabsTrigger value="revocation">
            <KeyRound className="h-3.5 w-3.5 mr-1.5" /> Access Revocation
          </TabsTrigger>
          <TabsTrigger value="alumni">
            <Users2 className="h-3.5 w-3.5 mr-1.5" /> Alumni
          </TabsTrigger>
        </TabsList>

        {/* ── Clearance ── */}
        <TabsContent value="clearance" className="mt-4 space-y-4">
          <ClearanceTaskList tasks={[]} instanceId={DEMO_TERMINATION_ID} />
        </TabsContent>

        {/* ── Asset Return ── */}
        <TabsContent value="assets" className="mt-4 space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Asset Return Form</CardTitle>
              </CardHeader>
              <CardContent>
                <AssetReturnForm terminationId={DEMO_TERMINATION_ID} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Asset List</CardTitle>
              </CardHeader>
              <CardContent>
                <AssetList items={[]} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Exit Interview ── */}
        <TabsContent value="interview" className="mt-4 space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Exit Interview</CardTitle>
              </CardHeader>
              <CardContent>
                <ExitInterviewForm terminationId={DEMO_TERMINATION_ID} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Final Settlement ── */}
        <TabsContent value="settlement" className="mt-4 space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Settlement Details</CardTitle>
              </CardHeader>
              <CardContent>
                <SettlementForm terminationId={DEMO_TERMINATION_ID} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
              </CardHeader>
              <CardContent>
                <SettlementLineItems items={[]} total={0} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Knowledge Transfer ── */}
        <TabsContent value="kt" className="mt-4 space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>KT Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <KTPlanForm terminationId={DEMO_TERMINATION_ID} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <KTDocumentList attachments={[]} documentLinks={[]} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Access Revocation ── */}
        <TabsContent value="revocation" className="mt-4">
          <RevocationList revocations={[]} terminationId={DEMO_TERMINATION_ID} />
        </TabsContent>

        {/* ── Alumni ── */}
        <TabsContent value="alumni" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Alumni Network</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Alumni profiles are linked from completed termination records. Select a completed termination to view the alumni profile.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Revocation dialog */}
      <Dialog open={revocationOpen} onOpenChange={setRevocationOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>New Access Revocation</DialogTitle>
          </DialogHeader>
          <RevocationForm
            terminationId={DEMO_TERMINATION_ID}
            onSuccess={() => setRevocationOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
