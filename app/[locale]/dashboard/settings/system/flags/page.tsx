"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function FeatureFlagsPage() {
  const utils = trpc.useUtils();
  const { data: flags = [], isLoading } = trpc.featureFlags.list.useQuery();
  const toggle = trpc.featureFlags.setEnabled.useMutation({ onSuccess: () => utils.featureFlags.list.invalidate() });
  const upsert = trpc.featureFlags.upsert.useMutation({ onSuccess: () => utils.featureFlags.list.invalidate() });
  const [draft, setDraft] = useState({ key: "", name: "", description: "", rolloutPercentage: 100 });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Feature flags</h1>
        <p className="text-sm text-muted-foreground">Control tenant-scoped releases and gradual rollouts.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Create flag</CardTitle><CardDescription>Keys are lowercase and immutable after creation.</CardDescription></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="flag-key">Key</Label><Input id="flag-key" value={draft.key} onChange={(event) => setDraft({ ...draft, key: event.target.value })} placeholder="new-onboarding-flow" /></div>
          <div className="space-y-2"><Label htmlFor="flag-name">Name</Label><Input id="flag-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="New onboarding flow" /></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="flag-description">Description</Label><Input id="flag-description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="What this release controls" /></div>
          <div className="space-y-2"><Label htmlFor="flag-rollout">Rollout percentage</Label><Input id="flag-rollout" type="number" min={0} max={100} value={draft.rolloutPercentage} onChange={(event) => setDraft({ ...draft, rolloutPercentage: Number(event.target.value) })} /></div>
          <div className="flex items-end"><Button disabled={!draft.key || !draft.name || upsert.isPending} onClick={() => upsert.mutate({ ...draft, enabled: false, description: draft.description || undefined })}><Plus className="mr-2 size-4" />Create flag</Button></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Tenant flags</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? <p className="text-sm text-muted-foreground">Loading flags…</p> : flags.length === 0 ? <p className="text-sm text-muted-foreground">No feature flags have been created.</p> : (flags as any[]).map((flag: any) => (
            <div key={flag.id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <div><p className="font-medium">{flag.name}</p><p className="font-mono text-xs text-muted-foreground">{flag.key} · {flag.rolloutPercentage}% rollout</p>{flag.description && <p className="mt-1 text-sm text-muted-foreground">{flag.description}</p>}</div>
              <Switch checked={flag.enabled} onCheckedChange={(enabled) => toggle.mutate({ key: flag.key, enabled })} aria-label={`Toggle ${flag.name}`} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
