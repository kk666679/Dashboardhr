"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Globe } from "lucide-react";

export default function NewExpatRelocationPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    expatName: "",
    nationality: "",
    destinationCity: "",
    startDate: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Relocation creation logic via tRPC goes here
    router.push("/dashboard/employees/expatriates");
  };

  return (
    <div className="space-y-6 p-6 max-w-lg">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">New Relocation Package</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Relocation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="expatName">Expatriate Name</Label>
              <Input
                id="expatName"
                value={form.expatName}
                onChange={set("expatName")}
                placeholder="Full name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={form.nationality}
                onChange={set("nationality")}
                placeholder="e.g. Japanese"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="destinationCity">Destination City</Label>
              <Input
                id="destinationCity"
                value={form.destinationCity}
                onChange={set("destinationCity")}
                placeholder="e.g. Kuala Lumpur"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="startDate">Relocation Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={set("startDate")}
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit">Create Package</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/employees/expatriates")}
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
