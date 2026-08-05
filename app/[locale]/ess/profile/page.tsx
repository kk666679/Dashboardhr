"use client";
/**
 * ESS Profile page
 * Update contact info, emergency contacts, bank/tax info.
 * Sensitive fields trigger HR-approval workflow.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Shield, Save, Loader2 } from "lucide-react";

export default function EssProfilePage() {
  const { data: profile, isLoading, refetch } = trpc.employee.getProfile.useQuery(
    { id: "me" },
    { enabled: true }
  );
  const updateMut = trpc.employee.updateProfile.useMutation({ onSuccess: () => refetch() });

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyName, setEName] = useState("");
  const [emergencyPhone, setEPhone] = useState("");
  const [emergencyRel, setERel] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateMut.mutateAsync({
        id: "me",
        data: {
          ...(phone ? { phone } : {}),
          ...(address ? { address } : {}),
          ...(emergencyName
            ? {
                emergencyContacts: [
                  { name: emergencyName, phone: emergencyPhone, relationship: emergencyRel },
                ],
              }
            : {}),
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <User className="h-5 w-5 text-primary" /> My Profile
      </h1>

      {/* Current profile info */}
      {profile && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Current Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{profile.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Email</span>
              <span>{profile.email}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Employee Code</span>
              <span className="font-mono text-xs">{profile.employeeCode ?? "Pending"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Department</span>
              <span>{profile.department ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="text-green-600 font-medium">{profile.employmentStatus}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit contact info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Phone className="h-4 w-4" /> Update Contact Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Mobile Phone</Label>
            <Input
              className="mt-1"
              placeholder={profile?.phone ?? "+60 12-345 6789"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Home Address</Label>
            <textarea
              className="mt-1 w-full border rounded px-3 py-2 text-sm resize-none"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Emergency contact */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-500" /> Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <Input
                className="mt-1"
                value={emergencyName}
                onChange={(e) => setEName(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Relationship</Label>
              <Input
                className="mt-1"
                value={emergencyRel}
                onChange={(e) => setERel(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Phone</Label>
            <Input
              className="mt-1"
              value={emergencyPhone}
              onChange={(e) => setEPhone(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Changes to sensitive fields (bank account, tax info) will be routed through an HR approval workflow.
      </p>
    </div>
  );
}
