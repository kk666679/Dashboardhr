"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Save, UserPlus, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  { id: "personal",    label: "Personal Info" },
  { id: "employment",  label: "Employment" },
  { id: "documents",   label: "Documents" },
  { id: "review",      label: "Review" },
];

export default function NewEmployeePage() {
  const router  = useRouter();
  const params  = useParams();
  const locale  = (params?.locale as string) || "en";
  const [step, setStep]       = useState(0);
  const [saving, setSaving]   = useState(false);

  const canProceed = step < STEPS.length - 1;
  const isLast     = step === STEPS.length - 1;

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    toast.success("Employee created successfully");
    router.push(`/${locale}/dashboard/employees`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2" onClick={() => router.back()}>
          <ArrowLeft className="size-3.5" />Back
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">New Employee</h1>
          <p className="text-sm text-[var(--foreground-muted)]">Complete all steps to onboard a new employee</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center justify-center size-7 rounded-full text-xs font-semibold transition-colors ${
                i < step ? "bg-[var(--success)] text-white cursor-pointer" :
                i === step ? "bg-[var(--brand)] text-white" :
                "bg-[var(--surface-2)] text-[var(--foreground-muted)] cursor-default"
              }`}
            >
              {i < step ? <CheckCircle className="size-4" /> : i + 1}
            </button>
            <span className={`text-xs hidden sm:block ${i === step ? "font-semibold text-[var(--foreground)]" : "text-[var(--foreground-muted)]"}`}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && <div className="h-px w-6 bg-[var(--border)] mx-1" />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{STEPS[step].label}</CardTitle>
          <CardDescription>Step {step + 1} of {STEPS.length}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { id: "firstName",   label: "First Name *",   placeholder: "Ahmad" },
                { id: "lastName",    label: "Last Name *",    placeholder: "Rizal" },
                { id: "email",       label: "Email *",        placeholder: "ahmad@company.com" },
                { id: "phone",       label: "Phone",          placeholder: "+60 12 345 6789" },
                { id: "icNo",        label: "IC / NRIC",      placeholder: "800101-14-5678" },
                { id: "dateOfBirth", label: "Date of Birth",  placeholder: "1980-01-01", type: "date" },
              ].map((f) => (
                <div key={f.id} className="space-y-1.5">
                  <Label htmlFor={f.id} className="text-xs">{f.label}</Label>
                  <Input id={f.id} placeholder={f.placeholder} type={(f as any).type ?? "text"} className="h-8 text-sm" />
                </div>
              ))}
              <div className="space-y-1.5">
                <Label className="text-xs">Nationality *</Label>
                <Select>
                  <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    {["Malaysian","Indonesian","Bangladeshi","Nepalese","Myanmar","Vietnamese","Other"].map((n) => (
                      <SelectItem key={n} value={n.toLowerCase()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Gender</Label>
                <Select>
                  <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { id: "position",   label: "Position *",    placeholder: "Production Operator" },
                { id: "department", label: "Department *",  placeholder: "Manufacturing" },
                { id: "hireDate",   label: "Hire Date *",   placeholder: "", type: "date" },
                { id: "salary",     label: "Basic Salary *",placeholder: "1500.00", type: "number" },
              ].map((f) => (
                <div key={f.id} className="space-y-1.5">
                  <Label htmlFor={f.id} className="text-xs">{f.label}</Label>
                  <Input id={f.id} placeholder={f.placeholder} type={(f as any).type ?? "text"} className="h-8 text-sm" />
                </div>
              ))}
              <div className="space-y-1.5">
                <Label className="text-xs">Employment Type *</Label>
                <Select>
                  <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    {["Permanent","Contract","Probation","Temporary","Intern"].map((t) => (
                      <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <Select>
                  <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    {["Local","Foreign Worker","Expatriate","Contractor","Part-time"].map((c) => (
                      <SelectItem key={c} value={c.toLowerCase().replace(" ","-")}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <div className="rounded-xl border-2 border-dashed border-[var(--border)] p-8 w-full">
                <UserPlus className="size-8 mx-auto mb-2 text-[var(--foreground-subtle)]" />
                <p className="text-sm font-medium">Upload Identity Documents</p>
                <p className="text-xs text-[var(--foreground-muted)] mt-1">IC/MyKad, passport, and other required documents</p>
                <Button size="sm" variant="outline" className="mt-3 text-xs" onClick={() => toast.info("File picker")}>
                  Choose Files
                </Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <div className="rounded-xl border bg-[var(--surface-1)] p-4 space-y-2">
                <p className="text-sm font-semibold">Review Details</p>
                <p className="text-xs text-[var(--foreground-muted)]">Please review all information before submitting. You can go back to edit any step.</p>
                {STEPS.slice(0, -1).map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                    <span className="text-xs font-medium">{s.label}</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setStep(i)}>Edit</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => step > 0 ? setStep(s => s - 1) : router.back()} className="gap-1.5">
          <ArrowLeft className="size-3.5" />{step > 0 ? "Previous" : "Cancel"}
        </Button>
        {isLast ? (
          <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={saving}>
            {saving ? <div className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Save className="size-3.5" />}
            {saving ? "Saving…" : "Create Employee"}
          </Button>
        ) : (
          <Button size="sm" className="gap-1.5" onClick={() => setStep(s => s + 1)}>
            Next <ArrowRight className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
