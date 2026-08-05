"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Building2, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";

const LEVELS = [
  "GROUP",
  "LEGAL_ENTITY",
  "BUSINESS_UNIT",
  "DEPARTMENT",
  "BRANCH",
  "COST_CENTER",
];

export default function NewOrganisationNodePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [code, setCode] = useState("");

  const createNode = trpc.organisation.createNode.useMutation({
    onSuccess: () => router.push("/dashboard/organisation"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !level) return;
    createNode.mutate({ name, level: level as any, code: code || undefined });
  };

  return (
    <div className="space-y-6 p-6 max-w-lg">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">Add Organisation Node</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Node Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Finance Department"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="level">Level</Label>
              <Select value={level} onValueChange={setLevel} required>
                <SelectTrigger id="level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="code">Code (optional)</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. FIN-001"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={createNode.isPending || !name || !level}
              >
                {createNode.isPending ? "Creating…" : "Create Node"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/organisation")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
